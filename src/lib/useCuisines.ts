'use client';

import { useEffect, useState } from 'react';
import { api } from './api-client';

/**
 * The cuisines you actually have, and nothing else.
 *
 * This used to be a list of twenty-five defaults plus whatever the recipes
 * added, which meant the filter row offered Ethiopian, Korean and Vietnamese
 * to a cookbook containing none of them — twenty dead ends to read past to
 * find the six that do something. The vocabulary now comes from the recipes,
 * so the row is a description of the collection rather than a wishlist.
 *
 * New ones are written on a recipe (there is a free-text box beside the
 * picker), and appear here as soon as one exists.
 */
export function useCuisines() {
  const [cuisines, setCuisines] = useState<string[]>([]);

  useEffect(() => {
    let live = true;
    api.recipes
      .list()
      .then((recipes) => {
        if (!recipes || !live) return;
        // Case-insensitive, but keep the spelling the recipes actually use.
        const seen = new Map<string, string>();
        for (const r of recipes) {
          const c = (r.cuisine_type || '').trim();
          if (!c || c.toLowerCase() === 'other') continue;
          if (!seen.has(c.toLowerCase())) seen.set(c.toLowerCase(), c);
        }
        setCuisines([...seen.values()].sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => {
        // An empty row is better than a page that fell over.
      });
    return () => {
      live = false;
    };
  }, []);

  return { cuisines };
}
