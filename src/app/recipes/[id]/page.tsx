'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api-client';
import { toast } from '@/lib/toast';
import { Recipe, RecipeIngredient, Ingredient, NutritionInfo } from '@/lib/types';
import { Clock, Users, Flame, ArrowLeft, Heart, BookOpen, Pencil, Trash2, ShoppingCart, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatTime, titleCaseIngredient } from '@/lib/utils';
import { convertUnitToGrams, convertMeasure, formatQuantity, type UnitSystem } from '@/lib/units';
import CookLogSection from '@/components/CookLogSection';

interface NutritionCalculation {
  nutrition: NutritionInfo;
  matchedCount: number;
  totalCount: number;
}

// Match a recipe ingredient to a library ingredient: prefer the explicit
// ingredient_id link, then fall back to a case-insensitive name/alias match.
function matchIngredient(
  recipeIng: RecipeIngredient,
  allIngredients: Ingredient[]
): Ingredient | undefined {
  if (recipeIng.ingredient_id) {
    const byId = allIngredients.find((ing) => ing.id === recipeIng.ingredient_id);
    if (byId) return byId;
  }
  const name = recipeIng.name.toLowerCase().trim();
  return allIngredients.find(
    (ing) =>
      ing.name.toLowerCase().trim() === name ||
      (ing.aliases || []).some((a) => a.toLowerCase().trim() === name)
  );
}

