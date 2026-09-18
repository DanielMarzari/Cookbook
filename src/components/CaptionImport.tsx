'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { permalinkFor, type InspirationPost } from '@/data/inspiration';
import { toast } from '@/lib/toast';

/* Turning a saved post into a recipe means getting at its caption, and the
   caption lives inside Instagram's embed — a cross-origin frame this page is
   not allowed to read, and one Instagram will not serve to the server without
   a logged-in session. So the caption comes across the clipboard: copy it from
   the card, and this hands it to the same parser the paste tab uses. */

type Props = {
  post: InspirationPost | null;
  onClose: () => void;
};

export default function CaptionImport({ post, onClose }: Props) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // Offer whatever is already on the clipboard — the usual case is that the
  // caption was just copied. Permission may be refused; the box still works.
  useEffect(() => {
    if (!post) return;
    let cancelled = false;
    navigator.clipboard
      ?.readText()
      .then((clip) => {
        if (!cancelled && clip.trim().length > 40) setText(clip.trim());
      })
      .catch(() => {})
      .finally(() => areaRef.current?.focus());
    return () => {
      cancelled = true;
    };
  }, [post]);

  // Escape closes, as it does everywhere else.
  useEffect(() => {
    if (!post) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [post, onClose]);

  if (!post) return null;

  const submit = async () => {
    const caption = text.trim();
    if (caption.length < 20) {
      toast.error('That looks too short to be a recipe.');
      return;
    }
    setBusy(true);
    // Hand it to the add-recipe page the way the book scanner does, and let the
    // one parser there do the work.
    sessionStorage.setItem(
      'cookbookInstagram',
      JSON.stringify({
        text: caption,
        user: post.user,
        url: permalinkFor(post),
      })
    );
    router.push('/add-recipe');
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/30 px-4 py-10"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-white border border-border">
        <div className="flex items-baseline justify-between gap-4 px-5 pt-5 pb-3 border-b border-border">
          <h2 className="text-[19px] tracking-[-0.01em]">Import from the caption</h2>
          <button
            onClick={onClose}
            className="text-[12px] uppercase tracking-[0.12em] text-text-secondary hover:text-text cursor-pointer"
          >
            Close
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-[13.5px] text-text-secondary mb-4 leading-relaxed">
            Instagram keeps the caption inside its own frame, out of this page&apos;s
            reach. Copy it from the card — or{' '}
            <a
              href={permalinkFor(post)}
              target="_blank"
              rel="noreferrer"
              className="text-text underline underline-offset-4 decoration-1"
            >
              open @{post.user}&apos;s post
            </a>{' '}
            — then paste it here and the recipe gets pulled out of it.
          </p>

          <textarea
            ref={areaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste the caption…"
            className="w-full p-3 border border-border focus:border-text text-[14px] leading-relaxed resize-y transition-colors"
          />

          <div className="flex items-center justify-between gap-4 mt-4">
            <span className="text-[12px] text-text-secondary">
              {text.trim() ? `${text.trim().length} characters` : 'Nothing pasted yet'}
            </span>
            <button
              onClick={submit}
              disabled={busy || text.trim().length < 20}
              className="px-4 py-2 border border-text text-[13px] text-text hover:bg-text hover:text-white disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-text transition-colors cursor-pointer"
            >
              {busy ? 'Reading…' : 'Pull out the recipe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
