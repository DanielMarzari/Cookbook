'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { FAMILY_COLORS, cap } from '@/lib/flavor';
import { FAMILIES_LEGEND, SEASONAL, MONTHS } from '@/data/flavor-content';
import FlavorWheel from '@/components/FlavorWheel';
import FlavorOverlayWheel from '@/components/FlavorOverlayWheel';
import FlavorChord from '@/components/FlavorChord';
import IngredientPicker, { PickIng } from '@/components/flavor/IngredientPicker';

type Families = { name: string; notes: { note: string; intensity: number }[] }[];
const abf = (families: Families) => Object.fromEntries((families || []).map((f) => [f.name, f.notes]));
const synWord = (n: number) => (n >= 70 ? 'High' : n >= 45 ? 'Moderate' : n >= 20 ? 'Low' : 'Faint');

const TABS = ['Wheel', 'Harmonies', 'Lab', 'Compare', 'Recipes', 'Recipe', 'Learn', 'Seasonal'];

export default function FlavorLabPage() {
  const [families, setFamilies] = useState<string[]>([]);
  const [vocabulary, setVocabulary] = useState<Record<string, string[]>>({});
  const [ingredients, setIngredients] = useState<PickIng[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  // shared selections
  const [ing, setIng] = useState<PickIng | null>(null);           // Wheel + Harmonies
  const [pairA, setPairA] = useState<PickIng | null>(null);        // Compare + Recipes
  const [pairB, setPairB] = useState<PickIng | null>(null);
  const [build, setBuild] = useState<PickIng[]>([]);               // Lab
  const [month, setMonth] = useState(new Date().getMonth());       // Seasonal

  // fetched data
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof api.flavor.profile>> | null>(null);
  const [pairings, setPairings] = useState<Awaited<ReturnType<typeof api.flavor.pairingsByName>>['pairings']>([]);
  const [harm, setHarm] = useState<Awaited<ReturnType<typeof api.flavor.harmonies>> | null>(null);
  const [lab, setLab] = useState<Awaited<ReturnType<typeof api.flavor.lab>> | null>(null);
  const [cmp, setCmp] = useState<Awaited<ReturnType<typeof api.flavor.compare>> | null>(null);
  const [pairRecipes, setPairRecipes] = useState<Awaited<ReturnType<typeof api.flavor.recipesForPair>> | null>(null);
  const [recipeList, setRecipeList] = useState<Awaited<ReturnType<typeof api.flavor.recipeHarmonyList>>['recipes']>([]);
  const [recipeSel, setRecipeSel] = useState<string>('');
  const [recipeH, setRecipeH] = useState<Awaited<ReturnType<typeof api.flavor.recipeHarmony>> | null>(null);
  const [wheelMode, setWheelMode] = useState<'key' | 'all'>('all');

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
    api.flavor.recipeHarmonyList().then((d) => setRecipeList(d.recipes || [])).catch(() => {});
  }, []);

  // Wheel + Harmonies both key off the shared ingredient — fetch both so tab flips are instant.
  useEffect(() => {
    if (!ing) return;
    api.flavor.profile(ing.id).then(setProfile).catch(() => setProfile(null));
    api.flavor.pairingsByName(ing.name).then((d) => setPairings(d.pairings || [])).catch(() => setPairings([]));
    api.flavor.harmonies(ing.id).then(setHarm).catch(() => setHarm(null));
  }, [ing]);

  useEffect(() => {
    if (build.length === 0) { setLab(null); return; }
    api.flavor.lab(build.map((b) => b.id)).then(setLab).catch(() => setLab(null));
  }, [build]);

  useEffect(() => {
    if (!pairA || !pairB) { setCmp(null); setPairRecipes(null); return; }
    api.flavor.compare(pairA.name, pairB.name).then(setCmp).catch(() => setCmp(null));
    api.flavor.recipesForPair(pairA.id, pairB.id).then(setPairRecipes).catch(() => setPairRecipes(null));
  }, [pairA, pairB]);

  useEffect(() => {
    if (!recipeSel) { setRecipeH(null); return; }
    api.flavor.recipeHarmony(recipeSel).then(setRecipeH).catch(() => setRecipeH(null));
  }, [recipeSel]);

  const openWheel = (i: PickIng) => { setIng(i); setTab(0); };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
      {/* masthead */}
      <div className="pt-10 md:pt-16 pb-5">
        <p className="text-[11px] uppercase tracking-[0.16em] text-text-secondary mb-3">Flavor Lab · flavour science for the kitchen</p>
        <h1 className="text-[34px] md:text-[52px] leading-[1.02] tracking-[-0.02em] font-normal text-text mb-4">Flavors &amp; Pairings</h1>
        <p className="text-[16px] leading-[1.6] text-[#3A3A3A] max-w-[66ch]">
          Every ingredient mapped across ten flavour families, its harmonies from the aroma-compound network, and tools to
          compare, combine, and match to your own recipes.
        </p>
      </div>

      {/* numbered tab strip */}
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
          {tab === 0 && <WheelTab {...{ ingredients, families, vocabulary, ing, setIng, profile, pairings, wheelMode, setWheelMode }} />}
          {tab === 1 && <HarmoniesTab {...{ ingredients, ing, setIng, harm }} />}
          {tab === 2 && <LabTab {...{ ingredients, families, build, setBuild, lab, openWheel }} />}
          {tab === 3 && <CompareTab {...{ ingredients, families, pairA, pairB, setPairA, setPairB, cmp }} />}
          {tab === 4 && <RecipesTab {...{ ingredients, pairA, pairB, setPairA, setPairB, pairRecipes, setTab }} />}
          {tab === 5 && <RecipeTab {...{ recipeList, recipeSel, setRecipeSel, recipeH, families }} />}
          {tab === 6 && <LearnTab />}
          {tab === 7 && <SeasonalTab {...{ month, setMonth, ingByName, openWheel }} />}
        </>
      )}

      <p className="text-[11.5px] text-text-secondary mt-16 border-t border-border pt-5 max-w-[74ch]">
        Flavour notes derived from FlavorDB2 (incorporating FlavorNet), scored across ten families. Pairings &amp; harmonies
        from the flavour-compound network in Ahn et al., “Flavor network and the principles of food pairing,”
        <em> Nature Scientific Reports</em> (2011). Recipe matches run through a name bridge; the flavour and recipe data stay separate.
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
        {sub && <p className="text-[13.5px] text-text-secondary mt-1 max-w-[52ch]">{sub}</p>}
      </div>
      {right}
    </div>
  );
}
function Empty({ children }: { children: React.ReactNode }) {
  return <div className="border border-dashed border-border p-10 text-center"><p className="text-text-secondary text-[15px] max-w-[46ch] mx-auto">{children}</p></div>;
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

/* ── 01 Wheel ────────────────────────────────────────────────── */
function WheelTab({ ingredients, families, vocabulary, ing, setIng, profile, pairings, wheelMode, setWheelMode }: any) {
  return (
    <div>
      <div className="max-w-md mb-8"><IngredientPicker ingredients={ingredients} onSelect={setIng} placeholder="Search an ingredient — try “mint”, “garlic”, “coffee”…" /></div>
      {!ing || !profile ? (
        <Empty>Search an ingredient to open its flavour wheel — its notes across ten families, the strongest called out, and its pairings.</Empty>
      ) : (
        <div>
          <div className="flex items-baseline justify-between border-b border-text pb-2.5 mb-6 flex-wrap gap-3">
            <div><p className="text-[12px] text-text-secondary lowercase">{profile.category} · flavour profile</p><h2 className="text-[28px] tracking-[-0.01em]">{cap(profile.name)}</h2></div>
            <div className="flex items-center gap-3"><span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">Show</span>
              <div className="flex border border-border text-[12px]">
                <button onClick={() => setWheelMode('key')} className={`px-3 py-1.5 ${wheelMode === 'key' ? 'bg-text text-white' : 'text-text-secondary'}`}>Key notes</button>
                <button onClick={() => setWheelMode('all')} className={`px-3 py-1.5 ${wheelMode === 'all' ? 'bg-text text-white' : 'text-text-secondary'}`}>All notes</button>
              </div>
            </div>
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
            <div className="flex items-baseline justify-between border-b border-text pb-2.5 mb-1"><h3 className="text-[12.5px] text-text-secondary">Pairs well with</h3><span className="text-[11.5px] text-text-secondary">by shared aroma compounds</span></div>
            {pairings.length === 0 ? <p className="text-text-secondary text-[14px] py-4">No pairing data for {cap(profile.name)} yet.</p> : (
              <ul>{pairings.slice(0, 14).map((p: any) => (
                <li key={p.id} className="border-b border-border py-3 flex items-center gap-4">
                  <span className="text-[15px] min-w-[9rem]">{cap(p.name)}</span>
                  <span className="text-[12px] text-text-secondary lowercase w-28 hidden sm:block">{p.category}</span>
                  <div className="flex-1 h-[6px] bg-[#eee] overflow-hidden max-w-[220px]"><div className="h-full bg-text" style={{ width: `${p.strength}%` }} /></div>
                  <span className="text-[12px] text-text-secondary tabular-nums w-16 text-right">{p.shared} shared</span>
                </li>
              ))}</ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 02 Harmonies ────────────────────────────────────────────── */
function HarmoniesTab({ ingredients, ing, setIng, harm }: any) {
  return (
    <div>
      <div className="max-w-md mb-8"><IngredientPicker ingredients={ingredients} onSelect={setIng} placeholder="Search an ingredient to see its harmonies…" /></div>
      {!ing || !harm ? (
        <Empty>Pick an ingredient to see its harmonious connections — the partners it shares aromas with, and the flavour families that bridge them.</Empty>
      ) : (
        <div>
          <TabHead label="Harmonies" title={`Harmonious connections — ${cap(harm.base.name)}`} sub={`${cap(harm.base.name)}’s strongest note-to-partner harmonies, from the aroma-compound network.`} />
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-center">
            {harm.partners.length === 0 ? <Empty>No harmony data for {cap(harm.base.name)} in the flavour network yet.</Empty> : (
              <FlavorChord baseNotes={harm.baseNotes} partners={harm.partners} />
            )}
            <div>
              <div className="border-b border-text pb-2.5 mb-1"><span className="text-[12.5px] text-text-secondary">Strongest harmonies</span></div>
              {harm.partners.slice(0, 8).map((p: any, i: number) => (
                <div key={p.name + i} className="flex items-center justify-between py-2.5 border-b border-border text-[14px]">
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: FAMILY_COLORS[p.bridgeFamily || p.dominantFamily] || '#b8b3a8' }} />
                    {cap(p.name)}
                  </span>
                  <span className="tabular-nums text-text-secondary">{p.synergy}</span>
                </div>
              ))}
              {harm.insightFamilies.length > 0 && (
                <div className="border border-border bg-[#f6f6f4] p-4 mt-4">
                  <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1.5">◇ Insight</div>
                  <p className="text-[12.5px] leading-[1.6] text-[#3A3A3A] m-0">
                    {cap(harm.base.name)} connects mostly through its{' '}
                    {harm.insightFamilies.map((f: string, i: number) => (
                      <span key={f}><b style={{ color: FAMILY_COLORS[f] }}>{f.toLowerCase()}</b>{i < harm.insightFamilies.length - 1 ? ' and ' : ''}</span>
                    ))}{' '}notes — the families it most often shares with its partners.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 03 Lab ──────────────────────────────────────────────────── */
function LabTab({ ingredients, families, build, setBuild, lab, openWheel }: any) {
  const add = (i: PickIng) => setBuild((b: PickIng[]) => (b.find((x) => x.id === i.id) ? b : [...b, i]));
  const remove = (id: number) => setBuild((b: PickIng[]) => b.filter((x) => x.id !== id));
  const addById = (id: number, name: string) => add({ id, name, category: '' });
  return (
    <div>
      <TabHead label="Flavor Lab · The Bench" title="Invent a dish" sub="Add ingredients; the lab merges their wheels, scores the plate, and ranks what to add next." />
      <div className="grid lg:grid-cols-[0.9fr_1fr] gap-10 items-start">
        <div>
          <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-2.5">your build</div>
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
              <SynergyRead score={lab.synergy} label="plate synergy" />
              <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mt-8 mb-2">add next — by lift</div>
              {lab.nextAdds.length === 0 ? <p className="text-text-secondary text-[13.5px]">No strong additions found.</p> : lab.nextAdds.map((a: any) => (
                <div key={a.name} className="flex items-center gap-3 py-2 border-b border-[#f0f0f0]">
                  <button onClick={() => a.noteId && addById(a.noteId, a.name)} className="min-w-[8rem] text-[14.5px] text-left hover:underline underline-offset-2">{cap(a.name)}</button>
                  <div className="flex-1 h-[6px] bg-[#eee] max-w-[200px]"><div className="h-full" style={{ width: `${Math.min(100, a.lift)}%`, background: FAMILY_COLORS[a.family] || '#141310' }} /></div>
                  <span className="text-[12px] text-text-secondary tabular-nums w-10 text-right">+{a.lift}</span>
                </div>
              ))}
              <p className="text-[11.5px] text-text-secondary mt-4">{lab.inNetwork} of {build.length} in the aroma network · click a suggestion to add it.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 04 Compare ──────────────────────────────────────────────── */
function CompareTab({ ingredients, families, pairA, pairB, setPairA, setPairB, cmp }: any) {
  return (
    <div>
      <TabHead label="Pair" title="Compare two ingredients" sub="Two profiles on one wheel — first solid, second outlined — so you see where they reinforce and where they diverge." />
      <div className="grid sm:grid-cols-2 gap-6 max-w-xl mb-8">
        <div><div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1">{pairA ? cap(pairA.name) : 'first ingredient'}</div><IngredientPicker ingredients={ingredients} onSelect={setPairA} placeholder="Search…" /></div>
        <div><div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1">{pairB ? cap(pairB.name) : 'second ingredient'}</div><IngredientPicker ingredients={ingredients} onSelect={setPairB} placeholder="Search…" /></div>
      </div>
      {!cmp ? <Empty>Choose two ingredients to overlay their wheels and read their synergy.</Empty> : (
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 text-[12px] text-text-secondary mb-2 justify-end">
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 bg-text" />{cap(cmp.a.name)}</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 border border-text" />{cap(cmp.b.name)}</span>
            </div>
            <FlavorOverlayWheel families={families} aByFamily={abf(cmp.a.families)} bByFamily={abf(cmp.b.families)} />
          </div>
          <div>
            <SynergyRead score={cmp.synergy} label="pair synergy" />
            <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mt-7 mb-2">where they meet</div>
            <div className="grid grid-cols-[70px_1fr] gap-x-2.5 gap-y-2 items-center text-[12px]">
              {cmp.facets.map((f: any) => (
                <FacetRow key={f.family} f={f} />
              ))}
            </div>
            {cmp.bridging.length > 0 && (
              <p className="text-[12px] text-text-secondary mt-4">Bridging notes: {cmp.bridging.slice(0, 5).map((x: any) => cap(x.note)).join(', ')}.</p>
            )}
            <p className="text-[11.5px] text-text-secondary mt-2">{cmp.sharedCompounds} shared aroma compounds.</p>
          </div>
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

/* ── 05 Recipes (pair) ───────────────────────────────────────── */
function RecipesTab({ ingredients, pairA, pairB, setPairA, setPairB, pairRecipes, setTab }: any) {
  return (
    <div>
      <TabHead label="Pair" title="Recipes featuring this pair" sub="Your own recipes that use both ingredients — matched through the flavour bridge." />
      <div className="grid sm:grid-cols-2 gap-6 max-w-xl mb-8">
        <div><div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1">{pairA ? cap(pairA.name) : 'first ingredient'}</div><IngredientPicker ingredients={ingredients} onSelect={setPairA} placeholder="Search…" /></div>
        <div><div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1">{pairB ? cap(pairB.name) : 'second ingredient'}</div><IngredientPicker ingredients={ingredients} onSelect={setPairB} placeholder="Search…" /></div>
      </div>
      {!pairA || !pairB ? <Empty>Choose two ingredients to find recipes that use both.</Empty> : !pairRecipes ? <p className="text-text-secondary text-sm">Finding recipes…</p> : (
        <div>
          <div className="flex items-baseline justify-between border-b border-text pb-2 mb-5">
            <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">from your cookbook · {pairRecipes.recipes.length} use both</span>
            <span className="text-text-secondary text-[12.5px]">{cap(pairA.name)} × {cap(pairB.name)}</span>
          </div>
          {pairRecipes.recipes.length === 0 ? (
            <div className="border border-dashed border-border p-8 text-center">
              <p className="text-text-secondary text-[15px] mb-3">No recipe in your cookbook uses both yet.</p>
              <button onClick={() => setTab(2)} className="text-text underline underline-offset-2 text-[14px]">Invent one in the Lab →</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {pairRecipes.recipes.map((r: any) => (
                <Link key={r.id} href={`/recipes/${r.id}`} className="group">
                  <div className="aspect-[4/3] bg-[#f0efec] overflow-hidden">
                    {r.image_url && <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />}
                  </div>
                  {r.cuisine && <div className="text-[12px] text-text-secondary lowercase mt-2">{r.cuisine}</div>}
                  <div className="text-[16px] mt-0.5 group-hover:underline underline-offset-2">{r.title}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 06 Recipe harmony card ──────────────────────────────────── */
function RecipeTab({ recipeList, recipeSel, setRecipeSel, recipeH, families }: any) {
  return (
    <div>
      <TabHead label="Recipe card" title="Harmony on a recipe" sub="Pick a recipe: its combined mini-wheel, an overall harmony score, its tightest internal pairs, and one boost." />
      <div className="max-w-md mb-8">
        <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-2">choose a recipe</div>
        <select value={recipeSel} onChange={(e) => setRecipeSel(e.target.value)} className="w-full border border-border bg-white px-3 py-2 text-[14.5px]">
          <option value="">Select…</option>
          {recipeList.map((r: any) => <option key={r.id} value={r.id}>{r.title} ({r.mapped} mapped)</option>)}
        </select>
      </div>
      {!recipeSel ? <Empty>Pick a recipe with a couple of mapped flavour ingredients to see its harmony read-out.</Empty> : !recipeH ? <p className="text-text-secondary text-sm">Computing…</p> : (
        <div>
          <div className="text-[12px] text-text-secondary lowercase">{recipeH.recipe.cuisine || 'recipe'}</div>
          <h3 className="text-[28px] tracking-[-0.01em] mb-5"><Link href={`/recipes/${recipeH.recipe.id}`} className="hover:underline underline-offset-2">{recipeH.recipe.title}</Link></h3>
          <div className="border border-border p-6 grid md:grid-cols-[170px_120px_1fr] gap-7 items-center">
            <FlavorWheel families={families} activeByFamily={abf(recipeH.merged.families)} activeCount={recipeH.merged.activeNotes} variant="mini" size={200} />
            <div className="text-center">
              <div className="relative w-[104px] h-[104px] mx-auto rounded-full grid place-items-center" style={{ background: `conic-gradient(#141310 0 ${recipeH.harmony}%, #eee 0)` }}>
                <div className="absolute inset-[9px] bg-white rounded-full" />
                <div className="relative text-center"><b className="text-[30px] font-normal">{recipeH.harmony}</b><div className="text-[9px] uppercase tracking-[0.1em] text-text-secondary mt-0.5">harmony</div></div>
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-2">tightest pairs</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {recipeH.tightestPairs.map((p: any, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-[12.5px]">{cap(p.a)} · {cap(p.b)} <b className="text-text">{p.synergy}</b></span>
                ))}
              </div>
              {recipeH.boost && <p className="text-[13px] text-text-secondary m-0">Boost: a touch of <b className="text-text">{cap(recipeH.boost.name)}</b> would tie the plate together <span className="text-text">(+{recipeH.boost.lift})</span>.</p>}
              <p className="text-[11.5px] text-text-secondary mt-3">ingredients read: {recipeH.ingredients.map(cap).join(', ')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 07 Learn ────────────────────────────────────────────────── */
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

/* ── 08 Seasonal ─────────────────────────────────────────────── */
function SeasonalTab({ month, setMonth, ingByName, openWheel }: any) {
  const items = SEASONAL[month] || [];
  return (
    <div>
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
        <h2 className="text-[24px] tracking-[-0.01em]">In season</h2>
        <span className="text-text-secondary text-[13px]">temperate calendar · Northern Hemisphere</span>
      </div>
      <div className="flex gap-3 md:gap-4 text-[13px] border-b border-border pb-2.5 mb-7 overflow-x-auto">
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setMonth(i)} className={`whitespace-nowrap ${i === month ? 'text-text border-b-2 border-text pb-2' : 'text-text-secondary hover:text-text'}`}>{m}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => {
          const found = ingByName.get(it.name.toLowerCase());
          const color = FAMILY_COLORS[it.family] || '#999';
          return (
            <button key={it.name} disabled={!found} onClick={() => found && openWheel(found)}
              className={`border border-border text-left ${found ? 'hover:border-text cursor-pointer' : 'opacity-70 cursor-default'}`}>
              <div className="h-[78px]" style={{ background: `linear-gradient(150deg, ${color}, ${color}bb)` }} />
              <div className="p-3">
                <div className="text-[15px]">{it.name}</div>
                <div className="text-[11.5px] text-text-secondary mt-0.5">{found ? 'peak · open wheel →' : 'peak'}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
