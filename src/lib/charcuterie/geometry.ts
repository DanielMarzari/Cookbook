/** SVG path construction for board zones and food motifs.
 *
 *  Everything here is *deterministic*: randomness comes from a seeded PRNG keyed
 *  on a stable string (a zone id, an item id). That matters twice over — the
 *  server and client renders agree (no hydration mismatch), and a blob doesn't
 *  wobble every time React re-renders because you moved the mouse. */

export type Point = [number, number];

/** Small, fast, well-distributed 32-bit PRNG. Returns a `() => [0,1)`. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a — turn any stable string into a seed. */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Convenience: a PRNG seeded from a string. */
export function rngFor(key: string): () => number {
  return mulberry32(hashSeed(key));
}

export function polar(cx: number, cy: number, r: number, deg: number): Point {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

export function bboxOf(points: Point[]): [number, number, number, number] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  return [minX, minY, maxX - minX, maxY - minY];
}

export function centroidOf(points: Point[]): Point {
  let x = 0;
  let y = 0;
  for (const p of points) {
    x += p[0];
    y += p[1];
  }
  return [x / points.length, y / points.length];
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Closed Catmull-Rom → cubic bezier. This is what makes a ring of points read
 *  as a soft pile of food instead of a polygon. */
export function smoothClosed(points: Point[], tension = 1): string {
  const n = points.length;
  if (n < 3) return "";
  const at = (i: number) => points[((i % n) + n) % n];
  let d = `M ${r2(points[0][0])} ${r2(points[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1: Point = [
      p1[0] + ((p2[0] - p0[0]) / 6) * tension,
      p1[1] + ((p2[1] - p0[1]) / 6) * tension,
    ];
    const c2: Point = [
      p2[0] - ((p3[0] - p1[0]) / 6) * tension,
      p2[1] - ((p3[1] - p1[1]) / 6) * tension,
    ];
    d += ` C ${r2(c1[0])} ${r2(c1[1])}, ${r2(c2[0])} ${r2(c2[1])}, ${r2(p2[0])} ${r2(p2[1])}`;
  }
  return `${d} Z`;
}

/** A shape plus the metadata zones need. */
export interface Shape {
  d: string;
  bbox: [number, number, number, number];
  center: Point;
}

function shapeFrom(points: Point[], tension = 1): Shape {
  return {
    d: smoothClosed(points, tension),
    bbox: bboxOf(points),
    center: centroidOf(points),
  };
}

/** Organic pile. Radii are jittered then neighbour-averaged so the outline
 *  undulates rather than spikes. */
export function blob(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: string,
  opts: { points?: number; wobble?: number; rotate?: number } = {},
): Shape {
  const n = opts.points ?? 11;
  const wobble = opts.wobble ?? 0.21;
  const rot = ((opts.rotate ?? 0) * Math.PI) / 180;
  const rnd = rngFor(seed);

  const raw: number[] = [];
  for (let i = 0; i < n; i++) raw.push(1 + (rnd() * 2 - 1) * wobble);
  // One smoothing pass takes the spikes off without flattening the outline back
  // into an ellipse — two passes and every pile looks like an egg.
  const k = raw.map((v, i) => {
    const prev = raw[(i - 1 + n) % n];
    const nxt = raw[(i + 1) % n];
    return (prev + v * 2 + nxt) / 4;
  });

  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const ex = rx * k[i] * Math.cos(t);
    const ey = ry * k[i] * Math.sin(t);
    pts.push([
      cx + ex * Math.cos(rot) - ey * Math.sin(rot),
      cy + ex * Math.sin(rot) + ey * Math.cos(rot),
    ]);
  }
  return shapeFrom(pts);
}

/** Annular sector — the wedge of a round board. `inner: 0` gives a pie slice. */
export function wedge(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  a0: number,
  a1: number,
  opts: { gap?: number; soften?: number } = {},
): Shape {
  const gap = opts.gap ?? 2;
  // Enough rounding that a segment reads as a pile of food rather than a
  // geometric pie slice, without losing the wedge shape.
  const soften = opts.soften ?? 0.055;
  const start = a0 + gap;
  const end = a1 - gap;
  const steps = Math.max(6, Math.round((end - start) / 6));

  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = start + ((end - start) * i) / steps;
    pts.push(polar(cx, cy, outer, a));
  }
  for (let i = steps; i >= 0; i--) {
    const a = start + ((end - start) * i) / steps;
    pts.push(polar(cx, cy, Math.max(inner, 0.001), a));
  }
  // A touch of smoothing rounds the hard corners without losing the wedge read.
  return shapeFrom(pts, soften * 8);
}

/** A ribbon along a centreline — the meandering cracker river. `width` may be a
 *  function of t (0..1) to taper the ends. */
export function ribbon(
  spine: Point[],
  width: number | ((t: number) => number),
): Shape {
  const w = typeof width === "function" ? width : () => width;
  const left: Point[] = [];
  const right: Point[] = [];

  for (let i = 0; i < spine.length; i++) {
    const prev = spine[Math.max(0, i - 1)];
    const next = spine[Math.min(spine.length - 1, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    // Unit normal.
    const nx = -dy / len;
    const ny = dx / len;
    const half = w(i / Math.max(1, spine.length - 1)) / 2;
    left.push([spine[i][0] + nx * half, spine[i][1] + ny * half]);
    right.push([spine[i][0] - nx * half, spine[i][1] - ny * half]);
  }
  return shapeFrom([...left, ...right.reverse()], 0.85);
}

/** Rounded rectangle, as a plain path (used for slate tiles and thumbnails). */
export function roundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): Shape {
  const rr = Math.min(r, w / 2, h / 2);
  const d =
    `M ${r2(x + rr)} ${r2(y)} H ${r2(x + w - rr)} A ${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x + w)} ${r2(y + rr)}` +
    ` V ${r2(y + h - rr)} A ${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x + w - rr)} ${r2(y + h)}` +
    ` H ${r2(x + rr)} A ${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x)} ${r2(y + h - rr)}` +
    ` V ${r2(y + rr)} A ${r2(rr)} ${r2(rr)} 0 0 1 ${r2(x + rr)} ${r2(y)} Z`;
  return { d, bbox: [x, y, w, h], center: [x + w / 2, y + h / 2] };
}

/** A soft-cornered square-ish tile — the Nine Squares pattern. */
export function tile(
  cx: number,
  cy: number,
  size: number,
  seed: string,
  wobble = 0.07,
): Shape {
  const rnd = rngFor(seed);
  const h = size / 2;
  const j = () => (rnd() * 2 - 1) * size * wobble;
  const pts: Point[] = [
    [cx - h + j(), cy - h + j()],
    [cx + j(), cy - h + j()],
    [cx + h + j(), cy - h + j()],
    [cx + h + j(), cy + j()],
    [cx + h + j(), cy + h + j()],
    [cx + j(), cy + h + j()],
    [cx - h + j(), cy + h + j()],
    [cx - h + j(), cy + j()],
  ];
  return shapeFrom(pts, 0.55);
}

/** Live-edge plank silhouette: straight ends, gently irregular long edges. */
export function livePlank(
  x: number,
  y: number,
  w: number,
  h: number,
  seed: string,
  amp = 7,
): Shape {
  const rnd = rngFor(seed);
  const steps = 14;
  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const edge = i === 0 || i === steps ? 0 : (rnd() * 2 - 1) * amp;
    pts.push([x + w * t, y + edge]);
  }
  for (let i = steps; i >= 0; i--) {
    const t = i / steps;
    const edge = i === 0 || i === steps ? 0 : (rnd() * 2 - 1) * amp;
    pts.push([x + w * t, y + h + edge]);
  }
  return shapeFrom(pts, 0.6);
}

/** Circle as a Shape (round boards, bowls, paddle heads). */
export function circle(cx: number, cy: number, r: number): Shape {
  const d =
    `M ${r2(cx)} ${r2(cy - r)}` +
    ` A ${r2(r)} ${r2(r)} 0 1 1 ${r2(cx - 0.01)} ${r2(cy - r)} Z`;
  return { d, bbox: [cx - r, cy - r, r * 2, r * 2], center: [cx, cy] };
}

/** Paddle: a circular head with a tapered handle, as one closed outline. */
export function paddle(
  cx: number,
  cy: number,
  r: number,
  handleLen: number,
  handleW: number,
): Shape {
  const hy = cy;
  // Where the handle meets the head. This has to sit *on* the circle, or the
  // arc commands below get their radius silently scaled up to reach it and the
  // head stops being a circle of radius r — which then lets zones sized against
  // r hang off the edge.
  const shoulder = handleW * 0.72;
  const x0 = cx + Math.sqrt(Math.max(r * r - shoulder * shoulder, 1));
  const x1 = cx + r + handleLen;
  const d =
    `M ${r2(cx)} ${r2(cy - r)}` +
    ` A ${r2(r)} ${r2(r)} 0 0 1 ${r2(x0)} ${r2(hy - shoulder)}` +
    ` L ${r2(x1 - handleW * 0.5)} ${r2(hy - handleW * 0.5)}` +
    ` A ${r2(handleW * 0.5)} ${r2(handleW * 0.5)} 0 0 1 ${r2(x1 - handleW * 0.5)} ${r2(hy + handleW * 0.5)}` +
    ` L ${r2(x0)} ${r2(hy + shoulder)}` +
    ` A ${r2(r)} ${r2(r)} 0 0 1 ${r2(cx)} ${r2(cy + r)}` +
    ` A ${r2(r)} ${r2(r)} 0 0 1 ${r2(cx)} ${r2(cy - r)} Z`;
  return {
    d,
    bbox: [cx - r, cy - r, r * 2 + handleLen, r * 2],
    center: [cx, cy],
  };
}

/** Even angular divisions, e.g. `spokes(6)` → [0, 60, 120, …, 360]. */
export function spokes(n: number, from = 0): number[] {
  const out: number[] = [];
  for (let i = 0; i <= n; i++) out.push(from + (360 * i) / n);
  return out;
}

/**
 * A band cut across the board on a slant.
 *
 * Everything laid out on the horizontal reads as a shelf. A diagonal makes the
 * eye travel the long way across the board, which is why food stylists reach for
 * it — the same ingredients in the same quantities look like more.
 */
export function diagonalBand(
  cx: number,
  cy: number,
  length: number,
  width: number,
  deg: number,
  seed = "diag",
): Shape {
  const rnd = rngFor(seed);
  const a = (deg * Math.PI) / 180;
  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const spine: Point[] = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1) - 0.5;
    // A little wander, so it reads as laid by hand rather than ruled.
    const off = (rnd() - 0.5) * width * 0.16;
    spine.push([cx + dx * length * t - dy * off, cy + dy * length * t + dx * off]);
  }
  return ribbon(spine, (t) => width * (0.82 + Math.sin(t * Math.PI) * 0.3));
}

/**
 * A crescent following an arc — the sweep that hugs a round board's edge or
 * curves around a bowl sitting in the middle.
 */
export function arcBand(
  cx: number,
  cy: number,
  radius: number,
  fromDeg: number,
  toDeg: number,
  width: number | ((t: number) => number),
): Shape {
  const spine: Point[] = [];
  const n = 14;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const deg = fromDeg + (toDeg - fromDeg) * t;
    spine.push(polar(cx, cy, radius, deg));
  }
  return ribbon(spine, width);
}

/**
 * A river that meanders instead of running straight.
 *
 * The straight cracker river is the most common thing on a built board and the
 * most obviously assembled. A serpentine one reads as something that was poured.
 */
export function serpentine(
  x: number,
  y: number,
  w: number,
  h: number,
  width: number,
  waves = 1.6,
): Shape {
  const spine: Point[] = [];
  const n = 22;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    spine.push([x + w * t, y + h / 2 + Math.sin(t * Math.PI * waves * 2) * (h * 0.3)]);
  }
  return ribbon(spine, (t) => width * (0.78 + Math.sin(t * Math.PI) * 0.34));
}
