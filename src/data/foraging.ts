// What grows wild, where, and when — plus the thing that actually matters when
// foraging: what each species can be mistaken for, and how to tell them apart.
//
// Every entry is researched against extension services, state agencies and field
// guides, and each one was adversarially re-checked for missing deadly lookalikes
// before being included. Anything contested or shaky was left out: a short
// accurate list is worth more than a long confident-sounding one.
//
// This is a seasonal reference, NOT an identification key. Nothing here is
// sufficient to eat something wild — see FORAGE_DISCLAIMER.
import type { RegionId } from '@/data/seasonal-regional';
import { FORAGE_SPECIES } from '@/data/foraging-species';

export const FORAGE_DISCLAIMER =
  'This is a seasonal guide, not an identification key. Never eat a wild plant or mushroom identified from a screen — confirm with a field guide and, for anything with a dangerous lookalike, an experienced forager or your state extension service. When in doubt, leave it.';

/** How much can go wrong if you get it wrong. */
export type Caution =
  | 'easy'   // little to confuse it with
  | 'care'   // has confusable neighbours that will make you ill
  | 'expert'; // a deadly lookalike exists

export interface Lookalike {
  name: string;
  danger: 'deadly' | 'toxic' | 'unpalatable';
  /** The concrete distinguishing feature. Never vague advice. */
  tell: string;
}

/**
 * The kind of ground a thing grows on. Foraging is really a question about
 * place — you don't go looking for ramps, you go looking for a damp shaded
 * hardwood slope in April and find ramps there. Grouping by terrain matches how
 * you'd actually plan a walk.
 */
export type Terrain =
  | 'woodland'    // under closed canopy — the forest floor itself
  | 'edge'        // where woods meet field: hedgerows, trails, clearings
  | 'wetland'     // streambanks, floodplains, damp ground
  | 'meadow'      // open field, old pasture, roadside verge
  | 'disturbed'   // vacant lots, yards, waste ground, old homesteads
  | 'coastal'     // salt marsh, dune, shoreline
  | 'upland';     // dry rocky slopes, barrens, pine and oak scrub

export const TERRAIN_LABEL: Record<Terrain, string> = {
  woodland: 'Woodland floor',
  edge: 'Forest edge & hedgerow',
  wetland: 'Streambank & wet ground',
  meadow: 'Meadow & old field',
  disturbed: 'Disturbed ground & yards',
  coastal: 'Coast & salt marsh',
  upland: 'Dry slopes & barrens',
};

/** The order you'd walk them, roughly wettest and shadiest to driest and most open. */
export const TERRAIN_ORDER: Terrain[] = ['woodland', 'edge', 'wetland', 'meadow', 'disturbed', 'upland', 'coastal'];

export interface ForageSpecies {
  name: string;
  scientific: string;
  /** Peak months, 0 = January. */
  months: number[];
  /** 'all' means found across the US. */
  regions: (RegionId | 'all')[];
  /** The ground it grows on — the primary way this section is organised. */
  terrain: Terrain[];
  /** What to look for underfoot, in a sentence. */
  habitat: string;
  /** The giveaway that you're in the right spot — a companion tree, soil, aspect. */
  indicator?: string;
  parts: string;
  caution: Caution;
  lookalikes: Lookalike[];
  /** What not to over-take — several of these are slow-growing or at risk. */
  harvest: string;
  sources: string[];
}

export const CAUTION_LABEL: Record<Caution, string> = {
  easy: 'hard to mistake',
  care: 'confusable — check carefully',
  expert: 'deadly lookalike exists',
};

export const FORAGE: ForageSpecies[] = FORAGE_SPECIES;

/**
 * The lead sentence of a long field, for the collapsed row.
 *
 * Habitat entries run to a couple of thousand characters because that detail is what
 * lets you actually make the call in the field. All of it belongs on the page; none of
 * it belongs in a list you're scanning, so the row gets the first sentence and the rest
 * waits until you open the row.
 */
export function lead(text: string, max = 200, min = 90): string {
  // Some entries open on a topic sentence — "The wet seam in the landscape." — which
  // reads as a heading, not a place. Keep taking sentences until the row actually tells
  // you where to look, then stop at the last one that still fits.
  const sentences = text.split(/(?<=\.)\s+(?=[A-Z])/);
  let out = '';
  for (const s of sentences) {
    if (out.length >= min) break;
    out += (out ? ' ' : '') + s;
  }
  out = (out || text).trim();
  if (out.length <= max) return out;
  const cut = out.lastIndexOf(' ', max);
  return out.slice(0, cut > 0 ? cut : max).replace(/[,;:—-]$/, '') + '…';
}

/**
 * Just the binomial, for the row. Several entries carry a full taxonomic note — which
 * species are wild here, which are escaped plantings, which shared common name means a
 * different genus somewhere else — and that reads as a paragraph, not a label.
 */
export function shortScientific(scientific: string): string {
  // Split only at a real sentence break — "Castanea spp." and "(Nutt.) Nees" are part of
  // the name, not the end of it.
  const binomial = scientific.split(/;|\s[—-]\s|(?<=\.)\s+(?=[A-Z])/)[0].trim();
  return binomial.length > 3 && binomial.length <= 60 ? binomial : lead(scientific, 60, 0);
}

/** What's worth looking for in a region this month, riskiest-first so the warnings lead. */
export function forageFor(region: RegionId, month: number): ForageSpecies[] {
  const order: Record<Caution, number> = { expert: 0, care: 1, easy: 2 };
  return FORAGE
    .filter((s) => s.months.includes(month) && (s.regions.includes('all') || s.regions.includes(region)))
    .sort((a, b) => order[a.caution] - order[b.caution] || a.name.localeCompare(b.name));
}

/**
 * The same list arranged as a walk: which ground to cover, and what is on it.
 * A species growing in two terrains appears under both, because it genuinely
 * does — you'd find nettle at a streambank and behind a barn.
 */
export function forageByTerrain(
  region: RegionId,
  month: number
): { terrain: Terrain; label: string; species: ForageSpecies[] }[] {
  const found = forageFor(region, month);
  return TERRAIN_ORDER
    .map((terrain) => ({
      terrain,
      label: TERRAIN_LABEL[terrain],
      species: found.filter((s) => s.terrain.includes(terrain)),
    }))
    .filter((g) => g.species.length > 0);
}
