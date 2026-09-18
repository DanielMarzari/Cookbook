'use client';

import { useEffect, useState } from 'react';
import { api } from './api-client';
import { DEFAULT_CRAFTS } from './constants';

/**
 * The craft list: the five defaults plus anything written on a recipe.
 *
 * Same shape as useCuisines on purpose — a craft you invent ("Preserving",
 * "Fermenting") joins the row without anyone editing a constant, which is how
 * the cuisine list already behaves.
 */
export function useCrafts() {
  const [custom, setCustom] = useState<string[]>([]);

  useEffect(() => {
    let live = true;
    async function load() {
      try {
        const recipes = await api.recipes.list();
        if (!recipes || !live) return;
        const known = new Set(DEFAULT_CRAFTS.map((c) => c.toLowerCase()));
        const found = new Set<string>();
        for (const r of recipes) {
          const c = (r as { craft?: string | null }).craft;
          if (c && !known.has(c.toLowerCase())) found.add(c);
        }
        setCustom([...found].sort());
      } catch {
        // The filter row is not worth failing the page over.
      }
    }
    load();
    return () => {
      live = false;
    };
  }, []);

  return { crafts: [...DEFAULT_CRAFTS, ...custom] };
}
