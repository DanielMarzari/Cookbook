import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getDb } from '@/lib/db';
import { saveBookFile } from '@/lib/books-storage';

const MAX_LIBRARY_BYTES = 3 * 1024 * 1024 * 1024; // 3GB total across the shelf

// GET  /api/books        -> the shelf (metadata only)
// POST /api/books        -> upload a PDF/EPUB the user owns; stores the file on
//                           disk and a metadata row. multipart: file, title?, author?
export async function GET() {
  try {
    const db = getDb();
    const books = db.prepare('SELECT id, title, author, format, filename, size_bytes, page_count, cover, created_at FROM books ORDER BY created_at DESC').all();
    return NextResponse.json(books);
  } catch (e) {
    console.error('books list error', e);
    return NextResponse.json({ error: 'Failed to list books' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!file || !(file instanceof Blob)) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // No per-file cap — but keep the whole shelf under 3GB.
    const used = (getDb().prepare('SELECT COALESCE(SUM(size_bytes), 0) AS n FROM books').get() as { n: number }).n;
    if (used + file.size > MAX_LIBRARY_BYTES) {
      const freeGb = Math.max(0, (MAX_LIBRARY_BYTES - used) / 1e9).toFixed(2);
      return NextResponse.json({ error: `Your bookshelf is full (3GB limit). About ${freeGb}GB free — remove a book to make room.` }, { status: 413 });
    }

    const filename = ('name' in file && typeof (file as File).name === 'string') ? (file as File).name : 'book';
    const ext = filename.toLowerCase().endsWith('.epub') ? 'epub' : filename.toLowerCase().endsWith('.pdf') ? 'pdf' : '';
    if (!ext) return NextResponse.json({ error: 'Only PDF and EPUB files are supported' }, { status: 415 });

    const id = randomUUID();
    const buf = Buffer.from(await file.arrayBuffer());
    const relPath = await saveBookFile(id, ext, buf);

    const title = (form.get('title') as string)?.trim() || filename.replace(/\.(pdf|epub)$/i, '');
    const author = (form.get('author') as string)?.trim() || null;
    const now = new Date().toISOString();

    getDb().prepare(
      `INSERT INTO books (id, title, author, format, filename, file_path, size_bytes, page_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, title, author, ext, filename, relPath, buf.length, null, now);

    return NextResponse.json({ id, title, author, format: ext, filename, size_bytes: buf.length, created_at: now });
  } catch (e) {
    console.error('book upload error', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Upload failed' }, { status: 500 });
  }
}
