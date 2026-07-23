import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { deleteBookFile } from '@/lib/books-storage';

interface BookRow { id: string; file_path: string }

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = getDb().prepare('SELECT id, title, author, format, filename, size_bytes, page_count, cover, created_at FROM books WHERE id = ?').get(id);
  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(book);
}

// Set the cover thumbnail (data URI) extracted client-side after upload.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  if (typeof body.cover !== 'string' || !body.cover.startsWith('data:image/')) {
    return NextResponse.json({ error: 'cover data URI required' }, { status: 400 });
  }
  const res = getDb().prepare('UPDATE books SET cover = ? WHERE id = ?').run(body.cover.slice(0, 400_000), id);
  if (res.changes === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const row = db.prepare('SELECT id, file_path FROM books WHERE id = ?').get(id) as BookRow | undefined;
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await deleteBookFile(row.file_path);
  db.prepare('DELETE FROM books WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
