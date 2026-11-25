'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * A pasted link, drawn as something worth clicking.
 *
 * A bare URL in a set of notes is forty characters of punctuation that you have
 * to read like a word to find out where it goes. The card says the two things
 * that actually decide whether you click: which site it is, and what the page
 * is called.
 *
 * It draws immediately from the URL alone — the host, and the last path segment
 * turned back into words — and then quietly upgrades to the page's real title
 * when the preview lands. So it is never empty, never shifts layout, and works
 * the same when the site is down or the link is dead.
 */

/** "/recipes/perfect-pizza-dough" → "Perfect Pizza Dough" */
export function labelFromUrl(href: string): string | null {
  try {
    const u = new URL(href);
    const segments = u.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (!last) return null;
    const words = decodeURIComponent(last)
      // drop a file extension, and the id-ish tail a CMS bolts on
      .replace(/\.(html?|php|aspx?|pdf)$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!words || /^\d+$/.test(words)) return null;
    return words.replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return null;
  }
}

export function hostOf(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

interface Preview {
  ok: boolean;
  title: string | null;
  site_name: string | null;
}

// One request per URL per page, shared between cards that point at the same
// link, and kept for the life of the tab.
const cache = new Map<string, Promise<Preview | null>>();

function load(href: string): Promise<Preview | null> {
  const hit = cache.get(href);
  if (hit) return hit;
  const p = fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  cache.set(href, p);
  return p;
}

export default function LinkCard({ href }: { href: string }) {
  const [preview, setPreview] = useState<Preview | null>(null);

  useEffect(() => {
    let live = true;
    load(href).then((p) => { if (live && p) setPreview(p); });
    return () => { live = false; };
  }, [href]);

  const host = preview?.site_name || hostOf(href);
  const title = preview?.title || labelFromUrl(href) || hostOf(href);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start justify-between gap-5 border border-border px-4 py-3.5
                 no-underline hover:border-text transition-colors"
    >
      <span className="min-w-0">
        <span className="block text-[10.5px] uppercase tracking-[0.13em] text-text-secondary">
          {host}
        </span>
        <span className="block text-[14.5px] leading-[1.4] text-text mt-1 break-words">
          {title}
        </span>
      </span>
      <ArrowUpRight
        size={15}
        strokeWidth={1.8}
        aria-hidden
        className="shrink-0 mt-[2px] text-text-secondary group-hover:text-text transition-colors"
      />
    </a>
  );
}
