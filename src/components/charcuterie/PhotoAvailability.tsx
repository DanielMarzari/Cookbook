'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { VERIFIED_PHOTOS } from '@/lib/charcuterie/photos';

/**
 * Which ingredients have a picture the board is allowed to use.
 *
 * Two sources, and they need different treatment. The fetched ones are guilty
 * until proven innocent — the CC0 pass produced memorial stones and vintage
 * posters — so only the hand-checked ids in VERIFIED_PHOTOS count. A photo you
 * uploaded needs no such vetting: choosing it *was* the vetting, so it goes
 * straight onto the board.
 *
 * The custom list only exists on the server, hence the fetch. Until it lands,
 * the board draws motifs, which is the correct thing to show while we don't yet
 * know what you have.
 */
const PhotoSetContext = createContext<Set<string>>(VERIFIED_PHOTOS);

export function usePhotoSet(): Set<string> {
  return useContext(PhotoSetContext);
}

export function PhotoAvailabilityProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = useState<string[]>([]);

  useEffect(() => {
    let live = true;
    fetch('/api/charcuterie/photos')
      .then((r) => r.json())
      .then((d) => {
        if (live) setCustom(d.custom ?? []);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const set = useMemo(() => new Set([...VERIFIED_PHOTOS, ...custom]), [custom]);
  return <PhotoSetContext.Provider value={set}>{children}</PhotoSetContext.Provider>;
}
