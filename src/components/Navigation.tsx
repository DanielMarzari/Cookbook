'use client';

import { useCookbookStore } from '@/lib/store';
import {
  BookOpen,
  Plus,
  ChefHat,
  Leaf,
  ShoppingCart,
  Heart,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const sidebarOpen = useCookbookStore((state) => state.sidebarOpen);
  const setSidebarOpen = useCookbookStore((state) => state.setSidebarOpen);
  const pathname = usePathname();

  const navItems = [
    { icon: BookOpen, label: 'Recipes', href: '/' },
    { icon: Plus, label: 'Add Recipe', href: '/add-recipe' },
    { icon: ChefHat, label: 'Techniques', href: '/techniques' },
    { icon: Leaf, label: 'Ingredients', href: '/ingredients' },
    { icon: ShoppingCart, label: 'Grocery', href: '/grocery' },
    { icon: Heart, label: 'Collections', href: '/collections' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className={`hidden md:flex flex-col bg-surface border-r border-border shadow-warm transition-all duration-300 h-screen sticky top-0 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-2xl font-bold text-primary">Cookbook</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="flex-1 py-4 px-2 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-background'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon
                  size={24}
                  className={`flex-shrink-0 ${
                    active ? 'text-primary' : 'text-text-secondary group-hover:text-primary'
                  }`}
                />
                {sidebarOpen && (
                  <span className={`font-medium truncate ${active ? 'text-primary' : 'text-text'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {sidebarOpen && (
          <div className="p-4 border-t border-border text-sm text-text-secondary">
            <p className="text-xs uppercase tracking-wider font-semibold mb-1">
              Cooking Awaits
            </p>
            <p className="text-xs">Discover and create delicious recipes</p>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-warm-lg z-50">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                  active ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                <Icon size={22} className="mb-1" />
                <span className="text-[10px] font-medium truncate max-w-full px-1">
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
