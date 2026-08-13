import { ITEMS, getItem, isInSeason, itemsForRole } from "./items";
import type { Item, Role, Suggestion, Tag } from "./types";

/** A reason two flavour tags belong together. The `why` is user-facing — it's
 *  the difference between "trust me" and an actual recommendation. */
interface Affinity {
  a: Tag;
  b: Tag;
  w: number;
  why: string;
}

/** The whole pairing philosophy, in one table. Edit weights here and the
 *  suggestions everywhere re-rank instantly. */
export const AFFINITIES: Affinity[] = [
  // The load-bearing contrasts.
  { a: "salty", b: "sweet", w: 3.4, why: "salt sharpens sweetness — the oldest trick on the board" },
  { a: "funky", b: "sweet", w: 3.8, why: "a blue needs sugar to land softly" },
  { a: "funky", b: "honeyed", w: 4.0, why: "honey is the standard antidote to a big funky cheese" },
  { a: "creamy", b: "crunchy", w: 3.4, why: "anything soft wants something that snaps" },
  { a: "creamy", b: "acidic", w: 3.0, why: "acid cuts the fat and resets your palate" },
  { a: "rich", b: "acidic", w: 3.0, why: "richness without acid gets heavy three bites in" },
  { a: "rich", b: "briny", w: 2.6, why: "brine slices straight through fat" },
  { a: "bitter", b: "sweet", w: 2.4, why: "sweetness rounds off a bitter edge" },
  { a: "spicy", b: "sweet", w: 2.8, why: "sugar carries heat instead of fighting it" },
  { a: "spicy", b: "creamy", w: 3.0, why: "fat is the only thing that actually calms chilli" },
  { a: "salty", b: "juicy", w: 2.8, why: "salt makes juice taste more like itself" },

  // Fruit-forward logic.
  { a: "stone-fruit", b: "creamy", w: 3.6, why: "peach juice against fresh cream is basically dessert" },
  { a: "stone-fruit", b: "salty", w: 3.2, why: "stone fruit and salt-cured anything is a summer standard" },
  { a: "berry", b: "creamy", w: 2.8, why: "berries pop against a mild, milky cheese" },
  { a: "berry", b: "bitter", w: 2.2, why: "dark chocolate and berries share the same tart backbone" },
  { a: "citrus", b: "creamy", w: 2.8, why: "citrus lifts a heavy cheese off the ground" },
  { a: "citrus", b: "nutty", w: 2.0, why: "zest wakes up toasted nuts" },
  { a: "tropical", b: "creamy", w: 2.4, why: "tropical sweetness needs a creamy anchor" },
  { a: "fruity", b: "salty", w: 2.6, why: "fruit and cure is the entire tradition in two words" },
  { a: "winey", b: "funky", w: 2.6, why: "grapes and a strong cheese have been arguing productively for centuries" },
  { a: "juicy", b: "crumbly", w: 2.4, why: "a juicy bite rescues a dry, crumbly one" },
  { a: "juicy", b: "firm", w: 2.0, why: "firm cheese wants moisture alongside it" },

  // Nuts, honey, earth.
  { a: "nutty", b: "sweet", w: 2.8, why: "toasted nuts and sugar are a shortcut to praline" },
  { a: "nutty", b: "funky", w: 3.0, why: "nuts give a pungent cheese something friendly to stand on" },
  { a: "nutty", b: "honeyed", w: 2.8, why: "honey and nuts is a pairing older than writing" },
  { a: "honeyed", b: "floral", w: 2.2, why: "both are perfumed — they amplify rather than compete" },
  { a: "earthy", b: "sweet", w: 2.4, why: "sweetness gives an earthy, mushroomy cheese a lift" },
  { a: "earthy", b: "herbal", w: 2.2, why: "herbs and earth read as the same landscape" },
  { a: "smoky", b: "sweet", w: 2.8, why: "smoke and sugar is barbecue logic, and it works cold too" },
  { a: "smoky", b: "acidic", w: 2.4, why: "acidity keeps smoke from dominating everything near it" },

  // Savoury depth.
  { a: "umami", b: "acidic", w: 2.6, why: "acid gives a deeply savoury bite somewhere to go" },
  { a: "umami", b: "sweet", w: 2.6, why: "savoury-sweet is the most repeatable bite on any board" },
  { a: "briny", b: "buttery", w: 2.6, why: "buttery and briny is the olive-and-cheese axis" },
  { a: "garlicky", b: "acidic", w: 2.0, why: "acid keeps garlic bright instead of heavy" },
  { a: "peppery", b: "creamy", w: 2.4, why: "pepper needs cream to bloom against" },
  { a: "grassy", b: "acidic", w: 2.0, why: "green, grassy notes sharpen with a little acid" },
  { a: "buttery", b: "acidic", w: 2.4, why: "butterfat plus acid is how vinaigrette works, and boards too" },
  { a: "herbal", b: "creamy", w: 2.6, why: "herbs cut through cream without overpowering it" },
  { a: "floral", b: "creamy", w: 2.2, why: "delicate floral notes survive best on a creamy base" },

  // Pure texture play.
  { a: "chewy", b: "crunchy", w: 2.2, why: "chew and crunch keeps a mouthful interesting" },
  { a: "silky", b: "crunchy", w: 2.8, why: "silky needs a hard edge next to it" },
  { a: "spreadable", b: "crunchy", w: 3.2, why: "a spread is only as good as what you put it on" },
  { a: "snappy", b: "rich", w: 2.4, why: "a snap of acidity resets a rich mouthful" },
  { a: "crunchy", b: "juicy", w: 2.0, why: "crunch and juice is why apples work with everything" },
  { a: "light", b: "rich", w: 1.8, why: "put something light beside it or the board gets exhausting" },
  { a: "mild", b: "bold", w: 1.8, why: "a mild option gives the bold one contrast to be bold against" },

  // Added with the crudité and expanded catalogue.
  { a: "smoky", b: "creamy", w: 3.0, why: "cream is what stops smoke turning into ashtray" },
  { a: "grassy", b: "briny", w: 2.2, why: "raw green things and brine sharpen each other" },
  { a: "peppery", b: "salty", w: 2.2, why: "pepper and salt are the same argument from two directions" },
  { a: "tropical", b: "spicy", w: 2.4, why: "tropical fruit can carry a surprising amount of chilli" },
  { a: "floral", b: "berry", w: 2.0, why: "perfumed and tart is the whole case for a summer board" },
  { a: "earthy", b: "nutty", w: 2.2, why: "mushroomy and toasted notes sit in the same register" },
  { a: "chewy", b: "acidic", w: 2.0, why: "acid keeps a chewy, sweet bite from turning cloying" },
  { a: "crumbly", b: "honeyed", w: 2.4, why: "honey is the binder a crumbly cheese is asking for" },
  { a: "snappy", b: "creamy", w: 2.8, why: "raw crunch is the cheapest possible foil for something soft" },
  { a: "bitter", b: "rich", w: 2.2, why: "a bitter leaf cuts a rich cheese down to size" },
];

