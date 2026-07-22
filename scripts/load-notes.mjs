#!/usr/bin/env node
// Load flavour note profiles (data/flavor-notes.json) into note_ingredients +
// note_profiles. Idempotent: drops + rebuilds (read-only mirror tables).
//
// Usage: node scripts/load-notes.mjs [path-to-db] [path-to-json]
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dbPath = process.argv[2] || process.env.DATABASE_PATH || join(root, 'cookbook.db');
const jsonPath = process.argv[3] || join(root, 'data', 'flavor-notes.json');

// { families:[...], ingredients:[[id,name,category]], profile:[[ingId,famIdx,note,intensity]] }
const { families, ingredients, profile } = JSON.parse(readFileSync(jsonPath, 'utf8'));

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.exec(`
  DROP TABLE IF EXISTS note_profiles;
  DROP TABLE IF EXISTS note_ingredients;
  CREATE TABLE note_ingredients (id INTEGER PRIMARY KEY, name TEXT, category TEXT);
  CREATE TABLE note_profiles (ingredient_id INTEGER, family TEXT, note TEXT, intensity REAL);
  CREATE INDEX idx_note_profiles_ing ON note_profiles(ingredient_id);
  CREATE INDEX idx_note_ingredients_name ON note_ingredients(name);
`);

const insIng = db.prepare('INSERT OR REPLACE INTO note_ingredients (id, name, category) VALUES (?, ?, ?)');
const insNote = db.prepare('INSERT INTO note_profiles (ingredient_id, family, note, intensity) VALUES (?, ?, ?, ?)');

const load = db.transaction(() => {
  for (const [id, name, category] of ingredients) insIng.run(id, name, category);
  for (const [ingId, famIdx, note, intensity] of profile) insNote.run(ingId, families[famIdx], note, intensity);
});
load();

const ni = db.prepare('SELECT count(*) AS c FROM note_ingredients').get().c;
const np = db.prepare('SELECT count(*) AS c FROM note_profiles').get().c;
console.log(`Loaded ${ni} note ingredients, ${np} note rows into ${dbPath}`);
db.close();
