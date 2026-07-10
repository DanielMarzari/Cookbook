'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * A thumbnail grid of recipe photos with a full-screen lightbox. Photos can be
 * any aspect ratio: thumbnails crop to squares, the lightbox shows them whole
 * (object-contain). Keyboard: Esc closes, ← / → navigate.
 */
export default function PhotoGallery({ images, title }: { images: string[]; title?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setOpenIndex(i)}
            className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            aria-label={`Open photo ${i + 1}`}
          >
            <Image
              src={src}
              alt={title ? `${title} photo ${i + 1}` : `Photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 33vw, 200px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 md:left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 md:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                aria-label="Next photo"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Wrapper stops backdrop-close when interacting with the image itself. */}
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element -- lightbox needs intrinsic sizing / object-contain for arbitrary aspect ratios */}
            <img
              src={images[openIndex]}
              alt={title ? `${title} photo ${openIndex + 1}` : `Photo ${openIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {images.length > 1 && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/40 px-2 py-0.5 rounded-full">
                {openIndex + 1} / {images.length}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
