import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { CookLog } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    const recipeId = searchParams.get('recipe_id');

    let query = 'SELECT * FROM cook_logs';
    const params: string[] = [];
    if (recipeId) {
      query += ' WHERE recipe_id = ?';
      params.push(recipeId);
    }
    query += ' ORDER BY cooked_at DESC, created_at DESC';

    const logs = db.prepare(query).all(...params) as CookLog[];
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching cook logs:', error);
    return NextResponse.json({ error: 'Failed to fetch cook logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    if (!body.recipe_id) {
      return NextResponse.json({ error: 'recipe_id required' }, { status: 400 });
    }

    const id = `cook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const cookedAt = body.cooked_at || now;

    db.prepare(`
      INSERT INTO cook_logs (id, recipe_id, cooked_at, rating, notes, photo_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      body.recipe_id,
      cookedAt,
      body.rating ?? null,
      body.notes || null,
      body.photo_url || null,
      now
    );

    return NextResponse.json({ id, ...body, cooked_at: cookedAt, created_at: now });
  } catch (error) {
    console.error('Error creating cook log:', error);
    return NextResponse.json({ error: 'Failed to create cook log' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    db.prepare('DELETE FROM cook_logs WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cook log:', error);
    return NextResponse.json({ error: 'Failed to delete cook log' }, { status: 500 });
  }
}
