import { hashSeed } from "./geometry";
import { CAT_LABEL, getItem, isInSeason, perGuestFor, seasonalPicks } from "./items";
import type { BoardFills, Cat, Item, Pattern, Tag } from "./types";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** What's actually on the board right now: the item plus which cut was chosen. */
export interface Placed {
  zoneId: string;
  item: Item;
  cutIndex: number;
}

export function placedItems(pattern: Pattern, fills: BoardFills): Placed[] {
  const out: Placed[] = [];
  for (const zone of pattern.zones) {
    const fill = fills[zone.id];
    if (!fill) continue;
    const item = getItem(fill.itemId);
    if (!item) continue;
    out.push({ zoneId: zone.id, item, cutIndex: fill.cutIndex });
  }
  return out;
}

// ─── Balance ─────────────────────────────────────────────────────────────────

export interface BalanceAxis {
  key: string;
  label: string;
  /** 0..1, where 1 means "well covered". */
  value: number;
  advice: string;
}

const AXES: { key: string; label: string; tags: Tag[]; advice: string }[] = [
  {
    key: "salty",
    label: "Salty",
    tags: ["salty", "briny", "umami"],
    advice: "Nothing here is properly salty. A cured meat, an aged cheese, or a bowl of olives.",
  },
  {
    key: "sweet",
    label: "Sweet",
    tags: ["sweet", "honeyed", "fruity"],
    advice: "No sweetness to push against the salt. Honey, a jam, or ripe fruit.",
  },
  {
    key: "creamy",
    label: "Creamy",
    tags: ["creamy", "silky", "spreadable", "buttery", "rich"],
    advice: "Everything is firm. One soft, spoonable cheese changes the whole board.",
  },
  {
    key: "crunchy",
    label: "Crunchy",
    tags: ["crunchy", "snappy", "firm", "crumbly", "flaky"],
    advice: "There's nothing to snap. Crackers, toasted nuts, or a crisp apple.",
  },
  {
    key: "acidic",
    label: "Acidic",
    tags: ["acidic", "citrus", "winey"],
    advice: "This will feel heavy after three bites. Pickles, citrus, or something tart.",
  },
  {
    key: "funky",
    label: "Funky",
    tags: ["funky", "earthy", "smoky", "bitter", "peppery"],
    advice: "Very safe so far. One assertive cheese would give the board an opinion.",
  },
];

/** Share of items carrying each axis, scaled so ~a third of the board counts as
 *  full coverage. */
export function balance(items: Item[]): BalanceAxis[] {
  return AXES.map((axis) => {
    if (items.length === 0) {
      return { key: axis.key, label: axis.label, value: 0, advice: axis.advice };
    }
    const hits = items.filter((i) => i.tags.some((t) => axis.tags.includes(t))).length;
    const ratio = hits / items.length;
    return {
      key: axis.key,
      label: axis.label,
      value: Math.min(1, ratio / 0.34),
      advice: axis.advice,
    };
  });
}

// ─── Colour ──────────────────────────────────────────────────────────────────

function hsl(hex: string): { h: number; s: number; l: number } {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return { h, s, l };
}

/** Beige is the default failure state of a charcuterie board. */
function isBeige(hex: string): boolean {
  const { h, s, l } = hsl(hex);
  return (h >= 18 && h <= 58 && s < 0.62 && l > 0.55) || (s < 0.15 && l > 0.5);
}

function isGreen(hex: string): boolean {
  const { h, s } = hsl(hex);
  return h >= 68 && h <= 165 && s > 0.15;
}

export function paletteOf(items: Item[]): string[] {
  const seen: string[] = [];
  for (const i of items) {
    if (!seen.includes(i.palette[0])) seen.push(i.palette[0]);
  }
  return seen;
}

// ─── The Board Doctor ────────────────────────────────────────────────────────

export interface Critique {
  id: string;
  severity: "good" | "note" | "warn";
  text: string;
}

const HEIGHT_WORDS = /stack|stand|upright|tower|height|lean|cabin/i;

