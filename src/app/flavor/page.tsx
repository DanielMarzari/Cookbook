'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '@/lib/api-client';
import FlavorWheel from '@/components/FlavorWheel';

type Ingredient = { id: number; name: string; category: string };
type Profile = {
  id: number; name: string; category: string; activeNotes: number;
  families: { name: string; notes: { note: string; intensity: number }[] }[];
  strongest: { note: string; family: string; intensity: number }[];
};
type Pairing = { id: number; name: string; category: string; shared: number; strength: number; notes: string[] };

const FAMILY_COLORS: Record<string, string> = {
  Sweet: '#4E7FA6', Acidic: '#6E6FA8', Floral: '#9166A6', Herbal: '#A85C82',
  Vegetal: '#C2546A', Spice: '#CE6A4A', Woody: '#D2954C', Earthy: '#C6A24A',
  Maillard: '#7FA968', Carnal: '#5DA48D',
};
const cap = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export default function FlavorPage() {
  const [families, setFamilies] = useState<string[]>([]);
  const [vocabulary, setVocabulary] = useState<Record<string, string[]>>({});
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [pairLoading, setPairLoading] = useState(false);
  const [mode, setMode] = useState<'key' | 'all'>('all');
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.flavor.notesList()
      .then((d) => { setFamilies(d.families || []); setVocabulary(d.vocabulary || {}); setIngredients(d.ingredients || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const select = async (ing: Ingredient) => {
    setQuery('');
    const p = await api.flavor.profile(ing.id).catch(() => null);
    if (p) setProfile(p);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
    // pairings come from the (separate) flavour network, matched by name
    setPairLoading(true);
    setPairings([]);
    try {
      const pr = await api.flavor.pairingsByName(ing.name);
      setPairings(pr.pairings || []);
    } catch {
      setPairings([]);
    } finally {
      setPairLoading(false);
    }
  };

  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    const starts: Ingredient[] = [], has: Ingredient[] = [];
    for (const i of ingredients) {
      const n = i.name.toLowerCase();
      if (n.startsWith(q)) starts.push(i);
      else if (n.includes(q)) has.push(i);
      if (starts.length >= 8) break;
    }
    return [...starts, ...has].slice(0, 8);
  }, [query, ingredients]);

  const activeByFamily = useMemo(() => {
    const m: Record<string, { note: string; intensity: number }[]> = {};
    if (profile) for (const f of profile.families) m[f.name] = f.notes;
    return m;
  }, [profile]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-10 md:pt-16 pb-6">
        <h1 className="text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] font-normal text-text mb-4">
          Flavors &amp; Pairings
        </h1>
        <p className="text-[16.5px] leading-[1.6] text-[#3A3A3A] max-w-[64ch]">
          Every ingredient&apos;s flavour, mapped: its notes across ten families, and what it pairs with and why.
          Search one to open its wheel.
        </p>
      </div>

      <div className="relative max-w-md mb-8">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-text-secondary" size={16} strokeWidth={1.8} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search an ingredient — try “mint”, “garlic”, “coffee”…"
          className="w-full pl-7 pr-2 py-2 bg-transparent border-0 border-b border-border focus:border-text text-[15px] placeholder:text-text-secondary transition-colors"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-border shadow-warm-lg max-h-72 overflow-auto">
            {suggestions.map((s) => (
              <button key={s.id} onClick={() => select(s)}
                className="flex w-full items-baseline justify-between gap-3 px-3 py-2 text-left hover:bg-[#F6F6F4] text-[14.5px]">
                <span className="text-text">{cap(s.name)}</span>
                <span className="text-[12px] text-text-secondary lowercase">{s.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading…</p>
      ) : !profile ? (
        <div className="border border-dashed border-border p-10 text-center">
          <p className="text-text-secondary text-[15px] max-w-[46ch] mx-auto">
            Search an ingredient above to open its flavour wheel — the notes it carries across ten families,
            with the strongest called out and its pairings below.
          </p>
        </div>
      ) : (
        <div ref={resultRef}>
          {/* head */}
          <div className="flex items-baseline justify-between border-b border-text pb-2.5 mb-6">
            <div>
              <p className="text-[12.5px] text-text-secondary lowercase">{profile.category} · flavour profile</p>
              <h2 className="text-[28px] tracking-[-0.01em] text-text">{cap(profile.name)}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">Show</span>
              <div className="flex border border-border text-[12px]">
                <button onClick={() => setMode('key')} className={`px-3 py-1.5 ${mode === 'key' ? 'bg-text text-white' : 'text-text-secondary'}`}>Key notes</button>
                <button onClick={() => setMode('all')} className={`px-3 py-1.5 ${mode === 'all' ? 'bg-text text-white' : 'text-text-secondary'}`}>All notes</button>
              </div>
            </div>
          </div>

          {/* wheel + strongest */}
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-center mb-14">
            <FlavorWheel
              families={families}
              vocabulary={vocabulary}
              activeByFamily={activeByFamily}
              activeCount={profile.activeNotes}
              mode={mode}
            />
            <div>
              <div className="border-b border-text pb-2.5 mb-1 flex items-baseline justify-between">
                <span className="text-[12.5px] text-text-secondary">Strongest notes</span>
              </div>
              {profile.strongest.map((s, i) => (
                <div key={s.note + i} className="flex items-center justify-between py-2.5 border-b border-border text-[14.5px]">
                  <span>
                    <span className="text-text-secondary mr-2.5">{i + 1}</span>
                    <span style={{ color: FAMILY_COLORS[s.family] || '#141310', fontWeight: 600 }}>{cap(s.note)}</span>
                  </span>
                  <span className="tabular-nums text-text-secondary">{s.intensity.toFixed(1)}</span>
                </div>
              ))}
              <p className="text-[11.5px] text-text-secondary mt-3">
                {profile.activeNotes} active notes · profile from FlavorDB2
              </p>
            </div>
          </div>

          {/* pairings (from the flavour network) */}
          <div>
            <div className="flex items-baseline justify-between border-b border-text pb-2.5 mb-1">
              <h3 className="text-[12.5px] text-text-secondary">Pairs well with</h3>
              <span className="text-[11.5px] text-text-secondary">by shared aroma compounds</span>
            </div>
            {pairLoading ? (
              <p className="text-text-secondary text-sm py-4">Finding pairings…</p>
            ) : pairings.length === 0 ? (
              <p className="text-text-secondary text-[14px] py-4">No pairing data for {cap(profile.name)} in the flavour network yet.</p>
            ) : (
              <ul>
                {pairings.slice(0, 16).map((p) => (
                  <li key={p.id} className="border-b border-border py-3">
                    <div className="flex items-center gap-4">
                      <span className="text-[15.5px] text-text min-w-[9rem]">{cap(p.name)}</span>
                      <span className="text-[12px] text-text-secondary lowercase w-28 hidden sm:block">{p.category}</span>
                      <div className="flex-1 h-[6px] bg-[#eee] overflow-hidden max-w-[220px]">
                        <div className="h-full bg-text" style={{ width: `${p.strength}%` }} />
                      </div>
                      <span className="text-[12px] text-text-secondary tabular-nums w-16 text-right">{p.shared} shared</span>
                    </div>
                    {p.notes.length > 0 && (
                      <p className="text-[12px] text-text-secondary mt-1.5">shared notes: {p.notes.map(cap).join(', ')}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-[11.5px] text-text-secondary mt-14 border-t border-border pt-5 max-w-[72ch]">
            Flavour notes derived from FlavorDB2 (cosylab.iiitd.edu.in/flavordb2, incorporating FlavorNet), scored across
            ten families. Pairings from the flavour-compound network in Ahn et al., “Flavor network and the principles of
            food pairing,” <em>Nature Scientific Reports</em> (2011).
          </p>
        </div>
      )}
    </div>
  );
}
