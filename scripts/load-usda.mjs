#!/usr/bin/env node
// Load the compact USDA SR Legacy dataset (data/usda-foods.json) into the
// usda_foods + usda_fts tables. Idempotent: clears and reloads each run.
//
// Usage:
//   node scripts/load-usda.mjs [path-to-db] [path-to-json]
// Defaults: $DATABASE_PATH (or ./cookbook.db), and ./data/usda-foods.json.
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dbPath = process.argv[2] || process.env.DATABASE_PATH || join(root, 'cookbook.db');
const jsonPath = process.argv[3] || join(root, 'data', 'usda-foods.json');

// rows: [fdcId, description, category, kcal, protein, carbs, fat, fiber, sugar, sodium]
const rows = JSON.parse(readFileSync(jsonPath, 'utf8'));

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS usda_foods (
    fdc_id INTEGER PRIMARY KEY, description TEXT, food_category TEXT,
    calories REAL, protein REAL, carbs REAL, fat REAL, fiber REAL, sugar REAL, sodium REAL
  );
  CREATE VIRTUAL TABLE IF NOT EXISTS usda_fts USING fts5(fdc_id UNINDEXED, description);
`);

const insertFood = db.prepare(`
  INSERT OR REPLACE INTO usda_foods
    (fdc_id, description, food_category, calories, protein, carbs, fat, fiber, sugar, sodium)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insertFts = db.prepare('INSERT INTO usda_fts (fdc_id, description) VALUES (?, ?)');

const load = db.transaction((items) => {
  db.exec('DELETE FROM usda_foods; DELETE FROM usda_fts;');
  for (const r of items) {
    insertFood.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9]);
    insertFts.run(r[0], r[1]);
  }
});
load(rows);

const count = db.prepare('SELECT count(*) AS c FROM usda_foods').get().c;
console.log(`Loaded ${count} USDA foods into ${dbPath}`);
db.close();
