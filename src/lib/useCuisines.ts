'use client';

import { useEffect, useState } from 'react';
import { api } from './api-client';
import { DEFAULT_CUISINES } from './constants';

/**
 * Hook that returns the full list of cuisines: defaults + any custom ones from the DB.
 * Custom cuisines are any cuisine_type values in recipes that aren't in DEFAULT_CUISINES.
 */
export function useCuisines() {
  const [customCuisines, setCustomCuisines] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCustom() {
      try {
        const recipes = await api.recipes.list();

        if (recipes) {
          const defaultSet = new Set(DEFAULT_CUISINES.map(c => c.toLowerCase()));
          const customs = new Set<string>();
          for (const recipe of recipes) {
            const ct = recipe.cuisine_type;
            if (ct && !defaultSet.has(ct.toLowerCase()) && ct.toLowerCase() !== 'other') {
              customs.add(ct);
            }
          }
          setCustomCuisines(Array.from(customs).sort());
        }
      } catch (err) {
        console.error('Error fetching cuisines:', err);
      }
    }
    fetchCustom();
  }, []);

  // Merge: defaults + custom + Other at the end
  const allCuisines = [...DEFAULT_CUISINES, ...customCuisines, 'Other'];
  return { cuisines: allCuisines, customCuisines };
}
