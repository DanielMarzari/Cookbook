'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api-client';
import { Recipe } from '@/lib/types';
import { toast } from '@/lib/toast';

type Row = Recipe & { saving?: boolean };

/**
 * Sorting the shelf from the library.
 *
 * `is_mine` was inferred from provenance when the column was added — anything
 * imported from a URL or PDF was assumed to be someone else's. That guess is
 * roughly right and definitely wrong in places, and correcting it one recipe at a
 * time through the editor would be tedious. This is the whole collection in one
 * list, with the evidence that informed the guess shown next to each row.
 */
export default function TriagePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine' | 'elsewhere'>('all');

  useEffect(() => {
    api.recipes
      .list()
      .then((rs) => setRows(rs.filter((r) => !r.parent_recipe_id)))
      .catch(() => toast.error('Could not load recipes'))
      .finally(() => setLoading(false));
  }, []);

  const setMine = async (id: string, mine: boolean) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, is_mine: mine, saving: true } : r)));
    try {
      await api.recipes.update(id, { is_mine: mine });
    } catch {
      toast.error('Could not save that one');
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, is_mine: !mine } : r)));
    } finally {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, saving: false } : r)));
    }
  };

  const shown = rows.filter((r) =>
    filter === 'all' ? true : filter === 'mine' ? r.is_mine : !r.is_mine
  );
  const mineCount = rows.filter((r) => r.is_mine).length;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-8 pb-6">
        <h1 className="text-[30px] tracking-[-0.02em] mb-2">Whose recipe is whose</h1>
        <p className="text-[13.5px] text-text-secondary leading-[1.6] max-w-[64ch]">
          Only recipes marked <b className="font-normal text-text">mine</b>{' '}appear on the home shelf.
          Everything else stays in search, collections and the planner &mdash; it&rsquo;s shelved, not hidden.
          These were guessed from where each recipe came from; correct any of them here.
        </p>
      </div>

      <div className="flex items-baseline justify-between border-b border-text pb-2.5 mb-1">
        <div className="flex items-center gap-5 text-[13px]">
          {(['all', 'mine', 'elsewhere'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`transition-colors ${
                filter === f ? 'text-text underline underline-offset-4 decoration-1' : 'text-text-secondary hover:text-text'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="text-[12.5px] text-text-secondary tabular-nums">
          {mineCount} of {rows.length} on the shelf
        </span>
      </div>

      {loading ? (
        <p className="text-[13px] text-text-secondary py-8">Loading&hellip;</p>
      ) : (
        shown.map((r) => {
          // the evidence behind the original guess, so a wrong one is obvious
          const provenance = [r.source_name, r.source_author].filter(Boolean).join(' &middot; ');
          return (
            <div key={r.id} className="grid grid-cols-[44px_minmax(0,1fr)_auto] gap-4 items-center py-3 border-b border-border">
              <span className="relative block w-11 h-14 bg-[#F4F4F4] overflow-hidden">
                {r.image_url && <Image src={r.image_url} alt="" fill sizes="44px" className="object-cover" />}
              </span>
              <span className="min-w-0">
                <Link href={`/recipes/${r.id}`} className="block text-[14.5px] text-text truncate hover:underline underline-offset-4 decoration-1">
                  {r.title}
                </Link>
                <span className="block text-[11.5px] text-text-secondary truncate mt-0.5">
                  {provenance ? <span dangerouslySetInnerHTML={{ __html: provenance }} /> : 'no source recorded'}
                  {r.source_url ? ' · has a link' : ''}
                </span>
              </span>
              <span className="flex gap-1.5">
                {([[true, 'Mine'], [false, 'Elsewhere']] as const).map(([v, label]) => (
                  <button
                    key={label}
                    onClick={() => setMine(r.id, v)}
                    disabled={r.saving}
                    aria-pressed={!!r.is_mine === v}
                    className={`px-3 py-1.5 border text-[12.5px] transition-colors disabled:opacity-50 ${
                      !!r.is_mine === v
                        ? 'bg-text border-text text-white'
                        : 'border-border text-text-secondary hover:text-text hover:border-text'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
