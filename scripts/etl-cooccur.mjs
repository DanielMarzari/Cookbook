// Build a DENSE ingredient co-occurrence table from ~1M Food.com recipes.
//
// Why: the previous table was a 1,595-pair sample over 316 ingredients, so most
// real pairings read as "unproven" — parmesan+pepper was simply absent, which made
// Cacio e pepe score like a clash. Harmony then fell back to a structural
// note-similarity guess, which happily rates fish+chocolate as plausible.
//
// Source: Recipe1M (huggingface.co/datasets/Rajarshi-Roy-research/recipe1m-processed),
// whose ing_text_18k column is a normalised ingredient-name list. 223k recipes.
// (The Food.com mirrors advertise 1M rows but ship ~1.2k real records padded with
// half a million empty lines — checked, discarded.) We derive only aggregate
// statistics, never redistributing recipe text.
// We map those names onto our note_ingredients vocabulary, count co-occurrence,
// and emit NPMI per pair — the same scale the old file used, so realCooccur() and
// the harmony mapping are unchanged.
//
// Crucially we also emit NEGATIVE evidence: pairs of common ingredients that never
// appear together get a floor score. "Never cooked together across a million
// recipes" is the strongest possible signal that two things don't belong, and it's
// exactly what the old data could not express.
//
// Input: one recipe per line, ingredient names separated by '|'.
// Usage: node scripts/etl-cooccur.mjs <recipe-ings.txt> [dbPath] [outCsv]
import fs from 'node:fs';
import readline from 'node:readline';
import Database from 'better-sqlite3';

const CSV = process.argv[2];
const DB_PATH = process.argv[3] || 'cookbook.local.db';
const OUT = process.argv[4] || 'data/ingredient-cooccur.csv';
if (!CSV) { console.error('usage: node scripts/etl-cooccur.mjs <recipes.csv> [db] [out]'); process.exit(1); }

// ── vocabulary: our note_ingredients
const db = new Database(DB_PATH, { readonly: true });
const vocab = db.prepare('SELECT name FROM note_ingredients').all().map((r) => r.name);
db.close();
const canon = new Map();                       // lowercased -> canonical
for (const n of vocab) canon.set(n.toLowerCase(), n.toLowerCase());
// longest first so "olive oil" wins over "olive", "chicken breast" over "chicken"
const byLen = [...canon.keys()].sort((a, b) => b.length - a.length);

const MODIFIERS = /\b(fresh|frozen|dried|ground|chopped|minced|sliced|diced|canned|cooked|raw|whole|large|small|medium|ripe|plain|boneless|skinless|unsalted|salted|low[- ]?fat|reduced[- ]?fat|nonfat|extra[- ]?virgin|virgin|light|dark|hot|cold|warm|sweet|unsweetened|granulated|packed|firmly|freshly|finely|coarsely|thinly|part[- ]?skim|shredded|grated|crushed|halves|halved|pieces|piece|leaves|leaf|prepared|instant|self[- ]?rising|all[- ]?purpose)\b/g;

const cache = new Map();
function mapName(raw) {
  if (cache.has(raw)) return cache.get(raw);
  let s = raw.toLowerCase().replace(/[^a-z0-9 %-]/g, ' ').replace(/\s+/g, ' ').trim();
  let hit = canon.get(s);
  if (!hit) {
    const stripped = s.replace(MODIFIERS, ' ').replace(/\s+/g, ' ').trim();
    hit = canon.get(stripped);
    if (!hit && stripped) {
      // longest vocabulary term appearing as whole words inside the phrase
      for (const v of byLen) {
        if (v.length < 3) continue;
        if (new RegExp(`(^|\\s)${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(stripped)) { hit = v; break; }
      }
    }
  }
  const out = hit || null;
  cache.set(raw, out);
  return out;
}

console.log(`reading ${CSV} …`);
const lines = fs.readFileSync(CSV, 'utf8').split('\n');

const count = new Map();                      // ingredient -> #recipes
const pair = new Map();                       // "a|b" (a<b) -> #recipes
let recipes = 0, mapped = 0, rawSeen = 0;

for (const line of lines) {
  if (!line) continue;
  const list = line.split('|').filter(Boolean);
  if (list.length < 2) continue;
  recipes++;
  rawSeen += list.length;
  const set = new Set();
  for (const raw of list) { const m = mapName(raw); if (m) set.add(m); }
  mapped += set.size;
  const arr = [...set].sort();
  for (const a of arr) count.set(a, (count.get(a) || 0) + 1);
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++) {
      const k = `${arr[i]}|${arr[j]}`;
      pair.set(k, (pair.get(k) || 0) + 1);
    }
  if (recipes % 200000 === 0) console.log(`  ${recipes} recipes…`);
}

console.log(`\nrecipes parsed: ${recipes}`);
console.log(`ingredient mentions: ${rawSeen}, mapped to vocabulary: ${mapped} (${(mapped / rawSeen * 100).toFixed(1)}%)`);
console.log(`distinct vocabulary ingredients seen: ${count.size}`);

// ── NPMI. Only ingredients with enough support are trustworthy.
const MIN_ING = 50;                            // ingredient must appear in >=50 recipes
const MIN_PAIR = 5;                            // pair needs >=5 co-occurrences to be positive evidence
const NEVER = -0.85;                           // floor for "common, but never seen together"
const COMMON = 400;                            // both must be this frequent to assert a negative
const N = recipes;
const keep = [...count.entries()].filter(([, c]) => c >= MIN_ING).map(([k]) => k);
const keepSet = new Set(keep);
console.log(`ingredients with >=${MIN_ING} recipes: ${keep.length}`);

const out = [];
for (const [k, c] of pair) {
  const [a, b] = k.split('|');
  if (!keepSet.has(a) || !keepSet.has(b) || c < MIN_PAIR) continue;
  const pa = count.get(a) / N, pb = count.get(b) / N, pab = c / N;
  const npmi = Math.log(pab / (pa * pb)) / -Math.log(pab);
  out.push([a, b, +npmi.toFixed(4)]);
}
const positives = out.length;

// negative evidence: frequent pairs of frequent ingredients that never co-occur
const common = keep.filter((k) => count.get(k) >= COMMON);
let negatives = 0;
for (let i = 0; i < common.length; i++)
  for (let j = i + 1; j < common.length; j++) {
    const a = common[i] < common[j] ? common[i] : common[j];
    const b = common[i] < common[j] ? common[j] : common[i];
    if (pair.has(`${a}|${b}`)) continue;
    out.push([a, b, NEVER]);
    negatives++;
  }

fs.writeFileSync(OUT, 'name_a,name_b,score\n' + out.map((r) => `${r[0]},${r[1]},${r[2]}`).join('\n') + '\n');
console.log(`\nwrote ${out.length} pairs -> ${OUT}`);
console.log(`  ${positives} measured co-occurrences, ${negatives} "never together" (from ${common.length} common ingredients)`);
console.log(`  file size: ${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB`);
