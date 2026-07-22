'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { FAMILY_COLORS, cap } from '@/lib/flavor';
import { FAMILIES_LEGEND } from '@/data/flavor-content';
import FlavorWheel from '@/components/FlavorWheel';
import FlavorOverlayWheel from '@/components/FlavorOverlayWheel';
import IngredientPicker, { PickIng } from '@/components/flavor/IngredientPicker';

type Families = { name: string; notes: { note: string; intensity: number }[] }[];
const abf = (families: Families) => Object.fromEntries((families || []).map((f) => [f.name, f.notes]));
const synWord = (n: number) => (n >= 70 ? 'High' : n >= 45 ? 'Moderate' : n >= 20 ? 'Low' : 'Faint');

const TABS = ['Wheel', 'Pair', 'Lab', 'Learn'];

export default function FlavorLabPage() {
  const [families, setFamilies] = useState<string[]>([]);
  const [vocabulary, setVocabulary] = useState<Record<string, string[]>>({});
  const [ingredients, setIngredients] = useState<PickIng[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  const [ing, setIng] = useState<PickIng | null>(null);           // Wheel + Pair A
  const [pairB, setPairB] = useState<PickIng | null>(null);       // Pair B
  const [build, setBuild] = useState<PickIng[]>([]);              // Lab

  const [profile, setProfile] = useState<Awaited<ReturnType<typeof api.flavor.profile>> | null>(null);
  const [pairings, setPairings] = useState<Awaited<ReturnType<typeof api.flavor.pairingsByName>>['pairings']>([]);
  const [wheelRecipes, setWheelRecipes] = useState<{ id: string; title: string; image_url: string | null; cuisine: string | null }[]>([]);
  const [rel, setRel] = useState<Awaited<ReturnType<typeof api.flavor.relationship>> | null>(null);
  const [lab, setLab] = useState<Awaited<ReturnType<typeof api.flavor.lab>> | null>(null);
  const [wheelMode, setWheelMode] = useState<'key' | 'all'>('all');
  const [pairMode, setPairMode] = useState<'key' | 'all'>('all');
  const [labMetric, setLabMetric] = useState<'harmony' | 'affinity'>('harmony');

  const ingByName = useMemo(() => {
    const m = new Map<string, PickIng>();
    for (const i of ingredients) m.set(i.name.toLowerCase(), i);
    return m;
  }, [ingredients]);

  useEffect(() => {
    api.flavor.notesList()
      .then((d) => { setFamilies(d.families || []); setVocabulary(d.vocabulary || {}); setIngredients(d.ingredients || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Wheel keys off the primary ingredient — also seeds Pair (A), the Lab build,
  // and pulls the recipes that use it.
  useEffect(() => {
    if (!ing) return;
    api.flavor.profile(ing.id).then(setProfile).catch(() => setProfile(null));
    api.flavor.pairingsByName(ing.name).then((d) => setPairings(d.pairings || [])).catch(() => setPairings([]));
    api.flavor.recipesForIngredient(ing.id).then((d) => setWheelRecipes(d.recipes || [])).catch(() => setWheelRecipes([]));
    setBuild((b) => (b.length === 0 ? [ing] : b));
  }, [ing]);

  useEffect(() => {
    if (!ing || !pairB) { setRel(null); return; }
    api.flavor.relationship(ing.name, pairB.name).then(setRel).catch(() => setRel(null));
  }, [ing, pairB]);

  useEffect(() => {
    if (build.length === 0) { setLab(null); return; }
    api.flavor.lab(build.map((b) => b.id)).then(setLab).catch(() => setLab(null));
  }, [build]);

  // Deep-link: /flavor?ingredient=Tomato (from Seasonal) preselects the wheel.
  useEffect(() => {
    if (ingredients.length === 0 || ing) return;
    const q = new URLSearchParams(window.location.search).get('ingredient');
    if (q) { const found = ingByName.get(q.toLowerCase()); if (found) { setIng(found); setTab(0); } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      <div className="pt-10 md:pt-16 pb-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-text-secondary mb-3">Flavor Lab · flavour science for the kitchen</p>
        <h1 className="text-[34px] md:text-[52px] leading-[1.02] tracking-[-0.02em] font-normal text-text mb-4">Flavors &amp; Pairings</h1>
        <p className="text-[16px] leading-[1.6] text-[#3A3A3A] max-w-[66ch]">
          Every ingredient mapped across ten flavour families — pair any two to read their harmony and aroma affinity, or
          combine several in the Lab to invent a dish.
        </p>
      </div>

      <div className="border-y border-border mb-8 overflow-x-auto">
        <div className="flex gap-6 md:gap-7 min-w-max py-3">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`text-[14px] whitespace-nowrap transition-colors ${i === tab ? 'text-text' : 'text-text-secondary hover:text-text'}`}>
              <span className="tabular-nums text-[11px] mr-1.5 align-top opacity-60">{String(i + 1).padStart(2, '0')}</span>
              <span className={i === tab ? 'border-b-2 border-text pb-3' : ''}>{t}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading…</p>
      ) : (
        <>
          {tab === 0 && <WheelTab {...{ ingredients, families, vocabulary, ing, setIng, profile, pairings, wheelRecipes, wheelMode, setWheelMode, setPairB, setTab }} />}
          {tab === 1 && <PairTab {...{ ingredients, families, vocabulary, ing, setIng, pairB, setPairB, rel, pairMode, setPairMode }} />}
          {tab === 2 && <LabTab {...{ ingredients, families, build, setBuild, lab, labMetric, setLabMetric }} />}
          {tab === 3 && <LearnTab />}
        </>
      )}

      <p className="text-[11.5px] text-text-secondary mt-16 border-t border-border pt-5 max-w-[76ch]">
        Notes from FlavorDB2 (incorporating FlavorNet). Aroma affinity from the flavour-compound network in Ahn et al.
        (<em>Nature Sci. Reports</em>, 2011). Harmony from real recipe co-occurrence (FlavorGraph / Recipe1M) where available,
        else note-association cohesion. Recipe matches run through a name bridge; flavour and recipe data stay separate.
      </p>
    </div>
  );
}

/* ── shared bits ─────────────────────────────────────────────── */
function TabHead({ label, title, sub, right }: { label: string; title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-text pb-2.5 mb-6 flex-wrap">
      <div>
        <p className="text-[11px] uppercase tracking-[0.14em] text-text-secondary mb-1">{label}</p>
        <h2 className="text-[26px] tracking-[-0.01em] text-text">{title}</h2>
        {sub && <p className="text-[13.5px] text-text-secondary mt-1 max-w-[54ch]">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="border border-dashed border-border p-10 text-center"><p className="text-text-secondary text-[15px] max-w-[46ch] mx-auto">{children}</p></div>;
}
function ModeToggle({ mode, set }: { mode: 'key' | 'all'; set: (m: 'key' | 'all') => void }) {
  return (
    <div className="flex items-center gap-3"><span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">Show</span>
      <div className="flex border border-border text-[12px]">
        <button onClick={() => set('key')} className={`px-3 py-1.5 ${mode === 'key' ? 'bg-text text-white' : 'text-text-secondary'}`}>Key notes</button>
        <button onClick={() => set('all')} className={`px-3 py-1.5 ${mode === 'all' ? 'bg-text text-white' : 'text-text-secondary'}`}>All notes</button>
      </div>
    </div>
  );
}
function SynergyRead({ score, label }: { score: number; label?: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1.5">{label || 'synergy'}</div>
      <div className="flex items-baseline gap-2 mb-2"><b className="text-[28px] font-normal">{synWord(score)}</b><span className="text-text-secondary text-[12px] tabular-nums">{score} / 100</span></div>
      <div className="relative h-[6px] bg-[#eee]"><div className="h-full bg-text" style={{ width: `${score}%` }} /></div>
    </div>
  );
}
function RecipeStrip({ recipes, label }: { recipes: { id: string; title: string; image_url: string | null; cuisine: string | null }[]; label: string }) {
  if (recipes.length === 0) return null;
  return (
    <div className="mt-12">
      <div className="flex items-baseline justify-between border-b border-text pb-2 mb-5">
        <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">{label}</span>
        <span className="text-text-secondary text-[12.5px]">{recipes.length}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recipes.slice(0, 8).map((r) => (
          <Link key={r.id} href={`/recipes/${r.id}`} className="group">
            <div className="aspect-[4/3] bg-[#f0efec] overflow-hidden">{r.image_url && <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />}</div>
            {r.cuisine && <div className="text-[12px] text-text-secondary lowercase mt-1.5">{r.cuisine}</div>}
            <div className="text-[14px] mt-0.5 group-hover:underline underline-offset-2">{r.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── 01 Wheel ────────────────────────────────────────────────── */
function WheelTab({ ingredients, families, vocabulary, ing, setIng, profile, pairings, wheelRecipes, wheelMode, setWheelMode, setPairB, setTab }: any) {
  return (
    <div>
      <div className="max-w-md mb-8"><IngredientPicker ingredients={ingredients} onSelect={setIng} placeholder="Search an ingredient — try “mint”, “garlic”, “coffee”…" /></div>
      {!ing || !profile ? (
        <Empty>Search an ingredient to open its flavour wheel — its notes across ten families, the strongest called out, what it&apos;s most similar to, and your recipes that use it.</Empty>
      ) : (
        <div>
          <div className="flex items-baseline justify-between border-b border-text pb-2.5 mb-6 flex-wrap gap-3">
            <div><p className="text-[12px] text-text-secondary lowercase">{profile.category} · flavour profile</p><h2 className="text-[28px] tracking-[-0.01em]">{cap(profile.name)}</h2></div>
            <ModeToggle mode={wheelMode} set={setWheelMode} />
          </div>
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-center mb-14">
            <FlavorWheel families={families} vocabulary={vocabulary} activeByFamily={abf(profile.families)} activeCount={profile.activeNotes} mode={wheelMode} />
            <div>
              <div className="border-b border-text pb-2.5 mb-1"><span className="text-[12.5px] text-text-secondary">Strongest notes</span></div>
              {profile.strongest.map((s: any, i: number) => (
                <div key={s.note + i} className="flex items-center justify-between py-2.5 border-b border-border text-[14.5px]">
                  <span><span className="text-text-secondary mr-2.5">{i + 1}</span><span style={{ color: FAMILY_COLORS[s.family] || '#141310', fontWeight: 600 }}>{cap(s.note)}</span></span>
                  <span className="tabular-nums text-text-secondary">{s.intensity.toFixed(1)}</span>
                </div>
              ))}
              <p className="text-[11.5px] text-text-secondary mt-3">{profile.activeNotes} active notes · profile from FlavorDB2</p>
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between border-b border-text pb-2.5 mb-1"><h3 className="text-[12.5px] text-text-secondary">Most similar to</h3><span className="text-[11.5px] text-text-secondary">by shared aroma compounds</span></div>
            {pairings.length === 0 ? <p className="text-text-secondary text-[14px] py-4">No aroma-similar ingredients for {cap(profile.name)} yet.</p> : (
              <ul>{pairings.slice(0, 12).map((p: any) => (
                <li key={p.id} className="border-b border-border py-3 flex items-center gap-4">
                  <button onClick={() => { const m = ingredients.find((x: PickIng) => x.name.toLowerCase() === p.name.toLowerCase()); if (m) { setPairB(m); setTab(1); } }}
                    className="text-[15px] min-w-[9rem] text-left hover:underline underline-offset-2" title="Open this pair">{cap(p.name)}</button>
                  <span className="text-[12px] text-text-secondary lowercase w-28 hidden sm:block">{p.category}</span>
                  <div className="flex-1 h-[6px] bg-[#eee] overflow-hidden max-w-[220px]"><div className="h-full bg-text" style={{ width: `${p.strength}%` }} /></div>
                  <span className="text-[12px] text-text-secondary tabular-nums w-16 text-right">{p.shared} shared</span>
                </li>
              ))}</ul>
            )}
          </div>
          <RecipeStrip recipes={wheelRecipes} label={`your recipes with ${cap(profile.name)}`} />
        </div>
      )}
    </div>
  );
}

/* ── 02 Pair (merged Compare + Harmonies) ────────────────────── */
function PairTab({ ingredients, families, vocabulary, ing, setIng, pairB, setPairB, rel, pairMode, setPairMode }: any) {
  return (
    <div>
      <TabHead label="Discover flavour relationships" title="Pair two ingredients" sub="How two ingredients relate: their harmony (do they work together), their aroma affinity (do they smell alike), where their profiles meet, and the recipes that use both." />
      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-end max-w-2xl mb-9">
        <div><div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1">{ing ? cap(ing.name) : 'first ingredient'}</div><IngredientPicker ingredients={ingredients} onSelect={setIng} placeholder="Search…" /></div>
        <div className="text-[20px] text-text-secondary pb-2 text-center hidden sm:block">+</div>
        <div><div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1">{pairB ? cap(pairB.name) : 'second ingredient'}</div><IngredientPicker ingredients={ingredients} onSelect={setPairB} placeholder="Search…" /></div>
      </div>

      {!ing || !pairB ? (
        <Empty>Choose two ingredients to reveal their relationship — how well they harmonise, how much aroma they share, and the notes behind it.</Empty>
      ) : !rel ? <p className="text-text-secondary text-sm">Reading the relationship…</p> : (
        <div>
          <div className="flex items-baseline gap-3 border-b border-text pb-2.5 mb-6">
            <span className="text-[26px] tracking-[-0.01em]">{cap(rel.a.name)}</span>
            <span className="text-text-secondary text-[20px]">+</span>
            <span className="text-[26px] tracking-[-0.01em]">{cap(rel.b.name)}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 mb-10 max-w-2xl">
            <div>
              <SynergyRead score={rel.harmony} label="harmony · how well they work together" />
              {rel.proven ? (
                <p className="text-[12px] text-text-secondary mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-[0.1em] text-text border border-text px-1.5 py-0.5">✓ proven</span>
                  they actually appear together in real recipes.
                </p>
              ) : (
                <p className="text-[12px] text-text-secondary mt-2">A structural estimate from note co-occurrence — no direct recipe data for this exact pair yet.</p>
              )}
            </div>
            <div>
              <SynergyRead score={rel.affinity} label="aroma affinity · shared compounds" />
              <p className="text-[12px] text-text-secondary mt-2">{rel.sharedCompounds} shared aroma compounds{rel.compoundNotes.length ? `: ${rel.compoundNotes.slice(0, 4).map(cap).join(', ')}` : ''}.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div className="flex items-center gap-3 text-[12px] text-text-secondary">
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 bg-text" />{cap(rel.a.name)}</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 border border-text" />{cap(rel.b.name)}</span>
                </div>
                <ModeToggle mode={pairMode} set={setPairMode} />
              </div>
              <FlavorOverlayWheel families={families} vocabulary={vocabulary} aByFamily={abf(rel.a.families)} bByFamily={abf(rel.b.families)} mode={pairMode} />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-2.5">where they meet · by family</div>
              <div className="grid grid-cols-[70px_1fr] gap-x-2.5 gap-y-2 items-center text-[12px] mb-7">
                {rel.facets.map((f: any) => <FacetRow key={f.family} f={f} />)}
              </div>
              <div className="border-b border-text pb-2.5 mb-1"><span className="text-[12.5px] text-text-secondary">The bridge · strongest note associations</span></div>
              {rel.bridges.length === 0 ? <p className="text-text-secondary text-[13.5px] py-3">No strong note associations between these two.</p> : rel.bridges.slice(0, 6).map((br: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border text-[13.5px]">
                  <span className="flex items-center gap-1.5">
                    <span style={{ color: FAMILY_COLORS[br.familyA] || '#141310', fontWeight: 600 }}>{cap(br.noteA)}</span>
                    <span className="text-text-secondary">~</span>
                    <span style={{ color: FAMILY_COLORS[br.familyB] || '#141310', fontWeight: 600 }}>{cap(br.noteB)}</span>
                  </span>
                  <span className="tabular-nums text-text-secondary">{br.strength}×</span>
                </div>
              ))}
            </div>
          </div>

          {rel.recipes.length > 0
            ? <RecipeStrip recipes={rel.recipes} label={`your recipes with ${cap(rel.a.name)} + ${cap(rel.b.name)}`} />
            : <p className="text-text-secondary text-[13.5px] mt-10 border-t border-border pt-5">No recipe in your cookbook uses both {cap(rel.a.name)} and {cap(rel.b.name)} yet.</p>}
        </div>
      )}
    </div>
  );
}
function FacetRow({ f }: { f: { family: string; a: number; b: number } }) {
  const color = FAMILY_COLORS[f.family] || '#141310';
  return (
    <>
      <span className="text-text-secondary">{f.family}</span>
      <span>
        <span className="block h-[6px] bg-[#eee] mb-[3px]"><span className="block h-full bg-text" style={{ width: `${f.a}%` }} /></span>
        <span className="block h-[6px] bg-[#eee]"><span className="block h-full" style={{ width: `${f.b}%`, background: color }} /></span>
      </span>
    </>
  );
}

/* ── 03 Lab ──────────────────────────────────────────────────── */
function LabTab({ ingredients, families, build, setBuild, lab, labMetric, setLabMetric }: any) {
  const add = (i: PickIng) => setBuild((b: PickIng[]) => (b.find((x) => x.id === i.id) ? b : [...b, i]));
  const remove = (id: number) => setBuild((b: PickIng[]) => b.filter((x) => x.id !== id));
  const addById = (id: number, name: string) => add({ id, name, category: '' });
  const adds = lab ? (labMetric === 'harmony' ? lab.harmonyAdds : lab.affinityAdds) : [];
  return (
    <div>
      <TabHead label="Flavor Lab · The Bench" title="Invent a dish" sub="Add ingredients; the lab merges their wheels, scores the plate, and suggests only what would actually improve it." />
      <div className="grid lg:grid-cols-[0.9fr_1fr] gap-10 items-start">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">your build</span>
            {build.length > 0 && <button onClick={() => setBuild([])} className="text-[12px] text-text-secondary hover:text-text underline underline-offset-2">Clear</button>}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {build.map((b: PickIng) => (
              <span key={b.id} className="inline-flex items-center gap-2 border border-border px-2.5 py-1 text-[13px]">{cap(b.name)}
                <button onClick={() => remove(b.id)} className="text-text-secondary hover:text-text">×</button>
              </span>
            ))}
          </div>
          <div className="max-w-xs mb-6"><IngredientPicker ingredients={ingredients} onSelect={add} placeholder="+ add an ingredient…" /></div>
          {lab && build.length > 0 && (
            <FlavorWheel families={families} activeByFamily={abf(lab.merged.families)} activeCount={lab.merged.activeNotes} variant="mini" size={360} />
          )}
        </div>
        <div>
          {build.length === 0 ? <Empty>Add a couple of ingredients to build a plate.</Empty> : lab && (
            <>
              <div className="grid grid-cols-2 gap-6 mb-2">
                <SynergyRead score={lab.harmony} label="plate harmony" />
                <SynergyRead score={lab.affinity} label="aroma affinity" />
              </div>
              {lab.tightestPairs.length > 0 && (
                <p className="text-[12px] text-text-secondary mb-6">Tightest pair: <b className="text-text">{cap(lab.tightestPairs[0].a)} · {cap(lab.tightestPairs[0].b)}</b> ({lab.tightestPairs[0].harmony}).</p>
              )}
              <div className="flex items-center justify-between mt-6 mb-2.5 flex-wrap gap-2">
                <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">add next — best fit</span>
                <div className="flex border border-border text-[12px]">
                  <button onClick={() => setLabMetric('harmony')} className={`px-3 py-1 ${labMetric === 'harmony' ? 'bg-text text-white' : 'text-text-secondary'}`}>Harmony</button>
                  <button onClick={() => setLabMetric('affinity')} className={`px-3 py-1 ${labMetric === 'affinity' ? 'bg-text text-white' : 'text-text-secondary'}`}>Affinity</button>
                </div>
              </div>
              {adds.length === 0 ? (
                <p className="text-text-secondary text-[13.5px]">Nothing found that would meaningfully raise the {labMetric}. Your plate is already balanced on that axis.</p>
              ) : adds.map((a: any) => (
                <div key={a.name} className="flex items-center gap-3 py-2 border-b border-[#f0f0f0]">
                  <button onClick={() => a.noteId && addById(a.noteId, a.name)} className="min-w-[8rem] text-[14.5px] text-left hover:underline underline-offset-2">{cap(a.name)}</button>
                  <div className="flex-1 h-[6px] bg-[#eee] max-w-[200px]"><div className="h-full" style={{ width: `${Math.min(100, a.fit)}%`, background: FAMILY_COLORS[a.family] || '#141310' }} /></div>
                  <span className="text-[12px] text-text-secondary tabular-nums w-10 text-right">{a.fit}</span>
                </div>
              ))}
              <p className="text-[11.5px] text-text-secondary mt-4">Only ingredients that would raise the {labMetric} are listed. Click one to add it.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 04 Learn ────────────────────────────────────────────────── */
function LearnTab() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-text-secondary mb-2">the science, in plain terms</p>
      <h2 className="text-[28px] md:text-[38px] leading-[1.12] tracking-[-0.01em] max-w-[22ch] mb-3">Most of “taste” is actually smell.</h2>
      <p className="text-[15px] leading-[1.65] text-[#3A3A3A] max-w-[62ch] mb-10">
        Your tongue reads five things — sweet, sour, salty, bitter, umami. Everything else arrives as aroma: hundreds of
        volatile compounds, which we group into ten families. That grouping is the language of the wheel, and the basis for
        every score in this Lab.
      </p>
      <div className="text-[11px] uppercase tracking-[0.14em] text-text-secondary border-t border-text pt-3 mb-4">the ten families</div>
      <div className="grid sm:grid-cols-2 gap-x-10">
        {FAMILIES_LEGEND.map((f) => (
          <div key={f.name} className="flex gap-3 py-3.5 border-b border-[#f0f0f0]">
            <span className="w-3.5 h-3.5 mt-1 flex-none" style={{ background: FAMILY_COLORS[f.name] }} />
            <div>
              <div className="flex items-baseline gap-2"><span className="text-[15px] font-medium">{f.name}</span><span className="text-[12px] text-text-secondary">{f.examples.slice(0, 3).join(' · ')}</span></div>
              <p className="text-[13px] text-text-secondary leading-[1.5] mt-0.5 m-0">{f.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
