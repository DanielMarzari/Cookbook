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

    // A recipe joining with variations of its own brings them along, and the two
    // families flatten into one — they all become variations of the same base,
    // siblings rather than a second level. Keeping the model flat is the point:
    // "this dish and its versions" stays scannable, a tree does not.
    const brought = db.prepare('SELECT id, title FROM recipes WHERE parent_recipe_id = ?').all(childId) as
      { id: string; title: string }[];

    const join = db.transaction(() => {
      // Archive everything that changes, so the whole join is undoable together.
      archiveRecipe(db, childId, 'commit-draft');
      for (const b of brought) archiveRecipe(db, b.id, 'commit-draft');

      // The child's own variations re-parent to the new base first, so they are
      // never briefly orphaned by the child moving out from under them.
      db.prepare('UPDATE recipes SET parent_recipe_id = ? WHERE parent_recipe_id = ?').run(baseId, childId);
      db.prepare('UPDATE recipes SET parent_recipe_id = ?, variation_of_label = COALESCE(?, variation_of_label) WHERE id = ?')
        .run(baseId, label || null, childId);
    });
    join();

    return NextResponse.json({
      ok: true,
      baseId,
      child: child.title,
      // how many came along, so the caller can say what actually happened
      broughtCount: brought.length,
      brought: brought.map((b) => b.title),
    });
  } catch (error) {
    console.error('Error linking recipes:', error);
    return NextResponse.json({ error: 'Failed to link those recipes' }, { status: 500 });
  }
}
