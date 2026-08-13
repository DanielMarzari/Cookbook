import { AtelierBuilder, type Draft } from "@/components/charcuterie/AtelierBuilder";
import { getBoard as getSavedBoard } from "@/lib/charcuterie/store";

export const dynamic = "force-dynamic";

export const metadata = { title: "Atelier · Charcuterie · Cookbook" };

export default async function AtelierPage({
  searchParams,
}: {
  searchParams: Promise<{ board?: string }>;
}) {
  const { board: boardParam } = await searchParams;
  const month = new Date().getMonth() + 1;

  const saved = boardParam ? getSavedBoard(boardParam) : null;
  let initial: Draft | null = null;
  if (saved && saved.mode === "freeform") {
    initial = {
      boardId: saved.boardId,
      placements: saved.placements.map((p, i) => ({
        id: `p${i + 1}`,
        itemId: p.itemId,
        cutIndex: p.cutIndex,
        x: p.x,
        y: p.y,
        scale: p.scale,
        rot: p.rot,
      })),
      seq: saved.placements.length + 1,
    };
  }

  return (
    <AtelierBuilder
      month={month}
      initial={initial}
      editingId={saved?.mode === "freeform" ? saved.id : null}
    />
  );
}
