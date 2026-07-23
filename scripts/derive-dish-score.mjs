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

// ── fit: logistic regression on [h, c, a, minH, minC] scaled to 0-1, balanced.
// The two min terms are the weakest-link signal: they let one terrible pairing
// sink a plate that looks fine on averages.
const FEATS = ['harmony', 'complement', 'affinity', 'minHarmony', 'minComplement', 'provenPct'];
const vec = (r) => [r.h / 100, r.c / 100, r.a / 100, r.mh / 100, r.mc / 100, r.pv / 100];
const bad = [...clash, ...random];
const X = [...good, ...bad].map(vec);
const y = [...good.map(() => 1), ...bad.map(() => 0)];
// Class weights: positives get half the mass, and the negative half is split
// evenly between deliberate clashes and random plates — otherwise the 90 random
// plates drown out the 18 clashes, which are the cases we most need punished.
const sw = [
  ...good.map(() => 0.5 / good.length),
  ...clash.map(() => 0.25 / clash.length),
  ...random.map(() => 0.25 / random.length),
];

// Weights are constrained NON-NEGATIVE. Every axis should indicate quality
// positively; left unconstrained the fit gave minHarmony a negative weight,
// effectively rewarding plates for HAVING a weak pair (it was using mean-minus-min
// as a proxy for ingredient count) and dropping Cacio e pepe to 27.
const D = FEATS.length;
let w = new Array(D).fill(0.5), b = 0;
const lr = 2.0, iters = 60000, l2 = 1e-4, CAP_PROVEN = 2.5;
const sig = (z) => 1 / (1 + Math.exp(-z));
for (let it = 0; it < iters; it++) {
  const g = new Array(D).fill(0); let gb = 0;
  for (let i = 0; i < X.length; i++) {
    let z = b; for (let k = 0; k < D; k++) z += w[k] * X[i][k];
    const e = (sig(z) - y[i]) * sw[i];
    for (let k = 0; k < D; k++) g[k] += e * X[i][k];
    gb += e;
  }
  for (let k = 0; k < D; k++) w[k] = Math.max(0, w[k] - lr * (g[k] + l2 * w[k]));
  // ingredient_cooccur is a truncated top-N partner list (3.2k rows / 370
  // ingredients), so provenPct is sparse: cacio e pepe reads 0% simply because
  // pepper isn't in parmesan's top partners. Informative, but capped so a data
  // artifact can't dominate the score.
  w[5] = Math.min(w[5], CAP_PROVEN);
  b -= lr * gb;
}

const scoreOf = (r) => { const v = vec(r); let z = b; for (let k = 0; k < D; k++) z += w[k] * v[k]; return 100 * sig(z); };
const mean = (xs) => xs.reduce((a, x) => a + x, 0) / xs.length;
const gs = good.map(scoreOf), cs = clash.map(scoreOf), rs = random.map(scoreOf);

// AUC (good vs all bad) — probability a random good dish outranks a random bad one
const bs = [...cs, ...rs];
let wins = 0;
for (const a of gs) for (const bb of bs) wins += a > bb ? 1 : a === bb ? 0.5 : 0;
const auc = wins / (gs.length * bs.length);

const fmean = (rows, k) => (rows.reduce((a, r) => a + r[k], 0) / rows.length).toFixed(1);
console.log('\n=== raw feature means (before fitting) ===');
console.log('               h     c     a    minH  minC  proven%');
for (const [lbl, rows] of [['celebrated', good], ['clash', clash], ['random', random]])
  console.log(`  ${lbl.padEnd(11)} ${fmean(rows,'h').padStart(5)} ${fmean(rows,'c').padStart(5)} ${fmean(rows,'a').padStart(5)} ${fmean(rows,'mh').padStart(5)} ${fmean(rows,'mc').padStart(5)} ${fmean(rows,'pv').padStart(6)}`);
console.log(`\n=== fit (n good ${good.length}, clash ${clash.length}, random ${random.length}) ===`);
FEATS.forEach((f, k) => console.log(`  ${f.padEnd(14)} ${w[k] >= 0 ? ' ' : ''}${w[k].toFixed(3)}`));
console.log(`  intercept      ${b.toFixed(3)}`);
const relSum = w.reduce((a, x) => a + Math.abs(x), 0);
console.log(`relative pull: ${FEATS.map((f, k) => `${f} ${(Math.abs(w[k]) / relSum * 100).toFixed(0)}%`).join('  ')}`);
console.log(`\nmean score — celebrated ${mean(gs).toFixed(1)} | random ${mean(rs).toFixed(1)} | deliberate clashes ${mean(cs).toFixed(1)}`);
console.log(`separation: celebrated - clashes = ${(mean(gs) - mean(cs)).toFixed(1)} points`);
console.log(`AUC (good vs bad): ${auc.toFixed(3)}   [0.5 = coin flip, 1.0 = perfect]`);

console.log('\nlowest-scoring clashes:');
clash.map((r, i) => ({ n: r.name, s: cs[i] })).sort((a, b) => a.s - b.s).slice(0, 6).forEach((r) => console.log(`   ${r.n.padEnd(32)} ${r.s.toFixed(0)}`));
console.log('highest-scoring celebrated:');
good.map((r, i) => ({ n: r.name, s: gs[i] })).sort((a, b) => b.s - a.s).slice(0, 6).forEach((r) => console.log(`   ${r.n.padEnd(32)} ${r.s.toFixed(0)}`));
console.log('lowest-scoring celebrated (should still be respectable):');
good.map((r, i) => ({ n: r.name, s: gs[i] })).sort((a, b) => a.s - b.s).slice(0, 4).forEach((r) => console.log(`   ${r.n.padEnd(32)} ${r.s.toFixed(0)}`));

console.log(`\n>>> paste into src/lib/flavor.ts:`);
console.log(`export const DISH_MODEL = { harmony: ${w[0].toFixed(4)}, complement: ${w[1].toFixed(4)}, affinity: ${w[2].toFixed(4)}, minHarmony: ${w[3].toFixed(4)}, minComplement: ${w[4].toFixed(4)}, provenPct: ${w[5].toFixed(4)}, intercept: ${b.toFixed(4)} };`);

// Compare-shelf exemplars carry their score precomputed, since the client only
// keeps h/c/a for the fingerprint and can't recompute the min-pair terms.
const { writeFileSync } = await import('node:fs');
const shelf = good
  .map((r, i) => ({ dish: r.name, h: r.h, c: r.c, a: r.a, score: Math.round(gs[i]) }))
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
