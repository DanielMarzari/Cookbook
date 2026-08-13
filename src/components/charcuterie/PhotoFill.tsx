'use client';

import type { ReactNode } from 'react';
import type { Motif } from '@/lib/charcuterie/types';

const r2 = (n: number) => Math.round(n * 100) / 100;

interface Args {
  rng: () => number;
  box: [number, number, number, number];
  center: [number, number];
  motif: Motif;
  src: string;
  key: string;
}

/** One placed piece of food: where, how big, how turned. */
interface Placement {
  x: number;
  y: number;
  size: number;
  rot: number;
  /** Drawn later = sits on top. Sorting by this fakes depth. */
  z: number;
}

/**
 * Where the pieces go, by motif.
 *
 * The motif already encodes how a food is presented — a rose spirals, shingles
 * march, a fan sweeps — so the arrangement logic carries straight over from the
 * drawn version. What changes is that each position now holds a photograph of
 * the actual ingredient instead of a coloured polygon.
 */
function placements(motif: Motif, rng: () => number, box: [number, number, number, number]): Placement[] {
  const [x, y, w, h] = box;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const out: Placement[] = [];
  const jitter = (amt: number) => (rng() - 0.5) * amt;

  switch (motif) {
    // A rose: slices spiralling out from a tight centre, each overlapping the last.
    case 'rose': {
      const turns = 2.6;
      const n = 14;
      const rMax = Math.min(w, h) * 0.46;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const a = t * turns * Math.PI * 2;
        const rad = rMax * Math.pow(t, 0.62);
        out.push({
          x: cx + Math.cos(a) * rad,
          y: cy + Math.sin(a) * rad * 0.86,
          size: Math.min(w, h) * (0.42 - t * 0.12),
          rot: (a * 180) / Math.PI + 90 + jitter(10),
          z: i,
        });
      }
      return out;
    }

    // Overlapping slices leaning down a row — salami, cheese, cucumber.
    case 'shingle':
    case 'drape': {
      const n = Math.max(4, Math.round(w / 30));
      const step = w / (n + 1);
      for (let i = 0; i < n; i++) {
        out.push({
          x: x + step * (i + 0.9),
          y: cy + jitter(h * 0.16),
          size: Math.min(step * 2.5, h * 0.94),
          rot: -14 + jitter(16),
          z: i,
        });
      }
      return out;
    }

    // A sweep, each piece pivoting a little further round than the last.
    case 'fan': {
      const n = Math.max(5, Math.round(w / 26));
      const spread = 74;
      for (let i = 0; i < n; i++) {
        const t = n === 1 ? 0.5 : i / (n - 1);
        out.push({
          x: x + w * (0.12 + t * 0.76),
          y: cy + Math.sin(t * Math.PI) * -h * 0.1,
          size: h * 0.82,
          rot: -spread / 2 + t * spread + jitter(6),
          z: i,
        });
      }
      return out;
    }

    // Wedges alternating point-up and point-down, so the row reads as a zigzag.
    case 'wedge': {
      const n = Math.max(3, Math.round(w / 40));
      const step = w / n;
      for (let i = 0; i < n; i++) {
        out.push({
          x: x + step * (i + 0.5),
          y: cy + (i % 2 ? h * 0.06 : -h * 0.06),
          size: Math.min(step * 1.5, h * 0.9),
          rot: i % 2 ? 180 + jitter(8) : jitter(8),
          z: i,
        });
      }
      return out;
    }

    // A ring of slices stood on edge, each leaning outward — the fruit flower.
    case 'flower': {
      const rad = Math.min(w, h) * 0.33;
      const n = Math.max(9, Math.min(16, Math.round(rad / 6)));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        out.push({
          x: cx + Math.cos(a) * rad,
          y: cy + Math.sin(a) * rad * 0.72,
          size: rad * 0.95,
          rot: (a * 180) / Math.PI + 90 + jitter(6),
          z: i,
        });
      }
      // The bud that keeps the middle from reading as a hole.
      out.push({ x: cx, y: cy, size: rad * 0.8, rot: jitter(20), z: n });
      return out;
    }

    // Triangles alternating up and down: the row zigzags into an M.
    case 'mwave': {
      const n = Math.max(4, Math.min(10, Math.round(w / 26)));
      const step = w / n;
      for (let i = 0; i < n; i++) {
        out.push({
          x: x + step * (i + 0.5),
          y: cy + (i % 2 ? h * 0.07 : -h * 0.07),
          size: Math.min(step * 1.7, h * 0.92),
          rot: (i % 2 ? 180 : 0) + jitter(5),
          z: i,
        });
      }
      return out;
    }

    // Folded ribbons standing up, leaning at slightly different angles.
    case 'ruffle': {
      const n = Math.max(3, Math.min(8, Math.round(w / 30)));
      const step = w / n;
      for (let i = 0; i < n; i++) {
        out.push({
          x: x + step * (i + 0.5),
          y: cy + jitter(h * 0.18),
          size: Math.min(step * 1.9, h * 0.98),
          rot: jitter(26),
          z: i,
        });
      }
      return out;
    }

    // Loose heaps — nuts, olives, berries, anything spooned into a gap.
    case 'cluster':
    case 'scatter':
    case 'crumble':
    case 'cube':
    case 'round':
    case 'halved': {
      const dense = motif === 'scatter' || motif === 'crumble';
      const n = Math.round((w * h) / (dense ? 520 : 900));
      const base = Math.min(w, h) * (dense ? 0.2 : 0.3);
      for (let i = 0; i < Math.max(4, Math.min(n, 26)); i++) {
        const a = rng() * Math.PI * 2;
        const rad = Math.sqrt(rng()) * Math.min(w, h) * 0.42;
        out.push({
          x: cx + Math.cos(a) * rad,
          y: cy + Math.sin(a) * rad * 0.8,
          size: base * (0.78 + rng() * 0.5),
          rot: rng() * 360,
          z: i,
        });
      }
      return out;
    }

    // Batons and sprigs lie roughly parallel, like something laid down by hand.
    case 'batons':
    case 'sprig': {
      const n = Math.max(3, Math.round(w / 34));
      for (let i = 0; i < n; i++) {
        out.push({
          x: x + w * ((i + 0.7) / (n + 0.4)),
          y: cy + jitter(h * 0.3),
          size: h * 0.9,
          rot: -78 + jitter(22),
          z: i,
        });
      }
      return out;
    }

    // A short stack, each piece nudged off the one below.
    case 'stack': {
      for (let i = 0; i < 5; i++) {
        out.push({
          x: cx + i * (w * 0.035) + jitter(3),
          y: cy + h * 0.22 - i * (h * 0.11),
          size: Math.min(w, h) * 0.66,
          rot: jitter(9),
          z: i,
        });
      }
      return out;
    }

    // Something wet in a vessel: a full round, sitting in the middle.
    case 'bowl':
    default: {
      out.push({ x: cx, y: cy, size: Math.min(w, h) * 0.74, rot: jitter(8), z: 0 });
      return out;
    }
  }
}

