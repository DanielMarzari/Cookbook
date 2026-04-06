import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { UserTechniqueSkill } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM user_technique_skills WHERE id = ?');
    const skill = stmt.get(id) as UserTechniqueSkill;
    if (!skill) return NextResponse.json({ error: 'User technique skill not found' }, { status: 404 });
    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error fetching user technique skill:', error);
    return NextResponse.json({ error: 'Failed to fetch user technique skill' }, { status: 500 });
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
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE user_technique_skills SET
        skill_level = COALESCE(?, skill_level),
        notes = COALESCE(?, notes),
        updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      body.skill_level || null,
      body.notes || null,
      now,
      id
    );

    const getStmt = db.prepare('SELECT * FROM user_technique_skills WHERE id = ?');
    return NextResponse.json(getStmt.get(id));
  } catch (error) {
    console.error('Error updating user technique skill:', error);
    return NextResponse.json({ error: 'Failed to update user technique skill' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = getDb();
    db.prepare('DELETE FROM user_technique_skills WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user technique skill:', error);
    return NextResponse.json({ error: 'Failed to delete user technique skill' }, { status: 500 });
  }
}
