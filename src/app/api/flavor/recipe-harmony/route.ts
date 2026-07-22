import { getDb } from '@/lib/db';
import { mergedProfile, plateHarmony, harmonyNextAdds } from '@/lib/flavor';

interface Mapped { id: number; name: string }

// Harmony read-out for one recipe, through the flavor_recipe_links bridge: the
// dish's combined mini-wheel, an overall harmony score, its tightest internal
// pairs, and one "boost" suggestion.
//   GET                    -> recipes with >=2 mapped flavour ingredients (picker)
//   GET ?recipe_id=<id>    -> the harmony card for that recipe
export async function GET(request: Request) {
  try {
    const db = getDb();
    const recipeId = new URL(request.url).searchParams.get('recipe_id');

    if (!recipeId) {
      const list = db.prepare(
        `SELECT r.id, r.title, r.image_url, COUNT(DISTINCT l.note_ingredient_id) AS mapped
         FROM recipes r
         JOIN recipe_ingredients ri ON ri.recipe_id = r.id
         JOIN flavor_recipe_links l ON l.match_name = lower(trim(ri.name))
         GROUP BY r.id HAVING mapped >= 2 ORDER BY r.title`
      ).all() as { id: string; title: string; image_url: string | null; mapped: number }[];
      return Response.json({ recipes: list });
    }

    const recipe = db.prepare('SELECT id, title, cuisine_type AS cuisine, image_url FROM recipes WHERE id = ?').get(recipeId) as
      | { id: string; title: string; cuisine: string | null; image_url: string | null }
      | undefined;
    if (!recipe) return Response.json({ error: 'Recipe not found' }, { status: 404 });

    const mapped = db.prepare(
      `SELECT DISTINCT n.id, n.name FROM recipe_ingredients ri
       JOIN flavor_recipe_links l ON l.match_name = lower(trim(ri.name))
       JOIN note_ingredients n ON n.id = l.note_ingredient_id
       WHERE ri.recipe_id = ?`
    ).all(recipeId) as Mapped[];

    const merged = mergedProfile(db, mapped.map((m) => m.id));

    // Overall harmony = mean pairwise note-association harmony among mapped ingredients.
    const { harmony, pairs } = plateHarmony(db, mapped);

    // one boost: the ingredient (outside the recipe) that best harmonises with the plate
    const add = harmonyNextAdds(db, mapped.map((m) => m.id), 1)[0];
    const boost = add ? { name: add.name, lift: add.fit } : null;

    return Response.json({
      recipe,
      ingredients: mapped.map((m) => m.name),
      merged,
      harmony,
      tightestPairs: pairs.slice(0, 3).map((p) => ({ a: p.a, b: p.b, synergy: p.harmony })),
      boost,
    });
  } catch (error) {
    console.error('recipe-harmony error:', error);
    return Response.json({ error: 'Failed to compute recipe harmony' }, { status: 500 });
  }
}
