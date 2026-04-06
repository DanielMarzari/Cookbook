'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { DEFAULT_CUISINES } from './constants';

/**
 * Hook that returns the full list of cuisines: defaults + any custom ones from the DB.
 * Custom cuisines are any cuisine_type values in recipes that aren't in DEFAULT_CUISINES.
 */
export function useCuisines() {
  const [customCuisines, setCustomCuisines] = useState<string[]>([]);

  useEffect(() => {
    async function fetchCustom() {
      const { data } = await supabase
        .from('recipes')
        .select('cuisine_type')
        .not('cuisine_type', 'is', null);

      if (data) {
        const defaultSet = new Set(DEFAULT_CUISINES.map(c => c.toLowerCase()));
        const customs = new Set<string>();
        for (const row of data) {
          const ct = row.cuisine_type;
          if (ct && !defaultSet.has(ct.toLowerCase()) && ct.toLowerCase() !== 'other') {
            customs.add(ct);
          }
        }
        setCustomCuisines(Array.from(customs).sort());
      }
    }
    fetchCustom();
  }, []);

  // Merge: defaults + custom + Other at the end
  const allCuisines = [...DEFAULT_CUISINES, ...customCuisines, 'Other'];
  return { cuisines: allCuisines, customCuisines };
}
