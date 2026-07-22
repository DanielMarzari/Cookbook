import { getDb } from '@/lib/db';

// Canonical family order around the flavour wheel.
const FAMILY_ORDER = ['Sweet', 'Acidic', 'Floral', 'Herbal', 'Vegetal', 'Spice', 'Woody', 'Earthy', 'Maillard', 'Carnal'];

interface NoteRow { family: string; note: string; intensity: number }

// Flavour NOTE PROFILES, derived from FlavorDB2 (incorporating FlavorNet).
// GET            -> { families, ingredients:[{id,name,category}] }  (search + wheel)
// GET ?id=<int>  -> one ingredient's profile grouped by family, for the wheel.
export async function GET(request: Request) {
  try {
    const db = getDb();
    const id = new URL(request.url).searchParams.get('id');

    if (!id) {
      const ingredients = db
        .prepare('SELECT id, name, category FROM note_ingredients ORDER BY name ASC')
        .all() as { id: number; name: string; category: string }[];
      // Note vocabulary per family (the most common notes) — the faint "all notes"
      // ring the wheel draws behind an ingredient's active notes.
      const vocabRows = db
        .prepare(
          `SELECT family, note, COUNT(DISTINCT ingredient_id) AS freq
           FROM note_profiles GROUP BY family, note`
        )
        .all() as { family: string; note: string; freq: number }[];
      const vocabulary: Record<string, string[]> = {};
      for (const f of FAMILY_ORDER) vocabulary[f] = [];
      for (const r of vocabRows) if (vocabulary[r.family]) vocabulary[r.family].push(r.note);
      // keep the ~16 most common notes per family for a legible ring
      const byFreq = new Map(vocabRows.map((r) => [r.family + '|' + r.note, r.freq]));
      for (const f of FAMILY_ORDER) {
        vocabulary[f] = vocabulary[f]
          .sort((a, b) => (byFreq.get(f + '|' + b)! - byFreq.get(f + '|' + a)!))
          .slice(0, 16)
          .sort((a, b) => a.localeCompare(b));
      }
      return Response.json({ families: FAMILY_ORDER, vocabulary, ingredients });
    }

    const ing = db
      .prepare('SELECT id, name, category FROM note_ingredients WHERE id = ?')
      .get(parseInt(id, 10)) as { id: number; name: string; category: string } | undefined;
    if (!ing) return Response.json({ error: 'Ingredient not found' }, { status: 404 });

    const rows = db
      .prepare('SELECT family, note, intensity FROM note_profiles WHERE ingredient_id = ? ORDER BY intensity DESC')
      .all(ing.id) as NoteRow[];

    const byFam = new Map<string, { note: string; intensity: number }[]>(FAMILY_ORDER.map((f) => [f, []]));
    for (const r of rows) byFam.get(r.family)?.push({ note: r.note, intensity: r.intensity });

    return Response.json({
      id: ing.id,
      name: ing.name,
      category: ing.category,
      activeNotes: rows.length,
      families: FAMILY_ORDER.map((name) => ({ name, notes: byFam.get(name) || [] })),
      strongest: rows.slice(0, 6).map((r) => ({ note: r.note, family: r.family, intensity: r.intensity })),
    });
  } catch (error) {
    console.error('Flavour notes error:', error);
    return Response.json({ error: 'Failed to load note profiles' }, { status: 500 });
  }
}
