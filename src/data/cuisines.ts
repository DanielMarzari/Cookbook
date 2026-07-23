// Signature ingredients per cuisine — the "flavour principles" that make a dish
// read as belonging to a tradition (after Elisabeth Rozin). We score a plate by
// which cuisines' signatures its ingredients hit, weighting each ingredient by
// how exclusive it is (tomato is in many cuisines, gochujang in one). Names match
// note_ingredients so a plate's picks line up. Used by classifyCuisine() in flavor.ts.
export type Cuisine = { name: string; signature: string[] };

export const CUISINES: Cuisine[] = [
  { name: 'Italian',        signature: ['Tomato', 'Basil', 'Olive oil', 'Garlic', 'Parmesan Cheese', 'Oregano', 'Mozzarella', 'Pine nuts', 'Rosemary', 'Balsamic vinegar', 'Prosciutto', 'Ricotta'] },
  { name: 'French',         signature: ['Butter', 'Cream', 'Red Wine', 'Thyme', 'Mushroom', 'Tarragon', 'Shallot', 'Mustard', 'Leek', 'Brandy', 'Parsley'] },
  { name: 'Greek',          signature: ['Olive oil', 'Lemon', 'Oregano', 'Feta', 'Tomato', 'Cucumber', 'Dill', 'Yogurt', 'Garlic', 'Mint'] },
  { name: 'Spanish',        signature: ['Olive oil', 'Garlic', 'Tomato', 'Paprika', 'Saffron', 'Almond', 'Onion', 'Sherry', 'Parsley'] },
  { name: 'Levantine',      signature: ['Lemon', 'Garlic', 'Cumin', 'Parsley', 'Mint', 'Chickpea', 'Sumac', 'Pomegranate', 'Yogurt', 'Olive oil', 'Coriander'] },
  { name: 'Moroccan',       signature: ['Cumin', 'Coriander', 'Cinnamon', 'Ginger', 'Lemon', 'Olive oil', 'Almond', 'Saffron', 'Chili', 'Honey'] },
  { name: 'Mexican',        signature: ['Chili', 'Corn', 'Tomato', 'Lime', 'Coriander', 'Cumin', 'Avocado', 'Onion', 'Garlic', 'Chocolate'] },
  { name: 'Thai',           signature: ['Fish sauce', 'Lime', 'Chili', 'Coconut', 'Lemongrass', 'Coriander', 'Basil', 'Ginger', 'Garlic', 'Peanut'] },
  { name: 'Vietnamese',     signature: ['Fish sauce', 'Lime', 'Coriander', 'Mint', 'Chili', 'Ginger', 'Lemongrass', 'Rice', 'Peanut'] },
  { name: 'Indian',         signature: ['Cumin', 'Coriander', 'Turmeric', 'Ginger', 'Garlic', 'Chili', 'Cardamom', 'Cinnamon', 'Yogurt', 'Coconut'] },
  { name: 'Japanese',       signature: ['Soy sauce', 'Miso', 'Sesame', 'Ginger', 'Rice', 'Mushroom', 'Sesame oil', 'Tofu'] },
  { name: 'Korean',         signature: ['Soy sauce', 'Sesame oil', 'Garlic', 'Ginger', 'Chili', 'Sesame', 'Rice', 'Cabbage'] },
  { name: 'Chinese',        signature: ['Soy sauce', 'Ginger', 'Garlic', 'Sesame oil', 'Star anise', 'Chili', 'Rice', 'Peanut'] },
  { name: 'West African',   signature: ['Tomato', 'Chili', 'Ginger', 'Onion', 'Peanut', 'Thyme', 'Garlic', 'Coconut'] },
  { name: 'American BBQ',   signature: ['Tomato', 'Brown sugar', 'Paprika', 'Bacon', 'Onion', 'Garlic', 'Maple syrup', 'Vinegar', 'Mustard'] },
  { name: 'Nordic',         signature: ['Dill', 'Rye', 'Mushroom', 'Juniper', 'Cream', 'Apple', 'Caraway', 'Vinegar'] },
];
