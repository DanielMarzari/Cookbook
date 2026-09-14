/**
 * Generate the foraging module from the approved entries.
 *
 * `approved.json` is the source of truth: an entry only gets there after an
 * independent pass has reviewed it adversarially and signed off. This turns it
 * into the typed module and refuses to emit anything that would break a safety
 * field — the failure mode here is someone eating the wrong thing, so a bad
 * entry has to stop the build rather than ship quietly.
 *
 * Usage: node scripts/build-foraging.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SRC = join(process.cwd(), 'data/foraging-research/approved.json');
const OUT = join(process.cwd(), 'src/data/foraging-species.ts');

const REGIONS = ['all', 'northeast', 'southeast', 'midwest', 'southcentral', 'mountain', 'west'];
const TERRAIN = ['woodland', 'edge', 'wetland', 'meadow', 'disturbed', 'upland', 'coastal'];
const DANGER = ['deadly', 'toxic', 'unpalatable'];
const CAUTION = ['easy', 'care', 'expert'];

const entries = JSON.parse(readFileSync(SRC, 'utf8'));
const problems = [];

const seen = new Set();
for (const e of entries) {
  const bad = [];
  for (const k of ['name', 'scientific', 'habitat', 'parts', 'harvest']) {
    if (typeof e[k] !== 'string' || !e[k].trim()) bad.push(`missing ${k}`);
  }
  if (seen.has(e.name)) bad.push('duplicate name');
  seen.add(e.name);

  if (!Array.isArray(e.months) || !e.months.length) bad.push('no months');
  else if (e.months.some((m) => !Number.isInteger(m) || m < 0 || m > 11)) bad.push('months must be 0-indexed 0..11');

  for (const [key, legal] of [['regions', REGIONS], ['terrain', TERRAIN]]) {
    if (!Array.isArray(e[key]) || !e[key].length) bad.push(`no ${key}`);
    else for (const v of e[key]) if (!legal.includes(v)) bad.push(`${key}: "${v}" is not one of ${legal.join(', ')}`);
  }

  if (!CAUTION.includes(e.caution)) bad.push(`caution "${e.caution}" is not easy | care | expert`);
  if (!Array.isArray(e.sources) || !e.sources.length) bad.push('no sources');

  const looks = Array.isArray(e.lookalikes) ? e.lookalikes : [];
  if (!Array.isArray(e.lookalikes)) bad.push('lookalikes is not a list');
  for (const l of looks) {
    if (!l.name) bad.push('a lookalike has no name');
    if (!DANGER.includes(l.danger)) bad.push(`"${l.name}": danger "${l.danger}" is not deadly | toxic | unpalatable`);
    if (typeof l.tell !== 'string' || l.tell.length < 40) bad.push(`"${l.name}": tell is missing or too thin to use in the field`);
  }
  // The rule the whole guide leans on: a deadly neighbour means expert, always.
  if (looks.some((l) => l.danger === 'deadly') && e.caution !== 'expert') {
    bad.push('has a deadly lookalike but is not rated expert');
  }

  if (bad.length) problems.push(`${e.name}:\n    - ${bad.join('\n    - ')}`);
}

if (problems.length) {
  console.error(`\n${problems.length} entries are not publishable:`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}

const KEYS = ['name', 'scientific', 'months', 'regions', 'terrain', 'habitat', 'indicator', 'parts', 'caution', 'lookalikes', 'harvest', 'sources'];
const ordered = entries
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((e) => Object.fromEntries(KEYS.filter((k) => e[k] !== undefined).map((k) => [k, e[k]])));

const header = `import type { ForageSpecies } from './foraging';

/**
 * Verified foraging entries.
 *
 * Generated from data/foraging-research/approved.json by scripts/build-foraging.mjs
 * — do not edit. Every entry here has been through two independent passes: one that
 * rewrites and corrects it, and one that reviews it adversarially and can block
 * publication. Nothing lands in this file until the second pass approves it, because
 * the failure mode is someone eating the wrong thing, not a bad page.
 *
 * The prose runs long on purpose. \`habitat\` and the lookalike \`tell\` fields carry the
 * detail that makes a call possible in the field; the UI shows a lead sentence on the
 * collapsed row and the full text once you open it.
 */
export const FORAGE_SPECIES: ForageSpecies[] = `;

writeFileSync(OUT, header + JSON.stringify(ordered, null, 2) + ';\n');

const looks = ordered.reduce((n, e) => n + e.lookalikes.length, 0);
const deadly = ordered.reduce((n, e) => n + e.lookalikes.filter((l) => l.danger === 'deadly').length, 0);
console.log(`built ${ordered.length} species, ${looks} lookalikes, ${deadly} deadly -> src/data/foraging-species.ts`);
