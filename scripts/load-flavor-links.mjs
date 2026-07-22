// Populate flavor_recipe_links — the single bridge between the flavor research
// domain (note_ingredients) and the recipe domain (recipe_ingredients). We match
// each distinct recipe-ingredient name to a flavor note-ingredient by normalized
// token overlap, preferring the longest matching phrase. The two domains keep
// their own tables/id spaces; this table is the only join between them.
//
// Usage: DATABASE_PATH=./cookbook.local.db node scripts/load-flavor-links.mjs
import Database from 'better-sqlite3';

const DB_PATH = process.env.DATABASE_PATH || process.argv[2] || 'cookbook.db';
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Ensure the bridge table exists (the app also creates it via SCHEMA_SQL on boot).
db.exec(`
CREATE TABLE IF NOT EXISTS flavor_recipe_links (
  note_ingredient_id INTEGER NOT NULL,
  match_name TEXT NOT NULL,
  ingredient_id TEXT,
  PRIMARY KEY (note_ingredient_id, match_name)
);
CREATE INDEX IF NOT EXISTS idx_frl_name ON flavor_recipe_links(match_name);
CREATE INDEX IF NOT EXISTS idx_frl_note ON flavor_recipe_links(note_ingredient_id);
`);

// Words that describe preparation/quantity/quality, not the ingredient itself.
// Stripped before matching so "fresh mint leaves" -> "mint", "minced garlic" -> "garlic".
const STOP = new Set([
  'fresh', 'dried', 'ground', 'chopped', 'minced', 'sliced', 'diced', 'grated', 'shredded',
  'whole', 'halved', 'quartered', 'crushed', 'peeled', 'seeded', 'pitted', 'trimmed',
  'large', 'small', 'medium', 'extra', 'ripe', 'raw', 'cooked', 'frozen', 'canned', 'jarred',
  'organic', 'unsalted', 'salted', 'virgin', 'pure', 'toasted', 'roasted', 'smoked',
  'all', 'purpose', 'all-purpose', 'granulated', 'powdered', 'boneless', 'skinless',
  'of', 'the', 'for', 'and', 'to', 'taste', 'a', 'an', 'plus', 'more', 'or', 'with',
  'cup', 'cups', 'tbsp', 'tsp', 'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons',
  'oz', 'ounce', 'ounces', 'lb', 'lbs', 'pound', 'pounds', 'gram', 'grams', 'g', 'kg', 'ml',
  'finely', 'freshly', 'lightly', 'thinly', 'roughly', 'well', 'about', 'into', 'cut',
  'good', 'quality', 'best', 'nice', 'your', 'favorite', 'favourite', 'optional',
]);

const norm = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')        // drop parentheticals
    .replace(/[^a-z\s-]/g, ' ')        // keep letters, spaces, hyphens
    .replace(/\s+/g, ' ')
    .trim();

const deplural = (w) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);

// Build the note-ingredient lookup: normalized name (and depluralized) -> {id, name}.
const notes = db.prepare('SELECT id, name FROM note_ingredients').all();
const noteByKey = new Map();
for (const n of notes) {
  const k = norm(n.name);
  if (!k) continue;
  if (!noteByKey.has(k)) noteByKey.set(k, n);
  const dk = k.split(' ').map(deplural).join(' ');
  if (!noteByKey.has(dk)) noteByKey.set(dk, n);
}

// Given a recipe-ingredient name, find the best note-ingredient: try progressively
// shorter contiguous phrases (longest wins), matching from the head noun outward.
function matchNote(rawName) {
  const n = norm(rawName);
  if (!n) return null;
  const toks = n.split(' ').filter((t) => t && !STOP.has(t));
  if (toks.length === 0) return null;
  const dtoks = toks.map(deplural);
  // window length from longest to shortest
  for (let len = toks.length; len >= 1; len--) {
    for (let start = 0; start + len <= toks.length; start++) {
      const phrase = toks.slice(start, start + len).join(' ');
      const dphrase = dtoks.slice(start, start + len).join(' ');
      const hit = noteByKey.get(phrase) || noteByKey.get(dphrase);
      if (hit) return hit;
    }
  }
  return null;
}

// Distinct recipe-ingredient names, skipping section headers ("--- Dough ---", "---OR---").
const rows = db
  .prepare(
    `SELECT lower(trim(name)) AS mname, MAX(ingredient_id) AS ingredient_id
     FROM recipe_ingredients
     WHERE name IS NOT NULL AND trim(name) != '' AND name NOT LIKE '---%'
     GROUP BY lower(trim(name))`
  )
  .all();

db.exec('DELETE FROM flavor_recipe_links');
const insert = db.prepare(
  'INSERT OR IGNORE INTO flavor_recipe_links (note_ingredient_id, match_name, ingredient_id) VALUES (?, ?, ?)'
);

let matched = 0;
const unmatched = [];
const tx = db.transaction(() => {
  for (const r of rows) {
    const note = matchNote(r.mname);
    if (note) {
      insert.run(note.id, r.mname, r.ingredient_id || null);
      matched++;
    } else {
      unmatched.push(r.mname);
    }
  }
});
tx();

const linked = db.prepare('SELECT COUNT(*) c FROM flavor_recipe_links').get().c;
console.log(`Recipe ingredient names: ${rows.length}`);
console.log(`Matched to a flavor note-ingredient: ${matched} (${linked} link rows)`);
console.log(`Unmatched: ${unmatched.length}`);
console.log('  e.g.', unmatched.slice(0, 20).join(', '));

// sample: recipes that use both of a demo pair
const sample = db
  .prepare(
    `SELECT n.name FROM flavor_recipe_links l JOIN note_ingredients n ON n.id = l.note_ingredient_id
     GROUP BY l.note_ingredient_id ORDER BY COUNT(*) DESC LIMIT 12`
  )
  .all();
console.log('Most-linked flavor ingredients:', sample.map((s) => s.name).join(', '));
db.close();