export function boardDoctor(
  pattern: Pattern,
  fills: BoardFills,
  month: number,
): Critique[] {
  const placed = placedItems(pattern, fills);
  const items = placed.map((p) => p.item);
  const out: Critique[] = [];

  if (items.length === 0) {
    return [
      {
        id: "empty",
        severity: "note",
        text: "Nothing on the board yet. Click any section to start — or run a theme and pull it apart from there.",
      },
    ];
  }

  const emptyCount = pattern.zones.length - placed.length;
  if (emptyCount > 0) {
    const share = emptyCount / pattern.zones.length;
    out.push({
      id: "gaps",
      severity: share > 0.4 ? "warn" : "note",
      text:
        share > 0.4
          ? `${emptyCount} sections still empty. A sparse board reads as unfinished no matter how good the cheese is.`
          : `${emptyCount} small gaps left. Grapes, nuts and folded herbs exist precisely for this.`,
    });
  }

  // Odd numbers plate better. This is real styling advice, not superstition.
  const cheeses = items.filter((i) => i.cat === "cheese");
  if (cheeses.length === 0) {
    out.push({
      id: "no-cheese",
      severity: "warn",
      text: "There's no cheese on this board. Bold choice. Add at least one anchor.",
    });
  } else if (cheeses.length % 2 === 0) {
    out.push({
      id: "even-cheese",
      severity: "note",
      text: `${cheeses.length} cheeses. Odd numbers plate better — go to ${cheeses.length + 1}, or drop one.`,
    });
  } else if (cheeses.length >= 3) {
    out.push({
      id: "cheese-count",
      severity: "good",
      text: `${cheeses.length} cheeses, an odd number. That's the rule, and it genuinely looks better.`,
    });
  }

  // Texture / flavour gaps.
  for (const axis of balance(items)) {
    if (axis.value < 0.3) {
      out.push({ id: `axis-${axis.key}`, severity: "warn", text: axis.advice });
    }
  }

  // Colour.
  const beige = items.filter((i) => isBeige(i.palette[0])).length;
  if (items.length >= 4 && beige / items.length > 0.6) {
    out.push({
      id: "beige",
      severity: "warn",
      text: `${Math.round((beige / items.length) * 100)}% of this board is beige. Add something purple or deep red — figs, blackberries, a dark jam.`,
    });
  }
  if (items.length >= 4 && !items.some((i) => isGreen(i.palette[0]))) {
    out.push({
      id: "no-green",
      severity: "note",
      text: "Nothing green anywhere. A few rosemary sprigs pushed into the seams fixes this in ten seconds.",
    });
  }

  // Height — boards are almost always too flat.
  const hasHeight = placed.some((p) => {
    const cut = p.item.cuts[p.cutIndex] ?? p.item.cuts[0];
    if (!cut) return false;
    return (
      cut.motif === "batons" ||
      cut.motif === "stack" ||
      HEIGHT_WORDS.test(cut.name) ||
      HEIGHT_WORDS.test(cut.how)
    );
  });
  if (items.length >= 5 && !hasHeight) {
    out.push({
      id: "no-height",
      severity: "note",
      text: "Everything is lying flat. Stand grissini up in a glass, or stack cheese batons log-cabin style — one vertical thing changes the photo.",
    });
  }

  // Category domination.
  const counts = new Map<Cat, number>();
  for (const i of items) counts.set(i.cat, (counts.get(i.cat) ?? 0) + 1);
  for (const [cat, n] of counts) {
    if (items.length >= 5 && n / items.length > 0.45) {
      out.push({
        id: `dominant-${cat}`,
        severity: "note",
        text: `${CAT_LABEL[cat].toLowerCase()} is ${Math.round((n / items.length) * 100)}% of the board. Broaden it out or lean in and call it a theme.`,
      });
    }
  }

  // Seasonality — this is the whole point of asking what you already have.
  const inSeasonUsed = items.filter((i) => isInSeason(i, month));
  const available = seasonalPicks(month).filter(
    (i) => !items.some((p) => p.id === i.id),
  );
  if (inSeasonUsed.length === 0 && available.length > 0) {
    const names = available.slice(0, 3).map((i) => i.name.toLowerCase()).join(", ");
    out.push({
      id: "season",
      severity: "note",
      text: `It's ${MONTHS[month - 1]} and nothing on this board is at peak. ${names} are — use them while they're good.`,
    });
  } else if (inSeasonUsed.length > 0) {
    out.push({
      id: "season-good",
      severity: "good",
      text: `${inSeasonUsed.map((i) => i.name).join(" and ")} at peak — this board could only be built in ${MONTHS[month - 1]}.`,
    });
  }

  // The single most common practical mistake.
  if (items.some((i) => i.id === "castelvetrano" || i.id === "kalamata")) {
    out.push({
      id: "pit-bowl",
      severity: "note",
      text: "You've got olives with pits. Put out a second small empty bowl — forgetting it is the most common board mistake there is.",
    });
  }

  const warns = out.filter((c) => c.severity === "warn").length;
  if (warns === 0 && placed.length === pattern.zones.length) {
    out.unshift({
      id: "complete",
      severity: "good",
      text: "Every section filled and nothing obviously missing. This board is ready. Take the photo before anyone touches it.",
    });
  }

  return out;
}

