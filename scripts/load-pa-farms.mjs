// Load Pennsylvania local-food listings from the USDA Local Food Portal into
// pa_farms, geocoded to ZIP-code centroids (data/pa-zip-centroids.json, built
// from the Census ZCTA gazetteer). Fetches live from USDA at load time.
//
// Usage: DATABASE_PATH=./cookbook.local.db node scripts/load-pa-farms.mjs
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DATABASE_PATH || process.argv[2] || 'cookbook.db';
const centroids = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'pa-zip-centroids.json'), 'utf8'));

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS pa_farms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, category TEXT, city TEXT, street TEXT, zip TEXT,
  phone TEXT, website TEXT, lat REAL, lng REAL
);
CREATE INDEX IF NOT EXISTS idx_pa_farms_cat ON pa_farms(category);
`);

const BASE = 'https://www.usdalocalfoodportal.com/mywp/wp-json/frontend/data_share';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36';
const DIRS = [
  ['farmersmarket', 'Farmers Market'],
  ['csa', 'CSA'],
  ['onfarmmarket', 'On-Farm Market'],
  ['agritourism', 'Agritourism'],
  ['foodhub', 'Food Hub'],
];

const clean = (s) => (typeof s === 'string' ? s.trim() : '') || null;
const zip5 = (z) => (z ? String(z).match(/\d{5}/)?.[0] : null);
const websiteOf = (s) => {
  const v = clean(s);
  if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^www\.|\.(com|org|net|farm|us|co)\b/i.test(v)) return 'http://' + v.replace(/^\/+/, '');
  return null; // some records misuse this field for an address
};
// deterministic small jitter so multiple listings in one ZIP don't stack exactly
const jitter = (seed) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffff;
  return ((h / 0xffff) - 0.5) * 0.018; // ~±1 km
};

async function fetchDir(dir) {
  const res = await fetch(`${BASE}?directory=${dir}&state=Pennsylvania`, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

const rows = [];
let geocoded = 0, missing = 0;
for (const [dir, label] of DIRS) {
  let listings = [];
  try { listings = await fetchDir(dir); } catch (e) { console.warn(`  ! ${dir} fetch failed: ${e.message}`); }
  for (const r of listings) {
    const name = clean(r.Listing_Name);
    if (!name) continue;
    const zip = zip5(r.Location_Zipcode);
    const c = zip && centroids[zip];
    let lat = null, lng = null;
    if (c) { lat = c[0] + jitter(name); lng = c[1] + jitter(name + 'x'); geocoded++; } else missing++;
    rows.push({
      name, category: label,
      city: clean(r.Location_City), street: clean(r.Location_Street), zip,
      phone: clean(r.Contact_Phone), website: websiteOf(r.Media_Website), lat, lng,
    });
  }
  console.log(`  ${label}: ${listings.length}`);
}

db.exec('DELETE FROM pa_farms');
const insert = db.prepare('INSERT INTO pa_farms (name, category, city, street, zip, phone, website, lat, lng) VALUES (@name,@category,@city,@street,@zip,@phone,@website,@lat,@lng)');
const tx = db.transaction((items) => { for (const it of items) insert.run(it); });
tx(rows);

console.log(`\nLoaded ${rows.length} PA listings · geocoded ${geocoded}, no-centroid ${missing}`);
const byCat = db.prepare('SELECT category, COUNT(*) c FROM pa_farms GROUP BY category ORDER BY c DESC').all();
console.log(byCat.map((r) => `${r.category}: ${r.c}`).join(' · '));
db.close();
