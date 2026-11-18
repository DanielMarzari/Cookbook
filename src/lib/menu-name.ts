/**
 * What a dish is called on a menu, as opposed to in the kitchen.
 *
 * "Braciole" is the right name for a recipe and a thin one for a card a guest
 * reads — it says what you made but nothing about what arrives. The four
 * formulas below are the ones restaurants actually use, and each needs a
 * different fact about the recipe, which is why these are suggestions drawn
 * from the recipe rather than a text generator:
 *
 *   prep + main          how it was cooked, then the thing itself
 *   flavour/texture      the word that lets someone taste it before it comes
 *   origin or style      a place or a style that sets expectations fast
 *   provenance           a producer or a standout component, where it earns it
 *
 * Everything here is offered, never applied. The suggestion is a starting point
 * for a sentence a person writes.
 */

export interface MenuNameInput {
  title: string;
  cuisine?: string | null;
  origin?: string | null;
  sourceName?: string | null;
  sourceAuthor?: string | null;
  /** Step texts, in order. */
  instructions?: string[];
  /** Ingredient names, in order. */
  ingredients?: string[];
  totalMinutes?: number | null;
}

/** Ordered: the most specific method wins, so "wood-grilled" beats "grilled". */
const METHODS: [RegExp, string][] = [
  [/\b(wood[- ]fired|wood[- ]grill|over (oak|applewood|hardwood))/i, 'Wood-Grilled'],
  [/\b(charcoal|binchotan|over coals)\b/i, 'Charcoal-Grilled'],
  [/\bconfit\b/i, 'Confit'],
  [/\b(cold[- ]smoke|smoker|smoked over)\b/i, 'Smoked'],
  [/\b(cure[d]?|brine[d]?|salt[- ]pack)\b/i, 'Cured'],
  [/\bbraise|braising\b/i, 'Braised'],
  [/\b(slow[- ]roast|roast .{0,20}(low|275|300|325)|low and slow)\b/i, 'Slow-Roasted'],
  [/\broast|roasting\b/i, 'Roasted'],
  [/\b(grill|griddle|plancha)\b/i, 'Grilled'],
  [/\b(deep[- ]fr(y|ied)|fryer|submerge .{0,12}oil)\b/i, 'Fried'],
  [/\b(sear|seared)\b/i, 'Pan-Seared'],
  [/\bpoach(ed|ing)?\b/i, 'Poached'],
  [/\bsteam(ed|ing)?\b/i, 'Steamed'],
  [/\b(hand[- ]roll|roll .{0,12}by hand|shape .{0,12}by hand)\b/i, 'Hand-Rolled'],
  [/\b(hand[- ]cut|cut by hand)\b/i, 'Hand-Cut'],
  [/\bchurn(ed|ing)?\b/i, 'Hand-Churned'],
  [/\b(knead|bulk ferment|autolyse|banneton)\b/i, 'Slow-Proved'],
  [/\b(stone[- ]ground|mortar|pestle|pound(ed)?)\b/i, 'Hand-Pounded'],
  [/\b(fry|frying|pan[- ]fr)\b/i, 'Pan-Fried'],
];

/** The word that lets a reader taste it before it arrives. */
const TEXTURES: [RegExp, string][] = [
  [/\bbr[ûu]l[ée]e?\b/i, 'Burnt-Sugar'],
  [/\b(blister|charred|blacken)\b/i, 'Charred'],
  [/\b(smoke|smoky|smoked)\b/i, 'Smoky'],
  [/\b(crisp|crispy|crunch|golden and crisp)\b/i, 'Crispy'],
  [/\b(custard|cr[èe]me anglaise|emulsif|velvet)\b/i, 'Silky'],
  [/\b(caramelis|carameliz|caramel)\b/i, 'Caramelised'],
  [/\b(toast(ed)?|nutty)\b/i, 'Toasted'],
  [/\b(whip(ped)?|aerat|mousse)\b/i, 'Whipped'],
  [/\b(melt|molten|gooey)\b/i, 'Molten'],
  [/\b(glaze[d]?|lacquer)\b/i, 'Glazed'],
  [/\b(flaky|laminat|layers of)\b/i, 'Flaky'],
];

/**
 * Pantry staples make a terrible "standout ingredient".
 *
 * Nobody writes "Salt and Water Sorbet". The lead is the first thing that is
 * actually the point of the dish.
 */
const STAPLE =
  /^(salt|kosher salt|flaky salt|water|ice|oil|olive oil|vegetable oil|butter|unsalted butter|flour|all[- ]purpose flour|sugar|granulated sugar|caster sugar|pepper|black pepper|baking powder|baking soda|yeast|active dry yeast|active sourdough starter|starter|egg|eggs|egg yolks?|egg whites?|milk|whole milk|full[- ]?fat milk|skim milk|heavy cream|cream|double cream|brown sugar|white sugar|cornstarch|vanilla|vanilla extract|extract \(vanilla\))$/i;

