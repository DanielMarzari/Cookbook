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
import { useState } from 'react';

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useCookbookStore((state) => [
    state.sidebarOpen,
    state.setSidebarOpen,
  ]);
  const [isMobile, setIsMobile] = useState(false);

  const navItems = [
    { icon: BookOpen, label: 'Recipes', href: '/', view: 'recipes' as const },
    { icon: Plus, label: 'Add Recipe', href: '/add-recipe', view: 'add-recipe' as const },
    { icon: ChefHat, label: 'Techniques', href: '/techniques', view: 'techniques' as const },
    { icon: Leaf, label: 'Ingredients', href: '/ingredients', view: 'ingredients' as const },
    { icon: ShoppingCart, label: 'Grocery', href: '/grocery', view: 'grocery' as const },
    { icon: Heart, label: 'Collections', href: '/collections', view: 'collections' as const },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        className={`hidden md:flex flex-col bg-surface border-r border-border shadow-warm transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-2xl font-bold text-primary">Cookbook</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-background rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-2 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.view}
                href={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-background transition-colors group"
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon
                  size={24}
                  className="text-primary group-hover:text-primary-dark flex-shrink-0"
                />
                {sidebarOpen && (
                  <span className="font-medium text-text truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-border text-sm text-text-secondary">
            <p className="text-xs uppercase tracking-wider font-semibold mb-2">
              Cooking Awaits
            </p>
            <p className="text-xs">
              Discover and create delicious recipes
            </p>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border shadow-warm-lg z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.view}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-3 px-2 hover:bg-background transition-colors group"
              >
                <Icon
                  size={24}
                  className="text-primary group-hover:text-primary-dark mb-1"
                />
                <span className="text-xs font-medium text-text truncate max-w-full px-1">
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
