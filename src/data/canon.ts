/**
 * What a dish actually is, once you strip the variations away.
 *
 * Most recipes answer "how do I make this". These answer the prior question:
 * what has to be true for it to still be the thing at all. A gazpacho survives
 * losing its tomatoes; it does not survive being served hot. Knowing which is
 * which is the difference between varying a dish and quietly inventing another
 * one.
 *
 * Each entry is a short chain of conditions that must all hold. Feeding each
 * condition is a slot you can swap freely, and hanging off it is the single
 * change that puts the dish in a different family — named, so the exit is as
 * legible as the rule.
 */

export interface Gate {
  /** Short tag for the condition — RAW, SEASONING, BODY. */
  label: string;
  /** The condition itself, in a line. */
  statement: string;
  /** The variable part feeding this condition. Swap anything here freely. */
  slot?: {
    name: string;
    options: string[];
  };
  /** The one change that takes the dish out of the family. */
  breaks: {
    /** What it becomes instead. */
    becomes: string;
    /** Why that is a different dish and not a variation. */
    why: string;
  };
}

export interface FamilyMember {
  name: string;
  /** What carries the flavour — the axis people think defines the dish. */
  carries: string;
  /** Where the body or structure comes from. */
  body: string;
  verdict: 'in' | 'out';
  /** The interesting part: why it passes, or which gate it fails. */
  note?: string;
}

export interface CanonNote {
  title: string;
  body: string;
}

export interface Canon {
  slug: string;
  name: string;
  /** One line on the shelf, and under the title. */
  standfirst: string;
  /** What you have if every gate holds. */
  terminal: string;
  /** The punchline under it — usually the assumption being dismantled. */
  terminalNote: string;
  gates: Gate[];
  family: FamilyMember[];
  notes: CanonNote[];
  sources: { label: string; url: string }[];
  /** Title fragments that match your own recipes, so the page can show which
   *  of yours sit inside the family. Matched case-insensitively. */
  yours?: string[];
}

const gazpacho: Canon = {
  slug: 'gazpacho',
  name: 'Gazpacho',
  standfirst:
    'Gazpacho survives losing its tomatoes, swapping them for almonds and green grapes, and being thickened with nothing but a vegetable’s own starch. It does not survive being served hot.',
  terminal: 'Still gazpacho',
  terminalNote: 'Tomato nowhere required',
  gates: [
    {
      label: 'Raw',
      statement: 'An uncooked fruit or vegetable',
      slot: { name: 'The base', options: ['tomato', 'melon', 'corn', 'beet', 'almond & grape'] },
      breaks: {
        becomes: 'Cooked and served hot → a stew',
        why: 'gazpacho manchego is gazpacho in name only',
      },
    },
    {
      label: 'Seasoning',
      statement: 'Garlic, olive oil, acid, salt',
      slot: { name: 'The acid', options: ['sherry vinegar', 'wine vinegar', 'citrus', 'verjus'] },
      breaks: {
        becomes: 'No fat, no acid → vegetable juice',
        why: 'the oil and the vinegar are structural, not seasoning',
      },
    },
    {
      label: 'Body',
      statement: 'Bulked to a pourable body',
      slot: { name: 'The thickener', options: ['stale bread', 'almonds', 'its own starch'] },
      breaks: {
        becomes: 'Bodied with dairy → a chilled cream soup',
        why: 'vichyssoise territory, a different family entirely',
      },
    },
    {
      label: 'Service',
      statement: 'Blended, and served cold',
      slot: { name: 'Texture & garnish', options: ['silky or rustic', 'jamón', 'egg', 'diced raw veg'] },
      breaks: {
        becomes: 'Left chunky → a salsa or a salad',
        why: 'it has to pour',
      },
    },
  ],
  family: [
    { name: 'Gazpacho andaluz', carries: 'Tomato, pepper, cucumber', body: 'Stale bread', verdict: 'in' },
    {
      name: 'Ajoblanco',
      carries: 'Almonds and green grapes',
      body: 'Almonds and bread',
      verdict: 'in',
      note: 'and older than the tomato version',
    },
    {
      name: 'Salmorejo',
      carries: 'Tomato, heavily',
      body: 'Much more bread',
      verdict: 'in',
      note: 'thick enough to coat a spoon',
    },
    { name: 'Porra antequerana', carries: 'Tomato and garlic', body: 'Bread, thicker still', verdict: 'in' },
    {
      name: 'Gazpacho manchego',
      carries: 'Game meat and flatbread',
      body: 'Cooked down, served hot',
      verdict: 'out',
      note: 'fails the first gate',
    },
  ],
  notes: [
    {
      title: 'On the tomato',
      body:
        'Red gazpacho is a nineteenth-century development. The dish it descends from — traceable to medieval Andalusia, and plausibly to a Roman ancestor — was stale bread, garlic, olive oil, vinegar, salt and water, pounded in a mortar. Tomatoes joined the newest and most famous version; they were never the definition.',
    },
    {
      title: 'On charring',
      body:
        'Cooking the base is the one gate a modern corn gazpacho leans on. Charring kernels and roasting tomatoes is a concentration step, not a simmer, and the soup is still assembled cold in the blender — but it is the gate to watch. Cook the base into a pot of soup and chill it afterwards and you have a chilled purée, not a gazpacho.',
    },
  ],
  sources: [
    { label: 'Gazpacho (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Gazpacho' },
    { label: 'Ajoblanco', url: 'https://en.wikipedia.org/wiki/Ajoblanco' },
    { label: 'Salmorejo', url: 'https://en.wikipedia.org/wiki/Salmorejo' },
    { label: 'Britannica', url: 'https://www.britannica.com/topic/gazpacho' },
    { label: 'Foods & Wines from Spain', url: 'https://www.foodswinesfromspain.com/en/food/articles/2018/august/the-gazpacho-and-salmorejo-tour' },
  ],
  yours: ['gazpacho', 'salmorejo', 'ajoblanco'],
};

