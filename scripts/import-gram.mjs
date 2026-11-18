/**
 * Bring Gram's binder into the cookbook.
 *
 * The source is 24 photographs of a ring binder — some pages typed by her, some
 * in her handwriting, some clippings she kept. They were transcribed by hand
 * into data/gram/recipes.json: spelling corrected (the page says "raug" for
 * ragù, "poor" for pour, "yokes" for yolks), the shouting capitals turned back
 * into sentences, and the ingredients separated from the method, which on most
 * of the pages run together.
 *
 * What is NOT changed is the content. Quantities, temperatures and times are
 * exactly as written. Where a page was ambiguous the recipe says so in its
 * notes rather than being tidied into a guess — her Stollen has pencil
 * adjustments too faint to read, and that is recorded instead of invented.
 *
 * Her marginalia is the reason this is worth doing carefully at all, so every
 * handwritten note is kept verbatim in the recipe's notes field: "Rose very
 * nice, thick", "Dan said not sweet enough", "Mandy said this is good".
 *
 * Idempotent on title — a second run updates rather than duplicates.
 *
 * Usage: node --env-file=.env.local scripts/import-gram.mjs [--dry]
 *    or: DATABASE_PATH=./cookbook.local.db node scripts/import-gram.mjs
 */
import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'cookbook.local.db');
const dry = process.argv.includes('--dry');

const recipes = JSON.parse(readFileSync(path.join(process.cwd(), 'data/gram/recipes.json'), 'utf8'));
const db = new Database(DB_PATH);

const SOURCE = "Gram's Binder";

const findByTitle = db.prepare('SELECT id FROM recipes WHERE LOWER(title) = LOWER(?)');
const insertRecipe = db.prepare(`
  INSERT INTO recipes (
    id, title, description, cuisine_type, craft, servings, instructions,
    prep_time_minutes, cook_time_minutes, total_time_minutes,
    notes, source_name, source_type, status, is_favorite, is_mine,
    created_at, updated_at
  ) VALUES (
    @id, @title, @description, @cuisine_type, @craft, @servings, @instructions,
    @prep, @cook, @total,
    @notes, @source_name, 'family', 'new', 0, 0,
    @now, @now
  )`);
const updateRecipe = db.prepare(`
  UPDATE recipes SET
    description = @description, cuisine_type = @cuisine_type, craft = @craft,
    servings = @servings, instructions = @instructions,
    prep_time_minutes = @prep, cook_time_minutes = @cook, total_time_minutes = @total,
    notes = @notes, source_name = @source_name, updated_at = @now
  WHERE id = @id`);
const wipeIngredients = db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?');
const insertIngredient = db.prepare(`
  INSERT INTO recipe_ingredients (recipe_id, name, quantity, unit, section, order_index)
  VALUES (@recipe_id, @name, @quantity, @unit, @section, @order_index)`);

let added = 0;
let updated = 0;

const run = db.transaction(() => {
  for (const r of recipes) {
    const existing = findByTitle.get(r.title);
    const id = existing?.id ?? randomUUID();
    const now = new Date().toISOString();
    const prep = r.prep_time_minutes ?? 0;
    const cook = r.cook_time_minutes ?? 0;

    const row = {
      id,
      title: r.title,
      description: r.description ?? null,
      cuisine_type: r.cuisine_type ?? null,
      craft: r.craft ?? null,
      servings: r.servings ?? null,
      instructions: JSON.stringify(
        (r.instructions ?? []).map((text, i) => ({ step_number: i + 1, text })),
      ),
      prep,
      cook,
      total: prep + cook,
      notes: r.notes ?? null,
      source_name: SOURCE,
      now,
    };

    if (existing) {
      if (!dry) updateRecipe.run(row);
      updated++;
      console.log(`  update  ${r.title}`);
    } else {
      if (!dry) insertRecipe.run(row);
      added++;
      console.log(`  add     ${r.title}`);
    }

    if (!dry) {
      wipeIngredients.run(id);
      (r.ingredients ?? []).forEach((ing, i) => {
        insertIngredient.run({
          recipe_id: id,
          name: ing.name,
          quantity: ing.quantity ?? 0,
          unit: ing.unit ?? '',
          section: ing.section ?? null,
          order_index: i,
        });
      });
    }
  }
});
run();

console.log(
  `\n${dry ? 'would add' : 'added'} ${added}, ${dry ? 'would update' : 'updated'} ${updated}` +
    `  (${recipes.length} in the file)`,
);
