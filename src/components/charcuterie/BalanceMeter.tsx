"use client";

import { motion } from "motion/react";
import type { BalanceAxis } from "@/lib/charcuterie/advice";

/** How covered each flavour/texture axis is, and what to do about the gaps.
 *  A board that scores well here tastes varied even if it looks plain. */
export function BalanceMeter({
  axes,
  palette,
}: {
  axes: BalanceAxis[];
  palette: string[];
}) {
  const weakest = axes.reduce((a, b) => (b.value < a.value ? b : a), axes[0]);

  return (
    <div className="p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
        Balance
      </p>

      <ul className="mt-3 space-y-2">
        {axes.map((axis) => {
          const weak = axis.value < 0.3;
          return (
            <li key={axis.key}>
              <div className="flex items-center gap-2">
                <span
                  className={`w-16 shrink-0 text-[11px] ${weak ? "text-[#a0522d]" : "text-text-secondary"}`}
                >
                  {axis.label}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f6f6f4]">
                  <motion.div
                    className={`h-full rounded-full ${weak ? "bg-[#a0522d]" : "bg-text"}`}
                    animate={{ width: `${Math.round(axis.value * 100)}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {weakest && weakest.value < 0.3 && (
        <p className="mt-3 rounded-lg border border-[#ead9cd] bg-[#faf3ee] p-2.5 text-[11px] leading-relaxed text-[#a0522d]">
          {weakest.advice}
        </p>
      )}

      {palette.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] text-[#9a9a9a]">Colour on the board</p>
          <div className="mt-1.5 flex h-6 overflow-hidden rounded-md ring-1 ring-white/10">
            {palette.map((c, i) => (
              <div key={`${c}-${i}`} className="flex-1" style={{ background: c }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
