import { getDb } from '@/lib/db';

interface PairRow {
  id: number;
  name: string;
  category: string;
  shared: number;
  score: number;
  notes: string;
}

// Rank an ingredient's flavor pairings by shared-compound overlap, weighted by
// each compound's IDF so distinctive shared aromas count for more than ubiquitous
// ones. Based on the Ahn et al. flavor network (Nature Sci. Reports 2011).
export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const name = searchParams.get('name');

    let base: { id: number; name: string; category: string } | undefined;
    if (idParam) {
      base = db.prepare('SELECT id, name, category FROM flavor_ingredients WHERE id = ?').get(parseInt(idParam, 10)) as typeof base;
    } else if (name) {
      base = db.prepare('SELECT id, name, category FROM flavor_ingredients WHERE name = ? COLLATE NOCASE').get(name) as typeof base;
    }
    if (!base) {
      return Response.json({ error: 'Ingredient not found' }, { status: 404 });
    }

    const rows = db
      .prepare(
        `SELECT i.id, i.name, i.category,
                COUNT(*) AS shared,
                SUM(c.idf) AS score,
                GROUP_CONCAT(c.name, '|') AS notes
         FROM flavor_ingredient_compounds a
         JOIN flavor_ingredient_compounds b ON a.compound_id = b.compound_id
         JOIN flavor_ingredients i ON i.id = b.ingredient_id
         JOIN flavor_compounds c ON c.id = a.compound_id
         WHERE a.ingredient_id = ? AND b.ingredient_id != ?
         GROUP BY b.ingredient_id
         ORDER BY score DESC
         LIMIT 24`
      )
      .all(base.id, base.id) as PairRow[];

    const top = rows[0]?.score || 1;
    const pairings = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      shared: r.shared,
      strength: Math.round((100 * r.score) / top),
      notes: (r.notes || '').split('|').slice(0, 6),
    }));

    return Response.json({ id: base.id, name: base.name, category: base.category, pairings });
  } catch (error) {
    console.error('Flavor pairings error:', error);
    return Response.json({ error: 'Failed to compute pairings' }, { status: 500 });
  }
}
