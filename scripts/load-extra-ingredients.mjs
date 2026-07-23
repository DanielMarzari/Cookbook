// Add common cooking ingredients that FlavorDB2 lacks (it has base plants like
// Olive / Pine / Cocoa, but not the prepared forms cooks actually reach for).
// Each new ingredient's flavour profile is composed from a weighted blend of
// EXISTING note_profiles, so every note + family stays valid and realistic — no
// hand-invented notes. Idempotent: skips any name already present.
//
// Usage: node scripts/load-extra-ingredients.mjs [dbPath]
import Database from 'better-sqlite3';

const DB_PATH = process.argv[2] || 'cookbook.local.db';

// name → { category, blend of [sourceIngredientName, weight] }
const NEW = {
  'Olive oil':         { cat: 'Plant Derivative', src: [['Olive', 1]] },
  'Sesame oil':        { cat: 'Plant Derivative', src: [['Sesame', 1]] },
  'White chocolate':   { cat: 'Bakery',           src: [['Milk', 1], ['Vanilla', 0.85], ['Butter', 0.5], ['Cocoa', 0.15]] },
  'Dark chocolate':    { cat: 'Plant Derivative', src: [['Cocoa', 1], ['Chocolate', 0.7]] },
  'Pine nuts':         { cat: 'Nut',              src: [['Pistachio', 1], ['Almond', 0.6], ['Pine', 0.2]] },
  'Cashew':            { cat: 'Nut',              src: [['Cashew nut', 1]] },
  'Pecan':             { cat: 'Nut',              src: [['Walnut', 1], ['Almond', 0.4]] },
  'Egg':               { cat: 'Additive',         src: [['Butter', 1], ['Milk', 0.5]] },
  'Egg yolk':          { cat: 'Additive',         src: [['Butter', 1], ['Cream', 0.6]] },
  'Feta':              { cat: 'Dairy',            src: [['Cheese', 1], ['Vinegar', 0.15]] },
  'Ricotta':           { cat: 'Dairy',            src: [['Cheese', 0.7], ['Cream', 0.6], ['Milk', 0.5]] },
  'Mozzarella':        { cat: 'Dairy',            src: [['Cheese', 0.8], ['Milk', 0.6]] },
  'Sour cream':        { cat: 'Dairy',            src: [['Cream', 1], ['Vinegar', 0.15]] },
  'Soy sauce':         { cat: 'Plant Derivative', src: [['Soybean', 1]] },
  'Fish sauce':        { cat: 'Seafood',          src: [['Fish', 1]] },
  'Bacon':             { cat: 'Meat',             src: [['Pork', 1], ['Ham', 0.5]] },
  'Pancetta':          { cat: 'Meat',             src: [['Pork', 1], ['Ham', 0.5]] },
  'Prosciutto':        { cat: 'Meat',             src: [['Ham', 1], ['Pork', 0.5]] },
  'Balsamic vinegar':  { cat: 'Plant Derivative', src: [['Vinegar', 1], ['Sugar', 0.2]] },
  'Maple syrup':       { cat: 'Additive',         src: [['Honey', 1], ['Sugar', 0.3]] },
  'Brown sugar':       { cat: 'Additive',         src: [['Sugar', 1]] },
};

const db = new Database(DB_PATH);
const findId = db.prepare('SELECT id FROM note_ingredients WHERE name = ? COLLATE NOCASE');
const profileOf = db.prepare('SELECT family, note, intensity FROM note_profiles WHERE ingredient_id = ?');
const nextId = () => (db.prepare('SELECT MAX(id) AS m FROM note_ingredients').get().m || 0) + 1;
const insIng = db.prepare('INSERT INTO note_ingredients (id, name, category) VALUES (?, ?, ?)');
const insNote = db.prepare('INSERT INTO note_profiles (ingredient_id, family, note, intensity) VALUES (?, ?, ?, ?)');

let added = 0, skipped = 0;
const tx = db.transaction(() => {
  for (const [name, def] of Object.entries(NEW)) {
    if (findId.get(name)) { skipped++; continue; }
    // merge source profiles: accumulate weighted intensity per note, keep its family
    const merged = new Map(); // note -> { family, intensity }
    for (const [srcName, w] of def.src) {
      const src = findId.get(srcName);
      if (!src) { console.log(`  ! missing source "${srcName}" for ${name}`); continue; }
      for (const r of profileOf.all(src.id)) {
        const cur = merged.get(r.note);
        if (cur) cur.intensity += r.intensity * w;
        else merged.set(r.note, { family: r.family, intensity: r.intensity * w });
      }
    }
    if (merged.size === 0) { console.log(`  ! no profile composed for ${name}`); continue; }
    // normalise so the strongest note peaks at 10 (matches source scale)
    const max = Math.max(...[...merged.values()].map((v) => v.intensity)) || 1;
    const id = nextId();
    insIng.run(id, name, def.cat);
    for (const [note, v] of merged) insNote.run(id, v.family, note, +(v.intensity / max * 10).toFixed(2));
    added++;
    console.log(`  + ${name} (id ${id}) — ${merged.size} notes from ${def.src.map((s) => s[0]).join(' + ')}`);
  }
});
tx();

console.log(`\nDone: ${added} added, ${skipped} already present. Total ingredients: ${db.prepare('SELECT COUNT(*) AS c FROM note_ingredients').get().c}`);
db.close();
