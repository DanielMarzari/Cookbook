import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { archiveRecipe } from '@/lib/archive';

/**
 * Make an existing recipe a variation of this one — branching two recipes you
 * already have, rather than forking a copy.
 *
 * You often don't realise two dishes are the same dish until both exist. This
 * joins them without duplicating anything: the child keeps its ingredients,
 * steps, photos and history, and simply gains a parent.
 *
 * POST { childId, label? }        adopt childId into this recipe's family
 * POST { childId, detach: true }  release it back to standing on its own
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const { childId, label, detach } = await request.json();
    if (!childId) return NextResponse.json({ error: 'childId is required' }, { status: 400 });

    const child = db.prepare('SELECT id, title, parent_recipe_id FROM recipes WHERE id = ?').get(childId) as
      | { id: string; title: string; parent_recipe_id: string | null }
      | undefined;
    if (!child) return NextResponse.json({ error: 'That recipe no longer exists' }, { status: 404 });

    if (detach) {
      archiveRecipe(db, childId, 'commit-draft');
      db.prepare('UPDATE recipes SET parent_recipe_id = NULL, variation_of_label = NULL WHERE id = ?').run(childId);
      return NextResponse.json({ ok: true, detached: true });
    }

    const parent = db.prepare('SELECT id, title, parent_recipe_id FROM recipes WHERE id = ?').get(id) as
      | { id: string; title: string; parent_recipe_id: string | null }
      | undefined;
    if (!parent) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    if (childId === id) return NextResponse.json({ error: 'A recipe cannot branch from itself' }, { status: 400 });

    // Families stay flat, so adopting into a variation attaches to its base.
    const baseId = parent.parent_recipe_id || id;
    if (childId === baseId) {
      return NextResponse.json({ error: 'That recipe is already the base of this family' }, { status: 400 });
    }

    // A recipe with variations of its own would bring them along and create a
    // second level, which this model deliberately doesn't have.
    const childHasOwn = (db.prepare('SELECT COUNT(*) AS c FROM recipes WHERE parent_recipe_id = ?').get(childId) as { c: number }).c;
    if (childHasOwn > 0) {
      return NextResponse.json(
        { error: `"${child.title}" has variations of its own — branch from it instead, or detach those first.` },
        { status: 400 }
      );
    }

    archiveRecipe(db, childId, 'commit-draft');
    db.prepare('UPDATE recipes SET parent_recipe_id = ?, variation_of_label = COALESCE(?, variation_of_label) WHERE id = ?')
      .run(baseId, label || null, childId);

    return NextResponse.json({ ok: true, baseId, child: child.title });
  } catch (error) {
    console.error('Error linking recipes:', error);
    return NextResponse.json({ error: 'Failed to link those recipes' }, { status: 500 });
  }
}
