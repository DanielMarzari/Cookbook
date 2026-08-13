import { Fragment } from "react";
import { motion } from "motion/react";
import { ZoneFill } from "./ZoneFill";
import { roleCopy } from "@/lib/charcuterie/boards";
import { getItem } from "@/lib/charcuterie/items";
import { rngFor } from "@/lib/charcuterie/geometry";
import type { Board, BoardFills, Pattern, Zone } from "@/lib/charcuterie/types";

/** Board surfaces. The grain is a turbulence filter rather than an image, so it
 *  scales to any board size and costs nothing to ship. */
const SURFACES: Record<
  Board["surface"],
  { base: string; edge: string; grain: string; freq: string; octaves: number; opacity: number }
> = {
  walnut: {
    base: "#6d4a2e",
    edge: "#3f2917",
    grain: "#2a1a0d",
    freq: "0.004 0.16",
    octaves: 4,
    opacity: 0.5,
  },
  olivewood: {
    base: "#a8814c",
    edge: "#6b4f2a",
    grain: "#4a3418",
    freq: "0.011 0.06",
    octaves: 5,
    opacity: 0.42,
  },
  slate: {
    base: "#31363d",
    edge: "#171a1f",
    grain: "#0d1013",
    freq: "0.9 0.9",
    octaves: 3,
    opacity: 0.5,
  },
  marble: {
    base: "#e9e6de",
    edge: "#b9b4a6",
    grain: "#8d99a6",
    freq: "0.016 0.022",
    octaves: 3,
    opacity: 0.34,
  },
  linen: {
    base: "#ded6c4",
    edge: "#b9ae97",
    grain: "#9a8f78",
    freq: "0.75 0.75",
    octaves: 2,
    opacity: 0.3,
  },
};

/** Rosemary tucked into the seams between filled zones — the finishing move
 *  that makes a board look styled rather than assembled. */
