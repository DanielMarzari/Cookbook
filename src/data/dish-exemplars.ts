// Real Harmony / Complement / Affinity readings for celebrated dishes, measured
// by the Lab itself (scripts/derive-dish-score.mjs against Noma recipes + classics).
// Used as the "compare shelf" so a plate's score has real reference points —
// and to show that great dishes reach excellence by different routes (Coq au vin
// is harmony-led; Guacamole is complement-led). Scores are computed at render
// time via dishScore(), so they always track the current model.
export type Exemplar = { dish: string; h: number; c: number; a: number };

export const DISH_EXEMPLARS: Exemplar[] = [
  { dish: 'Cacio e pepe', h: 63, c: 77, a: 12 },
  { dish: 'Guacamole', h: 52, c: 70, a: 27 },
  { dish: 'Bouillabaisse', h: 63, c: 62, a: 14 },
  { dish: 'Coq au vin', h: 73, c: 36, a: 19 },
  { dish: 'Caprese', h: 62, c: 48, a: 19 },
  { dish: 'Tarte tatin', h: 72, c: 50, a: 49 },
];
