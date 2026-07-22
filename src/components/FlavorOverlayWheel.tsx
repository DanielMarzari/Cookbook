'use client';

import { useMemo } from 'react';
import { FAMILY_COLORS } from '@/lib/flavor';

function pol(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function wedge(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const [x0, y0] = pol(cx, cy, r1, a0);
  const [x1, y1] = pol(cx, cy, r1, a1);
  const [x2, y2] = pol(cx, cy, r0, a1);
  const [x3, y3] = pol(cx, cy, r0, a0);
  const lg = a1 - a0 > 180 ? 1 : 0;
  return `M${x0} ${y0}A${r1} ${r1} 0 ${lg} 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 ${lg} 0 ${x3} ${y3}Z`;
}

type ByFam = Record<string, { note: string; intensity: number }[]>;

interface Props {
  families: string[];
  aByFamily: ByFam;
  bByFamily: ByFam;
  size?: number;
}

// Two profiles overlaid on one wheel: A drawn solid, B as an outline. Each note
// slot is split in two so both are always visible — you read where they reinforce
// (both tall) and where they diverge (one tall, one flat).
export default function FlavorOverlayWheel({ families, aByFamily, bByFamily, size = 460 }: Props) {
  const { paths } = useMemo(() => {
    const S = size, cx = S / 2, cy = S / 2;
    const ri = S * 0.13, ro = S * 0.2, barMax = S * 0.17;
    const paths: React.ReactNode[] = [];

    const perFam = families.map((fam) => {
      const a = new Map((aByFamily[fam] || []).map((n) => [n.note, n.intensity]));
      const b = new Map((bByFamily[fam] || []).map((n) => [n.note, n.intensity]));
      const names = Array.from(new Set([...a.keys(), ...b.keys()]));
      return { fam, color: FAMILY_COLORS[fam] || '#999', notes: names.map((n) => ({ note: n, a: a.get(n) || 0, b: b.get(n) || 0 })) };
    });

    const M = perFam.reduce((s, f) => s + Math.max(f.notes.length, 1), 0);
    const gap = 1.1;
    let cursor = 0, k = 0;

    for (const f of perFam) {
      const slots = Math.max(f.notes.length, 1);
      const span = (slots / M) * 360;
      const a0 = cursor + gap / 2, a1 = cursor + span - gap / 2;
      cursor += span;

      paths.push(<path key={`b${k}`} d={wedge(cx, cy, ri, ro, a0, a1)} fill={f.color} />);

      const nStep = (a1 - a0) / f.notes.length;
      f.notes.forEach((n, i) => {
        const na0 = a0 + i * nStep, na1 = a0 + (i + 1) * nStep, nmidPt = (na0 + na1) / 2;
        // A solid in the first half of the slot
        if (n.a > 0) {
          const rr = ro + (n.a / 10) * barMax;
          paths.push(<path key={`a${k}_${i}`} d={wedge(cx, cy, ro + 1, rr, na0 + nStep * 0.1, nmidPt - nStep * 0.02)} fill={f.color} />);
        }
        // B as an outline in the second half
        if (n.b > 0) {
          const rr = ro + (n.b / 10) * barMax;
          paths.push(<path key={`bo${k}_${i}`} d={wedge(cx, cy, ro + 1, rr, nmidPt + nStep * 0.02, na1 - nStep * 0.1)} fill="none" stroke={f.color} strokeWidth={1.4} />);
        }
      });
      k++;
    }
    return { paths };
  }, [families, aByFamily, bByFamily, size]);

  const S = size, c = S / 2;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full" role="img" aria-label="Overlaid flavour wheels">
      {paths}
      <circle cx={c} cy={c} r={S * 0.13 - 3} fill="#fff" stroke="#e8e8e8" strokeWidth={1} />
    </svg>
  );
}
