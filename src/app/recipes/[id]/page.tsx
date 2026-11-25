'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api-client';
import { toast } from '@/lib/toast';
import { Recipe, RecipeIngredient, Ingredient, NutritionInfo } from '@/lib/types';
import { ArrowLeft, Heart, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatTime, titleCaseIngredient } from '@/lib/utils';
import { convertUnitToGrams, convertMeasure, formatQuantity, type UnitSystem } from '@/lib/units';
import { framingStyle } from '@/lib/image';
import CookLogSection from '@/components/CookLogSection';
import PhotoGallery from '@/components/PhotoGallery';
import RecipeFlavorCard from '@/components/RecipeFlavorCard';
import VariationChips, { type ActiveVersion } from '@/components/VariationChips';
import BranchDialog, { type BranchCandidate } from '@/components/BranchDialog';
import { RecipePhoto } from '@/lib/types';

interface NutritionCalculation {
  nutrition: NutritionInfo;
  matchedCount: number;
  totalCount: number;
}

// Match a recipe ingredient to a library ingredient: prefer the explicit
// ingredient_id link, then fall back to a case-insensitive name/alias match.
function matchIngredient(
  recipeIng: RecipeIngredient,
  allIngredients: Ingredient[]
): Ingredient | undefined {
  if (recipeIng.ingredient_id) {
    const byId = allIngredients.find((ing) => ing.id === recipeIng.ingredient_id);
    if (byId) return byId;
  }
  const name = recipeIng.name.toLowerCase().trim();
  return allIngredients.find(
    (ing) =>
      ing.name.toLowerCase().trim() === name ||
      (ing.aliases || []).some((a) => a.toLowerCase().trim() === name)
  );
}