// Estimate per-serving nutrition by summing matched ingredients' macros.
function computeNutrition(
  recipe: Recipe,
  recipeIngredients: RecipeIngredient[],
  allIngredients: Ingredient[]
): NutritionCalculation | null {
  const real = recipeIngredients.filter((ing) => ing.name && !ing.name.startsWith('---'));
  if (real.length === 0) return null;

  const total: NutritionInfo = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 };
  let matchedCount = 0;

  for (const recipeIng of real) {
    const matched = matchIngredient(recipeIng, allIngredients);
    if (!matched) continue;
    matchedCount++;
    const grams = convertUnitToGrams(recipeIng.quantity, recipeIng.unit);
    if (grams === null) continue;
    const factor = grams / 100;
    total.calories += matched.calories_per_100g * factor;
    total.protein += matched.protein_per_100g * factor;
    total.carbs += matched.carbs_per_100g * factor;
    total.fat += matched.fat_per_100g * factor;
    total.fiber += matched.fiber_per_100g * factor;
    total.sugar += matched.sugar_per_100g * factor;
    total.sodium += matched.sodium_per_100g * factor;
  }

  const servings = recipe.servings || 1;
  const round = (n: number) => Math.round((n / servings) * 10) / 10;
  return {
    nutrition: {
      calories: Math.round(total.calories / servings),
      protein: round(total.protein),
      carbs: round(total.carbs),
      fat: round(total.fat),
      fiber: round(total.fiber),
      sugar: round(total.sugar),
      sodium: round(total.sodium),
    },
    matchedCount,
    totalCount: real.length,
  };
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [nutrition, setNutrition] = useState<NutritionCalculation | null>(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('original');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [addingToGrocery, setAddingToGrocery] = useState(false);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        // Safety check: validate that id exists and is valid
        if (!id || id === 'undefined') {
          setError('Invalid recipe ID');
          setLoading(false);
          return;
        }

        const data = await api.recipes.get(id);

        if (data) {
          setRecipe(data);
          setIsFavorite(data.is_favorite);
          setImageRotation(data.image_rotation || 0);

          // Fetch recipe ingredients and the ingredient library together so we
          // can both render and compute nutrition from linked ingredients.
          const [ingData, allIngs] = await Promise.all([
            api.recipeIngredients.list(id),
            api.ingredients.list(),
          ]);
          setRecipeIngredients(ingData || []);
          setAllIngredients(allIngs || []);
          setNutrition(computeNutrition(data, ingData || [], allIngs || []));
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Load persisted unit system + checked-off state for this recipe.
  useEffect(() => {
    try {
      const savedSystem = localStorage.getItem('cookbook:unitSystem') as UnitSystem | null;
      if (savedSystem) setUnitSystem(savedSystem);
      const raw = localStorage.getItem(`cookbook:checked:${id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCheckedIngredients(new Set<number>(parsed.ingredients || []));
        setCheckedSteps(new Set<number>(parsed.steps || []));
      }
    } catch { /* ignore corrupt storage */ }
  }, [id]);

  const persistChecked = (ingredients: Set<number>, steps: Set<number>) => {
    try {
      localStorage.setItem(
        `cookbook:checked:${id}`,
        JSON.stringify({ ingredients: [...ingredients], steps: [...steps] })
      );
    } catch { /* ignore */ }
  };

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      persistChecked(next, checkedSteps);
      return next;
    });
  };

  const toggleStep = (stepNumber: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(stepNumber) ? next.delete(stepNumber) : next.add(stepNumber);
      persistChecked(checkedIngredients, next);
      return next;
    });
  };

  const changeUnitSystem = (system: UnitSystem) => {
    setUnitSystem(system);
    try { localStorage.setItem('cookbook:unitSystem', system); } catch { /* ignore */ }
  };

  const handleAddToGrocery = async () => {
    if (!recipe) return;
    setAddingToGrocery(true);
    try {
      // Use the most recent grocery list, or create one if none exist.
      const lists = await api.groceryLists.list();
      let list = lists && lists.length > 0 ? lists[0] : null;
      if (!list) {
        list = await api.groceryLists.create({ name: 'Shopping List' });
      }

      // Skip section headers and OR dividers; carry category from a matched
      // library ingredient so the grocery list stays aisle-grouped.
      const realIngredients = recipeIngredients.filter(
        (ing) => ing.name && !ing.name.startsWith('---')
      );

      await Promise.all(
        realIngredients.map((ing) => {
          const match = matchIngredient(ing, allIngredients);
          return api.groceryListItems.create({
            list_id: list!.id,
            recipe_id: recipe.id,
            ingredient_id: match?.id || undefined,
            name: titleCaseIngredient(ing.name),
            quantity: ing.quantity || 1,
            unit: ing.unit || '',
            category: match?.category || 'Other',
            checked: false,
          });
        })
      );

      toast.success(`Added ${realIngredients.length} items to ${list.name}`);
    } catch (err) {
      console.error('Error adding to grocery list:', err);
      toast.error('Failed to add to grocery list');
    } finally {
      setAddingToGrocery(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    try {
      const newFavorite = !isFavorite;
      await api.recipes.update(recipe.id, { is_favorite: newFavorite });
      setIsFavorite(newFavorite);
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!recipe) return;
    if (!confirm(`Are you sure you want to delete "${recipe.title}"? This cannot be undone.`)) return;
    try {
      await api.recipes.delete(recipe.id);
      toast.success(`Deleted "${recipe.title}"`);
      router.push('/');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      toast.error('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-text-secondary">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Recipe not found'}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
  }[recipe.difficulty];

  return (
    <div className="w-full">
      {/* Header Navigation */}
      <div className="bg-surface border-b border-border shadow-warm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/recipes/${id}/edit`)}
              className="p-2 hover:bg-background rounded-full transition-colors"
              title="Edit recipe"
            >
              <Pencil size={22} className="text-text-secondary hover:text-primary" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className="p-2 hover:bg-background rounded-full transition-colors"
            >
              <Heart
                size={24}
                className={`transition-colors ${
                  isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-text-secondary hover:text-red-500'
                }`}
              />
            </button>
            <button
              onClick={handleDeleteRecipe}
              className="p-2 hover:bg-red-50 rounded-full transition-colors"
              title="Delete recipe"
            >
              <Trash2 size={22} className="text-text-secondary hover:text-red-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary text-white">
              {recipe.cuisine_type}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            {recipe.title}
          </h1>
          {recipe.description && (
            <p className="text-xl text-text-secondary">{recipe.description}</p>
          )}
        </div>

        {/* Image */}
        {recipe.image_url && (
          <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden shadow-warm-lg mb-8">
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover transition-transform duration-300"
              style={{ transform: `rotate(${imageRotation}deg)` }}
            />
          </div>
        )}

        {/* Metadata Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface rounded-xl p-4 border border-border shadow-warm">
            <div className="text-sm text-text-secondary mb-1 flex items-center gap-2">
              <Clock size={16} />
              Total Time
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatTime(recipe.total_time_minutes)}
            </p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-border shadow-warm">
            <div className="text-sm text-text-secondary mb-1 flex items-center gap-2">
              <Users size={16} />
              Servings
            </div>
            <p className="text-2xl font-bold text-primary">{recipe.servings}</p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-border shadow-warm">
            <div className="text-sm text-text-secondary mb-1 flex items-center gap-2">
              <Flame size={16} />
              Difficulty
            </div>
            <p className="text-sm font-semibold mt-2">
              <span className={`inline-block px-2 py-1 rounded ${difficultyColor}`}>
                {recipe.difficulty.charAt(0).toUpperCase() +
                  recipe.difficulty.slice(1)}
              </span>
            </p>
          </div>
          <div className="bg-surface rounded-xl p-4 border border-border shadow-warm">
            <div className="text-sm text-text-secondary mb-1">Prep / Cook</div>
            <p className="text-lg font-bold text-primary">
              {formatTime(recipe.prep_time_minutes)} / {formatTime(recipe.cook_time_minutes)}
            </p>
          </div>
        </div>

        {/* Ingredients */}
        {recipeIngredients.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-warm mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold text-text">Ingredients</h2>
              <div className="flex items-center gap-2">
                {/* Unit system toggle */}
                <div className="flex rounded-lg border border-border overflow-hidden text-xs font-medium">
                  {(['original', 'metric', 'imperial'] as UnitSystem[]).map((sys) => (
                    <button
                      key={sys}
                      onClick={() => changeUnitSystem(sys)}
                      className={`px-2.5 py-1.5 capitalize transition-colors ${
                        unitSystem === sys ? 'bg-primary text-white' : 'text-text-secondary hover:bg-background'
                      }`}
                    >
                      {sys === 'original' ? 'Orig' : sys}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddToGrocery}
                  disabled={addingToGrocery}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                  title="Add all ingredients to a grocery list"
                >
                  <ShoppingCart size={16} /> Add to list
                </button>
              </div>
            </div>
            <ul className="space-y-1">
              {recipeIngredients.map((ing, idx) => {
                // OR divider
                if (ing.name === '---OR---') {
                  return (
                    <li key={idx} className="flex items-center gap-3 py-1">
                      <div className="flex-1 border-t border-orange-300" />
                      <span className="text-xs font-bold text-orange-500 tracking-wider">OR</span>
                      <div className="flex-1 border-t border-orange-300" />
                    </li>
                  );
                }
                // Section headers start with "---"
                if (ing.name?.startsWith('---') && ing.name?.endsWith('---')) {
                  return (
                    <li key={idx} className="pt-4 pb-1">
                      <p className="text-sm font-bold text-primary uppercase tracking-wide">
                        {ing.name.replace(/^-+\s*/, '').replace(/\s*-+$/, '')}
                      </p>
                    </li>
                  );
                }
                const converted = convertMeasure(ing.quantity, ing.unit, unitSystem);
                const measure = ing.quantity > 0 ? formatQuantity(converted.quantity, converted.unit) : '';
                const checked = checkedIngredients.has(idx);
                return (
                  <li key={idx}>
                    <button
                      onClick={() => toggleIngredient(idx)}
                      className="flex items-start gap-3 py-1.5 w-full text-left group"
                    >
                      <span
                        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          checked ? 'bg-primary border-primary' : 'border-border group-hover:border-primary'
                        }`}
                      >
                        {checked && <Check size={14} className="text-white" />}
                      </span>
                      <span className={`transition-colors ${checked ? 'text-text-secondary line-through' : 'text-text'}`}>
                        {measure && <span className="font-semibold">{measure}</span>}
                        {measure ? ' ' : ''}{titleCaseIngredient(ing.name)}
                        {ing.notes && (
                          <span className="text-text-secondary text-sm ml-1 no-underline">({ing.notes})</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Nutrition Facts */}
        {nutrition && (
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-warm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-text">Nutrition Facts</h2>
              <span className="text-xs font-medium text-text-secondary bg-background px-2 py-1 rounded">
                Estimated
              </span>
            </div>
            <p className="text-xs text-text-secondary mb-4">
              Per serving ({nutrition.matchedCount} of {nutrition.totalCount} ingredients matched)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-l-4 border-primary pl-4">
                <p className="text-xs text-text-secondary mb-1">Calories</p>
                <p className="text-2xl font-bold text-text">{nutrition.nutrition.calories}</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-xs text-text-secondary mb-1">Protein</p>
                <p className="text-2xl font-bold text-text">{nutrition.nutrition.protein}g</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-xs text-text-secondary mb-1">Carbs</p>
                <p className="text-2xl font-bold text-text">{nutrition.nutrition.carbs}g</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <p className="text-xs text-text-secondary mb-1">Fat</p>
                <p className="text-2xl font-bold text-text">{nutrition.nutrition.fat}g</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-warm mb-8">
            <h2 className="text-2xl font-bold text-text mb-6">Instructions</h2>
            <ol className="space-y-2">
              {recipe.instructions.map((instruction) => {
                const done = checkedSteps.has(instruction.step_number);
                return (
                  <li key={instruction.step_number}>
                    <button
                      onClick={() => toggleStep(instruction.step_number)}
                      className="flex gap-4 w-full text-left py-2 rounded-lg hover:bg-background/60 transition-colors"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                          done ? 'bg-primary/30 text-primary' : 'bg-primary text-white'
                        }`}
                      >
                        {done ? <Check size={18} /> : instruction.step_number}
                      </div>
                      <div className="flex-1">
                        <p className={`leading-relaxed transition-colors ${done ? 'text-text-secondary line-through' : 'text-text'}`}>
                          {instruction.text}
                        </p>
                        {instruction.timer_minutes && (
                          <p className="text-sm text-text-secondary mt-2 flex items-center gap-1 no-underline">
                            <Clock size={14} />
                            {instruction.timer_label || `Timer: ${instruction.timer_minutes} minutes`}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Source Information */}
        {(recipe.source_name || recipe.source_author) && (
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-warm mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={20} className="text-text-secondary" />
              <h3 className="text-sm font-semibold text-text-secondary">Source</h3>
            </div>
            <div className="space-y-1">
              {recipe.source_name && (
                <p className="text-text font-medium">From: {recipe.source_name}</p>
              )}
              {recipe.source_author && (
                <p className="text-text font-medium">By: {recipe.source_author}</p>
              )}
            </div>
          </div>
        )}

        {/* Source Information */}
        {recipe.source_url && (
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-warm mb-8">
            <p className="text-sm text-text-secondary mb-2">Recipe Source</p>
            <a
              href={recipe.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark font-medium break-all"
            >
              View Original Recipe
            </a>
          </div>
        )}

        {/* Cooking Journal */}
        <CookLogSection recipeId={recipe.id} />
      </div>
    </div>
  );
}
