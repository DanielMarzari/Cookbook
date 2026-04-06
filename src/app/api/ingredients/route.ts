import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Ingredient } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();

    const stmt = db.prepare('SELECT * FROM ingredients ORDER BY name ASC');
    const ingredients = stmt.all() as Ingredient[];

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return NextResponse.json({ error: 'Failed to fetch ingredients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    const id = `ing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO ingredients (
        id, name, brand, category, calories_per_100g, protein_per_100g,
        carbs_per_100g, fat_per_100g, fiber_per_100g, sugar_per_100g,
        sodium_per_100g, custom_nutrition, image_url, barcode, fdc_id,
        aliases, is_custom, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.name || '',
      body.brand || null,
      body.category || 'Other',
      body.calories_per_100g || 0,
      body.protein_per_100g || 0,
      body.carbs_per_100g || 0,
      body.fat_per_100g || 0,
      body.fiber_per_100g || 0,
      body.sugar_per_100g || 0,
      body.sodium_per_100g || 0,
      body.custom_nutrition ? JSON.stringify(body.custom_nutrition) : null,
      body.image_url || null,
      body.barcode || null,
      body.fdc_id || null,
      body.aliases ? JSON.stringify(body.aliases) : null,
      body.is_custom ? 1 : 0,
      now,
      now
    );

    return NextResponse.json({ id, ...body, created_at: now, updated_at: now });
  } catch (error) {
    console.error('Error creating ingredient:', error);
    return NextResponse.json({ error: 'Failed to create ingredient' }, { status: 500 });
  }
}
