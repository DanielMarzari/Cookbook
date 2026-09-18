/**
 * Generate the canon module from the authored JSON families.
 *
 * Families live in data/canon/*.json so they can be written by hand or by an
 * agent without anyone editing TypeScript. This turns them into one typed
 * module and refuses to emit anything malformed — a family that fails a check
 * is reported and left out rather than shipped broken.
 *
 * Usage: node scripts/build-canon.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIR = join(process.cwd(), 'data/canon');
const OUT = join(process.cwd(), 'src/data/canon-families.ts');

const problems = [];
const families = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()) {
  let c;
  try {
    c = JSON.parse(readFileSync(join(DIR, file), 'utf8'));
  } catch (e) {
    problems.push(`${file}: not valid JSON — ${e.message}`);
    continue;
  }

  const bad = [];
  for (const k of ['slug', 'name', 'standfirst', 'root']) {
    if (typeof c[k] !== 'string' || !c[k]) bad.push(`missing ${k}`);
  }
  if (!Array.isArray(c.facets) || c.facets.length === 0) bad.push('no facets');
  if (!Array.isArray(c.dishes) || c.dishes.length < 3) bad.push('needs at least 3 dishes');
  if (!Array.isArray(c.nestings) || c.nestings.length === 0) bad.push('no nestings');

  const facetIds = new Set((c.facets ?? []).map((f) => f.id));
  for (const n of c.nestings ?? []) {
    for (const id of n.by ?? []) {
      if (!facetIds.has(id)) bad.push(`nesting "${n.label}" uses unknown facet "${id}"`);
    }
  }

  const names = new Set();
  for (const d of c.dishes ?? []) {
    if (!d.name) bad.push('a dish has no name');
    if (names.has(d.name)) bad.push(`duplicate dish "${d.name}"`);
    names.add(d.name);
    for (const id of Object.keys(d.facets ?? {})) {
      if (!facetIds.has(id)) bad.push(`"${d.name}" uses unknown facet "${id}"`);
    }
  }
  for (const d of c.dishes ?? []) {
    if (d.parent && !names.has(d.parent)) bad.push(`"${d.name}" names a parent that isn't here: "${d.parent}"`);
  }

  // A dish that differs from another in nothing at all is not a separate dish.
  const sig = (d) => (c.facets ?? []).map((f) => (d.facets?.[f.id] ?? []).join('|')).join('~');
  const seen = new Map();
  for (const d of c.dishes ?? []) {
    const s = sig(d);
    if (seen.has(s)) bad.push(`"${d.name}" and "${seen.get(s)}" have identical chips in every dimension`);
    seen.set(s, d.name);
  }

  if (bad.length) {
    problems.push(`${file}:\n    - ${bad.join('\n    - ')}`);
    continue;
  }
  families.push(c);
}

// A dish appearing in two families is fine — mole and mother sauces can both
// claim pipián — but the two entries then have to agree, and nothing else
// checks that. Report them so a contradiction is visible rather than latent.
const appearances = new Map();
for (const c of families) {
  for (const d of c.dishes) {
    const k = d.name.toLowerCase();
    if (!appearances.has(k)) appearances.set(k, []);
    appearances.get(k).push(c.slug);
  }
}
const shared = [...appearances.entries()].filter(([, fams]) => fams.length > 1);
if (shared.length) {
  console.log(`\n${shared.length} dishes are read by more than one family:`);
  for (const [name, fams] of shared) console.log(`  ${name}: ${fams.join(', ')}`);
  console.log('  (expected — each family asks its own questions of the same dish.');
  console.log('   What is not expected is two different dishes sharing a bare name.)');
}

const header = `import type { Canon } from './canon';

/**
 * Generated from data/canon/*.json by scripts/build-canon.mjs — do not edit.
 *
 * Families are authored as data so they can be written or reviewed without
 * touching TypeScript. Run the script after changing any of them.
 */
export const CANON_FAMILIES: Canon[] = `;

writeFileSync(OUT, header + JSON.stringify(families, null, 2) + ';\n');

console.log(`built ${families.length} families -> src/data/canon-families.ts`);
if (problems.length) {
  console.log(`\n${problems.length} rejected:`);
  for (const p of problems) console.log('  ' + p);
  process.exitCode = 1;
}
