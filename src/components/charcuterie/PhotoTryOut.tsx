'use client';

import { PhotoFill } from './PhotoFill';
import { rngFor } from '@/lib/charcuterie/geometry';
import type { Motif } from '@/lib/charcuterie/types';

/**
 * The picture you just saved, on the board.
 *
 * It appears after the save rather than before it, because a picture that is not
 * on disk yet is a picture you can lose by clicking somewhere else. This is the
 * real frame on real board surface at the size a zone occupies, read back from
 * the server — so if it renders here, it is genuinely saved.
 */
export default function PhotoTryOut({
  itemId,
  motif,
  src,
  note,
  onDismiss,
  onRemove,
}: {
  itemId: string;
  motif: Motif;
  src: string;
  note: string;
  onDismiss: () => void;
  onRemove: () => void;
}) {
  const w = 300;
  const h = 190;
  // Same seed the board uses, so this is the board, not an impression of it.
  const rng = rngFor(`try:${itemId}:${motif}`);

  return (
    <div className="mt-2 border border-text p-2">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full block" role="img" aria-label="Preview on the board">
        <defs>
          <filter id={`try-grain-${itemId}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.16" numOctaves={4} seed={7} />
            <feColorMatrix values="0 0 0 0 0.16 0 0 0 0 0.10 0 0 0 0 0.05 0 0 0 0.5 0" />
          </filter>
        </defs>
        {/* Walnut, matching the studio's default surface. */}
        <rect x="0" y="0" width={w} height={h} fill="#6d4a2e" />
        <rect x="0" y="0" width={w} height={h} filter={`url(#try-grain-${itemId})`} />
        {PhotoFill({
          rng,
          box: [18, 16, w - 36, h - 32],
          center: [w / 2, h / 2],
          motif,
          src,
          key: `try-${itemId}`,
        })}
      </svg>

      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-[11.5px] text-text-secondary leading-[1.4]">{note}</span>
        <span className="flex items-center gap-3 shrink-0">
          <button onClick={onRemove} className="tlink text-[12px] text-text-secondary hover:text-text">
            remove
          </button>
          <button
            onClick={onDismiss}
            className="px-3 py-1 border border-text text-[12px] hover:bg-text hover:text-white transition-colors"
          >
            Done
          </button>
        </span>
      </div>
    </div>
  );
}
