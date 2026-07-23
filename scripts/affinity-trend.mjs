// Do great dishes really run HIGH harmony + HIGH complement but LOW affinity?
// Exemplar means alone can't answer it — affinity might just be low for ANY
// combination. So we measure celebrated dishes against a baseline of random
// plates drawn from real cooking ingredients, and compare the distributions.
//
// Usage: node scripts/affinity-trend.mjs [baseURL] [dbPath]
import Database from 'better-sqlite3';

const BASE = process.argv[2] || 'http://localhost:3000';
const DB_PATH = process.argv[3] || 'cookbook.local.db';

const DISHES = {
  'Oysters & mignonette': ['Oyster', 'Shallot', 'Vinegar', 'Pepper'],
  'Buffalo chicken wings': ['Chicken', 'Butter', 'Garlic', 'Pepper', 'Vinegar'],
  'Truffle & bitter greens': ['Truffle', 'Rocket salad', 'Parmesan Cheese', 'Olive', 'Lemon'],
  'Hazelnut-berry baklava': ['Hazelnut', 'Raspberry', 'Honey', 'Cinnamon'],
  'Grilled sea bass salsa': ['Tomato', 'Lime', 'Chili', 'Coriander'],
  'Spinach ricotta ravioli': ['Spinach', 'Mushroom', 'Parmesan Cheese', 'Nutmeg'],
  'Lamb chops, pepper glaze': ['Lamb', 'Pepper', 'Garlic', 'Rosemary'],
  'Herbed feta dip': ['Olive', 'Lemon', 'Dill', 'Garlic'],
  'Potato & pumpkin purée': ['Potato', 'Pumpkin', 'Butter', 'Nutmeg'],
  'Roast chicken, mushroom butter': ['Chicken', 'Mushroom', 'Butter', 'Garlic', 'Thyme'],
  'Muhammara': ['Capsicum', 'Walnut', 'Pomegranate', 'Cumin', 'Garlic'],
  'Tomato & stone-fruit salad': ['Tomato', 'Peach', 'Basil', 'Olive'],
  'Esquites': ['Corn', 'Lime', 'Chili', 'Coriander'],
  'Coq au vin': ['Chicken', 'Red Wine', 'Mushroom', 'Onion', 'Garlic', 'Thyme'],
  'Beef bourguignon': ['Beef', 'Red Wine', 'Mushroom', 'Onion', 'Carrot', 'Garlic', 'Thyme'],
  'Cacio e pepe': ['Parmesan Cheese', 'Pepper'],
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
};

const db = new Database(DB_PATH, { readonly: true });
const findId = db.prepare('SELECT id FROM note_ingredients WHERE name = ? COLLATE NOCASE');

// Baseline pool: ingredients that actually show up in real recipes, so we compare
// against plausible random cooking — not against obscure botanical entries.
const pool = db.prepare(
  `SELECT DISTINCT ni.id, ni.name FROM note_ingredients ni
   JOIN ingredient_cooccur c ON LOWER(ni.name) = c.name_a`
).all();
console.log(`baseline pool: ${pool.length} real cooking ingredients`);

const auth = await fetch(`${BASE}/api/auth`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: 'cookbook2026' }) });
const cookie = (auth.headers.getSetCookie?.() || []).map((c) => c.split(';')[0]).join('; ');
const lab = async (ids) => (await fetch(`${BASE}/api/flavor/lab`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ ids }) })).json();

const stats = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  const sd = Math.sqrt(s.reduce((a, b) => a + (b - mean) ** 2, 0) / s.length);
  return { mean, sd, median: s[Math.floor(s.length / 2)], n: s.length };
};

// 1) celebrated dishes
const ex = { h: [], c: [], a: [], score: [] };
for (const [dish, ings] of Object.entries(DISHES)) {
  const ids = ings.map((n) => findId.get(n)?.id).filter(Boolean);
  if (ids.length < 2) continue;
  const d = await lab(ids);
  if (d.error) continue;
  ex.h.push(d.harmony); ex.c.push(d.complement); ex.a.push(d.affinity); ex.score.push(d.score);
}

// 2) random plates, matched to the exemplars' size distribution
const sizes = Object.values(DISHES).map((v) => v.length);
const rnd = { h: [], c: [], a: [], score: [] };
const N = 60;
for (let i = 0; i < N; i++) {
  const k = sizes[i % sizes.length];
  const picked = new Set();
  while (picked.size < k) picked.add(pool[Math.floor(Math.random() * pool.length)].id);
  const d = await lab([...picked]);
  if (d.error) continue;
  rnd.h.push(d.harmony); rnd.c.push(d.complement); rnd.a.push(d.affinity); rnd.score.push(d.score);
}

const row = (label, e, r) => {
  const E = stats(e), R = stats(r);
  const diff = E.mean - R.mean;
  console.log(`${label.padEnd(11)} celebrated ${E.mean.toFixed(1).padStart(5)} (sd ${E.sd.toFixed(1).padStart(4)})   random ${R.mean.toFixed(1).padStart(5)} (sd ${R.sd.toFixed(1).padStart(4)})   diff ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`);
};
console.log(`\n=== celebrated dishes (n=${ex.h.length}) vs random plates (n=${rnd.h.length}) ===`);
row('Harmony', ex.h, rnd.h);
row('Complement', ex.c, rnd.c);
row('Affinity', ex.a, rnd.a);
row('Score', ex.score, rnd.score);

// Is affinity actually suppressed, or just low everywhere?
const eA = stats(ex.a), rA = stats(rnd.a);
console.log(`\nAffinity read: celebrated ${eA.mean.toFixed(1)} vs random ${rA.mean.toFixed(1)} ` +
  `-> ${eA.mean < rA.mean ? 'celebrated dishes use LESS aroma-overlap than chance' : 'celebrated dishes use MORE aroma-overlap than chance'}`);
console.log(`(harmony diff ${(stats(ex.h).mean - stats(rnd.h).mean).toFixed(1)}, complement diff ${(stats(ex.c).mean - stats(rnd.c).mean).toFixed(1)})`);
db.close();
