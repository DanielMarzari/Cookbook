// Derive the dish-score model by LEARNING WHAT SEPARATES good food from bad.
//
// The first version averaged the Harmony/Complement/Affinity levels of celebrated
// dishes and weighted by those means. That was wrong: a mean says how high an axis
// runs, not whether it distinguishes anything. Measured against random plates,
// complement turned out slightly LOWER in celebrated dishes and affinity slightly
// HIGHER — so weighting by means gave 40% of the score to an axis with ~no
// discriminative power (see scripts/affinity-trend.mjs).
//
// So: fit a logistic regression separating GOOD plates (celebrated dishes) from
// BAD ones (random plates + deliberately clashing combos). The fitted coefficients
// are the weights, and the sigmoid gives a calibrated 0-100 score where clashes
// land low and good food lands high. Classes are balanced so the boundary sits
// between them rather than being dragged by whichever set is larger.
//
// Usage: node scripts/derive-dish-score.mjs [baseURL] [dbPath]
import Database from 'better-sqlite3';

const BASE = process.argv[2] || 'http://localhost:3000';
const DB_PATH = process.argv[3] || 'cookbook.local.db';

// ── GOOD: celebrated dishes (Noma recipes + classics)
const GOOD = {
  'Oysters & mignonette': ['Oyster', 'Shallot', 'Vinegar', 'Pepper'],
  'Shrimp & egg smorrebrod': ['Shrimp', 'Egg', 'Dill', 'Lemon'],
  'Buffalo chicken wings': ['Chicken', 'Butter', 'Garlic', 'Pepper', 'Vinegar'],
  'Truffle & bitter greens': ['Truffle', 'Rocket salad', 'Parmesan Cheese', 'Olive', 'Lemon'],
  'Truffle mac & cheese': ['Truffle', 'Cheddar Cheese', 'Butter', 'Milk'],
  'Hazelnut-berry baklava': ['Hazelnut', 'Raspberry', 'Honey', 'Cinnamon'],
  'Grilled sea bass salsa': ['Tomato', 'Lime', 'Chili', 'Coriander'],
  'Spinach ricotta ravioli': ['Spinach', 'Mushroom', 'Parmesan Cheese', 'Nutmeg'],
  'Mie goreng': ['Egg', 'Garlic', 'Shallot', 'Chili', 'Cabbage'],
  'Lamb chops, pepper glaze': ['Lamb', 'Pepper', 'Garlic', 'Rosemary'],
  'Prawn toast': ['Shrimp', 'Sesame', 'Egg', 'Garlic'],
  'Herbed feta dip': ['Olive', 'Lemon', 'Dill', 'Garlic'],
  'Breakfast tacos': ['Egg', 'Tomato', 'Onion', 'Chili', 'Coriander'],
  'Potato & pumpkin puree': ['Potato', 'Pumpkin', 'Butter', 'Nutmeg'],
  'Fudgy chocolate cookies': ['Chocolate', 'Butter', 'Vanilla', 'Egg'],
  'Roast chicken, mushroom butter': ['Chicken', 'Mushroom', 'Butter', 'Garlic', 'Thyme'],
  'Muhammara': ['Capsicum', 'Walnut', 'Pomegranate', 'Cumin', 'Garlic'],
  'Tomato & stone-fruit salad': ['Tomato', 'Peach', 'Basil', 'Olive'],
  'Nordic rice bowl': ['Rice', 'Egg', 'Mushroom', 'Cabbage', 'Sesame'],
  'Esquites': ['Corn', 'Lime', 'Chili', 'Coriander'],
  'Chocolate mousse & praline': ['Chocolate', 'Hazelnut', 'Egg', 'Vanilla'],
  'Coq au vin': ['Chicken', 'Red Wine', 'Mushroom', 'Onion', 'Garlic', 'Thyme'],
  'Beef bourguignon': ['Beef', 'Red Wine', 'Mushroom', 'Onion', 'Carrot', 'Garlic', 'Thyme'],
  'Cacio e pepe': ['Parmesan Cheese', 'Pepper'],
  'Carbonara': ['Egg', 'Parmesan Cheese', 'Pepper'],
  'Risotto milanese': ['Rice', 'Saffron', 'Parmesan Cheese', 'Butter', 'Onion'],
  'Mole poblano': ['Chocolate', 'Chili', 'Tomato', 'Sesame', 'Cinnamon', 'Garlic'],
  'Pad thai': ['Shrimp', 'Egg', 'Peanut', 'Lime', 'Chili', 'Garlic'],
  'Massaman curry': ['Beef', 'Coconut', 'Peanut', 'Potato', 'Cinnamon', 'Chili'],
  'Bouillabaisse': ['Tomato', 'Fennel', 'Saffron', 'Garlic', 'Orange'],
  'Ratatouille': ['Eggplant', 'Zucchini', 'Tomato', 'Capsicum', 'Onion', 'Garlic', 'Basil'],
  'Caprese': ['Tomato', 'Basil', 'Olive'],
  'French onion soup': ['Onion', 'Beef', 'Cheese', 'Thyme'],
  'Tarte tatin': ['Apple', 'Butter', 'Vanilla', 'Caramel'],
  'Tiramisu': ['Coffee', 'Chocolate', 'Egg', 'Vanilla'],
  'Guacamole': ['Avocado', 'Lime', 'Coriander', 'Onion', 'Chili', 'Tomato'],
  'Pesto': ['Basil', 'Parmesan Cheese', 'Garlic', 'Olive'],
  'Chimichurri': ['Parsley', 'Garlic', 'Vinegar', 'Chili', 'Oregano', 'Olive'],
  // ── DARING but genuinely good: uncommon pairings that work when executed well.
  // Without these the model equates "rarely cooked together" with "bad" and tanks
  // corn+white chocolate to ~4. They teach it that a novel pair with real balance
  // is good, so novelty lands in a respectable middle instead of near zero.
  'Corn & white chocolate': ['Corn', 'White chocolate', 'Butter'],
  'Watermelon feta salad': ['Watermelon', 'Feta', 'Mint', 'Olive'],
  'Strawberry balsamic': ['Strawberry', 'Balsamic vinegar', 'Pepper'],
  'Dark chocolate chili': ['Dark chocolate', 'Chili', 'Cinnamon'],
  'Blue cheese, pear & honey': ['Cheese', 'Pear', 'Honey', 'Walnut'],
  'Miso caramel': ['Miso', 'Caramel', 'Butter'],
  'Bacon & maple': ['Bacon', 'Maple syrup', 'Egg'],
  'Prosciutto & melon': ['Prosciutto', 'Peach'],
  'Apple & cheddar': ['Apple', 'Cheddar Cheese', 'Thyme'],
  'Olive oil & vanilla ice cream': ['Olive oil', 'Vanilla', 'Cream'],
  'Coffee & cardamom': ['Coffee', 'Cardamom', 'Milk'],
  'Goat cheese & beet': ['Cheese', 'Beetroot', 'Walnut', 'Olive'],
};

