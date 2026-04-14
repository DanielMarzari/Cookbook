'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Plus, X, Loader, GripVertical, ClipboardPaste, FileText, Check } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Recipe, RecipeIngredient, Tag } from '@/lib/types';
import { toFraction, titleCaseIngredient } from '@/lib/utils';
import { UNITS } from '@/lib/constants';
import { useCuisines } from '@/lib/useCuisines';

interface FormIngredientItem {
  name: string;
  quantity: number;
  unit: string;
  notes: string;
  is_header?: boolean;  // Section header like "For the Dough"
  is_or?: boolean;      // OR divider between alternatives
}

interface FormRecipe {
  title: string;
  description: string;
  cuisine_type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  image_url: string;
  source_url: string;
  source_name: string;
  source_author: string;
  ingredients: FormIngredientItem[];
  instructions: Array<{
    text: string;
    timer_minutes?: number;
    timer_label?: string;
  }>;
}



export default function AddRecipePage() {
  const router = useRouter();
  const { cuisines } = useCuisines();
  const [customCuisine, setCustomCuisine] = useState('');
  const [activeTab, setActiveTab] = useState<'manual' | 'url' | 'paste' | 'image' | 'pdf'>(
    'manual'
  );

  // PDF import state
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfFilename, setPdfFilename] = useState<string>('');
  const [pdfCandidates, setPdfCandidates] = useState<any[]>([]);
  const [pdfSelected, setPdfSelected] = useState<Set<string>>(new Set());
  const [pdfImporting, setPdfImporting] = useState(false);
  const [pdfImportProgress, setPdfImportProgress] = useState<{ done: number; total: number } | null>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [pasteLoading, setPasteLoading] = useState(false);
  const [importedData, setImportedData] = useState<Partial<FormRecipe> | null>(
    null
  );
  const [importedImages, setImportedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormRecipe>({
    title: '',
    description: '',
    cuisine_type: 'Italian',
    difficulty: 'medium',
    prep_time_minutes: 15,
    cook_time_minutes: 30,
    servings: 4,
    image_url: '',
    source_url: '',
    source_name: '',
    source_author: '',
    ingredients: [{ name: '', quantity: 0, unit: 'g', notes: '' }],
    instructions: [{ text: '', timer_minutes: undefined, timer_label: '' }],
  });

  // Drag-to-reorder ingredients
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    setFormData((prev) => {
      const items = [...prev.ingredients];
      const [dragged] = items.splice(dragIdx, 1);
      items.splice(idx, 0, dragged);
      return { ...prev, ingredients: items };
    });
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'prep_time_minutes' ||
        name === 'cook_time_minutes' ||
        name === 'servings'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const addSectionHeader = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: '', quantity: 0, unit: '', notes: '', is_header: true },
      ],
    }));
  };

  const addOrDivider = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: 'OR', quantity: 0, unit: '', notes: '', is_or: true },
      ],
    }));
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: '', quantity: 0, unit: 'g', notes: '' },
      ],
    }));
  };

  const updateIngredient = (
    idx: number,
    field: keyof FormRecipe['ingredients'][0],
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === idx ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const removeIngredient = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== idx),
    }));
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { text: '', timer_minutes: undefined, timer_label: '' },
      ],
    }));
  };

  const updateInstruction = (
    idx: number,
    field: keyof FormRecipe['instructions'][0],
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) =>
        i === idx ? { ...inst, [field]: value } : inst
      ),
    }));
  };

  const removeInstruction = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== idx),
    }));
  };

  const handleImportUrl = async () => {
    if (!importUrl.trim()) return;

    setImportLoading(true);
    try {
      const response = await fetch('/api/recipes/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        setImportedData(data);
        // Store all images from the page for user selection
        if (data.all_images && data.all_images.length > 0) {
          setImportedImages(data.all_images);
        }
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
        // Don't auto-switch to manual — stay on URL tab to let user pick image
      } else {
        alert('Failed to import recipe: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to import URL: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setImportLoading(false);
    }
  };

  const handlePasteText = async () => {
    if (!pasteText.trim()) return;

    setPasteLoading(true);
    try {
      const response = await fetch('/api/recipes/parse-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pasteText }),
      });

      const data = await response.json();
      if (response.ok) {
        setImportedData(data);
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
        setActiveTab('manual');
      } else {
        alert('Failed to parse text: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to parse text: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setPasteLoading(false);
    }
  };

  const [ocrProgress, setOcrProgress] = useState('');

  // ---------- PDF import ----------

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfLoading(true);
    setPdfError(null);
    setPdfCandidates([]);
    setPdfSelected(new Set());
    setPdfFilename(file.name);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/recipes/import-pdf', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }
      const data = await res.json();
      const candidates = data.candidates || [];
      if (candidates.length === 0) {
        setPdfError("No recipes detected. This PDF's layout might not be supported — try the Paste Text tab instead.");
      } else {
        setPdfCandidates(candidates);
        setPdfSelected(new Set(candidates.map((c: any) => c.id))); // default: all selected
      }
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Failed to parse PDF');
    } finally {
      setPdfLoading(false);
      // reset input so re-selecting the same file triggers onChange
      if (pdfFileInputRef.current) pdfFileInputRef.current.value = '';
    }
  };

  const handlePdfImportSelected = async () => {
    const selected = pdfCandidates.filter((c) => pdfSelected.has(c.id));
    if (selected.length === 0) return;

    setPdfImporting(true);
    setPdfImportProgress({ done: 0, total: selected.length });

    try {
      for (let i = 0; i < selected.length; i++) {
        const c = selected[i];
        const p = c.parsed;
        // Create the recipe shell.
        const created: any = await api.recipes.create({
          title: c.title,
          description: c.subtitle || '',
          cuisine_type: p.cuisine_type || 'Other',
          difficulty: p.difficulty || 'medium',
          prep_time_minutes: p.prep_time_minutes || 0,
          cook_time_minutes: p.cook_time_minutes || 0,
          total_time_minutes: (p.prep_time_minutes || 0) + (p.cook_time_minutes || 0),
          servings: p.servings || 1,
          instructions: (p.instructions || []).map((inst: any) => ({
            step_number: inst.step_number,
            text: inst.text,
            timer_label: inst.timer_label || '',
          })),
          source_type: 'pdf',
          source_name: pdfFilename,
          status: 'new',
        });

        // Batch-insert ingredients.
        if (created?.id && Array.isArray(p.ingredients) && p.ingredients.length > 0) {
          const ingPayload = p.ingredients.map((ing: any, idx: number) => ({
            recipe_id: created.id,
            name: ing.name,
            quantity: ing.quantity || 0,
            unit: ing.unit || '',
            notes: ing.notes || '',
            order_index: idx,
            ingredient_id: null,
          }));
          await fetch('/api/recipe-ingredients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ingPayload),
          });
        }

        setPdfImportProgress({ done: i + 1, total: selected.length });
      }

      // Success — redirect home to see the imports.
      router.push('/');
    } catch (err) {
      console.error('PDF import error:', err);
      setPdfError(err instanceof Error ? err.message : 'Import failed partway through');
    } finally {
      setPdfImporting(false);
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setOcrProgress('Loading OCR engine...');
    try {
      // Dynamic import Tesseract client-side
      const Tesseract = (await import('tesseract.js')).default;

      // Read image as data URL
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Run OCR in browser
      const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng', {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(`Scanning... ${Math.round((m.progress || 0) * 100)}%`);
          }
        },
      });

      setOcrProgress('Parsing recipe...');

      // Send OCR text to parse-text endpoint
      const response = await fetch('/api/recipes/parse-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.ok) {
        setImportedData(data);
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
        setActiveTab('manual');
      } else {
        alert('Failed to parse image text: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Image import error:', error);
      alert('Failed to import image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setImportLoading(false);
      setOcrProgress('');
    }
  };

  const generateAutoTags = async (): Promise<Tag[]> => {
    const tags: Tag[] = [];
    const ingredients = formData.ingredients.map((i) => i.name.toLowerCase());
    const title = formData.title.toLowerCase();

    const vegetarianIngredients = [
      'tofu',
      'tempeh',
      'chickpeas',
      'lentils',
      'beans',
    ];
    if (
      ingredients.some((ing) =>
        vegetarianIngredients.some((v) => ing.includes(v))
      ) &&
      !ingredients.some((ing) => ing.includes('meat'))
    ) {
      tags.push({
        id: 'auto-veg',
        name: 'Vegetarian',
        type: 'dietary',
        color: '#22c55e',
      });
    }

    if (title.includes('pasta')) {
      tags.push({
        id: 'auto-pasta',
        name: 'Pasta',
        type: 'cuisine',
        color: '#d97706',
      });
    }

    return tags;
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a recipe title');
      return;
    }

    setLoading(true);
    try {
      const autoTags = await generateAutoTags();

      const recipeData = await api.recipes.create({
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        cuisine_type: formData.cuisine_type,
        difficulty: formData.difficulty,
        prep_time_minutes: formData.prep_time_minutes,
        cook_time_minutes: formData.cook_time_minutes,
        total_time_minutes:
          formData.prep_time_minutes + formData.cook_time_minutes,
        servings: formData.servings,
        instructions: formData.instructions.map((inst, idx) => ({
          step_number: idx + 1,
          text: inst.text,
          timer_minutes: inst.timer_minutes,
          timer_label: inst.timer_label,
        })),
        source_url: formData.source_url,
        source_name: formData.source_name,
        source_author: formData.source_author,
        source_type: importedData ? 'url' : 'manual',
        is_favorite: false,
      });

      const ingredientsWithRecipeId = formData.ingredients
        .filter((ing) => ing.name.trim() || ing.is_header || ing.is_or)
        .map((ing, idx) => ({
          recipe_id: recipeData.id,
          name: ing.is_header ? `--- ${ing.name} ---` : ing.is_or ? '---OR---' : titleCaseIngredient(ing.name),
          quantity: ing.is_header || ing.is_or ? 0 : ing.quantity,
          unit: ing.is_header || ing.is_or ? '' : ing.unit,
          notes: ing.is_header || ing.is_or ? '' : ing.notes,
          order_index: idx,
          ingredient_id: null,
        }));

      if (ingredientsWithRecipeId.length > 0) {
        await api.recipeIngredients.create(ingredientsWithRecipeId);
      }

      if (autoTags.length > 0) {
        const tagsWithRecipeId = autoTags.map((tag) => ({
          recipe_id: recipeData.id,
          tag_id: tag.id,
          auto_generated: true,
        }));

        try {
          for (const tag of tagsWithRecipeId) {
            await api.recipeTags.create(tag);
          }
        } catch (err) {
          console.error('Tag insertion error:', err);
        }
      }

      // Auto-add to collections with matching filters
      try {
        const autoCollections = await api.collections.list();

        if (autoCollections) {
          const recipeFields: Record<string, string> = {
            cuisine_type: formData.cuisine_type,
            source_name: formData.source_name,
            source_author: formData.source_author,
          };

          for (const col of autoCollections) {
            const field = col.auto_filter_field;
            const value = col.auto_filter_value?.toLowerCase();
            if (field && value && recipeFields[field]?.toLowerCase() === value) {
              await api.collectionRecipes.create({
                collection_id: col.id,
                recipe_id: recipeData.id,
              });
            }
          }
        }
      } catch (err) {
        console.error('Auto-collection error:', err);
      }

      router.push('/');
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-text mb-8">Add Recipe</h1>

        <div className="flex gap-2 mb-8 border-b border-border flex-wrap">
          {(['manual', 'url', 'paste', 'image', 'pdf'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text'
              }`}
            >
              {tab === 'manual' && 'Manual Entry'}
              {tab === 'url' && 'From URL'}
              {tab === 'paste' && 'Paste Text'}
              {tab === 'image' && 'From Image'}
              {tab === 'pdf' && 'From PDF'}
            </button>
          ))}
        </div>

        {activeTab === 'manual' && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
              <h2 className="text-2xl font-bold text-text mb-4">
                Recipe Details
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Recipe Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="source_name"
                    placeholder="Source / Origin (optional)"
                    value={formData.source_name}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="source_author"
                    placeholder="Author (optional)"
                    value={formData.source_author}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <select
                      name="cuisine_type"
                      value={formData.cuisine_type === 'Other' || (!cuisines.includes(formData.cuisine_type) && formData.cuisine_type !== '') ? 'Other' : formData.cuisine_type}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setFormData(prev => ({ ...prev, cuisine_type: 'Other' }));
                          setCustomCuisine('');
                        } else {
                          setFormData(prev => ({ ...prev, cuisine_type: e.target.value }));
                          setCustomCuisine('');
                        }
                      }}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {cuisines.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {(formData.cuisine_type === 'Other' || customCuisine) && (
                      <input
                        type="text"
                        placeholder="Enter cuisine type..."
                        value={customCuisine}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomCuisine(val);
                          if (val.trim()) {
                            setFormData(prev => ({ ...prev, cuisine_type: val.trim() }));
                          } else {
                            setFormData(prev => ({ ...prev, cuisine_type: 'Other' }));
                          }
                        }}
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        autoFocus
                      />
                    )}
                  </div>

                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Prep Time (min)</label>
                    <input
                      type="number"
                      name="prep_time_minutes"
                      placeholder="15"
                      value={formData.prep_time_minutes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Cook Time (min)</label>
                    <input
                      type="number"
                      name="cook_time_minutes"
                      placeholder="30"
                      value={formData.cook_time_minutes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Servings</label>
                    <input
                      type="number"
                      name="servings"
                      placeholder="4"
                      value={formData.servings}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <input
                  type="url"
                  name="image_url"
                  placeholder="Image URL"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <input
                  type="url"
                  name="source_url"
                  placeholder="Source URL (optional)"
                  value={formData.source_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
              <h2 className="text-2xl font-bold text-text mb-4">Ingredients</h2>

              <div className="space-y-3">
                {formData.ingredients.map((ing, idx) => {
                  const dragProps = {
                    draggable: true,
                    onDragStart: () => handleDragStart(idx),
                    onDragOver: (e: React.DragEvent) => handleDragOver(e, idx),
                    onDrop: () => handleDrop(idx),
                    onDragEnd: handleDragEnd,
                  };
                  const dropHighlight = dragOverIdx === idx && dragIdx !== idx
                    ? 'border-t-2 border-primary'
                    : '';
                  const dragging = dragIdx === idx ? 'opacity-40' : '';

                  // Section header
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
                        <button
                          onClick={() => removeIngredient(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  }

                  // OR divider
                  if (ing.is_or) {
                    return (
                      <div key={idx} {...dragProps} className={`flex items-center gap-3 py-1 ${dropHighlight} ${dragging}`}>
                        <GripVertical size={16} className="text-text-secondary cursor-grab flex-shrink-0" />
                        <div className="flex-1 border-t border-orange-300" />
                        <span className="text-sm font-bold text-orange-500 tracking-wider">OR</span>
                        <div className="flex-1 border-t border-orange-300" />
                        <button
                          onClick={() => removeIngredient(idx)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  }

                  // Normal ingredient row
                  return (
                    <div key={idx} {...dragProps} className={`flex gap-2 items-center ${dropHighlight} ${dragging}`}>
                      <GripVertical size={16} className="text-text-secondary cursor-grab flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Ingredient name"
                        value={ing.name}
                        onChange={(e) =>
                          updateIngredient(idx, 'name', e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="relative w-24">
                        <input
                          type="number"
                          placeholder="Qty"
                          step="0.01"
                          value={ing.quantity}
                          onChange={(e) =>
                            updateIngredient(idx, 'quantity', parseFloat(e.target.value) || 0)
                          }
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
                        onChange={(e) =>
                          updateIngredient(idx, 'unit', e.target.value)
                        }
                        className="w-28 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {UNITS.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Notes"
                        value={ing.notes}
                        onChange={(e) =>
                          updateIngredient(idx, 'notes', e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {formData.ingredients.length > 1 && (
                        <button
                          onClick={() => removeIngredient(idx)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
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

            <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
              <h2 className="text-2xl font-bold text-text mb-4">
                Instructions
              </h2>

              <div className="space-y-4">
                {formData.instructions.map((inst, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4">
                    <div className="flex gap-2 mb-2">
                      <span className="font-semibold text-primary">
                        Step {idx + 1}
                      </span>
                      {formData.instructions.length > 1 && (
                        <button
                          onClick={() => removeInstruction(idx)}
                          className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>

                    <textarea
                      placeholder="Instruction text"
                      value={inst.text}
                      onChange={(e) =>
                        updateInstruction(idx, 'text', e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Timer (minutes)"
                        value={inst.timer_minutes || ''}
                        onChange={(e) =>
                          updateInstruction(
                            idx,
                            'timer_minutes',
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="text"
                        placeholder="Timer label"
                        value={inst.timer_label || ''}
                        onChange={(e) =>
                          updateInstruction(idx, 'timer_label', e.target.value)
                        }
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

            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Recipe'
              )}
            </button>
          </div>
        )}

        {activeTab === 'url' && (
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-4">Import from URL</h2>

            <div className="space-y-4">
              <input
                type="url"
                placeholder="https://example.com/recipe"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                onClick={handleImportUrl}
                disabled={importLoading || !importUrl.trim()}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {importLoading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Importing...
                  </>
                ) : (
                  'Import Recipe'
                )}
              </button>

              {importedData && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      Recipe imported: {importedData.title}
                    </p>
                    <p className="text-green-700 text-sm mt-1">
                      {importedData.ingredients?.length || 0} ingredients, {importedData.instructions?.length || 0} steps found
                    </p>
                  </div>

                  {/* Image Picker */}
                  {importedImages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-text mb-3">Choose an image</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {importedImages.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            onClick={() => setFormData(prev => ({ ...prev, image_url: imgUrl }))}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                              formData.image_url === imgUrl
                                ? 'border-primary shadow-warm-lg ring-2 ring-primary/30'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Option ${idx + 1}`}
                              className="w-full h-32 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            {formData.image_url === imgUrl && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="mt-2 text-sm text-text-secondary hover:text-text transition-colors"
                      >
                        No image
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setActiveTab('manual')}
                    className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Continue to Edit & Save
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-2">Paste Recipe Text</h2>
            <p className="text-text-secondary text-sm mb-4">
              Paste a recipe from Instagram, a message, email, or anywhere else. We'll auto-detect the title, ingredients, and instructions.
            </p>

            <div className="space-y-4">
              <textarea
                placeholder={"Paste your recipe here...\n\nExample:\nChocolate Chip Cookies\n\nIngredients:\n2 cups flour\n1 cup butter, softened\n1 cup sugar\n2 eggs\n1 tsp vanilla extract\n1 cup chocolate chips\n\nInstructions:\n1. Preheat oven to 375°F\n2. Cream butter and sugar together\n3. Add eggs and vanilla, mix well\n4. Stir in flour, then fold in chips\n5. Drop spoonfuls onto baking sheet\n6. Bake for 10 minutes"}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={16}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm leading-relaxed"
              />

              <div className="flex gap-3">
                <button
                  onClick={handlePasteText}
                  disabled={pasteLoading || !pasteText.trim()}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {pasteLoading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <ClipboardPaste size={20} />
                      Parse Recipe
                    </>
                  )}
                </button>
                <button
                  onClick={() => setPasteText('')}
                  disabled={!pasteText}
                  className="px-6 py-3 border border-border rounded-lg font-medium text-text-secondary hover:bg-background transition-colors disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-2">
              Import from Image
            </h2>
            <p className="text-text-secondary text-sm mb-4">
              Upload a photo of a recipe — handwritten, from a book, or a screenshot. OCR runs in your browser.
            </p>

            {!importLoading ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <Upload size={40} className="mx-auto text-primary mb-2" />
                <p className="text-text-secondary">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                <Loader size={40} className="mx-auto text-primary mb-3 animate-spin" />
                <p className="text-primary font-medium">{ocrProgress || 'Processing...'}</p>
                <p className="text-xs text-text-secondary mt-2">
                  This may take a moment for large images
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pdf' && (
          <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
            <h2 className="text-2xl font-bold text-text mb-2">Import from PDF</h2>
            <p className="text-text-secondary text-sm mb-4">
              Upload a cookbook PDF. We&apos;ll detect each recipe and let you pick which ones to import.
            </p>

            {pdfCandidates.length === 0 && !pdfLoading && (
              <div
                onClick={() => pdfFileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <FileText size={40} className="mx-auto text-primary mb-2" />
                <p className="text-text-secondary">Click to upload a PDF</p>
                <p className="text-xs text-text-secondary mt-1">Up to 20MB</p>
                <input
                  ref={pdfFileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </div>
            )}

            {pdfLoading && (
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                <Loader size={40} className="mx-auto text-primary mb-3 animate-spin" />
                <p className="text-primary font-medium">Parsing PDF…</p>
              </div>
            )}

            {pdfError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {pdfError}
              </div>
            )}

            {pdfCandidates.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-text-secondary">
                    Found <span className="font-semibold text-text">{pdfCandidates.length}</span>{' '}
                    recipe{pdfCandidates.length === 1 ? '' : 's'} in{' '}
                    <span className="font-mono text-xs">{pdfFilename}</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setPdfSelected(new Set(pdfCandidates.map((c) => c.id)))
                      }
                      className="text-sm text-primary hover:underline"
                    >
                      Select all
                    </button>
                    <span className="text-text-secondary">·</span>
                    <button
                      onClick={() => setPdfSelected(new Set())}
                      className="text-sm text-text-secondary hover:text-text"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pdfCandidates.map((c) => {
                    const checked = pdfSelected.has(c.id);
                    return (
                      <li key={c.id}>
                        <label
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            checked
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={checked}
                            onChange={() => {
                              setPdfSelected((prev) => {
                                const next = new Set(prev);
                                if (next.has(c.id)) next.delete(c.id);
                                else next.add(c.id);
                                return next;
                              });
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-text">{c.title}</span>
                              <span className="text-xs font-mono px-2 py-0.5 rounded bg-background text-text-secondary">
                                p. {c.page}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">
                              {c.parsed.ingredients.length} ingredient
                              {c.parsed.ingredients.length === 1 ? '' : 's'}
                              {' · '}
                              {c.parsed.instructions.length} step
                              {c.parsed.instructions.length === 1 ? '' : 's'}
                              {c.parsed.servings ? ` · serves ${c.parsed.servings}` : ''}
                              {c.parsed.difficulty ? ` · ${c.parsed.difficulty}` : ''}
                            </p>
                          </div>
                        </label>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex gap-3">
                  <button
                    onClick={handlePdfImportSelected}
                    disabled={pdfSelected.size === 0 || pdfImporting}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {pdfImporting ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Importing {pdfImportProgress?.done ?? 0} of{' '}
                        {pdfImportProgress?.total ?? 0}…
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Import Selected ({pdfSelected.size})
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setPdfCandidates([]);
                      setPdfSelected(new Set());
                      setPdfFilename('');
                      setPdfError(null);
                    }}
                    disabled={pdfImporting}
                    className="px-4 py-3 border border-border rounded-lg font-medium hover:bg-background transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
