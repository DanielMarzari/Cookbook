import { getDb } from '@/lib/db';
import { mergedProfile, plateHarmony, harmonyNextAdds, flavorGrams, perceptualWeights } from '@/lib/flavor';
import { flattenRecipe } from '@/lib/subrecipe';

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

    // Resolve sub-recipes first: a row pointing at "Cannoli Filling" isn't an
    // ingredient the flavour DB knows, but the ricotta and vanilla inside it are.
    // Quantities come back already scaled by how much of the child is used.
    const { ingredients: flat } = flattenRecipe(db, recipeId);
    const link = db.prepare(
      `SELECT n.id, n.name FROM flavor_recipe_links l
       JOIN note_ingredients n ON n.id = l.note_ingredient_id
       WHERE l.match_name = ?`
    );
    const rows = flat.flatMap((f) => {
      const m = link.get(f.name.toLowerCase().trim()) as Mapped | undefined;
      return m ? [{ ...m, quantity: f.quantity, unit: f.unit }] : [];
    });

    // One member per ingredient, but listing something twice means MORE of it, so
    // the masses add up rather than one row winning.
    const byIng = new Map<number, { id: number; name: string; grams: number | null }>();
    for (const r of rows) {
      const g = flavorGrams(r.quantity, r.unit);
      const cur = byIng.get(r.id);
      if (!cur) byIng.set(r.id, { id: r.id, name: r.name, grams: g });
      else if (g != null) cur.grams = (cur.grams ?? 0) + g;
    }
    const mapped = [...byIng.values()];

    const weights = perceptualWeights(mapped.map((m) => m.grams));
    const weighted = mapped.map((m, i) => ({ ...m, weight: weights[i] }));

    const merged = mergedProfile(db, mapped.map((m) => m.id));

    // Overall harmony = mean pairwise note-association harmony among mapped
    // ingredients. Reported both ways: `harmony` treats every ingredient as an
    // equal partner (what the Lab has always shown), `byProportion` weights each
    // pair by how much of it is actually in the dish. Showing both keeps the
    // change auditable — nothing is silently rescored.
    const { harmony, pairs } = plateHarmony(db, mapped);
    const { harmony: harmonyByProportion } = plateHarmony(db, weighted);

    // one boost: the ingredient (outside the recipe) that best harmonises with the plate
    const add = harmonyNextAdds(db, mapped.map((m) => m.id), 1)[0];
    const boost = add ? { name: add.name, lift: add.fit } : null;

    return Response.json({
      recipe,
      ingredients: mapped.map((m) => m.name),
      // proportion of the dish each ingredient makes up, so the weighting is
      // readable rather than a hidden multiplier
      proportions: weighted
        .map((m) => ({ name: m.name, pct: Math.round(m.weight * 100), grams: m.grams }))
        .sort((a, b) => b.pct - a.pct),
      merged,
      harmony,
      harmonyByProportion,
      tightestPairs: pairs.slice(0, 3).map((p) => ({ a: p.a, b: p.b, synergy: p.harmony })),
      boost,
    });
  } catch (error) {
    console.error('recipe-harmony error:', error);
    return Response.json({ error: 'Failed to compute recipe harmony' }, { status: 500 });
  }
}
