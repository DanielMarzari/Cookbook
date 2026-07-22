// Shared flavour helpers. Constants are client-safe (no runtime db import — only
// `import type`), so components can import FAMILY_ORDER / FAMILY_COLORS from here.
// The scoring functions take a better-sqlite3 handle passed in by API routes.
import type Database from 'better-sqlite3';

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
