import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Technique } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM techniques ORDER BY name ASC');
    const techniques = stmt.all() as Technique[];
    return NextResponse.json(techniques);
  } catch (error) {
    console.error('Error fetching techniques:', error);
    return NextResponse.json({ error: 'Failed to fetch techniques' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const id = `tech_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO techniques (
        id, name, slug, category, difficulty, description,
        content, image_urls, video_url, tips, related_techniques, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.name || '',
      body.slug || body.name?.toLowerCase().replace(/\s+/g, '-') || '',
      body.category || '',
      body.difficulty || 'beginner',
      body.description || '',
      body.content || '',
      JSON.stringify(body.image_urls || []),
      body.video_url || null,
      JSON.stringify(body.tips || []),
      JSON.stringify(body.related_techniques || []),
      now
    );

    return NextResponse.json({ id, ...body, created_at: now });
  } catch (error) {
    console.error('Error creating technique:', error);
    return NextResponse.json({ error: 'Failed to create technique' }, { status: 500 });
  }
}
