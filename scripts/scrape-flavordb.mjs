// One-time pull from FlavorDB2 (cosylab.iiitd.edu.in/flavordb2, free non-commercial,
// Goel et al. J Food Sci 2024 / Garg et al. NAR 2018). For each entity we keep only
// name + category + aggregated flavour-descriptor frequencies across its molecules
// (descriptors already merge FooDB/FlavorNet/FEMA). Facts only, for a note profile.
import { writeFileSync } from 'node:fs';

const MAX_ID = 1000, CONC = 6;
const base = 'https://cosylab.iiitd.edu.in/flavordb2/entities_json?id=';

async function fetchEntity(id) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    const r = await fetch(base + id, { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) return null;
    const j = await r.json();
    if (!j || !j.molecules || j.molecules.length === 0) return null;
    // aggregate descriptor -> #molecules carrying it
    const desc = {};
    for (const m of j.molecules) {
      const set = new Set();
      const add = (s, sep) => { if (s) String(s).split(sep).forEach(d => { const k = d.trim().toLowerCase(); if (k && k !== 'null') set.add(k); }); };
      add(m.flavor_profile, '@');
      add(m.fooddb_flavor_profile, '@');
      add(m.fema_flavor_profile, ',');
      add(m.odor, '@'); add(m.taste, '@');
      for (const k of set) desc[k] = (desc[k] || 0) + 1;
    }
    return {
      id: j.entity_id,
      name: (j.entity_alias_readable || j.entity_alias || '').trim(),
      category: j.category_readable || j.category || '',
      nmol: j.molecules.length,
      desc,
    };
  } catch { return null; }
}

const out = [];
let done = 0;
for (let start = 1; start <= MAX_ID; start += CONC) {
  const batch = [];
  for (let i = start; i < start + CONC && i <= MAX_ID; i++) batch.push(fetchEntity(i));
  const res = await Promise.all(batch);
  for (const e of res) if (e && e.name) out.push(e);
  done += batch.length;
  if (done % 60 === 0) process.stderr.write(`  ...${done}/${MAX_ID} probed, ${out.length} kept\n`);
}

writeFileSync('flavordb-raw.json', JSON.stringify(out));
console.log(`entities kept: ${out.length}`);
const totalDesc = new Set(); out.forEach(e => Object.keys(e.desc).forEach(d => totalDesc.add(d)));
console.log(`distinct descriptors: ${totalDesc.size}`);
const mint = out.find(e => /^mint$|peppermint|spearmint/i.test(e.name));
if (mint) console.log('sample', mint.name + ':', Object.entries(mint.desc).sort((a,b)=>b[1]-a[1]).slice(0,12).map(d=>d[0]+'('+d[1]+')').join(', '));
