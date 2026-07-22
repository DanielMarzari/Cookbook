// Load real recipe co-occurrence into ingredient_cooccur from
// data/ingredient-cooccur.csv (pre-processed from FlavorGraph's Recipe1M NPMI
// edges, filtered to our ingredients). Names are already normalized.
//
// Usage: DATABASE_PATH=./cookbook.local.db node scripts/load-cooccur.mjs
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DATABASE_PATH || process.argv[2] || 'cookbook.db';
const csv = readFileSync(join(__dirname, '..', 'data', 'ingredient-cooccur.csv'), 'utf8');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS ingredient_cooccur (
  name_a TEXT NOT NULL, name_b TEXT NOT NULL, score REAL NOT NULL,
  PRIMARY KEY (name_a, name_b)
);
CREATE INDEX IF NOT EXISTS idx_cooccur_a ON ingredient_cooccur(name_a);
`);

db.exec('DELETE FROM ingredient_cooccur');
const insert = db.prepare('INSERT OR IGNORE INTO ingredient_cooccur (name_a, name_b, score) VALUES (?, ?, ?)');
let rows = 0;
const tx = db.transaction(() => {
  for (const line of csv.split('\n')) {
    if (!line.trim()) continue;
    const [a, b, s] = line.split(',');
    const score = parseFloat(s);
    if (!a || !b || !Number.isFinite(score)) continue;
    insert.run(a, b, score);   // both directions so lookup is order-free
    insert.run(b, a, score);
    rows++;
  }
});
tx();

const total = db.prepare('SELECT COUNT(*) c FROM ingredient_cooccur').get().c;
console.log(`Loaded ${rows} co-occurrence pairs (${total} rows)`);
for (const [x, y] of [['coffee', 'chocolate'], ['orange', 'lemon'], ['tomato', 'basil']]) {
  const r = db.prepare('SELECT score FROM ingredient_cooccur WHERE name_a=? AND name_b=?').get(x, y);
  console.log(`  ${x} + ${y}: ${r ? r.score : '—'}`);
}
db.close();
