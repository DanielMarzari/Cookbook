// Real Harmony / Complement / Affinity readings for celebrated dishes, measured by
// the Lab itself, with the score each earns under the current model
// (scripts/derive-dish-score.mjs writes these). The score is stored rather than
// recomputed client-side because the model also reads pair-level features the
// client doesn't carry.
export type Exemplar = { dish: string; h: number; c: number; a: number; score: number };

export const DISH_EXEMPLARS: Exemplar[] = [
  { dish: 'Ratatouille', h: 62, c: 45, a: 15, score: 100 },
  { dish: 'Guacamole', h: 58, c: 70, a: 27, score: 100 },
  { dish: 'Beef bourguignon', h: 47, c: 48, a: 20, score: 100 },
  { dish: 'Coq au vin', h: 45, c: 36, a: 19, score: 100 },
  { dish: 'Cacio e pepe', h: 60, c: 77, a: 12, score: 100 },
  { dish: 'Tiramisu', h: 60, c: 43, a: 41, score: 100 },
  { dish: 'Bouillabaisse', h: 38, c: 62, a: 14, score: 99 },
  { dish: 'French onion soup', h: 38, c: 48, a: 20, score: 99 },
  { dish: 'Pesto', h: 60, c: 49, a: 15, score: 98 },
  { dish: 'Tarte tatin', h: 27, c: 50, a: 49, score: 92 },
  { dish: 'Caprese', h: 51, c: 48, a: 19, score: 91 },
  { dish: 'Massaman curry', h: 25, c: 59, a: 25, score: 87 },
  { dish: 'Pad thai', h: 25, c: 60, a: 17, score: 87 },
  { dish: 'Mole poblano', h: 21, c: 60, a: 16, score: 75 },
  { dish: 'Carbonara', h: 20, c: 71, a: 21, score: 74 },
  { dish: 'Risotto milanese', h: 20, c: 53, a: 30, score: 72 },
];
