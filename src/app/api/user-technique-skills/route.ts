import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { UserTechniqueSkill } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    let query = 'SELECT * FROM user_technique_skills WHERE 1=1';
    const params: any[] = [];

    const techniqueId = searchParams.get('technique_id');
    if (techniqueId) {
      query += ' AND technique_id = ?';
      params.push(techniqueId);
    }

    const stmt = db.prepare(query);
    const skills = stmt.all(...params) as UserTechniqueSkill[];
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching user technique skills:', error);
    return NextResponse.json({ error: 'Failed to fetch user technique skills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const id = `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO user_technique_skills (
        id, technique_id, skill_level, notes, updated_at
      ) VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      body.technique_id || '',
      body.skill_level || 'learning',
      body.notes || null,
      now
    );

    return NextResponse.json({ id, ...body, updated_at: now });
  } catch (error) {
    console.error('Error creating user technique skill:', error);
    return NextResponse.json({ error: 'Failed to create user technique skill' }, { status: 500 });
  }
}
