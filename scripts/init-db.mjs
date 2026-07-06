#!/usr/bin/env node
// Create (or upgrade) a Cookbook SQLite database from scripts/schema.sql.
// Idempotent: safe to run against an existing DB — it only adds missing
// tables/indexes and never drops data.
//
// Usage:
//   node scripts/init-db.mjs [path-to-db]
// Defaults to $DATABASE_PATH, then ./cookbook.db.
import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.argv[2] || process.env.DATABASE_PATH || join(__dirname, '..', 'cookbook.db');
const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(schema);

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  .all()
  .map((r) => r.name);

console.log(`Initialized ${dbPath}`);
console.log(`Tables (${tables.length}): ${tables.join(', ')}`);
db.close();
