import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GroceryListItem } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    let query = 'SELECT * FROM grocery_list_items WHERE 1=1';
    const params: any[] = [];

    const listId = searchParams.get('list_id');
    if (listId) {
      query += ' AND list_id = ?';
      params.push(listId);
    }

    query += ' ORDER BY checked ASC, created_at ASC';

    const stmt = db.prepare(query);
    const items = stmt.all(...params) as GroceryListItem[];
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching grocery list items:', error);
    return NextResponse.json({ error: 'Failed to fetch grocery list items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const id = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO grocery_list_items (
        id, list_id, ingredient_id, recipe_id, name, quantity,
        unit, checked, category, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.list_id || '',
      body.ingredient_id || null,
      body.recipe_id || null,
      body.name || '',
      body.quantity || 1,
      body.unit || 'pieces',
      body.checked ? 1 : 0,
      body.category || 'other',
      now
    );

    return NextResponse.json({ id, ...body, created_at: now });
  } catch (error) {
    console.error('Error creating grocery list item:', error);
    return NextResponse.json({ error: 'Failed to create grocery list item' }, { status: 500 });
  }
}