function GarnishLayer({
  pattern,
  fills,
  idPrefix,
}: {
  pattern: Pattern;
  fills: BoardFills;
  idPrefix: string;
}) {
  const filled = pattern.zones.filter((z) => fills[z.id]);
  if (filled.length < 2) return null;

  // Seams: midpoints between zones that sit close enough to have a gap worth
  // filling. Capped so the board doesn't turn into a hedge.
  const seams: [number, number][] = [];
  for (let i = 0; i < filled.length && seams.length < 9; i++) {
    for (let j = i + 1; j < filled.length && seams.length < 9; j++) {
      const [ax, ay] = filled[i].center;
      const [bx, by] = filled[j].center;
      const dist = Math.hypot(bx - ax, by - ay);
      if (dist < 190 && dist > 90) seams.push([(ax + bx) / 2, (ay + by) / 2]);
    }
  }

  return (
    <g opacity={0.9}>
      {seams.map(([x, y], i) => {
        const rng = rngFor(`${idPrefix}-garnish-${i}`);
        const angle = rng() * 360;
        const len = 26 + rng() * 16;
        const leaves = 7;
        return (
          <g key={`garnish-${i}`} transform={`translate(${x} ${y}) rotate(${angle})`}>
            <line x1={0} y1={0} x2={0} y2={-len} stroke="#46603a" strokeWidth={1.5} strokeLinecap="round" />
            {Array.from({ length: leaves }, (_, l) => {
              const t = (l + 1) / (leaves + 1);
              const side = l % 2 === 0 ? 1 : -1;
              const ll = len * 0.24 * (1 - t * 0.35);
              return (
                <ellipse
                  key={l}
                  cx={side * ll * 0.6}
                  cy={-len * t}
                  rx={ll * 0.66}
                  ry={ll * 0.2}
                  fill={l % 3 === 0 ? "#8fa86e" : "#5e7d4c"}
                  transform={`rotate(${side * -34} ${side * ll * 0.6} ${-len * t})`}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}

export function BoardCanvas({
  board,
  pattern,
  fills,
  hoveredId,
  selectedId,
  onHover,
  onSelect,
  garnish,
  idPrefix = "board",
}: {
  board: Board;
  pattern: Pattern;
  fills: BoardFills;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  garnish: boolean;
  idPrefix?: string;
}) {
  const [vw, vh] = board.viewBox;
  const surface = SURFACES[board.surface];
  const grainId = `${idPrefix}-grain`;
  const clipId = `${idPrefix}-clip`;
  const shadowId = `${idPrefix}-shadow`;

  const hovered = pattern.zones.find((z) => z.id === hoveredId) ?? null;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        className="block w-full"
        role="img"
        aria-label={`${board.name}, ${pattern.name} arrangement`}
        onMouseLeave={() => onHover(null)}
      >
        <defs>
          <filter id={grainId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={surface.freq}
              numOctaves={surface.octaves}
              seed={11}
              result="noise"
            />
            <feColorMatrix in="noise" type="saturate" values="0" />
          </filter>
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <clipPath id={clipId}>
            <path d={board.outline} />
          </clipPath>
        </defs>

        {/* Shadow under the board. */}
        <path
          d={board.outline}
          fill="#000000"
          opacity={0.45}
          filter={`url(#${shadowId})`}
          transform="translate(4 14)"
        />

        {/* The board itself. */}
        <g clipPath={`url(#${clipId})`}>
          <rect x={0} y={0} width={vw} height={vh} fill={surface.base} />
          <rect
            x={0}
            y={0}
            width={vw}
            height={vh}
            fill={surface.grain}
            filter={`url(#${grainId})`}
            opacity={surface.opacity}
            style={{ mixBlendMode: "multiply" }}
          />
          {/* A warm highlight so the surface isn't flat. */}
          <ellipse
            cx={vw * 0.36}
            cy={vh * 0.28}
            rx={vw * 0.5}
            ry={vh * 0.46}
            fill="#000000"
            opacity={0.07}
          />
        </g>
        <path d={board.outline} fill="none" stroke={surface.edge} strokeWidth={3} opacity={0.85} />

        {/* Zones. */}
        {pattern.zones.map((zone) => {
          const fill = fills[zone.id];
          const item = fill ? getItem(fill.itemId) : undefined;
          const cut = item ? item.cuts[fill!.cutIndex] ?? item.cuts[0] : undefined;
          return (
            <Fragment key={zone.id}>
              {item ? (
                <motion.g
                  initial={{ opacity: 0, scale: 0.62 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  style={{
                    transformOrigin: `${zone.center[0]}px ${zone.center[1]}px`,
                  }}
                >
                  <ZoneFill zone={zone} item={item} cut={cut} idPrefix={idPrefix} />
                </motion.g>
              ) : (
                <path
                  d={zone.d}
                  fill="#000000"
                  fillOpacity={0.04}
                  stroke="#000000"
                  strokeOpacity={0.24}
                  strokeWidth={1.5}
                  strokeDasharray="7 7"
                  className="charc-breathe"
                />
              )}
            </Fragment>
          );
        })}

        {garnish && <GarnishLayer pattern={pattern} fills={fills} idPrefix={idPrefix} />}

        {/* Interaction layer on top, so hit-testing isn't blocked by fills. */}
        {pattern.zones.map((zone) => {
          const isHover = zone.id === hoveredId;
          const isSelected = zone.id === selectedId;
          return (
            <path
              key={`hit-${zone.id}`}
              d={zone.d}
              fill="transparent"
              stroke={isHover || isSelected ? "#111111" : "transparent"}
              strokeWidth={isSelected ? 3 : 2.5}
              strokeDasharray={isSelected ? undefined : "10 7"}
              className={`cursor-pointer outline-none ${isHover && !isSelected ? "charc-march" : ""}`}
              onMouseEnter={() => onHover(zone.id)}
              onFocus={() => onHover(zone.id)}
              onClick={() => onSelect(zone.id)}
              tabIndex={0}
              role="button"
              aria-label={`${zone.label} section`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(zone.id);
                }
              }}
            />
          );
        })}
      </svg>

      {/* Callout, in HTML so the type stays a consistent size at any board scale. */}
      {hovered && <ZoneCallout zone={hovered} fills={fills} vw={vw} vh={vh} />}
    </div>
  );
}

function ZoneCallout({
  zone,
  fills,
  vw,
  vh,
}: {
  zone: Zone;
  fills: BoardFills;
  vw: number;
  vh: number;
}) {
  const fill = fills[zone.id];
  const item = fill ? getItem(fill.itemId) : undefined;
  const cut = item ? item.cuts[fill!.cutIndex] ?? item.cuts[0] : undefined;
  const copy = roleCopy(zone.role);

  const leftPct = (zone.center[0] / vw) * 100;
  const topPct = (zone.center[1] / vh) * 100;
  // Flip the callout to the other side near the edges so it never runs off.
  const flipX = leftPct > 62;
  const flipY = topPct > 68;

  return (
    <div
      className="pointer-events-none absolute z-10 w-60"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: `translate(${flipX ? "-100%" : "0"}, ${flipY ? "-100%" : "0"}) translate(${
          flipX ? "-12px" : "12px"
        }, ${flipY ? "-12px" : "12px"})`,
      }}
    >
      <div className="rounded-lg border border-[#c4c4c4] bg-white/95 p-3 shadow-xl backdrop-blur">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-text">
            {zone.label}
          </span>
          {zone.size === "hero" && (
            <span className="text-[10px] uppercase tracking-wider text-[#9a9a9a]">hero</span>
          )}
        </div>
        {item ? (
          <>
            <p className="mt-1 text-sm font-medium text-text">{item.name}</p>
            {cut && (
              <p className="mt-0.5 text-xs text-text-secondary">
                <span className="text-text-secondary">{cut.name}</span> — {cut.how}
              </p>
            )}
          </>
        ) : (
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">{zone.hint || copy.hint}</p>
        )}
        <p className="mt-2 text-[11px] text-[#9a9a9a]">
          {item ? "Click to swap or re-cut" : "Click to fill this section"}
        </p>
      </div>
    </div>
  );
}
