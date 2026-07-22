import { getDb } from '@/lib/db';
import { ahnByName, pairRaw, maxPartnerRaw, synergyFromRaw, mergedProfile, plateHarmony, harmonyNextAdds } from '@/lib/flavor';

interface Ing { id: number; name: string }

// The Bench: merge a build into one combined wheel, score the plate's cohesion
// (HARMONY — note-association, the headline) and its aroma AFFINITY (shared
// compounds), and rank the next ingredient to add by note-harmony fit.
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

    // Cohesion = mean pairwise HARMONY (note co-occurrence); the headline score.
    const { harmony, pairs } = plateHarmony(db, members);

    // Aroma affinity = mean pairwise shared-compound synergy (secondary read).
    const cache = new Map<number, number>();
    const ahn = members.map((m) => ({ m, a: ahnByName(db, m.name) })).filter((x) => x.a) as { m: Ing; a: { id: number; name: string } }[];
    let affSum = 0, affN = 0;
    for (let i = 0; i < ahn.length; i++)
      for (let j = i + 1; j < ahn.length; j++) {
        const { raw } = pairRaw(db, ahn[i].a.id, ahn[j].a.id);
        affSum += synergyFromRaw(raw, maxPartnerRaw(db, ahn[i].a.id, cache), maxPartnerRaw(db, ahn[j].a.id, cache));
        affN++;
      }
    const affinity = affN ? Math.round(affSum / affN) : 0;

    const nextAdds = harmonyNextAdds(db, members.map((m) => m.id), 6);

    return Response.json({
      members: members.map((m) => ({ id: m.id, name: m.name })),
      inNetwork: ahn.length,
      merged,
      harmony,
      affinity,
      tightestPairs: pairs.slice(0, 3),
      nextAdds,
    });
  } catch (error) {
    console.error('Lab error:', error);
    return Response.json({ error: 'Failed to run lab' }, { status: 500 });
  }
}
