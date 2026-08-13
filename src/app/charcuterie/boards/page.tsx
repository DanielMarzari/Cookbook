import Link from "next/link";
import { listBoards } from "@/lib/charcuterie/store";
import { getBoard as getBoardShape, getPattern } from "@/lib/charcuterie/boards";
import { getItem, perGuestFor } from "@/lib/charcuterie/items";
import { DeleteBoardButton } from "@/components/charcuterie/DeleteBoardButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Saved boards · Cookbook" };

/** Everything you've saved, newest first. Each row previews the real board so
 *  the list reads at a glance rather than as a table of names. */
export default function SavedBoardsPage() {
  const boards = listBoards();

  if (boards.length === 0) {
    return (
      <div className="border-t border-border pt-10">
        <p className="text-[15px] text-text-secondary">
          Nothing saved yet. Build something in{" "}
          <Link href="/charcuterie/studio" className="tlink">
            the studio
          </Link>{" "}
          and give it a name.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-border">
      {boards.map((saved) => {
        const shape = getBoardShape(saved.boardId);
        const pattern = shape ? getPattern(shape, saved.patternId) : null;
        const itemIds =
          saved.mode === "zones"
            ? Object.values(saved.fills).map((f) => f.itemId)
            : saved.placements.map((p) => p.itemId);
        const items = itemIds
          .map(getItem)
          .filter((i): i is NonNullable<typeof i> => !!i);

        return (
          <article
            key={saved.id}
            className="flex flex-wrap items-start gap-6 border-b border-border py-6"
          >
            {shape && pattern && (
              <div className="w-40 shrink-0">
                <svg
                  viewBox={`0 0 ${shape.viewBox[0]} ${shape.viewBox[1]}`}
                  className="w-full"
                  aria-hidden="true"
                >
                  <path d={shape.outline} fill="#e8e4dc" />
                  {saved.mode === "zones"
                    ? pattern.zones.map((z) => {
                        const fill = saved.fills[z.id];
                        const item = fill ? getItem(fill.itemId) : undefined;
                        return (
                          <path
                            key={z.id}
                            d={z.d}
                            fill={item?.palette[0] ?? "#000000"}
                            fillOpacity={item ? 0.95 : 0.05}
                          />
                        );
                      })
                    : saved.placements.map((p, i) => {
                        const item = getItem(p.itemId);
                        if (!item) return null;
                        const [vw, vh] = shape.viewBox;
                        return (
                          <circle
                            key={i}
                            cx={(p.x / 100) * vw}
                            cy={(p.y / 100) * vh}
                            r={Math.min(vw, vh) * 0.085 * p.scale}
                            fill={item.palette[0]}
                          />
                        );
                      })}
                </svg>
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-[19px] tracking-[-0.01em] text-text">
                  {saved.name}
                </h2>
                <div className="flex items-center gap-4 text-[12.5px]">
                  <Link
                    href={`/charcuterie/${saved.mode === "freeform" ? "atelier" : "studio"}?board=${saved.id}`}
                    className="tlink text-text"
                  >
                    Open
                  </Link>
                  <DeleteBoardButton id={saved.id} name={saved.name} />
                </div>
              </div>

              <p className="mt-1 text-[12.5px] text-text-secondary">
                {shape?.name ?? saved.boardId} · {pattern?.name ?? saved.patternId} ·{" "}
                {items.length} item{items.length === 1 ? "" : "s"} · for{" "}
                {saved.guests} · saved{" "}
                {new Date(saved.updatedAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                })}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {items.map((item, i) => (
                  <span
                    key={`${item.id}-${i}`}
                    className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ background: item.palette[0] }}
                    />
                    {item.name}
                  </span>
                ))}
              </div>

              {items.length > 0 && (
                <p className="mt-3 text-[12.5px] text-[#9a9a9a]">
                  Shopping for {saved.guests}:{" "}
                  {items
                    .slice(0, 4)
                    .map((item) => {
                      const per = perGuestFor(item);
                      const amount =
                        Math.round(per.amount * saved.guests * 10) / 10;
                      return `${item.name.toLowerCase()} ${amount} ${per.unit}`;
                    })
                    .join(", ")}
                  {items.length > 4 ? "…" : ""}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
