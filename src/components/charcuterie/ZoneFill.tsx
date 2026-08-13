import { Fragment, type ReactNode } from "react";
import { rngFor } from "@/lib/charcuterie/geometry";
import { hasPhoto, photoUrl } from "@/lib/charcuterie/photos";
import { PhotoFill } from "./PhotoFill";
import type { Cut, Item, Motif, Zone } from "@/lib/charcuterie/types";

/** Draws food *texture* inside a zone, clipped to the zone's true outline.
 *
 *  Every motif is a small deterministic generator: same zone + same item always
 *  produces the same arrangement, so nothing shuffles on re-render. The goal is
 *  that a filled board reads as food from across the room rather than as a set
 *  of coloured shapes. */

type Rng = () => number;
type Box = [number, number, number, number];
type Palette = readonly [string, string, string];

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** Shift a hex colour lighter (amt > 0) or darker (amt < 0). */
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = amt >= 0 ? c + (255 - c) * amt : c * (1 + amt);
    return Math.round(clamp(v, 0, 255));
  });
  return `#${ch.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

function polygon(points: [number, number][]): string {
  return `${points.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" ")}`;
}

/** Motifs that shouldn't have a solid bed painted under them — a bowl is one
 *  object in the middle of a zone, herbs are sparse by nature. */
const NO_BED: Motif[] = ["bowl", "sprig", "scatter", "batons"];

interface Args {
  rng: Rng;
  box: Box;
  /** The zone's centroid. Always inside the shape, unlike the bbox centre —
   *  which matters for wedges, where the two are nowhere near each other. */
  center: [number, number];
  palette: Palette;
  key: string;
}

// ─── Motif generators ────────────────────────────────────────────────────────

/** Packed spheres — grapes, olives, berries, mozzarella pearls. */
function cluster({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const r = clamp(Math.min(w, h) * 0.13, 4, 15);
  const step = r * 1.5;
  const out: ReactNode[] = [];
  let i = 0;
  for (let row = 0; row * step * 0.88 < h + step; row++) {
    const cy = y + row * step * 0.88 + step * 0.4;
    const offset = row % 2 === 0 ? 0 : step / 2;
    for (let col = 0; col * step < w + step; col++) {
      const cx = x + col * step + offset + step * 0.35;
      const jx = (rng() - 0.5) * r * 0.55;
      const jy = (rng() - 0.5) * r * 0.55;
      const rr = r * (0.82 + rng() * 0.34);
      const tone = rng();
      const fill = tone > 0.72 ? palette[2] : tone > 0.34 ? palette[0] : palette[1];
      out.push(
        <Fragment key={`${key}-c${i}`}>
          <circle cx={r2(cx + jx)} cy={r2(cy + jy)} r={r2(rr)} fill={fill} />
          <circle
            cx={r2(cx + jx - rr * 0.28)}
            cy={r2(cy + jy - rr * 0.3)}
            r={r2(rr * 0.3)}
            fill={shade(fill, 0.34)}
            opacity={0.7}
          />
        </Fragment>,
      );
      i++;
    }
  }
  return out;
}

/** Loose small pieces — nuts, dried fruit, pomegranate seeds. */
function scatter({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const r = clamp(Math.min(w, h) * 0.11, 3.5, 12);
  const n = clamp(Math.round((w * h) / (r * r * 6)), 10, 90);
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const cx = x + w * (0.08 + rng() * 0.84);
    const cy = y + h * (0.08 + rng() * 0.84);
    const rot = rng() * 180;
    const rr = r * (0.75 + rng() * 0.5);
    const fill = rng() > 0.55 ? palette[0] : palette[1];
    out.push(
      <g key={`${key}-s${i}`} transform={`rotate(${r2(rot)} ${r2(cx)} ${r2(cy)})`}>
        <ellipse
          cx={r2(cx)}
          cy={r2(cy)}
          rx={r2(rr)}
          ry={r2(rr * 0.72)}
          fill={fill}
          stroke={shade(fill, -0.28)}
          strokeWidth={0.7}
        />
        <ellipse
          cx={r2(cx - rr * 0.2)}
          cy={r2(cy - rr * 0.18)}
          rx={r2(rr * 0.34)}
          ry={r2(rr * 0.22)}
          fill={shade(palette[2], 0.2)}
          opacity={0.55}
        />
      </g>,
    );
  }
  return out;
}

/** Overlapping coins along the zone's long axis — salami, sliced cheese. */
function shingle({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const horizontal = w >= h;
  const across = horizontal ? h : w;
  const along = horizontal ? w : h;
  const r = clamp(across * 0.34, 6, 34);
  const step = r * 0.85;
  const rows = Math.max(1, Math.round(across / (r * 1.75)));
  const out: ReactNode[] = [];
  let i = 0;
  for (let row = 0; row < rows; row++) {
    const lane = across * ((row + 0.5) / rows);
    for (let d = r * 0.6; d < along - r * 0.2; d += step) {
      const jitter = (rng() - 0.5) * r * 0.3;
      const cx = horizontal ? x + d : x + lane + jitter;
      const cy = horizontal ? y + lane + jitter : y + d;
      const fill = rng() > 0.5 ? palette[0] : palette[1];
      out.push(
        <Fragment key={`${key}-sh${i}`}>
          <circle
            cx={r2(cx)}
            cy={r2(cy)}
            r={r2(r)}
            fill={fill}
            stroke={shade(fill, -0.22)}
            strokeWidth={0.9}
          />
          {/* Fat marbling — what makes a salami coin read as salami. */}
          <circle cx={r2(cx - r * 0.3)} cy={r2(cy - r * 0.2)} r={r2(r * 0.16)} fill={palette[2]} opacity={0.85} />
          <circle cx={r2(cx + r * 0.28)} cy={r2(cy + r * 0.26)} r={r2(r * 0.12)} fill={palette[2]} opacity={0.7} />
          <circle cx={r2(cx + r * 0.1)} cy={r2(cy - r * 0.42)} r={r2(r * 0.1)} fill={palette[2]} opacity={0.6} />
        </Fragment>,
      );
      i++;
    }
  }
  return out;
}

/** The salami rose — concentric rings of petals, tightest at the centre. */
function rose({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const R = Math.min(w, h) / 2;
  const out: ReactNode[] = [];
  const rings = [
    { r: R * 0.92, n: 11, pw: R * 0.3 },
    { r: R * 0.62, n: 8, pw: R * 0.26 },
    { r: R * 0.34, n: 6, pw: R * 0.2 },
  ];
  rings.forEach((ring, ri) => {
    const phase = rng() * 360;
    for (let i = 0; i < ring.n; i++) {
      const a = phase + (360 * i) / ring.n;
      const rad = (a * Math.PI) / 180;
      const px = cx + Math.cos(rad) * ring.r * 0.72;
      const py = cy + Math.sin(rad) * ring.r * 0.72;
      const fill = i % 2 === 0 ? palette[0] : palette[1];
      out.push(
        <g key={`${key}-p${ri}-${i}`} transform={`rotate(${r2(a + 90)} ${r2(px)} ${r2(py)})`}>
          <ellipse
            cx={r2(px)}
            cy={r2(py)}
            rx={r2(ring.pw)}
            ry={r2(ring.pw * 0.68)}
            fill={fill}
            stroke={shade(fill, -0.25)}
            strokeWidth={0.9}
          />
          <ellipse
            cx={r2(px)}
            cy={r2(py + ring.pw * 0.2)}
            rx={r2(ring.pw * 0.72)}
            ry={r2(ring.pw * 0.36)}
            fill={shade(fill, -0.14)}
            opacity={0.55}
          />
        </g>,
      );
    }
  });
  out.push(
    <circle
      key={`${key}-heart`}
      cx={r2(cx)}
      cy={r2(cy)}
      r={r2(R * 0.16)}
      fill={shade(palette[1], -0.2)}
    />,
  );
  return out;
}

/** Loose ruffled folds — prosciutto, mortadella, any paper-thin slice. */
function drape({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const bands = clamp(Math.round(h / 26), 2, 6);
  const out: ReactNode[] = [];
  for (let b = 0; b < bands; b++) {
    const top = y + (h * (b + 0.12)) / bands;
    const band = (h / bands) * 0.92;
    const segs = 5;
    const upper: [number, number][] = [];
    const lower: [number, number][] = [];
    for (let s = 0; s <= segs; s++) {
      const px = x + (w * s) / segs;
      const wave = Math.sin((s / segs) * Math.PI * 2 + b) * band * 0.22;
      upper.push([px, top + wave + (rng() - 0.5) * band * 0.12]);
      lower.push([px, top + band + wave * 0.5 + (rng() - 0.5) * band * 0.12]);
    }
    const fill = b % 2 === 0 ? palette[0] : palette[1];
    const edge = (pts: [number, number][]) =>
      pts.map(([px, py]) => `L ${r2(px)} ${r2(py)}`).join(" ");
    const d =
      `M ${r2(upper[0][0])} ${r2(upper[0][1])} ` +
      `${edge(upper.slice(1))} ${edge([...lower].reverse())} Z`;
    out.push(
      <Fragment key={`${key}-d${b}`}>
        <path d={d} fill={fill} stroke={shade(fill, -0.2)} strokeWidth={0.8} />
        {/* Ribbons of fat catching the light. */}
        <path
          d={`M ${r2(upper[0][0])} ${r2(upper[0][1] + band * 0.42)} ${upper
            .slice(1)
            .map(([px, py]) => `L ${r2(px)} ${r2(py + band * 0.42)}`)
            .join(" ")}`}
          fill="none"
          stroke={palette[2]}
          strokeWidth={r2(band * 0.16)}
          opacity={0.5}
          strokeLinecap="round"
        />
      </Fragment>,
    );
  }
  return out;
}

/** Fanned triangles — a wheel of brie or a hard cheese cut into wedges. */
function wedgeMotif({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const n = clamp(Math.round(w / 34), 3, 7);
  const out: ReactNode[] = [];
  const bw = w / (n + 0.6);
  for (let i = 0; i < n; i++) {
    const bx = x + i * bw + bw * 0.3;
    const tilt = (rng() - 0.5) * 12;
    const top = y + h * (0.12 + rng() * 0.1);
    const bottom = y + h * (0.9 - rng() * 0.08);
    const fill = i % 2 === 0 ? palette[0] : palette[1];
    const pts: [number, number][] = [
      [bx + bw * 0.5, top],
      [bx + bw * 0.96, bottom],
      [bx + bw * 0.04, bottom],
    ];
    out.push(
      <g key={`${key}-w${i}`} transform={`rotate(${r2(tilt)} ${r2(bx + bw / 2)} ${r2((top + bottom) / 2)})`}>
        <polygon
          points={polygon(pts)}
          fill={fill}
          stroke={shade(fill, -0.24)}
          strokeWidth={1}
          strokeLinejoin="round"
        />
        {/* The rind stripe along the cut edge. */}
        <line
          x1={r2(bx + bw * 0.04)}
          y1={r2(bottom)}
          x2={r2(bx + bw * 0.96)}
          y2={r2(bottom)}
          stroke={palette[2]}
          strokeWidth={r2(Math.max(2, h * 0.045))}
          strokeLinecap="round"
        />
      </g>,
    );
  }
  return out;
}

/** Small rotated squares — feta, cheddar, chunks of honeycomb. */
function cube({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const s = clamp(Math.min(w, h) * 0.26, 8, 34);
  const out: ReactNode[] = [];
  let i = 0;
  for (let cy = y + s * 0.7; cy < y + h - s * 0.2; cy += s * 1.25) {
    for (let cx = x + s * 0.7; cx < x + w - s * 0.2; cx += s * 1.25) {
      const jx = (rng() - 0.5) * s * 0.4;
      const jy = (rng() - 0.5) * s * 0.4;
      const rot = (rng() - 0.5) * 46;
      const size = s * (0.78 + rng() * 0.32);
      const fill = rng() > 0.45 ? palette[0] : palette[1];
      out.push(
        <g key={`${key}-cu${i}`} transform={`rotate(${r2(rot)} ${r2(cx + jx)} ${r2(cy + jy)})`}>
          <rect
            x={r2(cx + jx - size / 2)}
            y={r2(cy + jy - size / 2)}
            width={r2(size)}
            height={r2(size)}
            rx={r2(size * 0.16)}
            fill={fill}
            stroke={shade(fill, -0.26)}
            strokeWidth={0.9}
          />
          <rect
            x={r2(cx + jx - size / 2)}
            y={r2(cy + jy - size / 2)}
            width={r2(size)}
            height={r2(size * 0.3)}
            rx={r2(size * 0.14)}
            fill={shade(fill, 0.26)}
            opacity={0.6}
          />
        </g>,
      );
      i++;
    }
  }
  return out;
}

/** Irregular broken chunks — aged gouda, parmesan rubble, blue cheese. */
function crumble({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const r = clamp(Math.min(w, h) * 0.2, 6, 30);
  // Pieces are scattered across the bounding box but clipped to the zone, and
  // for a ribbon or a wedge most of that box is outside the shape. Over-generate
  // so those zones still fill; the clip throws away the excess for free.
  const n = clamp(Math.round((w * h) / (r * r * 2.2)), 8, 120);
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const cx = x + w * (0.1 + rng() * 0.8);
    const cy = y + h * (0.12 + rng() * 0.76);
    const size = r * (0.6 + rng() * 0.7);
    const corners = 5 + Math.floor(rng() * 3);
    const pts: [number, number][] = [];
    for (let c = 0; c < corners; c++) {
      const a = (c / corners) * Math.PI * 2 + rng() * 0.35;
      const rr = size * (0.62 + rng() * 0.55);
      pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.86]);
    }
    const fill = rng() > 0.5 ? palette[0] : palette[1];
    out.push(
      <Fragment key={`${key}-cr${i}`}>
        <polygon
          points={polygon(pts)}
          fill={fill}
          stroke={shade(fill, -0.28)}
          strokeWidth={0.9}
          strokeLinejoin="round"
        />
        {/* Veining / crystals, depending on what this is standing in for. */}
        <circle cx={r2(cx + size * 0.12)} cy={r2(cy - size * 0.1)} r={r2(size * 0.15)} fill={palette[2]} opacity={0.75} />
      </Fragment>,
    );
  }
  return out;
}

/** An overlapping arc of slices — crackers, apple fans, citrus wheels. */
function fan({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  // A single fan stretched across a long zone looks absurd, and in a ribbon most
  // of it would be clipped away anyway. Repeat the fan along the box instead.
  const groups = clamp(Math.round(w / (h * 1.1)), 1, 6);
  const gw = w / groups;
  const n = clamp(Math.round(gw / 20), 4, 11);
  const len = h * 0.82;
  const wide = clamp(gw / n, 7, 26);
  const spread = 84;
  const out: ReactNode[] = [];
  for (let g = 0; g < groups; g++) {
    const pivotX = x + gw * (g + 0.5);
    const pivotY = y + h * 1.05;
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const a = -spread / 2 + spread * t + (rng() - 0.5) * 4;
      const fill = i % 2 === 0 ? palette[0] : palette[1];
      out.push(
        <g key={`${key}-f${g}-${i}`} transform={`rotate(${r2(a)} ${r2(pivotX)} ${r2(pivotY)})`}>
          <rect
            x={r2(pivotX - wide / 2)}
            y={r2(pivotY - len)}
            width={r2(wide)}
            height={r2(len * 0.94)}
            rx={r2(wide * 0.42)}
            fill={fill}
            stroke={shade(fill, -0.24)}
            strokeWidth={0.9}
          />
          <rect
            x={r2(pivotX - wide * 0.24)}
            y={r2(pivotY - len * 0.92)}
            width={r2(wide * 0.48)}
            height={r2(len * 0.42)}
            rx={r2(wide * 0.24)}
            fill={shade(palette[2], 0.1)}
            opacity={0.5}
          />
        </g>,
      );
    }
  }
  return out;
}

/** A vessel with something in it — honey, jam, hummus, olive oil. */
function bowl({ rng, box, center, palette, key }: Args): ReactNode {
  const [, , w, h] = box;
  const [cx, cy] = center;
  const r = Math.min(w, h) * 0.44;
  return (
    <Fragment key={`${key}-bowl`}>
      {/* The dish. */}
      <circle cx={r2(cx)} cy={r2(cy)} r={r2(r)} fill="#e8e3d8" stroke="#c9c2b2" strokeWidth={1.4} />
      <circle cx={r2(cx)} cy={r2(cy)} r={r2(r * 0.86)} fill="#f3efe6" />
      {/* Contents. */}
      <circle cx={r2(cx)} cy={r2(cy)} r={r2(r * 0.78)} fill={palette[0]} />
      <circle cx={r2(cx)} cy={r2(cy)} r={r2(r * 0.78)} fill={palette[1]} opacity={0.45} />
      {/* The swoosh — a channel dragged through with the back of a spoon. */}
      <path
        d={`M ${r2(cx - r * 0.44)} ${r2(cy + r * 0.1)} Q ${r2(cx)} ${r2(cy - r * 0.42)} ${r2(cx + r * 0.46)} ${r2(cy + r * 0.02)}`}
        fill="none"
        stroke={shade(palette[0], -0.22)}
        strokeWidth={r2(r * 0.16)}
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* Gloss. */}
      <ellipse
        cx={r2(cx - r * 0.26)}
        cy={r2(cy - r * 0.34)}
        rx={r2(r * 0.24)}
        ry={r2(r * 0.13)}
        fill="#ffffff"
        opacity={0.4}
        transform={`rotate(-28 ${r2(cx - r * 0.26)} ${r2(cy - r * 0.34)})`}
      />
      {/* A few specks of whatever's stirred through it. */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = rng() * Math.PI * 2;
        const rr = r * 0.5 * rng();
        return (
          <circle
            key={`${key}-sp${i}`}
            cx={r2(cx + Math.cos(a) * rr)}
            cy={r2(cy + Math.sin(a) * rr)}
            r={r2(r * 0.07)}
            fill={palette[2]}
            opacity={0.8}
          />
        );
      })}
    </Fragment>
  );
}

/** Herb sprigs — a stem with leaves, tucked in at an angle. */
function sprig({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const n = clamp(Math.round(Math.min(w, h) / 26), 2, 5);
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const sx = x + w * (0.16 + rng() * 0.68);
    const sy = y + h * (0.2 + rng() * 0.6);
    const len = Math.min(w, h) * (0.34 + rng() * 0.3);
    const a = -60 + rng() * 120;
    const leaves = 6 + Math.floor(rng() * 4);
    const stem: ReactNode[] = [
      <line
        key={`${key}-stem${i}`}
        x1={0}
        y1={0}
        x2={0}
        y2={r2(-len)}
        stroke={palette[1]}
        strokeWidth={1.6}
        strokeLinecap="round"
      />,
    ];
    for (let l = 1; l <= leaves; l++) {
      const t = l / (leaves + 1);
      const ly = -len * t;
      const side = l % 2 === 0 ? 1 : -1;
      const ll = len * 0.2 * (1 - t * 0.4);
      stem.push(
        <ellipse
          key={`${key}-lf${i}-${l}`}
          cx={r2(side * ll * 0.6)}
          cy={r2(ly)}
          rx={r2(ll * 0.62)}
          ry={r2(ll * 0.2)}
          fill={l % 3 === 0 ? palette[2] : palette[0]}
          transform={`rotate(${side * -32} ${r2(side * ll * 0.6)} ${r2(ly)})`}
        />,
      );
    }
    out.push(
      <g key={`${key}-sg${i}`} transform={`translate(${r2(sx)} ${r2(sy)}) rotate(${r2(a)})`}>
        {stem}
      </g>,
    );
  }
  return out;
}

/** A leaning stack of discs, seen from the side-ish. */
function stack({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  // Tile little stacks over the whole box rather than one row along the bottom,
  // so ribbon and wedge zones fill instead of showing a handful of strays.
  const cell = clamp(Math.min(w, h) * 0.55, 34, 86);
  const cols = Math.max(1, Math.round(w / cell));
  const rows = Math.max(1, Math.round(h / cell));
  const rx = clamp(cell * 0.34, 8, 30);
  const out: ReactNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let c = 0; c < cols; c++) {
      const cx = x + (w * (c + 0.5)) / cols;
      const base = y + (h * (row + 0.78)) / rows;
      const layers = 3 + Math.floor(rng() * 4);
      for (let l = 0; l < layers; l++) {
        const lean = (rng() - 0.5) * rx * 0.5;
        const fill = l % 2 === 0 ? palette[0] : palette[1];
        out.push(
          <ellipse
            key={`${key}-st${row}-${c}-${l}`}
            cx={r2(cx + lean)}
            cy={r2(base - l * rx * 0.42)}
            rx={r2(rx)}
            ry={r2(rx * 0.34)}
            fill={fill}
            stroke={shade(fill, -0.24)}
            strokeWidth={0.9}
          />,
        );
      }
    }
  }
  return out;
}

/** Bread rounds — a pale crumb inside a darker crust ring. */
function round({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const r = clamp(Math.min(w, h) * 0.19, 7, 30);
  const step = r * 1.72;
  const out: ReactNode[] = [];
  let i = 0;
  for (let cy = y + r; cy < y + h; cy += step * 0.86) {
    const offset = (i % 2) * step * 0.5;
    for (let cx = x + r + offset; cx < x + w; cx += step) {
      const jx = (rng() - 0.5) * r * 0.4;
      const jy = (rng() - 0.5) * r * 0.4;
      const rr = r * (0.86 + rng() * 0.22);
      out.push(
        <Fragment key={`${key}-rd${i}-${r2(cx)}`}>
          <circle cx={r2(cx + jx)} cy={r2(cy + jy)} r={r2(rr)} fill={palette[1]} />
          <circle cx={r2(cx + jx)} cy={r2(cy + jy)} r={r2(rr * 0.76)} fill={palette[2]} />
          <circle
            cx={r2(cx + jx - rr * 0.2)}
            cy={r2(cy + jy - rr * 0.18)}
            r={r2(rr * 0.12)}
            fill={shade(palette[1], 0.18)}
            opacity={0.8}
          />
        </Fragment>,
      );
    }
    i++;
  }
  return out;
}

/** Long thin sticks — grissini, cheese batons, candied peel. */
function batons({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const horizontal = w >= h;
  const n = clamp(Math.round((horizontal ? h : w) / 12), 3, 9);
  const len = (horizontal ? w : h) * 0.86;
  const thick = clamp((horizontal ? h : w) / (n * 1.9), 3, 13);
  const out: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const lane = ((horizontal ? h : w) * (i + 0.5)) / n;
    const cx = horizontal ? x + w / 2 : x + lane;
    const cy = horizontal ? y + lane : y + h / 2;
    const rot = (horizontal ? 0 : 90) + (rng() - 0.5) * 16;
    const fill = i % 2 === 0 ? palette[0] : palette[1];
    out.push(
      <g key={`${key}-bt${i}`} transform={`rotate(${r2(rot)} ${r2(cx)} ${r2(cy)})`}>
        <rect
          x={r2(cx - len / 2)}
          y={r2(cy - thick / 2)}
          width={r2(len)}
          height={r2(thick)}
          rx={r2(thick / 2)}
          fill={fill}
          stroke={shade(fill, -0.25)}
          strokeWidth={0.8}
        />
        <rect
          x={r2(cx - len / 2 + thick * 0.4)}
          y={r2(cy - thick * 0.24)}
          width={r2(len - thick * 0.8)}
          height={r2(thick * 0.24)}
          rx={r2(thick * 0.12)}
          fill={shade(palette[2], 0.16)}
          opacity={0.55}
        />
      </g>,
    );
  }
  return out;
}

/** Halved fruit — a rim of skin around a differently-coloured interior. */
function halved({ rng, box, palette, key }: Args): ReactNode {
  const [x, y, w, h] = box;
  const r = clamp(Math.min(w, h) * 0.24, 8, 40);
  const step = r * 2.15;
  const out: ReactNode[] = [];
  let i = 0;
  for (let cy = y + r * 1.05; cy < y + h; cy += step * 0.92) {
    const offset = (i % 2) * step * 0.45;
    for (let cx = x + r * 1.05 + offset; cx < x + w; cx += step) {
      const jx = (rng() - 0.5) * r * 0.3;
      const jy = (rng() - 0.5) * r * 0.3;
      const rr = r * (0.84 + rng() * 0.26);
      const rot = rng() * 360;
      out.push(
        <g key={`${key}-hv${i}-${r2(cx)}`} transform={`rotate(${r2(rot)} ${r2(cx + jx)} ${r2(cy + jy)})`}>
          {/* Skin. */}
          <circle cx={r2(cx + jx)} cy={r2(cy + jy)} r={r2(rr)} fill={palette[1]} />
          {/* Flesh. */}
          <circle cx={r2(cx + jx)} cy={r2(cy + jy)} r={r2(rr * 0.82)} fill={palette[0]} />
          {/* Heart — the seedy middle, the stone cavity, the pale core. */}
          <ellipse
            cx={r2(cx + jx)}
            cy={r2(cy + jy)}
            rx={r2(rr * 0.42)}
            ry={r2(rr * 0.54)}
            fill={palette[2]}
            opacity={0.92}
          />
          {Array.from({ length: 5 }, (_, k) => {
            const a = (k / 5) * Math.PI * 2;
            return (
              <line
                key={`${key}-v${i}-${k}`}
                x1={r2(cx + jx)}
                y1={r2(cy + jy)}
                x2={r2(cx + jx + Math.cos(a) * rr * 0.72)}
                y2={r2(cy + jy + Math.sin(a) * rr * 0.72)}
                stroke={shade(palette[2], -0.2)}
                strokeWidth={0.7}
                opacity={0.5}
              />
            );
          })}
        </g>,
      );
    }
    i++;
  }
  return out;
}

const MOTIFS: Record<Motif, (a: Args) => ReactNode> = {
  cluster,
  scatter,
  shingle,
  rose,
  drape,
  wedge: wedgeMotif,
  cube,
  crumble,
  fan,
  bowl,
  sprig,
  stack,
  round,
  batons,
  halved,
};

// ─── The component ───────────────────────────────────────────────────────────

export function ZoneFill({
  zone,
  item,
  cut,
  idPrefix = "zf",
}: {
  zone: Zone;
  item: Item;
  cut?: Cut;
  idPrefix?: string;
}) {
  const motif: Motif = cut?.motif ?? item.motif;
  const clipId = `${idPrefix}-${zone.id}`;
  const rng = rngFor(`${zone.id}:${item.id}:${motif}`);
  const render = MOTIFS[motif] ?? MOTIFS.cluster;
  // A photograph beats a polygon wherever we have one. The drawn motif stays as
  // the fallback so an ingredient without a picture still fills its zone.
  const photo = hasPhoto(item.id) ? photoUrl(item.id) : null;

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <path d={zone.d} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {!NO_BED.includes(motif) && (
          <path d={zone.d} fill={item.palette[1]} opacity={photo ? 0.16 : 0.38} />
        )}
        {photo
          ? PhotoFill({
              rng,
              box: zone.bbox,
              center: zone.center,
              motif,
              src: photo,
              key: clipId,
            })
          : render({
              rng,
              box: zone.bbox,
              center: zone.center,
              palette: item.palette,
              key: clipId,
            })}
      </g>
    </>
  );
}
