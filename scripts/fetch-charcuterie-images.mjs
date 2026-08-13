/**
 * Ingredient photography for the charcuterie board, from sources that are
 * actually free to use.
 *
 * Openverse first, filtered to CC0 and public-domain only, then Wikimedia
 * Commons for the items Openverse is thin on (lardo, quince paste, and the rest
 * of the long tail). Nothing is hotlinked — files land in public/charcuterie/items
 * so the board keeps working when someone else's CDN doesn't.
 *
 * Every result carries a confidence score, because a search for "Manchego" will
 * cheerfully return a photograph of a sheep. Anything that scores low is written
 * to review.json rather than silently shipped.
 *
 * Usage: node scripts/fetch-charcuterie-images.mjs [--only=id,id] [--limit=N]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const OUT = join(ROOT, 'public/charcuterie/items');
const DATA = join(ROOT, 'data/charcuterie-images');
mkdirSync(OUT, { recursive: true });
mkdirSync(DATA, { recursive: true });

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith('--only='))?.slice(7).split(',');
const limit = Number(args.find((a) => a.startsWith('--limit='))?.slice(8)) || Infinity;

const items = JSON.parse(readFileSync(join(DATA, 'items.json'), 'utf8'));
const targets = (only ? items.filter((i) => only.includes(i.id)) : items).slice(0, limit);

/** Search terms that do better than the bare item name. A board wants the food
 *  itself on a plain ground, not a landscape of the region it comes from. */
const HINT = {
  cheese: 'cheese wedge food',
  meat: 'cured meat slices food',
  fruit: 'fresh fruit food',
  dried: 'dried fruit food',
  cracker: 'cracker biscuit food',
  spread: 'food in bowl',
  nut: 'nuts food',
  briny: 'olives pickles food',
  sweet: 'food sweet',
  garnish: 'fresh herb',
  veg: 'fresh vegetable',
};

/** Words that mean the search drifted off the food and onto its origin story. */
const OFF_TOPIC = /\b(map|flag|church|castle|portrait|painting|monument|landscape|village|cathedral|sheep|cow|goat|pig|cattle|herd|farm building|logo|coat of arms|stamp|banknote|person|man|woman)\b/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** How much do we believe this image is the thing we asked for? */
function score(item, title, tags = []) {
  const hay = `${title} ${tags.join(' ')}`.toLowerCase();
  const name = item.name.toLowerCase().replace(/[^a-z0-9 ]/g, '');
  let s = 0;
  if (hay.includes(name)) s += 60;
  else {
    const words = name.split(' ').filter((w) => w.length > 3);
    const hit = words.filter((w) => hay.includes(w)).length;
    if (words.length) s += Math.round((hit / words.length) * 45);
  }
  if (hay.includes(item.cat)) s += 15;
  if (/\b(food|dish|plate|bowl|slice|wedge|fresh)\b/.test(hay)) s += 10;
  if (OFF_TOPIC.test(hay)) s -= 45;
  return Math.max(0, Math.min(100, s));
}

/** Openverse ANDs every term, so a descriptive query plus a CC0-only filter
 *  returns nothing at all. Search the bare name and let `score` do the judging. */
