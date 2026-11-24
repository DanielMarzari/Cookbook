import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * Rename what a branch is called within its family.
 *
 * A variation has two names. Its title is the recipe's own name, which is what
 * you see everywhere in the cookbook; its label is the short word the family
 * uses for it, which is what the version chips read — "base · anisette · almond
 * · orange · fig". The label was set once, when the branch was created, and from
 * then on there was nowhere to change it, so a branch that turned from marsala
 * into walnut went on being called marsala.
 *
 * Separate from the ordinary recipe PUT on purpose: that route COALESCEs every
 * field, which means it cannot write a null, and clearing a label back to
 * nothing has to be possible.
 *
 * POST { label }   empty or absent clears it, and the chip falls back to the title
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const body = await request.json().catch(() => ({}));

    const row = db.prepare('SELECT id, title, parent_recipe_id FROM recipes WHERE id = ?').get(id) as
      | { id: string; title: string; parent_recipe_id: string | null }
      | undefined;
    if (!row) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    if (!row.parent_recipe_id) {
      // The base is not a branch of anything, so it has nothing to be labelled
      // within. It is called "base" everywhere, and that is not editable text.
      return NextResponse.json({ error: 'The base has no branch label — rename the recipe instead' }, { status: 400 });
    }

    // Labels sit in a row of chips beside each other, so they are stored the way
    // they are displayed: short, lower case, no surrounding punctuation.
    const raw = typeof body?.label === 'string' ? body.label : '';
    const label = raw.trim().replace(/^[—–-]\s*/, '').toLowerCase() || null;

    db.prepare('UPDATE recipes SET variation_of_label = ?, updated_at = ? WHERE id = ?').run(
      label,
      new Date().toISOString(),
      id,
    );

    return NextResponse.json({ ok: true, id, title: row.title, label });
  } catch (error) {
    console.error('Error renaming branch label:', error);
    return NextResponse.json({ error: 'Failed to rename that branch' }, { status: 500 });
  }
}
