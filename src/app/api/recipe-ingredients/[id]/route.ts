import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RecipeIngredient } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const id = params.id;

    const stmt = db.prepare('SELECT * FROM recipe_ingredients WHERE id = ?');
    const ingredient = stmt.get(id) as RecipeIngredient;

    if (!ingredient) {
      return NextResponse.json({ error: 'Recipe ingredient not found' }, { status: 404 });
    }

    return NextResponse.json(ingredient);
  } catch (error) {
    console.error('Error fetching recipe ingredient:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe ingredient' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const id = params.id;
    const body = await request.json();

    const stmt = db.prepare(`
      UPDATE recipe_ingredients SET
        ingredient_id = COALESCE(?, ingredient_id),
        name = COALESCE(?, name),
        quantity = COALESCE(?, quantity),
        unit = COALESCE(?, unit),
        notes = COALESCE(?, notes),
        order_index = COALESCE(?, order_index),
        custom_calories = COALESCE(?, custom_calories),
        custom_protein = COALESCE(?, custom_protein),
        custom_carbs = COALESCE(?, custom_carbs),
        custom_fat = COALESCE(?, custom_fat)
      WHERE id = ?
    `);

    stmt.run(
      body.ingredient_id || null,
      body.name || null,
      body.quantity !== undefined ? body.quantity : null,
      body.unit || null,
      body.notes || null,
      body.order_index !== undefined ? body.order_index : null,
      body.custom_calories || null,
      body.custom_protein || null,
      body.custom_carbs || null,
      body.custom_fat || null,
      id
    );

    const getStmt = db.prepare('SELECT * FROM recipe_ingredients WHERE id = ?');
    const updated = getStmt.get(id);

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating recipe ingredient:', error);
    return NextResponse.json({ error: 'Failed to update recipe ingredient' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const id = params.id;

    const stmt = db.prepare('DELETE FROM recipe_ingredients WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe ingredient:', error);
    return NextResponse.json({ error: 'Failed to delete recipe ingredient' }, { status: 500 });
  }
}
