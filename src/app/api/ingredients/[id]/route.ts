import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Ingredient } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();

    const stmt = db.prepare('SELECT * FROM ingredients WHERE id = ?');
    const ingredient = stmt.get(id) as Ingredient;

    if (!ingredient) {
      return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
    }

    return NextResponse.json(ingredient);
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    return NextResponse.json({ error: 'Failed to fetch ingredient' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    const body = await request.json();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE ingredients SET
        name = COALESCE(?, name),
        brand = COALESCE(?, brand),
        category = COALESCE(?, category),
        calories_per_100g = COALESCE(?, calories_per_100g),
        protein_per_100g = COALESCE(?, protein_per_100g),
        carbs_per_100g = COALESCE(?, carbs_per_100g),
        fat_per_100g = COALESCE(?, fat_per_100g),
        fiber_per_100g = COALESCE(?, fiber_per_100g),
        sugar_per_100g = COALESCE(?, sugar_per_100g),
        sodium_per_100g = COALESCE(?, sodium_per_100g),
        custom_nutrition = COALESCE(?, custom_nutrition),
        image_url = COALESCE(?, image_url),
        barcode = COALESCE(?, barcode),
        fdc_id = COALESCE(?, fdc_id),
        aliases = COALESCE(?, aliases),
        is_custom = COALESCE(?, is_custom),
        updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      body.name || null,
      body.brand || null,
      body.category || null,
      body.calories_per_100g !== undefined ? body.calories_per_100g : null,
      body.protein_per_100g !== undefined ? body.protein_per_100g : null,
      body.carbs_per_100g !== undefined ? body.carbs_per_100g : null,
      body.fat_per_100g !== undefined ? body.fat_per_100g : null,
      body.fiber_per_100g !== undefined ? body.fiber_per_100g : null,
      body.sugar_per_100g !== undefined ? body.sugar_per_100g : null,
      body.sodium_per_100g !== undefined ? body.sodium_per_100g : null,
      body.custom_nutrition ? JSON.stringify(body.custom_nutrition) : null,
      body.image_url || null,
      body.barcode || null,
      body.fdc_id || null,
      body.aliases ? JSON.stringify(body.aliases) : null,
      body.is_custom !== undefined ? (body.is_custom ? 1 : 0) : null,
      now,
      id
    );

    const getStmt = db.prepare('SELECT * FROM ingredients WHERE id = ?');
    const updated = getStmt.get(id);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();

    const stmt = db.prepare('DELETE FROM ingredients WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return NextResponse.json({ error: 'Failed to delete ingredient' }, { status: 500 });
  }
}
