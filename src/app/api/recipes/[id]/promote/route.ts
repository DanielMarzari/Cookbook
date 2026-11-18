import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { archiveRecipe } from '@/lib/archive';

/**
 * Make this variation the base, and the old base a variation of it.
 *
 * Which version is the stem is a judgement that changes. You branch a sourdough
 * off the straight dough and six months later the sourdough is the one you
 * actually make — at which point the family is upside down, and the recipe you
 * open first is the one you have stopped cooking.
 *
 * The family stays flat, as everywhere else: the siblings re-parent to the new
 * base rather than hanging off the old one, so this swaps the stem without ever
 * making a tree two levels deep.
 *
 * POST { label? }   label for the demoted base, default "original"
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = getDb();
    const body = await request.json().catch(() => ({}));

    type Row = {
      id: string;
      title: string;
      parent_recipe_id: string | null;
      variation_of_label: string | null;
      image_url: string | null;
      image_position: string | null;
      image_zoom: number | null;
      image_rotation: number | null;
    };
    const cols =
      'id, title, parent_recipe_id, variation_of_label, image_url, image_position, image_zoom, image_rotation';

    const promoted = db.prepare(`SELECT ${cols} FROM recipes WHERE id = ?`).get(id) as Row | undefined;
    if (!promoted) return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    if (!promoted.parent_recipe_id) {
      return NextResponse.json({ error: 'That recipe is already the base' }, { status: 400 });
    }

    const oldBaseId = promoted.parent_recipe_id;
    const oldBase = db.prepare(`SELECT ${cols} FROM recipes WHERE id = ?`).get(oldBaseId) as Row | undefined;
    if (!oldBase) return NextResponse.json({ error: 'That family has no base' }, { status: 409 });

    const siblings = db
      .prepare('SELECT id FROM recipes WHERE parent_recipe_id = ? AND id <> ?')
      .all(oldBaseId, id) as { id: string }[];

    const label = String(body?.label ?? '').trim() || 'original';

    const swap = db.transaction(() => {
      // Archive everything that moves, so the whole swap undoes as one thing.
      archiveRecipe(db, id, 'commit-draft');
      archiveRecipe(db, oldBaseId, 'commit-draft');
      for (const s of siblings) archiveRecipe(db, s.id, 'commit-draft');

      // A variation with no photo of its own shows the base's. Promote one of
      // those and the family would lose its picture entirely — the old base
      // keeps the file, and nothing inherits upward. So the photo comes with
      // the promotion, framing and all, since framing describes that image.
      if (!promoted.image_url && oldBase.image_url) {
        db.prepare(
          `UPDATE recipes SET image_url = ?, image_position = ?, image_zoom = ?, image_rotation = ?
             WHERE id = ?`,
        ).run(oldBase.image_url, oldBase.image_position, oldBase.image_zoom, oldBase.image_rotation, id);
      }

      // Stand the new base up first, so no row is briefly pointing at a parent
      // that is itself about to become a child.
      db.prepare('UPDATE recipes SET parent_recipe_id = NULL, variation_of_label = NULL WHERE id = ?').run(id);

      // Siblings move across before the old base does, so they are never
      // orphaned mid-swap.
      db.prepare('UPDATE recipes SET parent_recipe_id = ? WHERE parent_recipe_id = ?').run(id, oldBaseId);

      db.prepare('UPDATE recipes SET parent_recipe_id = ?, variation_of_label = ? WHERE id = ?').run(
        id,
        label,
        oldBaseId,
      );
    });
    swap();

    return NextResponse.json({
      ok: true,
      baseId: id,
      promoted: promoted.title,
      demoted: oldBase.title,
      label,
      moved: siblings.length,
      // The titles usually encode the old order ("Sorbet — Apple Cider" under
      // "Sorbet"), and this does not rename anything. Said plainly so the
      // caller can offer it rather than the family reading backwards in silence.
      titlesUnchanged: true,
    });
  } catch (error) {
    console.error('Error promoting variation:', error);
    return NextResponse.json({ error: 'Failed to promote' }, { status: 500 });
  }
}
