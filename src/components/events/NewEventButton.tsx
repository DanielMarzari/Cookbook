'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewEventButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Dinner', event_date: new Date().toISOString().slice(0, 10) }),
      });
      const { event } = await res.json();
      router.push(`/events/${event.id}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={create}
      disabled={busy}
      className="bg-text text-background text-[13px] px-5 py-2.5 disabled:opacity-40 hover:opacity-85 transition-opacity"
    >
      {busy ? 'Starting…' : 'Plan a dinner'}
    </button>
  );
}
