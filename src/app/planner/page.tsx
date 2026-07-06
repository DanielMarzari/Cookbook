'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus, X, Search, ShoppingCart, Loader, CalendarDays } from 'lucide-react';
import { api, type MealPlanEntryWithRecipe } from '@/lib/api-client';
import { toast } from '@/lib/toast';
import { Recipe } from '@/lib/types';
import { titleCaseIngredient } from '@/lib/utils';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
type MealType = (typeof MEAL_TYPES)[number];

// Local-time YYYY-MM-DD (avoids the UTC day-shift of toISOString).
function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Sunday-based start of the week containing `d`.
function startOfWeek(d: Date): Date {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - s.getDay());
  return s;
}

export default function PlannerPage() {
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [entries, setEntries] = useState<MealPlanEntryWithRecipe[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [addingTo, setAddingTo] = useState<string | null>(null); // date being added to
  const [pickerMeal, setPickerMeal] = useState<MealType>('dinner');
  const [pickerSearch, setPickerSearch] = useState('');

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    }),
    [weekStart]
  );

  const rangeStart = ymd(days[0]);
  const rangeEnd = ymd(days[6]);
  const todayStr = ymd(new Date());

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api.mealPlan.list(rangeStart, rangeEnd);
        setEntries(data || []);
      } catch (err) {
        console.error('Error loading meal plan:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [rangeStart, rangeEnd]);

  useEffect(() => {
    api.recipes.list().then((r) => setRecipes(r || [])).catch(() => {});
  }, []);

  const entriesByDay = (date: string) => entries.filter((e) => e.date === date);

  const filteredRecipes = useMemo(() => {
    const q = pickerSearch.toLowerCase().trim();
    const list = q ? recipes.filter((r) => r.title.toLowerCase().includes(q)) : recipes;
    return list.slice(0, 40);
  }, [recipes, pickerSearch]);

  const handleAdd = async (date: string, recipe: Recipe) => {
    try {
      const created = await api.mealPlan.create({ date, meal_type: pickerMeal, recipe_id: recipe.id });
      setEntries((prev) => [
        ...prev,
        { ...created, recipe_title: recipe.title, recipe_image_url: recipe.image_url || null } as MealPlanEntryWithRecipe,
      ]);
      setAddingTo(null);
      setPickerSearch('');
    } catch (err) {
      console.error('Error adding meal:', err);
      toast.error('Failed to add meal');
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const res = await api.mealPlan.delete(id);
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error removing meal:', err);
      toast.error('Failed to remove meal');
    }
  };

  // Collect every planned recipe's ingredients for the visible week, sum
  // duplicates by name+unit, and drop them into the most recent grocery list.
  const handleGenerateGroceries = async () => {
    if (entries.length === 0) {
      toast.info('No meals planned this week');
      return;
    }
    setGenerating(true);
    try {
      const recipeIds = [...new Set(entries.map((e) => e.recipe_id))];
      const perRecipe = await Promise.all(recipeIds.map((rid) => api.recipeIngredients.list(rid)));
      const allIngredients = await api.ingredients.list();

      type Agg = { name: string; quantity: number; unit: string; category: string; ingredient_id?: string };
      const merged = new Map<string, Agg>();

      for (const list of perRecipe) {
        for (const ing of list || []) {
          if (!ing.name || ing.name.startsWith('---')) continue;
          const match = allIngredients?.find(
            (a) => a.id === ing.ingredient_id || a.name.toLowerCase().trim() === ing.name.toLowerCase().trim()
          );
          const key = `${ing.name.toLowerCase().trim()}|${(ing.unit || '').toLowerCase()}`;
          const existing = merged.get(key);
          if (existing) {
            existing.quantity += ing.quantity || 0;
          } else {
            merged.set(key, {
              name: titleCaseIngredient(ing.name),
              quantity: ing.quantity || 1,
              unit: ing.unit || '',
              category: match?.category || 'Other',
              ingredient_id: match?.id,
            });
          }
        }
      }

      const lists = await api.groceryLists.list();
      let list = lists && lists.length > 0 ? lists[0] : null;
      if (!list) list = await api.groceryLists.create({ name: 'Weekly Groceries' });

      const items = [...merged.values()];
      await Promise.all(
        items.map((it) =>
          api.groceryListItems.create({
            list_id: list!.id,
            ingredient_id: it.ingredient_id || undefined,
            name: it.name,
            quantity: it.quantity,
            unit: it.unit,
            category: it.category,
            checked: false,
          })
        )
      );

      toast.success(`Added ${items.length} items to ${list.name}`);
    } catch (err) {
      console.error('Error generating groceries:', err);
      toast.error('Failed to generate grocery list');
    } finally {
      setGenerating(false);
    }
  };

  const shiftWeek = (weeks: number) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + weeks * 7);
    setWeekStart(d);
  };

  const weekLabel = `${days[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${days[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

  return (
    <div className="w-full">
      <div className="bg-surface border-b border-border shadow-warm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={22} className="text-primary" />
            <h1 className="text-xl font-bold text-text">Meal Planner</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => shiftWeek(-1)} className="p-2 rounded-lg hover:bg-background transition-colors" aria-label="Previous week">
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setWeekStart(startOfWeek(new Date()))}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-text hover:bg-background transition-colors min-w-[9rem]"
            >
              {weekLabel}
            </button>
            <button onClick={() => shiftWeek(1)} className="p-2 rounded-lg hover:bg-background transition-colors" aria-label="Next week">
              <ChevronRight size={18} />
            </button>
            <button
              onClick={handleGenerateGroceries}
              disabled={generating}
              className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {generating ? <Loader size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
              <span className="hidden sm:inline">Grocery list</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {loading ? (
          <p className="text-text-secondary">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {days.map((day) => {
              const dateStr = ymd(day);
              const dayEntries = entriesByDay(dateStr);
              const isToday = dateStr === todayStr;
              return (
                <div
                  key={dateStr}
                  className={`rounded-xl border p-3 min-h-[9rem] flex flex-col ${isToday ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}
                >
                  <div className="mb-2">
                    <p className={`text-xs font-semibold uppercase tracking-wide ${isToday ? 'text-primary' : 'text-text-secondary'}`}>
                      {day.toLocaleDateString(undefined, { weekday: 'short' })}
                    </p>
                    <p className="text-sm font-bold text-text">{day.getDate()}</p>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {dayEntries.map((e) => (
                      <div key={e.id} className="group flex items-start gap-1 rounded-lg bg-background px-2 py-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-wide text-text-secondary">{e.meal_type}</p>
                          <Link href={`/recipes/${e.recipe_id}`} className="text-xs font-medium text-text hover:text-primary line-clamp-2 break-words">
                            {e.recipe_title || 'Recipe'}
                          </Link>
                        </div>
                        <button
                          onClick={() => handleRemove(e.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-red-500 flex-shrink-0"
                          aria-label="Remove meal"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {addingTo === dateStr ? (
                    <div className="mt-2 rounded-lg border border-border bg-background p-2">
                      <div className="flex gap-1 mb-2">
                        {MEAL_TYPES.map((m) => (
                          <button
                            key={m}
                            onClick={() => setPickerMeal(m)}
                            className={`flex-1 text-[10px] py-1 rounded capitalize ${pickerMeal === m ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface'}`}
                          >
                            {m.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                      <div className="relative mb-1">
                        <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                          autoFocus
                          value={pickerSearch}
                          onChange={(e) => setPickerSearch(e.target.value)}
                          placeholder="Search…"
                          className="w-full pl-6 pr-2 py-1 text-xs rounded border border-border bg-surface text-text"
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredRecipes.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => handleAdd(dateStr, r)}
                            className="block w-full text-left text-xs px-2 py-1 rounded hover:bg-primary/10 text-text truncate"
                          >
                            {r.title}
                          </button>
                        ))}
                        {filteredRecipes.length === 0 && <p className="text-xs text-text-secondary px-2 py-1">No recipes</p>}
                      </div>
                      <button onClick={() => setAddingTo(null)} className="mt-1 w-full text-[10px] text-text-secondary hover:text-text py-1">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAddingTo(dateStr); setPickerSearch(''); }}
                      className="mt-2 flex items-center justify-center gap-1 w-full py-1.5 rounded-lg border border-dashed border-border text-xs text-text-secondary hover:border-primary hover:text-primary transition-colors"
                    >
                      <Plus size={12} /> Add
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
