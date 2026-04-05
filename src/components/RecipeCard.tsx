'use client';

import { Recipe } from '@/lib/types';
import { Heart, Clock, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
}

export default function RecipeCard({
  recipe,
  onToggleFavorite,
}: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(recipe.is_favorite);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    onToggleFavorite?.(recipe.id, newFavorite);
  };

  const themeClass = cuisineColors[recipe.cuisine_type.toLowerCase()] || '';

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
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                onLoadingComplete={() => setIsImageLoading(false)}
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

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 bg-surface rounded-full shadow-warm hover:shadow-warm-lg transition-all hover:scale-110"
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
        <div className="p-4 flex flex-col h-40">
          {/* Title */}
          <h3 className="text-lg font-bold text-text mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>

          {/* Cuisine Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
              {recipe.cuisine_type}
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
              <span>{recipe.total_time_minutes} min</span>
            </div>
            <div className="text-sm text-text-secondary">
              {recipe.servings} servings
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
