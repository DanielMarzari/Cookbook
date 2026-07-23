// Shared flavour helpers. Constants are client-safe (no runtime db import — only
// `import type`), so components can import FAMILY_ORDER / FAMILY_COLORS from here.
// The scoring functions take a better-sqlite3 handle passed in by API routes.
import type Database from 'better-sqlite3';
import { CUISINES } from '@/data/cuisines';

// Canonical family order around the wheel + one hue each (the colour IS the data
// in the flavour section — the one place it leaves the monochrome system).
export const FAMILY_ORDER = ['Sweet', 'Acidic', 'Floral', 'Herbal', 'Vegetal', 'Spice', 'Woody', 'Earthy', 'Maillard', 'Carnal'] as const;
export type Family = (typeof FAMILY_ORDER)[number];

export const FAMILY_COLORS: Record<string, string> = {
  Sweet: '#4E7FA6', Acidic: '#6E6FA8', Floral: '#9166A6', Herbal: '#A85C82',
  Vegetal: '#C2546A', Spice: '#CE6A4A', Woody: '#D2954C', Earthy: '#C6A24A',
  Maillard: '#7FA968', Carnal: '#5DA48D',
};

export const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

type DB = Database.Database;
export interface NoteRow { family: string; note: string; intensity: number }
export interface AhnRef { id: number; name: string; category: string }

/** Resolve a name to an Ahn flavour-network ingredient (the pairing id space). */
export function ahnByName(db: DB, name: string): AhnRef | undefined {
  return db.prepare('SELECT id, name, category FROM flavor_ingredients WHERE name = ? COLLATE NOCASE').get(name) as AhnRef | undefined;
}

/** Resolve a name to a note-ingredient (the wheel/profile id space). */
export function noteIngByName(db: DB, name: string): { id: number; name: string; category: string } | undefined {
  return db.prepare('SELECT id, name, category FROM note_ingredients WHERE name = ? COLLATE NOCASE').get(name) as { id: number; name: string; category: string } | undefined;
}

// ── Harmony: evidence-based cohesion from note↔note co-occurrence ─────────────
// Distinct from aroma affinity (shared compounds). Two ingredients are "harmonious"
// when the notes one carries associate with the notes the other carries — measured
// by how much more those notes co-occur across ingredients than chance (note_associations).
// This credits complementary pairs (lamb+mint) that share almost no compounds.

export interface Bridge { noteA: string; noteB: string; familyA: string; familyB: string; strength: number }

const normName = (s: string) => (s || '').toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Real recipe co-occurrence score (FlavorGraph/Recipe1M NPMI) for a pair, or null. */
export function realCooccur(db: DB, aName: string, bName: string): number | null {
  const r = db.prepare('SELECT score FROM ingredient_cooccur WHERE name_a = ? AND name_b = ?').get(normName(aName), normName(bName)) as { score: number } | undefined;
  return r ? r.score : null;
}

/**
 * Harmony (0-100) between two ingredients + the note bridges behind it.
 * Prefers REAL recipe co-occurrence (empirical "cooked together") when we have
 * it — that's the strongest evidence — and falls back to the note-association
 * cohesion model otherwise. `proven` marks pairs backed by real recipe data.
 */
