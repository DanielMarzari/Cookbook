import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { getDb } from '@/lib/db';
import { assertSafeUrl, FETCH_TIMEOUT_MS } from '@/lib/safe-url';

/**
 * What a pasted link is, so it can be drawn as a card instead of printed as an
 * address.
 *
 * Returns the site and the page's title, nothing else — no images, no
 * descriptions rendered anywhere, no tracking of what was opened. The card only
 * needs enough to be worth clicking.
 *
 * Fetched once per link and cached. A link in a recipe's notes gets looked at
 * every time that recipe is opened, and hitting someone's server each time to
 * re-read a <title> that has not changed is both slow here and rude there.
 * Failures are cached too, for a shorter spell: a dead link should go quiet,
 * not retry forever.
 *
 * GET ?url=https://…
 */

const OK_TTL_DAYS = 30;
const FAIL_TTL_HOURS = 12;
// Titles are a line of text in a card, not a document. Anything longer than
// this is a page that put its whole first paragraph in the <title>.
const MAX_TITLE = 160;
// Enough bytes for <head>. A recipe blog's body can run to megabytes and none
// of it matters here.
const MAX_BYTES = 400_000;

interface Preview {
  url: string;
  ok: boolean;
  title: string | null;
  site_name: string | null;
}

const clean = (s: string | undefined | null): string | null => {
  if (!s) return null;
  const t = s.replace(/\s+/g, ' ').trim();
  if (!t) return null;
  return t.length > MAX_TITLE ? `${t.slice(0, MAX_TITLE - 1).trimEnd()}…` : t;
};

/**
 * Sites put the brand in the <title> — "Perfect Pizza Dough | Serious Eats".
 * The card already names the site on its own line, so printing it twice wastes
 * the only line the title gets.
 */
function stripSiteSuffix(title: string, site: string | null, host: string): string {
  // The site can be named three ways and the title may use any of them:
  // og:site_name ("Serious Eats"), the host (seriouseats.com), or just the
  // brand out of the middle of the host — which is the one Wikipedia uses,
  // since "Sourdough - Wikipedia" is served from en.wikipedia.org.
  const labels = host.split('.');
  const brand = labels.length >= 2 ? labels[labels.length - 2] : host;
  const candidates = [site, host, brand].filter((c): c is string => Boolean(c));

  let out = title;
  for (const c of candidates) {
    const escaped = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const trimmed = out.replace(new RegExp(`\\s*[|·—–\\-:]\\s*${escaped}\\s*$`, 'i'), '').trim();
    if (trimmed && trimmed !== out) return trimmed;
  }
  return out;
}

async function fetchPreview(url: string, host: string): Promise<Preview> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        // The same string the recipe importer sends. A bot-shaped User-Agent
        // gets a 403 from most recipe sites, and the point of the card is the
        // title. Generic on purpose — it says nothing about who is running it,
        // because a link in a private cookbook shouldn't announce its owner.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    if (!res.ok) return { url, ok: false, title: null, site_name: null };

    const type = res.headers.get('content-type') || '';
    if (!/text\/html|application\/xhtml/i.test(type)) {
      // A PDF or an image is still a perfectly good link; it just has no title
      // to read. The card falls back to the file name.
      return { url, ok: true, title: null, site_name: host };
    }

    const body = await res.text();
    const $ = cheerio.load(body.length > MAX_BYTES ? body.slice(0, MAX_BYTES) : body);

    const site =
      clean($('meta[property="og:site_name"]').attr('content')) ||
      clean($('meta[name="application-name"]').attr('content')) ||
      host;
    const rawTitle =
      clean($('meta[property="og:title"]').attr('content')) ||
      clean($('meta[name="twitter:title"]').attr('content')) ||
      clean($('title').first().text());

    return {
      url,
      ok: true,
      title: rawTitle ? stripSiteSuffix(rawTitle, site, host) : null,
      site_name: site,
    };
  } catch {
    return { url, ok: false, title: null, site_name: null };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url') || '';
  if (!raw) return NextResponse.json({ error: 'A url is required' }, { status: 400 });

  let parsed: URL;
  try {
    parsed = assertSafeUrl(raw);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Bad URL' }, { status: 400 });
  }

  const host = parsed.hostname.replace(/^www\./, '');
  const key = parsed.toString();

  try {
    const db = getDb();
    const now = new Date();

    const cached = db
      .prepare('SELECT url, ok, title, site_name, expires_at FROM link_previews WHERE url = ?')
      .get(key) as { url: string; ok: number; title: string | null; site_name: string | null; expires_at: string } | undefined;

    if (cached && cached.expires_at > now.toISOString()) {
      return NextResponse.json({
        url: cached.url,
        ok: Boolean(cached.ok),
        title: cached.title,
        site_name: cached.site_name || host,
        cached: true,
      });
    }

    const preview = await fetchPreview(key, host);
    const ttlMs = preview.ok ? OK_TTL_DAYS * 86400_000 : FAIL_TTL_HOURS * 3600_000;
    db.prepare(
      `INSERT INTO link_previews (url, ok, title, site_name, description, fetched_at, expires_at)
       VALUES (?, ?, ?, ?, NULL, ?, ?)
       ON CONFLICT(url) DO UPDATE SET
         ok = excluded.ok, title = excluded.title, site_name = excluded.site_name,
         fetched_at = excluded.fetched_at, expires_at = excluded.expires_at`,
    ).run(
      key,
      preview.ok ? 1 : 0,
      preview.title,
      preview.site_name,
      now.toISOString(),
      new Date(now.getTime() + ttlMs).toISOString(),
    );

    return NextResponse.json({ ...preview, site_name: preview.site_name || host, cached: false });
  } catch (error) {
    console.error('Error previewing link:', error);
    // The card can still draw itself from the URL alone, so a failure here is
    // not worth an error state on the page.
    return NextResponse.json({ url: key, ok: false, title: null, site_name: host });
  }
}
