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

const MAX_PANES = 6;

/**
 * How a family divides its frame, by how many versions there are.
 *
 * A fixed lead-plus-strip looked wrong for small families — two versions got one
 * big panel and three empty cells. So the geometry follows the count: two split
 * down the middle, three are vertical bands, four is a window pane. Only past
 * that does the base take a dominant panel with the rest as a strip, because by
 * then equal panes would be too small to read.
 */
function layoutFor(count: number): { style: React.CSSProperties; areas: React.CSSProperties[] } {
  const at = (gridColumn: string, gridRow: string): React.CSSProperties => ({ gridColumn, gridRow });
  switch (count) {
    case 1:
      return { style: { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }, areas: [at('1', '1')] };
    case 2: // halves
      return {
        style: { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' },
        areas: [at('1', '1'), at('2', '1')],
      };
    case 3: // three vertical bands
      return {
        style: { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr' },
        areas: [at('1', '1'), at('2', '1'), at('3', '1')],
      };
    case 4: // window pane
      return {
        style: { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' },
        areas: [at('1', '1'), at('2', '1'), at('1', '2'), at('2', '2')],
      };
    case 5: // base leads, four stacked beside it
      return {
        style: { gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'repeat(4, 1fr)' },
        areas: [at('1', '1 / 5'), at('2', '1'), at('2', '2'), at('2', '3'), at('2', '4')],
      };
    default: // 6+: base leads a 2x2 of the rest
      return {
        style: { gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '1fr 1fr' },
        areas: [at('1', '1 / 3'), at('2', '1'), at('3', '1'), at('2', '2'), at('3', '2')],
      };
  }
}

/**
 * A branched recipe's photo, inside the ordinary 4:5 card frame. A base with
 * variations doesn't get a bigger or differently shaped tile — the frame is
 * identical to every other card. What changes is inside it: the photo divides
 * into one pane per version, separated by 2px white gutters that read as a
 * physical seam rather than a drawn border.
 *
 * Deliberately colourless. The whole indicator vocabulary is hairlines and
 * greyscale, matching the rest of the app — the geometry does the talking.
 */
export default function BranchCollage({ base, variations }: Props) {
  // The base is the first pane; its variations fill the rest.
  const panes = [
    { id: '__base__', title: base.title, image_url: base.image_url ?? null, framing: base as Parameters<typeof framingStyle>[0] | undefined },
    ...variations.map((v) => ({ id: v.id, title: v.title, image_url: v.image_url, framing: undefined })),
  ];
  const shown = panes.slice(0, MAX_PANES);
  const overflow = panes.length - shown.length;
  const { style, areas } = layoutFor(shown.length);

  return (
    <div className="absolute inset-0 grid gap-[2px] bg-white" style={style}>
      {shown.map((p, i) => {
        // a variation without its own photo shows the family's
        const src = p.image_url || base.image_url;
        return (
          <div key={p.id} className="relative overflow-hidden bg-[#F4F4F4]" style={areas[i]}>
            {src && (
              <Image
                src={src}
                alt={p.title}
                fill
                sizes={i === 0 ? '(max-width: 560px) 100vw, 25vw' : '12vw'}
                className="object-cover"
                style={p.framing ? framingStyle(p.framing) : undefined}
              />
            )}
            {overflow > 0 && i === shown.length - 1 && (
              <span className="absolute inset-0 grid place-items-center bg-white/75 text-[10px] tracking-[0.1em] text-text">
                +{overflow}
              </span>
            )}
          </div>
        );
      })}
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
