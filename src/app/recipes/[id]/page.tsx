'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Recipe, RecipeIngredient, Ingredient, NutritionInfo } from '@/lib/types';
import { Clock, Users, Flame, ArrowLeft, Heart, BookOpen, RotateCw } from 'lucide-react';

interface NutritionCalculation {
  nutrition: NutritionInfo;
  matchedCount: number;
  totalCount: number;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [nutrition, setNutrition] = useState<NutritionCalculation | null>(null);
  const [imageRotation, setImageRotation] = useState(0);

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

        const { data, error: supabaseError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (data) {
          setRecipe(data);
          setIsFavorite(data.is_favorite);
          setImageRotation(data.image_rotation || 0);
          // Calculate nutrition for this recipe
          await calculateNutrition(data);
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

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    try {
      const newFavorite = !isFavorite;
      await supabase
        .from('recipes')
        .update({ is_favorite: newFavorite })
        .eq('id', recipe.id);
      setIsFavorite(newFavorite);
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  const handleRotateImage = async () => {
    if (!recipe) return;
    try {
      const newRotation = (imageRotation + 90) % 360;
      await supabase
        .from('recipes')
        .update({ image_rotation: newRotation })
        .eq('id', recipe.id);
      setImageRotation(newRotation);
    } catch (err) {
      console.error('Error updating image rotation:', err);
    }
  };

  const convertUnitToGrams = (quantity: number, unit: string): number | null => {
    const lowerUnit = unit.toLowerCase().trim();

    const conversions: Record<string, number> = {
      'g': 1,
      'gram': 1,
      'grams': 1,
      'oz': 28,
      'ounce': 28,
      'ounces': 28,
      'lb': 454,
      'lbs': 454,
      'pound': 454,
      'pounds': 454,
      'cup': 240,
      'cups': 240,
      'tbsp': 15,
      'tablespoon': 15,
      'tablespoons': 15,
      'tsp': 5,
      'teaspoon': 5,
      'teaspoons': 5,
      'ml': 1,
      'milliliter': 1,
      'milliliters': 1,
    };

    if (conversions[lowerUnit]) {
      return quantity * conversions[lowerUnit];
    }
    return null;
  };

  const calculateNutrition = async (recipeData: Recipe) => {
    try {
      // Fetch recipe ingredients
      const { data: recipeIngredients, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select('*')
        .eq('recipe_id', recipeData.id);

      if (ingredientsError) {
        console.error('Error fetching ingredients:', ingredientsError);
        return;
      }

      if (!recipeIngredients || recipeIngredients.length === 0) {
        setNutrition(null);
        return;
      }

      // Fetch all ingredients from database
      const { data: allIngredients, error: dbIngredientsError } = await supabase
        .from('ingredients')
        .select('*');

      if (dbIngredientsError) {
        console.error('Error fetching database ingredients:', dbIngredientsError);
        return;
      }

      // Calculate nutrition
      const totalNutrition: NutritionInfo = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      };

      let matchedCount = 0;

      for (const recipeIng of recipeIngredients) {
        // Try to find matching ingredient (case-insensitive)
        const matchedIngredient = allIngredients?.find(
          (ing) => ing.name.toLowerCase() === recipeIng.name.toLowerCase()
        );

        if (matchedIngredient) {
          matchedCount++;
          // Convert quantity to grams
          const gramsPerServing = convertUnitToGrams(recipeIng.quantity, recipeIng.unit);

          if (gramsPerServing !== null) {
            const gramsPerGram = gramsPerServing / 100;
            totalNutrition.calories += matchedIngredient.calories_per_100g * gramsPerGram;
            totalNutrition.protein += matchedIngredient.protein_per_100g * gramsPerGram;
            totalNutrition.carbs += matchedIngredient.carbs_per_100g * gramsPerGram;
            totalNutrition.fat += matchedIngredient.fat_per_100g * gramsPerGram;
            totalNutrition.fiber += matchedIngredient.fiber_per_100g * gramsPerGram;
            totalNutrition.sugar += matchedIngredient.sugar_per_100g * gramsPerGram;
            totalNutrition.sodium += matchedIngredient.sodium_per_100g * gramsPerGram;
          }
        }
      }

      // Calculate per serving
      const perServing: NutritionInfo = {
        calories: Math.round(totalNutrition.calories / recipeData.servings),
        protein: Math.round((totalNutrition.protein / recipeData.servings) * 10) / 10,
        carbs: Math.round((totalNutrition.carbs / recipeData.servings) * 10) / 10,
        fat: Math.round((totalNutrition.fat / recipeData.servings) * 10) / 10,
        fiber: Math.round((totalNutrition.fiber / recipeData.servings) * 10) / 10,
        sugar: Math.round((totalNutrition.sugar / recipeData.servings) * 10) / 10,
        sodium: Math.round((totalNutrition.sodium / recipeData.servings) * 10) / 10,
      };

      setNutrition({
        nutrition: perServing,
        matchedCount,
        totalCount: recipeIngredients.length,
      });
    } catch (err) {
      console.error('Error calculating nutrition:', err);
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
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: `rotate(${imageRotation}deg)` }}
            />
            <button
              onClick={handleRotateImage}
              className="absolute top-4 right-4 p-3 bg-surface rounded-full shadow-warm hover:shadow-warm-lg transition-all hover:scale-110"
              aria-label="Rotate image"
              title="Rotate image"
            >
              <RotateCw size={20} className="text-text" />
            </button>
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
              {recipe.total_time_minutes}m
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
            <div className="text-sm text-text-secondary mb-1">Prep Time</div>
            <p className="text-2xl font-bold text-primary">
              {recipe.prep_time_minutes}m
            </p>
          </div>
        </div>

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
            <ol className="space-y-4">
              {recipe.instructions.map((instruction) => (
                <li
                  key={instruction.step_number}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {instruction.step_number}
                  </div>
                  <div className="flex-1">
                    <p className="text-text leading-relaxed">
                      {instruction.text}
                    </p>
                    {instruction.timer_minutes && (
                      <p className="text-sm text-text-secondary mt-2 flex items-center gap-1">
                        <Clock size={14} />
                        {instruction.timer_label || `Timer: ${instruction.timer_minutes} minutes`}
                      </p>
                    )}
                  </div>
                </li>
              ))}
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
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-warm">
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
      </div>
    </div>
  );
}
