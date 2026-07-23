// Derive the dish-score model from celebrated dishes (Noma + classics).
// For each dish we resolve its core ingredients to note_ingredients, ask the Lab
// API for the plate's Harmony / Complement / Affinity, then derive:
//   - axis WEIGHTS (what great dishes consistently score high on)
//   - the excellence CEILING (their composite level → 100)
// Prints constants to paste into src/lib/flavor.ts (DISH_WEIGHTS, DISH_CEILING).
//
// Usage: node scripts/derive-dish-score.mjs [baseURL] [dbPath]
import Database from 'better-sqlite3';

const BASE = process.argv[2] || 'http://localhost:3000';
const DB_PATH = process.argv[3] || 'cookbook.local.db';
const PW = 'cookbook2026';

// name → core flavour ingredients (Noma recipes + widely-celebrated classics)
const DISHES = {
  // ── Noma (nomaprojects.com/blogs/recipes)
  'Oysters & mignonette': ['Oyster', 'Shallot', 'Vinegar', 'Pepper'],
  'Shrimp & egg smørrebrød': ['Shrimp', 'Egg', 'Dill', 'Lemon'],
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
  'Potato & pumpkin purée': ['Potato', 'Pumpkin', 'Butter', 'Nutmeg'],
  'Fudgy chocolate cookies': ['Chocolate', 'Butter', 'Vanilla', 'Egg'],
  'Roast chicken, mushroom butter': ['Chicken', 'Mushroom', 'Butter', 'Garlic', 'Thyme'],
  'Muhammara': ['Capsicum', 'Walnut', 'Pomegranate', 'Cumin', 'Garlic'],
  'Tomato & stone-fruit salad': ['Tomato', 'Peach', 'Basil', 'Olive'],
  'Nordic rice bowl': ['Rice', 'Egg', 'Mushroom', 'Cabbage', 'Sesame'],
  'Esquites': ['Corn', 'Lime', 'Chili', 'Coriander'],
  'Chocolate mousse & praline': ['Chocolate', 'Hazelnut', 'Egg', 'Vanilla'],
  // ── classics
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
};

const db = new Database(DB_PATH, { readonly: true });
const findId = db.prepare('SELECT id FROM note_ingredients WHERE name = ? COLLATE NOCASE');

// auth → cookie
const authRes = await fetch(`${BASE}/api/auth`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: PW }) });
const cookie = (authRes.headers.getSetCookie?.() || [authRes.headers.get('set-cookie')]).filter(Boolean).map((c) => c.split(';')[0]).join('; ');

const rows = [];
for (const [dish, ings] of Object.entries(DISHES)) {
  const ids = ings.map((n) => findId.get(n)?.id).filter(Boolean);
  if (ids.length < 2) { console.log(`  (skip ${dish}: only ${ids.length} mapped)`); continue; }
  const res = await fetch(`${BASE}/api/flavor/lab`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ ids }) });
  const d = await res.json();
  if (d.error) { console.log(`  (err ${dish}: ${d.error})`); continue; }
  rows.push({ dish, n: ids.length, H: d.harmony, C: d.complement, A: d.affinity });
}

const mean = (k) => rows.reduce((s, r) => s + r[k], 0) / rows.length;
const mH = mean('H'), mC = mean('C'), mA = mean('A');
const sum = mH + mC + mA;
const w = { harmony: +(mH / sum).toFixed(3), complement: +(mC / sum).toFixed(3), affinity: +(mA / sum).toFixed(3) };
const composite = (r) => w.harmony * r.H + w.complement * r.C + w.affinity * r.A;
const comps = rows.map(composite).sort((a, b) => a - b);
const pct = (p) => comps[Math.min(comps.length - 1, Math.floor(p * comps.length))];
const ceiling = +pct(0.8).toFixed(1);

console.log('\n=== exemplar dishes (' + rows.length + ') ===');
for (const r of rows.sort((a, b) => composite(b) - composite(a))) console.log(`  ${r.dish.padEnd(30)} H${String(r.H).padStart(3)} C${String(r.C).padStart(3)} A${String(r.A).padStart(3)}  → composite ${composite(r).toFixed(1)}`);
console.log(`\nmeans: H=${mH.toFixed(1)} C=${mC.toFixed(1)} A=${mA.toFixed(1)}`);
console.log(`composite spread: min ${comps[0].toFixed(1)} · median ${pct(0.5).toFixed(1)} · p80 ${ceiling} · max ${comps[comps.length - 1].toFixed(1)}`);
console.log(`\n>>> DISH_WEIGHTS = { harmony: ${w.harmony}, complement: ${w.complement}, affinity: ${w.affinity} };`);
console.log(`>>> DISH_CEILING = ${ceiling};`);

// Emit per-dish H/C/A so the UI can show a "compare shelf" of real exemplars.
const { writeFileSync } = await import('node:fs');
const out = rows.map((r) => ({ dish: r.dish, h: r.H, c: r.C, a: r.A })).sort((x, y) => (w.harmony * y.h + w.complement * y.c + w.affinity * y.a) - (w.harmony * x.h + w.complement * x.c + w.affinity * x.a));
writeFileSync('/tmp/dish-exemplars.json', JSON.stringify(out, null, 2));
console.log(`\nwrote ${out.length} exemplars → /tmp/dish-exemplars.json`);
db.close();
