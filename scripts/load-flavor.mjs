#!/usr/bin/env node
// Load the flavor network (data/flavor-network.json) into the flavor_* tables.
// Idempotent: clears and reloads each run.
//
// Usage: node scripts/load-flavor.mjs [path-to-db] [path-to-json]
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dbPath = process.argv[2] || process.env.DATABASE_PATH || join(root, 'cookbook.db');
const jsonPath = process.argv[3] || join(root, 'data', 'flavor-network.json');

const { ingredients, compounds, edges } = JSON.parse(readFileSync(jsonPath, 'utf8'));

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
// Drop + recreate so schema changes (e.g. the idf column) always take. These
// are read-only mirror tables, so a clean rebuild is safe.
db.exec(`
  DROP TABLE IF EXISTS flavor_ingredient_compounds;
  DROP TABLE IF EXISTS flavor_compounds;
  DROP TABLE IF EXISTS flavor_ingredients;
  CREATE TABLE flavor_ingredients (id INTEGER PRIMARY KEY, name TEXT, category TEXT, n_compounds INTEGER);
  CREATE TABLE flavor_compounds (id INTEGER PRIMARY KEY, name TEXT, idf REAL);
  CREATE TABLE flavor_ingredient_compounds (ingredient_id INTEGER, compound_id INTEGER);
  CREATE INDEX idx_fic_ingredient ON flavor_ingredient_compounds(ingredient_id);
  CREATE INDEX idx_fic_compound ON flavor_ingredient_compounds(compound_id);
  CREATE INDEX idx_flavor_ingredients_category ON flavor_ingredients(category);
`);

// Per-ingredient compound count (for normalized affinity) and per-compound
// document frequency -> IDF weight (rare shared compounds count for more, so
// pairings surface distinctive matches instead of compound-rich "hub" foods).
const nComp = new Map();
const df = new Map();
for (const [ing, comp] of edges) {
  nComp.set(ing, (nComp.get(ing) || 0) + 1);
  df.set(comp, (df.get(comp) || 0) + 1);
}
const N = ingredients.length;
const idf = (comp) => Math.log(N / (df.get(comp) || 1));

const insIng = db.prepare('INSERT OR REPLACE INTO flavor_ingredients (id, name, category, n_compounds) VALUES (?, ?, ?, ?)');
const insComp = db.prepare('INSERT OR REPLACE INTO flavor_compounds (id, name, idf) VALUES (?, ?, ?)');
const insEdge = db.prepare('INSERT INTO flavor_ingredient_compounds (ingredient_id, compound_id) VALUES (?, ?)');

const load = db.transaction(() => {
  for (const [id, name, category] of ingredients) insIng.run(id, name, category, nComp.get(id) || 0);
  for (const [id, name] of compounds) insComp.run(id, name, idf(id));
  for (const [ing, comp] of edges) insEdge.run(ing, comp);
});
load();

const i = db.prepare('SELECT count(*) AS c FROM flavor_ingredients').get().c;
const e = db.prepare('SELECT count(*) AS c FROM flavor_ingredient_compounds').get().c;
console.log(`Loaded ${i} flavor ingredients, ${e} ingredient-compound links into ${dbPath}`);
db.close();