/** tag -> rules mentioning it, so scoring is a couple of map lookups. */
const BY_TAG = new Map<Tag, Affinity[]>();
for (const rule of AFFINITIES) {
  for (const t of [rule.a, rule.b]) {
    const list = BY_TAG.get(t);
    if (list) list.push(rule);
    else BY_TAG.set(t, [rule]);
  }
}

/** A hand-authored canonical pair should decisively out-rank anything that just
 *  happens to share a lot of tags. */
const LOVE_BONUS = 14;
const SEASON_BONUS = 6;
/** Ceiling on what tag matching alone can contribute. Without this, an item
 *  carrying lots of tags racks up points against everything and drowns out the
 *  pairings that actually matter. */
const RULE_CEILING = 12;

/** Hue in degrees, for the "adds a colour you don't have" nudge. */
function hueOf(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  return h < 0 ? h + 360 : h;
}

function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

export interface PairResult {
  score: number;
  why: string[];
}

/** How well two specific items sit next to each other, and why. */
export function pairScore(a: Item, b: Item): PairResult {
  if (a.id === b.id) return { score: 0, why: [] };
  const why: string[] = [];

  const mutualLove = a.loves?.includes(b.id) || b.loves?.includes(a.id);
  if (mutualLove) {
    why.push(`${a.name} and ${b.name} is a canonical pairing — you don't have to think about it`);
  }

  const bTags = new Set(b.tags);
  const seen = new Set<string>();
  const matches: Affinity[] = [];
  for (const tag of a.tags) {
    for (const rule of BY_TAG.get(tag) ?? []) {
      if (seen.has(rule.why)) continue;
      const matched =
        (rule.a === tag && bTags.has(rule.b)) ||
        (rule.b === tag && bTags.has(rule.a));
      if (!matched) continue;
      seen.add(rule.why);
      matches.push(rule);
    }
  }

  // Strongest reasons first, so the "why" lines lead with the real one.
  matches.sort((x, y) => y.w - x.w);
  for (const m of matches) why.push(m.why);

  // Diminishing returns on tag overlap: the first couple of matches say a lot,
  // the eighth says almost nothing.
  const rawTags = matches.reduce((sum, m) => sum + m.w, 0);
  const tagScore = RULE_CEILING * (1 - Math.exp(-rawTags / RULE_CEILING));

  let score = tagScore + (mutualLove ? LOVE_BONUS : 0);

  // Two cheeses next to each other are fine, but they're not a *pairing*.
  if (a.cat === b.cat) score *= 0.55;

  return { score, why };
}

/** Baseline desirability with nothing else to go on: how many canonical
 *  partners an item has (a decent proxy for "board staple") plus whatever is at
 *  peak right now. The exponent spreads the field — without it every cheese
 *  scores within a few points of every other and the number says nothing. */
