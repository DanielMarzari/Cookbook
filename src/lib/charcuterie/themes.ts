import { getItem } from "./items";
import { suggest } from "./pairings";
import type { BoardFills, Cat, Pattern, Role } from "./types";

/** A curated board you can drop in one click, then pick apart. Each theme is an
 *  ordered preference list per category — the applier walks the pattern's zones
 *  and takes the best unused pick for each role. */
export interface Theme {
  id: string;
  name: string;
  blurb: string;
  /** Months this theme is happiest in, used to sort the theme rail. */
  season?: number[];
  picks: Partial<Record<Cat, string[]>>;
}

export const THEMES: Theme[] = [
  {
    id: "stone-fruit",
    name: "Peak Summer Stone Fruit",
    blurb: "Built around a perfect peach. Everything else is support staff.",
    season: [6, 7, 8, 9],
    picks: {
      cheese: ["burrata", "chevre", "gorgonzola-dolce", "ricotta", "mozzarella"],
      meat: ["prosciutto", "coppa", "bresaola"],
      fruit: ["peach", "fig", "nectarine", "plum", "blackberry"],
      cracker: ["sourdough", "crostini", "grissini"],
      spread: ["honeycomb", "olive-oil", "hot-honey"],
      nut: ["pistachio", "marcona-almond"],
      dried: ["dried-apricot"],
      briny: ["castelvetrano"],
      garnish: ["basil", "mint", "edible-flowers"],
      sweet: ["amaretti"],
    },
  },
  {
    id: "tuscan",
    name: "Tuscan Golden Hour",
    blurb: "Fennel salami, hard sheep's cheese, and far too much olive oil.",
    picks: {
      cheese: ["pecorino", "parmigiano", "mozzarella", "taleggio"],
      meat: ["finocchiona", "coppa", "prosciutto", "mortadella"],
      fruit: ["fig", "grape-red", "pear"],
      cracker: ["grissini", "crostini", "sourdough"],
      spread: ["olive-oil", "fig-jam", "tapenade"],
      nut: ["marcona-almond", "walnut"],
      briny: ["castelvetrano", "artichoke", "caper-berry"],
      dried: ["dried-fig", "golden-raisin"],
      garnish: ["rosemary", "basil"],
      sweet: ["amaretti", "dark-chocolate"],
    },
  },
  {
    id: "nordic",
    name: "Nordic Winter",
    blurb: "Smoke, rye-dark colours, pickled things and a lot of dill energy.",
    season: [11, 12, 1, 2],
    picks: {
      cheese: ["aged-gouda", "smoked-gouda", "havarti", "clothbound-cheddar"],
      meat: ["speck", "bresaola", "pate"],
      fruit: ["citrus", "apple", "pear"],
      cracker: ["oat-cake", "seeded-crisp", "lavash"],
      spread: ["mustard", "onion-jam", "honeycomb"],
      nut: ["hazelnut", "walnut", "smoked-almond"],
      briny: ["pickled-onion", "cornichon"],
      dried: ["dried-cherry", "prune"],
      garnish: ["thyme", "rosemary"],
      sweet: ["dark-chocolate", "shortbread"],
    },
  },
  {
    id: "ploughmans",
    name: "The Ploughman's",
    blurb: "Cheddar, pickle, pork pie logic. A pub lunch that got ambitious.",
    picks: {
      cheese: ["clothbound-cheddar", "cheddar", "stilton", "young-gouda"],
      meat: ["pate", "rillettes", "speck"],
      fruit: ["apple", "pear", "grape-red"],
      cracker: ["oat-cake", "sourdough", "seeded-crisp"],
      spread: ["mustard", "onion-jam", "apricot-preserve"],
      nut: ["walnut", "smoked-almond"],
      briny: ["cornichon", "pickled-onion", "peperoncini"],
      dried: ["dried-fig", "prune"],
      garnish: ["thyme", "sage"],
      sweet: ["shortbread"],
    },
  },
  {
    id: "blue-honey",
    name: "Midnight Blue & Honey",
    blurb: "Three blues and a slab of honeycomb. Not a board for cowards.",
    picks: {
      cheese: ["roquefort", "stilton", "gorgonzola-dolce", "taleggio"],
      meat: ["speck", "prosciutto"],
      fruit: ["pear", "fig", "grape-red"],
      cracker: ["oat-cake", "seeded-crisp", "water-cracker"],
      spread: ["honeycomb", "hot-honey", "fig-jam"],
      nut: ["walnut", "pecan", "hazelnut"],
      dried: ["date", "dried-fig", "prune"],
      briny: ["caper-berry"],
      garnish: ["thyme", "sage"],
      sweet: ["dark-chocolate", "shortbread"],
    },
  },
  {
    id: "spanish",
    name: "Spanish Sunset",
    blurb: "Manchego and membrillo, jamón, smoked paprika, green olives.",
    picks: {
      cheese: ["manchego", "pecorino", "feta"],
      meat: ["jamon-iberico", "chorizo", "soppressata"],
      fruit: ["melon", "fig", "grape-green"],
      cracker: ["lavash", "grissini", "crostini"],
      spread: ["membrillo", "olive-oil", "apricot-preserve"],
      nut: ["marcona-almond", "smoked-almond"],
      briny: ["castelvetrano", "peperoncini", "artichoke"],
      dried: ["dried-apricot", "golden-raisin"],
      garnish: ["rosemary", "microgreens"],
      sweet: ["dark-chocolate"],
    },
  },
  {
    id: "brunch",
    name: "The Brunch Board",
    blurb: "Soft cheeses, berries, pastry-adjacent bread. Mimosa optional, encouraged.",
    picks: {
      cheese: ["brie", "havarti", "ricotta", "triple-creme"],
      meat: ["mortadella", "prosciutto", "coppa"],
      fruit: ["strawberry", "blueberry", "raspberry", "citrus"],
      cracker: ["baguette", "water-cracker", "crostini"],
      spread: ["apricot-preserve", "honeycomb", "fig-jam"],
      nut: ["pistachio", "cashew", "marcona-almond"],
      dried: ["candied-orange", "dried-apricot", "golden-raisin"],
      briny: ["cornichon"],
      garnish: ["mint", "edible-flowers", "thyme"],
      sweet: ["amaretti", "shortbread"],
    },
  },
  {
    id: "movie-night",
    name: "Movie Night",
    blurb: "Sharp, salty, spicy, no cutlery. Everything eats in one bite.",
    picks: {
      cheese: ["cheddar", "smoked-gouda", "young-gouda", "boursin"],
      meat: ["soppressata", "genoa", "chorizo"],
      fruit: ["grape-red", "apple"],
      cracker: ["water-cracker", "pita-chip", "seeded-crisp"],
      spread: ["pepper-jelly", "hot-honey", "mustard"],
      nut: ["smoked-almond", "cashew", "pecan"],
      briny: ["giardiniera", "castelvetrano", "peperoncini"],
      dried: ["dried-cherry", "dried-mango"],
      garnish: ["rosemary"],
      sweet: ["dark-chocolate", "choc-almond"],
    },
  },
  {
    id: "orchard",
    name: "Autumn Orchard",
    blurb: "Apples, pears, alpine cheese and brown butter everything.",
    season: [9, 10, 11],
    picks: {
      cheese: ["comte", "taleggio", "gruyere", "clothbound-cheddar"],
      meat: ["speck", "prosciutto", "pate"],
      fruit: ["apple", "pear", "persimmon", "grape-red"],
      cracker: ["crostini", "oat-cake", "sourdough"],
      spread: ["onion-jam", "honeycomb", "mustard"],
      nut: ["walnut", "pecan", "hazelnut"],
      dried: ["dried-fig", "date"],
      briny: ["cornichon"],
      garnish: ["sage", "thyme", "rosemary"],
      sweet: ["dark-chocolate"],
    },
  },
  {
    id: "vegetarian",
    name: "The Vegetarian Feast",
    blurb: "No meat, no apology. Bowls do the heavy lifting instead.",
    picks: {
      cheese: ["burrata", "chevre", "feta", "manchego", "halloumi"],
      fruit: ["pomegranate", "fig", "grape-green", "melon"],
      cracker: ["lavash", "pita-chip", "sourdough", "crostini"],
      spread: ["hummus", "olive-oil", "tapenade", "honeycomb"],
      nut: ["pistachio", "marcona-almond", "walnut"],
      briny: ["castelvetrano", "artichoke", "pickled-onion", "peperoncini"],
      dried: ["dried-apricot", "date"],
      garnish: ["mint", "basil", "microgreens", "edible-flowers"],
      sweet: ["dark-chocolate", "amaretti"],
    },
  },
  {
    id: "crudite",
    name: "The Crudité Table",
    blurb: "Raw, cold and crunchy, built around three big bowls of dip.",
    season: [5, 6, 7, 8],
    picks: {
      veg: ["radish", "snap-pea", "cucumber", "carrot", "bell-pepper", "endive", "cherry-tomato"],
      spread: ["whipped-feta", "hummus", "romesco", "muhammara"],
      cheese: ["labneh", "boursin", "feta"],
      cracker: ["pita-chip", "lavash", "everything-cracker"],
      nut: ["marcona-almond", "pine-nut"],
      briny: ["castelvetrano", "peperoncini", "roasted-pepper"],
      fruit: ["watermelon", "grape-green"],
      garnish: ["dill", "chive", "mint", "fennel-frond"],
      dried: ["dried-apricot"],
      meat: ["prosciutto"],
      sweet: ["dark-chocolate"],
    },
  },
  {
    id: "smoked",
    name: "Smoke & Rye",
    blurb: "Smoked fish, dark bread, pickles and dill. A Baltic sort of afternoon.",
    picks: {
      meat: ["smoked-salmon", "duck-prosciutto", "speck", "landjaeger"],
      cheese: ["cream-cheese", "labneh", "havarti", "smoked-gouda"],
      cracker: ["rye-crisp", "everything-cracker", "melba-toast", "charcoal-cracker"],
      briny: ["pickled-onion", "cornichon", "pickled-mushroom", "caper-berry"],
      veg: ["cucumber", "radish"],
      spread: ["mustard", "apple-butter", "balsamic-glaze"],
      fruit: ["clementine", "apple"],
      nut: ["hazelnut", "walnut"],
      dried: ["dried-pear", "prune"],
      garnish: ["dill", "chive", "fennel-frond"],
      sweet: ["dark-chocolate"],
    },
  },
  {
    id: "black-white",
    name: "Black & White",
    blurb: "One colour rule, strictly enforced. Charcoal crackers, ash-lined goat, dark chocolate.",
    picks: {
      cheese: ["humboldt-fog", "morbier", "burrata", "triple-creme", "roquefort"],
      cracker: ["charcoal-cracker", "water-cracker", "lavash"],
      meat: ["truffle-salami", "lardo", "culatello"],
      spread: ["tapenade", "truffle-honey", "balsamic-glaze"],
      fruit: ["blackberry", "grape-red"],
      briny: ["kalamata", "caper-berry"],
      veg: ["endive", "radish"],
      nut: ["macadamia", "brazil-nut"],
      dried: ["prune", "date"],
      sweet: ["dark-chocolate", "chocolate-truffle"],
      garnish: ["thyme", "flaky-salt"],
    },
  },
];

