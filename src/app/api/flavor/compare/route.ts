import { getDb } from '@/lib/db';
import { noteRows, familyTotals, synergyByName, FAMILY_ORDER } from '@/lib/flavor';

interface Ing { id: number; name: string; category: string }

// Compare two ingredients: both note profiles (for the overlaid wheel), a
// family-by-family facet comparison, an overall synergy read, and the notes
// that bridge them. GET ?a=<name|id>&b=<name|id>
export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const resolve = (v: string | null): Ing | undefined => {
      if (!v) return undefined;
      const asId = /^\d+$/.test(v)
        ? (db.prepare('SELECT id, name, category FROM note_ingredients WHERE id = ?').get(parseInt(v, 10)) as Ing | undefined)
        : undefined;
      return asId || (db.prepare('SELECT id, name, category FROM note_ingredients WHERE name = ? COLLATE NOCASE').get(v) as Ing | undefined);
    };
    const a = resolve(searchParams.get('a'));
    const b = resolve(searchParams.get('b'));
    if (!a || !b) return Response.json({ error: 'Both ingredients required' }, { status: 400 });

    const aRows = noteRows(db, a.id), bRows = noteRows(db, b.id);
    const groupByFam = (rows: { family: string; note: string; intensity: number }[]) =>
      FAMILY_ORDER.map((name) => ({ name, notes: rows.filter((r) => r.family === name).map((r) => ({ note: r.note, intensity: r.intensity })) }));

    const aFam = familyTotals(aRows), bFam = familyTotals(bRows);
    const maxFam = Math.max(1, ...FAMILY_ORDER.map((f) => Math.max(aFam[f], bFam[f])));
    const facets = FAMILY_ORDER.map((f) => ({
      family: f,
      a: Math.round((aFam[f] / maxFam) * 100),
      b: Math.round((bFam[f] / maxFam) * 100),
    })).filter((r) => r.a > 0 || r.b > 0);

    const cache = new Map<number, number>();
    const syn = synergyByName(db, a.name, b.name, cache);
    // notes both carry (by name), strongest first — the palate bridge
    const aNotes = new Map(aRows.map((r) => [r.note, r.intensity]));
    const bridging = bRows
      .filter((r) => aNotes.has(r.note))
      .map((r) => ({ note: r.note, family: r.family, intensity: Math.min(r.intensity, aNotes.get(r.note)!) }))
      .sort((x, y) => y.intensity - x.intensity)
      .slice(0, 8);

    return Response.json({
      a: { id: a.id, name: a.name, category: a.category, families: groupByFam(aRows), activeNotes: aRows.length },
      b: { id: b.id, name: b.name, category: b.category, families: groupByFam(bRows), activeNotes: bRows.length },
      facets,
      synergy: syn?.synergy ?? 0,
      sharedCompounds: syn?.shared ?? 0,
      compoundNotes: syn?.notes ?? [],
      bridging,
    });
  } catch (error) {
    console.error('Compare error:', error);
    return Response.json({ error: 'Failed to compare' }, { status: 500 });
  }
}
