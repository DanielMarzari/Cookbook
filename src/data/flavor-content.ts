// Editorial content for the Flavor Lab's Learn + Seasonal tabs. Written from
// general knowledge — standard flavour vocabulary, a temperate-climate produce
// calendar — not a copy of any proprietary taxonomy. Family names/colours match
// src/lib/flavor.ts. `name` doubles as the case-insensitive lookup into
// note_ingredients so a seasonal card can open its wheel when a profile exists.

export interface FamilyInfo {
  name: string;
  blurb: string;
  examples: string[];
}

// The ten families the wheel is built from, in wheel order.
export const FAMILIES_LEGEND: FamilyInfo[] = [
  { name: 'Sweet', blurb: 'Sugars and their cooked cousins — the rounding, comforting base note.', examples: ['caramel', 'honey', 'vanilla', 'maple'] },
  { name: 'Acidic', blurb: 'Bright, mouth-watering lift from citrus and fermentation.', examples: ['lemon', 'citrus', 'vinegar', 'tart'] },
  { name: 'Floral', blurb: 'Perfumed, high aromatics that read as flowers.', examples: ['rose', 'jasmine', 'lavender', 'blossom'] },
  { name: 'Herbal', blurb: 'Green, cooling, medicinal top notes from herbs and terpenes.', examples: ['mint', 'basil', 'anise', 'camphor'] },
  { name: 'Vegetal', blurb: 'Fresh-cut green, leafy and stemmy — the raw-garden signal.', examples: ['grassy', 'cucumber', 'pea', 'green'] },
  { name: 'Spice', blurb: 'Warm, pungent and piquant — the seasoning-rack aromas.', examples: ['pepper', 'clove', 'cinnamon', 'ginger'] },
  { name: 'Woody', blurb: 'Resinous, forest and barrel notes with real backbone.', examples: ['pine', 'cedar', 'oak', 'resin'] },
  { name: 'Earthy', blurb: 'Damp soil, mushroom and mineral — the grounding low notes.', examples: ['mushroom', 'musty', 'mineral', 'soil'] },
  { name: 'Maillard', blurb: 'Browning: the roast, toast and nut aromas heat creates.', examples: ['roasted', 'nutty', 'coffee', 'cocoa'] },
  { name: 'Carnal', blurb: 'Savoury depth — fat, umami, dairy and the sulphurous alliums.', examples: ['meaty', 'umami', 'cheesy', 'buttery'] },
];

export interface SeasonalItem { name: string; family: string }

// Temperate Northern-Hemisphere peak-season produce, by month (0 = January).
export const SEASONAL: SeasonalItem[][] = [
  [{ name: 'Orange', family: 'Acidic' }, { name: 'Lemon', family: 'Acidic' }, { name: 'Kale', family: 'Vegetal' }, { name: 'Leek', family: 'Carnal' }, { name: 'Pomegranate', family: 'Acidic' }, { name: 'Cabbage', family: 'Vegetal' }],
  [{ name: 'Orange', family: 'Acidic' }, { name: 'Grapefruit', family: 'Acidic' }, { name: 'Leek', family: 'Carnal' }, { name: 'Kale', family: 'Vegetal' }, { name: 'Beet', family: 'Earthy' }, { name: 'Turnip', family: 'Earthy' }],
  [{ name: 'Asparagus', family: 'Vegetal' }, { name: 'Pea', family: 'Vegetal' }, { name: 'Radish', family: 'Spice' }, { name: 'Spinach', family: 'Vegetal' }, { name: 'Leek', family: 'Carnal' }, { name: 'Artichoke', family: 'Vegetal' }],
  [{ name: 'Asparagus', family: 'Vegetal' }, { name: 'Pea', family: 'Vegetal' }, { name: 'Radish', family: 'Spice' }, { name: 'Rhubarb', family: 'Acidic' }, { name: 'Spinach', family: 'Vegetal' }, { name: 'Strawberry', family: 'Sweet' }],
  [{ name: 'Strawberry', family: 'Sweet' }, { name: 'Asparagus', family: 'Vegetal' }, { name: 'Pea', family: 'Vegetal' }, { name: 'Spinach', family: 'Vegetal' }, { name: 'Rhubarb', family: 'Acidic' }, { name: 'Apricot', family: 'Sweet' }],
  [{ name: 'Strawberry', family: 'Sweet' }, { name: 'Cherry', family: 'Sweet' }, { name: 'Zucchini', family: 'Vegetal' }, { name: 'Apricot', family: 'Sweet' }, { name: 'Pea', family: 'Vegetal' }, { name: 'Basil', family: 'Herbal' }],
  [{ name: 'Tomato', family: 'Vegetal' }, { name: 'Basil', family: 'Herbal' }, { name: 'Corn', family: 'Sweet' }, { name: 'Peach', family: 'Sweet' }, { name: 'Blueberry', family: 'Sweet' }, { name: 'Cucumber', family: 'Vegetal' }],
  [{ name: 'Tomato', family: 'Vegetal' }, { name: 'Corn', family: 'Sweet' }, { name: 'Peach', family: 'Sweet' }, { name: 'Plum', family: 'Sweet' }, { name: 'Eggplant', family: 'Earthy' }, { name: 'Melon', family: 'Sweet' }],
  [{ name: 'Apple', family: 'Sweet' }, { name: 'Grape', family: 'Sweet' }, { name: 'Fig', family: 'Sweet' }, { name: 'Pear', family: 'Sweet' }, { name: 'Pepper', family: 'Spice' }, { name: 'Tomato', family: 'Vegetal' }],
  [{ name: 'Apple', family: 'Sweet' }, { name: 'Pumpkin', family: 'Earthy' }, { name: 'Squash', family: 'Earthy' }, { name: 'Pear', family: 'Sweet' }, { name: 'Grape', family: 'Sweet' }, { name: 'Mushroom', family: 'Earthy' }],
  [{ name: 'Squash', family: 'Earthy' }, { name: 'Pumpkin', family: 'Earthy' }, { name: 'Sweet Potato', family: 'Sweet' }, { name: 'Cranberry', family: 'Acidic' }, { name: 'Chestnut', family: 'Maillard' }, { name: 'Mushroom', family: 'Earthy' }],
  [{ name: 'Orange', family: 'Acidic' }, { name: 'Pomegranate', family: 'Acidic' }, { name: 'Squash', family: 'Earthy' }, { name: 'Leek', family: 'Carnal' }, { name: 'Chestnut', family: 'Maillard' }, { name: 'Pear', family: 'Sweet' }],
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