/**
 * Fill a zone with photographs of the actual ingredient.
 *
 * The drawn motifs are good geometry and unmistakably illustration — coloured
 * polygons read as a diagram of a board rather than a board. Where a cutout
 * exists this places real photographs using the same arrangement rules, with a
 * contact shadow under each piece so they sit on the wood instead of floating
 * above it.
 */
export function PhotoFill({ rng, box, center, motif, src, key: k }: Args): ReactNode {
  const pieces = placements(motif, rng, box).sort((a, b) => a.z - b.z);
  const shadow = `${k}-sh`;

  return (
    <g key={k}>
      <defs>
        {/* One soft drop shadow reused by every piece in the zone. */}
        <filter id={shadow} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.4" stdDeviation="1.6" floodColor="#2a1a0d" floodOpacity="0.42" />
        </filter>
      </defs>
      <g filter={`url(#${shadow})`}>
        {pieces.map((p, i) => (
          <image
            key={`${k}-p${i}`}
            href={src}
            x={r2(p.x - p.size / 2)}
            y={r2(p.y - p.size / 2)}
            width={r2(p.size)}
            height={r2(p.size)}
            transform={`rotate(${r2(p.rot)} ${r2(p.x)} ${r2(p.y)})`}
            preserveAspectRatio="xMidYMid meet"
            style={{ pointerEvents: 'none' }}
          />
        ))}
      </g>
      {/* Keeps the zone hoverable where the photos leave gaps. */}
      <circle cx={center[0]} cy={center[1]} r={0.01} fill="transparent" />
    </g>
  );
}
