'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star, Camera, Trash2, Plus, Loader, X } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from '@/lib/toast';
import { CookLog } from '@/lib/types';

/**
 * Downscale an uploaded image to a max dimension and return a JPEG data URL.
 * Result photos are stored inline in the DB (no object storage on the box), so
 * we keep them small (~800px / q0.7 ≈ tens of KB) before saving.
 */
function fileToResizedDataUrl(file: File, maxDim = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('Could not load image'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas unsupported'));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

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

export default function CookLogSection({ recipeId }: { recipeId: string }) {
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
  };

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
      const created = await api.cookLogs.create({
        recipe_id: recipeId,
        cooked_at: new Date(cookedAt).toISOString(),
        rating: rating || undefined,
        notes: notes.trim() || undefined,
        photo_url: photo || undefined,
      });
      setLogs((prev) => [created, ...prev]);
      toast.success('Cook logged');
      resetForm();
    } catch (err) {
      console.error('Error saving cook log:', err);
      toast.error('Failed to log cook');
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

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

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

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving && <Loader size={16} className="animate-spin" />} Save
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
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-1 text-text-secondary hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Delete entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {log.rating ? <div className="mt-1"><StarRating value={log.rating} readOnly size={16} /></div> : null}
                {log.notes && <p className="text-sm text-text-secondary mt-1 whitespace-pre-wrap">{log.notes}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
