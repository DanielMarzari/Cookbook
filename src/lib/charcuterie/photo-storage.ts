import { mkdir, writeFile, readdir, unlink, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Ingredient photos you supply by hand.
 *
 * These live OUTSIDE the deploy target, next to the book files and for the same
 * reason: the standalone rsync runs with --delete against the app root, so
 * anything written inside it disappears on the next push. Override with
 * CHARCUTERIE_PHOTOS_DIR.
 */
export const CUSTOM_PHOTOS_DIR =
  process.env.CHARCUTERIE_PHOTOS_DIR || path.join(process.cwd(), '..', 'cookbook-charcuterie-photos');

const SIZE = 512;
/** How far a pixel may drift from its border seed and still count as background. */
const TOL = 34;

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

export function customPhotoPath(id: string): string {
  return path.join(CUSTOM_PHOTOS_DIR, `${id}.webp`);
}

export async function hasCustomPhoto(id: string): Promise<boolean> {
  return exists(customPhotoPath(id));
}

export async function listCustomPhotos(): Promise<string[]> {
  try {
    const files = await readdir(CUSTOM_PHOTOS_DIR);
    return files.filter((f) => f.endsWith('.webp')).map((f) => f.replace(/\.webp$/, ''));
  } catch {
    return []; // nothing uploaded yet
  }
}

export async function deleteCustomPhoto(id: string): Promise<void> {
  try {
    await unlink(customPhotoPath(id));
  } catch {
    // already gone
  }
}

/**
 * Flood fill inward from the border and make what it reaches transparent.
 *
 * Seeded from the four corners and the midpoint of each edge, because a subject
 * touching one edge splits the background into regions a single seed can't
 * reach. Same approach as the batch Python pass, so hand-added photos come out
 * looking like the fetched ones rather than obviously pasted in.
 */
function keyBackground(data: Buffer, w: number, h: number): { alpha: Buffer; removed: number } {
  const alpha = Buffer.alloc(w * h, 255);
  const seen = new Uint8Array(w * h);
  const stack: number[] = [];
  const seeds = [
    [0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1],
    [w >> 1, 0], [w >> 1, h - 1], [0, h >> 1], [w - 1, h >> 1],
  ];

  for (const [sx, sy] of seeds) {
    const si = sy * w + sx;
    if (seen[si]) continue;
    const sr = data[si * 4], sg = data[si * 4 + 1], sb = data[si * 4 + 2];
    seen[si] = 1;
    stack.push(si);
    while (stack.length) {
      const i = stack.pop() as number;
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      if (Math.max(Math.abs(r - sr), Math.abs(g - sg), Math.abs(b - sb)) > TOL) continue;
      alpha[i] = 0;
      const x = i % w, y = (i / w) | 0;
      if (x > 0 && !seen[i - 1]) { seen[i - 1] = 1; stack.push(i - 1); }
      if (x < w - 1 && !seen[i + 1]) { seen[i + 1] = 1; stack.push(i + 1); }
      if (y > 0 && !seen[i - w]) { seen[i - w] = 1; stack.push(i - w); }
      if (y < h - 1 && !seen[i + w]) { seen[i + w] = 1; stack.push(i + w); }
    }
  }

  let removed = 0;
  for (let i = 0; i < alpha.length; i++) if (alpha[i] === 0) removed++;
  return { alpha, removed: removed / (w * h) };
}

export interface IngestResult {
  id: string;
  removed: number;
  /** True when the background keyed cleanly enough to look like a cutout. */
  clean: boolean;
  note: string;
}

/**
 * Turn a supplied image into a board-ready cutout and store it.
 *
 * Keeps the original if the background won't key — a photo shot on a busy
 * surface still beats no photo, and the motif clip hides most of the edge.
 */
export async function ingestPhoto(id: string, input: Buffer): Promise<IngestResult> {
  await mkdir(CUSTOM_PHOTOS_DIR, { recursive: true });

  const base = sharp(input).rotate().resize(640, 640, { fit: 'inside', withoutEnlargement: true });
  const { data, info } = await base.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { alpha, removed } = keyBackground(data, info.width, info.height);

  // Only accept the key when it took a plausible slice — too little means a busy
  // background, too much means it ate the subject.
  const clean = removed >= 0.04 && removed <= 0.93;
  let img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  if (clean) {
    for (let i = 0; i < alpha.length; i++) data[i * 4 + 3] = alpha[i];
    img = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  }

  const out = await img
    .png()
    .toBuffer()
    .then((buf) =>
      sharp(buf)
        .trim({ threshold: 1 })
        .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 82, alphaQuality: 90 })
        .toBuffer(),
    );

  await writeFile(customPhotoPath(id), out);
  return {
    id,
    removed,
    clean,
    note: clean
      ? `background removed (${Math.round(removed * 100)}% keyed)`
      : removed < 0.04
        ? 'kept as-is — background too busy to key cleanly'
        : 'kept as-is — keying would have eaten the subject',
  };
}
