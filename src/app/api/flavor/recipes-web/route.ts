// Find real online recipes that use a plate's combo, for the "cook this base" cards.
// Source: TheMealDB (free, keyless). We filter meals by each ingredient and keep the
// meals that contain ALL of them; if that's empty we relax to the best pair, then the
// single most-distinctive ingredient — so the shelf is rarely empty. Each card is a
// real recipe with a photo + a link out.
// GET ?ingredients=Tomato,Basil,Olive%20oil

const BASE = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=';
// map our note-ingredient names onto TheMealDB's ingredient vocabulary
const ALIAS: Record<string, string> = {
  'tomato': 'Tomatoes', 'olive oil': 'Olive Oil', 'chili': 'Chilli', 'chilli': 'Chilli',
  'parmesan cheese': 'Parmesan', 'spring onion': 'Spring Onions', 'coriander': 'Coriander',
  'sesame oil': 'Sesame Oil', 'soy sauce': 'Soy Sauce', 'fish sauce': 'Fish Sauce',
  'red wine': 'Red Wine', 'egg': 'Eggs', 'egg yolk': 'Egg Yolks', 'pine nuts': 'Pine Nuts',
};
const mealName = (n: string) => ALIAS[n.toLowerCase()] || n;

type Meal = { idMeal: string; strMeal: string; strMealThumb: string };
const cache = new Map<string, { at: number; cards: unknown[] }>();
const TTL = 1000 * 60 * 60; // 1h

async function filterBy(ing: string): Promise<Map<string, Meal>> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(BASE + encodeURIComponent(mealName(ing)), { signal: ctrl.signal });
    const data = (await res.json()) as { meals: Meal[] | null };
    const m = new Map<string, Meal>();
    for (const meal of data.meals || []) m.set(meal.idMeal, meal);
    return m;
  } catch {
    return new Map();
  } finally {
    clearTimeout(t);
  }
}

export async function GET(request: Request) {
  try {
    const raw = new URL(request.url).searchParams.get('ingredients') || '';
    const ings = raw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 5);
    if (ings.length === 0) return Response.json({ recipes: [] });

    const key = ings.map((s) => s.toLowerCase()).sort().join('|');
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < TTL) return Response.json({ recipes: hit.cards });

    const sets = await Promise.all(ings.map(filterBy));

    // Tally which of the plate's ingredients each meal actually contains, then
    // rank by completeness. We keep full matches and near-misses (at most one
    // ingredient short, never fewer than two matched) and report `missing` on
    // every card, so a partial match is labelled rather than passed off as the
    // combo — that mislabelling was the bug.
    const byId = new Map<string, { meal: Meal; matched: number[] }>();
    sets.forEach((s, idx) => {
      for (const [id, meal] of s) {
        const e = byId.get(id) || { meal, matched: [] };
        e.matched.push(idx);
        byId.set(id, e);
      }
    });
    const need = Math.max(2, ings.length - 1);
    const cards = [...byId.values()]
      .filter((e) => e.matched.length >= Math.min(need, ings.length))
      .sort((a, b) => b.matched.length - a.matched.length)
      .slice(0, 6)
      .map((e) => ({
        title: e.meal.strMeal,
        image: e.meal.strMealThumb,
        link: `https://www.themealdb.com/meal/${e.meal.idMeal}`,
        source: 'themealdb.com',
        matched: e.matched.map((i) => ings[i]),
        missing: ings.filter((_, i) => !e.matched.includes(i)),
      }));
    cache.set(key, { at: Date.now(), cards });
    return Response.json({ recipes: cards });
  } catch (error) {
    console.error('recipes-web error:', error);
    return Response.json({ recipes: [] });
  }
}