/**
 * Structure, not substance.
 *
 * Phyllo, lavash and a dough are what a dish is built out of rather than what
 * it is about — "Pan-Fried Lavash" names the wrapper and loses the kebab. So
 * are the plain cuts: nobody puts "Beef Round" on a menu as the draw.
 */
const STRUCTURAL =
  /\b(dough|phillo|phyllo|filo|pastry|lavash|tortilla|wrapper|crust|batter|starter|breadcrumbs?|round|chuck roast|thigh|breast|shank|mince)\b/i;

const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

function firstMatch(hay: string, table: [RegExp, string][]): string | null {
  for (const [re, label] of table) if (re.test(hay)) return label;
  return null;
}

/** The ingredient a reader would recognise as the point of the dish. */
function leadIngredient(ingredients: string[]): string | null {
  for (const raw of ingredients) {
    const name = raw.trim();
    if (!name || STAPLE.test(name)) continue;
    // Drop a parenthetical or a trailing qualifier: "Flour (00)" → "Flour".
    const clean = name
      .replace(/\(.*?\)/g, '')
      .replace(/,.*$/, '')
      .replace(/[:;.\u2014-]+\s*$/, '') // a stray colon off an ingredient line
      .trim();
    if (clean && !STAPLE.test(clean) && !STRUCTURAL.test(clean)) return titleCase(clean);
  }
  return null;
}

/** Strip a method word the title already carries, so nothing doubles up. */
function bareTitle(title: string): string {
  return title
    .replace(/\s+—\s+.*$/, '') // "Sorbet — Apple Cider" → "Sorbet"
    .replace(
      /^(grilled|roasted|braised|fried|smoked|cured|baked|steamed|poached|seared|whipped|classic|homemade|the best|simple|easy)\s+/i,
      '',
    )
    .trim();
}

/** The part after an em dash, which is usually what makes a branch itself. */
function branchNote(title: string): string | null {
  const m = /—\s*(.+)$/.exec(title);
  return m ? titleCase(m[1].trim()) : null;
}

export function suggestMenuNames(input: MenuNameInput): string[] {
  const steps = (input.instructions ?? []).join(' ');
  const ings = input.ingredients ?? [];
  const hay = `${input.title} ${steps} ${ings.join(' ')}`;

  const base = bareTitle(input.title) || input.title;
  const branch = branchNote(input.title);
  const lead = leadIngredient(ings);
  const long = (input.totalMinutes ?? 0) >= 180;

  let method = firstMatch(hay, METHODS);
  // "Slow-" earns itself from the clock rather than from a word in the steps.
  if (method && long && /^(Braised|Roasted|Proved)$/.test(method)) method = `Slow-${method}`;
  const texture = firstMatch(hay, TEXTURES);

  // Cuisine before origin: cuisine is already the adjective. "Italian-Style"
  // reads; "Italy-Style" does not, and origin stores the country.
  const place = (input.cuisine || input.origin || '').trim();
  const usablePlace = place && !/^other$/i.test(place) ? titleCase(place) : null;

  const who = (input.sourceAuthor || input.sourceName || '').trim();
  // A cookbook or a website is not provenance; a person or a farm is.
  // A handle is not provenance either — one lowercase word, or anything with
  // digits in it, is an account rather than a person or a farm.
  const usableWho =
    who &&
    !/(cookbook|\.com|instagram|website|blog|magazine|my jewish learning|tasting history)/i.test(who) &&
    /\s/.test(who) &&
    !/\d/.test(who)
      ? titleCase(who)
      : null;

  const out: string[] = [];
  const add = (s: string | null | undefined) => {
    const v = (s || '').replace(/\s+/g, ' ').trim();
    if (!v) return;
    // Don't offer the title back, and don't repeat a word twice in one name.
    if (v.toLowerCase() === input.title.toLowerCase()) return;
    const words = v.toLowerCase().split(/[\s-]+/);
    if (new Set(words).size !== words.length) return;
    if (!out.some((x) => x.toLowerCase() === v.toLowerCase())) out.push(v);
  };

  // 1 — prep + main
  // Only ever method + the dish. Method + lead ingredient reads as a different
  // dish entirely: "Pan-Fried Lavash" is not a döner.
  if (method) add(`${method} ${base}`);

  // 2 — flavour or texture + dish
  if (texture) add(`${texture} ${base}`);
  if (texture && branch) add(`${texture} ${branch} ${base}`);

  // 3 — origin or style + dish
  if (usablePlace) add(`${usablePlace}-Style ${base}`);

  // 4 — standout ingredient or provenance
  if (branch) add(`${branch} ${base}`);
  if (lead && lead.toLowerCase() !== base.toLowerCase()) add(`${base} with ${lead}`);
  if (usableWho) add(`${usableWho}'s ${base}`);

  return out.slice(0, 6);
}
