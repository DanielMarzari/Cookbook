import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

// Book files live OUTSIDE the deploy target so the rsync --delete on each deploy
// can't wipe them. Default: a sibling of the app dir (…/cookbook-books). Override
// with BOOKS_DIR. Created on first write.
export const BOOKS_DIR = process.env.BOOKS_DIR || path.join(process.cwd(), '..', 'cookbook-books');

export async function saveBookFile(id: string, ext: string, buf: Buffer): Promise<string> {
  await mkdir(BOOKS_DIR, { recursive: true });
  const rel = `${id}.${ext}`;
  await writeFile(path.join(BOOKS_DIR, rel), buf);
  return rel;
}

export function bookFileAbsPath(rel: string): string {
  return path.join(BOOKS_DIR, rel);
}

export async function bookFileSize(rel: string): Promise<number | null> {
  try { return (await stat(path.join(BOOKS_DIR, rel))).size; } catch { return null; }
}

export function bookFileStream(rel: string) {
  return createReadStream(path.join(BOOKS_DIR, rel));
}

export async function deleteBookFile(rel: string): Promise<void> {
  try { await unlink(path.join(BOOKS_DIR, rel)); } catch { /* already gone */ }
}
