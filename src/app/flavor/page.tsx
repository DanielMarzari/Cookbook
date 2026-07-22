'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { api } from '@/lib/api-client';

type Ingredient = { id: number; name: string; category: string };
type Category = { name: string; count: number };
type Pairing = { id: number; name: string; category: string; shared: number; strength: number; notes: string[] };
type PairResult = { id: number; name: string; category: string; pairings: Pairing[] };

const cap = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

// ---- radial geometry ----
const R_OUT = 148;
const R_IN = 92;
const CX = 175;
const CY = 175;
function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}
function wedgePath(a0: number, a1: number) {
  const o0 = polar(R_OUT, a0);
  const o1 = polar(R_OUT, a1);
  const i1 = polar(R_IN, a1);
  const i0 = polar(R_IN, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${o0.x} ${o0.y} A ${R_OUT} ${R_OUT} 0 ${large} 1 ${o1.x} ${o1.y} L ${i1.x} ${i1.y} A ${R_IN} ${R_IN} 0 ${large} 0 ${i0.x} ${i0.y} Z`;
}

export default function FlavorPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<PairResult | null>(null);
  const [pairingLoading, setPairingLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.flavor
      .wheel()
      .then((d) => {
        setIngredients(d.ingredients || []);
        setCategories(d.categories || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const byId = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);

  const loadPairings = async (id: number) => {
    setPairingLoading(true);
    try {
      const data = await api.flavor.pairings(id);
      setResult(data);
      setQuery('');
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    } catch {
      // ignore
    } finally {
      setPairingLoading(false);
    }
  };

  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    const starts: Ingredient[] = [];
    const contains: Ingredient[] = [];
    for (const ing of ingredients) {
      const n = ing.name.toLowerCase();
      if (n.startsWith(q)) starts.push(ing);
      else if (n.includes(q)) contains.push(ing);
      if (starts.length >= 8) break;
    }
    return [...starts, ...contains].slice(0, 8);
  }, [query, ingredients]);

  const categoryIngredients = useMemo(
    () => (activeCategory ? ingredients.filter((i) => i.category === activeCategory).sort((a, b) => a.name.localeCompare(b.name)) : []),
    [activeCategory, ingredients]
  );

  const n = categories.length;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      {/* Heading */}
      <div className="pt-10 md:pt-16 pb-6">
        <h1 className="text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-normal text-text mb-4">
          Flavors &amp; Pairings
        </h1>
        <p className="text-[16.5px] leading-[1.6] text-[#3A3A3A] max-w-[64ch]">
          What grows well together often tastes good together — and so does what shares aroma compounds.
          Spin the wheel to explore flavor families, or search an ingredient to see what it pairs with and why.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-10">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary" size={16} strokeWidth={1.8} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search an ingredient — try “lemon”, “basil”, “beef”…"
          className="w-full pl-7 pr-2 py-2 bg-transparent border-0 border-b border-border focus:border-text text-[15px] placeholder:text-text-secondary transition-colors"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-border shadow-warm-lg max-h-72 overflow-auto">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => loadPairings(s.id)}
                className="flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left hover:bg-[#F6F6F4] text-[14.5px]"
              >
                <span className="text-text">{cap(s.name)}</span>
                <span className="text-[12px] text-text-secondary lowercase">{s.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-10 lg:gap-14 items-start">
        {/* Flavor wheel */}
        <div>
          {loading ? (
            <p className="text-text-secondary text-sm">Loading…</p>
          ) : (
            <svg viewBox="-60 -6 470 372" className="w-full mx-auto select-none" role="img" aria-label="Flavor family wheel">
              {categories.map((c, idx) => {
                const a0 = (idx / n) * 360 + 0.6;
                const a1 = ((idx + 1) / n) * 360 - 0.6;
                const mid = (a0 + a1) / 2;
                const active = activeCategory === c.name || hoverCategory === c.name;
                const label = polar(R_OUT + 14, mid);
                const anchor = Math.cos(((mid - 90) * Math.PI) / 180) > 0.08 ? 'start' : Math.cos(((mid - 90) * Math.PI) / 180) < -0.08 ? 'end' : 'middle';
                return (
                  <g key={c.name}>
                    <path
                      d={wedgePath(a0, a1)}
                      fill={active ? '#111111' : '#F1EFEA'}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-colors"
                      onMouseEnter={() => setHoverCategory(c.name)}
                      onMouseLeave={() => setHoverCategory(null)}
                      onClick={() => setActiveCategory(activeCategory === c.name ? null : c.name)}
                    />
                    <text
                      x={label.x}
                      y={label.y}
                      textAnchor={anchor}
                      dominantBaseline="middle"
                      fontSize="9.5"
                      className="pointer-events-none"
                      fill={active ? '#111111' : '#767676'}
                      fontWeight={active ? 600 : 400}
                    >
                      {c.name}
                    </text>
                  </g>
                );
              })}
              {/* center */}
              <text x={CX} y={CY - 8} textAnchor="middle" fontSize="12" fill="#111111" fontWeight={600}>
                {activeCategory ? cap(activeCategory) : 'Flavor'}
              </text>
              <text x={CX} y={CY + 10} textAnchor="middle" fontSize="11" fill="#767676">
                {activeCategory ? `${categoryIngredients.length} ingredients` : 'families'}
              </text>
            </svg>
          )}

          {/* Category ingredient chips */}
          {activeCategory && (
            <div className="mt-6">
              <p className="text-[12.5px] text-text-secondary mb-2 lowercase">{activeCategory} — pick one to pair</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {categoryIngredients.map((ing) => (
                  <button
                    key={ing.id}
                    onClick={() => loadPairings(ing.id)}
                    className="text-[13.5px] text-text-secondary hover:text-text underline-offset-4 hover:underline decoration-1 cursor-pointer"
                  >
                    {cap(ing.name)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pairings panel */}
        <div ref={resultRef}>
          {pairingLoading ? (
            <p className="text-text-secondary text-sm">Finding pairings…</p>
          ) : result ? (
            <div>
              <div className="flex items-baseline justify-between border-b border-text pb-2.5 mb-1">
                <div>
                  <p className="text-[12.5px] text-text-secondary lowercase">{result.category} · pairs well with</p>
                  <h2 className="text-[26px] tracking-[-0.01em] text-text">{cap(result.name)}</h2>
                </div>
                <button onClick={() => setResult(null)} className="text-text-secondary hover:text-text" aria-label="Clear">
                  <X size={18} />
                </button>
              </div>
              <ul>
                {result.pairings.map((p) => (
                  <li key={p.id} className="border-b border-border py-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => loadPairings(p.id)}
                        className="text-[15.5px] text-text hover:underline underline-offset-4 decoration-1 text-left min-w-[9rem]"
                      >
                        {cap(p.name)}
                      </button>
                      <span className="text-[12px] text-text-secondary lowercase w-28 hidden sm:block">{p.category}</span>
                      {/* strength bar */}
                      <div className="flex-1 h-[6px] bg-[#F1EFEA] overflow-hidden max-w-[220px]">
                        <div className="h-full bg-text" style={{ width: `${p.strength}%` }} />
                      </div>
                      <span className="text-[12px] text-text-secondary tabular-nums w-16 text-right">{p.shared} shared</span>
                    </div>
                    {p.notes.length > 0 && (
                      <p className="text-[12px] text-text-secondary mt-1.5">
                        shared notes: {p.notes.map(cap).join(', ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="border border-dashed border-border p-8 text-center">
              <p className="text-text-secondary text-[15px] max-w-[44ch] mx-auto">
                Pick a flavor family on the wheel, or search an ingredient above, to see its strongest pairings —
                ranked by shared aroma compounds, with the shared notes that explain why.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Attribution */}
      <p className="text-[11.5px] text-text-secondary mt-16 border-t border-border pt-5 max-w-[70ch]">
        Pairings are computed from the flavor-compound network in Ahn, Ahnert, Bagrow &amp; Barabási,
        “Flavor network and the principles of food pairing,” <em>Nature Scientific Reports</em> (2011) — 1,530
        ingredients linked by 1,107 shared aroma compounds (CC BY 4.0). Strength weights rarer shared compounds
        more heavily; “shared notes” are the actual compounds two ingredients have in common.
      </p>
    </div>
  );
}
