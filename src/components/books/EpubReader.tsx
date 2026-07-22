'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ScanLine, Loader } from 'lucide-react';
import { toast } from '@/lib/toast';
// epub.js renders an EPUB into an iframe entirely client-side.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - epubjs ships partial types
import ePub from 'epubjs';

export default function EpubReader({ bookId, title }: { bookId: string; title: string }) {
  const router = useRouter();
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);
  const rendRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!viewerRef.current) return;
    const book = ePub(`/api/books/${bookId}/file`);
    bookRef.current = book;
    const rendition = book.renderTo(viewerRef.current, { width: '100%', height: 620, flow: 'paginated', spread: 'none' });
    rendRef.current = rendition;
    rendition.display();
    book.ready.then(() => setLoading(false)).catch(() => { toast.error('Could not open this EPUB'); setLoading(false); });
    return () => { try { rendition.destroy(); book.destroy(); } catch {} };
  }, [bookId]);

  const scan = async () => {
    setScanning(true);
    try {
      const contents = rendRef.current?.getContents?.();
      const arr = Array.isArray(contents) ? contents : contents ? [contents] : [];
      const text = arr.map((c: any) => c?.document?.body?.innerText || '').join('\n').trim();
      if (text.length < 40) { toast.error('No readable text on this page.'); return; }
      sessionStorage.setItem('cookbookScan', JSON.stringify({ text, book: title, page: 0 }));
      router.push('/add-recipe');
    } catch {
      toast.error('Could not read this section');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={() => rendRef.current?.prev()} className="p-2 border border-border hover:border-text"><ChevronLeft size={16} /></button>
          <span className="text-[13px] text-text-secondary">{loading ? 'Opening…' : 'Reading'}</span>
          <button onClick={() => rendRef.current?.next()} className="p-2 border border-border hover:border-text"><ChevronRight size={16} /></button>
        </div>
        <button onClick={scan} disabled={scanning || loading}
          className="inline-flex items-center gap-2 bg-text text-white px-4 py-2 text-[13.5px] disabled:opacity-60">
          {scanning ? <Loader size={15} className="animate-spin" /> : <ScanLine size={15} />}
          Scan this page → recipe
        </button>
      </div>
      <div className="bg-white border border-border p-2 md:p-4">
        <div ref={viewerRef} style={{ minHeight: 620 }} />
      </div>
      <p className="text-[11.5px] text-text-secondary mt-2">Scan reads the visible text and drops it into the recipe editor to refine and save.</p>
    </div>
  );
}
