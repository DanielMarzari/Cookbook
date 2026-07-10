'use client';

import { Recipe } from '@/lib/types';
import { Heart, Sparkles, FlaskConical, CheckCircle, Award, Archive } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { formatTime } from '@/lib/utils';
import { framingStyle } from '@/lib/image';

type RecipeStatus = 'new' | 'testing' | 'approved' | 'signature' | 'archived';

const STATUS_ICONS: Record<RecipeStatus, typeof Sparkles> = {
  new: Sparkles,
  testing: FlaskConical,
  approved: CheckCircle,
  signature: Award,
  archived: Archive,
};

const STATUS_LABELS: Record<RecipeStatus, string> = {
  new: 'New',
  testing: 'Testing',
  approved: 'Approved',
  signature: 'Signature',
  archived: "Tried, didn't like",
};

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onStatusChange?: (id: string, status: RecipeStatus) => void;
}

export default function RecipeCard({
  recipe,
  onToggleFavorite,
  onStatusChange,
}: RecipeCardProps) {
  const [isFavorite, setIsFavorite] = useState(recipe.is_favorite);
  const [status, setStatus] = useState<RecipeStatus>(recipe.status || 'new');

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    onToggleFavorite?.(recipe.id, newFavorite);
  };

  const handleCycleStatus = async (e: React.MouseEvent) => {
    e.preventDefault();
    const statuses: RecipeStatus[] = ['new', 'testing', 'approved', 'signature', 'archived'];
    const nextStatus = statuses[(statuses.indexOf(status) + 1) % statuses.length];
    try {
      await api.recipes.update(recipe.id, { status: nextStatus });
      setStatus(nextStatus);
      onStatusChange?.(recipe.id, nextStatus);
    } catch (error) {
      console.error('Error updating recipe status:', error);
    }
  };

  if (!recipe.id) return null;

  const StatusIcon = STATUS_ICONS[status];
  const tagParts = [
    (recipe.cuisine_type || 'other').toLowerCase(),
    ...(status === 'signature' ? ['signature'] : []),
  ];
  const metaParts = [
    recipe.total_time_minutes ? formatTime(recipe.total_time_minutes) : null,
    recipe.servings ? `serves ${recipe.servings}` : null,
  ].filter(Boolean);

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <article className="group cursor-pointer">
        {/* Tall image, honoring the recipe's framing (pan / zoom / rotate) */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F4F4F4]">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
              className="object-cover transition-opacity duration-300 group-hover:opacity-90"
              style={framingStyle({
                image_position: recipe.image_position,
                image_zoom: recipe.image_zoom,
                image_rotation: recipe.image_rotation,
              })}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[12.5px] text-text-secondary">no photo yet</p>
            </div>
          )}

          {/* Quiet controls — surface on hover / focus */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={handleCycleStatus}
              className="p-2 bg-white/95 border border-border cursor-pointer hover:bg-white"
              aria-label="Cycle recipe status"
              title={STATUS_LABELS[status]}
            >
              <StatusIcon size={15} strokeWidth={1.8} className="text-text" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className="p-2 bg-white/95 border border-border cursor-pointer hover:bg-white"
              aria-label="Toggle favorite"
            >
              <Heart
                size={15}
                strokeWidth={1.8}
                className={isFavorite ? 'fill-text text-text' : 'text-text'}
              />
            </button>
          </div>
        </div>

        {/* Tag, title, meta */}
        <p className="tag-link mt-3.5 mb-1.5 lowercase">{tagParts.join(' · ')}</p>
        <h3 className="text-[16.5px] leading-[1.4] text-text max-w-[34ch] group-hover:underline underline-offset-4 decoration-1">
          {recipe.title}
        </h3>
        {metaParts.length > 0 && (
          <p className="text-[12.5px] text-text-secondary mt-1.5">{metaParts.join(' · ')}</p>
        )}
      </article>
    </Link>
  );
}
