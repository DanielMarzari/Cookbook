import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Collection } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM collections WHERE id = ?');
    const collection = stmt.get(id) as Collection;
    if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    return NextResponse.json(collection);
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    const body = await request.json();
    const stmt = db.prepare(`
      UPDATE collections SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        subtitle = COALESCE(?, subtitle),
        image_url = COALESCE(?, image_url),
        cover_image_url = COALESCE(?, cover_image_url),
        color = COALESCE(?, color),
        auto_filter_field = COALESCE(?, auto_filter_field),
        auto_filter_value = COALESCE(?, auto_filter_value)
      WHERE id = ?
    `);

    stmt.run(
      body.name || null,
      body.description || null,
      body.subtitle || null,
      body.image_url || null,
      body.cover_image_url || null,
      body.color || null,
      body.auto_filter_field || null,
      body.auto_filter_value || null,
      id
    );

    const getStmt = db.prepare('SELECT * FROM collections WHERE id = ?');
    return NextResponse.json(getStmt.get(id));
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    db.prepare('DELETE FROM collection_recipes WHERE collection_id = ?').run(id);
    db.prepare('DELETE FROM collections WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 });
  }
}