// ── BAD: deliberately clashing plates. These are the cases the score has to punish.
const CLASH = {
  'Fish + chocolate + banana': ['Fish', 'Chocolate', 'Banana'],
  'Coffee + garlic + strawberry': ['Coffee', 'Garlic', 'Strawberry'],
  'Oyster + vanilla + cinnamon': ['Oyster', 'Vanilla', 'Cinnamon'],
  'Chocolate + onion + fish': ['Chocolate', 'Onion', 'Fish'],
  'Yogurt + beef + orange': ['Yogurt', 'Beef', 'Orange'],
  'Coffee + cheese + lemon': ['Coffee', 'Cheese', 'Lemon'],
  'Chicken + vanilla + vinegar': ['Chicken', 'Vanilla', 'Vinegar'],
  'Pork + banana + mustard': ['Pork', 'Banana', 'Mustard'],
  'Shrimp + chocolate + cinnamon': ['Shrimp', 'Chocolate', 'Cinnamon'],
  'Egg + strawberry + garlic': ['Egg', 'Strawberry', 'Garlic'],
  'Milk + lemon + fish': ['Milk', 'Lemon', 'Fish'],
  'Coffee + tomato + cheese': ['Coffee', 'Tomato', 'Cheese'],
  'Honey + anchovy + mint': ['Honey', 'Anchovy', 'Mint'],
  'Blue cheese + peach + tuna': ['Cheese', 'Peach', 'Tuna'],
  'Vanilla + garlic + shrimp': ['Vanilla', 'Garlic', 'Shrimp'],
  'Cocoa + fish + orange': ['Cocoa', 'Fish', 'Orange'],
  'Mustard + strawberry + lamb': ['Mustard', 'Strawberry', 'Lamb'],
  'Cinnamon + oyster + celery': ['Cinnamon', 'Oyster', 'Celery'],
};

const db = new Database(DB_PATH, { readonly: true });
const findId = db.prepare('SELECT id FROM note_ingredients WHERE name = ? COLLATE NOCASE');
const pool = db.prepare(
  `SELECT DISTINCT ni.id FROM note_ingredients ni JOIN ingredient_cooccur c ON LOWER(ni.name) = c.name_a`
).all().map((r) => r.id);

const auth = await fetch(`${BASE}/api/auth`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'cookbook2026' }) });
const cookie = (auth.headers.getSetCookie?.() || []).map((c) => c.split(';')[0]).join('; ');
const lab = async (ids) => (await fetch(`${BASE}/api/flavor/lab`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ ids }) })).json();

async function measure(dict) {
  const out = [];
  for (const [name, ings] of Object.entries(dict)) {
    const ids = ings.map((n) => findId.get(n)?.id).filter(Boolean);
    if (ids.length < 2) { console.log(`  (skip ${name}: ${ids.length} mapped)`); continue; }
    const d = await lab(ids);
    if (d.error) continue;
    out.push({ name, h: d.harmony, c: d.complement, a: d.affinity, mh: d.minHarmony ?? 0, mc: d.minComplement ?? 0, pv: d.provenPct ?? 0 });
  }
  return out;
}

