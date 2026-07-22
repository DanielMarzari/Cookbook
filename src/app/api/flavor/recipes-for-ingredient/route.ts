import { getDb } from '@/lib/db';

// Recipes from the user's cookbook that use a single ingredient, via the
// flavor_recipe_links bridge. Powers the contextual "in your recipes" strip on
// the Wheel tab. GET ?id=<note_ingredients.id>
export async function GET(request: Request) {
  try {
    const db = getDb();
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return Response.json({ error: 'id required' }, { status: 400 });
    const recipes = db.prepare(
      `SELECT DISTINCT r.id, r.title, r.image_url, r.cuisine_type AS cuisine
       FROM recipes r
       JOIN recipe_ingredients ri ON ri.recipe_id = r.id
       JOIN flavor_recipe_links l ON l.match_name = lower(trim(ri.name)) AND l.note_ingredient_id = ?
       ORDER BY r.title LIMIT 24`
    ).all(parseInt(id, 10)) as { id: string; title: string; image_url: string | null; cuisine: string | null }[];
    return Response.json({ recipes });
  } catch (error) {
    console.error('recipes-for-ingredient error:', error);
    return Response.json({ error: 'Failed to load recipes' }, { status: 500 });
  }
}
