import { getDb } from '@/lib/db';

interface Ing { id: number; name: string }

// Recipes from the user's own cookbook that use BOTH ingredients of a pair —
// resolved through the flavor_recipe_links bridge (the two data domains stay
// separate; this is the only join). GET ?a=<name|id>&b=<name|id>
export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const resolve = (v: string | null): Ing | undefined => {
      if (!v) return undefined;
      if (/^\d+$/.test(v)) return db.prepare('SELECT id, name FROM note_ingredients WHERE id = ?').get(parseInt(v, 10)) as Ing | undefined;
      return db.prepare('SELECT id, name FROM note_ingredients WHERE name = ? COLLATE NOCASE').get(v) as Ing | undefined;
    };
    const a = resolve(searchParams.get('a'));
    const b = resolve(searchParams.get('b'));
    if (!a || !b) return Response.json({ error: 'Both ingredients required' }, { status: 400 });

    // recipes that contain an ingredient linked to A and one linked to B
    const recipes = db.prepare(
      `SELECT DISTINCT r.id, r.title, r.image_url, r.cuisine_type AS cuisine
       FROM recipes r
       JOIN recipe_ingredients ria ON ria.recipe_id = r.id
       JOIN flavor_recipe_links la ON la.match_name = lower(trim(ria.name)) AND la.note_ingredient_id = ?
       JOIN recipe_ingredients rib ON rib.recipe_id = r.id
       JOIN flavor_recipe_links lb ON lb.match_name = lower(trim(rib.name)) AND lb.note_ingredient_id = ?
       ORDER BY r.title`
    ).all(a.id, b.id) as { id: string; title: string; image_url: string | null; cuisine: string | null }[];

    return Response.json({
      a: { id: a.id, name: a.name },
      b: { id: b.id, name: b.name },
      recipes,
    });
  } catch (error) {
    console.error('recipes-for-pair error:', error);
    return Response.json({ error: 'Failed to find recipes' }, { status: 500 });
  }
}
