import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Tag } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM tags ORDER BY name ASC');
    const tags = stmt.all() as Tag[];
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const id = `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const stmt = db.prepare(`
      INSERT INTO tags (id, name, type, color) VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, body.name || '', body.type || 'custom', body.color || '#000000');
    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
