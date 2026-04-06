'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/lib/types';
import { ArrowLeft, Plus, X, Loader, RotateCw, Trash2, GripVertical, Check } from 'lucide-react';
import { toFraction, titleCaseIngredient } from '@/lib/utils';
import { UNITS, DEFAULT_CUISINES } from '@/lib/constants';
import { useCuisines } from '@/lib/useCuisines';


interface FormIngredient {
  name: string;
  quantity: number;
  unit: string;
  is_header?: boolean;
  is_or?: boolean;
  notes: string;
}

interface FormInstruction {
  text: string;
  timer_minutes?: number;
  timer_label?: string;
}

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { cuisines } = useCuisines();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);
  const initialLoadDone = useRef(false);
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('Italian');
  const [customCuisine, setCustomCuisine] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [prepTime, setPrepTime] = useState(0);
  const [cookTime, setCookTime] = useState(0);
  const [servings, setServings] = useState(4);
  const [imageUrl, setImageUrl] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceAuthor, setSourceAuthor] = useState('');
  const [ingredients, setIngredients] = useState<FormIngredient[]>([]);
  const [instructions, setInstructions] = useState<FormInstruction[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || id === 'undefined') return;

      try {
        const { data: recipe, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!recipe) return;

        setTitle(recipe.title);
        setDescription(recipe.description || '');
        setCuisineType(recipe.cuisine_type);
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

        // Load instructions
        if (recipe.instructions && recipe.instructions.length > 0) {
          setInstructions(recipe.instructions.map((inst: any) => ({
            text: inst.text || '',
            timer_minutes: inst.timer_minutes,
            timer_label: inst.timer_label || '',
          })));
        }

        // Load ingredients
        const { data: recipeIngredients } = await supabase
          .from('recipe_ingredients')
          .select('*')
          .eq('recipe_id', id)
          .order('order_index');

        if (recipeIngredients && recipeIngredients.length > 0) {
          setIngredients(recipeIngredients.map((ing: any) => {
            // Detect section headers and OR dividers from DB format
            if (ing.name === '---OR---') {
              return { name: 'OR', quantity: 0, unit: '', notes: '', is_or: true };
            }
            if (ing.name?.startsWith('---') && ing.name?.endsWith('---')) {
              return { name: ing.name.replace(/^-+\s*/, '').replace(/\s*-+$/, ''), quantity: 0, unit: '', notes: '', is_header: true };
            }
            return {
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit,
              notes: ing.notes || '',
            };
          }));
        }
      } catch (err) {
        console.error('Error loading recipe:', err);
      } finally {
        setLoading(false);
        setTimeout(() => { initialLoadDone.current = true; }, 100);
      }
    };

    fetchRecipe();
  }, [id]);

  // Autosave: debounce 1.5s after any change
  const doAutosave = useCallback(async () => {
    if (!initialLoadDone.current || !title.trim()) return;
    setSaving(true);
    try {
      await supabase
        .from('recipes')
        .update({
          title, description, cuisine_type: cuisineType, difficulty,
          prep_time_minutes: prepTime, cook_time_minutes: cookTime,
          total_time_minutes: prepTime + cookTime, servings,
          image_url: imageUrl, image_rotation: imageRotation,
          source_url: sourceUrl, source_name: sourceName, source_author: sourceAuthor,
          instructions: instructions.map((inst, idx) => ({
            step_number: idx + 1, text: inst.text,
            timer_minutes: inst.timer_minutes, timer_label: inst.timer_label,
          })),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      // Save ingredients
      await supabase.from('recipe_ingredients').delete().eq('recipe_id', id);
      const ingredientsWithRecipeId = ingredients
        .filter(ing => ing.name.trim() || ing.is_header || ing.is_or)
        .map((ing, idx) => ({
          recipe_id: id,
          name: ing.is_header ? `--- ${ing.name} ---` : ing.is_or ? '---OR---' : titleCaseIngredient(ing.name),
          quantity: ing.is_header || ing.is_or ? 0 : ing.quantity,
          unit: ing.is_header || ing.is_or ? '' : ing.unit,
          notes: ing.is_header || ing.is_or ? '' : ing.notes,
          order_index: idx,
          ingredient_id: null,
        }));
      if (ingredientsWithRecipeId.length > 0) {
        await supabase.from('recipe_ingredients').insert(ingredientsWithRecipeId);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Autosave error:', err);
    } finally {
      setSaving(false);
    }
  }, [id, title, description, cuisineType, difficulty, prepTime, cookTime, servings, imageUrl, imageRotation, sourceUrl, sourceName, sourceAuthor, instructions, ingredients]);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(doAutosave, 1500);
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [title, description, cuisineType, difficulty, prepTime, cookTime, servings, imageUrl, sourceUrl, sourceName, sourceAuthor, instructions, ingredients, doAutosave]);

  const handleRotateImage = async () => {
    const newRotation = (imageRotation + 90) % 360;
    setImageRotation(newRotation);
    // Save immediately
    await supabase
      .from('recipes')
      .update({ image_rotation: newRotation })
      .eq('id', id);
  };

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
      <div className="max-w-4xl mx-auto px-4">
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
                <input
                  type="text"
                  placeholder="Source / Origin (optional)"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Author (optional)"
                  value={sourceAuthor}
                  onChange={(e) => setSourceAuthor(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

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

              {/* Image URL + rotation */}
              <div>
                <label className="block text-xs text-text-secondary mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {imageUrl && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-background">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-300"
                    style={{ transform: `rotate(${imageRotation}deg)` }}
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
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-4">Instructions</h2>

            <div className="space-y-4">
              {instructions.map((inst, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4">
                  <div className="flex gap-2 mb-2">
                    <span className="font-semibold text-primary">Step {idx + 1}</span>
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
  );
}
