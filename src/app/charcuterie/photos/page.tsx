import Link from "next/link";
import PhotoDesk, { type PhotoRow } from "@/components/charcuterie/PhotoDesk";
import { ITEM_PHOTOS } from "@/lib/charcuterie/photos";
import { ITEMS } from "@/lib/charcuterie/items";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ingredient photos · Charcuterie · Cookbook" };

/**
 * Where the photography gets finished by hand.
 *
 * The fetcher covers most of the catalogue from CC0 sources but is confidently
 * wrong on the long tail — a search for aged gouda returned a memorial stone. So
 * the ones it missed or guessed at are listed worst-first, and you can hand each
 * one a URL or a file.
 */
export default function PhotoDeskPage() {
  const rows: PhotoRow[] = ITEMS.map((i) => {
    const p = ITEM_PHOTOS[i.id];
    return {
      id: i.id,
      name: i.name,
      cat: i.cat,
      score: p?.score ?? 0,
      title: p?.title ?? "",
      detail: p?.detail ?? "",
    };
  }).sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

  const withPhoto = rows.filter((r) => r.score >= 60).length;

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-10">
      <h1 className="text-[26px] tracking-[-0.01em] mb-1">Ingredient photos</h1>
      <p className="text-[13px] text-text-secondary leading-[1.6] max-w-[70ch] mb-8">
        {withPhoto} of {rows.length} ingredients have a photo the fetcher is confident about. The rest are
        below — either it found nothing, or the match is a guess. Paste a URL or upload a file and it gets
        fetched, background-removed and squared the same way the batch did, so it sits on the board like the
        others. Anything still without a photo falls back to the drawn motif.{" "}
        <Link href="/charcuterie/studio" className="tlink">
          Back to the studio
        </Link>
      </p>
      <PhotoDesk rows={rows} />
    </div>
  );
}
