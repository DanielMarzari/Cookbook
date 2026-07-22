import { getDb } from '@/lib/db';
import { ahnByName, noteRows, familyTotals, pairRaw, maxPartnerRaw, synergyFromRaw, mergedProfile, FAMILY_ORDER } from '@/lib/flavor';

interface Ing { id: number; name: string }

// The Bench: merge a build of ingredients into one combined wheel, score the
// plate's synergy, and rank the next ingredient that lifts it most.
// POST { ids: number[] }  (note_ingredients ids)
export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json().catch(() => ({}));
    const ids: number[] = Array.isArray(body.ids) ? body.ids.map((n: unknown) => parseInt(String(n), 10)).filter(Boolean) : [];
    if (ids.length === 0) return Response.json({ error: 'No ingredients' }, { status: 400 });

    const members = ids
      .map((id) => db.prepare('SELECT id, name FROM note_ingredients WHERE id = ?').get(id) as Ing | undefined)
      .filter(Boolean) as Ing[];
    if (members.length === 0) return Response.json({ error: 'No valid ingredients' }, { status: 400 });

    const merged = mergedProfile(db, members.map((m) => m.id));

    // Resolve each member to the Ahn network for pairwise synergy.
    const cache = new Map<number, number>();
    const ahn = members.map((m) => ({ m, a: ahnByName(db, m.name) })).filter((x) => x.a) as { m: Ing; a: { id: number; name: string } }[];

    // Plate synergy = mean pairwise synergy across members present in the network.
    let synSum = 0, synN = 0;
    for (let i = 0; i < ahn.length; i++)
      for (let j = i + 1; j < ahn.length; j++) {
        const { raw } = pairRaw(db, ahn[i].a.id, ahn[j].a.id);
        synSum += synergyFromRaw(raw, maxPartnerRaw(db, ahn[i].a.id, cache), maxPartnerRaw(db, ahn[j].a.id, cache));
        synN++;
      }
    const synergy = synN ? Math.round(synSum / synN) : 0;

    // Candidate next-adds: union of each member's top Ahn partners, minus members.
    const memberAhnIds = new Set(ahn.map((x) => x.a.id));
    const memberNames = new Set(members.map((m) => m.name.toLowerCase()));
    const candidateScore = new Map<string, { name: string; sum: number; n: number }>();
    for (const { a } of ahn) {
      const rows = db.prepare(
        `SELECT i.id, i.name FROM flavor_ingredient_compounds x
         JOIN flavor_ingredient_compounds y ON x.compound_id = y.compound_id
         JOIN flavor_ingredients i ON i.id = y.ingredient_id
         JOIN flavor_compounds c ON c.id = x.compound_id
         WHERE x.ingredient_id = ? AND y.ingredient_id != ?
         GROUP BY y.ingredient_id ORDER BY SUM(c.idf) DESC LIMIT 25`
      ).all(a.id, a.id) as { id: number; name: string }[];
      for (const r of rows) {
        if (memberAhnIds.has(r.id) || memberNames.has(r.name.toLowerCase())) continue;
        // mean synergy of this candidate with the whole plate
        const { raw } = pairRaw(db, r.id, a.id);
        const s = synergyFromRaw(raw, maxPartnerRaw(db, r.id, cache), maxPartnerRaw(db, a.id, cache));
        const cur = candidateScore.get(r.name) || { name: r.name, sum: 0, n: 0 };
        cur.sum += s; cur.n++;
        candidateScore.set(r.name, cur);
      }
    }
    const nextAdds = [...candidateScore.values()]
      .map((c) => {
        // only count candidates that connect to most of the plate
        const lift = Math.round(c.sum / ahn.length);
        const note = db.prepare('SELECT id, category FROM note_ingredients WHERE name = ? COLLATE NOCASE').get(c.name) as { id: number; category: string } | undefined;
        let family: string | null = null;
        if (note) {
          const fam = familyTotals(noteRows(db, note.id));
          family = FAMILY_ORDER.filter((f) => fam[f] > 0).sort((x, y) => fam[y] - fam[x])[0] || null;
        }
        return { name: c.name, noteId: note?.id ?? null, lift, family };
      })
      .filter((c) => c.noteId != null && c.lift > 0)
      .sort((a, b) => b.lift - a.lift)
      .slice(0, 6);

    return Response.json({
      members: members.map((m) => ({ id: m.id, name: m.name })),
      inNetwork: ahn.length,
      merged,
      synergy,
      nextAdds,
    });
  } catch (error) {
    console.error('Lab error:', error);
    return Response.json({ error: 'Failed to run lab' }, { status: 500 });
  }
}
