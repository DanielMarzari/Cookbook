'use client';

import type { ReactNode } from 'react';
import type { Motif } from '@/lib/charcuterie/types';

const r2 = (n: number) => Math.round(n * 100) / 100;

interface Args {
  rng: () => number;
  box: [number, number, number, number];
  center: [number, number];
  motif: Motif;
  src: string;
  key: string;
}

/**
 * Show the photograph through the zone, like food seen through a cut-out.
 *
 * The earlier version treated each photo as one piece and placed fourteen copies
 * in a spiral or a fan. That was wrong about the source material: these pictures
 * are already plural — a heap of almonds, a bunch of grapes, a pile of olives —
 * so repeating them multiplied something that was whole, and a bunch of grapes
 * spiralled into a rose read as a pattern rather than as food.
 *
 * So the zone shape is a frame and the picture sits behind it at its own
 * proportions. `slice` scales the image until it covers the opening and crops
 * whatever hangs over, which keeps circles circular — the one thing that must
 * not happen here is a stretched photograph, because nothing says "pasted in"
 * faster than an oval walnut.
 */
export function PhotoFill({ rng, box, motif, src, key: k }: Args): ReactNode {
  const [x, y, w, h] = box;
  // A little past the bbox: zone paths bulge outside their box, and a hairline of
  // bare wood around the edge of the photo is what makes it look like a sticker.
  const bleed = Math.max(w, h) * 0.08;
  // A small random offset so two zones holding the same ingredient don't show an
  // identical crop side by side.
  const driftX = (rng() - 0.5) * bleed * 0.5;
  const driftY = (rng() - 0.5) * bleed * 0.5;

  return (
    <g key={k}>
      <image
        href={src}
        x={r2(x - bleed + driftX)}
        y={r2(y - bleed + driftY)}
        width={r2(w + bleed * 2)}
        height={r2(h + bleed * 2)}
        // Cover the frame, keep the aspect ratio, crop the overflow. Never stretch.
        preserveAspectRatio="xMidYMid slice"
        style={{ pointerEvents: 'none' }}
      />
      {/* A soft inner shadow around the opening so the food sits down in the
          board rather than floating flat on top of it. */}
      <g style={{ pointerEvents: 'none' }} opacity={0.5}>
        <rect
          x={r2(x - bleed)}
          y={r2(y - bleed)}
          width={r2(w + bleed * 2)}
          height={r2(h + bleed * 2)}
          fill={`url(#${k}-vig)`}
        />
      </g>
      <defs>
        <radialGradient id={`${k}-vig`} cx="50%" cy="50%" r="72%">
          <stop offset="62%" stopColor="#2a1a0d" stopOpacity="0" />
          <stop offset="100%" stopColor="#2a1a0d" stopOpacity="0.55" />
        </radialGradient>
      </defs>
    </g>
  );
}

/** Kept so callers can still ask what a motif implies, even though the frame no
 *  longer arranges pieces. Useful for the copy under the preview. */
export function motifLabel(motif: Motif): string {
  return motif;
}
