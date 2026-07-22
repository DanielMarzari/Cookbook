/**
 * Canonical database schema for Cookbook (SQLite / better-sqlite3).
 *
 * This is the single source of truth for the DB structure. `getDb()` runs it
 * on every connection open, so a fresh install auto-creates all tables and a
 * running production DB just gains any missing indexes. Every statement is
 * `IF NOT EXISTS`, so applying it is idempotent and never touches existing rows.
 *
 * A human-readable copy lives in `scripts/schema.sql` (kept in sync by hand).
 */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_url TEXT,
  cuisine_type TEXT,
  origin TEXT,
  difficulty TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  total_time_minutes INTEGER,
  servings INTEGER,
  instructions TEXT,
  source_url TEXT,
  source_type TEXT,
  is_favorite BOOLEAN,
  created_at TEXT,
  updated_at TEXT,
  source_name TEXT,
  source_author TEXT,
  status TEXT,
  image_rotation REAL,
  image_position TEXT,
  image_zoom REAL
);

CREATE TABLE IF NOT EXISTS ingredients (
  id TEXT PRIMARY KEY,
  name TEXT,
  brand TEXT,
  category TEXT,
  calories_per_100g REAL,
  protein_per_100g REAL,
  carbs_per_100g REAL,
  fat_per_100g REAL,
  fiber_per_100g REAL,
  sugar_per_100g REAL,
  sodium_per_100g REAL,
  custom_nutrition TEXT,
  image_url TEXT,
  barcode TEXT,
  fdc_id TEXT,
  is_custom BOOLEAN,
  created_at TEXT,
  updated_at TEXT,
  aliases TEXT
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id TEXT PRIMARY KEY,
  recipe_id TEXT,
  ingredient_id TEXT,
  name TEXT,
  quantity REAL,
  unit TEXT,
  notes TEXT,
  order_index INTEGER,
  custom_calories REAL,
  custom_protein REAL,
  custom_carbs REAL,
  custom_fat REAL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT,
  type TEXT,
  color TEXT
);

