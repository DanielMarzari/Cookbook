'use client';

import Image from 'next/image';
import { framingStyle } from '@/lib/image';

export interface VariationThumb {
  id: string;
  title: string;
  image_url: string | null;
  variation_of_label: string | null;
}

interface Props {
  base: { title: string; image_url?: string; image_position?: string; image_zoom?: number; image_rotation?: number };
  variations: VariationThumb[];
}

const MAX_THUMBS = 4;

/**
 * A branched recipe's photo, inside the ordinary 4:5 card frame. A base with
 * variations doesn't get a bigger or differently shaped tile — the frame is
 * identical to every other card. What changes is inside it: the photo splits
 * into a dominant lead panel and a narrow strip of variation thumbs, divided by
 * 2px white gutters that read as a physical seam rather than a drawn border.
 *
 * Deliberately colourless. The whole indicator vocabulary is hairlines and
 * greyscale, matching the rest of the app — the geometry does the talking.
 */
export default function BranchCollage({ base, variations }: Props) {
  const thumbs = variations.slice(0, MAX_THUMBS);
  const overflow = variations.length - thumbs.length;

  const photo = (
    src: string | null | undefined,
    alt: string,
    framing?: Parameters<typeof framingStyle>[0],
    sizes = '33vw'
  ) =>
    src ? (
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={framing ? framingStyle(framing) : undefined} />
    ) : (
      <span className="absolute inset-0 bg-[#F4F4F4]" />
    );

  return (
    <div className="absolute inset-0 grid gap-[2px] bg-white" style={{ gridTemplateColumns: '75.65% 1fr', gridTemplateRows: 'repeat(4, 1fr)' }}>
      {/* the base, spanning the full height of the frame */}
      <div className="relative overflow-hidden bg-[#F4F4F4]" style={{ gridColumn: 1, gridRow: '1 / 5' }}>
        {photo(base.image_url, base.title, base, '(max-width: 560px) 76vw, 25vw')}
      </div>

      {thumbs.map((v, i) => (
        <div key={v.id} className="relative overflow-hidden bg-[#F4F4F4]" style={{ gridColumn: 2, gridRow: i + 1 }}>
          {photo(v.image_url, v.title, undefined, '10vw')}
          {/* the last visible thumb absorbs the count when there are more */}
          {overflow > 0 && i === thumbs.length - 1 && (
            <span className="absolute inset-0 grid place-items-center bg-white/75 text-[10px] tracking-[0.1em] text-text">
              +{overflow}
            </span>
          )}
        </div>
      ))}
      {/* keep the strip's rhythm when a base has fewer than four variations */}
      {Array.from({ length: Math.max(0, MAX_THUMBS - thumbs.length) }).map((_, i) => (
        <div key={`pad-${i}`} className="bg-[#F4F4F4]" style={{ gridColumn: 2, gridRow: thumbs.length + i + 1 }} />
      ))}
    </div>
  );
}

/** The tick rule under a branched tile: one mark per version, base first. */
export function BranchTicks({ count }: { count: number }) {
  return (
    <div className="grid gap-[5px] mt-[7px]" style={{ gridTemplateColumns: `repeat(${count + 1}, 1fr)` }} aria-hidden="true">
      {Array.from({ length: count + 1 }).map((_, i) => (
        <i key={i} className={`block h-px ${i === 0 ? 'bg-text' : 'bg-border'}`} />
      ))}
    </div>
  );
}
