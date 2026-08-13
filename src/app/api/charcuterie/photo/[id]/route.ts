import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { customPhotoPath, hasCustomPhoto } from '@/lib/charcuterie/photo-storage';

/**
 * One URL per ingredient, so the board never has to know where a photo came
 * from. A hand-supplied image wins over the fetched one; if neither exists the
 * caller gets a 404 and falls back to the drawn motif.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Ingredient ids are catalogue slugs; anything else is someone walking the disk.
  if (!/^[a-z0-9-]+$/.test(id)) return new NextResponse('bad id', { status: 400 });

  const custom = await hasCustomPhoto(id);
  const file = custom
    ? customPhotoPath(id)
    : path.join(process.cwd(), 'public', 'charcuterie', 'items', `${id}.webp`);

  try {
    const buf = await readFile(file);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': 'image/webp',
        // Custom photos change when you replace them; bundled ones never do.
        'Cache-Control': custom ? 'private, max-age=60' : 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('no photo', { status: 404 });
  }
}
