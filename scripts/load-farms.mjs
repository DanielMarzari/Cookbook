// Load US local-food listings from the USDA Local Food Portal into local_farms,
// nationwide, geocoded to ZIP-code centroids (data/us-zip-centroids.json).
// Fetches every state × directory live from USDA (polite concurrency).
//
// Usage: DATABASE_PATH=./cookbook.local.db node scripts/load-farms.mjs
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DATABASE_PATH || process.argv[2] || 'cookbook.db';
const centroids = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'us-zip-centroids.json'), 'utf8'));

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS local_farms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT, category TEXT, state TEXT, city TEXT, street TEXT, zip TEXT,
  phone TEXT, website TEXT, lat REAL, lng REAL
);
CREATE INDEX IF NOT EXISTS idx_local_farms_state ON local_farms(state);
`);

const BASE = 'https://www.usdalocalfoodportal.com/mywp/wp-json/frontend/data_share';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
const DIRS = [['farmersmarket', 'Farmers Market'], ['csa', 'CSA'], ['onfarmmarket', 'On-Farm Market'], ['agritourism', 'Agritourism'], ['foodhub', 'Food Hub']];
const STATES = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
const ABBR = { 'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'District of Columbia': 'DC', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS', 'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY' };

const clean = (s) => (typeof s === 'string' ? s.trim() : '') || null;
const zip5 = (z) => (z ? String(z).match(/\d{5}/)?.[0] : null);
const websiteOf = (s) => {
  const v = clean(s); if (!v) return null;
  if (/^https?:\/\//i.test(v)) return v;
  if (/^www\.|\.(com|org|net|farm|us|co)\b/i.test(v)) return 'http://' + v.replace(/^\/+/, '');
  return null;
};
const jitter = (seed) => { let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffff; return ((h / 0xffff) - 0.5) * 0.02; };

async function fetchDir(dir, state) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`${BASE}?directory=${dir}&state=${encodeURIComponent(state)}`, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch { await new Promise((r) => setTimeout(r, 500 * (attempt + 1))); }
  }
  return [];
}

const rows = [];
let geocoded = 0, missing = 0;
// process states with light concurrency
const CONC = 4;
for (let i = 0; i < STATES.length; i += CONC) {
  const batch = STATES.slice(i, i + CONC);
  await Promise.all(batch.map(async (state) => {
    let stateCount = 0;
    for (const [dir, label] of DIRS) {
      const listings = await fetchDir(dir, state);
      for (const r of listings) {
        const name = clean(r.Listing_Name); if (!name) continue;
        const zip = zip5(r.Location_Zipcode);
        const c = zip && centroids[zip];
        let lat = null, lng = null;
        if (c) { lat = c[0] + jitter(name); lng = c[1] + jitter(name + 'x'); geocoded++; } else missing++;
        rows.push({ name, category: label, state: ABBR[state] || state, city: clean(r.Location_City), street: clean(r.Location_Street), zip, phone: clean(r.Contact_Phone), website: websiteOf(r.Media_Website), lat, lng });
        stateCount++;
      }
    }
    process.stdout.write(`${ABBR[state]}:${stateCount} `);
  }));
}
console.log('');

db.exec('DELETE FROM local_farms');
const insert = db.prepare('INSERT INTO local_farms (name, category, state, city, street, zip, phone, website, lat, lng) VALUES (@name,@category,@state,@city,@street,@zip,@phone,@website,@lat,@lng)');
db.transaction((items) => { for (const it of items) insert.run(it); })(rows);

console.log(`\nLoaded ${rows.length} US listings · geocoded ${geocoded}, no-centroid ${missing}`);
const byState = db.prepare('SELECT state, COUNT(*) c FROM local_farms GROUP BY state ORDER BY c DESC LIMIT 6').all();
console.log('top states:', byState.map((r) => `${r.state}:${r.c}`).join(' · '));
db.close();
