import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Technique } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM techniques WHERE slug = ? OR id = ?');
    const technique = stmt.get(params.slug, params.slug) as Technique;
    if (!technique) return NextResponse.json({ error: 'Technique not found' }, { status: 404 });
    return NextResponse.json(technique);
  } catch (error) {
    console.error('Error fetching technique:', error);
    return NextResponse.json({ error: 'Failed to fetch technique' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = getDb();
    const body = await request.json();

    const stmt = db.prepare(`
      UPDATE techniques SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        category = COALESCE(?, category),
        difficulty = COALESCE(?, difficulty),
        description = COALESCE(?, description),
        content = COALESCE(?, content),
        image_urls = COALESCE(?, image_urls),
        video_url = COALESCE(?, video_url),
        tips = COALESCE(?, tips),
        related_techniques = COALESCE(?, related_techniques)
      WHERE slug = ? OR id = ?
    `);

    stmt.run(
      body.name || null,
      body.slug || null,
      body.category || null,
      body.difficulty || null,
      body.description || null,
      body.content || null,
      body.image_urls ? JSON.stringify(body.image_urls) : null,
      body.video_url || null,
      body.tips ? JSON.stringify(body.tips) : null,
      body.related_techniques ? JSON.stringify(body.related_techniques) : null,
      params.slug,
      params.slug
    );

    const getStmt = db.prepare('SELECT * FROM techniques WHERE slug = ? OR id = ?');
    return NextResponse.json(getStmt.get(params.slug, params.slug));
  } catch (error) {
    console.error('Error updating technique:', error);
    return NextResponse.json({ error: 'Failed to update technique' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const db = getDb();
    db.prepare('DELETE FROM user_technique_skills WHERE technique_id IN (SELECT id FROM techniques WHERE slug = ? OR id = ?)').run(params.slug, params.slug);
    db.prepare('DELETE FROM techniques WHERE slug = ? OR id = ?').run(params.slug, params.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting technique:', error);
    return NextResponse.json({ error: 'Failed to delete technique' }, { status: 500 });
  }
}
