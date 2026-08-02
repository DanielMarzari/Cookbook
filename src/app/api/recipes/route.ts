import { NextRequest, NextResponse } from 'next/server';
import { getDb, hydrateRecipe, toFtsQuery } from '@/lib/db';
import { Recipe } from '@/lib/types';
import { resolvePhoto } from '@/lib/variations';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    // Every recipe is returned, variations included — hiding them here would take
    // them out of search, the planner, grocery and collections too. Each row
    // carries how many branches it has; the home grid is the only surface that
    // folds variations into their base, and it does that itself.
    let query = `SELECT r.*,
        (SELECT COUNT(*) FROM recipes v WHERE v.parent_recipe_id = r.id) AS variation_count
      FROM recipes r WHERE 1=1`;
    const params: any[] = [];

    const search = searchParams.get('search');
    if (search) {
      const ftsQuery = toFtsQuery(search);
      if (ftsQuery) {
        // Full-text match against title + description via the FTS5 index.
        query += ' AND id IN (SELECT recipe_id FROM recipes_fts WHERE recipes_fts MATCH ?)';
        params.push(ftsQuery);
      } else {
        // Search was all punctuation/symbols — match nothing rather than everything.
        query += ' AND 0';
      }
    }

    const cuisine = searchParams.get('cuisine');
    if (cuisine) {
      // Case-insensitive: FilterBar sends lowercase but DB stores Title case.
      query += ' AND LOWER(cuisine_type) = LOWER(?)';
      params.push(cuisine);
    }

    const difficulty = searchParams.get('difficulty');
    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    const maxTime = searchParams.get('maxTime');
    if (maxTime) {
      query += ' AND total_time_minutes <= ?';
      params.push(parseInt(maxTime));
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const recipes = (stmt.all(...params) as Recipe[]).map(hydrateRecipe).map((r) => resolvePhoto(db, r as never) as Recipe);

    // Attach each base's variations in one extra query, so a branched tile can
    // collage their photos without the grid firing a request per card.
    const branched = recipes.filter((r) => (r.variation_count || 0) > 0);
    if (branched.length > 0) {
      const placeholders = branched.map(() => '?').join(',');
      const rows = db.prepare(
        `SELECT id, title, image_url, variation_of_label, parent_recipe_id
         FROM recipes WHERE parent_recipe_id IN (${placeholders}) ORDER BY created_at`
      ).all(...branched.map((r) => r.id)) as {
        id: string; title: string; image_url: string | null;
        variation_of_label: string | null; parent_recipe_id: string;
      }[];
      const byParent = new Map<string, typeof rows>();
      for (const v of rows) {
        if (!byParent.has(v.parent_recipe_id)) byParent.set(v.parent_recipe_id, []);
        byParent.get(v.parent_recipe_id)!.push(v);
      }
      for (const r of branched) {
        (r as Recipe & { variations?: unknown }).variations = byParent.get(r.id) || [];
      }
    }

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const stmt = db.prepare(`
      INSERT INTO recipes (
        id, title, description, image_url, cuisine_type, origin,
        difficulty, prep_time_minutes, cook_time_minutes, total_time_minutes,
        servings, instructions, source_url, source_name, source_author,
        source_type, is_favorite, status, image_rotation, image_position, image_zoom,
        notes, yield_quantity, yield_unit, meal_type, is_mine, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const result = stmt.run(
      id,
      body.title || '',
      body.description || null,
      body.image_url || null,
      body.cuisine_type || null,
      body.origin || null,
      body.difficulty || 'medium',
      body.prep_time_minutes || 0,
      body.cook_time_minutes || 0,
      body.total_time_minutes || 0,
      body.servings || 1,
      JSON.stringify(body.instructions || []),
      body.source_url || null,
      body.source_name || null,
      body.source_author || null,
      body.source_type || 'user',
      body.is_favorite ? 1 : 0,
      body.status || 'new',
      body.image_rotation || 0,
      body.image_position || null,
      body.image_zoom || null,
      body.notes || null,
      body.yield_quantity || null,
      body.yield_unit || null,
      body.meal_type || null,
      body.is_mine ? 1 : 0,
      now,
      now
    );

    return NextResponse.json({ id, ...body, created_at: now, updated_at: now });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
