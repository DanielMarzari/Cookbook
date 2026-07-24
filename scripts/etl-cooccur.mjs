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

const INPUTS = (process.argv[2] || '').split(',').map((s) => s.trim()).filter(Boolean); // one or more corpora
const DB_PATH = process.argv[3] || 'cookbook.local.db';
const OUT = process.argv[4] || 'data/ingredient-cooccur.csv';
if (INPUTS.length === 0) { console.error('usage: node scripts/etl-cooccur.mjs <file1,file2,…> [db] [out]'); process.exit(1); }

// ── vocabulary: our note_ingredients
const db = new Database(DB_PATH, { readonly: true });
const vocab = db.prepare('SELECT name FROM note_ingredients').all().map((r) => r.name);
db.close();
const canon = new Map();                       // lowercased -> canonical
for (const n of vocab) canon.set(n.toLowerCase(), n.toLowerCase());
// longest first so "olive oil" wins over "olive", "chicken breast" over "chicken"
const byLen = [...canon.keys()].sort((a, b) => b.length - a.length);

const MODIFIERS = /\b(fresh|frozen|dried|ground|chopped|minced|sliced|diced|canned|cooked|raw|whole|large|small|medium|ripe|plain|boneless|skinless|unsalted|salted|low[- ]?fat|reduced[- ]?fat|nonfat|extra[- ]?virgin|virgin|light|dark|hot|cold|warm|sweet|unsweetened|granulated|packed|firmly|freshly|finely|coarsely|thinly|part[- ]?skim|shredded|grated|crushed|halves|halved|pieces|piece|prepared|instant|self[- ]?rising|all[- ]?purpose)\b/g;

// Aliases so non-Western ingredient names reach our (rich) vocabulary. Most gaps
// were spelling / regional / plural, not missing ingredients: British "chilli" vs
// our "chili", Hindi names (jeera→cumin), plurals (curry leaves→curry leaf),
// "peppercorns"→pepper. Applied before the generic matcher.
const ALIASES = new Map(Object.entries({
  chilli: 'chili', chillies: 'chili', 'green chilli': 'chili', 'green chillies': 'chili', 'red chilli': 'chili',
  'red chillies': 'chili', 'dry red chilli': 'chili', 'dry red chillies': 'chili', 'red chilli powder': 'chili',
  'green chilli pepper': 'chili', jalapeno: 'jalapeno',
  curd: 'yogurt', 'plain yogurt': 'yogurt', dahi: 'yogurt',
  'curry leaves': 'curry leaf', 'curry leaf': 'curry leaf', kadi: 'curry leaf',
  peppercorns: 'pepper', 'black peppercorns': 'pepper', 'black pepper': 'pepper', 'whole black pepper': 'pepper',
  cloves: 'clove', laung: 'clove',
  'coriander leaves': 'coriander', cilantro: 'coriander', dhania: 'coriander', 'fresh coriander': 'coriander',
  'methi seeds': 'fenugreek', methi: 'fenugreek', 'fenugreek seeds': 'fenugreek',
  jeera: 'cumin', 'cumin seeds': 'cumin', haldi: 'turmeric', 'turmeric powder': 'turmeric',
  adrak: 'ginger', 'ginger garlic paste': 'garlic', lehsun: 'garlic',
  imli: 'tamarind', 'tamarind paste': 'tamarind', 'tamarind pulp': 'tamarind',
  'coconut milk': 'coconut', 'grated coconut': 'coconut', 'desiccated coconut': 'coconut', 'fresh coconut': 'coconut',
  jaggery: 'sugar', gur: 'sugar', 'palm sugar': 'sugar', 'brown sugar': 'brown sugar',
  'spring onion': 'onion', 'spring onions': 'onion', scallion: 'onion', scallions: 'onion', 'green onion': 'onion',
  capsicum: 'capsicum', 'bell pepper': 'capsicum', 'green bell pepper': 'capsicum', 'red bell pepper': 'capsicum',
  'mustard seeds': 'mustard', rai: 'mustard', 'cardamom pods': 'cardamom', elaichi: 'cardamom',
  'cinnamon stick': 'cinnamon', dalchini: 'cinnamon', 'bay leaf': 'bay leaf', 'bay leaves': 'bay leaf',
  paneer: 'paneer', ghee: 'ghee', 'clarified butter': 'ghee', 'basmati rice': 'rice', 'sesame seeds': 'sesame',
  'soy sauce': 'soy sauce', 'fish sauce': 'fish sauce', 'sesame oil': 'sesame oil', 'star anise': 'star anise',
  lemongrass: 'lemongrass', galangal: 'galangal', 'kaffir lime': 'lime', 'lime juice': 'lime', 'lemon juice': 'lemon',
  peanuts: 'peanut', groundnut: 'peanut', 'peanut butter': 'peanut',
}));

const cache = new Map();
function mapName(raw) {
  if (cache.has(raw)) return cache.get(raw);
  let s = raw.toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9 %-]/g, ' ').replace(/\s+/g, ' ').trim();
  let hit = ALIASES.has(s) ? ALIASES.get(s) : canon.get(s);
  if (!hit) {
    const stripped = s.replace(MODIFIERS, ' ').replace(/\s+/g, ' ').trim();
    hit = ALIASES.has(stripped) ? ALIASES.get(stripped) : canon.get(stripped);
    if (!hit && stripped) {
      // longest vocabulary term appearing as whole words inside the phrase
      for (const v of byLen) {
        if (v.length < 4) continue;
        if (new RegExp(`(^|\\s)${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(stripped)) { hit = v; break; }
      }
    }
  }
  // canonical alias targets must themselves be real vocabulary
  const out = hit && (canon.has(hit)) ? canon.get(hit) : null;
  cache.set(raw, out);
  return out;
}

console.log(`reading ${INPUTS.join(', ')} …`);
const lines = INPUTS.flatMap((f) => fs.readFileSync(f, 'utf8').split('\n'));

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

// ── NPMI, POSITIVE evidence only. Earlier versions also wrote negative scores —
// a "never cooked together" floor AND real negative NPMI. Both were a mistake:
// NPMI goes negative whenever one ingredient is very common and the pair is merely
// rare (corn + white chocolate = -0.13), which is a statistical artifact, not a
// clash. It tanked good-but-uncommon pairings (corn+white chocolate, olive
// oil+miso, chili+chocolate) to ~0. So we now emit ONLY positive association: a
// pair the corpus shows people genuinely cook together more than chance. Absence
// means "unknown, judge by the flavour science", never "clash".
const MIN_ING = 50;                            // ingredient must appear in >=50 recipes
const MIN_PAIR = 5;                            // pair needs >=5 co-occurrences
const MIN_NPMI = 0.03;                          // and a positive association above chance
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
  if (npmi < MIN_NPMI) continue;                // drop negatives / non-associations
  out.push([a, b, +npmi.toFixed(4)]);
}

fs.writeFileSync(OUT, 'name_a,name_b,score\n' + out.map((r) => `${r[0]},${r[1]},${r[2]}`).join('\n') + '\n');
console.log(`\nwrote ${out.length} positive-association pairs -> ${OUT}`);
console.log(`  file size: ${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB`);
