// Real Harmony / Complement / Affinity readings for celebrated dishes (plus a few
// daring-but-good combos), measured by the Lab itself with the score each earns
// under the current model (scripts/derive-dish-score.mjs writes these). Score is
// stored, not recomputed client-side, since the model reads pair-level features
// the client doesn't carry.
export type Exemplar = { dish: string; h: number; c: number; a: number; score: number };

export const DISH_EXEMPLARS: Exemplar[] = [
  { dish: 'Cacio e pepe', h: 60, c: 77, a: 12, score: 100 },
  { dish: 'Guacamole', h: 62, c: 70, a: 27, score: 93 },
  { dish: 'Coffee & cardamom', h: 34, c: 59, a: 38, score: 87 },
  { dish: 'Ratatouille', h: 62, c: 45, a: 15, score: 84 },
  { dish: 'Bouillabaisse', h: 48, c: 62, a: 14, score: 84 },
  { dish: 'Strawberry balsamic', h: 67, c: 71, a: 27, score: 83 },
  { dish: 'Beef bourguignon', h: 55, c: 48, a: 20, score: 81 },
  { dish: 'Coq au vin', h: 57, c: 36, a: 19, score: 76 },
  { dish: 'Pesto', h: 68, c: 49, a: 15, score: 76 },
  { dish: 'Risotto milanese', h: 55, c: 53, a: 30, score: 75 },
  { dish: 'Pad thai', h: 51, c: 60, a: 17, score: 74 },
  { dish: 'Massaman curry', h: 61, c: 59, a: 25, score: 74 },
  { dish: 'Miso caramel', h: 4, c: 95, a: 0, score: 73 },
  { dish: 'Dark chocolate chili', h: 37, c: 78, a: 0, score: 71 },
  { dish: 'Tomato & stone-fruit salad', h: 61, c: 47, a: 26, score: 70 },
  { dish: 'Mole poblano', h: 47, c: 60, a: 16, score: 68 },
];
