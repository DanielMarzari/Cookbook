import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { CookLog } from '@/lib/types';

/** Adjustments are stored as a JSON string; hand callers the array. */
type Row = Omit<CookLog, 'adjustments'> & { adjustments: string | null };
function hydrate(row: Row): CookLog {
  let adjustments: CookLog['adjustments'];
  try {
    adjustments = row.adjustments ? JSON.parse(row.adjustments) : undefined;
  } catch {
    adjustments = undefined; // a malformed row shouldn't take the page down
  }
  return { ...row, adjustments };
}

/** Keep only well-formed adjustments, so a bad payload can't poison the row. */
function serialiseAdjustments(input: unknown): string | null {
  if (!Array.isArray(input)) return null;
  const clean = input
    .filter((a): a is Record<string, unknown> => Boolean(a) && typeof a === 'object')
    .map((a) => {
      const unit = String(a.unit ?? '');
      const usedUnit = String(a.usedUnit ?? '') || unit;
      return {
        name: String(a.name ?? '').trim(),
        unit,
        was: Number(a.was),
        used: Number(a.used),
        // Only carry the second unit when it actually differs, so a row doesn't
        // claim a change that isn't one.
        ...(usedUnit !== unit ? { usedUnit } : {}),
      };
    })
    // Zero is a real answer — it means you left the ingredient out — so the test
    // is whether anything differs, not whether an amount was given.
    .filter(
      (a) =>
        a.name &&
        Number.isFinite(a.was) &&
        Number.isFinite(a.used) &&
        a.used >= 0 &&
        (a.was !== a.used || Boolean(a.usedUnit)),
    );
  return clean.length ? JSON.stringify(clean) : null;
}

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = request.nextUrl;
    const recipeId = searchParams.get('recipe_id');

    let query = 'SELECT * FROM cook_logs';
    const params: string[] = [];
    if (recipeId) {
      query += ' WHERE recipe_id = ?';
      params.push(recipeId);
    }
    query += ' ORDER BY cooked_at DESC, created_at DESC';

    const logs = (db.prepare(query).all(...params) as Row[]).map(hydrate);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching cook logs:', error);
    return NextResponse.json({ error: 'Failed to fetch cook logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    if (!body.recipe_id) {
      return NextResponse.json({ error: 'recipe_id required' }, { status: 400 });
    }

    const id = `cook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    const cookedAt = body.cooked_at || now;

    db.prepare(`
      INSERT INTO cook_logs (id, recipe_id, cooked_at, rating, notes, photo_url, adjustments, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      body.recipe_id,
      cookedAt,
      body.rating ?? null,
      body.notes || null,
      body.photo_url || null,
      serialiseAdjustments(body.adjustments),
      now
    );

    const created = db.prepare('SELECT * FROM cook_logs WHERE id = ?').get(id) as Row;
    return NextResponse.json(hydrate(created));
  } catch (error) {
    console.error('Error creating cook log:', error);
    return NextResponse.json({ error: 'Failed to create cook log' }, { status: 500 });
  }
}

/**
 * Edit an entry.
 *
 * A cook log is a record of something that happened, and the first thing anyone
 * wants after writing one down is to correct it — a wrong date, a rating they
 * revised after eating it cold the next day.
 */
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const existing = db.prepare('SELECT * FROM cook_logs WHERE id = ?').get(body.id) as Row | undefined;
    if (!existing) return NextResponse.json({ error: 'not found' }, { status: 404 });

    db.prepare(`
      UPDATE cook_logs
         SET cooked_at = ?, rating = ?, notes = ?, photo_url = ?, adjustments = ?
       WHERE id = ?
    `).run(
      body.cooked_at ?? existing.cooked_at,
      body.rating ?? null,
      body.notes || null,
      // Undefined means "not editing the photo"; null means "remove it".
      body.photo_url === undefined ? existing.photo_url : body.photo_url || null,
      body.adjustments === undefined ? existing.adjustments : serialiseAdjustments(body.adjustments),
      body.id
    );

    const updated = db.prepare('SELECT * FROM cook_logs WHERE id = ?').get(body.id) as Row;
    return NextResponse.json(hydrate(updated));
  } catch (error) {
    console.error('Error updating cook log:', error);
    return NextResponse.json({ error: 'Failed to update cook log' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }
    db.prepare('DELETE FROM cook_logs WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cook log:', error);
    return NextResponse.json({ error: 'Failed to delete cook log' }, { status: 500 });
  }
}