export function harmonyByName(db: DB, aName: string, bName: string): { harmony: number; bridges: Bridge[]; proven: boolean; cooccur: number | null } | null {
  const a = noteIngByName(db, aName), b = noteIngByName(db, bName);
  if (!a || !b || a.id === b.id) return null;
  const A = noteRows(db, a.id).slice(0, 12);
  const B = noteRows(db, b.id).slice(0, 12);
  const assoc = db.prepare('SELECT lift, cooccur FROM note_associations WHERE note_a = ? AND note_b = ?');
  const terms: { noteA: string; noteB: string; familyA: string; familyB: string; strength: number; contrib: number }[] = [];
  for (const na of A)
    for (const nb of B) {
      let w = 0;
      if (na.note === nb.note) w = 2.5; // both literally carry the note
      else {
        const r = assoc.get(na.note, nb.note) as { lift: number; cooccur: number } | undefined;
        if (r) w = Math.min(r.lift, 8) * (r.cooccur / (r.cooccur + 2)); // cap + confidence shrink
      }
      if (w > 0) terms.push({ noteA: na.note, noteB: nb.note, familyA: na.family, familyB: nb.family, strength: w, contrib: w * (na.intensity / 10) * (nb.intensity / 10) });
    }
  terms.sort((x, y) => y.contrib - x.contrib);
  const bridge = terms.slice(0, 12).reduce((s, t) => s + t.contrib, 0);
  const structural = Math.round(100 * Math.tanh(bridge / 20));

  // Real recipe co-occurrence overrides the structural estimate when available.
  const cooccur = realCooccur(db, aName, bName);
  const harmony = cooccur != null ? Math.round(100 * Math.tanh(cooccur * 4)) : structural;

  return {
    harmony,
    proven: cooccur != null,
    cooccur,
    bridges: terms.slice(0, 8).map((t) => ({ noteA: t.noteA, noteB: t.noteB, familyA: t.familyA, familyB: t.familyB, strength: Math.round(t.strength * 10) / 10 })),
  };
}

/** A note-ingredient's profile rows (the wheel id space), strongest first. */
export function noteRows(db: DB, noteId: number): NoteRow[] {
  return db.prepare('SELECT family, note, intensity FROM note_profiles WHERE ingredient_id = ? ORDER BY intensity DESC').all(noteId) as NoteRow[];
}

/** Per-family summed intensity for a set of note rows. */
export function familyTotals(rows: NoteRow[]): Record<string, number> {
  const t: Record<string, number> = {};
  for (const f of FAMILY_ORDER) t[f] = 0;
  for (const r of rows) if (t[r.family] != null) t[r.family] += r.intensity;
  return t;
}

/** Raw shared-compound IDF sum + shared compound names for one specific pair (Ahn). */
export function pairRaw(db: DB, aId: number, bId: number): { raw: number; shared: number; notes: string[] } {
  const row = db.prepare(
    `SELECT COUNT(*) AS shared, COALESCE(SUM(c.idf), 0) AS raw, GROUP_CONCAT(c.name, '|') AS notes
     FROM flavor_ingredient_compounds a
     JOIN flavor_ingredient_compounds b ON a.compound_id = b.compound_id AND b.ingredient_id = ?
     JOIN flavor_compounds c ON c.id = a.compound_id
     WHERE a.ingredient_id = ?`
  ).get(bId, aId) as { shared: number; raw: number; notes: string | null };
  return { raw: row.raw || 0, shared: row.shared || 0, notes: (row.notes || '').split('|').filter(Boolean) };
}

/** An ingredient's best-partner raw score, for normalising synergy to 0-100. Cache per request. */
export function maxPartnerRaw(db: DB, id: number, cache: Map<number, number>): number {
  if (cache.has(id)) return cache.get(id)!;
  const row = db.prepare(
    `SELECT COALESCE(SUM(c.idf), 0) AS raw
     FROM flavor_ingredient_compounds a
     JOIN flavor_ingredient_compounds b ON a.compound_id = b.compound_id AND b.ingredient_id != a.ingredient_id
     JOIN flavor_compounds c ON c.id = a.compound_id
     WHERE a.ingredient_id = ?
     GROUP BY b.ingredient_id ORDER BY raw DESC LIMIT 1`
  ).get(id) as { raw: number } | undefined;
  const v = row?.raw || 0;
  cache.set(id, v);
  return v;
}

/** Map a raw pair score to a 0-100 synergy, relative to each ingredient's best partner. */
export function synergyFromRaw(raw: number, maxA: number, maxB: number): number {
  if (!maxA && !maxB) return 0;
  const s = raw * 0.5 * ((maxA ? 1 / maxA : 0) + (maxB ? 1 / maxB : 0));
  return Math.max(0, Math.min(100, Math.round(s * 100)));
}

