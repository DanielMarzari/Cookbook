import { NextResponse } from 'next/server';
import { ingestPhoto, listCustomPhotos, deleteCustomPhoto } from '@/lib/charcuterie/photo-storage';
import { getItem } from '@/lib/charcuterie/items';

export const dynamic = 'force-dynamic';

/** Which ingredients you've supplied a photo for by hand. */
export async function GET() {
  return NextResponse.json({ custom: await listCustomPhotos() });
}

/**
 * Take a photo for one ingredient, by upload or by URL.
 *
 * The URL is fetched server-side and stored, never hotlinked — a link that
 * works today is a broken board in six months, and the file needs processing
 * into a cutout regardless.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const id = String(form.get('itemId') ?? '');
  if (!/^[a-z0-9-]+$/.test(id) || !getItem(id)) {
    return NextResponse.json({ error: 'unknown ingredient' }, { status: 400 });
  }

  let buf: Buffer;
  const file = form.get('file');
  const url = String(form.get('url') ?? '').trim();

  if (file && typeof file !== 'string') {
    buf = Buffer.from(await file.arrayBuffer());
  } else if (url) {
    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: 'url must be http(s)' }, { status: 400 });
    }
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Cookbook/1.0' } });
      if (!res.ok) return NextResponse.json({ error: `source returned ${res.status}` }, { status: 400 });
      const type = res.headers.get('content-type') ?? '';
      if (!type.startsWith('image/')) {
        return NextResponse.json({ error: `that URL is ${type || 'not an image'}` }, { status: 400 });
      }
      buf = Buffer.from(await res.arrayBuffer());
    } catch (e) {
      return NextResponse.json({ error: `could not fetch: ${(e as Error).message}` }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: 'need a file or a url' }, { status: 400 });
  }

  if (buf.length < 1000) return NextResponse.json({ error: 'image too small' }, { status: 400 });
  if (buf.length > 25_000_000) return NextResponse.json({ error: 'image too large' }, { status: 400 });

  // preview=1 processes and hands the cutout straight back without storing it,
  // so a picture can be seen on the board before it replaces anything.
  const preview = String(form.get('preview') ?? '') === '1';
  try {
    const result = await ingestPhoto(id, buf, { save: !preview });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: `could not process: ${(e as Error).message}` }, { status: 500 });
  }
}

/** Drop a hand-supplied photo and fall back to the fetched one, or to the motif. */
export async function DELETE(req: Request) {
  const id = new URL(req.url).searchParams.get('id') ?? '';
  if (!/^[a-z0-9-]+$/.test(id)) return NextResponse.json({ error: 'bad id' }, { status: 400 });
  await deleteCustomPhoto(id);
  return NextResponse.json({ ok: true });
}
