'use client';

import { useMemo } from 'react';
import { FAMILY_COLORS, cap } from '@/lib/flavor';

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
  vocabulary?: Record<string, string[]>;
  aByFamily: ByFam;
  bByFamily: ByFam;
  mode?: 'key' | 'all';
  size?: number;
}

// Two profiles overlaid on one wheel: A solid, B outlined, with note labels.
// `key` shows only notes either carries; `all` adds the faint dormant ring.
export default function FlavorOverlayWheel({ families, vocabulary = {}, aByFamily, bByFamily, mode = 'all', size = 640 }: Props) {
  const { paths, texts } = useMemo(() => {
    const S = size, cx = S / 2, cy = S / 2;
    const ri = S * 0.11, ro = S * 0.17, barMax = S * 0.13, pad = S * 0.006;
    const paths: React.ReactNode[] = [];
    const texts: React.ReactNode[] = [];

    const perFam = families.map((fam) => {
      const a = new Map((aByFamily[fam] || []).map((n) => [n.note, n.intensity]));
      const b = new Map((bByFamily[fam] || []).map((n) => [n.note, n.intensity]));
      let names: string[];
      if (mode === 'all') names = Array.from(new Set([...(vocabulary[fam] || []), ...a.keys(), ...b.keys()]));
      else names = Array.from(new Set([...a.keys(), ...b.keys()]));
      return { fam, color: FAMILY_COLORS[fam] || '#999', notes: names.map((n) => ({ note: n, a: a.get(n) || 0, b: b.get(n) || 0 })) };
    });

    const drawFams = mode === 'all' ? perFam : perFam.filter((f) => f.notes.length > 0);
    const BASE = 3;
    const M = drawFams.reduce((s, f) => s + f.notes.length + BASE, 0) || 1;
    const gap = 1.1;
    let cursor = 0, k = 0;

    for (const f of drawFams) {
      const span = ((f.notes.length + BASE) / M) * 360;
      const a0 = cursor + gap / 2, a1 = cursor + span - gap / 2;
      cursor += span;

      paths.push(<path key={`b${k}`} d={wedge(cx, cy, ri, ro, a0, a1)} fill={f.color} />);
      const mid = (a0 + a1) / 2; const [lx, ly] = pol(cx, cy, (ri + ro) / 2, mid);
      let rot = mid; if (mid > 90 && mid < 270) rot -= 180;
      texts.push(<text key={`fl${k}`} x={lx} y={ly} fill="#fff" fontSize={S * 0.0135} fontWeight={600} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${rot} ${lx} ${ly})`}>{f.fam.toUpperCase()}</text>);

      const nStep = f.notes.length ? (a1 - a0) / f.notes.length : 0;
      f.notes.forEach((n, i) => {
        const na0 = a0 + i * nStep, na1 = a0 + (i + 1) * nStep, nmid = (na0 + na1) / 2;
        if (n.a > 0) paths.push(<path key={`a${k}_${i}`} d={wedge(cx, cy, ro + 1, ro + (n.a / 10) * barMax, na0 + nStep * 0.1, nmid - nStep * 0.02)} fill={f.color} />);
        if (n.b > 0) paths.push(<path key={`bo${k}_${i}`} d={wedge(cx, cy, ro + 1, ro + (n.b / 10) * barMax, nmid + nStep * 0.02, na1 - nStep * 0.1)} fill="none" stroke={f.color} strokeWidth={1.4} />);
        const active = n.a > 0 || n.b > 0;
        const [tx, ty] = pol(cx, cy, ro + barMax + pad + 2, nmid);
        let lr = nmid - 90; let anchor: 'start' | 'end' = 'start';
        if (nmid > 180) { lr = nmid + 90; anchor = 'end'; }
        texts.push(
          <text key={`nl${k}_${i}`} x={tx} y={ty} fontSize={S * 0.0125} fill={active ? f.color : '#c3bdb0'} fontWeight={active ? 700 : 400}
            textAnchor={anchor} dominantBaseline="middle" transform={`rotate(${lr} ${tx} ${ty})`}>{cap(n.note)}</text>
        );
      });
      k++;
    }
    return { paths, texts };
  }, [families, vocabulary, aByFamily, bByFamily, mode, size]);

  const S = size, c = S / 2;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full" role="img" aria-label="Overlaid flavour wheels">
      {paths}
      {texts}
      <circle cx={c} cy={c} r={S * 0.11 - 3} fill="#fff" stroke="#e8e8e8" strokeWidth={1} />
    </svg>
  );
}
