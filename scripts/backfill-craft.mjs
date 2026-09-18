/**
 * Give existing recipes a craft, so the new filter isn't an empty row on the
 * day it ships.
 *
 * Only fills NULLs — a craft you have set by hand is never overwritten, so this
 * is safe to re-run after adding recipes. Pass --dry to see the guesses without
 * writing, and --force only if you genuinely want to redo the lot.
 *
 * The guess is deliberately crude and the point is that it is editable: it
 * reads the title and the method, and where the two disagree the method wins,
 * because "empanada" tells you less about what you'll be doing than "fold the
 * pastry over" does.
 *
 * Usage: node --env-file=.env.local scripts/backfill-craft.mjs [--dry]
 *    or: DATABASE_PATH=./cookbook.local.db node scripts/backfill-craft.mjs
 */
import Database from 'better-sqlite3';
import path from 'path';

// Matching the app: DATABASE_PATH wins, and locally that is cookbook.local.db
// via .env.local. Defaulting to cookbook.db instead would silently write to the
// wrong database and look like the script had done nothing.
const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'cookbook.local.db');
const dry = process.argv.includes('--dry');
const force = process.argv.includes('--force');

/**
 * Hand-checked assignments, gone through one recipe at a time.
 *
 * These win over the patterns below, because a few of them are judgements no
 * rule was ever going to make: almond paste and dulce de leche are Pantry
 * rather than Sweets because you make them to make something else, za'atar is a
 * spice blend rather than a condiment for the same reason, and the whole pizza
 * dough family is Bases — a dough is never dinner, and this one is the stem
 * three branches hang off.
 *
 * Matched case-insensitively on the exact title, and applied on prod as well as
 * locally so both databases end up saying the same thing.
 */
const BY_TITLE = {
  "creamy potato soup with mushroom & pine nuts": "Mains",
  "esquites with cotija & corn yuzu": "Sides",
  "grilled seabass with sea buckthorn hot sauce salsa": "Mains",
  "alfajores": "Baking",
  "almond paste": "Pantry",
  "apple crisp": "Baking",
  "birria de res": "Mains",
  "braciole": "Mains",
  "buko pandan": "Sweets",
  "cannoli filling": "Pantry",
  "cep hummus": "Sides",
  "chicken satti": "Mains",
  "chimichurri": "Condiments",
  "chocolate babka": "Baking",
  "ciabatta bread": "Baking",
  "classic challah": "Baking",
  "classic passover macaroons recipe": "Baking",
  "crème brûlée": "Sweets",
  "crème brûlée — fig leaf": "Sweets",
  "dulce de leche": "Pantry",
  "döner kebab": "Mains",
  "empanadas criollas": "Mains",
  "epityrum": "Condiments",
  "globi": "Sweets",
  "homemade ices": "Bases",
  "homemade ravioli with mushroom garum": "Mains",
  "honey whole wheat challah": "Baking",
  "hot italian sausage": "Pantry",
  "jerusalem bagel recipe": "Baking",
  "lemon buddies": "Sweets",
  "manicotti": "Mains",
  "meatballs": "Mains",
  "meatloaf": "Mains",
  "mud buddies": "Sweets",
  "ny style bagel recipe": "Baking",
  "oatmeal and pumpkin seed praline": "Pantry",
  "peanut butter blossoms": "Baking",
  "pear crisp — mediterranean style": "Baking",
  "pesto": "Condiments",
  "pignoli": "Baking",
  "pizza dough": "Bases",
  "potato soup": "Mains",
  "pumpkin pie": "Baking",
  "rainbow cookies": "Baking",
  "rice crispy treats": "Sweets",
  "roman honey glazed mushrooms": "Sides",
  "roman stuffed dates": "Sides",
  "same-day focaccia": "Baking",
  "sorbet": "Bases",
  "sorbet — apple cider": "Sweets",
  "sourdough": "Baking",
  "steak pizzaiola": "Mains",
  "syrup": "Bases",
  "syrup — fig leaf": "Pantry",
  "the best hamantaschen": "Baking",
  "tiramisu": "Sweets",
  "tiramisu — calabria": "Sweets",
  "tortillas": "Bases",
  "vanilla ice cream": "Bases",
  "viking funeral bread": "Baking",
  "vori vori de carne": "Mains",
  "za'atar": "Pantry",
  "za'atar and olive focaccia": "Baking",
};


