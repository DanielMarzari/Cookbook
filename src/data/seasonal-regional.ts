// Regional US produce seasonality. Each item is declared once with the months
// it's at peak (0 = Jan) and the regions where it's grown; the monthly list for a
// region is generated from that. Written from general US produce-calendar
// knowledge — a practical guide, not a guarantee (microclimates vary). `family`
// maps to a flavour family for colour + the wheel deep-link.

export interface SeasonalItem { name: string; family: string }

export const REGIONS = [
  { id: 'northeast', name: 'Northeast', states: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA', 'DE', 'MD', 'DC', 'WV', 'VA'] },
  { id: 'southeast', name: 'Southeast', states: ['NC', 'SC', 'GA', 'FL', 'AL', 'MS', 'TN', 'KY', 'AR', 'LA'] },
  { id: 'midwest', name: 'Midwest', states: ['OH', 'MI', 'IN', 'IL', 'WI', 'MN', 'IA', 'MO', 'ND', 'SD', 'NE', 'KS'] },
  { id: 'southcentral', name: 'South Central', states: ['TX', 'OK'] },
  { id: 'mountain', name: 'Mountain & Southwest', states: ['MT', 'WY', 'CO', 'NM', 'AZ', 'UT', 'ID', 'NV'] },
  { id: 'west', name: 'West & Pacific', states: ['CA', 'OR', 'WA', 'HI', 'AK'] },
] as const;

export type RegionId = (typeof REGIONS)[number]['id'];
const ALL: RegionId[] = ['northeast', 'southeast', 'midwest', 'southcentral', 'mountain', 'west'];
const COLD: RegionId[] = ['northeast', 'midwest', 'mountain'];
const WARM: RegionId[] = ['southeast', 'southcentral', 'west'];

export function regionForState(state: string): RegionId {
  const s = (state || '').toUpperCase();
  for (const r of REGIONS) if ((r.states as readonly string[]).includes(s)) return r.id;
  return 'northeast';
}
export const regionName = (id: RegionId) => REGIONS.find((r) => r.id === id)?.name || 'United States';

interface Produce { name: string; family: string; months: number[]; regions: RegionId[] }
const M = { spring: [2, 3, 4], summer: [5, 6, 7], fall: [8, 9, 10], winter: [11, 0, 1], lateSummer: [6, 7, 8, 9], yearRound: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] };

// name, family, months (0-idx), regions
const P = (name: string, family: string, months: number[], regions: RegionId[]): Produce => ({ name, family, months, regions });

