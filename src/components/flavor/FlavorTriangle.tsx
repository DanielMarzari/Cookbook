'use client';

// The dish fingerprint: Harmony / Complement / Affinity plotted on three axes.
// The shaded area is the plate's character; the number in the middle is the
// data-driven dish score (its share of a great dish). A "compact" variant drops
// the labels + centre number for small-multiple compare shelves.

type Props = {
  h: number;
  c: number;
  a: number;
  score?: number;
  variant?: 'full' | 'compact';
  className?: string;
};

// Fixed drawing space; the <svg> scales to its box. Three axes 120° apart:
// Harmony up, Complement lower-right, Affinity lower-left.
const CX = 130;
const CY = 116;
const R = 74;
const AXES = [
  { key: 'h' as const, label: 'Harmony', angle: -90 },
  { key: 'c' as const, label: 'Complement', angle: 30 },
  { key: 'a' as const, label: 'Affinity', angle: 150 },
];

function pt(r: number, angleDeg: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
}
const poly = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

export default function FlavorTriangle({ h, c, a, score, variant = 'full', className }: Props) {
  const vals: Record<'h' | 'c' | 'a', number> = { h, c, a };
  const compact = variant === 'compact';

  const outer = AXES.map((ax) => pt(R, ax.angle));
  const mid = AXES.map((ax) => pt(R * 0.5, ax.angle));
  const data = AXES.map((ax) => pt((Math.max(0, Math.min(100, vals[ax.key])) / 100) * R, ax.angle));

  return (
    <svg viewBox={compact ? '52 34 156 128' : '0 0 260 206'} className={className} width="100%" role="img"
      aria-label={`Harmony ${h}, Complement ${c}, Affinity ${a}${score != null ? `, score ${score}` : ''}`}>
      {/* gridlines: the 100 boundary (a great dish) + a faint 50 ring */}
      <polygon points={poly(outer)} fill="none" stroke="#dcdad4" strokeWidth={1} />
      {!compact && <polygon points={poly(mid)} fill="none" stroke="#ecebe6" strokeWidth={1} />}
      {AXES.map((ax, i) => (
        <line key={ax.key} x1={CX} y1={CY} x2={outer[i][0]} y2={outer[i][1]} stroke="#ecebe6" strokeWidth={1} />
      ))}

      {/* the fingerprint */}
      <polygon points={poly(data)} fill="#14131018" stroke="#141310" strokeWidth={compact ? 1.5 : 2} strokeLinejoin="round" />
      {!compact && data.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill="#141310" />)}

      {/* axis labels + values (full only) — centred on each tip so nothing clips */}
      {!compact && (
        <g fontFamily="Helvetica, Arial, sans-serif" textAnchor="middle">
          <text x={CX} y={20} fontSize={12} fontWeight={600} fill="#141310">{h}</text>
          <text x={CX} y={32} fontSize={11.5} fill="#6b6a66">Harmony</text>
          <text x={outer[1][0]} y={outer[1][1] + 17} fontSize={11.5} fill="#6b6a66">Complement</text>
          <text x={outer[1][0]} y={outer[1][1] + 31} fontSize={12} fontWeight={600} fill="#141310">{c}</text>
          <text x={outer[2][0]} y={outer[2][1] + 17} fontSize={11.5} fill="#6b6a66">Affinity</text>
          <text x={outer[2][0]} y={outer[2][1] + 31} fontSize={12} fontWeight={600} fill="#141310">{a}</text>
        </g>
      )}

      {/* centre score */}
      {score != null && !compact && (
        <g fontFamily="Helvetica, Arial, sans-serif" textAnchor="middle">
          <text x={CX} y={CY + 4} fontSize={38} fontWeight={500} fill="#141310" letterSpacing="-0.02em">{score}</text>
          <text x={CX} y={CY + 20} fontSize={9.5} fill="#6b6a66" letterSpacing="0.08em">/ 100</text>
        </g>
      )}
    </svg>
  );
}
