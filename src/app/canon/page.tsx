import Link from "next/link";
import { CANON } from "@/data/canon";

export const metadata = { title: "What a dish is · Cookbook" };

/**
 * The index. Each entry answers the question a recipe never gets round to:
 * what has to be true for this to still be the thing.
 */
export default function CanonIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-10 md:pt-16 pb-7">
        <h1 className="text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-normal text-text mb-4">
          What a dish is
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-text-secondary">
          Strip a dish back to the decisions that actually separate it from its neighbours. Change a chip and
          you have a variation; change the chip a neighbour is named for and you have quietly made that
          neighbour instead — which is fine, as long as you know you did it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {CANON.map((c) => (
          <Link
            key={c.slug}
            href={`/canon/${c.slug}`}
            className="block border-b border-border py-6 group"
          >
            <p className="text-[21px] tracking-[-0.01em] text-text group-hover:underline underline-offset-4">
              {c.name}
            </p>
            <p className="text-[13.5px] leading-[1.55] text-text-secondary mt-1.5 max-w-[62ch]">
              {c.standfirst}
            </p>
            <p className="text-[11px] uppercase tracking-[0.12em] text-text-secondary mt-2.5">
              {c.dishes.length} dishes · {c.facets.length} dimensions
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
