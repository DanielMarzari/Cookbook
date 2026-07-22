import { getDb } from '@/lib/db';
import { ahnByName, noteRows, familyTotals, pairRaw, maxPartnerRaw, synergyFromRaw, FAMILY_ORDER } from '@/lib/flavor';

// Harmonies for one ingredient: its strongest partner INGREDIENTS from the Ahn
// flavour-compound network, each annotated with the flavour FAMILY that bridges
// them (the family both carry most). Powers the chord view + ranked list + insight.
// GET ?id=<note_ingredients.id>  or  ?name=<ingredient name>
export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    const nameParam = searchParams.get('name');

    const base = (idParam
      ? db.prepare('SELECT id, name, category FROM note_ingredients WHERE id = ?').get(parseInt(idParam, 10))
      : db.prepare('SELECT id, name, category FROM note_ingredients WHERE name = ? COLLATE NOCASE').get(nameParam)) as
      | { id: number; name: string; category: string }
      | undefined;
    if (!base) return Response.json({ error: 'Ingredient not found' }, { status: 404 });

    const baseProfile = noteRows(db, base.id);
    const baseFam = familyTotals(baseProfile);
    const baseNotes = baseProfile.slice(0, 12).map((r) => ({ note: r.note, family: r.family, intensity: r.intensity }));

    const ahn = ahnByName(db, base.name);
    const cache = new Map<number, number>();
    const partners: {
      name: string; category: string; synergy: number; shared: number;
      dominantFamily: string | null; bridgeFamily: string | null;
    }[] = [];

    if (ahn) {
      const rows = db.prepare(
        `SELECT i.id, i.name, i.category, COUNT(*) AS shared, SUM(c.idf) AS score
         FROM flavor_ingredient_compounds a
         JOIN flavor_ingredient_compounds b ON a.compound_id = b.compound_id
         JOIN flavor_ingredients i ON i.id = b.ingredient_id
         JOIN flavor_compounds c ON c.id = a.compound_id
         WHERE a.ingredient_id = ? AND b.ingredient_id != ?
         GROUP BY b.ingredient_id ORDER BY score DESC LIMIT 12`
      ).all(ahn.id, ahn.id) as { id: number; name: string; category: string; shared: number; score: number }[];

      const maxBase = maxPartnerRaw(db, ahn.id, cache);
      for (const r of rows) {
        // partner's own note profile (for its families) — matched by name into the note domain
        const pn = db.prepare('SELECT id FROM note_ingredients WHERE name = ? COLLATE NOCASE').get(r.name) as { id: number } | undefined;
        let dominantFamily: string | null = null, bridgeFamily: string | null = null;
        if (pn) {
          const pFam = familyTotals(noteRows(db, pn.id));
          const domSorted = FAMILY_ORDER.filter((f) => pFam[f] > 0).sort((x, y) => pFam[y] - pFam[x]);
          dominantFamily = domSorted[0] || null;
          // bridge = family both base and partner carry, strongest by combined weight
          const shared = FAMILY_ORDER.filter((f) => baseFam[f] > 0 && pFam[f] > 0)
            .sort((x, y) => baseFam[y] + pFam[y] - (baseFam[x] + pFam[x]));
          bridgeFamily = shared[0] || dominantFamily;
        }
        partners.push({
          name: r.name, category: r.category,
          synergy: synergyFromRaw(r.score, maxBase, maxPartnerRaw(db, r.id, cache)),
          shared: r.shared, dominantFamily, bridgeFamily,
        });
      }
    }

    // Insight: which families most often bridge the base to its partners.
    const bridgeCount: Record<string, number> = {};
    for (const p of partners) if (p.bridgeFamily) bridgeCount[p.bridgeFamily] = (bridgeCount[p.bridgeFamily] || 0) + 1;
    const insightFamilies = Object.entries(bridgeCount).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([f]) => f);

    return Response.json({
      base: { id: base.id, name: base.name, category: base.category },
      baseNotes,
      partners,
      insightFamilies,
    });
  } catch (error) {
    console.error('Harmonies error:', error);
    return Response.json({ error: 'Failed to compute harmonies' }, { status: 500 });
  }
}