const PRODUCE: Produce[] = [
  // ── spring greens & alliums
  P('Asparagus', 'Vegetal', [2, 3, 4, 5], ['northeast', 'midwest', 'mountain', 'west']),
  P('Ramps', 'Carnal', [3, 4], ['northeast', 'midwest', 'southeast']),
  P('Peas', 'Vegetal', [3, 4, 5], ALL),
  P('Fava Beans', 'Vegetal', [3, 4, 5], ['west', 'northeast']),
  P('Spinach', 'Vegetal', [2, 3, 4, 9, 10], ALL),
  P('Arugula', 'Herbal', [2, 3, 4, 9, 10], ALL),
  P('Lettuce', 'Vegetal', [3, 4, 5, 8, 9], ALL),
  P('Swiss Chard', 'Vegetal', [4, 5, 6, 9, 10], ALL),
  P('Radish', 'Spice', [2, 3, 4, 9, 10], ALL),
  P('Green Onion', 'Carnal', [2, 3, 4, 5], ALL),
  P('Leek', 'Carnal', [9, 10, 11, 0, 1], COLD),
  P('Rhubarb', 'Acidic', [3, 4, 5], COLD),
  P('Artichoke', 'Vegetal', [2, 3, 4, 8, 9], ['west']),
  P('Fiddleheads', 'Vegetal', [3, 4], ['northeast']),
  P('Morel Mushroom', 'Earthy', [3, 4, 5], ['midwest', 'northeast', 'mountain']),
  P('Strawberry', 'Sweet', [3, 4, 5], WARM),
  P('Strawberry ', 'Sweet', [4, 5, 6], COLD),

  // ── summer fruit & veg
  P('Tomato', 'Vegetal', [5, 6, 7, 8, 9], ALL),
  P('Cherry Tomato', 'Vegetal', [5, 6, 7, 8, 9], ALL),
  P('Basil', 'Herbal', [5, 6, 7, 8, 9], ALL),
  P('Zucchini', 'Vegetal', [5, 6, 7, 8], ALL),
  P('Summer Squash', 'Vegetal', [5, 6, 7, 8], ALL),
  P('Cucumber', 'Vegetal', [5, 6, 7, 8], ALL),
  P('Corn', 'Sweet', [6, 7, 8], ALL),
  P('Green Beans', 'Vegetal', [5, 6, 7, 8], ALL),
  P('Bell Pepper', 'Spice', [6, 7, 8, 9], ALL),
  P('Chili Pepper', 'Spice', [6, 7, 8, 9], ['southcentral', 'mountain', 'west', 'southeast']),
  P('Eggplant', 'Earthy', [6, 7, 8, 9], ALL),
  P('Okra', 'Vegetal', [6, 7, 8, 9], ['southeast', 'southcentral']),
  P('Tomatillo', 'Acidic', [6, 7, 8, 9], ['southcentral', 'mountain', 'west']),
  P('Peach', 'Sweet', [5, 6, 7, 8], ['southeast', 'southcentral', 'west', 'northeast', 'midwest']),
  P('Nectarine', 'Sweet', [5, 6, 7, 8], ['west', 'southeast']),
  P('Plum', 'Sweet', [6, 7, 8, 9], ['west', 'northeast', 'midwest']),
  P('Apricot', 'Sweet', [4, 5, 6], ['west', 'mountain']),
  P('Cherry', 'Sweet', [4, 5, 6], ['west', 'northeast', 'midwest']),
  P('Blueberry', 'Sweet', [5, 6, 7], ALL),
  P('Blackberry', 'Sweet', [5, 6, 7, 8], ALL),
  P('Raspberry', 'Sweet', [5, 6, 7, 8, 9], COLD.concat(['west'])),
  P('Watermelon', 'Sweet', [6, 7, 8], ALL),
  P('Cantaloupe', 'Sweet', [6, 7, 8], ALL),
  P('Fig', 'Sweet', [7, 8, 9], ['west', 'southeast', 'southcentral']),
  P('Melon', 'Sweet', [6, 7, 8, 9], WARM),
  P('Garlic', 'Carnal', [6, 7, 8], ALL),
  P('New Potato', 'Earthy', [5, 6, 7], ALL),
  P('Carrot', 'Sweet', [5, 6, 7, 8, 9, 10], ALL),
  P('Beet', 'Earthy', [5, 6, 7, 8, 9, 10], ALL),
  P('Cabbage', 'Vegetal', [5, 6, 7, 8, 9, 10], ALL),

  // ── fall harvest
  P('Apple', 'Sweet', [8, 9, 10, 11], ALL),
  P('Pear', 'Sweet', [8, 9, 10], ['west', 'northeast', 'midwest']),
  P('Grape', 'Sweet', [8, 9, 10], ['west', 'northeast']),
  P('Concord Grape', 'Sweet', [8, 9], ['northeast', 'midwest']),
  P('Cranberry', 'Acidic', [9, 10], ['northeast', 'midwest', 'west']),
  P('Pumpkin', 'Earthy', [8, 9, 10, 11], ALL),
  P('Butternut Squash', 'Earthy', [8, 9, 10, 11], ALL),
  P('Acorn Squash', 'Earthy', [8, 9, 10, 11], ALL),
  P('Delicata Squash', 'Earthy', [8, 9, 10], ALL),
  P('Sweet Potato', 'Sweet', [8, 9, 10, 11], ['southeast', 'southcentral', 'northeast']),
  P('Kale', 'Vegetal', [8, 9, 10, 11, 0], ALL),
  P('Collard Greens', 'Vegetal', [8, 9, 10, 11, 0], ['southeast', 'southcentral']),
  P('Brussels Sprouts', 'Vegetal', [9, 10, 11], COLD.concat(['west'])),
  P('Cauliflower', 'Vegetal', [8, 9, 10, 11], ALL),
  P('Broccoli', 'Vegetal', [8, 9, 10, 4, 5], ALL),
  P('Fennel', 'Herbal', [8, 9, 10, 11], ['west', 'northeast']),
  P('Turnip', 'Earthy', [8, 9, 10, 11], ALL),
  P('Parsnip', 'Sweet', [9, 10, 11, 0, 1], COLD),
  P('Celeriac', 'Earthy', [9, 10, 11, 0], COLD),
  P('Chestnut', 'Maillard', [9, 10, 11], ['northeast', 'southeast', 'west']),
  P('Walnut', 'Maillard', [8, 9, 10], ['west']),
  P('Pecan', 'Maillard', [9, 10, 11], ['southeast', 'southcentral']),
  P('Wild Mushroom', 'Earthy', [8, 9, 10], ['west', 'northeast', 'mountain']),
  P('Persimmon', 'Sweet', [9, 10, 11], ['west', 'southeast']),
  P('Pomegranate', 'Acidic', [9, 10, 11], ['west']),
  P('Quince', 'Floral', [9, 10], ['west', 'northeast']),

  // ── winter (citrus, storage, greens in warm regions)
  P('Orange', 'Acidic', [11, 0, 1, 2, 3], ['west', 'southeast', 'southcentral']),
  P('Grapefruit', 'Acidic', [11, 0, 1, 2, 3], ['west', 'southeast', 'southcentral']),
  P('Lemon', 'Acidic', [11, 0, 1, 2, 3, 4], ['west', 'southcentral']),
  P('Lime', 'Acidic', [11, 0, 1, 2, 6, 7], ['west', 'southeast', 'southcentral']),
  P('Mandarin', 'Acidic', [11, 0, 1, 2], ['west', 'southeast']),
  P('Meyer Lemon', 'Acidic', [11, 0, 1, 2], ['west']),
  P('Kumquat', 'Acidic', [0, 1, 2], ['west', 'southeast']),
  P('Avocado', 'Carnal', [0, 1, 2, 3, 4, 5], ['west']),
  P('Winter Squash', 'Earthy', [11, 0, 1], ALL),
  P('Rutabaga', 'Earthy', [10, 11, 0, 1], COLD),
  P('Celery', 'Vegetal', [11, 0, 1, 2], ['west', 'southcentral']),
  P('Broccoli Rabe', 'Vegetal', [11, 0, 1, 2], ['west', 'northeast']),
  P('Mustard Greens', 'Spice', [10, 11, 0, 1], ['southeast', 'southcentral']),
  P('Escarole', 'Vegetal', [10, 11, 0, 1], ['northeast', 'west']),
  P('Pineapple', 'Sweet', [2, 3, 4, 5], ['west']),
  P('Papaya', 'Sweet', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], ['west']),
  P('Mango', 'Sweet', [5, 6, 7, 8], ['west', 'southeast']),
  P('Onion', 'Carnal', M.yearRound, ALL),
  P('Shallot', 'Carnal', [6, 7, 8, 9], ['west', 'northeast']),
  P('Mushroom', 'Earthy', M.yearRound, ALL),
  P('Honey', 'Sweet', [5, 6, 7, 8, 9], ALL),
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function seasonalFor(region: RegionId, month: number): SeasonalItem[] {
  const seen = new Set<string>();
  const out: SeasonalItem[] = [];
  for (const p of PRODUCE) {
    if (!p.months.includes(month) || !p.regions.includes(region)) continue;
    const key = p.name.trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name: key, family: p.family });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}
