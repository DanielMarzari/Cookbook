// Real Harmony / Complement / Affinity readings for celebrated dishes, measured by
// the Lab itself, with the score each earns under the current model
// (scripts/derive-dish-score.mjs writes these). The score is stored rather than
// recomputed client-side because the model also reads pair-level features the
// client doesn't carry.
export type Exemplar = { dish: string; h: number; c: number; a: number; score: number };

export const DISH_EXEMPLARS: Exemplar[] = [
  { dish: 'Tarte tatin', h: 72, c: 50, a: 49, score: 79 },
  { dish: 'Caprese', h: 62, c: 48, a: 19, score: 66 },
  { dish: 'Beef bourguignon', h: 70, c: 48, a: 20, score: 65 },
  { dish: 'Guacamole', h: 52, c: 70, a: 27, score: 63 },
  { dish: 'Tiramisu', h: 62, c: 43, a: 41, score: 63 },
  { dish: 'Ratatouille', h: 59, c: 45, a: 15, score: 62 },
  { dish: 'Coq au vin', h: 73, c: 36, a: 19, score: 62 },
  { dish: 'Risotto milanese', h: 71, c: 53, a: 30, score: 61 },
  { dish: 'Pesto', h: 62, c: 49, a: 15, score: 55 },
  { dish: 'Bouillabaisse', h: 63, c: 62, a: 14, score: 53 },
  { dish: 'Carbonara', h: 67, c: 71, a: 21, score: 52 },
  { dish: 'French onion soup', h: 72, c: 48, a: 20, score: 51 },
  { dish: 'Cacio e pepe', h: 63, c: 77, a: 12, score: 48 },
  { dish: 'Massaman curry', h: 56, c: 59, a: 25, score: 46 },
  { dish: 'Pad thai', h: 51, c: 60, a: 17, score: 41 },
  { dish: 'Mole poblano', h: 39, c: 60, a: 16, score: 34 },
];
