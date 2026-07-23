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

function intersect(sets: Map<string, Meal>[]): Meal[] {
  if (sets.length === 0) return [];
  const [first, ...rest] = sets;
  const out: Meal[] = [];
  for (const [id, meal] of first) if (rest.every((s) => s.has(id))) out.push(meal);
  return out;
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
    const nonEmpty = sets.filter((s) => s.size > 0);
    const bySize = [...nonEmpty].sort((a, b) => a.size - b.size); // rarest ingredient first

    // Exact combo first (all ingredients); if thin, relax to the two rarest
    // ingredients so cards still share most of the base. No single-ingredient
    // fallback — a recipe with only one of them isn't "this combo".
    const seen = new Set<string>();
    const meals: Meal[] = [];
    const push = (list: Meal[]) => { for (const m of list) if (!seen.has(m.idMeal)) { seen.add(m.idMeal); meals.push(m); } };
    push(intersect(nonEmpty));
    if (meals.length < 6 && bySize.length > 2) push(intersect(bySize.slice(0, 2)));

    const cards = meals.slice(0, 6).map((m) => ({
      title: m.strMeal,
      image: m.strMealThumb,
      link: `https://www.themealdb.com/meal/${m.idMeal}`,
      source: 'themealdb.com',
    }));
    cache.set(key, { at: Date.now(), cards });
    return Response.json({ recipes: cards });
  } catch (error) {
    console.error('recipes-web error:', error);
    return Response.json({ recipes: [] });
  }
}
