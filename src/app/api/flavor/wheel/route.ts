import { getDb } from '@/lib/db';

// Everything the flavor wheel + pairing autocomplete needs, in one call:
// all ingredients (id, name, category) and per-category counts.
export async function GET() {
  try {
    const db = getDb();
    const ingredients = db
      .prepare('SELECT id, name, category FROM flavor_ingredients ORDER BY name ASC')
      .all() as { id: number; name: string; category: string }[];
    const categories = db
      .prepare('SELECT category AS name, COUNT(*) AS count FROM flavor_ingredients GROUP BY category ORDER BY count DESC')
      .all() as { name: string; count: number }[];
    return Response.json({ categories, ingredients });
  } catch (error) {
    console.error('Flavor wheel error:', error);
    return Response.json({ error: 'Failed to load flavor data' }, { status: 500 });
  }
}
