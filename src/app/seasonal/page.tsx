'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';
import { api } from '@/lib/api-client';
import { FAMILY_COLORS } from '@/lib/flavor';
import { MONTHS, REGIONS, regionForState, regionName, seasonalFor, type RegionId } from '@/data/seasonal-regional';
import { FARM_COLORS, type Farm } from '@/components/FarmsMap';

const FarmsMap = dynamic(() => import('@/components/FarmsMap'), {
  ssr: false,
  loading: () => <div className="border border-border bg-[#f6f6f4]" style={{ height: 480 }} />,
});

// full state names for the picker
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

export default function SeasonalPage() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [state, setState] = useState<string>('PA');
  const [detected, setDetected] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [cats, setCats] = useState<{ category: string; count: number }[]>([]);
  const [statesList, setStatesList] = useState<{ state: string; count: number }[]>([]);
  const [active, setActive] = useState<Set<string>>(new Set());
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [ingredientsByName, setIngredientsByName] = useState<Map<string, number>>(new Map());
  const [locating, setLocating] = useState(true);

  const region: RegionId = regionForState(state);

  // state list for the picker + ingredient name→id map for wheel deep-links
  useEffect(() => {
    api.farms.states().then((d) => setStatesList(d.states || [])).catch(() => {});
    api.flavor.notesList().then((d) => setIngredientsByName(new Map((d.ingredients || []).map((i) => [i.name.toLowerCase(), i.id])))).catch(() => {});
  }, []);

  // geolocate on first load → nearest state
  useEffect(() => {
    if (!navigator.geolocation) { loadState('PA'); setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        api.farms.near(pos.coords.latitude, pos.coords.longitude)
          .then((d) => { setState(d.state); setDetected(true); applyFarms(d); })
          .catch(() => loadState('PA'))
          .finally(() => setLocating(false));
      },
      () => { loadState('PA'); setLocating(false); },
      { timeout: 8000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFarms = (d: { farms: Farm[]; categories: { category: string; count: number }[] }) => {
    setFarms(d.farms as Farm[]);
    setCats(d.categories);
    setActive(new Set(d.categories.map((c) => c.category)));
    setSelectedId(null);
  };
  const loadState = (st: string) => { setState(st); setDetected(false); api.farms.byState(st).then(applyFarms).catch(() => {}); };

  const toggleCat = (c: string) => setActive((s) => { const n = new Set(s); n.has(c) ? n.delete(c) : n.add(c); return n; });

  const items = seasonalFor(region, month);

  const listed = useMemo(() => {
    const term = q.toLowerCase().trim();
    return farms
      .filter((f) => active.has(f.category))
      .filter((f) => !term || f.name.toLowerCase().includes(term) || (f.city || '').toLowerCase().includes(term) || (f.zip || '').includes(term))
      .slice(0, 400);
  }, [farms, active, q]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-10 md:pt-16 pb-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-text-secondary mb-3 flex items-center gap-1.5">
          Seasonal &amp; local · United States
        </p>
        <h1 className="text-[34px] md:text-[52px] leading-[1.02] tracking-[-0.02em] font-normal text-text mb-4">What&rsquo;s good now</h1>
        <p className="text-[16px] leading-[1.6] text-[#3A3A3A] max-w-[64ch]">
          Produce at its peak this month where you are, and the farms, markets and CSAs near you — from the USDA Local Food
          directory, {statesList.reduce((s, x) => s + x.count, 0).toLocaleString()} listings nationwide.
        </p>
      </div>

      {/* region + state control */}
      <div className="flex items-center gap-3 flex-wrap border-t border-border pt-6 mb-6">
        <MapPin size={16} className="text-text-secondary" />
        <span className="text-[13px] text-text-secondary">
          {locating ? 'Finding your area…' : detected ? 'Detected near' : 'Showing'}
        </span>
        <select value={state} onChange={(e) => loadState(e.target.value)} className="border border-border bg-white px-3 py-1.5 text-[14px]">
          {Object.keys(STATE_NAMES).sort((a, b) => STATE_NAMES[a].localeCompare(STATE_NAMES[b])).map((st) => (
            <option key={st} value={st}>{STATE_NAMES[st]}</option>
          ))}
        </select>
        <span className="text-[13px] text-text-secondary">· {regionName(region)} region</span>
      </div>

      {/* seasonal produce */}
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
        <h2 className="text-[24px] tracking-[-0.01em]">In season · {regionName(region)}</h2>
        <span className="text-text-secondary text-[13px]">{items.length} at peak in {MONTHS[month]}</span>
      </div>
      <div className="flex gap-3 md:gap-4 text-[13px] border-b border-border pb-2.5 mb-7 overflow-x-auto">
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setMonth(i)} className={`whitespace-nowrap ${i === month ? 'text-text border-b-2 border-text pb-2' : 'text-text-secondary hover:text-text'}`}>{m}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-16">
        {items.map((it) => {
          const color = FAMILY_COLORS[it.family] || '#999';
          const hasWheel = ingredientsByName.has(it.name.toLowerCase());
          const inner = (
            <>
              <div className="h-[68px]" style={{ background: `linear-gradient(150deg, ${color}, ${color}bb)` }} />
              <div className="p-3">
                <div className="text-[14.5px] leading-tight">{it.name}</div>
                <div className="text-[11.5px] text-text-secondary mt-0.5">{hasWheel ? 'peak · open wheel →' : 'peak'}</div>
              </div>
            </>
          );
          return hasWheel
            ? <Link key={it.name} href={`/flavor?ingredient=${encodeURIComponent(it.name)}`} className="border border-border hover:border-text transition-colors">{inner}</Link>
            : <div key={it.name} className="border border-border">{inner}</div>;
        })}
      </div>

      {/* local farms */}
      <div className="border-t border-border pt-8">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
          <h2 className="text-[24px] tracking-[-0.01em]">Buy it local · {STATE_NAMES[state] || state}</h2>
          <span className="text-text-secondary text-[13px]">{farms.length} listings · USDA Local Food Portal</span>
        </div>

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
        placed at ZIP-code centroids (approximate — call ahead). Seasonal calendar is a regional guide; local microclimates and greenhouse growers vary.
      </p>
    </div>
  );
}
