import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { GroceryList } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM grocery_lists ORDER BY created_at DESC');
    const lists = stmt.all() as GroceryList[];
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching grocery lists:', error);
    return NextResponse.json({ error: 'Failed to fetch grocery lists' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const id = `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO grocery_lists (id, name, created_at)
      VALUES (?, ?, ?)
    `);

    stmt.run(id, body.name || '', now);
    return NextResponse.json({ id, name: body.name, created_at: now });
  } catch (error) {
    console.error('Error creating grocery list:', error);
    return NextResponse.json({ error: 'Failed to create grocery list' }, { status: 500 });
  }
}
