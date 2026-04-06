import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Collection } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM collections ORDER BY created_at DESC');
    const collections = stmt.all() as Collection[];
    return NextResponse.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const id = `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO collections (
        id, name, description, subtitle, image_url, cover_image_url,
        color, auto_filter_field, auto_filter_value, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.name || '',
      body.description || null,
      body.subtitle || null,
      body.image_url || null,
      body.cover_image_url || null,
      body.color || 'bg-amber-100',
      body.auto_filter_field || null,
      body.auto_filter_value || null,
      now
    );

    return NextResponse.json({ id, ...body, created_at: now });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Failed to create collection' }, { status: 500 });
  }
}
