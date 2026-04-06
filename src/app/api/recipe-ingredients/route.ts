import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { RecipeIngredient } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    let query = 'SELECT * FROM recipe_ingredients WHERE 1=1';
    const params: any[] = [];

    const recipeId = searchParams.get('recipe_id');
    if (recipeId) {
      query += ' AND recipe_id = ?';
      params.push(recipeId);
    }

    query += ' ORDER BY order_index ASC';

    const stmt = db.prepare(query);
    const ingredients = stmt.all(...params) as RecipeIngredient[];

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('Error fetching recipe ingredients:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe ingredients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    // Handle batch insert
    if (Array.isArray(body)) {
      const stmt = db.prepare(`
        INSERT INTO recipe_ingredients (
          id, recipe_id, ingredient_id, name, quantity, unit,
          notes, order_index, custom_calories, custom_protein,
          custom_carbs, custom_fat
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const results = body.map((item: any) => {
        const id = `ri_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        stmt.run(
          id,
          item.recipe_id || '',
          item.ingredient_id || null,
          item.name || '',
          item.quantity || 0,
          item.unit || '',
          item.notes || null,
          item.order_index || 0,
          item.custom_calories || null,
          item.custom_protein || null,
          item.custom_carbs || null,
          item.custom_fat || null
        );
        return { id, ...item };
      });

      return NextResponse.json(results);
    }

    // Single insert
    const id = `ri_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stmt = db.prepare(`
      INSERT INTO recipe_ingredients (
        id, recipe_id, ingredient_id, name, quantity, unit,
        notes, order_index, custom_calories, custom_protein,
        custom_carbs, custom_fat
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.recipe_id || '',
      body.ingredient_id || null,
      body.name || '',
      body.quantity || 0,
      body.unit || '',
      body.notes || null,
      body.order_index || 0,
      body.custom_calories || null,
      body.custom_protein || null,
      body.custom_carbs || null,
      body.custom_fat || null
    );

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Error creating recipe ingredient:', error);
    return NextResponse.json({ error: 'Failed to create recipe ingredient' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;

    const recipeId = searchParams.get('recipe_id');
    if (recipeId) {
      db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?').run(recipeId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'recipe_id required' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting recipe ingredients:', error);
    return NextResponse.json({ error: 'Failed to delete recipe ingredients' }, { status: 500 });
  }
}
