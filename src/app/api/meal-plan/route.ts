import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    // Join the recipe so the planner can render titles/images without N+1 calls.
    let query = `
      SELECT mp.*, r.title AS recipe_title, r.image_url AS recipe_image_url
      FROM meal_plan mp
      LEFT JOIN recipes r ON r.id = mp.recipe_id
    `;
    const params: string[] = [];
    if (start && end) {
      query += ' WHERE mp.date >= ? AND mp.date <= ?';
      params.push(start, end);
    }
    query += ' ORDER BY mp.date ASC, mp.created_at ASC';

    const entries = db.prepare(query).all(...params);
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return NextResponse.json({ error: 'Failed to fetch meal plan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    if (!body.date || !body.recipe_id) {
      return NextResponse.json({ error: 'date and recipe_id required' }, { status: 400 });
    }

    const id = `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO meal_plan (id, date, meal_type, recipe_id, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, body.date, body.meal_type || 'dinner', body.recipe_id, now);

    return NextResponse.json({ id, ...body, created_at: now });
  } catch (error) {
    console.error('Error creating meal plan entry:', error);
    return NextResponse.json({ error: 'Failed to create meal plan entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    db.prepare('DELETE FROM meal_plan WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal plan entry:', error);
    return NextResponse.json({ error: 'Failed to delete meal plan entry' }, { status: 500 });
  }
}
