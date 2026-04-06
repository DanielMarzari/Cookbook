import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GroceryListItem } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM grocery_list_items WHERE id = ?');
    const item = stmt.get(params.id) as GroceryListItem;
    if (!item) return NextResponse.json({ error: 'Grocery list item not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching grocery list item:', error);
    return NextResponse.json({ error: 'Failed to fetch grocery list item' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const body = await request.json();
    const stmt = db.prepare(`
      UPDATE grocery_list_items SET
        name = COALESCE(?, name),
        quantity = COALESCE(?, quantity),
        unit = COALESCE(?, unit),
        checked = COALESCE(?, checked),
        category = COALESCE(?, category)
      WHERE id = ?
    `);

    stmt.run(
      body.name || null,
      body.quantity !== undefined ? body.quantity : null,
      body.unit || null,
      body.checked !== undefined ? (body.checked ? 1 : 0) : null,
      body.category || null,
      params.id
    );

    const getStmt = db.prepare('SELECT * FROM grocery_list_items WHERE id = ?');
    return NextResponse.json(getStmt.get(params.id));
  } catch (error) {
    console.error('Error updating grocery list item:', error);
    return NextResponse.json({ error: 'Failed to update grocery list item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    db.prepare('DELETE FROM grocery_list_items WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting grocery list item:', error);
    return NextResponse.json({ error: 'Failed to delete grocery list item' }, { status: 500 });
  }
}
