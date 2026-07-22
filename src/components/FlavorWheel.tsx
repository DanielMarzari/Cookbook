'use client';

import { useMemo } from 'react';

// One hue per flavour family (the spectrum around the wheel). The colour IS the
// data here, so this is the one place the flavour section leaves monochrome.
const FAMILY_COLORS: Record<string, string> = {
  Sweet: '#4E7FA6', Acidic: '#6E6FA8', Floral: '#9166A6', Herbal: '#A85C82',
  Vegetal: '#C2546A', Spice: '#CE6A4A', Woody: '#D2954C', Earthy: '#C6A24A',
  Maillard: '#7FA968', Carnal: '#5DA48D',
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
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

interface Props {
  families: string[];
  vocabulary: Record<string, string[]>;
  activeByFamily: Record<string, { note: string; intensity: number }[]>;
  activeCount: number;
  mode: 'key' | 'all';
  size?: number;
}

export default function FlavorWheel({ families, vocabulary, activeByFamily, activeCount, mode, size = 820 }: Props) {
  const { paths, texts } = useMemo(() => {
    const S = size, cx = S / 2, cy = S / 2;
    const ri = S * 0.115, ro = S * 0.175, barMax = S * 0.135, pad = S * 0.006;
    const paths: React.ReactNode[] = [];
    const texts: React.ReactNode[] = [];

    // notes to draw per family
    const perFam = families.map((fam) => {
      const act = new Map((activeByFamily[fam] || []).map((n) => [n.note, n.intensity]));
      let names: string[];
      if (mode === 'all') names = Array.from(new Set([...(vocabulary[fam] || []), ...act.keys()]));
      else names = Array.from(act.keys());
      return { fam, color: FAMILY_COLORS[fam] || '#999', notes: names.map((n) => ({ note: n, v: act.get(n) || 0 })) };
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
      const mid = (a0 + a1) / 2;
      const [lx, ly] = pol(cx, cy, (ri + ro) / 2, mid);
      let rot = mid; if (mid > 90 && mid < 270) rot -= 180;
      texts.push(
        <text key={`fl${k}`} x={lx} y={ly} fill="#fff" fontSize={S * 0.0135} fontWeight={600}
          textAnchor="middle" dominantBaseline="middle" transform={`rotate(${rot} ${lx} ${ly})`}>
          {f.fam.toUpperCase()}
        </text>
      );

      const nStep = (a1 - a0) / f.notes.length;
      f.notes.forEach((n, i) => {
        const na0 = a0 + i * nStep, na1 = a0 + (i + 1) * nStep, nmid = (na0 + na1) / 2;
        if (n.v > 0) {
          const rr = ro + (n.v / 10) * barMax;
          paths.push(<path key={`n${k}_${i}`} d={wedge(cx, cy, ro + 1, rr, na0 + nStep * 0.12, na1 - nStep * 0.12)} fill={f.color} />);
        }
        const [tx, ty] = pol(cx, cy, ro + barMax + pad + 2, nmid);
        let lr = nmid - 90, anchor: 'start' | 'end' = 'start';
        if (nmid > 180) { lr = nmid + 90; anchor = 'end'; }
        texts.push(
          <text key={`nl${k}_${i}`} x={tx} y={ty} fontSize={S * 0.0125}
            fill={n.v > 0 ? f.color : '#c3bdb0'} fontWeight={n.v > 0 ? 700 : 400}
            textAnchor={anchor} dominantBaseline="middle" transform={`rotate(${lr} ${tx} ${ty})`}>
            {cap(n.note)}
          </text>
        );
      });
      k++;
    }
    return { paths, texts };
  }, [families, vocabulary, activeByFamily, mode, size]);

  const S = size, c = S / 2;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full" role="img" aria-label="Flavour wheel">
      {paths}
      {texts}
      <circle cx={c} cy={c} r={S * 0.115 - 3} fill="#fff" stroke="#e8e8e8" strokeWidth={1} />
      <text x={c} y={c - 4} textAnchor="middle" fontSize={S * 0.05} fontWeight={400} fill="#141310" style={{ fontFamily: 'Georgia, serif' }}>{activeCount}</text>
      <text x={c} y={c + S * 0.03} textAnchor="middle" fontSize={S * 0.016} fill="#767676" letterSpacing="1">ACTIVE NOTES</text>
    </svg>
  );
}