// ─── Shopping list ───────────────────────────────────────────────────────────

export interface ShoppingLine {
  item: Item;
  qty: string;
}

function formatQty(amount: number, unit: string): string {
  if (unit === "oz" && amount >= 16) {
    const lb = amount / 16;
    return `${lb % 1 === 0 ? lb : lb.toFixed(1)} lb`;
  }
  const rounded = amount < 10 ? Math.round(amount * 2) / 2 : Math.round(amount);
  return `${rounded} ${unit}`;
}

export function shoppingList(
  pattern: Pattern,
  fills: BoardFills,
  guests: number,
): { cat: Cat; label: string; lines: ShoppingLine[] }[] {
  const placed = placedItems(pattern, fills);

  // One zone per item is the common case, but a theme can place the same item
  // twice — buy for both.
  const tally = new Map<string, { item: Item; count: number }>();
  for (const p of placed) {
    const entry = tally.get(p.item.id);
    if (entry) entry.count += 1;
    else tally.set(p.item.id, { item: p.item, count: 1 });
  }

  const groups = new Map<Cat, ShoppingLine[]>();
  for (const { item, count } of tally.values()) {
    const per = perGuestFor(item);
    // A second placement of the same item doesn't double the shop — it just
    // means it's spread across the board. Add half again.
    const multiplier = 1 + (count - 1) * 0.5;
    const amount = per.amount * guests * multiplier;
    const line: ShoppingLine = { item, qty: formatQty(amount, per.unit) };
    const list = groups.get(item.cat);
    if (list) list.push(line);
    else groups.set(item.cat, [line]);
  }

  const order: Cat[] = [
    "cheese",
    "meat",
    "cracker",
    "fruit",
    "dried",
    "spread",
    "briny",
    "veg",
    "nut",
    "sweet",
    "garnish",
  ];
  return order
    .filter((c) => groups.has(c))
    .map((c) => ({
      cat: c,
      label: CAT_LABEL[c],
      lines: (groups.get(c) ?? []).sort((a, b) =>
        a.item.name.localeCompare(b.item.name),
      ),
    }));
}

// ─── Build order ─────────────────────────────────────────────────────────────

export interface BuildStep {
  n: number;
  title: string;
  detail: string;
}

const BUILD_SEQUENCE: { cats: Cat[]; title: string; detail: string }[] = [
  {
    cats: ["spread"],
    title: "Bowls first",
    detail:
      "Anything wet goes down before anything else. Bowls are the fixed points the rest of the board arranges around — placing them last means shoving everything aside to fit them.",
  },
  {
    cats: ["cheese"],
    title: "Then the cheese",
    detail:
      "Space them apart rather than clustering them, and turn each one so a cut face points at the room. Leave a knife with every soft cheese.",
  },
  {
    cats: ["meat"],
    title: "Meat, in folds",
    detail:
      "Rivers, ruffles and roses. Fill the runs between the cheeses so the meat becomes the connective tissue of the board.",
  },
  {
    cats: ["cracker"],
    title: "Crackers against the cheese",
    detail:
      "Cascade them along the edges of the cheese piles so people can see what goes with what. Stand a few upright for height.",
  },
  {
    cats: ["fruit", "briny", "veg"],
    title: "Fruit, crudité and pickles into the big gaps",
    detail:
      "Now you're filling, not composing. Work in odd-numbered clusters and keep colours apart — don't put both dark fruits side by side.",
  },
  {
    cats: ["nut", "dried", "sweet"],
    title: "Nuts and dried fruit into the small ones",
    detail:
      "These are the mortar. Spoon them into the awkward triangles between round things until you can't see bare board.",
  },
  {
    cats: ["garnish"],
    title: "Garnish last, into the seams",
    detail:
      "Herbs go into the negative space, never on top of the food. Three sprigs read as styled; thirty read as a hedge.",
  },
];

