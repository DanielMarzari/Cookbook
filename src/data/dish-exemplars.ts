// Real Harmony / Complement / Affinity readings for celebrated dishes, measured
// by the Lab itself (scripts/derive-dish-score.mjs against Noma recipes + classics).
// Used as the "compare shelf" of baselines so a plate's score has real reference
// points — and to show that great dishes reach excellence by different routes
// (Coq au vin is harmony-led; Guacamole is complement-led). Scores are computed
// at render time via dishScore(), so they always track the current model.
export type Exemplar = { dish: string; h: number; c: number; a: number };

export const DISH_EXEMPLARS: Exemplar[] = [
  { dish: 'Cacio e pepe', h: 63, c: 77, a: 12 },
  { dish: 'Carbonara', h: 63, c: 77, a: 12 },
  { dish: 'Tarte tatin', h: 72, c: 50, a: 49 },
  { dish: 'Risotto milanese', h: 71, c: 53, a: 30 },
  { dish: 'Guacamole', h: 52, c: 70, a: 27 },
  { dish: 'Bouillabaisse', h: 63, c: 62, a: 14 },
  { dish: 'French onion soup', h: 72, c: 48, a: 20 },
  { dish: 'Beef bourguignon', h: 70, c: 48, a: 20 },
  { dish: 'Massaman curry', h: 56, c: 59, a: 25 },
  { dish: 'Muhammara', h: 67, c: 56, a: 7 },
  { dish: 'Coq au vin', h: 73, c: 36, a: 19 },
  { dish: 'Caprese', h: 62, c: 48, a: 19 },
  { dish: 'Pesto', h: 62, c: 49, a: 15 },
  { dish: 'Tiramisu', h: 64, c: 34, a: 48 },
  { dish: 'Ratatouille', h: 59, c: 45, a: 15 },
  { dish: 'Pad thai', h: 46, c: 60, a: 12 },
  { dish: 'Mole poblano', h: 39, c: 60, a: 16 },
];
