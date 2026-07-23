'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, X, Upload, Loader } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '@/lib/types';
import { api } from '@/lib/api-client';
import { toast } from '@/lib/toast';
import { extractCover } from '@/lib/book-cover';

type Book = Awaited<ReturnType<typeof api.books.list>>[number];

// muted spine colours so the shelf reads like a shelf of books
const SPINES = ['#3f4a3a', '#4a3f3a', '#3a444a', '#463a4a', '#4a463a', '#3a4a45', '#42423a'];
const spineOf = (id: string) => SPINES[[...id].reduce((h, c) => (h + c.charCodeAt(0)) % SPINES.length, 0)];

export default function CookbooksPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [nc, setNc] = useState({ name: '', subtitle: '', description: '', cover_image_url: '', auto_filter_field: '', auto_filter_value: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [cols, bks] = await Promise.all([api.collections.list().catch(() => []), api.books.list().catch(() => [])]);
      setCollections(cols || []);
      setBooks(bks || []);
      const c: Record<string, number> = {};
      for (const col of cols || []) {
        try { c[col.id] = (await api.collectionRecipes.list(col.id))?.length || 0; } catch { c[col.id] = 0; }
      }
      setCounts(c);
    } finally { setLoading(false); }
  };

  const createCollection = async () => {
    if (!nc.name.trim()) return;
    try {
      const data = await api.collections.create({
        name: nc.name, subtitle: nc.subtitle || undefined, description: nc.description || undefined,
        cover_image_url: nc.cover_image_url || undefined, auto_filter_field: nc.auto_filter_field || undefined,
        auto_filter_value: nc.auto_filter_value || undefined, color: 'bg-amber-100',
      });
      setCollections([data, ...collections]);
      setCounts({ ...counts, [data.id]: 0 });
      setNc({ name: '', subtitle: '', description: '', cover_image_url: '', auto_filter_field: '', auto_filter_value: '' });
      setShowNew(false);
    } catch { toast.error('Could not create cookbook'); }
  };

  const onFile = async (file: File) => {
    if (!/\.(pdf|epub)$/i.test(file.name)) { toast.error('Please choose a PDF or EPUB file'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', file.name.replace(/\.(pdf|epub)$/i, ''));
      const res = await fetch('/api/books', { method: 'POST', body: fd });
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
      const created = await res.json();
      toast.success('Book added to your shelf');
      load();
      // Pull the book's own cover (EPUB cover / PDF first page) in the background.
      extractCover(file).then((cover) => { if (cover) api.books.setCover(created.id, cover).then(() => load()); }).catch(() => {});
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      <input ref={fileRef} type="file" accept=".pdf,.epub,application/pdf,application/epub+zip" className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />

      <div className="pt-10 md:pt-16 pb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] text-text-secondary mb-3">Your shelf</p>
        <h1 className="text-[34px] md:text-[52px] leading-[1.02] tracking-[-0.02em] font-normal text-text mb-4">Cookbooks</h1>
        <p className="text-[16px] leading-[1.6] text-[#3A3A3A] max-w-[64ch]">
          Your own collections of recipes and the PDF/EPUB cookbooks you&rsquo;ve imported — all on one shelf. Open a blank
          book to start a new one, or import a book you own.
        </p>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
          {/* add-new blank books first */}
          <button onClick={() => setShowNew(true)} className="group text-left">
            <div className="aspect-[3/4] border border-dashed border-border grid place-items-center hover:border-text transition-colors">
              <div className="text-center text-text-secondary group-hover:text-text">
                <Plus size={26} className="mx-auto mb-2" strokeWidth={1.5} />
                <span className="text-[13px]">New cookbook</span>
              </div>
            </div>
            <p className="text-[12px] text-text-secondary mt-2">a collection of your recipes</p>
          </button>

          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="group text-left">
            <div className="aspect-[3/4] border border-dashed border-border grid place-items-center hover:border-text transition-colors">
              <div className="text-center text-text-secondary group-hover:text-text">
                {uploading ? <Loader size={24} className="mx-auto mb-2 animate-spin" /> : <Upload size={24} className="mx-auto mb-2" strokeWidth={1.5} />}
                <span className="text-[13px]">{uploading ? 'Uploading…' : 'Import a book'}</span>
              </div>
            </div>
            <p className="text-[12px] text-text-secondary mt-2">a PDF or EPUB you own</p>
          </button>

          {/* imported books */}
          {books.map((b) => (
            <Link key={b.id} href={`/books/${b.id}`} className="group">
              <div className="aspect-[3/4] relative overflow-hidden shadow-warm-lg" style={{ background: spineOf(b.id) }}>
                {b.cover && <img src={b.cover} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />}
                <div className="absolute inset-y-0 left-0 w-[6px] bg-black/25 z-10" />
                {b.cover
                  ? <span className="absolute top-2.5 left-3.5 z-10 text-[10px] uppercase tracking-[0.15em] text-white/80 drop-shadow">{b.format}</span>
                  : (
                    <div className="absolute inset-0 flex flex-col justify-between p-3.5 text-white">
                      <span className="text-[10px] uppercase tracking-[0.15em] opacity-70">{b.format}</span>
                      <div>
                        <div className="text-[15px] leading-tight font-medium line-clamp-4">{b.title}</div>
                        {b.author && <div className="text-[11.5px] opacity-75 mt-1">{b.author}</div>}
                      </div>
                    </div>
                  )}
              </div>
              <p className="text-[12px] text-text-secondary mt-2 group-hover:text-text truncate">{b.cover ? b.title : 'Read →'}</p>
            </Link>
          ))}

          {/* recipe collections */}
          {collections.map((c) => (
            <Link key={c.id} href={`/collections/${c.id}`} className="group">
              <div className="aspect-[3/4] relative overflow-hidden shadow-warm-lg" style={{ background: c.cover_image_url ? '#222' : spineOf(c.id) }}>
                <div className="absolute inset-y-0 left-0 w-[6px] bg-black/25 z-10" />
                {c.cover_image_url && (
                  <>
                    <Image src={c.cover_image_url} alt={c.name} fill sizes="240px" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  </>
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-3.5 text-white z-10">
                  <div className="text-[15px] leading-tight font-medium line-clamp-4">{c.name}</div>
                  {c.subtitle && <div className="text-[11.5px] opacity-80 italic mt-1">{c.subtitle}</div>}
                  <div className="text-[11px] opacity-70 mt-1">{counts[c.id] || 0} {(counts[c.id] || 0) === 1 ? 'recipe' : 'recipes'}</div>
                </div>
              </div>
              <p className="text-[12px] text-text-secondary mt-2 group-hover:text-text">Open →</p>
            </Link>
          ))}
        </div>
      )}

      {/* New cookbook modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNew(false)}>
          <div className="bg-white shadow-warm-lg p-6 max-w-md w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-text">New cookbook</h3>
              <button onClick={() => setShowNew(false)} className="p-2 hover:bg-[#f6f6f4]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <Field label="Title *"><input type="text" placeholder="e.g. Weeknight Dinners" value={nc.name} onChange={(e) => setNc({ ...nc, name: e.target.value })} className={inputCls} autoFocus /></Field>
              <Field label="Subtitle"><input type="text" placeholder="e.g. Fast & good" value={nc.subtitle} onChange={(e) => setNc({ ...nc, subtitle: e.target.value })} className={inputCls} /></Field>
              <Field label="Description"><textarea placeholder="What's this cookbook about?" value={nc.description} onChange={(e) => setNc({ ...nc, description: e.target.value })} className={`${inputCls} resize-none h-20`} /></Field>
              <Field label="Cover image URL"><input type="url" placeholder="https://…" value={nc.cover_image_url} onChange={(e) => setNc({ ...nc, cover_image_url: e.target.value })} className={inputCls} /></Field>
              <div className="bg-[#f6f6f4] p-4">
                <label className="block text-[13px] font-medium text-text mb-1">Auto-add recipes (optional)</label>
                <p className="text-[12px] text-text-secondary mb-3">New recipes matching this filter get added automatically.</p>
                <div className="grid grid-cols-2 gap-2">
                  <select value={nc.auto_filter_field} onChange={(e) => setNc({ ...nc, auto_filter_field: e.target.value, auto_filter_value: '' })} className="px-3 py-2 border border-border bg-white text-sm">
                    <option value="">No filter</option>
                    <option value="cuisine_type">Cuisine</option>
                    <option value="source_name">Source</option>
                    <option value="source_author">Author</option>
                  </select>
                  {nc.auto_filter_field && (
                    <input type="text" placeholder={nc.auto_filter_field === 'cuisine_type' ? 'e.g. Italian' : 'e.g. The Nosher'} value={nc.auto_filter_value} onChange={(e) => setNc({ ...nc, auto_filter_value: e.target.value })} className="px-3 py-2 border border-border bg-white text-sm" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNew(false)} className="flex-1 px-4 py-2.5 border border-border text-text hover:bg-[#f6f6f4]">Cancel</button>
              <button onClick={createCollection} disabled={!nc.name.trim()} className="flex-1 px-4 py-2.5 bg-text text-white disabled:opacity-50">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 border border-border bg-white text-text placeholder-text-secondary focus:outline-none focus:border-text';
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-[13px] font-medium text-text-secondary mb-1.5">{label}</label>{children}</div>;
}
