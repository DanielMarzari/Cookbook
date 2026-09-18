'use client';

import { useEffect, useRef, useState } from 'react';
import { embedSrcFor, permalinkFor, type InspirationPost } from '@/data/inspiration';

/* Instagram's /embed/captioned/ document renders a post on its own — no Meta
   embed.js, so no third-party script on the page. The iframe reports its own
   height by postMessage (the same MEASURE message embed.js listens for); until
   it does, we hold a sensible placeholder height so the grid doesn't jump. */

const FALLBACK_HEIGHT: Record<InspirationPost['kind'], number> = {
  reel: 780,
  p: 640,
};

/* The masonry wall wants the natural height — a long caption making a tall card
   is the texture, not a defect. This ceiling is only for the pathological ones
   (a full recipe in the caption runs past 2000px); the rest is a click away. */
const MAX_HEIGHT = 1400;

type Props = {
  post: InspirationPost;
  /** How far outside the viewport to start loading. */
  rootMargin?: string;
  /** Opens the caption importer for this post. */
  onImport?: (post: InspirationPost) => void;
};

export default function InstagramEmbed({ post, rootMargin = '900px', onImport }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(FALLBACK_HEIGHT[post.kind]);
  const [clipped, setClipped] = useState(false);

  // Mount the iframe only once the card is near the viewport.
  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(holder);
    return () => io.disconnect();
  }, [rootMargin]);

  // Take the height the embed measures for itself.
  useEffect(() => {
    if (!visible) return;
    const onMessage = (e: MessageEvent) => {
      if (!/\/\/(www\.)?instagram\.com$/.test(e.origin)) return;
      if (e.source !== frameRef.current?.contentWindow) return;
      let payload: unknown = e.data;
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch {
          return;
        }
      }
      const measured = (payload as { type?: string; details?: { height?: number } } | null);
      if (measured?.type !== 'MEASURE') return;
      const h = Number(measured.details?.height);
      if (!Number.isFinite(h) || h <= 100) return;
      setHeight(Math.min(Math.ceil(h), MAX_HEIGHT));
      setClipped(h > MAX_HEIGHT);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [visible]);

  return (
    <figure ref={holderRef} className="border border-border bg-white">
      <div style={{ height }} className="relative overflow-hidden">
        {visible ? (
          <iframe
            ref={frameRef}
            src={embedSrcFor(post)}
            title={`Instagram post by @${post.user}`}
            loading="lazy"
            scrolling="no"
            allow="encrypted-media; picture-in-picture; clipboard-write"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#fafafa]">
            <span className="text-[12px] text-text-secondary">@{post.user}</span>
          </div>
        )}

        {/* Softens the cut where a long caption runs past the clip */}
        {clipped && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white"
          />
        )}
      </div>

      {/* Attribution and an escape hatch — an embed goes blank if the post is
          deleted or the account turns private, and this line still works. */}
      <figcaption className="flex items-baseline justify-between gap-3 px-3 py-2 border-t border-border">
        <a
          href={`https://www.instagram.com/${post.user}/`}
          target="_blank"
          rel="noreferrer"
          className="text-[12.5px] text-text hover:underline underline-offset-4 decoration-1 truncate"
        >
          @{post.user}
        </a>
        <span className="flex items-baseline gap-3 shrink-0">
          {onImport && (
            <button
              onClick={() => onImport(post)}
              className="text-[11px] uppercase tracking-[0.12em] text-text-secondary hover:text-text cursor-pointer"
            >
              Cook it
            </button>
          )}
          <a
            href={permalinkFor(post)}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] uppercase tracking-[0.12em] text-text-secondary hover:text-text"
          >
            {post.kind === 'reel' ? 'Reel' : 'Post'} ↗
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