const salsa: Canon = {
  slug: 'salsa',
  name: 'Salsa',
  standfirst:
    'A salsa can be raw or charred, red or green, smooth or chunky, and need contain no tomato and no chilli heat. What it cannot do is stop being a condiment and become the dish.',
  terminal: 'Still salsa',
  terminalNote: 'It accompanies; it is not the plate',
  gates: [
    {
      label: 'Component',
      statement: 'Built from distinct pieces, not a purée of one thing',
      slot: { name: 'The body', options: ['tomato', 'tomatillo', 'stone fruit', 'roasted chilli', 'corn'] },
      breaks: {
        becomes: 'One ingredient, blended smooth → a purée or a hot sauce',
        why: 'a bottled hot sauce is an extraction; a salsa is an assembly',
      },
    },
    {
      label: 'Acid',
      statement: 'Sharp enough to cut what it is served with',
      slot: { name: 'The acid', options: ['lime', 'tomatillo itself', 'vinegar', 'bitter orange'] },
      breaks: {
        becomes: 'No acid → a relish or a chutney',
        why: 'sweet-and-spiced without sharpness belongs to another tradition',
      },
    },
    {
      label: 'Aromatics',
      statement: 'Allium and chilli, raw or charred',
      slot: { name: 'The aromatics', options: ['white onion', 'garlic', 'serrano', 'chipotle', 'cilantro'] },
      breaks: {
        becomes: 'Neither onion nor chilli → a dressed fruit salad',
        why: 'pico de gallo without them is just diced tomato',
      },
    },
    {
      label: 'Role',
      statement: 'Served alongside, uncooked after assembly',
      slot: { name: 'The texture', options: ['minced', 'chunky', 'molcajete-rough', 'loose'] },
      breaks: {
        becomes: 'Simmered as the cooking medium → a braise or an enchilada sauce',
        why: 'salsa roja cooked down to nap a dish has become the sauce, not the condiment',
      },
    },
  ],
  family: [
    { name: 'Pico de gallo', carries: 'Raw tomato, onion, serrano', body: 'Nothing — just drained', verdict: 'in' },
    { name: 'Salsa verde', carries: 'Tomatillo, raw or boiled', body: 'The tomatillo pectin', verdict: 'in' },
    {
      name: 'Salsa macha',
      carries: 'Dried chilli, nuts, seeds',
      body: 'Oil',
      verdict: 'in',
      note: 'oil-based and still an assembly of pieces',
    },
    {
      name: 'Guacamole',
      carries: 'Avocado',
      body: 'The avocado itself',
      verdict: 'out',
      note: 'one ingredient carries both flavour and body — a different form',
    },
    {
      name: 'Enchilada sauce',
      carries: 'Dried chilli, cooked',
      body: 'Thickened and simmered',
      verdict: 'out',
      note: 'fails the last gate — it is the cooking medium',
    },
  ],
  notes: [
    {
      title: 'On heat',
      body:
        'Chilli heat is the most commonly assumed requirement and is not one. Plenty of regional salsas run mild to the point of sweetness; what does not vary is the acid. A salsa that is not sharp has stopped doing its job on the plate.',
    },
  ],
  sources: [
    { label: 'Salsa (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Salsa_(sauce)' },
    { label: 'Pico de gallo', url: 'https://en.wikipedia.org/wiki/Pico_de_gallo' },
    { label: 'Salsa macha', url: 'https://en.wikipedia.org/wiki/Salsa_macha' },
  ],
  yours: ['salsa', 'pico de gallo', 'chimichurri'],
};

