'use client';

import { useEffect, useRef, useState } from 'react';

// The dish fingerprint: Harmony / Complement / Affinity plotted on three axes.
// The shaded area is the plate's character; the number in the middle is the
// data-driven dish score (its share of a great dish). Values tween smoothly when
// they change (e.g. adding an ingredient). A "compact" variant drops the labels +
// centre number for small-multiple compare shelves.

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

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

// Tween an array of numbers toward `target` with easeOutCubic; interrupts pick up
// from wherever the current animation is, so rapid edits stay smooth.
function useTween(target: number[], duration = 480) {
  const reduce = usePrefersReducedMotion();
  const [disp, setDisp] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);
  const key = target.join(',');
  useEffect(() => {
    const from = fromRef.current;
    if (reduce || from.every((v, i) => Math.abs(v - target[i]) < 0.5)) {
      setDisp(target);
      fromRef.current = target;
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setDisp(target.map((v, i) => from[i] + (v - from[i]) * e));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else fromRef.current = target;
    };
    rafRef.current = requestAnimationFrame(step);
    // Safety net: if rAF is throttled (tab hidden), still converge to target.
    const settle = setTimeout(() => { setDisp(target); fromRef.current = target; }, duration + 150);
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(settle); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reduce, duration]);
  useEffect(() => { fromRef.current = disp; }, [disp]);
  return disp;
}

export default function FlavorTriangle({ h, c, a, score, variant = 'full', className }: Props) {
  const compact = variant === 'compact';
  const [dh, dc, da, dScore] = useTween([h, c, a, score ?? 0]);
  const vals: Record<'h' | 'c' | 'a', number> = { h: dh, c: dc, a: da };

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
          <text x={CX} y={20} fontSize={12} fontWeight={600} fill="#141310">{Math.round(dh)}</text>
          <text x={CX} y={32} fontSize={11.5} fill="#6b6a66">Harmony</text>
          <text x={outer[1][0]} y={outer[1][1] + 17} fontSize={11.5} fill="#6b6a66">Complement</text>
          <text x={outer[1][0]} y={outer[1][1] + 31} fontSize={12} fontWeight={600} fill="#141310">{Math.round(dc)}</text>
          <text x={outer[2][0]} y={outer[2][1] + 17} fontSize={11.5} fill="#6b6a66">Affinity</text>
          <text x={outer[2][0]} y={outer[2][1] + 31} fontSize={12} fontWeight={600} fill="#141310">{Math.round(da)}</text>
        </g>
      )}

      {/* centre score — white halo (paint-order) keeps it legible over the shape */}
      {score != null && !compact && (
        <g fontFamily="Helvetica, Arial, sans-serif" textAnchor="middle"
          style={{ paintOrder: 'stroke' }} stroke="#ffffff" strokeLinejoin="round">
          <text x={CX} y={CY + 4} fontSize={38} fontWeight={500} fill="#141310" strokeWidth={5} letterSpacing="-0.02em">{Math.round(dScore)}</text>
          <text x={CX} y={CY + 20} fontSize={9.5} fill="#6b6a66" strokeWidth={3} letterSpacing="0.08em">/ 100</text>
        </g>
      )}
    </svg>
  );
}