function baseAppeal(item: Item, month: number): number {
  const versatility = Math.pow(item.loves?.length ?? 0, 1.3);
  return versatility * 1.1 + (isInSeason(item, month) ? SEASON_BONUS : 0);
}

/** Squash an unbounded score into a 0-100 match. Tuned so a canonical pairing
 *  lands in the high 80s, a solid tag match in the 50s, and a shrug in the 20s —
 *  if everything scores 97 the number isn't telling anyone anything. */
function toMatch(raw: number): number {
  return Math.max(1, Math.min(99, Math.round(100 * (1 - Math.exp(-raw / 10.5)))));
}

export interface SuggestOptions {
  /** Restrict to what this zone accepts. */
  role: Role;
  /** What you already have — pantry items plus everything already placed. */
  anchors: Item[];
  month: number;
  /** Item ids already used on the board; ranked down, not removed. */
  placed?: string[];
  /** Hex colours already on the board, for the colour-gap nudge. */
  boardColors?: string[];
  limit?: number;
}

/** Rank what should go in a zone, with the reasoning attached. */
export function suggest(opts: SuggestOptions): Suggestion[] {
  const { role, anchors, month, placed = [], boardColors = [], limit = 8 } = opts;
  const placedSet = new Set(placed);
  const boardHues = boardColors.map(hueOf);

  const out: Suggestion[] = [];
  for (const item of itemsForRole(role)) {
    // With nothing in the pantry, versatility and season are all we have to go
    // on, so they carry the ranking. Once there are anchors, they take over.
    let raw = baseAppeal(item, month) * (anchors.length ? 0.5 : 1.6);
    const reasons: string[] = [];

    if (anchors.length) {
      let best = 0;
      let total = 0;
      const anchorWhy: { why: string[]; score: number; name: string }[] = [];
      for (const anchor of anchors) {
        if (anchor.id === item.id) continue;
        const r = pairScore(item, anchor);
        total += r.score;
        if (r.score > best) best = r.score;
        if (r.score > 0) {
          anchorWhy.push({ why: r.why, score: r.score, name: anchor.name });
        }
      }
      // Weight the single best partner heavily — one perfect match beats three
      // mediocre ones — but keep some credit for broad agreement.
      const avg = total / Math.max(1, anchors.length);
      raw += best * 0.9 + avg * 0.4;
      anchorWhy.sort((x, y) => y.score - x.score);
      for (const a of anchorWhy.slice(0, 2)) {
        for (const w of a.why.slice(0, 2)) reasons.push(w);
      }
    }

    const inSeason = isInSeason(item, month);
    if (inSeason) {
      reasons.unshift(`${item.name} is at peak right now — use it while you can`);
    }

    // Nudge toward colours the board is missing.
    if (boardHues.length >= 2) {
      const h = hueOf(item.palette[0]);
      const nearest = Math.min(...boardHues.map((bh) => hueDistance(h, bh)));
      if (nearest > 55) {
        raw += 2.2;
        reasons.push("brings a colour the board doesn't have yet");
      }
    }

    if (placedSet.has(item.id)) raw *= 0.25;

    // Dedupe reasons, keep order, cap at three.
    const why: string[] = [];
    for (const r of reasons) {
      if (!why.includes(r)) why.push(r);
      if (why.length === 3) break;
    }

    out.push({
      item,
      match: toMatch(raw),
      why,
      inSeason,
      ranked: anchors.length > 0,
    });
  }

  out.sort((a, b) => b.match - a.match || a.item.name.localeCompare(b.item.name));
  return out.slice(0, limit);
}

/** "I have peaches — what cheese?" Ranked partners across every category, or a
 *  single category when you know what you're shopping for. */
export function partnersFor(
  item: Item,
  opts: { month: number; cat?: Role; limit?: number } = { month: 1 },
): Suggestion[] {
  const { month, cat = "flex", limit = 6 } = opts;
  const pool = cat === "flex" ? ITEMS : itemsForRole(cat);
  const out: Suggestion[] = [];
  for (const cand of pool) {
    if (cand.id === item.id) continue;
    const r = pairScore(cand, item);
    if (r.score <= 0) continue;
    const inSeason = isInSeason(cand, month);
    const raw = r.score + (inSeason ? 2 : 0);
    const why = r.why.slice(0, 3);
    if (inSeason) why.unshift(`also at peak right now`);
    out.push({
      item: cand,
      match: toMatch(raw),
      why: why.slice(0, 3),
      inSeason,
      ranked: true,
    });
  }
  out.sort((a, b) => b.match - a.match || a.item.name.localeCompare(b.item.name));
  return out.slice(0, limit);
}

/** Resolve a list of ids to items, dropping anything unknown. */
export function itemsFromIds(ids: string[]): Item[] {
  const out: Item[] = [];
  for (const id of ids) {
    const item = getItem(id);
    if (item) out.push(item);
  }
  return out;
}
