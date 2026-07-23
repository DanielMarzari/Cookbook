// Extract a small cover thumbnail (data URI) from a book file, client-side.
// EPUB → its own cover image; PDF → the first page rendered. Best-effort: returns
// null if no cover can be produced.

async function blobToScaledDataUri(blob: Blob, maxW = 360): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

async function epubCover(file: File): Promise<string | null> {
  try {
    const ePub = (await import('epubjs')).default;
    const book = ePub(await file.arrayBuffer());
    await book.ready;
    const coverUrl = await book.coverUrl();
    book.destroy();
    if (!coverUrl) return null;
    const blob = await (await fetch(coverUrl)).blob();
    return blobToScaledDataUri(blob);
  } catch { return null; }
}

async function pdfCover(file: File): Promise<string | null> {
  try {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    const pdf = await pdfjs.getDocument(await file.arrayBuffer()).promise;
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const scale = 360 / base.width;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width; canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
    pdf.destroy();
    return canvas.toDataURL('image/jpeg', 0.72);
  } catch { return null; }
}

export async function extractCover(file: File): Promise<string | null> {
  return /\.epub$/i.test(file.name) ? epubCover(file) : pdfCover(file);
}
