'use client';

import { useState } from 'react';
import { Heart, Star, Sparkle, FlaskConical, Check, Archive } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { RecipeStatus } from '@/lib/types';

/**
 * Loved, signature, and where a recipe has got to — for one recipe, whatever
 * that recipe is.
 *
 * A variation is a recipe row like any other, so these marks were always
 * per-branch in the database; there was simply nowhere to set them except the
 * card on the home grid, which only ever renders bases. That made the marks
 * look like they belonged to the family. They don't: the sourdough version can
 * be the one you'd cook for someone while the base is still being worked out,
 * and the four doughs can each be at a different stage.
 *
 * Extracted so the card, the version switcher and the branch manager all drive
 * the same thing rather than three near-copies drifting apart.
 */

export const STATUS_LABELS: Record<RecipeStatus, string> = {
  new: 'New — not cooked yet',
  testing: 'Testing — still working out what it wants',
  approved: 'Approved — this one works',
  archived: "Tried, didn't like — kept, but not coming back to it",
};

export const STATUS_ORDER: RecipeStatus[] = ['new', 'testing', 'approved', 'archived'];

const STATUS_ICONS: Record<RecipeStatus, typeof Sparkle> = {
  new: Sparkle,
  testing: FlaskConical,
  approved: Check,
  archived: Archive,
};

export interface MarkState {
  is_favorite?: number | boolean | null;
  is_signature?: number | boolean | null;
  status?: string | null;
}

export default function RecipeMarks({
  recipeId,
  initial,
  size = 15,
  onChange,
  className = '',
  showLabels = false,
}: {
  recipeId: string;
  initial: MarkState;
  size?: number;
  onChange?: (next: MarkState) => void;
  className?: string;
  /** Spell the status out beside the icon — for lists, where there is room. */
  showLabels?: boolean;
}) {
  const [fav, setFav] = useState(Boolean(initial.is_favorite));
  const [sig, setSig] = useState(Boolean(initial.is_signature));
  const [status, setStatus] = useState<RecipeStatus>((initial.status as RecipeStatus) || 'new');

  // Optimistic, then put it back if the write fails — a mark that silently
  // didn't save is worse than one that visibly bounces.
  async function write(patch: MarkState, revert: () => void) {
    try {
      await api.recipes.update(recipeId, patch as never);
      onChange?.({ is_favorite: fav, is_signature: sig, status, ...patch });
    } catch {
      revert();
    }
  }

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const nextStatus = STATUS_ORDER[(STATUS_ORDER.indexOf(status) + 1) % STATUS_ORDER.length];
  const StatusIcon = STATUS_ICONS[status];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          const next = !sig;
          setSig(next);
          write({ is_signature: next }, () => setSig(!next));
        }}
        aria-pressed={sig}
        aria-label={sig ? 'Remove signature mark' : 'Mark as a signature dish'}
        title={sig ? 'One of your best. Click to unmark.' : 'Mark as one of your best'}
        className={`transition-colors ${sig ? 'text-text' : 'text-text-secondary hover:text-text'}`}
      >
        <Star size={size} strokeWidth={1.8} fill={sig ? 'currentColor' : 'none'} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          stop(e);
          const next = !fav;
          setFav(next);
          write({ is_favorite: next }, () => setFav(!next));
        }}
        aria-pressed={fav}
        aria-label={fav ? 'Remove from loved' : 'Love this one'}
        title={fav ? 'Loved. Click to unlove.' : 'Love this one'}
        className={`transition-colors ${fav ? 'text-text' : 'text-text-secondary hover:text-text'}`}
      >
        <Heart size={size} strokeWidth={1.8} fill={fav ? 'currentColor' : 'none'} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          stop(e);
          const prev = status;
          setStatus(nextStatus);
          write({ status: nextStatus }, () => setStatus(prev));
        }}
        aria-label={`Status: ${STATUS_LABELS[status]}. Click for ${STATUS_LABELS[nextStatus]}`}
        title={`${STATUS_LABELS[status]}\nClick for: ${STATUS_LABELS[nextStatus]}`}
        className="text-text-secondary hover:text-text transition-colors flex items-center gap-1.5"
      >
        <StatusIcon size={size} strokeWidth={1.8} />
        {showLabels && (
          <span className="text-[11px] uppercase tracking-[0.1em]">{status}</span>
        )}
      </button>
    </div>
  );
}
