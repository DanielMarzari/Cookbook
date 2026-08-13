import { CHEESES } from "./catalog/cheese";
import { FINISHING } from "./catalog/finishing";
import { MEATS } from "./catalog/meat";
import { PANTRY } from "./catalog/pantry";
import { PRODUCE } from "./catalog/produce";
import type { Cat, Item, Role } from "./types";

/** The catalogue lives in `catalog/*.ts`, split by category so each file stays
 *  short enough to actually read — and so cutting a whole section is a
 *  one-file job. This module assembles it and owns the lookups. */
export const ITEMS: Item[] = [
  ...CHEESES,
  ...MEATS,
  ...PRODUCE,
  ...PANTRY,
  ...FINISHING,
];

/** Rough per-guest amounts by category, used by the shopping list. Individual
 *  items can override with their own `perGuest`. These assume the board is the
 *  meal's centrepiece; halve them if dinner follows. */
export const DEFAULT_PER_GUEST: Record<Cat, { amount: number; unit: string }> = {
  cheese: { amount: 1.5, unit: "oz" },
  meat: { amount: 1.5, unit: "oz" },
  fruit: { amount: 2, unit: "oz" },
  dried: { amount: 0.75, unit: "oz" },
  cracker: { amount: 5, unit: "crackers" },
  spread: { amount: 0.5, unit: "oz" },
  nut: { amount: 0.75, unit: "oz" },
  briny: { amount: 0.75, unit: "oz" },
  sweet: { amount: 2, unit: "pieces" },
  garnish: { amount: 1, unit: "sprig" },
  veg: { amount: 1.5, unit: "oz" },
};

export const CAT_LABEL: Record<Cat, string> = {
  cheese: "Cheese",
  meat: "Cured meat",
  fruit: "Fresh fruit",
  dried: "Dried fruit",
  cracker: "Crackers & bread",
  spread: "Spreads & honey",
  nut: "Nuts",
  briny: "Briny & pickled",
  sweet: "Something sweet",
  garnish: "Herbs & garnish",
  veg: "Crudité",
};

export const ITEMS_BY_ID: Map<string, Item> = new Map(
  ITEMS.map((i) => [i.id, i]),
);

export function getItem(id: string): Item | undefined {
  return ITEMS_BY_ID.get(id);
}

/** Items a zone with this role will accept. `flex` takes everything. */
export function itemsForRole(role: Role): Item[] {
  if (role === "flex") return ITEMS;
  return ITEMS.filter((i) => i.cat === role);
}

export function itemsByCat(cat: Cat): Item[] {
  return ITEMS.filter((i) => i.cat === cat);
}

export function perGuestFor(item: Item): { amount: number; unit: string } {
  return item.perGuest ?? DEFAULT_PER_GUEST[item.cat];
}

/** Peak-season check against a 1-12 month. Year-round items are never "in
 *  season" — the badge should mean something. */
export function isInSeason(item: Item, month: number): boolean {
  return !!item.season?.includes(month);
}

export function seasonalPicks(month: number): Item[] {
  return ITEMS.filter((i) => isInSeason(i, month));
}
