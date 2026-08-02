import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export interface Source {
  id: string;
  name: string;
  kind: string | null;
  featured: number;
  recipe_count?: number;
}

/** GET — every source, with how many recipes each accounts for. */
export async function GET() {
  try {
    const db = getDb();
    const sources = db.prepare(
      `SELECT s.id, s.name, s.kind, s.featured,
              (SELECT COUNT(*) FROM recipes r WHERE r.source_id = s.id) AS recipe_count
       FROM sources s ORDER BY featured DESC, recipe_count DESC, name`
    ).all() as Source[];
    return NextResponse.json({ sources });
  } catch (error) {
    console.error('Error listing sources:', error);
    return NextResponse.json({ error: 'Failed to list sources' }, { status: 500 });
  }
}

/**
 * POST — create a source, or return the existing one with that name.
 * Names are unique case-insensitively, which is the whole point: typing
 * "tasting history" a second time reuses the source rather than forking it.
 */
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { name, kind, featured } = await request.json();
    const clean = (name || '').trim();
    if (!clean) return NextResponse.json({ error: 'A name is required' }, { status: 400 });

    const existing = db.prepare('SELECT * FROM sources WHERE name = ? COLLATE NOCASE').get(clean) as Source | undefined;
    if (existing) return NextResponse.json({ source: existing, created: false });

    const id = `src_${clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}_${Math.random().toString(36).slice(2, 6)}`;
    db.prepare('INSERT INTO sources (id, name, kind, featured, created_at) VALUES (?, ?, ?, ?, ?)')
      .run(id, clean, kind || null, featured ? 1 : 0, new Date().toISOString());
    const source = db.prepare('SELECT * FROM sources WHERE id = ?').get(id) as Source;
    return NextResponse.json({ source, created: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating source:', error);
    return NextResponse.json({ error: 'Failed to create source' }, { status: 500 });
  }
}

/** PATCH { id, name?, kind?, featured?, mergeInto? } — rename, re-kind, feature, or merge. */
export async function PATCH(request: NextRequest) {
  try {
    const db = getDb();
    const { id, name, kind, featured, mergeInto } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    // Merging is how "Tasting History (Cookbook)" rejoins "Tasting History":
    // move its recipes across, then retire the empty source.
    if (mergeInto) {
      if (mergeInto === id) return NextResponse.json({ error: 'Cannot merge a source into itself' }, { status: 400 });
      db.transaction(() => {
        db.prepare('UPDATE recipes SET source_id = ? WHERE source_id = ?').run(mergeInto, id);
        db.prepare('DELETE FROM sources WHERE id = ?').run(id);
      })();
      return NextResponse.json({ ok: true, merged: true });
    }

    const set: string[] = [];
    const vals: unknown[] = [];
    if (name !== undefined) { set.push('name = ?'); vals.push(String(name).trim()); }
    if (kind !== undefined) { set.push('kind = ?'); vals.push(kind || null); }
    if (featured !== undefined) { set.push('featured = ?'); vals.push(featured ? 1 : 0); }
    if (set.length === 0) return NextResponse.json({ error: 'Nothing to change' }, { status: 400 });

    vals.push(id);
    db.prepare(`UPDATE sources SET ${set.join(', ')} WHERE id = ?`).run(...vals);
    const source = db.prepare('SELECT * FROM sources WHERE id = ?').get(id) as Source;
    return NextResponse.json({ source });
  } catch (error) {
    console.error('Error updating source:', error);
    return NextResponse.json({ error: 'Failed to update source' }, { status: 500 });
  }
}
