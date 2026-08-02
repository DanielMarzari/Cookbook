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
