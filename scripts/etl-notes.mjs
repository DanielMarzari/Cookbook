// ETL: FlavorDB2 raw descriptor frequencies -> per-ingredient NOTE PROFILE.
// intensity = TF-IDF (distinctive notes rank high), mapped into 10 flavour families,
// normalised per ingredient to 0-10. Output compact data/flavor-notes.json.
import { readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(process.argv[2] || 'flavordb-raw.json', 'utf8'));
const OUT = process.argv[3] || 'data/flavor-notes.json';

// descriptors that aren't real flavour notes -> drop
const STOP = new Set(['null','odorless','characteristic','mild','faint','very faint','weak','strong',
  'pleasant','typical','sweetish','odourless','slight','none','no odor','no odour','bland','neutral',
  'occasional cresylic-type odor','tasteless','not available','na','n/a','']);

// ordered family rules: descriptor -> first family whose keyword it contains
const FAMILIES = [
  ['Sweet',    ['sweet','sugar','caramel','honey','vanilla','candy','syrup','molasses','butterscotch','marshmallow','confection','jammy','maple']],
  ['Acidic',   ['sour','acid','citrus','lemon','lime','orange','grapefruit','tangy','vinegar','tart','malic','citric','bergamot','mandarin','yuzu']],
  ['Floral',   ['floral','flower','rose','jasmine','violet','lavender','lilac','honeysuckle','elderflower','geranium','blossom','neroli','magnolia']],
  ['Herbal',   ['herbal','herb','mint','menthol','camphor','eucalypt','basil','thyme','sage','rosemary','oregano','anise','fennel','tarragon','medicinal','cooling','balsam','hoppy','terpen','aniseed']],
  ['Vegetal',  ['green','grass','vegetable','leafy','cucumber','pea ','pea-','spinach','asparagus','celery','tomato leaf','bell pepper','cabbage','herbaceous','stemmy','unripe','pod']],
  ['Spice',    ['spic','pepper','clove','cinnamon','nutmeg','ginger','cumin','coriander','cardamom','allspice','mace','mustard','pungent','capsicum','pimento','warm']],
  ['Woody',    ['wood','pine','cedar','oak','resin','sandal','turpentine','forest','bark','fir','piney']],
  ['Earthy',   ['earth','mushroom','musty','moss','soil','dusty','humus','potato','root','mineral','chalk','flint','petrichor','damp','mouldy','moldy']],
  ['Maillard', ['roast','toast','nut','almond','hazelnut','coffee','cocoa','chocolate','bready','biscuit','popcorn','burnt','smok','phenol','grain','cereal','malt','bread']],
  ['Carnal',   ['meat','fat','savory','savoury','umami','broth','cheese','butter','cream','dairy','milk','eggy','egg','ocean','fish','seafood','oily','wax','tallow','animal','sulf','alliaceous','onion','garlic','pungent-sulf']],
];
const FAM_INDEX = Object.fromEntries(FAMILIES.map((f, i) => [f[0], i]));
function familyOf(desc) {
  for (const [name, kws] of FAMILIES) for (const k of kws) if (desc.includes(k)) return name;
  return null; // unmapped -> excluded from the wheel
}

// Light general-knowledge normalization: rename a few technical class-words to
// their common tasting-note equivalent (same flavour family). Standard flavour
// vocabulary, not a copy of any proprietary taxonomy.
const ALIAS = { camphoraceous: 'camphor', diterpene: 'terpene' };
function normalizeDesc(desc) {
  const out = {};
  for (const d in desc) {
    const key = ALIAS[d] || d;
    out[key] = (out[key] || 0) + desc[d];
  }
  return out;
}
for (const e of data) e.desc = normalizeDesc(e.desc);

const N = data.length;
const df = {};
for (const e of data) for (const d in e.desc) if (!STOP.has(d)) df[d] = (df[d] || 0) + 1;

const ingredients = [];
const profile = []; // [ingId, familyIdx, note, intensity(0-10)]
let noteRows = 0;

for (const e of data) {
  const scored = [];
  for (const d in e.desc) {
    // keep clean note words only: no prose phrases, no "…odor/flavor/taste" tails
    if (STOP.has(d) || d.length > 18 || d.includes(',')) continue;
    if (d.split(/\s+/).length > 2) continue;
    if (/\b(odou?r|flavou?r|taste|smell|aroma|note|nuance|character|type|like|ish)\b/.test(d)) continue;
    const fam = familyOf(d);
    if (!fam) continue;
    const tf = e.desc[d] / e.nmol;
    const idf = Math.log(N / (df[d] || 1));
    const score = tf * Math.pow(idf, 1.6);
    scored.push([d, fam, score]);
  }
  if (scored.length === 0) continue;
  scored.sort((a, b) => b[2] - a[2]);
  const top = scored.slice(0, 40);
  const max = top[0][2] || 1;
  ingredients.push([e.id, e.name, e.category]);
  for (const [note, fam, score] of top) {
    const intensity = Math.round((score / max) * 100) / 10; // 0-10, one decimal
    if (intensity < 0.4) continue; // drop trace
    profile.push([e.id, FAM_INDEX[fam], note, intensity]);
    noteRows++;
  }
}

writeFileSync(OUT, JSON.stringify({ families: FAMILIES.map((f) => f[0]), ingredients, profile }));
console.log(`ingredients: ${ingredients.length} | note rows: ${noteRows} | ${(JSON.stringify({ families: FAMILIES.map(f=>f[0]), ingredients, profile }).length / 1e6).toFixed(2)} MB`);

// sample readout
const byId = new Map(ingredients.map((i) => [i[0], i[1]]));
for (const nm of ['Mint', 'Garlic', 'Lemon', 'Coffee']) {
  const ing = ingredients.find((i) => i[1].toLowerCase() === nm.toLowerCase()) || ingredients.find((i) => i[1].toLowerCase().includes(nm.toLowerCase()));
  if (!ing) continue;
  const rows = profile.filter((p) => p[0] === ing[0]).slice(0, 8);
  console.log('\n' + ing[1] + ':', rows.map((r) => `${r[2]}[${FAMILIES[r[1]][0]}] ${r[3]}`).join(', '));
}
