import { toFraction } from './utils';

export type UnitSystem = 'original' | 'metric' | 'imperial';

// Grams per unit of weight.
const TO_GRAMS: Record<string, number> = {
  g: 1, gram: 1, grams: 1,
  kg: 1000, kilogram: 1000, kilograms: 1000,
  oz: 28.3495, ounce: 28.3495, ounces: 28.3495,
  lb: 453.592, lbs: 453.592, pound: 453.592, pounds: 453.592,
};

// Milliliters per unit of volume.
const TO_ML: Record<string, number> = {
  ml: 1, milliliter: 1, milliliters: 1,
  l: 1000, liter: 1000, liters: 1000, litre: 1000, litres: 1000,
  tsp: 4.92892, teaspoon: 4.92892, teaspoons: 4.92892,
  tbsp: 14.7868, tablespoon: 14.7868, tablespoons: 14.7868,
  cup: 236.588, cups: 236.588,
  'fl oz': 29.5735, 'fluid ounce': 29.5735,
  pint: 473.176, pints: 473.176, pt: 473.176,
  quart: 946.353, quarts: 946.353, qt: 946.353,
  gallon: 3785.41, gallons: 3785.41, gal: 3785.41,
};

const METRIC_UNITS = new Set(['g', 'kg', 'ml', 'l']);

function norm(unit: string): string {
  return (unit || '').toLowerCase().trim();
}

export function isWeightUnit(unit: string): boolean {
  return norm(unit) in TO_GRAMS;
}

export function isVolumeUnit(unit: string): boolean {
  return norm(unit) in TO_ML;
}

/**
 * Convert a quantity+unit to grams, for nutrition estimation. Volumes are
 * treated as water-equivalent (1 ml ≈ 1 g) — a rough but standard approximation.
 * Returns null for count/piece units we can't weigh.
 */
export function convertUnitToGrams(quantity: number, unit: string): number | null {
  const u = norm(unit);
  if (u in TO_GRAMS) return quantity * TO_GRAMS[u];
  if (u in TO_ML) return quantity * TO_ML[u]; // 1 ml ≈ 1 g (water-equivalent)
  return null;
}

/**
 * Convert a measurement into the requested unit system for display. Weight and
 * volume units are converted and re-expressed in a sensibly-sized unit; count
 * units (piece, clove, …) and system 'original' are returned unchanged.
 */
export function convertMeasure(
  quantity: number,
  unit: string,
  system: UnitSystem
): { quantity: number; unit: string } {
  const u = norm(unit);

  if (system === 'original' || quantity <= 0) return { quantity, unit };

  // Weight
  if (u in TO_GRAMS) {
    const grams = quantity * TO_GRAMS[u];
    if (system === 'metric') {
      return grams >= 1000 ? { quantity: grams / 1000, unit: 'kg' } : { quantity: grams, unit: 'g' };
    }
    const oz = grams / 28.3495;
    return oz >= 16 ? { quantity: oz / 16, unit: 'lb' } : { quantity: oz, unit: 'oz' };
  }

  // Volume
  if (u in TO_ML) {
    const ml = quantity * TO_ML[u];
    if (system === 'metric') {
      return ml >= 1000 ? { quantity: ml / 1000, unit: 'l' } : { quantity: ml, unit: 'ml' };
    }
    if (ml < 15) return { quantity: ml / 4.92892, unit: 'tsp' };
    if (ml < 60) return { quantity: ml / 14.7868, unit: 'tbsp' };
    return { quantity: ml / 236.588, unit: 'cup' };
  }

  return { quantity, unit };
}

/**
 * Format a quantity + unit for display. Metric mass/volume units read best as
 * rounded whole-ish numbers (250 g, 1.5 l); everything else uses cook-friendly
 * fractions (¾ cup, 1½ tsp).
 */
export function formatQuantity(quantity: number, unit: string): string {
  if (quantity <= 0) return '';
  const u = norm(unit);

  let qtyStr: string;
  if (METRIC_UNITS.has(u)) {
    if (u === 'kg' || u === 'l') {
      qtyStr = String(Math.round(quantity * 100) / 100);
    } else {
      // g / ml: round to a tidy value (nearest 5 above 100, else nearest 1).
      qtyStr = String(quantity >= 100 ? Math.round(quantity / 5) * 5 : Math.round(quantity));
    }
  } else {
    qtyStr = quantity % 1 !== 0 ? toFraction(quantity) : String(quantity);
  }

  const unitStr = unit && unit !== 'piece' ? ` ${unit}` : '';
  return `${qtyStr}${unitStr}`;
}
