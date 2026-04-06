import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GroceryList } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM grocery_lists WHERE id = ?');
    const list = stmt.get(params.id) as GroceryList;
    if (!list) return NextResponse.json({ error: 'Grocery list not found' }, { status: 404 });
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error fetching grocery list:', error);
    return NextResponse.json({ error: 'Failed to fetch grocery list' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const body = await request.json();
    const stmt = db.prepare('UPDATE grocery_lists SET name = COALESCE(?, name) WHERE id = ?');
    stmt.run(body.name || null, params.id);
    const getStmt = db.prepare('SELECT * FROM grocery_lists WHERE id = ?');
    return NextResponse.json(getStmt.get(params.id));
  } catch (error) {
    console.error('Error updating grocery list:', error);
    return NextResponse.json({ error: 'Failed to update grocery list' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    db.prepare('DELETE FROM grocery_list_items WHERE list_id = ?').run(params.id);
    db.prepare('DELETE FROM grocery_lists WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting grocery list:', error);
    return NextResponse.json({ error: 'Failed to delete grocery list' }, { status: 500 });
  }
}
