import type { DietTag } from './types';

/**
 * What a dish contains, read off its ingredients.
 *
 * These tags were hand-entered and defaulted to empty — and on a dietary check
 * empty means "safe for everyone", which is exactly backwards. A birria with no
 * tags was offered to a vegetarian; an ice cream made with egg yolks was
 * offered to someone avoiding egg. Nothing was wrong with the matching. There
 * was simply nothing to match against.
 *
 * So a dish linked to one of your recipes derives its tags from that recipe's
 * ingredient list. The host can still correct them — the derivation fills the
 * field rather than owning it — but the starting point is the food rather than
 * an empty row.
 *
 * Two rules the patterns follow:
 *
 *   Match the part, not the whole. "Egg yolks" is egg, "beef broth" is meat,
 *   "butter" is dairy. Someone avoiding egg does not mean whole eggs only.
 *
 *   Where it is ambiguous, tag it. A false positive asks the host a question;
 *   a false negative puts the wrong plate in front of someone.
 *
 * Every pattern ends `s?\b` rather than `\b`: without it "pine nut" does not
 * match "Pine Nuts" and "almond" does not match "Almonds", because there is no
 * word boundary between the t and the s. Which is a quiet way to serve a nut to
 * someone avoiding nuts.
 */

const RULES: [DietTag, RegExp][] = [
  // Meat — includes stocks and fats, which is where this usually slips.
  ['meat', /\b(beef|veal|oxtail|chuck|brisket|steak|pork|bacon|pancetta|prosciutto|guanciale|lardo|ham|sausage|chorizo|salami|lamb|mutton|goat|chicken|turkey|duck|quail|rabbit|venison|liver|marrow|suet|tallow|lard|gelatin(e)?|meat|mince|broth|stock|bone)s?\b/i],
  // Fish and shellfish are separate: plenty of people eat one and not the other.
  ['fish', /\b(fish|salmon|tuna|cod|haddock|seabass|sea bass|trout|mackerel|sardine|anchov(y|ies)|herring|bonito|katsuobushi|dashi|colatura|garum|nam pla|fish sauce|roe|caviar)s?\b/i],
  ['shellfish', /\b(shrimp|prawn|crab|lobster|crayfish|langoustine|clam|mussel|oyster|scallop|squid|calamari|octopus|cuttlefish|shellfish)s?\b/i],
  // Dairy — "cream" on its own is dairy; coconut and oat are caught below.
  ['dairy', /\b(milk|cream|butter|ghee|cheese|parmigiano|parmesan|pecorino|mozzarella|ricotta|mascarpone|feta|gouda|cheddar|brie|oaxaca|yogh?urt|labneh|kefir|custard|condensed milk|evaporated milk|dulce de leche|whey|casein)s?\b/i],
  ['egg', /\b(eggs?|egg yolks?|egg whites?|yolks?|albumen|meringue|mayonnaise|aioli)s?\b/i],
  ['honey', /\bhoney(comb)?\b/i],
  ['gluten', /\b(flour|wheat|semolina|farina|spelt|rye|barley|malt|bread|breadcrumbs?|panko|pasta|noodle|lavash|pita|phillo|phyllo|filo|puff pastry|couscous|bulgur|seitan|cracker|biscuit|cake|pastry|dough|baklava)s?\b/i],
  ['nuts', /\b(almond|hazelnut|walnut|pecan|pistachio|cashew|macadamia|brazil nut|pine nut|pignoli|chestnut|marzipan|praline|nutella|frangipane)s?\b/i],
  ['peanut', /\b(peanut|groundnut|arachis)s?\b/i],
  ['sesame', /\b(sesame|tahini|halva|za'?atar|benne)s?\b/i],
  ['soy', /\b(soy|soya|tofu|tempeh|miso|edamame|tamari|hoisin)s?\b/i],
  ['alcohol', /\b(wine|beer|ale|stout|rum|whisk(e)?y|bourbon|brandy|cognac|vodka|gin|tequila|mezcal|sherry|vermouth|marsala|liqueur|amaretto|kahlua|grand marnier|cointreau|sake|mirin)s?\b/i],
];

/**
 * Things that look like a tag and are not.
 *
 * Checked before the rules, because "coconut milk" matching dairy and "peanut
 * butter" matching dairy are the two that would make a host stop trusting any
 * of this.
 */
const NOT: [DietTag, RegExp][] = [
  ['dairy', /\b(coconut|almond|oat|soy|soya|rice|cashew|hemp|peanut|shea|cocoa|nut)\s+(milk|cream|butter|yogh?urt)s?\b/i],
  ['dairy', /\b(buttern?ut squash|butter(head)? lettuce|butter bean|apple butter|body butter)s?\b/i],
  ['meat', /\b(vegetable|veg|mushroom|chicken[- ]style|vegan|beef(less)? style|dashi[- ]free)\s+(broth|stock)s?\b/i],
  ['meat', /\b(beefsteak tomato|chicken of the woods|hearts? of palm)s?\b/i],
  ['gluten', /\b(almond|coconut|rice|corn|chickpea|buckwheat|cassava|tapioca|gluten[- ]free)\s+flour\b/i],
  ['gluten', /\bcorn ?(tortilla|starch|meal)s?\b/i],
  ['nuts', /\b(nutmeg|water chestnut|nutritional yeast|coconut)s?\b/i],
];

/** Every tag a single ingredient line implies. */
export function tagsForIngredient(name: string): DietTag[] {
  const n = (name || '').toLowerCase();
  if (!n.trim()) return [];
  const out = new Set<DietTag>();
  for (const [tag, re] of RULES) {
    if (!re.test(n)) continue;
    // An exception only cancels its own tag, so "coconut milk" is not dairy but
    // "coconut milk and butter" still is.
    const excused = NOT.some(([t, ex]) => t === tag && ex.test(n) && !RULES.find(([rt]) => rt === tag)![1].test(n.replace(ex, '')));
    if (!excused) out.add(tag);
  }
  return [...out];
}

/** Everything a whole ingredient list implies, deduped. */
export function tagsForIngredients(names: string[]): DietTag[] {
  const out = new Set<DietTag>();
  for (const n of names) for (const t of tagsForIngredient(n)) out.add(t);
  return [...out];
}
