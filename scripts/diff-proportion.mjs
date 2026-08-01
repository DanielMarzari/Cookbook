// Before/after check for proportion weighting (see PlateMember / perceptualWeights
// in src/lib/flavor.ts). Answers three questions:
//   1. does the weighted mean still reduce EXACTLY to the unweighted one when every
//      ingredient is equal? (it must — that's the safety property)
//   2. how far does harmony actually move on real recipes?
//   3. do the computed proportions look sane to a cook?
// Usage: DATABASE_PATH=./cookbook.local.db node scripts/diff-proportion.mjs
import Database from 'better-sqlite3';
import { register } from 'node:module';
register('./alias-loader.mjs', import.meta.url);

const { plateHarmony, plateComplement, plateAffinity, flavorGrams, perceptualWeights } =
  await import('../src/lib/flavor.ts');

const db = new Database(process.env.DATABASE_PATH || 'cookbook.local.db', { readonly: true });

const recipes = db.prepare(
  `SELECT r.id, r.title, COUNT(DISTINCT l.note_ingredient_id) AS mapped
   FROM recipes r
   JOIN recipe_ingredients ri ON ri.recipe_id = r.id
   JOIN flavor_recipe_links l ON l.match_name = lower(trim(ri.name))
   GROUP BY r.id HAVING mapped >= 2 ORDER BY r.title`
).all();

const rowsFor = db.prepare(
  `SELECT n.id, n.name, ri.quantity, ri.unit FROM recipe_ingredients ri
   JOIN flavor_recipe_links l ON l.match_name = lower(trim(ri.name))
   JOIN note_ingredients n ON n.id = l.note_ingredient_id
   WHERE ri.recipe_id = ?`
);

function membersFor(recipeId) {
  const byIng = new Map();
  for (const r of rowsFor.all(recipeId)) {
    const g = flavorGrams(r.quantity, r.unit);
    const cur = byIng.get(r.id);
    if (!cur) byIng.set(r.id, { id: r.id, name: r.name, grams: g });
    else if (g != null) cur.grams = (cur.grams ?? 0) + g;
  }
  const mapped = [...byIng.values()];
  const w = perceptualWeights(mapped.map((m) => m.grams));
  return { mapped, weighted: mapped.map((m, i) => ({ ...m, weight: w[i] })) };
}

// ── 1. safety property: equal weights must reproduce the unweighted number
let broke = 0;
for (const r of recipes) {
  const { mapped } = membersFor(r.id);
  const equal = mapped.map((m) => ({ ...m, weight: 1 / mapped.length }));
  const cache = new Map();
  const checks = [
    [plateHarmony(db, mapped).harmony, plateHarmony(db, equal).harmony],
    [plateComplement(db, mapped), plateComplement(db, equal)],
    [plateAffinity(db, mapped, cache), plateAffinity(db, equal, new Map())],
  ];
  for (const [a, b] of checks) if (a !== b) { broke++; console.log(`  MISMATCH ${r.title}: ${a} vs ${b}`); }
}
console.log(`1. equal-weight identity: ${broke === 0 ? 'HOLDS' : broke + ' MISMATCHES'} across ${recipes.length} recipes\n`);

// ── 2. movement on real recipes
const rows = [];
for (const r of recipes) {
  const { mapped, weighted } = membersFor(r.id);
  const before = plateHarmony(db, mapped).harmony;
  const after = plateHarmony(db, weighted).harmony;
  const known = mapped.filter((m) => m.grams != null).length;
  rows.push({ title: r.title, n: mapped.length, known, before, after, d: after - before });
}
rows.sort((a, b) => Math.abs(b.d) - Math.abs(a.d));
console.log('2. harmony, equal-weight -> by-proportion');
console.log('   recipe                              ings  qty  before  after  delta');
for (const r of rows.slice(0, 15))
  console.log(`   ${r.title.slice(0, 34).padEnd(34)}  ${String(r.n).padStart(4)} ${String(r.known).padStart(4)}  ${String(r.before).padStart(6)} ${String(r.after).padStart(6)}  ${(r.d > 0 ? '+' : '') + r.d}`);
const deltas = rows.map((r) => Math.abs(r.d));
console.log(`   ${rows.length} recipes | mean |delta| ${(deltas.reduce((a, b) => a + b, 0) / rows.length).toFixed(1)} | max ${Math.max(...deltas)} | unchanged ${deltas.filter((d) => d === 0).length}\n`);

// ── 3. eyeball the proportions on the most-moved recipe
const worst = rows[0];
if (worst) {
  const rid = recipes.find((r) => r.title === worst.title).id;
  const { weighted } = membersFor(rid);
  console.log(`3. proportions for "${worst.title}"`);
  for (const m of weighted.sort((a, b) => b.weight - a.weight))
    console.log(`   ${String(Math.round(m.weight * 100)).padStart(3)}%  ${m.name.padEnd(22)} ${m.grams == null ? '(no qty)' : m.grams.toFixed(0) + ' g'}`);
}
db.close();
