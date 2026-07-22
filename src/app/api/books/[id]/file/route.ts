import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import { getDb } from '@/lib/db';
import { bookFileAbsPath } from '@/lib/books-storage';

interface BookRow { id: string; format: string; filename: string; file_path: string }

// Streams the raw book file for the in-app reader (pdf.js / epub.js).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = getDb().prepare('SELECT id, format, filename, file_path FROM books WHERE id = ?').get(id) as BookRow | undefined;
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    const buf = await readFile(bookFileAbsPath(row.file_path));
    const type = row.format === 'epub' ? 'application/epub+zip' : 'application/pdf';
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': type,
        'Content-Length': String(buf.length),
        'Content-Disposition': `inline; filename="${row.filename.replace(/"/g, '')}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (e) {
    console.error('book file read error', e);
    return NextResponse.json({ error: 'File missing on disk' }, { status: 404 });
  }
}
