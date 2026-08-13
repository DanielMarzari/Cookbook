import Link from "next/link";
import { ITEM_PHOTOS, PHOTO_CONFIDENCE_FLOOR } from "@/lib/charcuterie/photos";
import { ITEMS } from "@/lib/charcuterie/items";

export const metadata = { title: "Ingredient photos · Charcuterie · Cookbook" };

/**
 * Every fetched cutout, worst match first.
 *
 * The fetcher scores how much it believes a photo is the thing it searched for,
 * and it is confidently wrong often enough that the low scores need eyes on
 * them — a search for aged gouda returned a photograph of a memorial stone. So
 * this page exists to be skimmed: anything that looks wrong, say so and it gets
 * refetched from its alternates.
 */
export default function PhotoReviewPage() {
  const rows = Object.values(ITEM_PHOTOS).sort((a, b) => a.score - b.score);
  const doubtful = rows.filter((r) => r.score < PHOTO_CONFIDENCE_FLOOR);
  const missing = ITEMS.filter((i) => !ITEM_PHOTOS[i.id]);

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-10">
      <h1 className="text-[26px] tracking-[-0.01em] mb-1">Ingredient photos</h1>
      <p className="text-[13px] text-text-secondary leading-[1.6] max-w-[68ch] mb-8">
        {rows.length} cutouts, all CC0 or public domain, background removed and squared.{" "}
        <span className="text-text">{doubtful.length}</span> scored below {PHOTO_CONFIDENCE_FLOOR} and want
        a second opinion; <span className="text-text">{missing.length}</span> items found nothing usable and
        fall back to the drawn motif.{" "}
        <Link href="/charcuterie/studio" className="tlink">Back to the studio</Link>
      </p>

      <h2 className="text-[12px] uppercase tracking-[0.13em] text-text-secondary mb-3">
        Worth checking — {doubtful.length}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
        {doubtful.map((r) => (
          <figure key={r.id} className="border border-border p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/charcuterie/items/${r.id}.webp`}
              alt={r.id}
              className="w-full aspect-square object-contain bg-[#f6f6f6]"
            />
            <figcaption className="mt-1.5">
              <span className="block text-[12.5px] text-text">{r.id}</span>
              <span className="block text-[11px] text-text-secondary leading-[1.4]">
                {r.score} · {r.title || "untitled"}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <h2 className="text-[12px] uppercase tracking-[0.13em] text-text-secondary mb-3">
        No photo — drawn instead — {missing.length}
      </h2>
      <p className="text-[12.5px] text-text-secondary leading-[1.6] max-w-[68ch]">
        {missing.map((i) => i.name).join(" · ")}
      </p>
    </div>
  );
}