/** Synergy between two ingredients by name (0-100) + shared notes. */
export function synergyByName(db: DB, aName: string, bName: string, cache: Map<number, number>): { synergy: number; shared: number; notes: string[] } | null {
  const a = ahnByName(db, aName), b = ahnByName(db, bName);
  if (!a || !b || a.id === b.id) return null;
  const { raw, shared, notes } = pairRaw(db, a.id, b.id);
  return { synergy: synergyFromRaw(raw, maxPartnerRaw(db, a.id, cache), maxPartnerRaw(db, b.id, cache)), shared, notes };
}

/** Mean pairwise harmony (0-100) across a set of note-ingredients + the tightest pairs. */
export function plateHarmony(db: DB, members: { id: number; name: string }[]): { harmony: number; pairs: { a: string; b: string; harmony: number }[] } {
  const pairs: { a: string; b: string; harmony: number }[] = [];
  for (let i = 0; i < members.length; i++)
    for (let j = i + 1; j < members.length; j++) {
      const h = harmonyByName(db, members[i].name, members[j].name);
      if (h) pairs.push({ a: members[i].name, b: members[j].name, harmony: h.harmony });
    }
  pairs.sort((x, y) => y.harmony - x.harmony);
  const harmony = pairs.length ? Math.round(pairs.reduce((s, p) => s + p.harmony, 0) / pairs.length) : 0;
  return { harmony, pairs };
}

