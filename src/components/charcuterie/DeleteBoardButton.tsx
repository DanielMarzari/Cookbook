"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Two-step delete: the first click arms it, the second does it. Cheaper than
 *  a modal and it can't fire by accident. */
export function DeleteBoardButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      await fetch(`/api/charcuterie/boards/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
      setArmed(false);
    }
  }

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className="tlink text-text-secondary hover:text-text"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="tlink text-red-600"
        aria-label={`Confirm delete ${name}`}
      >
        {busy ? "Deleting…" : "Really delete"}
      </button>
      <button
        type="button"
        onClick={() => setArmed(false)}
        className="tlink text-text-secondary"
      >
        Cancel
      </button>
    </span>
  );
}
