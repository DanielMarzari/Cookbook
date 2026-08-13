/** Charcuterie Board Draft — shared vocabulary.
 *
 *  This whole feature is a client-side mockup: no DB tables, no API routes.
 *  Drafts live in localStorage. Types here are the contract between the data
 *  modules (items / boards / pairings) and the components that draw them. */

/** What a pantry item *is*. Drives which zones will accept it. */
export type Cat =
  | "cheese"
  | "meat"
  | "fruit"
  | "dried"
  | "cracker"
  | "spread"
  | "nut"
  | "briny"
  | "sweet"
  | "garnish"
  | "veg";

/** What a zone *wants*. `flex` accepts anything — the gaps you fill last. */
export type Role = Cat | "flex";

/** Flavour + texture vocabulary. The pairing engine works entirely over these,
 *  so adding a tag to an item immediately changes what it gets suggested with. */
export type Tag =
  // taste
  | "salty"
  | "sweet"
  | "acidic"
  | "bitter"
  | "umami"
  | "spicy"
  // character
  | "funky"
  | "nutty"
  | "smoky"
  | "herbal"
  | "floral"
  | "earthy"
  | "fruity"
  | "citrus"
  | "stone-fruit"
  | "berry"
  | "tropical"
  | "honeyed"
  | "winey"
  | "grassy"
  | "buttery"
  | "peppery"
  | "garlicky"
  | "briny"
  // texture
  | "creamy"
  | "crunchy"
  | "chewy"
  | "crumbly"
  | "firm"
  | "juicy"
  | "snappy"
  | "silky"
  | "spreadable"
  | "flaky"
  // weight
  | "rich"
  | "light"
  | "mild"
  | "bold";

/** How a filled zone is *drawn*. Each motif is a small generator in ZoneFill —
 *  the point is that a board reads as food, not as coloured boxes. */
export type Motif =
  | "rose"
  | "shingle"
  | "drape"
  | "wedge"
  | "cube"
  | "crumble"
  | "cluster"
  | "fan"
  | "scatter"
  | "bowl"
  | "sprig"
  | "stack"
  | "round"
  | "batons"
  | "halved"
  /** Thin slices stood on edge in a ring — the fruit "flower". */
  | "flower"
  /** Triangles alternating point-up and point-down, so the row reads as an M. */
  | "mwave"
  /** Ribbons pinched into standing folds — the ruffle a good meat plate has. */
  | "ruffle";

/** A way of cutting/styling an item. This is the "make it look good" payload —
 *  a cut may override the item's default motif so the board actually shows the
 *  rose you picked. */
export interface Cut {
  name: string;
  /** Plain-language how-to, one or two sentences. */
  how: string;
  motif?: Motif;
  /** Optional extra credit — the flourish that makes people ask about it. */
  flair?: string;
  /** Rough effort, drives the little difficulty pips. 1 = lazy, 3 = showing off. */
  effort?: 1 | 2 | 3;
}

export interface Item {
  id: string;
  name: string;
  cat: Cat;
  /** [base, mid, accent] — used by the motif generators, and by the balance
   *  readout to judge whether the board is one big beige tragedy. */
  palette: [string, string, string];
  motif: Motif;
  tags: Tag[];
  /** Months (1-12) at peak. Omit for year-round staples. */
  season?: number[];
  /** One line of flavour, in a shop-talk voice. */
  note: string;
  cuts: Cut[];
  /** Canonical partners — hand-authored, scored well above tag matches. */
  loves?: string[];
  /** Shopping math, per guest. */
  perGuest?: { amount: number; unit: string };
}

/** A section of the board. Geometry is pre-computed into `d` (an SVG path) so
 *  hover outlines trace the true shape rather than a bounding box. */
export interface Zone {
  id: string;
  label: string;
  role: Role;
  /** The coaching line shown on hover. */
  hint: string;
  /** SVG path data, in the parent board's viewBox coordinates. */
  d: string;
  center: [number, number];
  /** [x, y, w, h] — the motif generators fill within this. */
  bbox: [number, number, number, number];
  size: "hero" | "major" | "minor" | "accent";
}

export interface Pattern {
  id: string;
  name: string;
  tagline: string;
  zones: Zone[];
}

/** The physical board: silhouette + surface material. */
export interface Board {
  id: string;
  name: string;
  blurb: string;
  /** Serving-size guidance, shown next to the guest counter. */
  seats: string;
  surface: "walnut" | "olivewood" | "slate" | "marble" | "linen";
  viewBox: [number, number];
  /** Silhouette path — also used as the shadow and the clip for the surface. */
  outline: string;
  patterns: Pattern[];
}

/** A zone that has been filled in: what's there and how it's cut. */
export interface Fill {
  itemId: string;
  cutIndex: number;
}

/** zoneId -> fill */
export type BoardFills = Record<string, Fill>;

/** A scored suggestion, with the reasoning shown to the user. */
export interface Suggestion {
  item: Item;
  /** 0-100. Only meaningful when `ranked` is true. */
  match: number;
  /** Deduped, ordered reasons — the "why" behind the match. */
  why: string[];
  /** True when the item is at seasonal peak right now. */
  inSeason: boolean;
  /** False when there was nothing to rank against, so these are just staples
   *  in a sensible order. The UI hides the match score in that case rather than
   *  implying a precision it doesn't have. */
  ranked: boolean;
}
