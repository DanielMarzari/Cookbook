'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChevronLeft } from 'lucide-react';
import { api } from '@/lib/api-client';

// Readers pull in pdf.js / epub.js which touch window — client-only.
const PdfReader = dynamic(() => import('@/components/books/PdfReader'), { ssr: false, loading: () => <ReaderSkeleton /> });
const EpubReader = dynamic(() => import('@/components/books/EpubReader'), { ssr: false, loading: () => <ReaderSkeleton /> });

const ReaderSkeleton = () => <div className="border border-border bg-[#f0efec]" style={{ height: 560 }} />;
type Book = Awaited<ReturnType<typeof api.books.get>>;

export default function BookReaderPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.books.get(id).then(setBook).catch(() => setNotFound(true));
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-8 pb-5">
        <Link href="/books" className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text mb-4">
          <ChevronLeft size={15} /> Bookshelf
        </Link>
        {notFound ? (
          <p className="text-text-secondary">This book is no longer on your shelf.</p>
        ) : book ? (
          <>
            <h1 className="text-[26px] md:text-[32px] tracking-[-0.01em] text-text leading-tight">{book.title}</h1>
            {book.author && <p className="text-text-secondary text-[14px] mt-1">{book.author}</p>}
          </>
        ) : (
          <p className="text-text-secondary text-sm">Loading…</p>
        )}
      </div>

      {book && (book.format === 'pdf'
        ? <PdfReader bookId={book.id} title={book.title} />
        : <EpubReader bookId={book.id} title={book.title} />)}
    </div>
  );
}