/**
 * Ordered — first match wins, so the specific rules come first.
 *
 * These read the TITLE, not the method. A first pass scanned the instructions
 * too and got it badly wrong in both directions: vori vori became Baking
 * because a dumpling is made of dough, and braciole became a Condiment because
 * it is finished in a sauce. A recipe's steps are full of words about other
 * crafts. Its name usually is not.
 */
const TITLE_RULES = [
  ['Baking', /\b(bread|loaf|challah|babka|bagel|focaccia|dough|pizza|pastry|cookies?|biscotti|hamantaschen|macaroons?|alfajores|scones?|muffins?|cake|tart|pie|croissant|brioche|sourdough|crackers?|pita|naan|rolls?)\b/i],
  ['Sweets', /\b(br[ûu]l[ée]e|custard|caramel|dulce de leche|ice cream|sorbet|gelato|pudding|treats|marzipan|almond paste|fudge|candy|flan|halva|pandan)\b/i],
  ['Condiments', /\b(sauce|relish|paste|za'?atar|chimichurri|dressing|vinaigrette|pickles?|jam|preserves?|chutney|epityrum|spice blend|rub)\b/i],
  ['Mains', /\b(kebab|braciole|manicotti|lasagne|lasagna|empanadas?|satti|vori vori|stew|curry|roast|braise|casserole|schnitzel|milanesa)\b/i],
  ['Sides', /\b(salad|slaw|pickled|mushrooms|stuffed dates|greens)\b/i],
];

/**
 * The only method signals trusted at all, and only when the title says nothing.
 * Kneading and proofing mean one thing; "sauce" and "dough" do not.
 */
const BODY_RULES = [
  ['Baking', /\b(knead|bulk ferment|proof(ing)? the dough|shape the loaf|banneton|autolyse)\b/i],
];

const db = new Database(DB_PATH);
const cols = db.prepare('PRAGMA table_info(recipes)').all();
if (!cols.some((c) => c.name === 'craft')) {
  console.error('No craft column yet — start the app once so the migration runs, then re-run this.');
  process.exit(1);
}

const rows = db
  .prepare(
    `SELECT id, title, cuisine_type, instructions, craft
       FROM recipes
      WHERE ${force ? '1=1' : 'craft IS NULL'}`,
  )
  .all();

function guess(r) {
  const title = r.title ?? '';
  const known = BY_TITLE[title.trim().toLowerCase()];
  if (known) return known;
  for (const [craft, re] of TITLE_RULES) if (re.test(title)) return craft;
  const body = (r.instructions ?? '').slice(0, 4000);
  for (const [craft, re] of BODY_RULES) if (re.test(body)) return craft;
  return null;
}

const update = db.prepare('UPDATE recipes SET craft = ? WHERE id = ?');
let set = 0;
const unsure = [];

const run = db.transaction(() => {
  for (const r of rows) {
    const g = guess(r);
    if (!g) {
      unsure.push(r.title);
      continue;
    }
    console.log(`  ${g.padEnd(11)} ${r.title}`);
    if (!dry) update.run(g, r.id);
    set++;
  }
});
run();

console.log(`\n${dry ? 'would set' : 'set'} ${set} of ${rows.length}`);
if (unsure.length) {
  console.log(`\n${unsure.length} left blank — no rule matched, and a wrong guess is worse than none:`);
  for (const t of unsure) console.log('  ' + t);
}
