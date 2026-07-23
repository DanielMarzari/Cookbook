'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { FAMILY_COLORS, cap, dishScore } from '@/lib/flavor';
import { FAMILIES_LEGEND } from '@/data/flavor-content';
import { DISH_EXEMPLARS } from '@/data/dish-exemplars';
import FlavorWheel from '@/components/FlavorWheel';
import FlavorOverlayWheel from '@/components/FlavorOverlayWheel';
import FlavorTriangle from '@/components/flavor/FlavorTriangle';
import IngredientPicker, { PickIng } from '@/components/flavor/IngredientPicker';

type Families = { name: string; notes: { note: string; intensity: number }[] }[];
const abf = (families: Families) => Object.fromEntries((families || []).map((f) => [f.name, f.notes]));
const synWord = (n: number) => (n >= 70 ? 'High' : n >= 45 ? 'Moderate' : n >= 20 ? 'Low' : 'Faint');

// Recognisable ingredients the bench opens with (a random two) so the Lab never
// loads empty. Curated rather than truly random — "Bilberry Wine + Lupine" is a
// bad first impression.
const STARTERS = ['Tomato', 'Basil', 'Olive oil', 'Garlic', 'Lemon', 'Butter', 'Mushroom', 'Chicken', 'Beef', 'Onion',
  'Ginger', 'Chili', 'Honey', 'Almond', 'Parmesan Cheese', 'Mint', 'Coriander', 'Coconut', 'Orange', 'Rosemary',
  'Thyme', 'Bacon', 'Egg', 'Chocolate', 'Strawberry', 'Pepper', 'Vanilla', 'Carrot', 'Potato', 'Lime',
  'Cinnamon', 'Walnut', 'Feta', 'Soy sauce', 'Sesame oil', 'Apple', 'Pine nuts', 'Maple syrup'];

const VIEWS = [
  { id: 'invent', label: 'Invent a dish' },
  { id: 'wheel', label: 'Ingredient wheel' },
  { id: 'pair', label: 'Pair two' },
  { id: 'learn', label: 'Learn' },
] as const;
type ViewId = (typeof VIEWS)[number]['id'];

