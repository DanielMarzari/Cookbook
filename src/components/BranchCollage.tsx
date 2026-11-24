'use client';

import Image from 'next/image';
import { framingStyle } from '@/lib/image';

export interface VariationThumb {
  id: string;
  title: string;
  image_url: string | null;
  variation_of_label: string | null;
}

type Framing = Parameters<typeof framingStyle>[0];

interface Base {
  title: string;
  image_url?: string;
  image_position?: string;
  image_zoom?: number;
  image_rotation?: number;
}

export interface Pane {
  id: string;
  title: string;
  src: string;
  framing?: Framing;
}

const MAX_PANES = 9;

/**
 * The panes a family's tile actually divides into — which is NOT one per
 * version.
 *
 * Two rules, both of them about not lying with geometry:
 *
 * A pane needs a photograph. A variation inherits the base's picture unless it
 * has one of its own, and plenty of recipes have no picture at all, so a pane
 * per version would mean grey rectangles standing in for versions that were
 * never photographed.
 *
 * And the same photograph is one pane. Ten biscotti variations sharing one
 * picture used to be drawn as a 3x3 of that identical picture with white seams
 * through it, which reads as a printing fault rather than as a family. Dividing
 * the frame should mean "these look different"; when they don't look different,
 * the frame stays whole.
 */
export function familyPanes(base: Base, variations: VariationThumb[]): Pane[] {
  const baseFraming: Framing = {
    image_position: base.image_position,
    image_zoom: base.image_zoom,
    image_rotation: base.image_rotation,
  } as Framing;

  const candidates: Pane[] = [];
  if (base.image_url) {
    candidates.push({ id: '__base__', title: base.title, src: base.image_url, framing: baseFraming });
  }
  for (const v of variations) {
    // A variation with no photo of its own is showing the base's, so it is not
    // a second picture — it is the same one, and already counted above.
    const src = v.image_url || base.image_url;
    if (!src) continue;
    candidates.push({
      id: v.id,
      title: v.title,
      src,
      // Framing describes an image. A branch showing the base's photo is showing
      // the base's crop of it too.
      framing: v.image_url ? undefined : baseFraming,
    });
  }

  const seen = new Set<string>();
  const panes: Pane[] = [];
  for (const p of candidates) {
    if (seen.has(p.src)) continue;
    seen.add(p.src);
    panes.push(p);
  }
  return panes;
}

/**
 * How a family divides its frame, by how many DIFFERENT photographs it has.
 *
 * Every layout here fills exactly the number of panes it is given — the old
 * table stopped describing cells past the fifth, so a family with six or more
 * pictures had its last panes auto-flow into rows nobody designed, which is why
 * nine photographs did not come out as a nine-grid.
 *
 * The geometry follows the count rather than being one fixed shape: two split
 * down the middle, three are vertical bands, four is a window pane. Past that
 * the base takes a dominant panel or a leading band, because by then equal panes
 * are too small to read.
 */
function layoutFor(count: number): { style: React.CSSProperties; areas: React.CSSProperties[] } {
  const at = (gridColumn: string, gridRow: string): React.CSSProperties => ({ gridColumn, gridRow });
  const fill = (cols: number, rows: number): React.CSSProperties[] => {
    const out: React.CSSProperties[] = [];
    for (let r = 1; r <= rows; r++) for (let c = 1; c <= cols; c++) out.push(at(String(c), String(r)));
    return out;
  };

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
      return { style: { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }, areas: fill(2, 2) };
    case 5: // base leads, four stacked beside it
      return {
        style: { gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'repeat(4, 1fr)' },
        areas: [at('1', '1 / 5'), at('2', '1'), at('2', '2'), at('2', '3'), at('2', '4')],
      };
    case 6:
      return {
        style: { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr' },
        areas: fill(3, 2),
      };
    case 7: // base as a band across the top, six beneath
      return {
        style: { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1.25fr 1fr 1fr' },
        areas: [at('1 / 4', '1'), ...fill(3, 3).slice(3)],
      };
    case 8: // base takes two thirds of the top row
      return {
        style: { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1.25fr 1fr 1fr' },
        areas: [at('1 / 3', '1'), at('3', '1'), ...fill(3, 3).slice(3)],
      };
    default: // 9
      return {
        style: { gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr' },
        areas: fill(3, 3),
      };
  }
}

/**
 * A branched recipe's photo, inside the ordinary 4:5 card frame. A base with
 * variations doesn't get a bigger or differently shaped tile — the frame is
 * identical to every other card. What changes is inside it: the photo divides
 * into one pane per distinct picture, separated by 2px white gutters that read
 * as a physical seam rather than a drawn border. One picture means one
 * undivided photograph, exactly like an unbranched recipe.
 *
 * Deliberately colourless. The whole indicator vocabulary is hairlines and
 * greyscale, matching the rest of the app — the geometry does the talking.
 */
export default function BranchCollage({ base, variations }: { base: Base; variations: VariationThumb[] }) {
  const panes = familyPanes(base, variations);
  if (panes.length === 0) return null;

  const shown = panes.slice(0, MAX_PANES);
  const overflow = panes.length - shown.length;
  const { style, areas } = layoutFor(shown.length);

  return (
    <div className="absolute inset-0 grid gap-[2px] bg-white" style={style}>
      {shown.map((p, i) => (
        <div key={p.id} className="relative overflow-hidden bg-[#F4F4F4]" style={areas[i]}>
          <Image
            src={p.src}
            alt={p.title}
            fill
            sizes={i === 0 ? '(max-width: 560px) 100vw, 25vw' : '12vw'}
            className="object-cover"
            style={p.framing ? framingStyle(p.framing) : undefined}
          />
          {overflow > 0 && i === shown.length - 1 && (
            <span className="absolute inset-0 grid place-items-center bg-white/75 text-[10px] tracking-[0.1em] text-text">
              +{overflow}
            </span>
          )}
        </div>
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
