'use client';

import { useMemo } from 'react';
import { FAMILY_COLORS, cap } from '@/lib/flavor';

function pol(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

interface BaseNote { note: string; family: string; intensity: number }
interface Partner { name: string; synergy: number; bridgeFamily: string | null; dominantFamily: string | null }

interface Props {
  baseNotes: BaseNote[];
  partners: Partner[];
  size?: number;
}

// Harmonies as a chord chart: the ingredient's own notes on the left (colored by
// family), its partner ingredients on the right (colored by the family that
// bridges them), and a chord from each partner to the base note it connects
// through — thicker/darker the stronger the synergy.
export default function FlavorChord({ baseNotes, partners, size = 760 }: Props) {
  const { chords, dots, labels } = useMemo(() => {
    const S = size, cx = S / 2, cy = S / 2, R = S * 0.33;
    const bn = baseNotes.slice(0, 11);
    const pt = partners.slice(0, 8);
    const chords: React.ReactNode[] = [];
    const dots: React.ReactNode[] = [];
    const labels: React.ReactNode[] = [];

    // base notes on the left arc (200°→340°), partners on the right (20°→160°)
    const spread = (n: number, lo: number, hi: number) =>
      Array.from({ length: n }, (_, i) => (n === 1 ? (lo + hi) / 2 : lo + (i * (hi - lo)) / (n - 1)));
    const bAng = spread(bn.length, 200, 340);
    const pAng = spread(pt.length, 20, 160);

    const nodePos: Record<number, [number, number]> = {};
    bn.forEach((n, i) => {
      const [x, y] = pol(cx, cy, R, bAng[i]);
      nodePos[i] = [x, y];
      const color = FAMILY_COLORS[n.family] || '#999';
      dots.push(<circle key={`bd${i}`} cx={x} cy={y} r={3} fill={color} />);
      const [tx, ty] = pol(cx, cy, R + 8, bAng[i]);
      labels.push(
        <text key={`bl${i}`} x={tx} y={ty} fontSize={S * 0.0135} fill={color} fontWeight={600}
          textAnchor="end" dominantBaseline="middle" transform={`rotate(${bAng[i] + 90} ${tx} ${ty})`}>{cap(n.note)}</text>
      );
    });

    pt.forEach((p, j) => {
      const [x, y] = pol(cx, cy, R, pAng[j]);
      const fam = p.bridgeFamily || p.dominantFamily;
      const color = fam ? FAMILY_COLORS[fam] || '#A85C82' : '#b8b3a8';
      dots.push(<circle key={`pd${j}`} cx={x} cy={y} r={3.6} fill={color} />);
      const [tx, ty] = pol(cx, cy, R + 8, pAng[j]);
      labels.push(
        <text key={`pl${j}`} x={tx} y={ty} fontSize={S * 0.015} fill="#141310"
          textAnchor="start" dominantBaseline="middle" transform={`rotate(${pAng[j] - 90} ${tx} ${ty})`}>{cap(p.name)}</text>
      );
      // connect to the base note that shares the bridge family (strongest), else base[0]
      let target = 0;
      if (p.bridgeFamily) {
        let best = -1;
        bn.forEach((n, i) => { if (n.family === p.bridgeFamily && (best < 0 || n.intensity > bn[best].intensity)) best = i; });
        if (best >= 0) target = best;
      }
      const [bx, by] = nodePos[target] || [cx, cy];
      const w = 1 + (p.synergy / 100) * 3.5;
      const op = 0.22 + (p.synergy / 100) * 0.55;
      chords.push(
        <path key={`ch${j}`} d={`M${bx} ${by}Q${cx} ${cy} ${x} ${y}`} fill="none" stroke={color} strokeWidth={w} opacity={op} strokeLinecap="round" />
      );
    });

    return { chords, dots, labels };
  }, [baseNotes, partners, size]);

  const S = size;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="w-full" role="img" aria-label="Harmony chord chart">
      {chords}
      {dots}
      {labels}
    </svg>
  );
}
