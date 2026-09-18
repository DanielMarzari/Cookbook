/**
 * A dinner: the card the guest reads, and the answers that come back.
 *
 * The diet tags are the join between the two halves. A dish declares what it
 * contains; a guest declares what they avoid; the coverage check is the one
 * derivation over both. Nothing about "who can eat what" is authored twice,
 * so the printed card and the warning cannot disagree.
 */

/** What a dish can contain, and what a guest can avoid. */
export const DIET_TAGS = [
  'meat', 'fish', 'shellfish', 'dairy', 'egg', 'honey',
  'gluten', 'nuts', 'peanut', 'sesame', 'soy', 'alcohol',
] as const;
export type DietTag = (typeof DIET_TAGS)[number];

/** How each tag prints on the card, where it prints at all. */
export const DIET_MARK: Partial<Record<DietTag, string>> = {
  dairy: 'D', gluten: 'G', nuts: 'N', peanut: 'P',
  sesame: 'S', egg: 'E', shellfish: 'SF', alcohol: 'A',
};

/**
 * The chips a guest actually taps.
 *
 * Deliberately not the same list as DIET_TAGS: nobody describes themselves as
 * "avoiding honey", they say they're vegan. Each chip expands to the tags it
 * rules out, so one tap carries the three separate facts it implies.
 */
export interface DietChip {
  id: string;
  label: string;
  blocks: DietTag[];
}

export const DIET_CHIPS: DietChip[] = [
  { id: 'vegetarian', label: 'Vegetarian', blocks: ['meat', 'fish', 'shellfish'] },
  { id: 'vegan', label: 'Vegan', blocks: ['meat', 'fish', 'shellfish', 'dairy', 'egg', 'honey'] },
  { id: 'pescatarian', label: 'No meat, fish is fine', blocks: ['meat'] },
  { id: 'dairy', label: 'No dairy', blocks: ['dairy'] },
  { id: 'gluten', label: 'No gluten', blocks: ['gluten'] },
  { id: 'nuts', label: 'No tree nuts', blocks: ['nuts'] },
  { id: 'peanut', label: 'No peanuts', blocks: ['peanut'] },
  { id: 'shellfish', label: 'No shellfish', blocks: ['shellfish'] },
  { id: 'sesame', label: 'No sesame', blocks: ['sesame'] },
  { id: 'soy', label: 'No soy', blocks: ['soy'] },
  { id: 'egg', label: 'No egg', blocks: ['egg'] },
  { id: 'alcohol', label: 'Not drinking', blocks: [] },
];

export interface EventDish {
  id: string;
  event_id: string;
  course_index: number;
  course_name: string | null;
  order_index: number;
  recipe_id: string | null;
  title: string;
  subtitle: string | null;
  contains: DietTag[];
  is_choice: boolean;
}

export interface EventGuest {
  id: string;
  event_id: string;
  name: string;
  rsvp: 'yes' | 'no' | null;
  plus_ones: number;
  avoids: string[];
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DinnerEvent {
  id: string;
  slug: string;
  title: string;
  host: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  directions: string | null;
  seats: number | null;
  expect: string | null;
  dress: string | null;
  bring: string | null;
  style: string;
  stock: string;
  status: 'draft' | 'open' | 'closed';
  created_at: string | null;
  updated_at: string | null;
}

export interface EventCourse {
  index: number;
  name: string;
  dishes: EventDish[];
  /** Two dishes in one course that the guest chooses between. */
  isChoice: boolean;
}

/** Group the flat dish rows into the courses the card is printed in. */
export function toCourses(dishes: EventDish[]): EventCourse[] {
  const byIndex = new Map<number, EventDish[]>();
  for (const d of dishes) {
    if (!byIndex.has(d.course_index)) byIndex.set(d.course_index, []);
    byIndex.get(d.course_index)!.push(d);
  }
  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([index, ds]) => {
      const sorted = ds.sort((a, b) => a.order_index - b.order_index);
      return {
        index,
        name: sorted[0]?.course_name ?? '',
        dishes: sorted,
        // A course of two or more where the guest picks one. Authored, not
        // guessed from the count, so a course that simply has two plates on it
        // is never mistaken for a decision.
        isChoice: sorted.length > 1 && sorted.every((d) => d.is_choice),
      };
    });
}

/** The tags a set of chip ids rules out. */
export function blockedBy(chipIds: string[]): Set<DietTag> {
  const out = new Set<DietTag>();
  for (const id of chipIds) {
    const chip = DIET_CHIPS.find((c) => c.id === id);
    chip?.blocks.forEach((t) => out.add(t));
  }
  return out;
}

export function canEat(dish: EventDish, blocked: Set<DietTag>): boolean {
  return !dish.contains.some((t) => blocked.has(t));
}

export interface Coverage {
  guest: EventGuest;
  /** Per course: how many of its dishes this guest can eat. */
  perCourse: { course: EventCourse; eatable: number; total: number }[];
  hungryAt: number[];
}

/**
 * Who can eat what — the one place this question is answered.
 *
 * A guest who said no still gets a row computed but is filtered out by callers
 * that only care about the table; keeping the derivation total means a late
 * change of mind doesn't need a second code path.
 */
export function coverage(courses: EventCourse[], guests: EventGuest[]): Coverage[] {
  return guests.map((g) => {
    const blocked = blockedBy(g.avoids);
    const perCourse = courses.map((course) => ({
      course,
      eatable: course.dishes.filter((d) => canEat(d, blocked)).length,
      total: course.dishes.length,
    }));
    return {
      guest: g,
      perCourse,
      hungryAt: perCourse.filter((p) => p.eatable === 0).map((p) => p.course.index),
    };
  });
}

/**
 * The sentence the host reads.
 *
 * Counts distinct guests and distinct courses rather than the cells of the
 * grid — "eight courses" of a four-course menu is the kind of wrong that makes
 * someone stop trusting the whole panel.
 */
export function coverageSummary(courses: EventCourse[], rows: Coverage[]): string {
  const coming = rows.filter((r) => r.guest.rsvp === 'yes');
  if (coming.length === 0) return 'No replies yet.';

  const hungry = coming.filter((r) => r.hungryAt.length > 0);
  if (hungry.length === 0) return 'Everyone coming has something at every course.';

  const badCourses = new Set<number>();
  hungry.forEach((r) => r.hungryAt.forEach((i) => badCourses.add(i)));

  const who = hungry.length === 1 ? `${hungry[0].guest.name} has` : `${hungry.length} guests have`;
  const where =
    badCourses.size === 1
      ? `nothing at ${courses.find((c) => c.index === [...badCourses][0])?.name.toLowerCase() || 'one course'}`
      : `nothing at ${badCourses.size} of the ${courses.length} courses`;

  // A choice point that fails is worse than a dish that fails: the card makes
  // it look like the guest was offered something. Only say it when it's true.
  const choices = courses.filter((c) => c.isChoice);
  const dead = choices.filter((c) => badCourses.has(c.index));
  const tail =
    dead.length && dead.length === choices.length && choices.length > 1
      ? ' Every choice on the card is between dishes that fail the same way, so it offers an option that is not one.'
      : dead.length
        ? ' One of those is a choice, which reads on the card as an option and is not.'
        : '';

  return `${who} ${where}.${tail}`;
}

/** The marks printed after a dish name, e.g. "D G N". */
export function marksFor(dish: EventDish): string {
  return dish.contains
    .map((t) => DIET_MARK[t])
    .filter(Boolean)
    .join(' ');
}