async function openverseQuery(q) {
  const url =
    'https://api.openverse.org/v1/images/?' +
    new URLSearchParams({ q, license: 'cc0,pdm', mature: 'false', page_size: '8' });
  const res = await fetch(url, { headers: { 'User-Agent': 'Cookbook/1.0 (personal recipe app)' } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.results ?? [];
}

async function openverse(item) {
  let results = await openverseQuery(item.name);
  if (results.length < 3) {
    // One extra word only — "food" rescues generic names without over-constraining.
    const more = await openverseQuery(`${item.name} food`);
    const seen = new Set(results.map((r) => r.url));
    results = results.concat(more.filter((r) => !seen.has(r.url)));
  }
  return results.map((r) => ({
    url: r.url,
    title: r.title ?? '',
    tags: (r.tags ?? []).map((t) => t.name),
    license: r.license,
    source: 'openverse',
    attribution: r.attribution ?? `${r.title ?? 'Untitled'} (${r.license})`,
    detail: r.foreign_landing_url,
  }));
}

async function commons(item) {
  const q = `${item.name} ${item.cat === 'cheese' || item.cat === 'meat' ? 'food' : ''}`.trim();
  const url =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: `filetype:bitmap ${q}`,
      gsrlimit: '8',
      gsrnamespace: '6',
      prop: 'imageinfo',
      iiprop: 'url|extmetadata',
      iiurlwidth: '800',
      format: 'json',
      origin: '*',
    });
  const res = await fetch(url, { headers: { 'User-Agent': 'Cookbook/1.0 (personal recipe app)' } });
  if (!res.ok) return [];
  const json = await res.json();
  const pages = Object.values(json.query?.pages ?? {});
  return pages
    .map((p) => {
      const info = p.imageinfo?.[0];
      if (!info) return null;
      const meta = info.extmetadata ?? {};
      const lic = (meta.LicenseShortName?.value ?? '').toLowerCase();
      // Commons carries plenty of CC-BY-SA; keep this pass to the genuinely free-and-clear.
      if (!/cc0|public domain|pd-/.test(lic)) return null;
      return {
        url: info.thumburl ?? info.url,
        title: (p.title ?? '').replace(/^File:/, '').replace(/\.[a-z]+$/i, ''),
        tags: [],
        license: meta.LicenseShortName?.value ?? 'PD',
        source: 'commons',
        attribution: `${(p.title ?? '').replace(/^File:/, '')} — Wikimedia Commons (${meta.LicenseShortName?.value ?? 'PD'})`,
        detail: info.descriptionurl,
      };
    })
    .filter(Boolean);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Cookbook/1.0 (personal recipe app)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error('too small');
  writeFileSync(dest, buf);
  return buf.length;
}

const manifest = [];
const review = [];
let done = 0;

for (const item of targets) {
  const raw = join(OUT, `${item.id}.raw`);
  if (existsSync(raw) && existsSync(join(DATA, 'manifest.json'))) {
    // resumable: skip what a previous run already pulled
  }
  let cands = [];
  try {
    cands = await openverse(item);
  } catch {}
  if (cands.length < 2) {
    try {
      cands = cands.concat(await commons(item));
    } catch {}
  }

  const ranked = cands
    .map((c) => ({ ...c, score: score(item, c.title, c.tags) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];

  if (!best) {
    review.push({ ...item, reason: 'no candidate found', score: 0 });
    console.log(`  ✗ ${item.id.padEnd(22)} no candidates`);
  } else {
    // A dead URL shouldn't cost us the item — walk down the ranking instead.
    let bytes = 0;
    let used = null;
    let lastErr = '';
    for (const cand of ranked.slice(0, 4)) {
      try {
        bytes = await download(cand.url, raw);
        used = cand;
        break;
      } catch (e) {
        lastErr = e.message;
      }
    }
    try {
      if (!used) throw new Error(lastErr || 'all candidates failed');
      const best = used;
      const rec = {
        ...item,
        score: best.score,
        title: best.title,
        license: best.license,
        source: best.source,
        attribution: best.attribution,
        detail: best.detail,
        bytes,
        alternates: ranked.slice(1, 4).map((r) => ({ url: r.url, title: r.title, score: r.score })),
      };
      manifest.push(rec);
      // A clean hit scores 75+ (full name + category). Below 70 goes to a human —
      // over-flagging is cheap, a photo of sumo trophies labelled prosciutto is not.
      if (best.score < 70) review.push({ ...rec, reason: `low confidence (${best.score})` });
      console.log(`  ${best.score >= 70 ? '✓' : '?'} ${item.id.padEnd(22)} ${String(best.score).padStart(3)}  ${best.title.slice(0, 48)}`);
    } catch (e) {
      review.push({ ...item, reason: `download failed: ${e.message}`, score: best.score });
      console.log(`  ✗ ${item.id.padEnd(22)} download failed`);
    }
  }

  done++;
  if (done % 25 === 0) {
    writeFileSync(join(DATA, 'manifest.json'), JSON.stringify(manifest, null, 1));
    writeFileSync(join(DATA, 'review.json'), JSON.stringify(review, null, 1));
    console.log(`--- ${done}/${targets.length} (${review.length} to review) ---`);
  }
  await sleep(350); // be a decent citizen to two free APIs
}

writeFileSync(join(DATA, 'manifest.json'), JSON.stringify(manifest, null, 1));
writeFileSync(join(DATA, 'review.json'), JSON.stringify(review, null, 1));
console.log(`\ndone: ${manifest.length} fetched, ${review.length} need review, ${targets.length - manifest.length} missing`);
