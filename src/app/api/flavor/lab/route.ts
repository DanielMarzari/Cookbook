import { getDb } from '@/lib/db';
import { ahnByName, mergedProfile, plateHarmony, plateComplement, plateAffinity, dishScore, nextAddOptions, classifyCuisine } from '@/lib/flavor';

interface Ing { id: number; name: string }

// The Bench: merge a build into one combined wheel, score its cohesion (HARMONY)
// and aroma AFFINITY, and suggest what to add next by EITHER metric — listing only
// ingredients that would actually improve the chosen score.
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
    const { harmony, pairs } = plateHarmony(db, members);
    const complement = plateComplement(db, members);
    const affinity = plateAffinity(db, members, new Map());
    const inNetwork = members.filter((m) => ahnByName(db, m.name)).length;
    const opts = nextAddOptions(db, members);
    const score = dishScore(harmony, complement, affinity);
    // Fusion nudges may only propose ingredients the add-next engine already
    // vetted for this plate, so we never suggest something that doesn't work.
    const addable = new Map<string, { name: string; delta: number }>();
    for (const a of [...opts.harmonyAdds, ...opts.complementAdds, ...opts.affinityAdds]) {
      if (!addable.has(a.name.toLowerCase())) addable.set(a.name.toLowerCase(), { name: a.name, delta: a.delta });
    }
    const cuisine = classifyCuisine(members.map((m) => m.name), addable);

    return Response.json({
      members: members.map((m) => ({ id: m.id, name: m.name })),
      inNetwork,
      merged,
      harmony,
      complement,
      affinity,
      score,
      cuisine,
      tightestPairs: pairs.slice(0, 3),
      harmonyAdds: opts.harmonyAdds,
      complementAdds: opts.complementAdds,
      affinityAdds: opts.affinityAdds,
    });
  } catch (error) {
    console.error('Lab error:', error);
    return Response.json({ error: 'Failed to run lab' }, { status: 500 });
  }
}
