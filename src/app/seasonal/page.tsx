'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { api } from '@/lib/api-client';
import { FAMILY_COLORS, cap } from '@/lib/flavor';
import { SEASONAL, MONTHS } from '@/data/flavor-content';
import { FARM_COLORS, type Farm } from '@/components/FarmsMap';

// Leaflet touches window — load the map client-side only.
const FarmsMap = dynamic(() => import('@/components/FarmsMap'), {
  ssr: false,
  loading: () => <div className="border border-border bg-[#f6f6f4]" style={{ height: 460 }} />,
});

export default function SeasonalPage() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [farms, setFarms] = useState<Farm[]>([]);
  const [cats, setCats] = useState<{ category: string; count: number }[]>([]);
  const [active, setActive] = useState<Set<string>>(new Set());
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    api.farms.list().then((d) => {
      setFarms(d.farms as Farm[]);
      setCats(d.categories);
      setActive(new Set(d.categories.map((c) => c.category)));
    }).catch(() => {});
  }, []);

  const toggleCat = (c: string) => setActive((s) => {
    const n = new Set(s);
    n.has(c) ? n.delete(c) : n.add(c);
    return n;
  });

  const items = SEASONAL[month] || [];

  const listed = useMemo(() => {
    const term = q.toLowerCase().trim();
    return farms
      .filter((f) => active.has(f.category))
      .filter((f) => !term || f.name.toLowerCase().includes(term) || (f.city || '').toLowerCase().includes(term) || (f.zip || '').includes(term))
      .slice(0, 300);
  }, [farms, active, q]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-10 md:pt-16 pb-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-text-secondary mb-3">Seasonal &amp; local · Pennsylvania</p>
        <h1 className="text-[34px] md:text-[52px] leading-[1.02] tracking-[-0.02em] font-normal text-text mb-4">What&rsquo;s good now</h1>
        <p className="text-[16px] leading-[1.6] text-[#3A3A3A] max-w-[64ch]">
          Produce at its peak this month, and where to buy it near you — {farms.length} Pennsylvania farms, markets, CSAs and
          on-farm stands from the USDA Local Food directory.
        </p>
      </div>

      {/* seasonal produce */}
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4 border-t border-border pt-8">
        <h2 className="text-[24px] tracking-[-0.01em]">In season</h2>
        <span className="text-text-secondary text-[13px]">temperate calendar · Northern Hemisphere</span>
      </div>
      <div className="flex gap-3 md:gap-4 text-[13px] border-b border-border pb-2.5 mb-7 overflow-x-auto">
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setMonth(i)} className={`whitespace-nowrap ${i === month ? 'text-text border-b-2 border-text pb-2' : 'text-text-secondary hover:text-text'}`}>{m}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
        {items.map((it) => {
          const color = FAMILY_COLORS[it.family] || '#999';
          return (
            <Link key={it.name} href={`/flavor?ingredient=${encodeURIComponent(it.name)}`} className="border border-border hover:border-text transition-colors">
              <div className="h-[72px]" style={{ background: `linear-gradient(150deg, ${color}, ${color}bb)` }} />
              <div className="p-3">
                <div className="text-[15px]">{it.name}</div>
                <div className="text-[11.5px] text-text-secondary mt-0.5">peak · open wheel →</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* local farms */}
      <div className="border-t border-border pt-8">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
          <h2 className="text-[24px] tracking-[-0.01em]">Buy it local</h2>
          <span className="text-text-secondary text-[13px]">USDA Local Food Portal · placed by ZIP</span>
        </div>

        {/* category filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          {cats.map((c) => {
            const on = active.has(c.category);
            return (
              <button key={c.category} onClick={() => toggleCat(c.category)}
                className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[12.5px] transition-colors ${on ? 'border-text' : 'border-border text-text-secondary'}`}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: on ? (FARM_COLORS[c.category] || '#767676') : '#ccc' }} />
                {c.category} <span className="text-text-secondary">{c.count}</span>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <FarmsMap farms={farms} active={active} selectedId={selectedId} onSelect={setSelectedId} height={480} />
          <div>
            <div className="relative mb-3">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary" size={15} strokeWidth={1.8} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, town, or ZIP…"
                className="w-full pl-6 pr-2 py-1.5 bg-transparent border-0 border-b border-border focus:border-text text-[14px] placeholder:text-text-secondary" />
            </div>
            <p className="text-[11.5px] text-text-secondary mb-2">{listed.length} shown</p>
            <div className="max-h-[420px] overflow-auto -mr-2 pr-2">
              {listed.map((f) => (
                <button key={f.id} onClick={() => setSelectedId(f.id)}
                  className={`block w-full text-left border-b border-border py-2.5 ${selectedId === f.id ? 'bg-[#f6f6f4]' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-none" style={{ background: FARM_COLORS[f.category] || '#767676' }} />
                    <span className="text-[14px] leading-tight">{f.name}</span>
                  </div>
                  <div className="text-[12px] text-text-secondary mt-0.5 pl-4">{[f.city, f.zip].filter(Boolean).join(' · ')} · {f.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11.5px] text-text-secondary mt-14 border-t border-border pt-5 max-w-[74ch]">
        Listings from the <a href="https://www.usdalocalfoodportal.com" target="_blank" rel="noopener" className="underline underline-offset-2">USDA Local Food Portal</a>,
        placed at ZIP-code centroids (approximate — call ahead for exact hours and location). Seasonal calendar is a general
        temperate Northern-Hemisphere guide.
      </p>
    </div>
  );
}
