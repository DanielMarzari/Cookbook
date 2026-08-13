import { BoardStudio, type Draft } from "@/components/charcuterie/BoardStudio";
import { getBoard as getSavedBoard, listPantry } from "@/lib/charcuterie/store";
import { getBoard, getPattern } from "@/lib/charcuterie/boards";
import { MONTHS } from "@/lib/charcuterie/advice";
import { seasonalPicks } from "@/lib/charcuterie/items";

export const dynamic = "force-dynamic";

export const metadata = { title: "Studio · Charcuterie · Cookbook" };

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>;
}) {
  const { board: boardParam } = await searchParams;
  // Resolved on the server so the season badge and any seasonal ranking render
  // identically on both sides of hydration.
  const month = new Date().getMonth() + 1;
  const peak = seasonalPicks(month);
  const pantryIds = listPantry();

  // Opening a saved board short-circuits the localStorage draft.
  const saved = boardParam ? getSavedBoard(boardParam) : null;
  let initial: Draft | null = null;
  if (saved && saved.mode === "zones") {
    const shape = getBoard(saved.boardId);
    initial = {
      boardId: shape?.id ?? saved.boardId,
      patternId: shape ? getPattern(shape, saved.patternId).id : saved.patternId,
      fills: saved.fills,
      pantryIds,
      guests: saved.guests,
      garnish: saved.garnish,
    };
  }

  return (
    <>
      {peak.length > 0 && (
        <p className="mb-6 text-[13px] text-text-secondary">
          <span className="text-[#a0522d]">At peak in {MONTHS[month - 1]}</span>{" "}
          — {peak.slice(0, 8).map((i) => i.name.toLowerCase()).join(", ")}.
        </p>
      )}
      <BoardStudio
        month={month}
        initial={initial}
        editingId={saved?.mode === "zones" ? saved.id : null}
        pantry={pantryIds}
      />
    </>
  );
}
