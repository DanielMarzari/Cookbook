'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api-client';
import { RecipePhoto } from '@/lib/types';
import { ArrowLeft, Plus, X, Loader, RotateCw, Trash2, GripVertical, Check, Upload, Star } from 'lucide-react';
import { toFraction, titleCaseIngredient } from '@/lib/utils';
import { framingStyle, parsePosition, buildPosition } from '@/lib/image';
import { fileToResizedDataUrl } from '@/lib/photo';
import { toast } from '@/lib/toast';
import { UNITS, DEFAULT_CUISINES, MEAL_TYPES } from '@/lib/constants';
import { useCuisines } from '@/lib/useCuisines';
import { usePrompt } from '@/components/Prompt';


interface FormIngredient {
  name: string;
  quantity: number;
  unit: string;
  is_header?: boolean;
  is_or?: boolean;
  notes: string;
  child_recipe_id?: string | null; // set when this row IS another recipe
}

interface FormInstruction {
  text: string;
  timer_minutes?: number;
  timer_label?: string;
  section?: string;
}

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { cuisines } = useCuisines();
  const ask = usePrompt();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);
  const initialLoadDone = useRef(false);
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [yieldQuantity, setYieldQuantity] = useState(0);
  const [yieldUnit, setYieldUnit] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [mealType, setMealType] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [sourceList, setSourceList] = useState<{ id: string; name: string; featured: number }[]>([]);
  const [customCuisine, setCustomCuisine] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [servings, setServings] = useState(4);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePosition, setImagePosition] = useState('50% 50%');
  const [imageZoom, setImageZoom] = useState(1);
  const [photos, setPhotos] = useState<RecipePhoto[]>([]);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUrl, setGalleryUrl] = useState('');
  const mainFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceAuthor, setSourceAuthor] = useState('');
  const [ingredients, setIngredients] = useState<FormIngredient[]>([]);
  const [instructions, setInstructions] = useState<FormInstruction[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || id === 'undefined') return;

      try {
        const recipe = await api.recipes.get(id);
        if (!recipe) return;

        setTitle(recipe.title);
        setDescription(recipe.description || '');
        setNotes(recipe.notes || '');
        setYieldQuantity(recipe.yield_quantity || 0);
        setYieldUnit(recipe.yield_unit || '');
        setCuisineType(recipe.cuisine_type || '');
        setMealType(recipe.meal_type || '');
        setSourceId(recipe.source_id || '');
        // If the cuisine is custom (not in defaults), pre-populate the custom input
        if (recipe.cuisine_type && !DEFAULT_CUISINES.includes(recipe.cuisine_type) && recipe.cuisine_type !== 'Other') {
          setCustomCuisine(recipe.cuisine_type);
        }
        setDifficulty(recipe.difficulty);
        setPrepTime(recipe.prep_time_minutes);
        setCookTime(recipe.cook_time_minutes);
        setServings(recipe.servings);
        setImageUrl(recipe.image_url || '');
        setSourceUrl(recipe.source_url || '');
        setSourceName(recipe.source_name || '');
        setSourceAuthor(recipe.source_author || '');
        setImageRotation(recipe.image_rotation || 0);
        setImagePosition(recipe.image_position || '50% 50%');
        setImageZoom(recipe.image_zoom || 1);

        // Load gallery photos
        api.recipePhotos.list(id).then(setPhotos).catch(() => {});



        // Load instructions
        if (recipe.instructions && recipe.instructions.length > 0) {
          setInstructions(recipe.instructions.map((inst: any) => ({
            text: inst.text || '',
            timer_minutes: inst.timer_minutes,
            timer_label: inst.timer_label || '',
            section: inst.section || '',
          })));
        }

        // Load ingredients
        const recipeIngredients = await api.recipeIngredients.list(id);

        if (recipeIngredients && recipeIngredients.length > 0) {
          // Sections live on the rows themselves; rebuild an editable header row
          // each time the section changes so the list still reads as one document.
          const rows: FormIngredient[] = [];
          let seenSection: string | null = null;
          for (const ing of recipeIngredients as any[]) {
            if (ing.name === '---OR---') {
              rows.push({ name: 'OR', quantity: 0, unit: '', notes: '', is_or: true });
              continue;
            }
            const section = ing.section || null;
            if (section !== seenSection) {
              seenSection = section;
              if (section) rows.push({ name: section, quantity: 0, unit: '', notes: '', is_header: true });
            }
            rows.push({
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit,
              notes: ing.notes || '',
              child_recipe_id: ing.child_recipe_id || null,
            });
          }
          setIngredients(rows);
        }

        // If edits are already staged, open in that mode showing them — otherwise
        // the draft is invisible here and the next keystroke silently forks it.
        try {
          const { draft } = await api.recipes.getDraft(id);
          if (draft) {
            setTarget('draft');
            if (draft.title) setTitle(draft.title);
            if (draft.description !== undefined) setDescription(draft.description || '');
            if (draft.notes !== undefined) setNotes(draft.notes || '');
            if (draft.servings) setServings(draft.servings);
            if (draft.prep_time_minutes !== undefined) setPrepTime(draft.prep_time_minutes);
            if (draft.cook_time_minutes !== undefined) setCookTime(draft.cook_time_minutes);
            if (draft.yield_quantity !== undefined) setYieldQuantity(draft.yield_quantity || 0);
            if (draft.yield_unit !== undefined) setYieldUnit(draft.yield_unit || '');
            if (draft.cuisine_type) setCuisineType(draft.cuisine_type);
            if (draft.difficulty) setDifficulty(draft.difficulty as 'easy' | 'medium' | 'hard');
            if (draft.source_url !== undefined) setSourceUrl(draft.source_url || '');
            if (draft.source_name !== undefined) setSourceName(draft.source_name || '');
            if (draft.source_author !== undefined) setSourceAuthor(draft.source_author || '');
            if (draft.image_url !== undefined) setImageUrl(draft.image_url || '');
            if (draft.image_rotation !== undefined) setImageRotation(draft.image_rotation || 0);
            if (draft.image_position !== undefined) setImagePosition(draft.image_position || '50% 50%');
            if (draft.image_zoom !== undefined) setImageZoom(draft.image_zoom || 1);
            if (draft.ingredients?.length) {
              const rows: FormIngredient[] = [];
              let seen: string | null = null;
              for (const ing of draft.ingredients) {
                if (ing.name === '---OR---') { rows.push({ name: 'OR', quantity: 0, unit: '', notes: '', is_or: true }); continue; }
                const sec = ing.section || null;
                if (sec !== seen) { seen = sec; if (sec) rows.push({ name: sec, quantity: 0, unit: '', notes: '', is_header: true }); }
                rows.push({ name: ing.name, quantity: ing.quantity, unit: ing.unit, notes: ing.notes || '', child_recipe_id: ing.child_recipe_id || null });
              }
              setIngredients(rows);
            }
            if (draft.instructions?.length) {
              setInstructions(draft.instructions.map((i) => ({
                text: i.text || '', timer_minutes: i.timer_minutes,
                timer_label: i.timer_label || '', section: i.section || '',
              })));
            }
          }
        } catch { /* no draft is the normal case */ }
      } catch (err) {
        console.error('Error loading recipe:', err);
      } finally {
        setLoading(false);
        setTimeout(() => { initialLoadDone.current = true; }, 100);
      }
    };

    fetchRecipe();
  }, [id]);

  // The sections a step can be filed under are whatever the ingredient list
  // already defines, so the two halves of a recipe stay in step with each other.
  const sectionNames = Array.from(
    new Set(ingredients.filter((i) => i.is_header && i.name.trim()).map((i) => i.name.trim()))
  );

  // Recipes that can be used as an ingredient here (anything but this one).
  // The family this recipe belongs to, so its branches are reachable while editing.
  const [family, setFamily] = useState<Awaited<ReturnType<typeof api.recipes.family>> | null>(null);
  useEffect(() => {
    api.recipes.family(id).then((f) => setFamily(f.isBranched ? f : null)).catch(() => setFamily(null));
  }, [id]);

  useEffect(() => {
    api.sources.list().then((r) => setSourceList(r.sources)).catch(() => {});
  }, []);

  const [otherRecipes, setOtherRecipes] = useState<{ id: string; title: string }[]>([]);
  useEffect(() => {
    api.recipes.list().then((rs) => setOtherRecipes(rs.filter((r) => r.id !== id).map((r) => ({ id: r.id, title: r.title })))).catch(() => {});
  }, [id]);

  const addSubRecipe = (childId: string) => {
    const child = otherRecipes.find((r) => r.id === childId);
    if (!child) return;
    setIngredients((prev) => [
      ...prev,
      { name: child.title, quantity: 1, unit: 'batch', notes: '', child_recipe_id: child.id },
    ]);
  };

  // Lift a section out into a recipe of its own. Saves first so the section's
  // current contents are what gets moved, then reloads to show the reference.
  const [promoting, setPromoting] = useState(false);
  // Where edits land. 'recipe' is the long-standing behaviour: autosave writes
  // straight through. 'draft' stages them instead, so they can become a variation
  // without ever having touched the original.
  const [target, setTarget] = useState<'recipe' | 'draft'>('recipe');
  const promoteSection = async (section: string) => {
    if (promoting) return;
    if (target === 'draft') {
      toast.error('Switch saving back to "This recipe" first — promoting edits the recipe directly, which would bypass your staged changes.');
      return;
    }
    if (!confirm(`Move "${section}" into its own recipe? Its ingredients and steps leave this recipe and it stays linked here.`)) return;
    setPromoting(true);
    try {
      await doAutosave();
      const res = await api.recipes.promoteSection(id, section);
      toast.success(`Created "${res.recipe.title}" — ${res.movedIngredients} ingredients, ${res.movedSteps} steps`);
      window.location.reload();
    } catch (err) {
      console.error('Error promoting section:', err);
      toast.error('Failed to promote section');
      setPromoting(false);
    }
  };

  // Autosave: debounce 1.5s after any change
  const doAutosave = useCallback(async () => {
    if (!initialLoadDone.current || !title.trim()) return;
    setSaving(true);
    try {
      const stagedIngredients = (() => {
        let sec: string | null = null;
        const out: { name: string; quantity: number; unit: string; notes: string; section: string | null; child_recipe_id: string | null }[] = [];
        for (const ing of ingredients) {
          if (ing.is_header) { sec = ing.name.trim() || null; continue; }
          if (!ing.is_or && !ing.name.trim()) continue;
          out.push({
            name: ing.is_or ? '---OR---' : titleCaseIngredient(ing.name),
            quantity: ing.is_or ? 0 : ing.quantity,
            unit: ing.is_or ? '' : ing.unit,
            notes: ing.is_or ? '' : ing.notes,
            section: sec,
            child_recipe_id: ing.child_recipe_id || null,
          });
        }
        return out;
      })();

      if (target === 'draft') {
        // Staged: the recipe on disk is deliberately left alone.
        await api.recipes.saveDraft(id, {
          title, description, notes, servings,
          cuisine_type: cuisineType, difficulty,
          source_url: sourceUrl, source_name: sourceName, source_author: sourceAuthor,
          image_url: imageUrl, image_rotation: imageRotation,
          image_position: imagePosition, image_zoom: imageZoom,
          prep_time_minutes: prepTime, cook_time_minutes: cookTime,
          total_time_minutes: prepTime + cookTime,
          yield_quantity: yieldQuantity || null, yield_unit: yieldUnit || null,
          instructions: instructions.map((inst, idx) => ({
            step_number: idx + 1, text: inst.text,
            timer_minutes: inst.timer_minutes, timer_label: inst.timer_label,
            section: inst.section?.trim() || undefined,
          })),
          ingredients: stagedIngredients,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        return;
      }

      await api.recipes.update(id, {
        title, description, notes, cuisine_type: cuisineType, difficulty,
        yield_quantity: yieldQuantity || undefined, yield_unit: yieldUnit || undefined,
        meal_type: mealType || undefined, source_id: sourceId || undefined,
        prep_time_minutes: prepTime, cook_time_minutes: cookTime,
        total_time_minutes: prepTime + cookTime, servings,
        image_url: imageUrl, image_rotation: imageRotation,
        image_position: imagePosition, image_zoom: imageZoom,
        source_url: sourceUrl, source_name: sourceName, source_author: sourceAuthor,
        instructions: instructions.map((inst, idx) => ({
          step_number: idx + 1, text: inst.text,
          timer_minutes: inst.timer_minutes, timer_label: inst.timer_label,
          section: inst.section?.trim() || undefined,
        })),
      });

      // Save ingredients. Header rows are an editing convenience only — on the way
      // out they collapse into the `section` of the rows beneath them, so nothing
      // is stored as a fake "--- Filling ---" ingredient any more.
      await api.recipeIngredients.deleteByRecipeId(id);
      let currentSection: string | null = null;
      const ingredientsWithRecipeId: Record<string, unknown>[] = [];
      for (const ing of ingredients) {
        if (ing.is_header) {
          currentSection = ing.name.trim() || null;
          continue;
        }
        if (!ing.is_or && !ing.name.trim()) continue;
        ingredientsWithRecipeId.push({
          recipe_id: id,
          name: ing.is_or ? '---OR---' : titleCaseIngredient(ing.name),
          quantity: ing.is_or ? 0 : ing.quantity,
          unit: ing.is_or ? '' : ing.unit,
          notes: ing.is_or ? '' : ing.notes,
          section: currentSection,
          // preserved so editing a recipe never severs its sub-recipe links
          child_recipe_id: ing.child_recipe_id || null,
          order_index: ingredientsWithRecipeId.length,
          ingredient_id: null,
        });
      }
      if (ingredientsWithRecipeId.length > 0) {
        await api.recipeIngredients.create(ingredientsWithRecipeId);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Autosave error:', err);
    } finally {
      setSaving(false);
    }
  }, [id, target, title, description, notes, yieldQuantity, yieldUnit, mealType, sourceId, cuisineType, difficulty, prepTime, cookTime, servings, imageUrl, imageRotation, imagePosition, imageZoom, sourceUrl, sourceName, sourceAuthor, instructions, ingredients]);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(doAutosave, 1500);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [target, title, description, notes, yieldQuantity, yieldUnit, mealType, sourceId, cuisineType, difficulty, prepTime, cookTime, servings, imageUrl, imagePosition, imageZoom, sourceUrl, sourceName, sourceAuthor, instructions, ingredients, doAutosave]);

  const handleRotateImage = async () => {
    const newRotation = (imageRotation + 90) % 360;
    setImageRotation(newRotation);
    // While staging, rotation rides along in the draft like every other field —
    // writing it through here would edit the recipe behind the draft's back.
    if (target === 'draft') return;
    await api.recipes.update(id, { image_rotation: newRotation });
  };

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingMain(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file, 1200);
      setImageUrl(dataUrl); // autosave persists it
    } catch (err) {
      console.error('Main photo upload error:', err);
      toast.error('Could not process that image');
    } finally {
      setUploadingMain(false);
      if (mainFileRef.current) mainFileRef.current.value = '';
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      for (const file of files) {
        const dataUrl = await fileToResizedDataUrl(file, 1200);
        const created = await api.recipePhotos.create({ recipe_id: id, url: dataUrl });
        setPhotos((prev) => [...prev, created]);
      }
      toast.success(files.length > 1 ? `Added ${files.length} photos` : 'Photo added');
    } catch (err) {
      console.error('Gallery upload error:', err);
      toast.error('Could not add photo(s)');
    } finally {
      setUploadingGallery(false);
      if (galleryFileRef.current) galleryFileRef.current.value = '';
    }
  };

  const handleAddGalleryUrl = async () => {
    const url = galleryUrl.trim();
    if (!url) return;
    try {
      const created = await api.recipePhotos.create({ recipe_id: id, url });
      setPhotos((prev) => [...prev, created]);
      setGalleryUrl('');
    } catch (err) {
      console.error('Add gallery URL error:', err);
      toast.error('Could not add photo');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      const res = await api.recipePhotos.delete(photoId);
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      console.error('Delete photo error:', err);
      toast.error('Could not delete photo');
    }
  };

  const handleSetMain = (url: string) => {
    setImageUrl(url); // autosave persists; framing resets to defaults for the new cover
    setImagePosition('50% 50%');
    setImageZoom(1);
    setImageRotation(0);
    toast.success('Set as cover photo');
  };

  // Framing sliders operate on the "X% Y%" object-position string.
  const framePos = parsePosition(imagePosition);
  const setFrameX = (x: number) => setImagePosition(buildPosition(x, framePos.y));
  const setFrameY = (y: number) => setImagePosition(buildPosition(framePos.x, y));
  const resetFraming = () => { setImagePosition('50% 50%'); setImageZoom(1); setImageRotation(0); };

  // Drag-to-reorder ingredients
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) { setDragIdx(null); setDragOverIdx(null); return; }
    setIngredients((prev) => {
      const items = [...prev];
      const [dragged] = items.splice(dragIdx, 1);
      items.splice(idx, 0, dragged);
      return items;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  const addSectionHeader = () => {
    setIngredients(prev => [...prev, { name: '', quantity: 0, unit: '', notes: '', is_header: true }]);
  };

  const addOrDivider = () => {
    setIngredients(prev => [...prev, { name: 'OR', quantity: 0, unit: '', notes: '', is_or: true }]);
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: '', quantity: 0, unit: 'g', notes: '' }]);
  };

  const updateIngredient = (idx: number, field: keyof FormIngredient, value: string | number) => {
    setIngredients(prev => prev.map((ing, i) => i === idx ? { ...ing, [field]: value } : ing));
  };

  const removeIngredient = (idx: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== idx));
  };

  const addInstruction = () => {
    setInstructions(prev => [...prev, { text: '', timer_minutes: undefined, timer_label: '' }]);
  };

  const updateInstruction = (idx: number, field: keyof FormInstruction, value: string | number | undefined) => {
    setInstructions(prev => prev.map((inst, i) => i === idx ? { ...inst, [field]: value } : inst));
  };

  const removeInstruction = (idx: number) => {
    setInstructions(prev => prev.filter((_, i) => i !== idx));
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className={family ? 'max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[210px_minmax(0,1fr)] gap-8 items-start' : 'max-w-4xl mx-auto px-4'}>
        {family && (
          <aside className="md:sticky md:top-8">
            <div className="flex items-baseline justify-between border-b border-text pb-2 mb-1">
              <h2 className="text-[12.5px] text-text-secondary">This recipe branches</h2>
              <span className="text-[12.5px] text-text-secondary tabular-nums">{String(family.count + 1).padStart(2, '0')}</span>
            </div>
            {[{ id: family.base.id, title: family.base.title, label: 'base' },
              ...family.variations.map((v) => ({ id: v.id, title: v.title, label: v.variation_of_label || 'variation' }))
            ].map((v) => {
              const here = v.id === id;
              return (
                <Link
                  key={v.id}
                  href={`/recipes/${v.id}/edit`}
                  aria-current={here}
                  className={`block py-2.5 pl-3 border-b border-border last:border-b-0 border-l transition-colors ${
                    here ? 'border-l-text' : 'border-l-transparent'
                  }`}
                >
                  <span className={`block text-[13.5px] leading-[1.32] ${here ? 'text-text underline underline-offset-4 decoration-1' : 'text-text-secondary hover:text-text'}`}>
                    {v.title}
                  </span>
                  <span className="block text-[11.5px] text-text-secondary mt-[3px]">{v.label}</span>
                </Link>
              );
            })}
            <p className="text-[11.5px] text-text-secondary mt-4 leading-[1.5]">
              One photo serves the family. Set it on the base and every branch follows &mdash;
              or give this one its own below to override.
            </p>
            <Link href={`/recipes/${id}/versions`} className="tlink text-[12.5px] text-text-secondary hover:text-text mt-3 inline-block">
              Compare versions &rarr;
            </Link>
          </aside>
        )}
        <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/recipes/${id}`}
            className="flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Recipe
          </Link>
          <h1 className="text-3xl font-bold text-text">Edit Recipe</h1>
        </div>

        <div className="space-y-6">
          {/* Basic Details */}
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-4">Recipe Details</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Recipe Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <select
                    value={cuisineType === 'Other' || (!cuisines.includes(cuisineType) && cuisineType !== '' && cuisineType !== 'Italian') ? 'Other' : cuisineType}
                    onChange={(e) => {
                      if (e.target.value === 'Other') {
                        setCuisineType('Other');
                        setCustomCuisine('');
                      } else {
                        setCuisineType(e.target.value);
                        setCustomCuisine('');
                      }
                    }}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {cuisines.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {(cuisineType === 'Other' || customCuisine) && (
                    <input
                      type="text"
                      placeholder="Enter cuisine type..."
                      value={customCuisine}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomCuisine(val);
                        if (val.trim()) {
                          setCuisineType(val.trim());
                        } else {
                          setCuisineType('Other');
                        }
                      }}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  )}
                </div>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Cook Time (min)</label>
                  <input
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Servings</label>
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Meal</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">&mdash;</option>
                    {MEAL_TYPES.map((m) => (<option key={m} value={m}>{m}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Source</label>
                  <select
                    value={sourceId}
                    onChange={async (e) => {
                      if (e.target.value !== '__new__') return setSourceId(e.target.value);
                      const name = await ask({ title: 'New source', hint: 'A person, a publication, a platform, or something like "Family recipes".', confirmLabel: 'Create' });
                      if (!name) return;
                      const { source } = await api.sources.create(name);
                      setSourceList((prev) => (prev.some((x) => x.id === source.id) ? prev : [...prev, source]));
                      setSourceId(source.id);
                    }}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">&mdash;</option>
                    {sourceList.map((x) => (<option key={x.id} value={x.id}>{x.name}</option>))}
                    <option value="__new__">+ new source&hellip;</option>
                  </select>
                  <p className="text-[11px] text-text-secondary mt-1.5">
                    Featured sources lead the home shelf &mdash; set that on{' '}
                    <Link href="/sources" className="tlink">the sources page</Link>.
                  </p>
                </div>
              </div>

              {/* Yield: what one batch makes. Only needed if this recipe gets used
                  inside another one — it's the number the parent scales against. */}
              <div>
                <label className="block text-xs text-text-secondary mb-1">
                  Makes <span className="text-text-secondary/70">— so other recipes can use this one as an ingredient</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="2"
                    value={yieldQuantity || ''}
                    onChange={(e) => setYieldQuantity(parseFloat(e.target.value) || 0)}
                    className="w-28 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <select
                    value={yieldUnit}
                    onChange={(e) => setYieldUnit(e.target.value)}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">—</option>
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main / cover photo */}
              <div>
                <label className="block text-xs text-text-secondary mb-1">Main / cover photo</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={imageUrl.startsWith('data:') ? '' : imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input ref={mainFileRef} type="file" accept="image/*" onChange={handleMainUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => mainFileRef.current?.click()}
                    disabled={uploadingMain}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-text hover:bg-background transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {uploadingMain ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />} Upload
                  </button>
                </div>
                {imageUrl.startsWith('data:') && (
                  <p className="text-xs text-text-secondary mt-1">Using an uploaded photo. Paste a URL above to replace it.</p>
                )}
              </div>

              {imageUrl && (
                <div className="space-y-3">
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-background">
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                      style={framingStyle({ image_position: imagePosition, image_zoom: imageZoom, image_rotation: imageRotation })}
                    />
                    <button
                      type="button"
                      onClick={handleRotateImage}
                      className="absolute top-3 right-3 p-3 bg-surface rounded-full shadow-warm hover:shadow-warm-lg transition-all hover:scale-110"
                      title="Rotate image"
                    >
                      <RotateCw size={20} className="text-text" />
                    </button>
                  </div>

                  {/* Framing controls */}
                  <div className="rounded-xl border border-border p-4 bg-background/40">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-text">
                        Adjust framing{' '}
                        <span className="text-text-secondary font-normal">— used on the recipe &amp; in the cookbook</span>
                      </p>
                      <button type="button" onClick={resetFraming} className="text-xs text-primary hover:underline">Reset</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <label className="text-xs text-text-secondary">
                        Horizontal
                        <input type="range" min={0} max={100} value={framePos.x} onChange={(e) => setFrameX(parseInt(e.target.value))} className="w-full accent-[var(--color-primary)]" />
                      </label>
                      <label className="text-xs text-text-secondary">
                        Vertical
                        <input type="range" min={0} max={100} value={framePos.y} onChange={(e) => setFrameY(parseInt(e.target.value))} className="w-full accent-[var(--color-primary)]" />
                      </label>
                      <label className="text-xs text-text-secondary">
                        Zoom
                        <input type="range" min={1} max={3} step={0.05} value={imageZoom} onChange={(e) => setImageZoom(parseFloat(e.target.value))} className="w-full accent-[var(--color-primary)]" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <input
                type="url"
                placeholder="Source URL (optional)"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-1">Photo Gallery</h2>
            <p className="text-sm text-text-secondary mb-4">Add extra photos of the dish — any size. They show in a gallery on the recipe.</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <input
                type="url"
                placeholder="Paste image URL"
                value={galleryUrl}
                onChange={(e) => setGalleryUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddGalleryUrl(); } }}
                className="flex-1 min-w-[12rem] px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="px-4 py-2 rounded-lg border border-border text-text hover:bg-background transition-colors"
              >
                Add URL
              </button>
              <input ref={galleryFileRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
              <button
                type="button"
                onClick={() => galleryFileRef.current?.click()}
                disabled={uploadingGallery}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {uploadingGallery ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />} Upload
              </button>
            </div>
            {photos.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {photos.map((p) => (
                  <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                    <Image src={p.url} alt="Gallery photo" fill sizes="(max-width: 640px) 33vw, 160px" className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 group-hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all">
                      <button type="button" onClick={() => handleSetMain(p.url)} title="Set as cover photo" className="p-1.5 rounded-full bg-white/90 hover:bg-white text-text">
                        <Star size={16} />
                      </button>
                      <button type="button" onClick={() => handleDeletePhoto(p.id)} title="Delete photo" className="p-1.5 rounded-full bg-white/90 hover:bg-white text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">No gallery photos yet.</p>
            )}
          </div>

          {/* Ingredients */}
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-4">Ingredients</h2>

            <div className="space-y-3">
              {ingredients.map((ing, idx) => {
                const dragProps = {
                  draggable: true,
                  onDragStart: () => handleDragStart(idx),
                  onDragOver: (e: React.DragEvent) => handleDragOver(e, idx),
                  onDrop: () => handleDrop(idx),
                  onDragEnd: handleDragEnd,
                };
                const dropHighlight = dragOverIdx === idx && dragIdx !== idx ? 'border-t-2 border-primary' : '';
                const dragging = dragIdx === idx ? 'opacity-40' : '';

                if (ing.is_header) {
                  return (
                    <div key={idx} {...dragProps} className={`flex items-center gap-2 pt-4 pb-1 ${dropHighlight} ${dragging}`}>
                      <GripVertical size={16} className="text-text-secondary cursor-grab flex-shrink-0" />
                      <div className="flex-1 border-t border-primary/30" />
                      <input
                        type="text"
                        placeholder="Section name (e.g. For the Dough)"
                        value={ing.name}
                        onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                        className="px-4 py-1.5 text-sm font-bold text-primary bg-primary/5 border border-primary/20 rounded-full text-center min-w-48 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="flex-1 border-t border-primary/30" />
                      <button onClick={() => removeIngredient(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"><X size={16} /></button>
                    </div>
                  );
                }
                if (ing.is_or) {
                  return (
                    <div key={idx} {...dragProps} className={`flex items-center gap-3 py-1 ${dropHighlight} ${dragging}`}>
                      <GripVertical size={16} className="text-text-secondary cursor-grab flex-shrink-0" />
                      <div className="flex-1 border-t border-orange-300" />
                      <span className="text-sm font-bold text-orange-500 tracking-wider">OR</span>
                      <div className="flex-1 border-t border-orange-300" />
                      <button onClick={() => removeIngredient(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"><X size={16} /></button>
                    </div>
                  );
                }
                return (
                  <div key={idx} {...dragProps} className={`flex gap-2 items-center ${dropHighlight} ${dragging}`}>
                    <GripVertical size={16} className="text-text-secondary cursor-grab flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                      className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="relative w-24">
                      <input
                        type="number"
                        placeholder="Qty"
                        step="0.01"
                        value={ing.quantity}
                        onChange={(e) => updateIngredient(idx, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {ing.quantity > 0 && ing.quantity % 1 !== 0 && (
                        <span className="absolute -top-2 right-1 text-xs font-semibold text-primary bg-surface px-1 rounded">
                          {toFraction(ing.quantity)}
                        </span>
                      )}
                    </div>
                    <select
                      value={UNITS.includes(ing.unit) ? ing.unit : 'piece'}
                      onChange={(e) => updateIngredient(idx, 'unit', e.target.value)}
                      className="w-28 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Notes"
                      value={ing.notes}
                      onChange={(e) => updateIngredient(idx, 'notes', e.target.value)}
                      className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={() => removeIngredient(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><X size={20} /></button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={addIngredient}
                className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Ingredient
              </button>
              <button
                onClick={addSectionHeader}
                className="flex items-center gap-2 px-4 py-2 text-text-secondary hover:bg-background rounded-lg transition-colors text-sm"
              >
                + Section
              </button>
              <button
                onClick={addOrDivider}
                className="flex items-center gap-2 px-4 py-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors text-sm"
              >
                + OR
              </button>
              {otherRecipes.length > 0 && (
                <select
                  value=""
                  onChange={(e) => { if (e.target.value) addSubRecipe(e.target.value); e.target.value = ''; }}
                  className="px-4 py-2 border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Use another recipe as an ingredient"
                >
                  <option value="">+ Use a recipe…</option>
                  {otherRecipes.map((r) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Promote a section into its own recipe — the "cannoli filling is
                really its own recipe" move. */}
            {sectionNames.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs text-text-secondary mb-2">
                  Split a section into its own recipe, so you can use it elsewhere:
                </p>
                <div className="flex flex-wrap gap-2">
                  {sectionNames.map((s) => (
                    <button
                      key={s}
                      onClick={() => promoteSection(s)}
                      disabled={promoting}
                      className="px-3 py-1.5 border border-border rounded-lg text-sm text-text-secondary hover:text-text hover:bg-background transition-colors disabled:opacity-50"
                    >
                      {s} &rarr; own recipe
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-4">Instructions</h2>

            <div className="space-y-4">
              {instructions.map((inst, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-primary">Step {idx + 1}</span>
                    {sectionNames.length > 0 && (
                      <select
                        value={inst.section || ''}
                        onChange={(e) => updateInstruction(idx, 'section', e.target.value)}
                        className="text-sm px-2 py-1 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-text-secondary"
                        aria-label={`Section for step ${idx + 1}`}
                      >
                        <option value="">No section</option>
                        {sectionNames.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    )}
                    <button
                      onClick={() => removeInstruction(idx)}
                      className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <textarea
                    placeholder="Instruction text"
                    value={inst.text}
                    onChange={(e) => updateInstruction(idx, 'text', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Timer (minutes)"
                      value={inst.timer_minutes || ''}
                      onChange={(e) => updateInstruction(idx, 'timer_minutes', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Timer label"
                      value={inst.timer_label || ''}
                      onChange={(e) => updateInstruction(idx, 'timer_label', e.target.value)}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addInstruction}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Step
            </button>
          </div>

          {/* Notes — what you learned making it, kept apart from the method */}
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-1">Notes</h2>
            <p className="text-sm text-text-secondary mb-4">
              Substitutions, what to watch for, how it went last time.
            </p>
            <textarea
              placeholder="Doubled the brown butter and it was better. Dough needs a full overnight rest — 4 hours wasn't enough."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Where edits land: straight through, or staged as a would-be variation */}
          <div className="border border-border p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-text-secondary">Saving to</span>
              {(['recipe', 'draft'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  aria-pressed={target === t}
                  className={`px-3 py-1.5 border text-sm transition-colors ${
                    target === t ? 'bg-text border-text text-white' : 'border-border text-text-secondary hover:text-text hover:border-text'
                  }`}
                >
                  {t === 'recipe' ? 'This recipe' : 'A staged change'}
                </button>
              ))}
              {target === 'draft' && (
                <Link href={`/recipes/${id}/versions`} className="tlink text-sm text-text-secondary hover:text-text">
                  Review &amp; commit &rarr;
                </Link>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-3 max-w-[62ch]">
              {target === 'recipe'
                ? 'Edits are written straight to the recipe, as they always have been.'
                : 'The recipe on disk stays exactly as it is. Your edits are held aside until you commit them to it — or turn them into a variation. Uploading or removing gallery photos still takes effect immediately: those are files, not text.'}
            </p>
          </div>

          {/* Autosave indicator + Done button */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary flex items-center gap-2">
              {saving && <><Loader size={14} className="animate-spin" /> Saving...</>}
              {saved && !saving && <><Check size={14} className="text-green-600" /> <span className="text-green-600">Saved</span></>}
            </div>
            <Link
              href={`/recipes/${id}`}
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Done
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
