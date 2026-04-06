import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Tag } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM tags WHERE id = ?');
    const tag = stmt.get(params.id) as Tag;
    if (!tag) return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({ error: 'Failed to fetch tag' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const body = await request.json();
    const stmt = db.prepare(`UPDATE tags SET name = COALESCE(?, name), type = COALESCE(?, type), color = COALESCE(?, color) WHERE id = ?`);
    stmt.run(body.name || null, body.type || null, body.color || null, params.id);
    const getStmt = db.prepare('SELECT * FROM tags WHERE id = ?');
    return NextResponse.json(getStmt.get(params.id));
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    db.prepare('DELETE FROM recipe_tags WHERE tag_id = ?').run(params.id);
    db.prepare('DELETE FROM tags WHERE id = ?').run(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 });
  }
}
