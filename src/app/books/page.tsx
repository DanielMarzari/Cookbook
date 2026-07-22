'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Upload, Loader, Trash2, BookOpen } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from '@/lib/toast';

type Book = Awaited<ReturnType<typeof api.books.list>>[number];

const fmtSize = (b: number) => (b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.round(b / 1e3) + ' KB');
// a stable, muted spine colour per book so the shelf reads as a shelf
const SPINES = ['#3f4a3a', '#4a3f3a', '#3a444a', '#463a4a', '#4a463a', '#3a4a45'];
const spine = (id: string) => SPINES[[...id].reduce((h, c) => (h + c.charCodeAt(0)) % SPINES.length, 0)];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.books.list().then(setBooks).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const onFile = async (file: File) => {
    if (!/\.(pdf|epub)$/i.test(file.name)) { toast.error('Please choose a PDF or EPUB file'); return; }
    if (file.size > 60 * 1024 * 1024) { toast.error('File is larger than 60MB'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', file.name.replace(/\.(pdf|epub)$/i, ''));
      const res = await fetch('/api/books', { method: 'POST', body: fd });
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
      toast.success('Book added to your shelf');
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const remove = async (b: Book) => {
    if (!confirm(`Remove “${b.title}” from your shelf?`)) return;
    await api.books.delete(b.id);
    setBooks((bs) => bs.filter((x) => x.id !== b.id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-10 md:pt-16 pb-6 flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-text-secondary mb-3">Your bookshelf</p>
          <h1 className="text-[34px] md:text-[52px] leading-[1.02] tracking-[-0.02em] font-normal text-text mb-4">Cookbooks</h1>
          <p className="text-[16px] leading-[1.6] text-[#3A3A3A] max-w-[62ch]">
            Import PDFs or EPUBs of cookbooks you own, read them here, and scan any page to pull a recipe into your collection.
          </p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept=".pdf,.epub,application/pdf,application/epub+zip" className="hidden"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading}
            className="inline-flex items-center gap-2 bg-text text-white px-4 py-2.5 text-[14px] disabled:opacity-60">
            {uploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Uploading…' : 'Import a book'}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading…</p>
      ) : books.length === 0 ? (
        <button onClick={() => fileRef.current?.click()}
          className="w-full border border-dashed border-border p-14 text-center hover:border-text transition-colors">
          <Upload className="mx-auto text-text-secondary mb-3" size={22} />
          <p className="text-text-secondary text-[15px]">Import your first cookbook — a PDF or EPUB you own (Noma, Masa…).</p>
        </button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {books.map((b) => (
            <div key={b.id} className="group relative">
              <Link href={`/books/${b.id}`} className="block">
                <div className="aspect-[3/4] relative overflow-hidden shadow-warm-lg" style={{ background: spine(b.id) }}>
                  <div className="absolute inset-y-0 left-0 w-[6px] bg-black/25" />
                  <div className="absolute inset-0 flex flex-col justify-between p-3.5 text-white">
                    <span className="text-[10px] uppercase tracking-[0.15em] opacity-70">{b.format}</span>
                    <div>
                      <div className="text-[15px] leading-tight font-medium line-clamp-4">{b.title}</div>
                      {b.author && <div className="text-[11.5px] opacity-75 mt-1">{b.author}</div>}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex items-center justify-between mt-2">
                <span className="inline-flex items-center gap-1 text-[12px] text-text-secondary"><BookOpen size={13} /> Read</span>
                <button onClick={() => remove(b)} className="text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove">
                  <Trash2 size={14} />
                </button>
              </div>
              <p className="text-[11px] text-text-secondary">{fmtSize(b.size_bytes)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
