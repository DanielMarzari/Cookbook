'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import PhotoTryOut from './PhotoTryOut';
import type { Motif } from '@/lib/charcuterie/types';

export interface PhotoRow {
  id: string;
  name: string;
  cat: string;
  /** 0 when nothing was ever fetched for this ingredient. */
  score: number;
  title: string;
  detail: string;
  /** How this ingredient gets arranged, so the preview matches the board. */
  motif: Motif;
  /** Already cleared for the board. */
  verified: boolean;
  /** How many curated themes use it — the reason to do this one first. */
  uses: number;
}

type Status = { kind: 'idle' } | { kind: 'busy' } | { kind: 'ok'; note: string } | { kind: 'err'; note: string };

/**
 * Fill in the ingredients the fetcher couldn't.
 *
 * Ordered worst-first, because the useful work is at the top: items with no
 * photo at all, then the ones where the match is a guess. Paste a URL or pick a
 * file and it's fetched server-side, background-keyed and stored — the same
 * treatment the batch pass gives, so a hand-added photo doesn't look pasted in
 * next to the others.
 */
export default function PhotoDesk({ rows }: { rows: PhotoRow[] }) {
  const [custom, setCustom] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Record<string, Status>>({});
  // Bumped per item to bust the browser cache after a replacement.
  const [rev, setRev] = useState<Record<string, number>>({});
  // Processed but not stored: what you're deciding about.
  const [candidate, setCandidate] = useState<Record<string, { src: string; note: string }>>({});
  const [filter, setFilter] = useState<'todo' | 'all'>('todo');

  useEffect(() => {
    fetch('/api/charcuterie/photos')
      .then((r) => r.json())
      .then((d) => setCustom(new Set(d.custom ?? [])))
      .catch(() => {});
  }, []);

  const shown = useMemo(() => {
    const list = filter === 'all' ? rows : rows.filter((r) => !r.verified && !custom.has(r.id));
    return list;
  }, [rows, filter, custom]);

  /**
   * Save straight away.
   *
   * This used to process without storing and wait for a second click to commit,
   * which quietly threw away any picture where you moved on after the first
   * one. The two-step existed to protect you from a destructive background
   * remover that no longer exists — the file is now stored as supplied, so
   * there is nothing to approve. What you get instead is the saved picture shown
   * on a board straight after, and a remove button if it is wrong.
   */
  async function send(id: string, body: FormData) {
    setStatus((s) => ({ ...s, [id]: { kind: 'busy' } }));
    try {
      const res = await fetch('/api/charcuterie/photos', { method: 'POST', body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus((s) => ({ ...s, [id]: { kind: 'err', note: data.error ?? `save failed (${res.status})` } }));
        return;
      }
      const next = (rev[id] ?? 0) + 1;
      setCustom((c) => new Set(c).add(id));
      setRev((r) => ({ ...r, [id]: next }));
      // Show what actually landed, read back from the server rather than from
      // the upload — if it renders here, it is really saved.
      setCandidate((c) => ({ ...c, [id]: { src: `/api/charcuterie/photo/${id}?v=${next}`, note: data.note ?? 'saved' } }));
      setStatus((s) => ({ ...s, [id]: { kind: 'ok', note: 'on the board' } }));
    } catch (e) {
      setStatus((s) => ({ ...s, [id]: { kind: 'err', note: (e as Error).message } }));
    }
  }

  /** Close the after-the-fact preview; the picture stays saved. */
  function dismiss(id: string) {
    setCandidate(({ [id]: _drop, ...rest }) => rest);
  }

  async function drop(id: string) {
    await fetch(`/api/charcuterie/photos?id=${id}`, { method: 'DELETE' });
    setCustom((c) => {
      const n = new Set(c);
      n.delete(id);
      return n;
    });
    setRev((r) => ({ ...r, [id]: (r[id] ?? 0) + 1 }));
    setCandidate(({ [id]: _drop, ...rest }) => rest);
    setStatus((s) => ({ ...s, [id]: { kind: 'idle' } }));
  }

  const todo = rows.filter((r) => !r.verified && !custom.has(r.id)).length;

  return (
    <div>
      <div className="flex items-baseline gap-4 mb-6">
        {(['todo', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`text-[12px] uppercase tracking-[0.11em] pb-0.5 border-b transition-colors ${
              filter === f ? 'text-text border-text' : 'text-text-secondary border-transparent hover:text-text'
            }`}
          >
            {f === 'todo' ? `Needs a picture — ${todo}` : `All ingredients — ${rows.length}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6">
        {shown.map((r) => (
          <Row
            key={r.id}
            row={r}
            hasCustom={custom.has(r.id)}
            rev={rev[r.id] ?? 0}
            status={status[r.id] ?? { kind: 'idle' }}
            candidate={candidate[r.id]}
            onSend={send}
            onDrop={drop}
            onDismiss={dismiss}
          />
        ))}
      </div>

      {shown.length === 0 && (
        <p className="text-[13px] text-text-secondary py-8">
          Nothing left needing a photo. Switch to “All ingredients” to replace one anyway.
        </p>
      )}
    </div>
  );
}

function Row({
  row: r,
  hasCustom,
  rev,
  status,
  candidate,
  onSend,
  onDrop,
  onDismiss,
}: {
  row: PhotoRow;
  hasCustom: boolean;
  rev: number;
  status: Status;
  candidate?: { src: string; note: string };
  onSend: (id: string, body: FormData) => void;
  onDrop: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const [url, setUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = status.kind === 'busy';
  const src = `/api/charcuterie/photo/${r.id}?v=${rev}`;

  return (
    <div className="flex gap-3 border-b border-border pb-5">
      <div className="w-[92px] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="w-[92px] h-[92px] object-contain bg-[#f6f6f6] border border-border"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
          }}
        />
        <span className="block text-[10.5px] uppercase tracking-[0.1em] text-text-secondary mt-1">
          {hasCustom ? 'yours · live' : r.verified ? 'live' : r.score > 0 ? 'fetched · unchecked' : 'none'}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] text-text leading-[1.3]">
          {r.name} <span className="text-[11.5px] text-text-secondary">{r.cat}</span>
          {r.uses > 0 && (
            <span className="text-[11px] text-text-secondary ml-1.5">
              · in {r.uses} theme{r.uses === 1 ? '' : 's'}
            </span>
          )}
        </p>
        {r.title && !hasCustom && (
          <p className="text-[11.5px] text-text-secondary leading-[1.4] truncate">{r.title}</p>
        )}

        <form
          className="flex gap-1.5 mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!url.trim()) return;
            const fd = new FormData();
            fd.set('itemId', r.id);
            fd.set('url', url.trim());
            onSend(r.id, fd);
            setUrl('');
          }}
        >
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste an image URL and press Save…"
            className="min-w-0 flex-1 px-2 py-1 border border-border focus:outline-none focus:border-text text-[12.5px]"
          />
          <button
            type="submit"
            disabled={busy || !url.trim()}
            className="px-2.5 py-1 border border-text text-[12px] hover:bg-text hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
        </form>

        <div className="flex items-center gap-3 mt-1.5">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const fd = new FormData();
              fd.set('itemId', r.id);
              fd.set('file', f);
              onSend(r.id, fd);
              e.target.value = '';
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="tlink text-[12px] text-text-secondary hover:text-text disabled:opacity-40"
          >
            upload a file
          </button>
          {hasCustom && (
            <button onClick={() => onDrop(r.id)} className="tlink text-[12px] text-text-secondary hover:text-text">
              remove
            </button>
          )}
          {r.detail && (
            <a href={r.detail} target="_blank" rel="noopener noreferrer" className="tlink text-[12px] text-text-secondary hover:text-text">
              source
            </a>
          )}
        </div>

        {candidate && (
          <PhotoTryOut
            itemId={r.id}
            motif={r.motif}
            src={candidate.src}
            note={candidate.note}
            onDismiss={() => onDismiss(r.id)}
            onRemove={() => onDrop(r.id)}
          />
        )}

        {status.kind !== 'idle' && (
          <p className={`text-[11.5px] mt-1.5 ${status.kind === 'err' ? 'text-text' : 'text-text-secondary'}`}>
            {busy ? 'working…' : status.kind === 'ok' ? status.note : `couldn’t use that — ${status.note}`}
          </p>
        )}
      </div>
    </div>
  );
}
