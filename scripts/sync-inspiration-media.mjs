#!/usr/bin/env node
/* Turns a harvest of Instagram media URLs into files we own.
 *
 *   node scripts/sync-inspiration-media.mjs harvest.json
 *
 * The harvest is an array of { code, kind, video, poster, caption }. Signed CDN
 * URLs expire in roughly a day and a half, so a harvest is only good for about
 * that long — run this the same day you take one.
 *
 * Collect it from a browser signed in to Instagram, on www.instagram.com, with
 * the collection's shortcodes in `list` as "kind:code" strings:
 *
 *   const out = [];
 *   for (const item of list) {
 *     const [kind, code] = item.split(':');
 *     const f = document.createElement('iframe');
 *     f.style.cssText = 'position:fixed;left:-9999px;width:420px;height:760px';
 *     f.src = `${location.origin}/${kind}/${code}/embed/captioned/`;
 *     document.body.appendChild(f);
 *     await new Promise(r => (f.onload = r));
 *     // The player attaches its source a beat after the embed boots.
 *     for (let i = 0; i < 20 && !f.contentDocument.querySelector('video[src]'); i++)
 *       await new Promise(r => setTimeout(r, 400));
 *     const d = f.contentDocument;
 *     const cap = d.querySelector('.Caption')?.cloneNode(true);
 *     cap?.querySelectorAll('.CaptionUsername, .CaptionComments').forEach(n => n.remove());
 *     out.push({
 *       code, kind,
 *       video: d.querySelector('video')?.src || null,
 *       poster: d.querySelector('img.EmbeddedMediaImage')?.src || null,
 *       caption: cap ? cap.textContent.replace(/\s+/g, ' ').trim() : null,
 *     });
 *     f.remove();
 *   }
 *   copy(JSON.stringify(out));
 *
 * Reels on a licensed track are served without their media, so `video` comes
 * back null for roughly half of them. That is Instagram's rights boundary, not
 * a failure here — those keep the cover frame and a link out.
 */

import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'public/media/inspiration');
const MANIFEST = path.join(ROOT, 'src/data/inspiration-media.ts');

// Hashtag walls carry nothing for a recipe parser and only pad the card.
const trimHashtagWall = (text) =>
  text.replace(/(?:^|\n)[ \t]*(?:#[\wÀ-ɏ]+[ \t]*){3,}$/g, '').trim();

async function download(url, dest) {
  // curl rather than fetch: these are large files and it handles the redirects
  // and ranges without us babysitting a stream.
  await run('curl', ['-sSL', '--max-time', '180', '-o', dest, url]);
}

async function dimensions(file) {
  // Read the JPEG's SOF marker; no image library needed for a width and height.
  const buf = await readFile(file);
  for (let i = 2; i + 9 < buf.length; ) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  return null;
}

const [, , harvestPath] = process.argv;
if (!harvestPath) {
  console.error('usage: node scripts/sync-inspiration-media.mjs <harvest.json>');
  process.exit(1);
}

const harvest = JSON.parse(await readFile(harvestPath, 'utf8'));
await mkdir(OUT_DIR, { recursive: true });

const manifest = {};
let posters = 0, videos = 0, failed = 0;

for (const item of harvest) {
  const { code, poster, video, caption } = item;
  if (!code || !poster) { failed++; continue; }

  const jpg = path.join(OUT_DIR, `${code}.jpg`);
  try {
    await download(poster, jpg);
    const dim = await dimensions(jpg);
    if (!dim) throw new Error('unreadable jpeg');
    manifest[code] = { w: dim.w, h: dim.h };
    posters++;
  } catch (err) {
    console.warn(`poster ${code}: ${err.message}`);
    failed++;
    continue;
  }

  if (video) {
    try {
      await download(video, path.join(OUT_DIR, `${code}.mp4`));
      manifest[code].video = true;
      videos++;
    } catch (err) {
      console.warn(`video ${code}: ${err.message}`);
    }
  }

  if (caption) {
    const text = trimHashtagWall(caption);
    if (text) manifest[code].caption = text;
  }
}

const source = await readFile(MANIFEST, 'utf8');
const body = Object.entries(manifest)
  .map(([code, m]) => `  ${JSON.stringify(code)}: ${JSON.stringify(m)},`)
  .join('\n');
const next = source.replace(
  /export const INSPIRATION_MEDIA: Record<string, InspirationMedia> = \{[\s\S]*?\n\};/,
  `export const INSPIRATION_MEDIA: Record<string, InspirationMedia> = {\n${body}\n};`
);
if (next === source) throw new Error('could not find the manifest block to replace');
await writeFile(MANIFEST, next);

console.log(`posters ${posters}, videos ${videos}, skipped ${failed}`);
console.log(`files in ${path.relative(ROOT, OUT_DIR)} — copy them to the server's media dir`);
