'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/lib/types';
import { Clock, Users, Flame, ArrowLeft, Heart } from 'lucide-react';
import Image from 'next/image';

interface RecipeDetailPageProps {
  params: {
    id: string;
  };
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', params.id)
          .single();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (data) {
          setRecipe(data);
          setIsFavorite(data.is_favorite);
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
  }, [params.id]);

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
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover"
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