export default function FlavorLabPage() {
  const [families, setFamilies] = useState<string[]>([]);
  const [vocabulary, setVocabulary] = useState<Record<string, string[]>>({});
  const [ingredients, setIngredients] = useState<PickIng[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewId>('invent');

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
  const [labMode, setLabMode] = useState<'key' | 'all'>('all');
  const [labMetric, setLabMetric] = useState<'harmony' | 'complement' | 'affinity'>('harmony');
  const [webRecipes, setWebRecipes] = useState<Awaited<ReturnType<typeof api.flavor.recipesWeb>>['recipes']>([]);
  const [webLoading, setWebLoading] = useState(false);

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

  // Seed the bench with a random pair so the Lab opens with something on it.
  useEffect(() => {
    if (ingredients.length === 0 || build.length > 0) return;
    if (new URLSearchParams(window.location.search).get('ingredient')) return; // respect deep-links
    const pool = STARTERS.map((n) => ingByName.get(n.toLowerCase())).filter(Boolean) as PickIng[];
    if (pool.length < 2) return;
    const i = Math.floor(Math.random() * pool.length);
    let j = Math.floor(Math.random() * pool.length);
    while (j === i) j = Math.floor(Math.random() * pool.length);
    setBuild([pool[i], pool[j]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients]);

  // With a real plate (2+), pull online recipes that use the combo.
  useEffect(() => {
    if (build.length < 2) { setWebRecipes([]); return; }
    setWebLoading(true);
    api.flavor.recipesWeb(build.map((b) => b.name)).then((d) => setWebRecipes(d.recipes || [])).catch(() => setWebRecipes([])).finally(() => setWebLoading(false));
  }, [build]);

  // Deep-link: /flavor?ingredient=Tomato (from Seasonal) opens the wheel.
  useEffect(() => {
    if (ingredients.length === 0 || ing) return;
    const q = new URLSearchParams(window.location.search).get('ingredient');
    if (q) { const found = ingByName.get(q.toLowerCase()); if (found) { setIng(found); setView('wheel'); } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients]);

  const openPair = (b: PickIng) => { setPairB(b); setView('pair'); };

  return (
    <div className="max-w-[1680px] mx-auto px-4 md:px-8 xl:px-12 pb-24">
      <div className="pt-10 md:pt-16 pb-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-text-secondary mb-3">Flavor Lab · flavour science for the kitchen</p>
        <h1 className="text-[34px] md:text-[52px] leading-[1.02] tracking-[-0.02em] font-normal text-text mb-4">Invent a dish</h1>
        <p className="text-[16px] leading-[1.6] text-[#3A3A3A] max-w-[64ch]">
          Build a plate and read how it hangs together — or step aside to explore a single ingredient&rsquo;s wheel, pair any two,
          and learn how flavour works.
        </p>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading…</p>
      ) : (
        <div className="grid md:grid-cols-[168px_1fr] gap-8 border-t border-border pt-8">
          <nav className="flex md:flex-col gap-1 md:gap-0.5 overflow-x-auto md:sticky md:top-6 md:self-start">
            {VIEWS.map((v) => (
              <button key={v.id} onClick={() => setView(v.id)}
                className={`text-left whitespace-nowrap px-3 py-2 text-[14.5px] border-l-2 transition-colors ${view === v.id ? 'border-text text-text font-medium' : 'border-transparent text-text-secondary hover:text-text'}`}>
                {v.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0">
            {view === 'invent' && <LabTab {...{ ingredients, families, vocabulary, build, setBuild, lab, labMetric, setLabMetric, labMode, setLabMode, webRecipes, webLoading }} />}
            {view === 'wheel' && <WheelTab {...{ ingredients, families, vocabulary, ing, setIng, profile, pairings, wheelRecipes, wheelMode, setWheelMode, openPair }} />}
            {view === 'pair' && <PairTab {...{ ingredients, families, vocabulary, ing, setIng, pairB, setPairB, rel, pairMode, setPairMode }} />}
            {view === 'learn' && <LearnTab />}
          </div>
        </div>
      )}

      <p className="text-[11.5px] text-text-secondary mt-16 border-t border-border pt-5 max-w-[78ch]">
        Notes from FlavorDB2 (incorporating FlavorNet). <b className="font-medium text-text">Affinity</b> = shared aroma
        compounds (Ahn et al., 2011). <b className="font-medium text-text">Harmony</b> = real recipe co-occurrence
        (FlavorGraph / Recipe1M) where available, else note-association. <b className="font-medium text-text">Complement</b> =
        culinary balance — acid cutting fat, fresh lifting rich, and the muddiness that comes of piling like on like.
      </p>
    </div>
  );
}

/* ── shared bits ─────────────────────────────────────────────── */
function TabHead({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="border-b border-text pb-2.5 mb-6">
      <p className="text-[11px] uppercase tracking-[0.14em] text-text-secondary mb-1">{label}</p>
      <h2 className="text-[26px] tracking-[-0.01em] text-text">{title}</h2>
      {sub && <p className="text-[13.5px] text-text-secondary mt-1 max-w-[56ch]">{sub}</p>}
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
const scoreWord = (n: number) => (n >= 90 ? 'Exceptional' : n >= 75 ? 'Excellent' : n >= 60 ? 'Very good' : n >= 45 ? 'Promising' : n >= 30 ? 'Rough' : 'Clashing');
// One axis of the plate. When `onClick` is given it becomes a selector — pick the
// axis you want to lift and the "add next" list re-ranks for it.
function AxisRead({ label, value, active, onClick }: { label: string; value: number; active?: boolean; onClick?: () => void }) {
  const inner = (
    <>
      <div className="flex items-baseline justify-between mb-1">
        <span className={`text-[11px] uppercase tracking-[0.11em] ${active ? 'text-text' : 'text-text-secondary'}`}>{label}</span>
        <span className="text-[13px] tabular-nums text-text">{value}</span>
      </div>
      <div className="relative h-[5px] bg-[#eee]"><div className="h-full bg-text transition-[width] duration-500 ease-out" style={{ width: `${value}%` }} /></div>
    </>
  );
  if (!onClick) return <div>{inner}</div>;
  return (
    <button onClick={onClick} title={`Lift ${label.toLowerCase()}`}
      className={`text-left w-full pb-1.5 border-b-2 transition-colors ${active ? 'border-text' : 'border-transparent hover:border-border'}`}>
      {inner}
    </button>
  );
}
function MetricRead({ score, label, children }: { score: number; label: string; children?: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1.5">{label}</div>
      <div className="flex items-baseline gap-2 mb-2"><b className="text-[26px] font-normal">{synWord(score)}</b><span className="text-text-secondary text-[12px] tabular-nums">{score} / 100</span></div>
      <div className="relative h-[6px] bg-[#eee]"><div className="h-full bg-text transition-[width] duration-500 ease-out" style={{ width: `${score}%` }} /></div>
      {children}
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

/* ── Invent a dish (the main view) ───────────────────────────── */
function LabTab({ ingredients, families, vocabulary, build, setBuild, lab, labMetric, setLabMetric, labMode, setLabMode, webRecipes, webLoading }: any) {
  const add = (i: PickIng) => setBuild((b: PickIng[]) => (b.find((x) => x.id === i.id) ? b : [...b, i]));
  const remove = (id: number) => setBuild((b: PickIng[]) => b.filter((x) => x.id !== id));
  const addById = (id: number, name: string) => add({ id, name, category: '' });
  const addByName = (name: string) => { const m = ingredients.find((x: PickIng) => x.name.toLowerCase() === name.toLowerCase()); if (m) add(m); };
  // Only trust `lab` once it describes the plate on screen — otherwise the stale
  // result briefly renders a 0 / "Clashing" score while the new one computes.
  const ready = !!lab && lab.members.length === build.length && lab.members.every((m: any, i: number) => m.id === build[i].id);
  return (
    <div>
      <TabHead label="The Bench" title="Invent a dish" sub="The lab scores the plate, tells you what to add and by how much, reads its cuisine, and pulls real recipes to try." />
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] gap-6 lg:gap-10 items-start mb-9">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">your build</span>
            {build.length > 0 && <button onClick={() => setBuild([])} className="text-[12px] text-text-secondary hover:text-text underline underline-offset-2">Clear</button>}
          </div>
          {build.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {build.map((b: PickIng) => (
                <span key={b.id} className="inline-flex items-center gap-2 border border-border px-2.5 py-1 text-[13px]">{cap(b.name)}
                  <button onClick={() => remove(b.id)} className="text-text-secondary hover:text-text">×</button>
                </span>
              ))}
            </div>
          )}
          <div className="max-w-md"><IngredientPicker ingredients={ingredients} onSelect={add} placeholder="+ add an ingredient…" /></div>
        </div>
        {build.length >= 2 && ready && <CuisineBadge cuisine={lab.cuisine} ingredients={ingredients} addByName={addByName} />}
      </div>

      {build.length < 2 ? (
        <Empty>Add {build.length === 0 ? 'two ingredients' : 'one more ingredient'} to score a plate.</Empty>
      ) : !ready ? (
        <PlateSkeleton />
      ) : (
        <InventPlate {...{ families, vocabulary, build, lab, labMetric, setLabMetric, labMode, setLabMode, addById, webRecipes, webLoading }} />
      )}
    </div>
  );
}

/* shown while the lab recomputes, instead of a stale 0 / "Clashing" */
function PlateSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid gap-8 items-start lg:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_330px_370px]">
        <div>
          <div className="h-3 w-40 bg-[#eee] mb-4" />
          <div className="aspect-square max-w-[640px] mx-auto rounded-full border-[28px] border-[#f2f1ed]" />
        </div>
        <div>
          <div className="h-3 w-24 bg-[#eee] mb-3" />
          <div className="h-6 w-40 bg-[#eee] mb-4" />
          <div className="h-[150px] w-[260px] mx-auto bg-[#f4f3f0] mb-4" />
          <div className="grid grid-cols-3 gap-3">{[0, 1, 2].map((i) => <div key={i} className="h-8 bg-[#f4f3f0]" />)}</div>
        </div>
        <div className="lg:col-start-2 2xl:col-start-3 2xl:row-start-1">
          <div className="h-3 w-28 bg-[#eee] mb-3" />
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-6 bg-[#f4f3f0] mb-2" />)}
        </div>
      </div>
      <p className="text-[12.5px] text-text-secondary mt-6">Scoring the plate…</p>
    </div>
  );
}

/* the three axes double as the sort for "add next" */
function SortTabs({ value, set }: { value: string; set: (v: any) => void }) {
  return (
    <div className="flex border border-border text-[12px]">
      {(['harmony', 'complement', 'affinity'] as const).map((m) => (
        <button key={m} onClick={() => set(m)}
          className={`flex-1 px-2 py-1.5 capitalize transition-colors ${value === m ? 'bg-text text-white' : 'text-text-secondary hover:text-text'}`}>
          {m}
        </button>
      ))}
    </div>
  );
}

/* the plate (2+ ingredients): v3 — wheel + score/suggestions, cuisine, recipe gallery */
function InventPlate({ families, vocabulary, build, lab, labMetric, setLabMetric, labMode, setLabMode, addById, webRecipes, webLoading }: any) {
  const adds = labMetric === 'harmony' ? lab.harmonyAdds : labMetric === 'complement' ? lab.complementAdds : lab.affinityAdds;
  return (
    <div>
      <div className="grid gap-8 items-start lg:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_330px_370px]">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
            <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">the plate&rsquo;s combined wheel</span>
            <ModeToggle mode={labMode} set={setLabMode} />
          </div>
          <div className="max-w-[640px] mx-auto">
            <FlavorWheel families={families} vocabulary={vocabulary} activeByFamily={abf(lab.merged.families)} activeCount={lab.merged.activeNotes} mode={labMode} />
          </div>
        </div>
        <div>
          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1">dish score</div>
            <div className="flex items-baseline gap-2 mb-2"><b className="text-[22px] font-normal">{scoreWord(lab.score)}</b><span className="text-text-secondary text-[12px]">its share of a great dish</span></div>
            <FlavorTriangle h={lab.harmony} c={lab.complement} a={lab.affinity} score={lab.score} className="max-w-[300px] mx-auto" />
            <div className="grid grid-cols-3 gap-3 mt-3">
              <AxisRead label="Harmony" value={lab.harmony} />
              <AxisRead label="Complement" value={lab.complement} />
              <AxisRead label="Affinity" value={lab.affinity} />
            </div>
          </div>
          <Link href={`/add-recipe?ingredients=${encodeURIComponent(build.map((b: PickIng) => cap(b.name)).join(', '))}`}
            className="flex items-center justify-between px-3.5 py-2.5 bg-text text-white text-[14px] hover:bg-[#2a2a2a] transition-colors">
            <span>Draft a recipe with these</span><span aria-hidden>→</span>
          </Link>
        </div>
        <div className="lg:col-start-2 2xl:col-start-3 2xl:row-start-1">
          <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1.5">sort by</div>
          <SortTabs value={labMetric} set={setLabMetric} />
          <div className="flex items-baseline justify-between mt-4 mb-2.5 flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">add next <span className="text-text-secondary normal-case tracking-normal">· {labMetric} fit &amp; score change</span></span>
            {adds.length > 0 && <span className="text-[11px] text-text-secondary tabular-nums">{adds.length}</span>}
          </div>
          {adds.length === 0 ? (
            <p className="text-text-secondary text-[13.5px]">Nothing found that wouldn&rsquo;t drop the dish score by more than 5.</p>
          ) : (
            <div className="max-h-[360px] overflow-y-auto pr-1 -mr-1">
              {adds.map((a: any) => (
                <div key={a.name} className="flex items-center gap-2.5 py-2 border-b border-[#f0f0f0]">
                  <button onClick={() => a.noteId && addById(a.noteId, a.name)} className="min-w-[6.8rem] text-[14px] text-left hover:underline underline-offset-2">{cap(a.name)}</button>
                  <div className="flex-1 h-[5px] bg-[#eee] max-w-[150px] overflow-hidden"><div className="h-full transition-[width] duration-500 ease-out" style={{ width: `${Math.min(100, a.fit)}%`, background: FAMILY_COLORS[a.family] || '#141310' }} /></div>
                  <span className="text-[12px] text-text-secondary tabular-nums w-6 text-right">{a.fit}</span>
                  <span className="text-[11.5px] font-semibold tabular-nums w-8 text-right" style={{ color: a.delta >= 0 ? '#4a7a52' : '#a0522d' }}>{a.delta >= 0 ? '+' : ''}{a.delta}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11.5px] text-text-secondary mt-3">The last column is what it does to the dish score — green lifts, brown costs a little. Click to add.</p>
        </div>
      </div>
      <WebRecipeGallery recipes={webRecipes} loading={webLoading} build={build} />
      <CompareShelf plate={{ h: lab.harmony, c: lab.complement, a: lab.affinity, score: lab.score }} />
    </div>
  );
}

/* cuisine "genre" read + fusion nudges */
function CuisineBadge({ cuisine, ingredients, addByName }: any) {
  const CUCOL = ['#2a2820', '#7a5c3e', '#b08d5f', '#cdb389'];
  const mix: { name: string; pct: number }[] = cuisine?.mix || [];
  const nudges: { name: string; add: string; delta: number }[] = cuisine?.nudges || [];
  if (mix.length === 0) return null;
  const primary = mix[0].name;
  return (
    <div className="border border-border p-4 md:p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">what are you cooking?</span>
          <div className="text-[22px] tracking-[-0.01em] mt-1">Leans <b className="font-semibold">{primary}</b>{mix[1] ? <>, with a {mix[1].name} accent</> : null}</div>
        </div>
        {nudges.length > 0 && (
          <div className="max-w-[300px]">
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-text-secondary mb-1.5">push it into fusion</div>
            <div className="flex flex-wrap gap-1.5">
              {nudges.map((n) => (
                <button key={n.name} onClick={() => addByName(n.add)} title={`Add ${n.add} — ${n.delta >= 0 ? '+' : ''}${n.delta} to the dish score`}
                  className="text-[11.5px] border border-dashed border-border rounded-full px-2.5 py-1 hover:border-text hover:bg-[#f6f5f2] transition-colors">
                  {n.name} <b className="text-text">+ {n.add}</b>
                  <span className="ml-1 font-semibold tabular-nums" style={{ color: n.delta >= 0 ? '#4a7a52' : '#a0522d' }}>{n.delta >= 0 ? '+' : ''}{n.delta}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex h-[9px] rounded-full overflow-hidden mt-3.5 mb-2">
        {mix.map((m, i) => <div key={m.name} style={{ width: `${m.pct}%`, background: CUCOL[i] || '#ddd' }} />)}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-text-secondary">
        {mix.map((m, i) => (
          <span key={m.name} className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-[2px]" style={{ background: CUCOL[i] || '#ddd' }} />{m.name} <b className="text-text tabular-nums">{m.pct}%</b></span>
        ))}
      </div>
    </div>
  );
}

/* scraped online recipes for the combo */
function WebRecipeGallery({ recipes, loading, build }: any) {
  return (
    <div className="mt-14">
      <div className="flex items-baseline justify-between border-b border-text pb-2 mb-5">
        <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">cook this base · recipes from the web</span>
        <span className="text-text-secondary text-[12px] lowercase">{build.map((b: PickIng) => b.name).join(' · ')}</span>
      </div>
      {loading ? (
        <p className="text-text-secondary text-[14px] py-3">Searching the web for recipes with this combo…</p>
      ) : recipes.length === 0 ? (
        <p className="text-text-secondary text-[13.5px] py-3">No online recipes found for this exact combo yet — try removing one ingredient, or <Link className="underline underline-offset-2" href={`/add-recipe?ingredients=${encodeURIComponent(build.map((b: PickIng) => cap(b.name)).join(', '))}`}>draft your own</Link>.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
          {recipes.map((r: any) => (
            <a key={r.link} href={r.link} target="_blank" rel="noopener noreferrer" className="group border border-border overflow-hidden hover:border-text transition-colors">
              <div className="aspect-[4/3] bg-[#f0efec] overflow-hidden relative">
                <img src={r.image} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                <span className="absolute top-2 right-2 bg-white/85 rounded w-6 h-6 flex items-center justify-center text-[12px]" aria-hidden>↗</span>
              </div>
              <div className="p-3">
                <div className="text-[14.5px] leading-snug group-hover:underline underline-offset-2">{r.title}</div>
                {r.missing?.length > 0 ? (
                  <div className="text-[11.5px] text-[#a0522d] mt-1">no {r.missing.map((m: string) => m.toLowerCase()).join(', ')}</div>
                ) : (
                  <div className="text-[11.5px] text-[#4a7a52] mt-1">has all {r.matched?.length ?? ''}</div>
                )}
                <div className="text-[12px] text-text-secondary mt-0.5">{r.source} ↗</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Compare shelf: your plate ranked against real celebrated dishes ──── */
function CompareShelf({ plate }: { plate: { h: number; c: number; a: number; score: number } | null }) {
  const tiles = [
    ...(plate ? [{ dish: 'Your plate', ...plate, you: true }] : []),
    ...DISH_EXEMPLARS.map((e) => ({ dish: e.dish, h: e.h, c: e.c, a: e.a, score: dishScore(e.h, e.c, e.a), you: false })),
  ].sort((x, y) => y.score - x.score);
  return (
    <div className="mt-14">
      <div className="flex items-baseline justify-between border-b border-text pb-2 mb-1">
        <span className="text-[11px] uppercase tracking-[0.13em] text-text-secondary">measured against great dishes</span>
        <span className="text-text-secondary text-[12px]">Noma + classics · high → low</span>
      </div>
      <p className="text-[12.5px] text-text-secondary mb-5 max-w-[64ch]">Baselines the score is calibrated on — each measured by the Lab itself. They reach excellence by different routes: Coq&nbsp;au&nbsp;vin leans on harmony, Guacamole on complement.{plate ? ' Your plate is ranked in among them.' : ''}</p>
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x">
        {tiles.map((t) => (
          <div key={t.dish} className={`flex-none w-[104px] text-center snap-start pt-1.5 ${t.you ? 'ring-1 ring-text rounded-sm bg-[#faf9f6]' : ''}`}>
            <FlavorTriangle h={t.h} c={t.c} a={t.a} variant="compact" className="max-w-[88px] mx-auto" />
            <div className="text-[16px] tabular-nums text-text mt-0.5">{t.score}</div>
            <div className={`text-[11px] leading-tight mt-0.5 px-1 pb-1.5 ${t.you ? 'text-text font-medium' : 'text-text-secondary'}`}>{t.dish}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Ingredient wheel ────────────────────────────────────────── */
function WheelTab({ ingredients, families, vocabulary, ing, setIng, profile, pairings, wheelRecipes, wheelMode, setWheelMode, openPair }: any) {
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
            <div className="max-w-[640px] mx-auto w-full"><FlavorWheel families={families} vocabulary={vocabulary} activeByFamily={abf(profile.families)} activeCount={profile.activeNotes} mode={wheelMode} /></div>
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
                  <button onClick={() => { const m = ingredients.find((x: PickIng) => x.name.toLowerCase() === p.name.toLowerCase()); if (m) openPair(m); }}
                    className="text-[15px] min-w-[9rem] text-left hover:underline underline-offset-2" title="Pair with this">{cap(p.name)}</button>
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

/* ── Pair two ────────────────────────────────────────────────── */
function PairTab({ ingredients, families, vocabulary, ing, setIng, pairB, setPairB, rel, pairMode, setPairMode }: any) {
  return (
    <div>
      <TabHead label="Discover flavour relationships" title="Pair two ingredients" sub="Three lenses: harmony (do they belong together), complement (do they draw each other out — acid cutting fat, fresh lifting rich), and aroma affinity (do they smell alike)." />
      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-end max-w-2xl mb-9">
        <div><div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1">{ing ? cap(ing.name) : 'first ingredient'}</div><IngredientPicker ingredients={ingredients} onSelect={setIng} placeholder="Search…" /></div>
        <div className="text-[20px] text-text-secondary pb-2 text-center hidden sm:block">+</div>
        <div><div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-1">{pairB ? cap(pairB.name) : 'second ingredient'}</div><IngredientPicker ingredients={ingredients} onSelect={setPairB} placeholder="Search…" /></div>
      </div>

      {!ing || !pairB ? (
        <Empty>Choose two ingredients to reveal their relationship — whether they belong together, draw each other out, or simply smell alike.</Empty>
      ) : !rel ? <p className="text-text-secondary text-sm">Reading the relationship…</p> : (
        <div>
          <div className="flex items-baseline gap-3 border-b border-text pb-2.5 mb-6">
            <span className="text-[26px] tracking-[-0.01em]">{cap(rel.a.name)}</span>
            <span className="text-text-secondary text-[20px]">+</span>
            <span className="text-[26px] tracking-[-0.01em]">{cap(rel.b.name)}</span>
          </div>

          <div className="grid lg:grid-cols-[230px_1fr] gap-8 items-center mb-4">
            <FlavorTriangle h={rel.harmony} c={rel.complement} a={rel.affinity} className="max-w-[230px] mx-auto" />
            <div className="grid sm:grid-cols-3 gap-7">
              <MetricRead score={rel.harmony} label="harmony · do they belong">
                {rel.proven ? (
                  <p className="text-[12px] text-text-secondary mt-2 flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-[0.1em] text-text border border-text px-1.5 py-0.5">✓ proven</span> in real recipes.
                  </p>
                ) : <p className="text-[12px] text-text-secondary mt-2">structural estimate.</p>}
              </MetricRead>
              <MetricRead score={rel.complement} label="complement · do they balance">
                <p className={`text-[12px] mt-2 ${rel.muddyRisk ? 'text-[#a0522d]' : 'text-text-secondary'}`}>{rel.complementWhy}</p>
              </MetricRead>
              <MetricRead score={rel.affinity} label="aroma affinity · alike">
                <p className="text-[12px] text-text-secondary mt-2">{rel.sharedCompounds} shared compounds{rel.compoundNotes.length ? `: ${rel.compoundNotes.slice(0, 3).map(cap).join(', ')}` : ''}.</p>
              </MetricRead>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start mt-8">
            <div>
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div className="flex items-center gap-3 text-[12px] text-text-secondary">
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 bg-text" />{cap(rel.a.name)}</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 border border-text" />{cap(rel.b.name)}</span>
                </div>
                <ModeToggle mode={pairMode} set={setPairMode} />
              </div>
              <div className="max-w-[640px] mx-auto w-full"><FlavorOverlayWheel families={families} vocabulary={vocabulary} aByFamily={abf(rel.a.families)} bByFamily={abf(rel.b.families)} mode={pairMode} /></div>
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

/* ── Learn ───────────────────────────────────────────────────── */
function LearnTab() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-text-secondary mb-2">the science, in plain terms</p>
      <h2 className="text-[28px] md:text-[38px] leading-[1.12] tracking-[-0.01em] max-w-[22ch] mb-3">Most of “taste” is actually smell.</h2>
      <p className="text-[15px] leading-[1.65] text-[#3A3A3A] max-w-[62ch] mb-8">
        Your tongue reads five things — sweet, sour, salty, bitter, umami. Everything else arrives as aroma: hundreds of
        volatile compounds, which we group into ten families. That grouping is the language of the wheel, and the basis for
        every score in this Lab.
      </p>
      <div className="border border-border p-5 mb-10 max-w-[64ch]">
        <div className="text-[11px] uppercase tracking-[0.13em] text-text-secondary mb-2.5">three ways two flavours relate</div>
        <p className="text-[13.5px] leading-[1.6] text-[#3A3A3A] m-0">
          <b className="text-text">Affinity</b> — they smell alike (shared aroma compounds). <b className="text-text">Harmony</b> —
          they&rsquo;re genuinely cooked together (real recipe co-occurrence). <b className="text-text">Complement</b> — they
          balance each other: acid cuts fat, sweet rounds sour, fresh lifts rich. A pair can be strong on one and weak on
          another — mint &amp; chocolate complement beautifully without sharing much aroma.
        </p>
      </div>
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
