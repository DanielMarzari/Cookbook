/**
 * What a dish is, as a small set of decisions.
 *
 * A recipe tells you how to make one thing. This answers the prior question:
 * which decisions actually separate this dish from its neighbours, and which
 * are yours to change. Twelve egg dishes come out of one egg and a pan — what
 * differs is the state it is in when it meets heat, and where you stop.
 *
 * The authored form is a table: named dimensions across the top, one row per
 * dish. The tree views are DERIVED from it (see lib/canon.ts) by nesting on the
 * dimensions in order, so the table and the outline can never disagree — there
 * is only one place to be wrong.
 */

export interface Facet {
  id: string;
  /** Column heading, and the label the tree uses when it forks here. */
  label: string;
}

export interface CanonDish {
  name: string;
  /**
   * Name of the dish this one descends from.
   *
   * Only for families where lineage is real rather than derivable — vodka sauce
   * IS rosa plus two things, and no arrangement of facet columns can discover
   * that. Where it is absent the tree is grown from the facets instead.
   */
  parent?: string;
  /** facet id -> the chips in that cell. Several chips means several moves. */
  facets: Record<string, string[]>;
  /** A line of why, shown when this dish is the one you're looking at. */
  note?: string;
}

export interface Canon {
  slug: string;
  name: string;
  standfirst: string;
  /** What every dish here starts from. */
  root: string;
  facets: Facet[];
  /** Facet ids, in the order the tree should fork. */
  nestBy: string[];
  dishes: CanonDish[];
  notes: { title: string; body: string }[];
  sources: { label: string; url: string }[];
  /** Title fragments matching your own recipes. */
  yours?: string[];
}

const egg: Canon = {
  slug: 'egg',
  name: 'Egg',
  standfirst:
    'Twelve dishes out of one egg. Almost nothing is added — what separates them is the state the egg is in when it meets heat, and where you stop.',
  root: 'Egg',
  facets: [
    { id: 'state', label: 'State' },
    { id: 'added', label: 'Added' },
    { id: 'method', label: 'Method' },
    { id: 'done', label: 'Doneness' },
  ],
  nestBy: ['state', 'method', 'done'],
  dishes: [
    { name: 'Soft-boiled', facets: { state: ['in its shell'], added: [], method: ['simmered'], done: ['6 minutes'] } },
    { name: 'Hard-boiled', facets: { state: ['in its shell'], added: [], method: ['simmered'], done: ['10 minutes'] } },
    {
      name: 'Poached',
      facets: { state: ['cracked out whole'], added: [], method: ['slid into still water'], done: ['white just set'] },
    },
    {
      name: 'Sunny side up',
      facets: { state: ['cracked out whole'], added: [], method: ['fried in fat', 'basted'], done: ['yolk liquid'] },
    },
    {
      name: 'Over easy',
      facets: { state: ['cracked out whole'], added: [], method: ['fried in fat', 'flipped'], done: ['yolk liquid'] },
    },
    {
      name: 'Over hard',
      facets: { state: ['cracked out whole'], added: [], method: ['fried in fat', 'flipped'], done: ['yolk set'] },
    },
    {
      name: 'Scrambled, French',
      facets: { state: ['beaten'], added: ['butter'], method: ['stirred in the pan', 'constantly', 'low heat'], done: ['barely set'] },
      note: 'Small curd, almost a sauce. The heat is the whole technique.',
    },
    {
      name: 'Scrambled, American',
      facets: { state: ['beaten'], added: ['milk'], method: ['stirred in the pan', 'in folds', 'higher heat'], done: ['firm curds'] },
    },
    {
      name: 'French omelette',
      facets: { state: ['beaten'], added: [], method: ['poured flat', 'folded'], done: ['no colour'] },
    },
    {
      name: 'Tamagoyaki',
      facets: { state: ['beaten'], added: ['dashi', 'sugar'], method: ['poured flat', 'rolled in layers'], done: ['just set'] },
    },
    {
      name: 'Omurice',
      facets: { state: ['beaten'], added: [], method: ['poured flat', 'draped over rice'], done: ['just set'] },
    },
    {
      name: 'Frittata',
      facets: { state: ['beaten'], added: ['cream'], method: ['poured flat', 'finished in the oven'], done: ['cooked through'] },
    },
  ],
  notes: [
    {
      title: 'On the first fork',
      body:
        'Beaten or not is the decision everything else hangs off. An unbeaten egg keeps its two textures and the dishes differ by where it cooks; a beaten egg is one material, and the dishes differ by whether you keep it moving or let it set flat.',
    },
  ],
  sources: [
    { label: 'Egg as food (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Egg_as_food' },
    { label: 'Omurice', url: 'https://en.wikipedia.org/wiki/Omurice' },
    { label: 'Tamagoyaki', url: 'https://en.wikipedia.org/wiki/Tamagoyaki' },
  ],
  yours: ['egg', 'omelet', 'omelette', 'frittata', 'scrambl'],
};

