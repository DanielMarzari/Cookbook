'use client';

import { Recipe, type RecipeStatus } from '@/lib/types';
import { Heart, Sparkles, FlaskConical, CheckCircle, Award, Archive } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { api } from '@/lib/api-client';
import { formatTime } from '@/lib/utils';
import { framingStyle } from '@/lib/image';
import BranchCollage, { BranchTicks, type VariationThumb } from '@/components/BranchCollage';

const STATUS_ICONS: Record<RecipeStatus, typeof Sparkles> = {
  new: Sparkles,
  testing: FlaskConical,
  approved: CheckCircle,
  archived: Archive,
};

/**
 * What each status means, spelled out.
 *
 * The button cycles, so the only way to know what you are about to pick is to
 * be told — the icon alone cannot distinguish "still working on it" from "tried
 * it, didn't like it".
 */
const STATUS_LABELS: Record<RecipeStatus, string> = {
  new: 'New — not cooked yet',
  testing: "Testing — still working out what it wants",
  approved: 'Approved — this one works',
  archived: "Tried, didn't like — kept, but not coming back to it",
};

const STATUS_ORDER: RecipeStatus[] = ['new', 'testing', 'approved', 'archived'];

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
  const [isSignature, setIsSignature] = useState(Boolean(recipe.is_signature));

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    onToggleFavorite?.(recipe.id, newFavorite);
  };

  const handleCycleStatus = async (e: React.MouseEvent) => {
    e.preventDefault();
    const nextStatus = STATUS_ORDER[(STATUS_ORDER.indexOf(status) + 1) % STATUS_ORDER.length];
    try {
      await api.recipes.update(recipe.id, { status: nextStatus });
      setStatus(nextStatus);
      onStatusChange?.(recipe.id, nextStatus);
    } catch (error) {
      console.error('Error updating recipe status:', error);
    }
  };

  if (!recipe.id) return null;

  const handleToggleSignature = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isSignature;
    setIsSignature(next);
    try {
      await api.recipes.update(recipe.id, { is_signature: next });
    } catch (error) {
      console.error('Error updating signature:', error);
      setIsSignature(!next); // put the pip back if it didn't stick
    }
  };

  const StatusIcon = STATUS_ICONS[status];
  const tagParts = [
    (recipe.cuisine_type || 'other').toLowerCase(),
    ...(isSignature ? ['signature'] : []),
  ];
  const variations: VariationThumb[] =
    ((recipe as unknown as { variations?: VariationThumb[] }).variations) || [];
  const metaParts = [
    recipe.total_time_minutes ? formatTime(recipe.total_time_minutes) : null,
    recipe.servings ? `serves ${recipe.servings}` : null,
  ].filter(Boolean);

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <article className="group cursor-pointer">
        {/* Tall image, honoring the recipe's framing (pan / zoom / rotate) */}
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#F4F4F4]">
          {variations.length > 0 ? (
            <>
              <BranchCollage base={recipe} variations={variations} />
              <span className="absolute left-3 bottom-3 bg-white/95 border border-border px-2 py-[3px] text-[9px] uppercase tracking-[0.1em] text-text-secondary">
                base + {variations.length} variation{variations.length > 1 ? 's' : ''}
              </span>
            </>
          ) : recipe.image_url ? (
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

          {/* Signature sits apart from the status controls, top left, because it
              answers a different question and should not look like one of them.
              It stays visible when set — the point of a signature dish is that
              you can see which ones they are without hovering. */}
          <button
            onClick={handleToggleSignature}
            aria-pressed={isSignature}
            aria-label={
              isSignature ? 'Signature dish — click to unmark' : 'Mark as a signature dish'
            }
            title={
              isSignature
                ? 'Signature dish — one of your best'
                : 'Mark as a signature dish — one of your best'
            }
            className={`absolute top-3 left-3 p-2 border cursor-pointer transition-opacity ${
              isSignature
                ? 'bg-text border-text opacity-100'
                : 'bg-white/95 border-border opacity-0 group-hover:opacity-100 focus-within:opacity-100 hover:bg-white'
            }`}
          >
            <Award
              size={15}
              strokeWidth={1.8}
              className={isSignature ? 'text-white' : 'text-text'}
            />
          </button>

          {/* Quiet controls — surface on hover / focus */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button
              onClick={handleCycleStatus}
              className="p-2 bg-white/95 border border-border cursor-pointer hover:bg-white"
              aria-label={`Recipe status: ${STATUS_LABELS[status]}. Click to change.`}
              title={`${STATUS_LABELS[status]}\nClick for: ${
                STATUS_LABELS[STATUS_ORDER[(STATUS_ORDER.indexOf(status) + 1) % STATUS_ORDER.length]]
              }`}
            >
              <StatusIcon size={15} strokeWidth={1.8} className="text-text" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className="p-2 bg-white/95 border border-border cursor-pointer hover:bg-white"
              aria-label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
              title={isFavorite ? 'In your favourites' : 'Add to favourites'}
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
        {variations.length > 0 && <BranchTicks count={variations.length} />}
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
