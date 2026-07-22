import { getDb } from '@/lib/db';
import { ahnByName, pairRaw, maxPartnerRaw, synergyFromRaw, mergedProfile } from '@/lib/flavor';

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

    // pairwise synergy among the recipe's mapped ingredients
    const cache = new Map<number, number>();
    const ahn = mapped.map((m) => ({ m, a: ahnByName(db, m.name) })).filter((x) => x.a) as { m: Mapped; a: { id: number; name: string } }[];
    const pairs: { a: string; b: string; synergy: number }[] = [];
    for (let i = 0; i < ahn.length; i++)
      for (let j = i + 1; j < ahn.length; j++) {
        const { raw } = pairRaw(db, ahn[i].a.id, ahn[j].a.id);
        pairs.push({
          a: ahn[i].m.name, b: ahn[j].m.name,
          synergy: synergyFromRaw(raw, maxPartnerRaw(db, ahn[i].a.id, cache), maxPartnerRaw(db, ahn[j].a.id, cache)),
        });
      }
    pairs.sort((x, y) => y.synergy - x.synergy);
    const harmony = pairs.length ? Math.round(pairs.reduce((s, p) => s + p.synergy, 0) / pairs.length) : 0;

    // one boost: the partner (outside the recipe) with the highest mean synergy to the plate
    const memberIds = new Set(ahn.map((x) => x.a.id));
    const memberNames = new Set(mapped.map((m) => m.name.toLowerCase()));
    const cand = new Map<string, { name: string; sum: number }>();
    for (const { a } of ahn) {
      const rows = db.prepare(
        `SELECT i.id, i.name FROM flavor_ingredient_compounds x
         JOIN flavor_ingredient_compounds y ON x.compound_id = y.compound_id
         JOIN flavor_ingredients i ON i.id = y.ingredient_id
         JOIN flavor_compounds c ON c.id = x.compound_id
         WHERE x.ingredient_id = ? AND y.ingredient_id != ?
         GROUP BY y.ingredient_id ORDER BY SUM(c.idf) DESC LIMIT 15`
      ).all(a.id, a.id) as { id: number; name: string }[];
      for (const r of rows) {
        if (memberIds.has(r.id) || memberNames.has(r.name.toLowerCase())) continue;
        const { raw } = pairRaw(db, r.id, a.id);
        const s = synergyFromRaw(raw, maxPartnerRaw(db, r.id, cache), maxPartnerRaw(db, a.id, cache));
        const c0 = cand.get(r.name) || { name: r.name, sum: 0 };
        c0.sum += s; cand.set(r.name, c0);
      }
    }
    const boostTop = [...cand.values()].map((c) => ({ name: c.name, lift: Math.round(c.sum / Math.max(1, ahn.length)) }))
      .sort((a, b) => b.lift - a.lift)[0] || null;

    return Response.json({
      recipe,
      ingredients: mapped.map((m) => m.name),
      merged,
      harmony,
      tightestPairs: pairs.slice(0, 3),
      boost: boostTop,
    });
  } catch (error) {
    console.error('recipe-harmony error:', error);
    return Response.json({ error: 'Failed to compute recipe harmony' }, { status: 500 });
  }
}
