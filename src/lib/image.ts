import type { CSSProperties } from 'react';

export interface Framing {
  image_position?: string | null; // CSS object-position, e.g. "50% 30%"
  image_zoom?: number | null; // scale factor, default 1
  image_rotation?: number | null; // degrees
}

/**
 * Build the inline style that frames a recipe's main photo consistently across
 * the detail hero, the edit preview, and the cookbook flipbook. Pairs with an
 * `object-cover` image inside an `overflow-hidden` box: `objectPosition` pans
 * the crop, `scale()` zooms, `rotate()` rotates.
 */
export function framingStyle(f: Framing): CSSProperties {
  const position = f.image_position || 'center';
  const zoom = f.image_zoom && f.image_zoom > 0 ? f.image_zoom : 1;
  const rotation = f.image_rotation || 0;

  const transforms: string[] = [];
  if (rotation) transforms.push(`rotate(${rotation}deg)`);
  if (zoom !== 1) transforms.push(`scale(${zoom})`);

  return {
    objectPosition: position,
    transform: transforms.length ? transforms.join(' ') : undefined,
  };
}

/** Parse an "X% Y%" object-position into numeric percentages (defaults 50/50). */
export function parsePosition(position?: string | null): { x: number; y: number } {
  const m = (position || '').match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);
  if (!m) return { x: 50, y: 50 };
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

/** Build an "X% Y%" object-position string from numeric percentages. */
export function buildPosition(x: number, y: number): string {
  return `${Math.round(x)}% ${Math.round(y)}%`;
}
