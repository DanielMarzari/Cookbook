'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star, Camera, Trash2, Plus, Loader, X, Pencil, SlidersHorizontal } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from '@/lib/toast';
import { fileToResizedDataUrl } from '@/lib/photo';
import { CookAdjustment, CookLog, RecipeIngredient } from '@/lib/types';

function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 20,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n === value ? 0 : n)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={n <= value ? 'fill-yellow-400 text-yellow-400' : 'text-border'}
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Logging a cook, including what you'd measure differently next time.
 *
 * The adjustments live on the entry rather than on the recipe, because trying
 * something once is not the same as deciding it. The recipe stays as written
 * until you say otherwise; the log just remembers that last time you used less
 * sugar and liked it.
 */
export default function CookLogSection({
  recipeId,
  ingredients = [],
}: {
  recipeId: string;
  ingredients?: RecipeIngredient[];
}) {
  const [logs, setLogs] = useState<CookLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const [cookedAt, setCookedAt] = useState(today);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  // id of the entry being edited, or null when the form is writing a new one
  const [editingId, setEditingId] = useState<string | null>(null);
  // ingredient name -> what you'd use next time, as typed
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [showAmounts, setShowAmounts] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLogs(await api.cookLogs.list(recipeId));
      } catch (err) {
        console.error('Error loading cook logs:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [recipeId]);

  const resetForm = () => {
    setCookedAt(today);
    setRating(0);
    setNotes('');
    setPhoto(null);
    setAdding(false);
    setEditingId(null);
    setAmounts({});
    setShowAmounts(false);
  };

  /** Load an existing entry back into the form. */
  const startEdit = (log: CookLog) => {
    setEditingId(log.id);
    setCookedAt(log.cooked_at.slice(0, 10));
    setRating(log.rating ?? 0);
    setNotes(log.notes ?? '');
    setPhoto(log.photo_url ?? null);
    const next: Record<string, string> = {};
    for (const a of log.adjustments ?? []) next[a.name] = String(a.used);
    setAmounts(next);
    setShowAmounts((log.adjustments ?? []).length > 0);
    setAdding(true);
  };

  /** Only the ingredients you actually changed become adjustments. */
  const collectAdjustments = (): CookAdjustment[] =>
    ingredients
      .map((ing) => {
        const typed = amounts[ing.name];
        if (typed === undefined || typed.trim() === '') return null;
        const used = Number(typed);
        if (!Number.isFinite(used) || used === ing.quantity) return null;
        return { name: ing.name, unit: ing.unit, was: ing.quantity, used };
      })
      .filter((a): a is CookAdjustment => a !== null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    try {
      setPhoto(await fileToResizedDataUrl(file));
    } catch (err) {
      console.error('Error processing photo:', err);
      toast.error('Could not process that image');
    } finally {
      setPhotoBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        // Store the day, not an instant. Converting to an ISO timestamp makes
        // it UTC midnight, which is the previous day in every timezone west of
        // Greenwich — so a cook logged today comes back as yesterday.
        cooked_at: cookedAt,
        rating: rating || undefined,
        notes: notes.trim() || undefined,
        photo_url: photo || undefined,
        adjustments: collectAdjustments(),
      };

      if (editingId) {
        const updated = await api.cookLogs.update({ id: editingId, ...payload });
        setLogs((prev) => prev.map((l) => (l.id === editingId ? updated : l)));
        toast.success('Entry updated');
      } else {
        const created = await api.cookLogs.create({ recipe_id: recipeId, ...payload });
        setLogs((prev) => [created, ...prev]);
        toast.success('Cook logged');
      }
      resetForm();
    } catch (err) {
      console.error('Error saving cook log:', err);
      toast.error(editingId ? 'Failed to update entry' : 'Failed to log cook');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this cook log entry?')) return;
    try {
      const res = await api.cookLogs.delete(id);
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setLogs((prev) => prev.filter((l) => l.id !== id));
      toast.success('Entry deleted');
    } catch (err) {
      console.error('Error deleting cook log:', err);
      toast.error('Failed to delete entry');
    }
  };

  const fmtDate = (value: string) =>
    (() => {
      // A logged cook is a day, not a moment. Read the date parts directly and
      // build a local date, so the label never drifts backwards by a timezone.
      const [y, m, d] = value.slice(0, 10).split('-').map(Number);
      const local = new Date(y, (m || 1) - 1, d || 1);
      return Number.isNaN(local.getTime())
        ? value
        : local.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    })();

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-warm mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-text">Cooking Journal</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} /> Log a cook
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-6 rounded-xl border border-border p-4 bg-background/50">
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Date</label>
              <input
                type="date"
                value={cookedAt}
                max={today}
                onChange={(e) => setCookedAt(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Rating</label>
              <div className="py-1.5">
                <StarRating value={rating} onChange={setRating} size={24} />
              </div>
            </div>
          </div>

          <label className="block text-xs text-text-secondary mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tweaks, timing, what to do differently next time…"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm mb-3 resize-y"
          />

          <div className="flex items-center gap-3 mb-4">
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={photoBusy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-text hover:bg-background transition-colors disabled:opacity-50"
            >
              {photoBusy ? <Loader size={16} className="animate-spin" /> : <Camera size={16} />}
              {photo ? 'Change photo' : 'Add photo'}
            </button>
            {photo && (
              <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-border">
                <Image src={photo} alt="Result preview" fill sizes="64px" className="object-cover" />
                <button
                  onClick={() => setPhoto(null)}
                  className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5 text-white"
                  aria-label="Remove photo"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {ingredients.length > 0 && (
            <div className="border-t border-border pt-3">
              <button
                onClick={() => setShowAmounts((v) => !v)}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition-colors"
                aria-expanded={showAmounts}
              >
                <SlidersHorizontal size={15} />
                Measure something differently
              </button>

              {showAmounts && (
                <div className="mt-3">
                  <p className="text-[12.5px] text-text-secondary mb-2 max-w-[60ch]">
                    Only fill in what you&rsquo;d change. This is kept against this cook — the recipe stays
                    exactly as written until you decide otherwise.
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {ingredients.map((ing) => {
                      const typed = amounts[ing.name] ?? '';
                      const changed = typed.trim() !== '' && Number(typed) !== ing.quantity;
                      return (
                        <div key={ing.id} className="flex items-center gap-2.5 text-sm">
                          <span className="flex-1 min-w-0 truncate text-text">{ing.name}</span>
                          <span className="text-text-secondary tabular-nums whitespace-nowrap">
                            {ing.quantity} {ing.unit}
                          </span>
                          <span aria-hidden className="text-text-secondary">&rarr;</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            step="any"
                            min="0"
                            value={typed}
                            onChange={(e) => setAmounts((a) => ({ ...a, [ing.name]: e.target.value }))}
                            placeholder={String(ing.quantity)}
                            aria-label={`Amount of ${ing.name} to use next time`}
                            className={`w-24 px-2 py-1 border text-sm tabular-nums focus:outline-none focus:border-text ${
                              changed ? 'border-text text-text' : 'border-border text-text-secondary'
                            }`}
                          />
                          <span className="w-14 text-text-secondary text-[12.5px] truncate">{ing.unit}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving && <Loader size={16} className="animate-spin" />}
              {editingId ? 'Save changes' : 'Save'}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border border-border text-sm text-text hover:bg-background transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-text-secondary">Loading…</p>
      ) : logs.length === 0 ? (
        !adding && <p className="text-sm text-text-secondary">No cooks logged yet. Made this? Log it to track ratings and notes over time.</p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log) => (
            <li key={log.id} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
              {log.photo_url && (
                <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border border-border">
                  <Image src={log.photo_url} alt="Result" fill sizes="80px" className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-text">{fmtDate(log.cooked_at)}</span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(log)}
                      className="p-1 text-text-secondary hover:text-text transition-colors"
                      aria-label="Edit entry"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-1 text-text-secondary hover:text-red-500 transition-colors"
                      aria-label="Delete entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </span>
                </div>
                {log.rating ? <div className="mt-1"><StarRating value={log.rating} readOnly size={16} /></div> : null}
                {log.notes && <p className="text-sm text-text-secondary mt-1 whitespace-pre-wrap">{log.notes}</p>}
                {log.adjustments && log.adjustments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {log.adjustments.map((a) => (
                      <span key={a.name} className="text-[12.5px] text-text-secondary tabular-nums">
                        {a.name}{' '}
                        <span className="line-through">{a.was} {a.unit}</span>{' '}
                        <span className="text-text">{a.used} {a.unit}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