// Estimate per-serving nutrition by summing matched ingredients' macros.
function computeNutrition(
  recipe: Recipe,
  recipeIngredients: RecipeIngredient[],
  allIngredients: Ingredient[]
): NutritionCalculation | null {
  const real = recipeIngredients.filter((ing) => ing.name && !ing.name.startsWith('---'));
  if (real.length === 0) return null;

  const total: NutritionInfo = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 };
  let matchedCount = 0;

  for (const recipeIng of real) {
    const matched = matchIngredient(recipeIng, allIngredients);
    if (!matched) continue;
    matchedCount++;
    const grams = convertUnitToGrams(recipeIng.quantity, recipeIng.unit);
    if (grams === null) continue;
    const factor = grams / 100;
    total.calories += matched.calories_per_100g * factor;
    total.protein += matched.protein_per_100g * factor;
    total.carbs += matched.carbs_per_100g * factor;
    total.fat += matched.fat_per_100g * factor;
    total.fiber += matched.fiber_per_100g * factor;
    total.sugar += matched.sugar_per_100g * factor;
    total.sodium += matched.sodium_per_100g * factor;
  }

  const servings = recipe.servings || 1;
  const round = (n: number) => Math.round((n / servings) * 10) / 10;
  return {
    nutrition: {
      calories: Math.round(total.calories / servings),
      protein: round(total.protein),
      carbs: round(total.carbs),
      fat: round(total.fat),
      fiber: round(total.fiber),
      sugar: round(total.sugar),
      sodium: round(total.sodium),
    },
    matchedCount,
    totalCount: real.length,
  };
}

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [branching, setBranching] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  // Which version of a branched recipe is being read. null = the recipe this
  // page was opened as, which is not always the base — open a branch directly
  // and that branch is what null means.
  const [version, setVersion] = useState<ActiveVersion | null>(null);
  const [versionPhotos, setVersionPhotos] = useState<RecipePhoto[] | null>(null);
  const [nutrition, setNutrition] = useState<NutritionCalculation | null>(null);
  const [imageRotation, setImageRotation] = useState(0);
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('original');
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [addingToGrocery, setAddingToGrocery] = useState(false);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [photos, setPhotos] = useState<RecipePhoto[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        // Safety check: validate that id exists and is valid
        if (!id || id === 'undefined') {
          setError('Invalid recipe ID');
          setLoading(false);
          return;
        }

        const data = await api.recipes.get(id);

        if (data) {
          setRecipe(data);
          setIsFavorite(data.is_favorite);
          setImageRotation(data.image_rotation || 0);

          // Fetch recipe ingredients and the ingredient library together so we
          // can both render and compute nutrition from linked ingredients.
          const [ingData, allIngs, photoData] = await Promise.all([
            api.recipeIngredients.list(id),
            api.ingredients.list(),
            api.recipePhotos.list(id),
          ]);
          setRecipeIngredients(ingData || []);
          setAllIngredients(allIngs || []);
          setPhotos(photoData || []);
          setNutrition(computeNutrition(data, ingData || [], allIngs || []));
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recipe');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // The id of whatever version is on screen. Everything that belongs to a
  // recipe rather than to a family hangs off this: what you tick off, what you
  // favourite, what Edit opens, what a cook log is logged against.
  const shownId = version?.id ?? id;

  // The heart in the header marks whatever is on screen, so it has to follow
  // the version rather than stay on the recipe the URL names.
  useEffect(() => {
    if (version) setIsFavorite(Boolean(version.is_favorite));
    else if (recipe) setIsFavorite(Boolean(recipe.is_favorite));
  }, [version, recipe]);

  // Switching versions brings that version's gallery with it. The hero picture
  // and everything above it arrive with the family, so only this needs a
  // request, and it is far below the fold by the time it lands.
  useEffect(() => {
    if (!version) { setVersionPhotos(null); return; }
    let live = true;
    api.recipePhotos.list(version.id)
      .then((p) => { if (live) setVersionPhotos(p || []); })
      .catch(() => { if (live) setVersionPhotos([]); });
    return () => { live = false; };
  }, [version]);

  // Load persisted unit system + checked-off state. The ticks are per version:
  // the base's half-ticked list has nothing to say about the branch you just
  // switched to, and carrying it over would tick off lines that aren't there.
  useEffect(() => {
    try {
      const savedSystem = localStorage.getItem('cookbook:unitSystem') as UnitSystem | null;
      if (savedSystem) setUnitSystem(savedSystem);
      const raw = localStorage.getItem(`cookbook:checked:${shownId}`);
      const parsed = raw ? JSON.parse(raw) : {};
      setCheckedIngredients(new Set<number>(parsed.ingredients || []));
      setCheckedSteps(new Set<number>(parsed.steps || []));
    } catch { /* ignore corrupt storage */ }
  }, [shownId]);

  const persistChecked = (ingredients: Set<number>, steps: Set<number>) => {
    try {
      localStorage.setItem(
        `cookbook:checked:${shownId}`,
        JSON.stringify({ ingredients: [...ingredients], steps: [...steps] })
      );
    } catch { /* ignore */ }
  };

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      persistChecked(next, checkedSteps);
      return next;
    });
  };

  const toggleStep = (stepNumber: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      next.has(stepNumber) ? next.delete(stepNumber) : next.add(stepNumber);
      persistChecked(checkedIngredients, next);
      return next;
    });
  };

  const changeUnitSystem = (system: UnitSystem) => {
    setUnitSystem(system);
    try { localStorage.setItem('cookbook:unitSystem', system); } catch { /* ignore */ }
  };

  const handleAddToGrocery = async () => {
    if (!recipe) return;
    setAddingToGrocery(true);
    try {
      // Use the most recent grocery list, or create one if none exist.
      const lists = await api.groceryLists.list();
      let list = lists && lists.length > 0 ? lists[0] : null;
      if (!list) {
        list = await api.groceryLists.create({ name: 'Shopping List' });
      }

      // Skip section headers and OR dividers; carry category from a matched
      // library ingredient so the grocery list stays aisle-grouped. These are
      // the lines on screen, not the base's — shopping for a recipe you aren't
      // looking at is the sort of thing you only discover at the shop.
      const realIngredients = (version?.ingredients ?? recipeIngredients).filter(
        (ing) => ing.name && !ing.name.startsWith('---')
      ) as RecipeIngredient[];

      await Promise.all(
        realIngredients.map((ing) => {
          const match = matchIngredient(ing, allIngredients);
          return api.groceryListItems.create({
            list_id: list!.id,
            recipe_id: shownId,
            ingredient_id: match?.id || undefined,
            name: titleCaseIngredient(ing.name),
            quantity: ing.quantity || 1,
            unit: ing.unit || '',
            category: match?.category || 'Other',
            checked: false,
          });
        })
      );

      toast.success(`Added ${realIngredients.length} items to ${list.name}`);
    } catch (err) {
      console.error('Error adding to grocery list:', err);
      toast.error('Failed to add to grocery list');
    } finally {
      setAddingToGrocery(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    try {
      const newFavorite = !isFavorite;
      await api.recipes.update(shownId, { is_favorite: newFavorite });
      setIsFavorite(newFavorite);
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  // Duplicating lands you straight in the editor on the copy — the point is
  // almost always to change something (a variation, a scaled batch).
  const handleDuplicateRecipe = async () => {
    if (!recipe || duplicating) return;
    setDuplicating(true);
    try {
      const copy = await api.recipes.duplicate(shownId);
      toast.success(`Created "${copy.title}"`);
      router.push(`/recipes/${copy.id}/edit`);
    } catch (err) {
      console.error('Error duplicating recipe:', err);
      toast.error('Failed to duplicate recipe');
      setDuplicating(false);
    }
  };

  // Branch: either fork this recipe into a new variation, or join one that
  // already exists. The dialog owns that choice.
  const createBranch = async (name: string) => {
    if (!recipe) return;
    setBranching(false);
    setDuplicating(true);
    try {
      // Branching from a branch forks the branch you are reading — the
      // duplicate route hangs it off the same stem, so it lands as a sibling
      // rather than making the family two levels deep.
      const v = await api.recipes.branch(shownId, name, name.split('—').pop()?.trim().toLowerCase());
      toast.success(`Branched "${v.title}"`);
      router.push(`/recipes/${v.id}/edit`);
    } catch (err) {
      console.error('Error branching recipe:', err);
      toast.error('Failed to branch recipe');
      setDuplicating(false);
    }
  };

  const adoptBranch = async (c: BranchCandidate) => {
    if (!recipe) return;
    const extra = c.variation_count;
    const question = extra > 0
      ? `"${c.title}" has ${extra} variation${extra === 1 ? '' : 's'} of its own. Joining flattens the two families — all of them become variations of ${recipe.title}, siblings rather than a branch of a branch. Nothing is copied or lost.`
      : `Make "${c.title}" a variation of ${recipe.title}? It keeps its own ingredients, steps and photos — it just joins the family.`;
    if (!confirm(question)) return;
    setBranching(false);
    setDuplicating(true);
    try {
      const res = await api.recipes.adopt(recipe.id, c.id);
      toast.success(res.broughtCount > 0
        ? `"${c.title}" joined, bringing ${res.broughtCount} variation${res.broughtCount === 1 ? '' : 's'}`
        : `"${c.title}" joined the family`);
      router.push(`/recipes/${recipe.id}/versions`);
    } catch {
      toast.error('Could not link those recipes');
      setDuplicating(false);
    }
  };

  // Draft: stage this recipe's current state so edits stay uncommitted.
  const handleDraft = async () => {
    if (!recipe || duplicating) return;
    setDuplicating(true);
    try {
      const { current } = await api.recipes.getDraft(shownId);
      await api.recipes.saveDraft(shownId, current);
      toast.success('Started a draft — edits stay staged until you commit');
      router.push(`/recipes/${shownId}/edit`);
    } catch (err) {
      console.error('Error starting draft:', err);
      toast.error('Failed to start a draft');
      setDuplicating(false);
    }
  };

  // Deletes whatever is on screen. Reading a branch and pressing Delete has to
  // remove that branch, not the stem it hangs off — the confirm names it so
  // there is no doubt which one is going.
  const handleDeleteRecipe = async () => {
    if (!recipe) return;
    const title = version?.title ?? recipe.title;
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.recipes.delete(shownId);
      toast.success(`Deleted "${title}"`);
      if (version) { setVersion(null); router.refresh(); }
      else router.push('/');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      toast.error('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
          <p className="text-text-secondary">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Recipe not found'}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  /**
   * The version on screen, as one recipe.
   *
   * Picking a branch used to rewrite only the ingredient lines, on the theory
   * that a variation is three lines different and reprinting the whole recipe
   * hides that. What it actually produced was the rose cardamom ingredients
   * under the vanilla photograph and the vanilla title, which reads as a bug.
   * So everything below renders from `shown`, and the only thing still
   * expressed relative to the base is which lines changed.
   */
  const shown = version
    ? {
        id: version.id,
        title: version.title,
        cuisine_type: version.cuisine_type,
        image_url: version.image_url,
        image_position: version.image_position,
        image_zoom: version.image_zoom,
        image_rotation: version.image_rotation ?? 0,
        description: version.description,
        notes: version.notes,
        servings: version.servings,
        total_time_minutes: version.total_time_minutes,
        yield_quantity: version.yield_quantity,
        yield_unit: version.yield_unit,
        difficulty: version.difficulty,
        status: version.status,
        source_url: version.source_url,
        sourceLabel: version.source_name,
      }
    : {
        id: recipe.id,
        title: recipe.title,
        cuisine_type: recipe.cuisine_type,
        image_url: recipe.image_url ?? null,
        image_position: recipe.image_position ?? null,
        image_zoom: recipe.image_zoom ?? null,
        image_rotation: imageRotation,
        description: recipe.description ?? null,
        notes: recipe.notes ?? null,
        servings: recipe.servings ?? null,
        total_time_minutes: recipe.total_time_minutes ?? null,
        yield_quantity: recipe.yield_quantity ?? null,
        yield_unit: recipe.yield_unit ?? null,
        difficulty: recipe.difficulty ?? null,
        status: recipe.status ?? null,
        source_url: recipe.source_url ?? null,
        sourceLabel: recipe.source?.name ?? recipe.source_name ?? null,
      };

  const shownIngredients = (version?.ingredients ?? recipeIngredients) as typeof recipeIngredients;
  const shownSteps = version?.instructions ?? recipe.instructions ?? [];
  const changedKeys = new Set(version?.changedKeys ?? []);
  // Nutrition follows the version on screen — a variation that swaps butter for
  // oil is a different plate, and showing the base's numbers under it would lie.
  // Its own serving count divides it, too, since a half batch is not half a
  // portion.
  const shownNutrition = version
    ? computeNutrition(
        { ...recipe, servings: version.servings ?? recipe.servings },
        shownIngredients as RecipeIngredient[],
        allIngredients,
      )
    : nutrition;
  const shownPhotos = version ? versionPhotos ?? [] : photos;
  const lineKey = (i: { name: string; section?: string | null }) =>
    `${(i.section || '').toLowerCase()}|${i.name.toLowerCase()}`;

  const metaParts = [
    shown.total_time_minutes ? formatTime(shown.total_time_minutes) : null,
    shown.servings ? `serves ${shown.servings}` : null,
    // what a batch makes — the number other recipes scale against
    shown.yield_quantity ? `makes ${formatQuantity(shown.yield_quantity, shown.yield_unit || '')}` : null,
    shown.difficulty,
    shown.status && shown.status !== 'new' ? shown.status : null,
    shown.sourceLabel ? `via ${shown.sourceLabel}` : null,
  ].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 pb-24">
      {/* Top row: back + actions */}
      <div className="flex items-center justify-between py-5 text-sm">
        <Link href="/" className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text transition-colors">
          <ArrowLeft size={15} strokeWidth={1.8} /> Recipes
        </Link>
        <div className="flex items-center gap-5">
          <button
            onClick={handleToggleFavorite}
            aria-label="Toggle favorite"
            className="text-text hover:text-text-secondary transition-colors"
          >
            <Heart size={17} strokeWidth={1.8} className={isFavorite ? 'fill-text text-text' : ''} />
          </button>
          <button onClick={() => router.push(`/recipes/${shownId}/edit`)} className="tlink text-text-secondary hover:text-text">Edit</button>
          <button onClick={handleDuplicateRecipe} disabled={duplicating} className="tlink text-text-secondary hover:text-text disabled:opacity-50">
            {duplicating ? 'Duplicating…' : 'Duplicate'}
          </button>
          <button onClick={() => setBranching(true)} disabled={duplicating} className="tlink text-text-secondary hover:text-text disabled:opacity-50">Branch</button>
          <button onClick={handleDraft} disabled={duplicating} className="tlink text-text-secondary hover:text-text disabled:opacity-50">Draft</button>
          <button onClick={handleDeleteRecipe} className="tlink text-text-secondary hover:text-text">Delete</button>
        </div>
      </div>

      {/* Centered head */}
      <div className="text-center pt-6 md:pt-10 pb-7">
        <p className="tag-link lowercase">{shown.cuisine_type || 'other'}</p>
        <h1 className="text-[30px] md:text-[48px] leading-[1.08] tracking-[-0.02em] font-normal text-text mt-3.5 mb-3.5 max-w-[22ch] mx-auto text-balance">
          {shown.title}
        </h1>
        {metaParts.length > 0 && (
          <p className="text-[13.5px] text-text-secondary lowercase">{metaParts.join('  ·  ')}</p>
        )}
      </div>

      {/* Hero image (framed) */}
      {shown.image_url && (
        <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#F4F4F4]">
          <Image
            key={shown.image_url}
            src={shown.image_url}
            alt={shown.title}
            fill
            sizes="(max-width: 900px) 100vw, 896px"
            className="object-cover"
            style={framingStyle({
              image_position: shown.image_position,
              image_zoom: shown.image_zoom,
              image_rotation: shown.image_rotation,
            })}
          />
        </div>
      )}

      {/* Lede */}
      {shown.description && (
        <p className="text-center text-[16.5px] leading-[1.65] text-[#3A3A3A] max-w-[62ch] mx-auto mt-8">
          {shown.description}
        </p>
      )}

      {/* Primary action */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-7 pb-2 text-sm">
        <button
          onClick={handleAddToGrocery}
          disabled={addingToGrocery}
          className="tlink text-text disabled:opacity-50"
        >
          {addingToGrocery ? 'Adding…' : 'Add to grocery list'}
        </button>
        {shown.source_url && (
          <a href={shown.source_url} target="_blank" rel="noopener noreferrer" className="tlink text-text">
            View original
          </a>
        )}
      </div>

      {/* Ingredients + method */}
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-10 md:gap-16 pt-14">
        {/* Ingredients */}
        {/* `|| version` keeps the column — and with it the chips — alive when
            you switch to a branch that lists no ingredients of its own.
            Otherwise picking it would remove the only way back. */}
        {(shownIngredients.length > 0 || version) && (
          <div>
            <div className="flex items-baseline justify-between border-b border-text pb-2.5">
              <h2 className="text-[12.5px] text-text-secondary">Ingredients</h2>
              <div className="flex items-baseline gap-3 text-[12.5px]">
                {(['original', 'metric', 'imperial'] as UnitSystem[]).map((sys) => (
                  <button
                    key={sys}
                    onClick={() => changeUnitSystem(sys)}
                    className={`transition-colors cursor-pointer ${
                      unitSystem === sys ? 'text-text underline underline-offset-4 decoration-1' : 'text-text-secondary hover:text-text'
                    }`}
                  >
                    {sys === 'original' ? 'orig' : sys}
                  </button>
                ))}
              </div>
            </div>
            <VariationChips recipeId={id} activeId={shownId} onChange={setVersion} />
            <div>
              {shownIngredients.map((ing, idx) => {
                if (ing.name === '---OR---') {
                  return (
                    <div key={idx} className="flex items-center gap-3 py-2.5 text-[12.5px] text-text-secondary">
                      <div className="flex-1 border-t border-border" /> or <div className="flex-1 border-t border-border" />
                    </div>
                  );
                }
                // A section heading is printed the first time its section appears.
                const section = ing.section || null;
                const startsSection = section && section !== (shownIngredients[idx - 1]?.section || null);
                const converted = convertMeasure(ing.quantity, ing.unit, unitSystem);
                const measure = ing.quantity > 0 ? formatQuantity(converted.quantity, converted.unit) : '';
                const checked = checkedIngredients.has(idx);
                // An ingredient that is itself a recipe links through to it rather
                // than being something you tick off a shopping list.
                if (ing.child_recipe_id) {
                  return (
                    <div key={idx}>
                      {startsSection && (
                        <p className="text-[12.5px] italic text-text-secondary pt-5 pb-1">{section}</p>
                      )}
                      <Link
                        href={`/recipes/${ing.child_recipe_id}`}
                        className="w-full flex items-baseline justify-between gap-5 py-2.5 border-b border-border text-left"
                      >
                        <span className="text-[14.5px] text-text underline underline-offset-4 decoration-1">
                          {titleCaseIngredient(ing.name)}
                          <span className="text-text-secondary text-[12px] no-underline ml-2">recipe</span>
                        </span>
                        {ing.quantity > 0 && (
                          <span className="text-[14px] tabular-nums whitespace-nowrap text-text-secondary">
                            {formatQuantity(ing.quantity, ing.unit)}
                          </span>
                        )}
                      </Link>
                    </div>
                  );
                }
                return (
                  <div key={idx}>
                  {startsSection && (
                    <p className="text-[12.5px] italic text-text-secondary pt-5 pb-1">{section}</p>
                  )}
                  <button
                    onClick={() => toggleIngredient(idx)}
                    className={`w-full flex items-baseline justify-between gap-5 py-2.5 border-b border-border text-left group ${
                      changedKeys.has(lineKey(ing)) ? 'border-l border-l-text pl-2.5 -ml-2.5' : ''
                    }`}
                  >
                    <span className={`text-[14.5px] transition-colors ${checked ? 'line-through text-text-secondary' : 'text-text'}`}>
                      {titleCaseIngredient(ing.name)}
                      {ing.notes && <span className="text-text-secondary text-[13px] ml-1">({ing.notes})</span>}
                    </span>
                    {measure && (
                      <span className={`text-[14px] tabular-nums whitespace-nowrap ${checked ? 'line-through text-text-secondary' : 'text-text-secondary'}`}>
                        {measure}
                      </span>
                    )}
                  </button>
                  </div>
                );
              })}
            </div>

            {/* Nutrition, tucked under ingredients */}
            {shownNutrition && (
              <div className="mt-8">
                <div className="flex items-baseline justify-between border-b border-text pb-2.5">
                  <h2 className="text-[12.5px] text-text-secondary">Nutrition — per serving</h2>
                  <span className="text-[11.5px] text-text-secondary">estimated</span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-4">
                  {([
                    ['calories', shownNutrition.nutrition.calories],
                    ['protein', `${shownNutrition.nutrition.protein}g`],
                    ['carbs', `${shownNutrition.nutrition.carbs}g`],
                    ['fat', `${shownNutrition.nutrition.fat}g`],
                  ] as const).map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[11.5px] text-text-secondary lowercase">{label}</p>
                      <p className="text-[24px] tracking-tight tabular-nums text-text">{val}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11.5px] text-text-secondary mt-3">
                  {shownNutrition.matchedCount} of {shownNutrition.totalCount} ingredients matched to the library
                </p>
              </div>
            )}
          </div>
        )}

        {/* Method */}
        {shownSteps.length > 0 && (
          <div>
            <h2 className="text-[12.5px] text-text-secondary border-b border-text pb-2.5">
              Method <span className="text-text-secondary/70">— tap a step to check it off</span>
            </h2>
            <div>
              {shownSteps.map((instruction, sIdx) => {
                const done = checkedSteps.has(instruction.step_number);
                // Same rule as the ingredients: name the section when it changes.
                const section = instruction.section || null;
                const startsSection = section && section !== (shownSteps[sIdx - 1]?.section || null);
                return (
                  <div key={instruction.step_number}>
                  {startsSection && (
                    <p className="text-[12.5px] italic text-text-secondary pt-6 pb-1">{section}</p>
                  )}
                  <button
                    onClick={() => toggleStep(instruction.step_number)}
                    className="w-full grid grid-cols-[26px_1fr] gap-4 py-4 border-b border-border text-left last:border-0"
                  >
                    <span className="text-[13px] text-text-secondary tabular-nums pt-0.5 flex items-start">
                      {done ? <Check size={15} strokeWidth={2} className="text-text" /> : String(instruction.step_number).padStart(2, '0')}
                    </span>
                    <div>
                      <p className={`text-[15px] leading-[1.65] transition-colors ${done ? 'line-through text-text-secondary' : 'text-text'}`}>
                        {instruction.text}
                      </p>
                      {instruction.timer_minutes && (
                        <span className="tlink text-text-secondary text-[12.5px] mt-2 inline-block">
                          {instruction.timer_label || `Set timer — ${instruction.timer_minutes} min`}
                        </span>
                      )}
                    </div>
                  </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notes — kept after the method, since they're about the making, not the doing */}
        {shown.notes && shown.notes.trim() && (
          <div className="pt-12">
            <h2 className="text-[12.5px] text-text-secondary border-b border-text pb-2.5">Notes</h2>
            <p className="text-[15px] leading-[1.7] text-text whitespace-pre-wrap pt-4">
              {shown.notes}
            </p>
          </div>
        )}
      </div>

      {branching && recipe && (
        <BranchDialog
          recipeId={shownId}
          recipeTitle={shown.title}
          onClose={() => setBranching(false)}
          onCreate={createBranch}
          onAdopt={adoptBranch}
        />
      )}

      {/* Cooking journal — above the flavour analysis, because what happened the
          last time you made it is worth more than a computed profile, and it was
          buried under two sections nobody scrolls past. */}
      <div className="pt-14">
        <CookLogSection
          key={shownId}
          recipeId={shownId}
          ingredients={shownIngredients as RecipeIngredient[]}
        />
      </div>

      {/* Flavour profile & cohesion (from the Flavor Lab) */}
      <RecipeFlavorCard recipeId={shownId} />

      {/* Photo gallery */}
      {shownPhotos.length > 0 && (
        <div className="pt-14">
          <h2 className="text-[12.5px] text-text-secondary border-b border-text pb-2.5 mb-4">Photos</h2>
          <PhotoGallery
            images={[shown.image_url, ...shownPhotos.map((p) => p.url)].filter((u): u is string => !!u)}
            title={shown.title}
          />
        </div>
      )}

    </div>
  );
}
