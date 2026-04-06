'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Recipe } from '@/lib/types';
import { ArrowLeft, Plus, X, Loader, RotateCw, Trash2 } from 'lucide-react';

const CUISINES = [
  'Italian', 'Japanese', 'Mexican', 'French', 'Chinese',
  'Indian', 'Thai', 'Mediterranean', 'American', 'Korean',
];

const UNITS = ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'oz', 'lb', 'piece', 'stick', 'clove', 'slice', 'can', 'pinch', 'dash', 'sprig', 'bunch', 'head', 'stalk', 'package', 'bag', 'large', 'medium', 'small'];

function toFraction(n: number): string {
  if (n === 0) return '0';
  const whole = Math.floor(n);
  const frac = n - whole;
  const fractions: [number, string][] = [
    [0, ''], [0.125, '⅛'], [0.2, '⅕'], [0.25, '¼'], [1/3, '⅓'],
    [0.375, '⅜'], [0.4, '⅖'], [0.5, '½'], [0.6, '⅗'], [0.625, '⅝'],
    [2/3, '⅔'], [0.75, '¾'], [0.8, '⅘'], [0.875, '⅞'],
  ];
  let bestFrac = '';
  let bestDiff = 0.05;
  for (const [val, symbol] of fractions) {
    const diff = Math.abs(frac - val);
    if (diff < bestDiff) { bestDiff = diff; bestFrac = symbol; }
  }
  if (whole > 0 && bestFrac) return `${whole}${bestFrac}`;
  if (whole > 0) return String(whole);
  if (bestFrac) return bestFrac;
  return String(Math.round(n * 100) / 100);
}

interface FormIngredient {
  name: string;
  quantity: number;
  unit: string;
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageRotation, setImageRotation] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisineType, setCuisineType] = useState('Italian');
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
          setIngredients(recipeIngredients.map((ing: any) => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes || '',
          })));
        }
      } catch (err) {
        console.error('Error loading recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleRotateImage = async () => {
    const newRotation = (imageRotation + 90) % 360;
    setImageRotation(newRotation);
    // Save immediately
    await supabase
      .from('recipes')
      .update({ image_rotation: newRotation })
      .eq('id', id);
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

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a recipe title');
      return;
    }

    setSaving(true);
    try {
      // Update recipe
      const { error: recipeError } = await supabase
        .from('recipes')
        .update({
          title,
          description,
          cuisine_type: cuisineType,
          difficulty,
          prep_time_minutes: prepTime,
          cook_time_minutes: cookTime,
          total_time_minutes: prepTime + cookTime,
          servings,
          image_url: imageUrl,
          image_rotation: imageRotation,
          source_url: sourceUrl,
          source_name: sourceName,
          source_author: sourceAuthor,
          instructions: instructions.map((inst, idx) => ({
            step_number: idx + 1,
            text: inst.text,
            timer_minutes: inst.timer_minutes,
            timer_label: inst.timer_label,
          })),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (recipeError) throw recipeError;

      // Delete old ingredients and re-insert
      await supabase
        .from('recipe_ingredients')
        .delete()
        .eq('recipe_id', id);

      const ingredientsWithRecipeId = ingredients
        .filter(ing => ing.name.trim())
        .map((ing, idx) => ({
          recipe_id: id,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          notes: ing.notes,
          order_index: idx,
          ingredient_id: null,
        }));

      if (ingredientsWithRecipeId.length > 0) {
        const { error: ingredError } = await supabase
          .from('recipe_ingredients')
          .insert(ingredientsWithRecipeId);

        if (ingredError) throw ingredError;
      }

      router.push(`/recipes/${id}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
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
                <select
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CUISINES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

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
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 items-center">
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
                  <button
                    onClick={() => removeIngredient(idx)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addIngredient}
              className="mt-4 flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Ingredient
            </button>
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

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
