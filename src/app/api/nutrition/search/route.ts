import { getDb } from '@/lib/db';

// Cooking qualifiers that rarely appear in USDA's canonical names and otherwise
// over-narrow the match (e.g. "unsalted butter" -> "Butter, without salt").
const QUALIFIERS = new Set([
  'unsalted', 'salted', 'large', 'small', 'medium', 'extra', 'fresh', 'freshly',
  'organic', 'boneless', 'skinless', 'virgin', 'pure', 'softened', 'melted',
  'packed', 'sifted', 'ripe', 'cold', 'warm', 'room', 'ground', 'grated',
  'chopped', 'minced', 'diced', 'sliced', 'shredded', 'whole', 'fine', 'coarse',
  'kosher', 'sea', 'iodized', 'table',
]);

function words(search: string): string[] {
  return search
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

interface UsdaRow {
  fdc_id: number;
  description: string;
  food_category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

// Search the local USDA SR Legacy mirror (populated by scripts/load-usda.mjs).
// No external API / rate limits. Returns the same shape the UI already consumes.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return Response.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const db = getDb();
    const toks = words(query);
    if (toks.length === 0) return Response.json([]);

    const stmt = db.prepare(
      `SELECT f.*
       FROM usda_fts fts
       JOIN usda_foods f ON f.fdc_id = fts.fdc_id
       WHERE usda_fts MATCH ?
       ORDER BY bm25(usda_fts), length(f.description)
       LIMIT 12`
    );
    const and = (ws: string[]) => ws.map((w) => `${w}*`).join(' ');
    const or = (ws: string[]) => ws.map((w) => `${w}*`).join(' OR ');
    const run = (match: string) => stmt.all(match) as UsdaRow[];

    // 1) precise: all words. 2) drop qualifiers and retry precise.
    // 3) broaden to any-word so partial names still match.
    let rows = run(and(toks));
    if (rows.length === 0 && toks.length > 1) {
      const core = toks.filter((w) => !QUALIFIERS.has(w));
      if (core.length > 0 && core.length < toks.length) rows = run(and(core));
    }
    if (rows.length === 0 && toks.length > 1) rows = run(or(toks));

    const results = rows.map((f) => ({
      fdcId: f.fdc_id,
      description: f.description,
      foodCategory: f.food_category || 'Unknown',
      dataType: 'sr_legacy',
      nutrition: {
        calories: f.calories || 0,
        protein: f.protein || 0,
        carbs: f.carbs || 0,
        fat: f.fat || 0,
        fiber: f.fiber || 0,
        sugar: f.sugar || 0,
        sodium: f.sodium || 0,
      },
    }));

    return Response.json(results);
  } catch (error) {
    console.error('USDA local search error:', error);
    return Response.json({ error: 'Failed to search nutrition database' }, { status: 500 });
  }
}
