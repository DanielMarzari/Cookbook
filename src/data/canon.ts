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
  /**
   * The ways this family can be read as a tree.
   *
   * More than one order is often defensible — filled doughs group by how they
   * are cooked, and equally by where they come from, and neither reading is the
   * true one. The first is the default; the rest are offered as a switch.
   */
  nestings: { label: string; by: string[] }[];
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
    { id: 'region', label: 'Region' },
  ],
  nestings: [
    { label: 'By technique', by: ['state', 'method', 'done'] },
    { label: 'By region', by: ['region', 'state'] },
  ],
  dishes: [
    { name: 'Soft-boiled', facets: { region: [], state: ['in its shell'], added: [], method: ['simmered'], done: ['6 minutes'] } },
    { name: 'Hard-boiled', facets: { region: [], state: ['in its shell'], added: [], method: ['simmered'], done: ['10 minutes'] } },
    {
      name: 'Poached',
      facets: { region: [], state: ['cracked out whole'], added: [], method: ['slid into still water'], done: ['white just set'] },
    },
    {
      name: 'Sunny side up',
      facets: { region: ['United States'], state: ['cracked out whole'], added: [], method: ['fried in fat', 'basted'], done: ['yolk liquid'] },
    },
    {
      name: 'Over easy',
      facets: { region: ['United States'], state: ['cracked out whole'], added: [], method: ['fried in fat', 'flipped'], done: ['yolk liquid'] },
    },
    {
      name: 'Over hard',
      facets: { region: ['United States'], state: ['cracked out whole'], added: [], method: ['fried in fat', 'flipped'], done: ['yolk set'] },
    },
    {
      name: 'Scrambled, French',
      facets: { region: ['France'], state: ['beaten'], added: ['butter'], method: ['stirred in the pan', 'constantly', 'low heat'], done: ['barely set'] },
      note: 'Small curd, almost a sauce. The heat is the whole technique.',
    },
    {
      name: 'Scrambled, American',
      facets: { region: ['United States'], state: ['beaten'], added: ['milk'], method: ['stirred in the pan', 'in folds', 'higher heat'], done: ['firm curds'] },
    },
    {
      name: 'French omelette',
      facets: { region: ['France'], state: ['beaten'], added: [], method: ['poured flat', 'folded'], done: ['no colour'] },
    },
    {
      name: 'Tamagoyaki',
      facets: { region: ['Japan'], state: ['beaten'], added: ['dashi', 'sugar'], method: ['poured flat', 'rolled in layers'], done: ['just set'] },
    },
    {
      name: 'Omurice',
      facets: { region: ['Japan'], state: ['beaten'], added: [], method: ['poured flat', 'draped over rice'], done: ['just set'] },
    },
    {
      name: 'Frittata',
      facets: { region: ['Italy'], state: ['beaten'], added: ['cream'], method: ['poured flat', 'finished in the oven'], done: ['cooked through'] },
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
    { id: 'region', label: 'Region' },
  ],
  nestings: [{ label: 'By addition', by: ['add', 'method'] }],
  dishes: [
    { name: 'Rosa', facets: { region: ['Italy'], add: ['cream'], fat: ['olive oil'], method: ['reduced'] } },
    {
      name: 'Vodka',
      parent: 'Rosa',
      facets: { region: ['Italy / United States'], add: ['cream', 'vodka'], fat: ['pancetta'], method: ['reduced'] },
      note: 'Rosa with vodka and pancetta — it descends from rosa, not from the base.',
    },
    { name: 'Amatriciana', facets: { region: ['Lazio'], add: ['pecorino'], fat: ['guanciale'], method: ['rendered first'] } },
    { name: 'Arrabbiata', facets: { region: ['Lazio'], add: ['dried chilli'], fat: ['olive oil'], method: ['reduced'] } },
    { name: 'Puttanesca', facets: { region: ['Campania'], add: ['olives', 'capers', 'anchovy'], fat: ['olive oil'], method: ['reduced'] } },
    { name: 'alla Norma', facets: { region: ['Sicily'], add: ['ricotta salata'], fat: ['olive oil'], method: ['fried eggplant folded in'] } },
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
    { id: 'region', label: 'Region' },
  ],
  nestings: [
    { label: 'By technique', by: ['cook', 'set', 'finish'] },
    { label: 'By region', by: ['region', 'cook'] },
  ],
  dishes: [
    {
      name: 'Pastry cream',
      facets: { region: ['France'], cook: ['on the stove', 'stirred'], set: ['starch'], finish: [] },
      note: 'Stirred, so it thickens rather than sets. Everything below is left alone instead.',
    },
    { name: 'Panna cotta', facets: { region: ['Piedmont'], cook: ['warmed only'], set: ['gelatin'], finish: [] } },
    { name: 'Pot de crème', facets: { region: ['France'], cook: ['baked in a water bath'], set: ['egg alone'], finish: [] } },
    {
      name: 'Crème caramel',
      facets: { region: ['France'], cook: ['baked in a water bath'], set: ['egg alone'], finish: ['caramel in the mould'] },
    },
    {
      name: 'Crème brûlée',
      facets: { region: ['France'], cook: ['baked in a water bath'], set: ['egg alone'], finish: ['sugar burnt on top'] },
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

const filledDough: Canon = {
  slug: 'dough-with-filling',
  name: 'Dough with filling',
  standfirst:
    'Wrap something in a sheet of dough, close it, and apply heat. Nearly every cuisine arrived at this independently — which is why the category is dough-with-filling rather than "dumpling", a word that quietly makes one tradition the default.',
  root: 'A sheet of dough, closed around a filling',
  facets: [
    { id: 'dough', label: 'Dough' },
    { id: 'filling', label: 'Filling' },
    { id: 'close', label: 'Closed' },
    { id: 'cook', label: 'Cooked' },
    { id: 'region', label: 'Region' },
  ],
  nestings: [
    { label: 'By cooking', by: ['cook', 'dough', 'close'] },
    { label: 'By dough', by: ['dough', 'cook'] },
    { label: 'By region', by: ['region', 'cook'] },
  ],
  dishes: [
    {
      name: 'Jiaozi',
      facets: { dough: ['wheat', 'unleavened'], filling: ['pork', 'chive'], close: ['pleated crescent'], cook: ['boiled'], region: ['China'] },
    },
    {
      name: 'Gyoza',
      facets: { dough: ['wheat', 'unleavened', 'thinner wrapper'], filling: ['pork', 'cabbage'], close: ['pleated crescent'], cook: ['pan-fried', 'then steamed'], region: ['Japan'] },
      note: 'Jiaozi with a thinner wrapper and a crisp base — the same parcel, finished differently.',
    },
    {
      name: 'Xiao long bao',
      facets: { dough: ['wheat', 'unleavened'], filling: ['pork', 'set aspic'], close: ['twisted knot'], cook: ['steamed'], region: ['Jiangnan'] },
      note: 'The aspic melts into soup inside the parcel. The filling is the technique.',
    },
    {
      name: 'Momo',
      facets: { dough: ['wheat', 'unleavened'], filling: ['minced meat', 'aromatics'], close: ['pleated purse'], cook: ['steamed'], region: ['Tibet', 'Nepal'] },
    },
    {
      name: 'Manti',
      facets: { dough: ['wheat', 'unleavened'], filling: ['lamb', 'onion'], close: ['pinched parcel'], cook: ['steamed'], region: ['Anatolia', 'Central Asia'] },
    },
    {
      name: 'Khinkali',
      facets: { dough: ['wheat', 'unleavened'], filling: ['meat', 'broth'], close: ['twisted knot'], cook: ['boiled'], region: ['Georgia'] },
    },
    {
      name: 'Pelmeni',
      facets: { dough: ['wheat', 'unleavened'], filling: ['minced meat'], close: ['sealed round'], cook: ['boiled'], region: ['Russia', 'Siberia'] },
    },
    {
      name: 'Pierogi',
      facets: { dough: ['wheat', 'unleavened'], filling: ['potato', 'curd cheese'], close: ['crimped half-moon'], cook: ['boiled', 'then pan-fried'], region: ['Poland'] },
    },
    {
      name: 'Ravioli',
      facets: { dough: ['egg pasta'], filling: ['ricotta', 'greens'], close: ['sealed flat'], cook: ['boiled'], region: ['Italy'] },
    },
    {
      name: 'Empanada',
      facets: { dough: ['wheat', 'enriched with fat'], filling: ['beef', 'olive', 'egg'], close: ['crimped repulgue'], cook: ['baked'], region: ['Argentina', 'Spain'] },
    },
    {
      name: 'Jamaican patty',
      facets: { dough: ['wheat', 'flaky', 'turmeric'], filling: ['spiced beef'], close: ['crimped half-moon'], cook: ['baked'], region: ['Jamaica'] },
      note: 'The same half-moon as a pierogi, on laminated pastry — the dough is what makes it its own thing.',
    },
    {
      name: 'Samosa',
      facets: { dough: ['wheat', 'unleavened'], filling: ['potato', 'pea', 'spice'], close: ['folded cone'], cook: ['deep-fried'], region: ['South Asia'] },
    },
    {
      name: 'Empanada frita',
      facets: { dough: ['wheat', 'enriched with fat'], filling: ['cheese', 'beef'], close: ['crimped repulgue'], cook: ['deep-fried'], region: ['Latin America'] },
    },
    {
      name: 'Fried wonton',
      facets: { dough: ['wheat', 'unleavened', 'thinner wrapper'], filling: ['pork', 'shrimp'], close: ['gathered purse'], cook: ['deep-fried'], region: ['China'] },
    },
  ],
  notes: [
    {
      title: 'On the category',
      body:
        'Calling these all dumplings makes gyoza and pierogi look like variations of one another. They are not — they are separate answers to the same problem, arrived at independently. Dough-with-filling names the problem instead of picking a winner, which is why every one of these sits at the same depth.',
    },
    {
      title: 'On what actually varies',
      body:
        'Filling varies most and matters least; almost any of these parcels tolerates almost any filling. The dough and the closing are what make a shape recognisable, and how it is cooked is what makes it a different eating experience — which is why cooking is the default nesting.',
    },
  ],
  sources: [
    { label: 'Dumpling (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Dumpling' },
    { label: 'Empanada', url: 'https://en.wikipedia.org/wiki/Empanada' },
    { label: 'Jamaican patty', url: 'https://en.wikipedia.org/wiki/Jamaican_patty' },
    { label: 'Xiaolongbao', url: 'https://en.wikipedia.org/wiki/Xiaolongbao' },
  ],
  yours: ['empanada', 'pierogi', 'dumpling', 'gyoza', 'ravioli', 'samosa', 'patty', 'wonton'],
};

export const CANON: Canon[] = [egg, filledDough, tomatoSauce, custard];

export function getCanon(slug: string): Canon | undefined {
  return CANON.find((c) => c.slug === slug);
}