const tomatoSauce: Canon = {
  slug: 'tomato-sauce',
  name: 'Tomato sauce',
  standfirst:
    'One base — tomato, garlic, onion and basil softened in olive oil — and a short list of additions, each of which lands you somewhere with its own name.',
  root: 'Tomato · garlic · onion · basil, softened in olive oil',
  facets: [
    { id: 'add', label: 'Added' },
    { id: 'fat', label: 'Fat' },
    { id: 'method', label: 'Method' },
  ],
  nestBy: ['add', 'method'],
  dishes: [
    { name: 'Rosa', facets: { add: ['cream'], fat: ['olive oil'], method: ['reduced'] } },
    {
      name: 'Vodka',
      parent: 'Rosa',
      facets: { add: ['cream', 'vodka'], fat: ['pancetta'], method: ['reduced'] },
      note: 'Rosa with vodka and pancetta — it descends from rosa, not from the base.',
    },
    { name: 'Amatriciana', facets: { add: ['pecorino'], fat: ['guanciale'], method: ['rendered first'] } },
    { name: 'Arrabbiata', facets: { add: ['dried chilli'], fat: ['olive oil'], method: ['reduced'] } },
    { name: 'Puttanesca', facets: { add: ['olives', 'capers', 'anchovy'], fat: ['olive oil'], method: ['reduced'] } },
    { name: 'alla Norma', facets: { add: ['ricotta salata'], fat: ['olive oil'], method: ['fried eggplant folded in'] } },
  ],
  notes: [
    {
      title: 'On depth',
      body:
        'Only vodka sits a level down, because it is genuinely rosa plus two things. The other five are each one move from the base and belong at the same depth — arranging them otherwise makes the picture tidier and the claim false.',
    },
  ],
  sources: [
    { label: 'Tomato sauce (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Tomato_sauce' },
    { label: 'Amatriciana', url: 'https://en.wikipedia.org/wiki/Sugo_all%27amatriciana' },
    { label: 'Pasta alla Norma', url: 'https://en.wikipedia.org/wiki/Pasta_alla_Norma' },
  ],
  yours: ['tomato sauce', 'marinara', 'arrabbiata', 'vodka sauce', 'puttanesca', 'sugo'],
};

const custard: Canon = {
  slug: 'custard',
  name: 'Custard',
  standfirst:
    'Cream, egg yolk and sugar go into all of these. What separates them is how it is cooked, what sets it, and what happens to the surface.',
  root: 'Cream · egg yolk · sugar',
  facets: [
    { id: 'cook', label: 'Cooked' },
    { id: 'set', label: 'Set by' },
    { id: 'finish', label: 'Finish' },
  ],
  nestBy: ['cook', 'set', 'finish'],
  dishes: [
    {
      name: 'Pastry cream',
      facets: { cook: ['on the stove', 'stirred'], set: ['starch'], finish: [] },
      note: 'Stirred, so it thickens rather than sets. Everything below is left alone instead.',
    },
    { name: 'Panna cotta', facets: { cook: ['warmed only'], set: ['gelatin'], finish: [] } },
    { name: 'Pot de crème', facets: { cook: ['baked in a water bath'], set: ['egg alone'], finish: [] } },
    {
      name: 'Crème caramel',
      facets: { cook: ['baked in a water bath'], set: ['egg alone'], finish: ['caramel in the mould'] },
    },
    {
      name: 'Crème brûlée',
      facets: { cook: ['baked in a water bath'], set: ['egg alone'], finish: ['sugar burnt on top'] },
      note: 'The crust goes on after the custard is cold, and cracks under a spoon. Without it this is a pot de crème.',
    },
  ],
  notes: [
    {
      title: 'On the surface',
      body:
        'Pot de crème, crème caramel and crème brûlée are the same baked custard. All three differ only in the last column — nothing, caramel underneath, or burnt sugar on top — which is as small as a defining difference gets.',
    },
  ],
  sources: [
    { label: 'Custard (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Custard' },
    { label: 'Crème brûlée', url: 'https://en.wikipedia.org/wiki/Cr%C3%A8me_br%C3%BBl%C3%A9e' },
    { label: 'Panna cotta', url: 'https://en.wikipedia.org/wiki/Panna_cotta' },
  ],
  yours: ['custard', 'brulee', 'brûlée', 'panna cotta', 'flan', 'pastry cream'],
};

export const CANON: Canon[] = [egg, tomatoSauce, custard];

export function getCanon(slug: string): Canon | undefined {
  return CANON.find((c) => c.slug === slug);
}