// Suggest ingredients that would harmonise with a plate — using note associations,
// not shared compounds. We build a target note-profile (the plate's notes plus the
// notes those associate with) and rank ingredients whose profile matches it best.
export function harmonyNextAdds(db: DB, memberIds: number[], limit = 6): { name: string; noteId: number; fit: number; family: string | null }[] {
  const plate = new Map<string, number>();
  for (const id of memberIds)
    for (const r of noteRows(db, id)) plate.set(r.note, Math.max(plate.get(r.note) || 0, r.intensity));
  const plateTop = [...plate.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  if (plateTop.length === 0) return [];

  const target = new Map<string, number>();
  const assocTop = db.prepare('SELECT note_b, lift, cooccur FROM note_associations WHERE note_a = ? ORDER BY lift DESC LIMIT 10');
  for (const [note, intensity] of plateTop) {
    target.set(note, (target.get(note) || 0) + (intensity / 10) * 2.5); // sharing a plate note is cohesive
    for (const r of assocTop.all(note) as { note_b: string; lift: number; cooccur: number }[]) {
      const w = Math.min(r.lift, 8) * (r.cooccur / (r.cooccur + 2));
      target.set(r.note_b, (target.get(r.note_b) || 0) + (intensity / 10) * w);
    }
  }

  const targetNotes = [...target.keys()];
  const placeholders = targetNotes.map(() => '?').join(',');
  const rows = db.prepare(`SELECT ingredient_id, note, intensity FROM note_profiles WHERE note IN (${placeholders})`).all(...targetNotes) as { ingredient_id: number; note: string; intensity: number }[];
  const memberSet = new Set(memberIds);
  const score = new Map<number, number>();
  for (const r of rows) {
    if (memberSet.has(r.ingredient_id)) continue;
    score.set(r.ingredient_id, (score.get(r.ingredient_id) || 0) + (r.intensity / 10) * (target.get(r.note) || 0));
  }
  const ranked = [...score.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit * 6);
  const out: { name: string; noteId: number; fit: number; family: string | null }[] = [];
  const seenHead = new Set<string>(); // collapse near-duplicates (Romano/Parmesan Cheese, Canadian/Finnish Whisky)
  for (const [id, s] of ranked) {
    const ing = db.prepare('SELECT name, category FROM note_ingredients WHERE id = ?').get(id) as { name: string; category: string } | undefined;
    if (!ing) continue;
    const head = ing.name.toLowerCase().trim().split(/\s+/).pop()!;
    if (seenHead.has(head)) continue;
    seenHead.add(head);
    const fam = familyTotals(noteRows(db, id));
    const family = FAMILY_ORDER.filter((f) => fam[f] > 0).sort((x, y) => fam[y] - fam[x])[0] || null;
    out.push({ name: ing.name, noteId: id, fit: s, family });
    if (out.length >= limit) break;
  }
  const max = out[0]?.fit || 1;
  return out.map((o) => ({ ...o, fit: Math.round((o.fit / max) * 100) }));
}

// ── Complement / balance: do two ingredients draw each other out? ────────────
// The third axis (distinct from aroma affinity and recipe harmony): classic
// culinary balance — acid cuts fat, sweet balances sour, sweetness calms heat,
// fresh notes lift heavy ones. High when the two occupy complementary balancing
// roles; a "muddy" risk when both pile onto the same heavy register with nothing
// bright to lift them. Grounded in Nosrat-style salt/fat/acid balance + the
// flavour-matching literature (similarity vs contrast).
interface BalanceAxes { acid: number; sweet: number; heat: number; rich: number; bright: number; heavy: number }
function balanceAxes(fam: Record<string, number>): BalanceAxes {
  const tot = FAMILY_ORDER.reduce((s, f) => s + fam[f], 0) || 1;
  const p = (f: string) => fam[f] / tot;
  return {
    acid: p('Acidic'), sweet: p('Sweet'), heat: p('Spice'),
    rich: p('Carnal') + 0.8 * p('Maillard'),
    bright: p('Acidic') + 0.7 * p('Herbal') + 0.6 * p('Floral') + 0.35 * p('Vegetal'),
    heavy: 0.8 * p('Earthy') + 0.7 * p('Woody') + 0.7 * p('Maillard') + 0.5 * p('Carnal'),
  };
}
const BALANCE_RELATIONS: [keyof BalanceAxes, keyof BalanceAxes, string][] = [
  ['acid', 'rich', 'the acid cuts through the richness'],
  ['sweet', 'acid', 'sweetness rounds off the acidity'],
  ['sweet', 'heat', 'sweetness calms the heat'],
  ['bright', 'heavy', 'the fresh, bright notes lift the heavy ones'],
  ['rich', 'heat', 'the fat mellows the heat'],
];

/** Complement / balance (0-100) between two ingredients + a plain-language read. */
export function complementByName(db: DB, aName: string, bName: string): { complement: number; muddyRisk: boolean; why: string } | null {
  const a = noteIngByName(db, aName), b = noteIngByName(db, bName);
  if (!a || !b || a.id === b.id) return null;
  const A = balanceAxes(familyTotals(noteRows(db, a.id)));
  const B = balanceAxes(familyTotals(noteRows(db, b.id)));
  const cross = (x: keyof BalanceAxes, y: keyof BalanceAxes) => A[x] * B[y] + B[x] * A[y];
  let balance = 0; let best = { c: -1, desc: '' };
  for (const [x, y, desc] of BALANCE_RELATIONS) { const c = cross(x, y); balance += c; if (c > best.c) best = { c, desc }; }
  const combinedBright = Math.max(A.bright, B.bright);
  const muddiness = A.heavy * B.heavy * (1 - combinedBright);
  const complement = Math.max(0, Math.round(100 * Math.tanh(balance * 3.4 - muddiness * 2.6)));
  const muddyRisk = muddiness > 0.09 && complement < 55;
  const why = muddyRisk
    ? 'Both lean heavy — together they can turn muddy. A bright, acidic, or fresh element would lift them.'
    : complement >= 55
      ? `They draw each other out — ${best.desc}.`
      : 'A modest balance — they mostly sit alongside each other rather than transforming one another.';
  return { complement, muddyRisk, why };
}

/** Mean pairwise aroma affinity (0-100) across a set of ingredients. */
export function plateAffinity(db: DB, members: { id: number; name: string }[], cache: Map<number, number>): number {
  const ahn = members.map((m) => ahnByName(db, m.name)).filter(Boolean) as { id: number }[];
  let sum = 0, n = 0;
  for (let i = 0; i < ahn.length; i++)
    for (let j = i + 1; j < ahn.length; j++) {
      const { raw } = pairRaw(db, ahn[i].id, ahn[j].id);
      sum += synergyFromRaw(raw, maxPartnerRaw(db, ahn[i].id, cache), maxPartnerRaw(db, ahn[j].id, cache));
      n++;
    }
  return n ? Math.round(sum / n) : 0;
}

type AddOpt = { name: string; noteId: number; fit: number; family: string | null; delta: number };
// Classic balancers seeded into the candidate pool so the Complement axis always
// has contrast to offer (acids, bright/fresh notes, sweet/heat balancers).
const COMPLEMENT_SEEDS = ['Lemon', 'Lime', 'Vinegar', 'Orange', 'Grapefruit', 'Tomato', 'Chili', 'Ginger', 'Honey', 'Mint', 'Basil', 'Coriander', 'Parsley', 'Dill', 'Fennel', 'Garlic', 'Mustard', 'Pomegranate', 'Tamarind', 'Caramel', 'Pepper', 'Rosemary', 'Thyme', 'Yogurt', 'Lemongrass'];

// Suggest ingredients to add to a plate, ranked by any of the three metrics.
// Returns only candidates that would IMPROVE the chosen score (mean with the
// plate above the current plate score + 5) — nothing that leaves it flat or worse.
export function nextAddOptions(db: DB, members: { id: number; name: string }[]): {
  harmonyCurrent: number; affinityCurrent: number; complementCurrent: number;
  harmonyAdds: AddOpt[];
  affinityAdds: AddOpt[];
  complementAdds: AddOpt[];
} {
  const cache = new Map<number, number>();
  const harmonyCurrent = plateHarmony(db, members).harmony;
  const affinityCurrent = plateAffinity(db, members, cache);
  const complementCurrent = plateComplement(db, members);

  // Per-axis pair sums + counts for the current plate. We reuse these to project
  // the EXACT dish score after adding each candidate (new mean = combined sum /
  // combined count), so we can keep only adds that actually raise the score. Some
  // pairs lack data for a given axis, so each axis keeps its own count.
  let pHs = 0, pHn = 0, pCs = 0, pCn = 0, pAs = 0, pAn = 0;
  for (let i = 0; i < members.length; i++)
    for (let j = i + 1; j < members.length; j++) {
      const h = harmonyByName(db, members[i].name, members[j].name); if (h) { pHs += h.harmony; pHn++; }
      const cp = complementByName(db, members[i].name, members[j].name); if (cp) { pCs += cp.complement; pCn++; }
      const af = synergyByName(db, members[i].name, members[j].name, cache); if (af) { pAs += af.synergy; pAn++; }
    }
  // Use the same rounded axis values the UI shows, so a suggestion's quoted delta
  // matches exactly what the score does when you actually add it.
  const currentScore = dishScore(harmonyCurrent, complementCurrent, affinityCurrent);

  // candidate pool from several sources so every metric has room to improve
  const pool = new Set<string>();
  // Complement often wants a contrast the plate doesn't already resemble (an acid
  // to cut fat, a bright note to lift heavy), so seed classic balancers too.
  for (const b of COMPLEMENT_SEEDS) pool.add(b);
  for (const m of members) {
    const a = ahnByName(db, m.name);
    if (a) {
      const rows = db.prepare(
        `SELECT i.name FROM flavor_ingredient_compounds x
         JOIN flavor_ingredient_compounds y ON x.compound_id = y.compound_id
         JOIN flavor_ingredients i ON i.id = y.ingredient_id
         JOIN flavor_compounds c ON c.id = x.compound_id
         WHERE x.ingredient_id = ? AND y.ingredient_id != ?
         GROUP BY y.ingredient_id ORDER BY SUM(c.idf) DESC LIMIT 30`
      ).all(a.id, a.id) as { name: string }[];
      for (const r of rows) pool.add(r.name);
    }
    for (const r of db.prepare('SELECT name_b FROM ingredient_cooccur WHERE name_a = ? ORDER BY score DESC LIMIT 30').all(normName(m.name)) as { name_b: string }[]) pool.add(r.name_b);
  }
  for (const na of harmonyNextAdds(db, members.map((m) => m.id), 40)) pool.add(na.name);

  const memberIds = new Set(members.map((m) => m.id));
  const memberNames = new Set(members.map((m) => m.name.toLowerCase()));
  const scored: { name: string; noteId: number; family: string | null; meanH: number; meanA: number; meanC: number; projScore: number }[] = [];
  const seenNote = new Set<number>();
  for (const raw of pool) {
    const note = noteIngByName(db, raw);
    if (!note || memberIds.has(note.id) || memberNames.has(note.name.toLowerCase()) || seenNote.has(note.id)) continue;
    seenNote.add(note.id);
    let hSum = 0, hN = 0, aSum = 0, aN = 0, cSum = 0, cN = 0;
    for (const m of members) {
      const h = harmonyByName(db, note.name, m.name); if (h) { hSum += h.harmony; hN++; }
      const af = synergyByName(db, note.name, m.name, cache); if (af) { aSum += af.synergy; aN++; }
      const cp = complementByName(db, note.name, m.name); if (cp) { cSum += cp.complement; cN++; }
    }
    const fam = familyTotals(noteRows(db, note.id));
    const family = FAMILY_ORDER.filter((f) => fam[f] > 0).sort((x, y) => fam[y] - fam[x])[0] || null;
    // exact dish score if this candidate joined the plate (combined pair means)
    const projScore = dishScore(
      Math.round((pHn + hN) ? (pHs + hSum) / (pHn + hN) : 0),
      Math.round((pCn + cN) ? (pCs + cSum) / (pCn + cN) : 0),
      Math.round((pAn + aN) ? (pAs + aSum) / (pAn + aN) : 0),
    );
    scored.push({ name: note.name, noteId: note.id, family, meanH: hN ? hSum / hN : 0, meanA: aN ? aSum / aN : 0, meanC: cN ? cSum / cN : 0, projScore });
  }

  // Candidates worth showing: anything that doesn't meaningfully hurt the dish
  // (down to -5, so there's still a list once a plate is near 100). The axis is a
  // SORT, not a filter — the three tabs re-rank the same pool by harmony /
  // complement / affinity, and each row carries its exact score delta.
  const rank = (score: (r: typeof scored[number]) => number) => {
    const seenHead = new Set<string>();
    return scored
      .filter((r) => r.projScore >= currentScore - 5)
      .sort((a, b) => score(b) - score(a))
      .filter((r) => { const h = r.name.toLowerCase().split(/\s+/).pop()!; return seenHead.has(h) ? false : (seenHead.add(h), true); })
      .slice(0, 30)
      .map((r) => ({ name: r.name, noteId: r.noteId, fit: Math.round(score(r)), family: r.family, delta: r.projScore - currentScore }));
  };

  return {
    harmonyCurrent, affinityCurrent, complementCurrent,
    harmonyAdds: rank((r) => r.meanH),
    affinityAdds: rank((r) => r.meanA),
    complementAdds: rank((r) => r.meanC),
  };
}

// ── Dish score: how good is a whole plate? ───────────────────────────────────
// Data-driven, not hand-tuned: both the axis weights and the "excellence" ceiling
// are derived from 38 celebrated dishes (Noma + classics), each measured by this
// Lab — see scripts/derive-dish-score.mjs. Great dishes averaged H62 C57 A23, so
// harmony & complement dominate the weights and aroma affinity is minor; the
// ceiling is their 80th-percentile composite, which maps to ~100. A plate then
// reads as its share of "as good as a great dish." Refresh via the script.
export const DISH_WEIGHTS = { harmony: 0.438, complement: 0.402, affinity: 0.16 };
export const DISH_CEILING = 60; // weighted composite that maps to 100
export function dishScore(harmony: number, complement: number, affinity: number): number {
  const composite = DISH_WEIGHTS.harmony * harmony + DISH_WEIGHTS.complement * complement + DISH_WEIGHTS.affinity * affinity;
  return Math.max(0, Math.min(100, Math.round((composite / DISH_CEILING) * 100)));
}

// ── Cuisine "genre": what tradition is this plate speaking? ───────────────────
// Score the plate against each cuisine's signature ingredients, weighting each by
// exclusivity (tomato is in many cuisines and says little; gochujang says Korea).
// Returns the leading blend + a few "fusion nudges": one ingredient that would tip
// the plate toward a neighbouring tradition. Pure (no db) — see data/cuisines.ts.
export function classifyCuisine(memberNames: string[]): { mix: { name: string; pct: number }[]; nudges: { name: string; add: string }[] } {
  const names = memberNames.map((n) => n.toLowerCase());
  const has = (sig: string[], n: string) => sig.some((s) => s.toLowerCase() === n);
  const excl = (n: string) => CUISINES.filter((c) => has(c.signature, n)).length; // how many cuisines share it
  const weight = new Map<string, number>();
  for (const n of names) { const e = excl(n); weight.set(n, e ? 1 / e : 0); }
  const scored = CUISINES
    .map((c) => ({ name: c.name, s: names.reduce((acc, n) => acc + (has(c.signature, n) ? (weight.get(n) || 0) : 0), 0) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);
  const top = scored.slice(0, 4);
  const topTotal = top.reduce((a, b) => a + b.s, 0) || 1; // normalise the shown blend to ~100%
  const mix = top.map((r) => ({ name: r.name, pct: Math.round((r.s / topTotal) * 100) }));
  const inPlate = new Set(names);
  const primary = scored[0]?.name;
  const nudges = CUISINES
    .filter((c) => c.name !== primary)
    .map((c) => {
      const cand = c.signature.filter((s) => !inPlate.has(s.toLowerCase())).map((s) => ({ s, e: excl(s.toLowerCase()) })).sort((a, b) => a.e - b.e)[0];
      const overlap = scored.find((r) => r.name === c.name)?.s || 0;
      return cand ? { name: c.name, add: cand.s, overlap } : null;
    })
    .filter(Boolean) as { name: string; add: string; overlap: number }[];
  nudges.sort((a, b) => b.overlap - a.overlap);
  return { mix, nudges: nudges.slice(0, 3).map(({ name, add }) => ({ name, add })) };
}

/** Mean pairwise complement / balance (0-100) across a set of ingredients. */
export function plateComplement(db: DB, members: { id: number; name: string }[]): number {
  let sum = 0, n = 0;
  for (let i = 0; i < members.length; i++)
    for (let j = i + 1; j < members.length; j++) {
      const c = complementByName(db, members[i].name, members[j].name);
      if (c) { sum += c.complement; n++; }
    }
  return n ? Math.round(sum / n) : 0;
}

/** Merge several note-ingredients' profiles into one combined wheel (max intensity per note). */
export function mergedProfile(db: DB, noteIds: number[]): { families: { name: string; notes: { note: string; intensity: number }[] }[]; activeNotes: number; strongest: { note: string; family: string; intensity: number }[] } {
  const best = new Map<string, { note: string; family: string; intensity: number }>();
  for (const id of noteIds) {
    for (const r of noteRows(db, id)) {
      const key = r.family + '|' + r.note;
      const cur = best.get(key);
      if (!cur || r.intensity > cur.intensity) best.set(key, { note: r.note, family: r.family, intensity: r.intensity });
    }
  }
  const all = [...best.values()];
  const byFam = new Map<string, { note: string; intensity: number }[]>(FAMILY_ORDER.map((f) => [f, []]));
  for (const r of all) byFam.get(r.family)?.push({ note: r.note, intensity: r.intensity });
  for (const f of FAMILY_ORDER) byFam.get(f)!.sort((x, y) => y.intensity - x.intensity);
  return {
    families: FAMILY_ORDER.map((name) => ({ name, notes: byFam.get(name) || [] })),
    activeNotes: all.length,
    strongest: all.sort((a, b) => b.intensity - a.intensity).slice(0, 6),
  };
}
