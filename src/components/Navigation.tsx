'use client';

import {
  BookOpen,
  Plus,
  ChefHat,
  Leaf,
  ShoppingCart,
  Heart,
  Library,
  CalendarDays,
  Sparkles,
  Sprout,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCookbookStore } from '@/lib/store';

const navItems = [
  { icon: BookOpen, label: 'Recipes', href: '/' },
  { icon: CalendarDays, label: 'Planner', href: '/planner' },
  { icon: Sparkles, label: 'Flavor Lab', href: '/flavor' },
  { icon: Sprout, label: 'Seasonal', href: '/seasonal' },
  { icon: ChefHat, label: 'Techniques', href: '/techniques' },
  { icon: Leaf, label: 'Ingredients', href: '/ingredients' },
  { icon: ShoppingCart, label: 'Grocery', href: '/grocery' },
  { icon: Library, label: 'Cookbooks', href: '/collections' },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const setFilters = useCookbookStore((state) => state.setFilters);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const focusSearch = () => {
    // Jump to the recipes page and focus its search field.
    if (pathname !== '/') {
      router.push('/');
      setFilters({ search: '' });
    }
    setTimeout(() => {
      document.getElementById('recipe-search')?.focus();
    }, 60);
  };

  return (
    <>
      {/* Top header — all viewports; links hidden on small screens */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-8 h-[60px]">
          <Link href="/" className="flex items-center gap-2 text-[17px] tracking-tight text-text">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 11l8-7 8 7" />
              <path d="M6 9.5V20h12V9.5" />
            </svg>
            cookbook
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`pb-0.5 border-b transition-colors ${
                  isActive(item.href)
                    ? 'border-text text-text'
                    : 'border-transparent text-text hover:border-text'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={focusSearch}
              aria-label="Search recipes"
              className="p-1.5 text-text hover:text-text-secondary transition-colors"
            >
              <Search size={17} strokeWidth={1.8} />
            </button>
            <Link
              href="/add-recipe"
              aria-label="Add recipe"
              className="p-1.5 text-text hover:text-text-secondary transition-colors"
            >
              <Plus size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 transition-colors ${
                  active ? 'text-text' : 'text-text-secondary'
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2 : 1.6} className="mb-0.5" />
                <span className={`text-[10px] truncate max-w-full px-1 ${active ? 'underline underline-offset-2' : ''}`}>
                  {item.label.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
