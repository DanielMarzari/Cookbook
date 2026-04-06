// Instruction step in a recipe
export interface InstructionStep {
  step_number: number;
  text: string;
  timer_minutes?: number;
  timer_label?: string;
}

// Nutrition information
export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

// Ingredient database
export interface Ingredient {
  id: string;
  name: string;
  brand?: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_per_100g: number;
  custom_nutrition?: Record<string, any>;
  image_url?: string;
  barcode?: string;
  fdc_id?: string;
  aliases?: string[];
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

// Recipe ingredient with quantities
export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  order_index: number;
  custom_calories?: number;
  custom_protein?: number;
  custom_carbs?: number;
  custom_fat?: number;
}

// Tag for recipes
export interface Tag {
  id: string;
  name: string;
  type: 'cuisine' | 'dietary' | 'meal_type' | 'difficulty' | 'season' | 'technique' | 'custom';
  color: string;
}

// Recipe to tag mapping
export interface RecipeTag {
  recipe_id: string;
  tag_id: string;
  auto_generated: boolean;
}

// Main recipe type
export interface Recipe {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  cuisine_type: string;
  origin?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prep_time_minutes: number;
  cook_time_minutes: number;
  total_time_minutes: number;
  servings: number;
  instructions: InstructionStep[];
  source_url?: string;
  source_name?: string;
  source_author?: string;
  source_type?: 'user' | 'imported';
  is_favorite: boolean;
  status?: 'new' | 'testing' | 'approved' | 'signature' | 'archived';
  image_rotation?: number;
  created_at: string;
  updated_at: string;
}

// Cooking technique
export interface Technique {
  id: string;
  name: string;
  slug: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  content: string;
  image_urls: string[];
  video_url?: string;
  tips: string[];
  related_techniques: string[];
  created_at: string;
}

// User technique skill tracking
export interface UserTechniqueSkill {
  id: string;
  technique_id: string;
  skill_level: 'learning' | 'comfortable' | 'confident' | 'mastered';
  notes?: string;
  updated_at: string;
}

// Recipe collection
export interface Collection {
  id: string;
  name: string;
  description?: string;
  subtitle?: string;
  image_url?: string;
  cover_image_url?: string;
  color: string;
  created_at: string;
}

// Grocery list
export interface GroceryList {
  id: string;
  name: string;
  created_at: string;
}

// Grocery list item
export interface GroceryListItem {
  id: string;
  list_id: string;
  ingredient_id?: string;
  recipe_id?: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  category: string;
  created_at: string;
}

// Filter options for recipes
export interface RecipeFilters {
  search: string;
  cuisine: string | null;
  dietary: string[];
  difficulty: string | null;
  maxTime: number | null;
}
