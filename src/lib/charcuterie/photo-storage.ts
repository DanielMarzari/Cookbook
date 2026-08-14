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

const SIZE = 768;

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

export interface IngestResult {
  id: string;
  /** True when the supplied image already had transparency. */
  cutout: boolean;
  note: string;
}

/**
 * Store a supplied image, as supplied.
 *
 * There used to be a flood-fill background remover here. It was wrong twice
 * over: it mangled photographs shot on anything busier than a plain sweep, and
 * it was destructive — WebP drops the colour under full transparency, so a keyed
 * image cannot be un-keyed afterwards. Pictures that need a cutout should arrive
 * as one; the board frames whatever it is given.
 */
export async function ingestPhoto(
  id: string,
  input: Buffer,
  opts: { save?: boolean } = {},
): Promise<IngestResult & { dataUrl?: string }> {
  const save = opts.save !== false;
  if (save) await mkdir(CUSTOM_PHOTOS_DIR, { recursive: true });

  const meta = await sharp(input).metadata();
  const cutout = Boolean(meta.hasAlpha);

  let img = sharp(input).rotate();
  // A supplied cutout usually carries empty margin around the subject; trimming
  // it means the frame fills with food rather than with nothing. A photograph
  // that has a background is left exactly as given — no keying, no trimming.
  if (cutout) img = img.trim({ threshold: 1 });

  const out = await img
    // Cap the long edge and keep the picture's own proportions. The board frames
    // it with preserveAspectRatio="slice", so squaring here would only add
    // padding for the frame to crop back off.
    .resize(SIZE, SIZE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, alphaQuality: 92 })
    .toBuffer();

  if (save) await writeFile(customPhotoPath(id), out);
  return {
    id,
    cutout,
    // Handed back for the preview so the board can show the picture before it is
    // committed — you should see how it sits among the food, not just in a swatch.
    dataUrl: save ? undefined : `data:image/webp;base64,${out.toString('base64')}`,
    note: cutout
      ? 'transparent cutout — trimmed to the subject, stored as supplied'
      : 'stored exactly as supplied; the board frames it rather than cutting it out',
  };
}
