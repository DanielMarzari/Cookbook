'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ScanLine, Loader } from 'lucide-react';
import { toast } from '@/lib/toast';

// pdf.js is ESM + needs a worker; the worker is copied to /public at build time.
import * as pdfjsLib from 'pdfjs-dist';
if (typeof window !== 'undefined') pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfReader({ bookId, title }: { bookId: string; title: string }) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<any>(null);
  const renderTask = useRef<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  // load the document once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdf = await pdfjsLib.getDocument(`/api/books/${bookId}/file`).promise;
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setLoading(false);
      } catch (e) {
        console.error(e);
        toast.error('Could not open this PDF');
        setLoading(false);
      }
    })();
    return () => { cancelled = true; try { pdfRef.current?.destroy(); } catch {} };
  }, [bookId]);

  const renderPage = useCallback(async (n: number) => {
    const pdf = pdfRef.current, canvas = canvasRef.current, wrap = wrapRef.current;
    if (!pdf || !canvas || !wrap) return;
    try { renderTask.current?.cancel(); } catch {}
    const p = await pdf.getPage(n);
    const base = p.getViewport({ scale: 1 });
    const scale = Math.min(2, (wrap.clientWidth - 4) / base.width);
    const viewport = p.getViewport({ scale });
    const ctx = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    renderTask.current = p.render({ canvasContext: ctx, viewport });
    try { await renderTask.current.promise; } catch { /* cancelled */ }
  }, []);

  useEffect(() => { if (!loading) renderPage(page); }, [page, loading, renderPage]);
  // re-render on resize
  useEffect(() => {
    const onResize = () => !loading && renderPage(page);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [page, loading, renderPage]);

  const go = (d: number) => setPage((p) => Math.min(numPages, Math.max(1, p + d)));

  const scan = async () => {
    setScanning(true);
    try {
      const pdf = pdfRef.current;
      // grab this page plus the next (recipes often span a spread), lightly.
      const texts: string[] = [];
      for (const n of [page, page + 1].filter((n) => n <= numPages)) {
        const p = await pdf.getPage(n);
        const tc = await p.getTextContent();
        // Reconstruct line breaks: pdf.js flags end-of-line items with hasEOL,
        // otherwise the whole page collapses to one line and the parser fails.
        let s = '';
        for (const it of tc.items as any[]) {
          if (!('str' in it)) continue;
          s += it.str + (it.hasEOL ? '\n' : ' ');
        }
        texts.push(s);
      }
      const text = texts.join('\n').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
      if (text.length < 40) { toast.error('No readable text on this page (it may be a scanned image).'); return; }
      sessionStorage.setItem('cookbookScan', JSON.stringify({ text, book: title, page }));
      router.push('/add-recipe');
    } catch (e) {
      toast.error('Could not read this page');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={() => go(-1)} disabled={page <= 1} className="p-2 border border-border disabled:opacity-40 hover:border-text"><ChevronLeft size={16} /></button>
          <span className="text-[13px] text-text-secondary tabular-nums min-w-[6rem] text-center">
            {loading ? '…' : `Page ${page} / ${numPages}`}
          </span>
          <button onClick={() => go(1)} disabled={page >= numPages} className="p-2 border border-border disabled:opacity-40 hover:border-text"><ChevronRight size={16} /></button>
        </div>
        <button onClick={scan} disabled={scanning || loading}
          className="inline-flex items-center gap-2 bg-text text-white px-4 py-2 text-[13.5px] disabled:opacity-60">
          {scanning ? <Loader size={15} className="animate-spin" /> : <ScanLine size={15} />}
          Scan this page → recipe
        </button>
      </div>
      <div ref={wrapRef} className="bg-[#f0efec] border border-border flex justify-center p-2 md:p-4 overflow-auto" style={{ minHeight: 400 }}>
        {loading ? <div className="py-24 text-text-secondary text-sm">Opening book…</div> : <canvas ref={canvasRef} className="shadow-warm-lg max-w-full h-auto" />}
      </div>
      <p className="text-[11.5px] text-text-secondary mt-2">Scan reads this page and the next (a recipe spread), then drops the text into the recipe editor to refine and save.</p>
    </div>
  );
}
