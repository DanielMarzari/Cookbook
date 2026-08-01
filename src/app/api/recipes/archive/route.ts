import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { listArchive, restoreArchive, purgeExpiredArchives } from '@/lib/archive';

/** GET — what can still be undone, newest first. */
export async function GET() {
  try {
    const db = getDb();
    purgeExpiredArchives(db);
    return NextResponse.json({ entries: listArchive(db) });
  } catch (error) {
    console.error('Error listing archive:', error);
    return NextResponse.json({ error: 'Failed to list archive' }, { status: 500 });
  }
}

/** POST { archiveId } — put a snapshot back under its original id. */
export async function POST(request: NextRequest) {
  try {
    const { archiveId } = await request.json();
    if (typeof archiveId !== 'number') {
      return NextResponse.json({ error: 'archiveId must be a number' }, { status: 400 });
    }
    const result = restoreArchive(getDb(), archiveId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, recipeId: result.recipeId });
  } catch (error) {
    console.error('Error restoring archive:', error);
    return NextResponse.json({ error: 'Failed to restore' }, { status: 500 });
  }
}
