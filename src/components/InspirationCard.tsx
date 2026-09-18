'use client';

import { useState } from 'react';
import InstagramEmbed from '@/components/InstagramEmbed';
import { permalinkFor, type InspirationPost } from '@/data/inspiration';
import { mediaFor, posterPath, videoPath } from '@/data/inspiration-media';

/* A card built from our own copies. Falls back to Instagram's embed for any
   post we haven't stored yet, so the wall works the whole way through the
   sync rather than only at the end of it. */

// How much caption shows before it asks to be opened.
const CAPTION_CLAMP = 260;

type Props = {
  post: InspirationPost;
  onImport?: (post: InspirationPost) => void;
};

export default function InspirationCard({ post, onImport }: Props) {
  const media = mediaFor(post.code);
  const [open, setOpen] = useState(false);

  if (!media) return <InstagramEmbed post={post} onImport={onImport} />;

  const caption = media.caption?.trim() ?? '';
  const long = caption.length > CAPTION_CLAMP;
  const shown = open || !long ? caption : caption.slice(0, CAPTION_CLAMP).trimEnd() + '…';

  return (
    <figure className="border border-border bg-white">
      <div
        className="relative bg-[#fafafa]"
        style={{ aspectRatio: `${media.w} / ${media.h}` }}
      >
        {media.video ? (
          <video
            controls
            preload="none"
            playsInline
            poster={posterPath(post.code)}
            src={videoPath(post.code)}
            className="absolute inset-0 w-full h-full object-cover bg-black"
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterPath(post.code)}
              alt={`Saved from @${post.user}`}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* No file for this one — Instagram withholds the media on reels
                carrying a licensed track — so the frame is the whole of it. */}
            {post.kind === 'reel' && (
              <a
                href={permalinkFor(post)}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex items-end justify-center pb-4 group"
              >
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur text-[11px] uppercase tracking-[0.12em] text-text opacity-0 group-hover:opacity-100 transition-opacity">
                  Watch on Instagram ↗
                </span>
              </a>
            )}
          </>
        )}
      </div>

      {caption && (
        <div className="px-3 pt-3 text-[13px] leading-relaxed text-text whitespace-pre-line">
          {shown}
          {long && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="block mt-1.5 text-[12px] text-text-secondary hover:text-text underline underline-offset-4 decoration-1 cursor-pointer"
            >
              {open ? 'Less' : 'More'}
            </button>
          )}
        </div>
      )}

      <figcaption className="flex items-baseline justify-between gap-3 px-3 py-2 mt-3 border-t border-border">
        <a
          href={`https://www.instagram.com/${post.user}/`}
          target="_blank"
          rel="noreferrer"
          className="text-[12.5px] text-text hover:underline underline-offset-4 decoration-1 truncate"
        >
          @{post.user}
        </a>
        <span className="flex items-baseline gap-3 shrink-0">
          {onImport && caption && (
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
            ↗
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