console.log('measuring celebrated dishes…');
const good = await measure(GOOD);
console.log('measuring deliberate clashes…');
const clash = await measure(CLASH);
console.log('measuring random plates…');
const sizes = Object.values(GOOD).map((v) => v.length);
const random = [];
for (let i = 0; i < 90; i++) {
  const k = sizes[i % sizes.length];
  const picked = new Set();
  while (picked.size < k) picked.add(pool[Math.floor(Math.random() * pool.length)]);
  const d = await lab([...picked]);
  if (!d.error) random.push({ name: `random#${i}`, h: d.harmony, c: d.complement, a: d.affinity, mh: d.minHarmony ?? 0, mc: d.minComplement ?? 0, pv: d.provenPct ?? 0 });
}

// ── The score is a transparent BALANCE + DOCUMENTATION blend, not a fitted
// classifier (DISH_MODEL in src/lib/flavor.ts). We proved our metrics can't tell
// a daring-good pairing from a clash — corn+white chocolate C58 vs fish+chocolate
// C59; honey+anchovy (a clash) even scores HIGHER complement than corn+white
// chocolate — so any classifier that scores clashes low also tanks good-but-novel
// combos. This script now just MEASURES the tiers so we can see the blend behave.
const MODEL = { base: 30, complement: 0.34, provenPct: 0.26, harmony: 0.20, minComplement: 0.10 };
const scoreOf = (r) => Math.max(0, Math.min(100, MODEL.base + MODEL.complement * r.c + MODEL.provenPct * r.pv + MODEL.harmony * r.h + MODEL.minComplement * r.mc));
const mean = (xs) => xs.reduce((a, x) => a + x, 0) / xs.length;

// split good into classics vs the daring examples so we can watch both
const daringNames = new Set(['Corn & white chocolate', 'Watermelon feta salad', 'Strawberry balsamic', 'Dark chocolate chili', 'Blue cheese, pear & honey', 'Miso caramel', 'Bacon & maple', 'Prosciutto & melon', 'Apple & cheddar', 'Olive oil & vanilla ice cream', 'Coffee & cardamom', 'Goat cheese & beet']);
const classics = good.filter((r) => !daringNames.has(r.name));
const daring = good.filter((r) => daringNames.has(r.name));
const report = (label, rows) => {
  const s = rows.map(scoreOf);
  console.log(`\n${label} (n ${rows.length}) — mean ${mean(s).toFixed(0)}, range ${Math.min(...s).toFixed(0)}-${Math.max(...s).toFixed(0)}`);
  rows.map((r, i) => ({ n: r.name, s: s[i] })).sort((a, b) => a.s - b.s).slice(0, 6).forEach((r) => console.log(`   ${r.n.padEnd(30)} ${r.s.toFixed(0)}`));
};
console.log('\n=== dish score tiers under the balance+documentation blend ===');
report('CLASSICS  (proven, want high)', classics);
report('DARING    (uncommon-good, want respectable)', daring);
report('RANDOM    (piles, want middling)', random);
report('CLASH     (want low-ish; some we cannot detect)', clash);

// Compare-shelf exemplars carry their score precomputed, since the client only
// keeps h/c/a for the fingerprint and can't recompute the min-pair terms.
const { writeFileSync } = await import('node:fs');
const shelf = good
  .map((r) => ({ dish: r.name, h: r.h, c: r.c, a: r.a, score: Math.round(scoreOf(r)) }))
  .sort((x, y) => y.score - x.score);
writeFileSync('/tmp/dish-exemplars.json', JSON.stringify(shelf, null, 2));
console.log(`\nwrote ${shelf.length} scored exemplars -> /tmp/dish-exemplars.json`);

const SANITY = {
  'Cacio e pepe (2-ing classic)': ['Parmesan Cheese', 'Pepper'],
  'Chicken + garlic + lemon + thyme': ['Chicken', 'Garlic', 'Lemon', 'Thyme'],
  'Tomato + basil + olive oil': ['Tomato', 'Basil', 'Olive oil'],
  'Beef + red wine + mushroom + onion': ['Beef', 'Red Wine', 'Mushroom', 'Onion'],
  '--- clashes ---': null,
  'Fish + chocolate + banana': ['Fish', 'Chocolate', 'Banana'],
  'Milk + lemon + fish': ['Milk', 'Lemon', 'Fish'],
  'Coffee + garlic + strawberry': ['Coffee', 'Garlic', 'Strawberry'],
  'Honey + anchovy + mint': ['Honey', 'Anchovy', 'Mint'],
};
console.log('\n=== sanity check under the fitted model ===');
for (const [label, ings] of Object.entries(SANITY)) {
  if (!ings) { console.log(`  ${label}`); continue; }
  const ids = ings.map((n) => findId.get(n)?.id).filter(Boolean);
  if (ids.length < 2) continue;
  const d = await lab(ids);
  console.log(`  ${label.padEnd(36)} ${String(Math.round(scoreOf({h:d.harmony,c:d.complement,a:d.affinity,mh:d.minHarmony??0,mc:d.minComplement??0,pv:d.provenPct??0}))).padStart(3)}   (proven ${d.provenPct}%)`);
}
db.close();