const carbonara: Canon = {
  slug: 'carbonara',
  name: 'Carbonara',
  standfirst:
    'Carbonara tolerates a different cut of pork, a different cheese, a different pasta shape, and a good deal of argument about pepper. The one thing it cannot survive is cream — because cream is doing the job the eggs are supposed to do.',
  terminal: 'Still carbonara',
  terminalNote: 'The sauce is an emulsion, not a cream',
  gates: [
    {
      label: 'Emulsion',
      statement: 'Egg and cheese, brought together with starchy water off the heat',
      slot: { name: 'The egg', options: ['whole eggs', 'yolks only', 'a mix'] },
      breaks: {
        becomes: 'Cream instead → pasta alla panna',
        why: 'the technique is the dish; cream removes the reason for it',
      },
    },
    {
      label: 'Cured pork',
      statement: 'Rendered cured pork, and its fat kept',
      slot: { name: 'The pork', options: ['guanciale', 'pancetta', 'bacon at a pinch'] },
      breaks: {
        becomes: 'No pork fat → cacio e pepe with egg',
        why: 'the rendered fat is a third of the sauce',
      },
    },
    {
      label: 'Cheese',
      statement: 'A hard, salty sheep or cow cheese, grated fine',
      slot: { name: 'The cheese', options: ['pecorino romano', 'parmigiano', 'a blend'] },
      breaks: {
        becomes: 'A melting cheese → a baked pasta',
        why: 'it has to dissolve into the emulsion, not stretch',
      },
    },
    {
      label: 'Heat',
      statement: 'Finished off direct heat so the egg thickens but never sets',
      slot: { name: 'The pasta', options: ['spaghetti', 'rigatoni', 'bucatini'] },
      breaks: {
        becomes: 'Egg scrambles → pasta with scrambled egg',
        why: 'not a variation, just the failure mode',
      },
    },
  ],
  family: [
    { name: 'Carbonara', carries: 'Guanciale, pecorino, black pepper', body: 'Egg emulsion', verdict: 'in' },
    {
      name: 'Cacio e pepe',
      carries: 'Pecorino and pepper',
      body: 'Cheese and starch emulsion',
      verdict: 'out',
      note: 'no egg, no pork — the neighbouring dish, not a variation',
    },
    {
      name: 'Gricia',
      carries: 'Guanciale and pecorino',
      body: 'Fat and starch',
      verdict: 'out',
      note: 'carbonara without the egg — literally the parent dish',
    },
    {
      name: 'Pasta alla panna',
      carries: 'Cream and ham',
      body: 'Cream',
      verdict: 'out',
      note: 'fails the first gate, which is the one everyone argues about',
    },
  ],
  notes: [
    {
      title: 'On the argument',
      body:
        'Carbonara is young — the first printed recipes are post-war, and early ones are inconsistent about nearly everything including cream. The rule against cream is a modern codification rather than an ancient one. It is still the right rule, because it is the one that preserves the technique that makes the dish worth making.',
    },
  ],
  sources: [
    { label: 'Carbonara (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Carbonara' },
    { label: 'Cacio e pepe', url: 'https://en.wikipedia.org/wiki/Cacio_e_pepe' },
  ],
  yours: ['carbonara', 'cacio e pepe', 'gricia'],
};

export const CANON: Canon[] = [gazpacho, salsa, carbonara];

export function getCanon(slug: string): Canon | undefined {
  return CANON.find((c) => c.slug === slug);
}
