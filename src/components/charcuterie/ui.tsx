import type { ComponentProps } from "react";

/** Shared primitives for the charcuterie section, in the Cookbook idiom:
 *  white surfaces, hairline rules, small precise type, no heavy fills. The
 *  colour on these pages comes from the board art, the way it comes from
 *  photography everywhere else in Cookbook. */

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface ${className}`}
      {...props}
    />
  );
}

export function SectionTitle({
  className = "",
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      className={`text-[11px] uppercase tracking-[0.12em] text-text-secondary ${className}`}
      {...props}
    />
  );
}

/** Small pill/chip. */
export function Pill({ className = "", ...props }: ComponentProps<"span">) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${className}`}
      {...props}
    />
  );
}
