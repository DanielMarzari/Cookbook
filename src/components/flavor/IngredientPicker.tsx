'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { cap } from '@/lib/flavor';

export type PickIng = { id: number; name: string; category: string };

// Small typeahead over the note-ingredient list, reused by every Flavor Lab tab
// that needs the user to choose an ingredient.
export default function IngredientPicker({
  ingredients, onSelect, placeholder = 'Search an ingredient…', autoFocus = false,
}: {
  ingredients: PickIng[];
  onSelect: (i: PickIng) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState('');
  const suggestions = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (s.length < 2) return [];
    const starts: PickIng[] = [], has: PickIng[] = [];
    for (const i of ingredients) {
      const n = i.name.toLowerCase();
      if (n.startsWith(s)) starts.push(i);
      else if (n.includes(s)) has.push(i);
      if (starts.length >= 8) break;
    }
    return [...starts, ...has].slice(0, 8);
  }, [q, ingredients]);

  return (
    <div className="relative">
      <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary" size={16} strokeWidth={1.8} />
      <input
        value={q}
        autoFocus={autoFocus}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-7 pr-2 py-2 bg-transparent border-0 border-b border-border focus:border-text text-[15px] placeholder:text-text-secondary transition-colors"
      />
      {suggestions.length > 0 && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-border shadow-warm-lg max-h-72 overflow-auto">
          {suggestions.map((s) => (
            <button key={s.id} onClick={() => { onSelect(s); setQ(''); }}
              className="flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left hover:bg-[#F6F6F4] text-[14.5px]">
              <span className="text-text">{cap(s.name)}</span>
              <span className="text-[12px] text-text-secondary lowercase">{s.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
