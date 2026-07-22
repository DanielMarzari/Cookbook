import { getDb } from '@/lib/db';
import { noteRows, synergyByName, harmonyByName, FAMILY_ORDER } from '@/lib/flavor';

interface Ing { id: number; name: string; category: string }

// The flavour RELATIONSHIP between two ingredients (the two-input Harmonies page).
// Returns both metrics — aroma AFFINITY (shared compounds) and HARMONY (evidence-based
// note co-occurrence) — the note→note bridges behind the harmony, both profiles for
// the overlaid wheel, and "the evidence": recipes that use both.
// GET ?a=<name|id>&b=<name|id>
export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const resolve = (v: string | null): Ing | undefined => {
      if (!v) return undefined;
      if (/^\d+$/.test(v)) return db.prepare('SELECT id, name, category FROM note_ingredients WHERE id = ?').get(parseInt(v, 10)) as Ing | undefined;
      return db.prepare('SELECT id, name, category FROM note_ingredients WHERE name = ? COLLATE NOCASE').get(v) as Ing | undefined;
    };
    const a = resolve(searchParams.get('a'));
    const b = resolve(searchParams.get('b'));
    if (!a || !b) return Response.json({ error: 'Both ingredients required' }, { status: 400 });

    const groupByFam = (rows: { family: string; note: string; intensity: number }[]) =>
      FAMILY_ORDER.map((name) => ({ name, notes: rows.filter((r) => r.family === name).map((r) => ({ note: r.note, intensity: r.intensity })) }));
    const aRows = noteRows(db, a.id), bRows = noteRows(db, b.id);

    const cache = new Map<number, number>();
    const affinity = synergyByName(db, a.name, b.name, cache);
    const harm = harmonyByName(db, a.name, b.name);

    // "The evidence": the user's own recipes that use both, via the bridge.
    const recipes = db.prepare(
      `SELECT DISTINCT r.id, r.title, r.image_url, r.cuisine_type AS cuisine
       FROM recipes r
       JOIN recipe_ingredients ria ON ria.recipe_id = r.id
       JOIN flavor_recipe_links la ON la.match_name = lower(trim(ria.name)) AND la.note_ingredient_id = ?
       JOIN recipe_ingredients rib ON rib.recipe_id = r.id
       JOIN flavor_recipe_links lb ON lb.match_name = lower(trim(rib.name)) AND lb.note_ingredient_id = ?
       ORDER BY r.title`
    ).all(a.id, b.id) as { id: string; title: string; image_url: string | null; cuisine: string | null }[];

    return Response.json({
      a: { id: a.id, name: a.name, category: a.category, families: groupByFam(aRows), activeNotes: aRows.length },
      b: { id: b.id, name: b.name, category: b.category, families: groupByFam(bRows), activeNotes: bRows.length },
      affinity: affinity?.synergy ?? 0,
      sharedCompounds: affinity?.shared ?? 0,
      compoundNotes: affinity?.notes?.slice(0, 6) ?? [],
      harmony: harm?.harmony ?? 0,
      bridges: harm?.bridges ?? [],
      recipes,
    });
  } catch (error) {
    console.error('relationship error:', error);
    return Response.json({ error: 'Failed to compute relationship' }, { status: 500 });
  }
}
