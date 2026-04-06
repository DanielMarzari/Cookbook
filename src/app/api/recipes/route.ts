import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Recipe } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    let query = 'SELECT * FROM recipes WHERE 1=1';
    const params: any[] = [];

    const search = searchParams.get('search');
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    const cuisine = searchParams.get('cuisine');
    if (cuisine) {
      query += ' AND cuisine_type = ?';
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
    const recipes = stmt.all(...params) as Recipe[];

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
        source_type, is_favorite, status, image_rotation, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const id = `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const result = stmt.run(
      id,
      body.title || '',
      body.description || null,
      body.image_url || null,
      body.cuisine_type || 'Other',
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
      now,
      now
    );

    return NextResponse.json({ id, ...body, created_at: now, updated_at: now });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