export function buildOrder(pattern: Pattern, fills: BoardFills): BuildStep[] {
  const placed = placedItems(pattern, fills);
  const steps: BuildStep[] = [];
  let n = 1;
  for (const stage of BUILD_SEQUENCE) {
    const names = placed
      .filter((p) => stage.cats.includes(p.item.cat))
      .map((p) => {
        const cut = p.item.cuts[p.cutIndex] ?? p.item.cuts[0];
        return cut ? `${p.item.name} (${cut.name.toLowerCase()})` : p.item.name;
      });
    if (names.length === 0) continue;
    const unique = [...new Set(names)];
    steps.push({
      n: n++,
      title: stage.title,
      detail: `${unique.join(", ")}. ${stage.detail}`,
    });
  }
  return steps;
}

// ─── Board name ──────────────────────────────────────────────────────────────

const ADJECTIVES = [
  "Velvet",
  "Gilded",
  "Rustic",
  "Midnight",
  "Golden",
  "Unrepentant",
  "Honeyed",
  "Salt-Cured",
  "Sunlit",
  "Riotous",
  "Quiet",
  "Extremely Serious",
  "Reckless",
  "Well-Advised",
  "Ill-Advised",
  "Ceremonial",
];

const NOUNS = [
  "Ploughman",
  "Grazing",
  "Assembly",
  "Spread",
  "Situation",
  "Affair",
  "Arrangement",
  "Proposition",
  "Feast",
  "Committee",
  "Manifesto",
  "Endeavour",
  "Occasion",
  "Undertaking",
];

/** Deterministic from the contents, so the same board always has the same name
 *  and it changes the moment you swap an ingredient. */
export function boardName(pattern: Pattern, fills: BoardFills): string {
  const ids = placedItems(pattern, fills)
    .map((p) => p.item.id)
    .sort()
    .join("|");
  if (!ids) return "The Empty Board";
  const h = hashSeed(ids);
  const adj = ADJECTIVES[h % ADJECTIVES.length];
  const noun = NOUNS[Math.floor(h / ADJECTIVES.length) % NOUNS.length];
  return `The ${adj} ${noun}`;
}

// ─── Export ──────────────────────────────────────────────────────────────────

/** The whole plan as markdown, for pasting into notes or a shopping app. */
export function toMarkdown(
  boardName_: string,
  boardLabel: string,
  patternName: string,
  pattern: Pattern,
  fills: BoardFills,
  guests: number,
): string {
  const lines: string[] = [
    `# ${boardName_}`,
    "",
    `${boardLabel} · ${patternName} · for ${guests} ${guests === 1 ? "guest" : "guests"}`,
    "",
    "## Shopping list",
    "",
  ];

  for (const group of shoppingList(pattern, fills, guests)) {
    lines.push(`**${group.label}**`, "");
    for (const line of group.lines) {
      lines.push(`- ${line.item.name} — ${line.qty}`);
    }
    lines.push("");
  }

  lines.push("## How to cut it", "");
  for (const p of placedItems(pattern, fills)) {
    const cut = p.item.cuts[p.cutIndex] ?? p.item.cuts[0];
    if (!cut) continue;
    lines.push(`- **${p.item.name} — ${cut.name}.** ${cut.how}`);
  }

  lines.push("", "## Assembly order", "");
  for (const step of buildOrder(pattern, fills)) {
    lines.push(`${step.n}. **${step.title}** — ${step.detail}`);
  }

  return lines.join("\n");
}
