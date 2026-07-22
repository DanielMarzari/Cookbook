import { redirect } from 'next/navigation';

// The bookshelf now lives on the unified Cookbooks page; keep this path working.
export default function BooksIndex() {
  redirect('/collections');
}
