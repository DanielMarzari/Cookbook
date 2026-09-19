/**
 * What kind of cooking this is — a second axis, independent of where it comes
 * from.
 *
 * Cuisine answers "whose tradition is this"; craft answers "what am I doing".
 * They are separate questions and a single list conflates them: baking is not a
 * nationality, and filing it beside Italian and Jewish would make one of those
 * the default for bread.
 *
 * Two of these are not dishes at all, which is the point:
 *
 *   Bases        the stem a family branches from — a pizza dough, an ice
 *                cream base. On its own it is not dinner; every branch off it
 *                is.
 *   Sub-recipes  something whose whole purpose is to go inside another recipe:
 *                almond paste, dulce de leche, a spice blend. Distinct from
 *                Condiments, which go on the table beside the food rather than
 *                into it, and from Bases, which is about branching rather than
 *                about being an ingredient.
 *
 * Custom values work the same way cuisines do: any craft written on a recipe
 * joins the row without editing this list.
 */
export const DEFAULT_CRAFTS = [
  'Baking', 'Mains', 'Sides', 'Sweets', 'Condiments', 'Sub-recipes', 'Bases',
];

export const DEFAULT_CUISINES = [
  'American', 'Brazilian', 'Caribbean', 'Chinese', 'Ethiopian',
  'Filipino', 'French', 'German', 'Greek', 'Indian',
  'Italian', 'Japanese', 'Jewish', 'Korean', 'Lebanese',
  'Mediterranean', 'Mexican', 'Moroccan', 'Persian', 'Polish',
  'Southern', 'Spanish', 'Thai', 'Turkish', 'Vietnamese',
];

// Alphabetical, so the picker is scannable. Stored singular — display
// pluralises via pluralizeUnit() in lib/units.ts.
export const UNITS = [
  'bag', 'bottle', 'bunch', 'can', 'clove', 'cup', 'dash', 'dozen', 'drop',
  'g', 'gallon', 'handful', 'head', 'jar', 'kg', 'l', 'large', 'lb', 'medium',
  'ml', 'oz', 'package', 'part', 'piece', 'pinch', 'pint', 'quart', 'slice',
  'small', 'sprig', 'stalk', 'stick', 'tbsp', 'tsp', 'whole',
];

// When you'd eat it. Kept short and broad — this is for filtering the shelf,
// not classifying a menu.
export const MEAL_TYPES = [
  'Breakfast', 'Brunch', 'Lunch', 'Dinner',
  'Hors d\'oeuvre', 'Side', 'Dessert', 'Snack', 'Drink',
];