export function getTheme(id: string): Theme | undefined {
  return THEMES.find((t) => t.id === id);
}

/** Fill every zone in a pattern from a theme. Zones the theme has nothing left
 *  for fall through to the ranked suggestion engine, so a 16-zone runner still
 *  comes out complete. */
export function applyTheme(
  theme: Theme,
  pattern: Pattern,
  month: number,
): BoardFills {
  const fills: BoardFills = {};
  const used = new Set<string>();

  // Roles with the fewest candidates get served first, so a theme's single
  // garnish doesn't get eaten by an earlier flex zone.
  const zones = [...pattern.zones].sort((a, b) => {
    const ca = theme.picks[a.role as Cat]?.length ?? 99;
    const cb = theme.picks[b.role as Cat]?.length ?? 99;
    return ca - cb;
  });

  for (const zone of zones) {
    const preferred = theme.picks[zone.role as Cat] ?? [];
    // Match the role as well as the id. A theme listing something under the
    // wrong heading would otherwise put an item in a zone the picker would
    // never offer it for, and quietly skew the balance and shopping list.
    const pick = preferred.find((id) => {
      if (used.has(id)) return false;
      const item = getItem(id);
      return !!item && (zone.role === "flex" || item.cat === zone.role);
    });

    if (pick) {
      used.add(pick);
      fills[zone.id] = { itemId: pick, cutIndex: 0 };
      continue;
    }

    // Nothing left in the theme for this role — fall back to what pairs best
    // with everything the theme has already put down.
    const anchors = [...used].map(getItem).filter((i) => i !== undefined);
    const ranked = suggest({
      role: zone.role as Role,
      anchors,
      month,
      placed: [...used],
      limit: 3,
    });
    const fallback = ranked.find((s) => !used.has(s.item.id)) ?? ranked[0];
    if (fallback) {
      used.add(fallback.item.id);
      fills[zone.id] = { itemId: fallback.item.id, cutIndex: 0 };
    }
  }

  return fills;
}
