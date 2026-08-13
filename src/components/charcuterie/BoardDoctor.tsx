import type { Critique } from "@/lib/charcuterie/advice";

const TONE: Record<Critique["severity"], { dot: string; text: string }> = {
  good: { dot: "bg-text", text: "text-text-secondary" },
  note: { dot: "bg-[#9a9a9a]", text: "text-text-secondary" },
  warn: { dot: "bg-[#a0522d]", text: "text-text" },
};

/** Opinionated critique of the board as it stands. Deliberately blunt — a
 *  planner that only ever says "looks great" is useless. */
export function BoardDoctor({ critiques }: { critiques: Critique[] }) {
  const warns = critiques.filter((c) => c.severity === "warn").length;

  return (
    <div className="p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
          Board doctor
        </p>
        <span className="text-[10px] text-[#9a9a9a]">
          {warns === 0 ? "no complaints" : `${warns} to fix`}
        </span>
      </div>

      <ul className="mt-3 space-y-2.5">
        {critiques.map((c) => {
          const tone = TONE[c.severity];
          return (
            <li key={c.id} className="flex gap-2.5">
              <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${tone.dot}`} />
              <p className={`text-[11px] leading-relaxed ${tone.text}`}>{c.text}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
