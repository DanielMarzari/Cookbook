'use client';

import { Recipe } from '@/lib/types';
import { Heart, Clock, Flame, Sparkles, Check, ThumbsUp, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const cuisineColors: Record<string, string> = {
  italian: 'theme-italian',
  japanese: 'theme-japanese',
  mexican: 'theme-mexican',
  french: 'theme-french',
  chinese: 'theme-chinese',
  indian: 'theme-indian',
  thai: 'theme-thai',
  mediterranean: 'theme-mediterranean',
  american: 'theme-american',
  korean: 'theme-korean',
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onStatusChange?: (id: string, status: 'new' | 'tried' | 'approved' | 'wip') => void;
}

export default function RecipeCard({
  recipe,
  onToggleFavorite,
  onStatusChange,
}: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(recipe.is_favorite);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [status, setStatus] = useState<'new' | 'tried' | 'approved' | 'wip'>(recipe.status || 'new');

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    onToggleFavorite?.(recipe.id, newFavorite);
  };

  const handleCycleStatus = async (e: React.MouseEvent) => {
    e.preventDefault();
    const statuses: Array<'new' | 'tried' | 'approved' | 'wip'> = ['new', 'tried', 'approved', 'wip'];
    const currentIndex = statuses.indexOf(status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      await supabase
        .from('recipes')
        .update({ status: nextStatus })
        .eq('id', recipe.id);
      setStatus(nextStatus);
      onStatusChange?.(recipe.id, nextStatus);
    } catch (error) {
      console.error('Error updating recipe status:', error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'new':
        return <Sparkles size={20} className="text-blue-500" />;
      case 'tried':
        return <Check size={20} className="text-yellow-500" />;
      case 'approved':
        return <ThumbsUp size={20} className="text-green-500" />;
      case 'wip':
        return <Wrench size={20} className="text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'new':
        return 'New';
      case 'tried':
        return 'Tried';
      case 'approved':
        return 'Approved';
      case 'wip':
        return 'WIP';
      default:
        return '';
    }
  };

  const themeClass = cuisineColors[(recipe.cuisine_type || '').toLowerCase()] || '';

  // Safety check: don't render link if recipe.id is missing
  if (!recipe.id) {
    return null;
  }

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <article
        className={`group h-full overflow-hidden rounded-2xl shadow-warm hover:shadow-warm-lg transition-all duration-300 hover:scale-105 cursor-pointer bg-surface ${themeClass}`}
      >
        {/* Image Container */}
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-background to-border">
          {recipe.image_url ? (
            <>
              {isImageLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-background to-border animate-pulse" />
              )}
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🍳</div>
                <p className="text-sm text-text-secondary">No image</p>
              </div>
            </div>
          )}

          {/* Status and Favorite Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleCycleStatus}
              className="p-2 bg-surface rounded-full shadow-warm hover:shadow-warm-lg transition-all hover:scale-110"
              aria-label="Cycle recipe status"
              title={getStatusLabel()}
            >
              {getStatusIcon()}
            </button>
            <button
              onClick={handleToggleFavorite}
              className="p-2 bg-surface rounded-full shadow-warm hover:shadow-warm-lg transition-all hover:scale-110"
              aria-label="Toggle favorite"
            >
              <Heart
                size={20}
                className={`transition-colors ${
                  isFavorite
                    ? 'fill-red-500 text-red-500'
                    : 'text-text-secondary hover:text-red-500'
                }`}
              />
            </button>
          </div>

          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                difficultyColors[recipe.difficulty]
              }`}
            >
              <Flame size={14} />
              {recipe.difficulty.charAt(0).toUpperCase() +
                recipe.difficulty.slice(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col min-h-[10rem]">
          {/* Title */}
          <h3 className="text-lg font-bold text-text mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>

          {/* Cuisine Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
              {recipe.cuisine_type || 'Other'}
            </span>
          </div>

          {/* Description */}
          {recipe.description && (
            <p className="text-sm text-text-secondary line-clamp-2 mb-3 flex-1">
              {recipe.description}
            </p>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-sm text-text-secondary">
              <Clock size={16} />
              <span>{recipe.total_time_minutes ? `${recipe.total_time_minutes} min` : 'N/A'}</span>
            </div>
            <div className="text-sm text-text-secondary">
              {recipe.servings} servings
            </div>
          </div>

          {/* Source Badge */}
          {recipe.source_name && (
            <div className="mt-3 pt-3 border-t border-border">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-text-secondary/10 text-text-secondary">
                {recipe.source_name}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