CREATE TABLE IF NOT EXISTS recipe_tags (
  recipe_id TEXT,
  tag_id TEXT,
  auto_generated BOOLEAN,
  PRIMARY KEY (recipe_id, tag_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  image_url TEXT,
  color TEXT,
  created_at TEXT,
  updated_at TEXT,
  subtitle TEXT,
  cover_image_url TEXT,
  auto_filter_field TEXT,
  auto_filter_value TEXT
);

CREATE TABLE IF NOT EXISTS collection_recipes (
  collection_id TEXT,
  recipe_id TEXT,
  added_at TEXT,
  PRIMARY KEY (collection_id, recipe_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE TABLE IF NOT EXISTS grocery_lists (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS grocery_list_items (
  id TEXT PRIMARY KEY,
  list_id TEXT,
  ingredient_id TEXT,
  recipe_id TEXT,
  name TEXT,
  quantity REAL,
  unit TEXT,
  checked BOOLEAN,
  category TEXT,
  created_at TEXT,
  FOREIGN KEY (list_id) REFERENCES grocery_lists(id)
);

CREATE TABLE IF NOT EXISTS techniques (
  id TEXT PRIMARY KEY,
  name TEXT,
  slug TEXT,
  category TEXT,
  difficulty TEXT,
  description TEXT,
  content TEXT,
  image_urls TEXT,
  video_url TEXT,
  tips TEXT,
  related_techniques TEXT,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS user_technique_skills (
  id TEXT PRIMARY KEY,
  technique_id TEXT,
  skill_level TEXT,
  notes TEXT,
  updated_at TEXT,
  FOREIGN KEY (technique_id) REFERENCES techniques(id)
);

-- A cooking journal entry: when you made a recipe, how it went (1-5), notes,
-- and an optional result photo (stored as a data URL — see /api/cook-logs).
CREATE TABLE IF NOT EXISTS cook_logs (
  id TEXT PRIMARY KEY,
  recipe_id TEXT,
  cooked_at TEXT,
  rating INTEGER,
  notes TEXT,
  photo_url TEXT,
  created_at TEXT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- Meal planner: a recipe assigned to a date + meal slot.
CREATE TABLE IF NOT EXISTS meal_plan (
  id TEXT PRIMARY KEY,
  date TEXT,
  meal_type TEXT,
  recipe_id TEXT,
  created_at TEXT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- Extra photos for a recipe's gallery (the main/cover image stays on recipes).
-- Kept in a separate table so the recipes list payload isn't bloated by
-- inline data-URL photos.
CREATE TABLE IF NOT EXISTS recipe_photos (
  id TEXT PRIMARY KEY,
  recipe_id TEXT,
  url TEXT,
  sort_order INTEGER,
  created_at TEXT,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

-- Indexes for foreign keys and common filter/sort columns. SQLite only
-- auto-indexes primary keys, so joins and lookups below would otherwise scan.
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_name ON recipe_ingredients(name);
CREATE INDEX IF NOT EXISTS idx_recipe_tags_tag ON recipe_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_recipe ON collection_recipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_grocery_list_items_list ON grocery_list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_user_technique_skills_technique ON user_technique_skills(technique_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recipes_status ON recipes(status);
CREATE INDEX IF NOT EXISTS idx_recipes_created ON recipes(created_at);
CREATE INDEX IF NOT EXISTS idx_techniques_slug ON techniques(slug);
CREATE INDEX IF NOT EXISTS idx_cook_logs_recipe ON cook_logs(recipe_id);
CREATE INDEX IF NOT EXISTS idx_meal_plan_date ON meal_plan(date);
CREATE INDEX IF NOT EXISTS idx_recipe_photos_recipe ON recipe_photos(recipe_id);

-- Full-text search over recipe title + description. Self-contained FTS5 table
-- (stores its own copy) keyed by the recipe's TEXT id, kept in sync by triggers.
-- Chosen over external-content FTS because recipes uses a TEXT primary key, which
-- makes the external-content/rowid variant fragile. Backfill is handled in db.ts.
CREATE VIRTUAL TABLE IF NOT EXISTS recipes_fts USING fts5(
  recipe_id UNINDEXED,
  title,
  description
);

CREATE TRIGGER IF NOT EXISTS recipes_fts_ai AFTER INSERT ON recipes BEGIN
  INSERT INTO recipes_fts(recipe_id, title, description) VALUES (new.id, new.title, new.description);
END;

CREATE TRIGGER IF NOT EXISTS recipes_fts_ad AFTER DELETE ON recipes BEGIN
  DELETE FROM recipes_fts WHERE recipe_id = old.id;
END;

CREATE TRIGGER IF NOT EXISTS recipes_fts_au AFTER UPDATE ON recipes BEGIN
  DELETE FROM recipes_fts WHERE recipe_id = old.id;
  INSERT INTO recipes_fts(recipe_id, title, description) VALUES (new.id, new.title, new.description);
END;

-- Local mirror of the USDA FoodData Central "SR Legacy" dataset (~7,800 generic
-- ingredients with per-100g nutrition). Bulk-loaded from data/usda-foods.json by
-- scripts/load-usda.mjs; the app only reads it, so no sync triggers are needed.
CREATE TABLE IF NOT EXISTS usda_foods (
  fdc_id INTEGER PRIMARY KEY,
  description TEXT,
  food_category TEXT,
  calories REAL,
  protein REAL,
  carbs REAL,
  fat REAL,
  fiber REAL,
  sugar REAL,
  sodium REAL
);

CREATE VIRTUAL TABLE IF NOT EXISTS usda_fts USING fts5(
  fdc_id UNINDEXED,
  description
);

-- Flavor network (Ahn et al., Nature Sci. Reports 2011, CC-BY-4.0): ingredients
-- linked to shared flavor compounds. Powers the pairing tool + flavor wheel.
-- Bulk-loaded from data/flavor-network.json by scripts/load-flavor.mjs.
CREATE TABLE IF NOT EXISTS flavor_ingredients (
  id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  n_compounds INTEGER
);

CREATE TABLE IF NOT EXISTS flavor_compounds (
  id INTEGER PRIMARY KEY,
  name TEXT,
  idf REAL
);

CREATE TABLE IF NOT EXISTS flavor_ingredient_compounds (
  ingredient_id INTEGER,
  compound_id INTEGER
);

CREATE INDEX IF NOT EXISTS idx_fic_ingredient ON flavor_ingredient_compounds(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_fic_compound ON flavor_ingredient_compounds(compound_id);
CREATE INDEX IF NOT EXISTS idx_flavor_ingredients_category ON flavor_ingredients(category);
`;
