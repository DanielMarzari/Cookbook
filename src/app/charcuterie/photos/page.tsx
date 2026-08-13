import Link from "next/link";
import PhotoDesk, { type PhotoRow } from "@/components/charcuterie/PhotoDesk";
import { ITEM_PHOTOS, VERIFIED_PHOTOS } from "@/lib/charcuterie/photos";
import { THEMES } from "@/lib/charcuterie/themes";
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
  // How many curated themes reach for this ingredient. Doing the ones that land
  // on real boards first means the work shows up immediately rather than after
  // all 202 are done.
  const uses = new Map<string, number>();
  for (const t of THEMES) {
    for (const ids of Object.values(t.picks)) {
      for (const id of ids as string[]) uses.set(id, (uses.get(id) ?? 0) + 1);
    }
  }

  const rows: PhotoRow[] = ITEMS.map((i) => {
    const p = ITEM_PHOTOS[i.id];
    return {
      id: i.id,
      name: i.name,
      cat: i.cat,
      score: p?.score ?? 0,
      title: p?.title ?? "",
      detail: p?.detail ?? "",
      verified: VERIFIED_PHOTOS.has(i.id),
      uses: uses.get(i.id) ?? 0,
    };
  }).sort(
    (a, b) =>
      Number(a.verified) - Number(b.verified) ||
      b.uses - a.uses ||
      a.name.localeCompare(b.name),
  );

  const live = rows.filter((r) => r.verified).length;

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-10">
      <h1 className="text-[26px] tracking-[-0.01em] mb-1">Ingredient photos</h1>
      <p className="text-[13px] text-text-secondary leading-[1.6] max-w-[70ch] mb-8">
        <span className="text-text">{live}</span> of {rows.length} ingredients are showing a real photo on
        the board. The rest are drawn — the automatic fetch pulled something for most of them, but on the ones
        checked so far only about one in seven was both the right subject and cleanly cut out, so nothing goes
        live until it has been looked at. Most wanted first: the ingredients the curated themes actually use.
        Paste a URL or upload a file and that ingredient goes live immediately. Studio shots on a plain white
        background cut out best.{" "}
        <Link href="/charcuterie/studio" className="tlink">
          Back to the studio
        </Link>
      </p>
      <PhotoDesk rows={rows} />
    </div>
  );
}
