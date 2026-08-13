"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BoardFills } from "@/lib/charcuterie/types";
import type { Placement } from "@/lib/charcuterie/store";

/** Save the current board to the Cookbook database, and reflect whether you're
 *  editing something already saved. Kept deliberately small: one text field and
 *  one button, in the site's underline-as-affordance idiom. */
export function SaveBoardBar({
  boardId,
  patternId,
  mode,
  guests,
  garnish,
  fills,
  placements,
  itemCount,
  suggestedName,
  editingId = null,
}: {
  boardId: string;
  patternId: string;
  mode: "zones" | "freeform";
  guests?: number;
  garnish?: boolean;
  fills?: BoardFills;
  placements?: Placement[];
  itemCount: number;
  suggestedName: string;
  /** Set when you arrived via ?board=… — makes Save an Update. */
  editingId?: string | null;
}) {
  const router = useRouter();

  const [name, setName] = useState(suggestedName);
  const [savedId, setSavedId] = useState<string | null>(editingId);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  // Follow the generated name until you type your own.
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!touched) setName(suggestedName);
  }, [suggestedName, touched]);

  async function save() {
    if (itemCount === 0) return;
    setState("saving");
    setMessage("");
    try {
      const res = await fetch("/api/charcuterie/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: savedId ?? undefined,
          name: name.trim() || suggestedName,
          boardId,
          patternId,
          mode,
          guests,
          garnish,
          fills,
          placements,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSavedId(data.board.id);
      setState("saved");
      setMessage(savedId ? "Updated" : "Saved");
      router.refresh();
      setTimeout(() => setState("idle"), 2200);
    } catch (e) {
      setState("error");
      setMessage(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setTouched(true);
        }}
        placeholder="Name this board"
        className="min-w-0 flex-1 border-b border-border bg-transparent pb-1 text-[15px] text-text placeholder:text-[#b0b0b0] focus:border-text focus:outline-none"
      />

      <button
        type="button"
        onClick={save}
        disabled={itemCount === 0 || state === "saving"}
        className="tlink text-sm text-text disabled:cursor-not-allowed disabled:text-[#c4c4c4] disabled:no-underline"
      >
        {state === "saving"
          ? "Saving…"
          : savedId
            ? "Update saved board"
            : "Save to Cookbook"}
      </button>

      {message && (
        <span
          className={`text-[12.5px] ${
            state === "error" ? "text-red-600" : "text-text-secondary"
          }`}
        >
          {message}
        </span>
      )}

      {itemCount === 0 && (
        <span className="text-[12.5px] text-[#9a9a9a]">
          Put something on the board first.
        </span>
      )}
    </div>
  );
}
