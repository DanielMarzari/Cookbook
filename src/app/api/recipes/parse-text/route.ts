import { NextResponse } from 'next/server';
import { titleCaseIngredient } from '@/lib/utils';

// Same unit patterns as import-url
const UNIT_PATTERNS = [
  'tablespoons?', 'teaspoons?', 'tbsp', 'tsp',
  'cups?', 'ounces?', 'oz', 'pounds?', 'lbs?',
  'grams?', 'kilograms?', 'kg', 'milliliters?', 'ml', 'liters?', 'l',
  'g',
  'pinch(?:es)?', 'dash(?:es)?', 'cloves?', 'slices?',
  'pieces?', 'cans?', 'packages?', 'sticks?', 'bunches?',
  'sprigs?', 'heads?', 'stalks?', 'bags?', 'large', 'medium', 'small',
];
const UNIT_REGEX_STR = UNIT_PATTERNS.join('|');

// Common food/ingredient words to help identify real ingredient lines
const FOOD_WORDS = /\b(salt|pepper|sugar|flour|butter|oil|olive|vinegar|garlic|onion|egg|eggs|milk|cream|water|stock|broth|cheese|bread|rice|pasta|chicken|beef|pork|fish|salmon|shrimp|lemon|lime|orange|tomato|tomatoes|potato|potatoes|carrot|carrots|celery|parsley|basil|thyme|rosemary|oregano|cilantro|mint|dill|cumin|cinnamon|paprika|fennel|rue|coriander|ginger|nutmeg|vanilla|chocolate|honey|maple|soy|sauce|wine|beer|yogurt|lettuce|spinach|kale|mushroom|mushrooms|bell|jalapeño|chili|chilli|avocado|cucumber|zucchini|squash|pumpkin|bean|beans|lentil|lentils|chickpea|chickpeas|tofu|tempeh|almond|almonds|walnut|walnuts|pecan|pecans|cashew|cashews|peanut|peanuts|pine\s+nuts|sesame|olives?|capers?|anchov|bacon|ham|sausage|corn|peas|asparagus|broccoli|cauliflower|cabbage|beet|beets|radish|turnip|yam|coconut|banana|apple|pear|berry|berries|strawberry|blueberry|raspberry|mango|peach|plum|cherry|grape|fig|date|raisin|cranberry|apricot|pomegranate|goat|feta|mozzarella|parmesan|cheddar|ricotta|mascarpone|brie|gruyere|provolone|manchego)\b/i;

function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase().replace(/\.$/, '');
  const map: Record<string, string> = {
    cup: 'cup', cups: 'cup',
    tablespoon: 'tbsp', tablespoons: 'tbsp', tbsp: 'tbsp',
    teaspoon: 'tsp', teaspoons: 'tsp', tsp: 'tsp',
    ounce: 'oz', ounces: 'oz', oz: 'oz',
    pound: 'lb', pounds: 'lb', lb: 'lb', lbs: 'lb',
    gram: 'g', grams: 'g', g: 'g',
    kilogram: 'kg', kilograms: 'kg', kg: 'kg',
    milliliter: 'ml', milliliters: 'ml', ml: 'ml',
    liter: 'l', liters: 'l', l: 'l',
    clove: 'clove', cloves: 'clove',
    slice: 'slice', slices: 'slice',
    piece: 'piece', pieces: 'piece',
    can: 'can', cans: 'can',
    stick: 'stick', sticks: 'stick',
    pinch: 'pinch', pinches: 'pinch',
    dash: 'dash', dashes: 'dash',
    sprig: 'sprig', sprigs: 'sprig',
    bunch: 'bunch', bunches: 'bunch',
    head: 'head', heads: 'head',
    stalk: 'stalk', stalks: 'stalk',
    package: 'package', packages: 'package',
    bag: 'bag', bags: 'bag',
  };
  return map[u] || u;
}

// Unicode fraction map
const FRACTION_MAP: Record<string, number> = {
  '½': 0.5, '⅓': 1/3, '⅔': 2/3, '¼': 0.25, '¾': 0.75,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8, '⅙': 1/6,
  '⅚': 5/6, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
};

function resolveUnicodeFractions(text: string): string {
  let result = text;
  for (const [frac, val] of Object.entries(FRACTION_MAP)) {
    result = result.replace(new RegExp(`(\\d+)\\s*${frac}`, 'g'), (_, whole) => String(parseFloat(whole) + val));
    result = result.replace(new RegExp(frac, 'g'), String(val));
  }
  return result;
}

function parseQuantity(raw: string): number {
  const s = raw.trim();
  if (s.includes('/')) {
    const parts = s.split(/\s+/);
    let total = 0;
    for (const part of parts) {
      if (part.includes('/')) {
        const [num, den] = part.split('/');
        total += parseInt(num) / parseInt(den);
      } else {
        total += parseFloat(part);
      }
    }
    return total || 1;
  }
  return parseFloat(s) || 1;
}

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  is_header?: boolean;
}

// ===== OCR NOISE FILTERING =====

/**
 * Detect OCR garbage: garbled fragments, random punctuation, meaningless short text.
 * Examples: "PE Ad Alre O4 I", "; Scie a a", "B- -—", "| Gs Er."
 */
function isGarbageLine(line: string): boolean {
  const trimmed = line.trim();

  // Very short lines (< 4 chars) are almost always noise
  if (trimmed.length < 4) return true;

  // Lines that are mostly non-alphabetic characters
  const alphaChars = trimmed.replace(/[^a-zA-Z]/g, '');
  if (alphaChars.length < trimmed.length * 0.4) return true;

  // Lines with too many single-char "words" (OCR fragments)
  const words = trimmed.split(/\s+/);
  const singleCharWords = words.filter(w => w.replace(/[^a-zA-Z]/g, '').length <= 1);
  if (words.length >= 3 && singleCharWords.length > words.length * 0.5) return true;

  // Lines that are just punctuation, dashes, pipes, etc.
  if (/^[\-–—=_|;:.,!?\s*#@&^~`'""'']+$/.test(trimmed)) return true;

  // Lines with excessive uppercase single letters separated by spaces (OCR misreads)
  if (/^([A-Z]\s+){3,}/.test(trimmed)) return true;

  // Page numbers
  if (/^\d{1,3}\s*$/.test(trimmed)) return true;

  // Short-ish lines with many short fragments that don't form real words
  // But exclude lines that start with a number/fraction (could be ingredients like "1½ tbsp mint")
  if (trimmed.length < 25 && words.length >= 2 && !/^(\d|½|⅓|⅔|¼|¾|⅕|⅛|⅜|⅝|⅞)/.test(trimmed)) {
    const avgWordLen = alphaChars.length / words.length;
    if (avgWordLen < 2.8) return true;
  }

  // Lines starting with pipe, exclamation, or other OCR artifacts followed by short fragments
  if (/^[|!;]/.test(trimmed)) {
    // Only keep if the rest looks like real content (has food words or cooking verbs)
    const rest = trimmed.replace(/^[|!;]\s*/, '');
    if (!FOOD_WORDS.test(rest) && !/\b(preheat|mix|stir|add|combine|cook|bake|whisk|fold|pour|heat|simmer|boil|fry|roast|grill|chop|slice|blend|serve)\b/i.test(rest)) {
      return true;
    }
  }

  return false;
}

/**
 * Detect narrative/prose paragraphs — story text, descriptions, historical context.
 * These are long sentences without ingredient-like patterns.
 */
function isNarrativeProse(line: string): boolean {
  const trimmed = line.trim();

  // Must be reasonably long to be prose (short lines could be instructions)
  if (trimmed.length < 60) return false;

  // Count sentence-like features
  const hasMultipleSentences = (trimmed.match(/[.!?]\s+[A-Z]/g) || []).length >= 1;
  const wordCount = trimmed.split(/\s+/).length;

  // Prose indicators: long text with multiple sentences, no ingredient patterns
  if (hasMultipleSentences && wordCount > 15) {
    // But not if it contains cooking verbs (could be an instruction paragraph)
    const hasCookingVerbs = /\b(preheat|mix|stir|add|combine|cook|bake|whisk|fold|pour|heat|sauté|saute|simmer|boil|fry|roast|grill|dice|chop|slice|blend|knead|let\s+rest|set\s+aside|bring|reduce|season|serve|place|remove|transfer|cover|cool|drain|toss|drizzle|sprinkle|mash|puree|marinate)\b/i.test(trimmed);
    if (!hasCookingVerbs) return true;
  }

  // Story-like patterns: past tense narrative, historical references
  const narrativeIndicators = /\b(century|centuries|ancient|historical|traditionally|according to|wrote|written|believed|discovered|originated|popular|famous|known as|called|named|story|tale|legend|history|culture|region|country|traveler|author|book|chapter|page)\b/i;
  if (wordCount > 12 && narrativeIndicators.test(trimmed)) return true;

  return false;
}

// ===== METADATA PARSING =====

interface RecipeMetadata {
  servings?: number;
  servingsUnit?: string; // "cups", "servings", etc.
  cookTime?: number;
  prepTime?: number;
  totalTime?: number;
}

/**
 * Parse metadata lines like:
 * "MAKES ABOUT 2 CUPS COOK TIME: 5 MINUTES"
 * "Serves 4 | Prep: 15 min | Cook: 30 min"
 * "Yield: 6 servings"
 */
function parseMetadataLine(line: string): RecipeMetadata | null {
  const trimmed = line.trim();
  const meta: RecipeMetadata = {};
  let foundSomething = false;

  // Servings / Makes / Yield patterns
  const servingsPatterns = [
    /(?:makes?\s+(?:about\s+)?|yields?\s*:?\s*|serves?\s*:?\s*|servings?\s*:?\s*|portions?\s*:?\s*)(\d+)\s*(cups?|servings?|portions?|pieces?|dozen|batch(?:es)?|loaves?|rolls?)?/gi,
  ];
  for (const pattern of servingsPatterns) {
    const match = pattern.exec(trimmed);
    if (match) {
      meta.servings = parseInt(match[1]) || undefined;
      meta.servingsUnit = match[2]?.toLowerCase();
      foundSomething = true;
    }
  }

  // Cook time patterns
  const cookTimePatterns = [
    /cook(?:ing)?\s*time\s*:?\s*(\d+)\s*(?:to\s*\d+\s*)?(?:minutes?|mins?|hours?|hrs?)/gi,
    /cook\s*:?\s*(\d+)\s*(?:minutes?|mins?|hours?|hrs?)/gi,
  ];
  for (const pattern of cookTimePatterns) {
    const match = pattern.exec(trimmed);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[0].toLowerCase();
      meta.cookTime = (unit.includes('hour') || unit.includes('hr')) ? num * 60 : num;
      foundSomething = true;
    }
  }

  // Prep time patterns
  const prepTimePatterns = [
    /prep(?:aration)?\s*time\s*:?\s*(\d+)\s*(?:to\s*\d+\s*)?(?:minutes?|mins?|hours?|hrs?)/gi,
    /prep\s*:?\s*(\d+)\s*(?:minutes?|mins?|hours?|hrs?)/gi,
  ];
  for (const pattern of prepTimePatterns) {
    const match = pattern.exec(trimmed);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[0].toLowerCase();
      meta.prepTime = (unit.includes('hour') || unit.includes('hr')) ? num * 60 : num;
      foundSomething = true;
    }
  }

  // Total time patterns
  const totalTimePatterns = [
    /total\s*time\s*:?\s*(\d+)\s*(?:to\s*\d+\s*)?(?:minutes?|mins?|hours?|hrs?)/gi,
    /time\s*:?\s*(\d+)\s*(?:minutes?|mins?|hours?|hrs?)/gi,
  ];
  for (const pattern of totalTimePatterns) {
    const match = pattern.exec(trimmed);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[0].toLowerCase();
      meta.totalTime = (unit.includes('hour') || unit.includes('hr')) ? num * 60 : num;
      foundSomething = true;
    }
  }

  return foundSomething ? meta : null;
}

/**
 * Check if a whole line is primarily a metadata line (not an ingredient).
 * Lines like "MAKES ABOUT 2 CUPS COOK TIME: 5 MINUTES" should not be ingredients.
 */
function isMetadataLine(line: string): boolean {
  const trimmed = line.trim().toUpperCase();
  return /\b(MAKES?\s|YIELDS?\s|SERVES?\s|SERVINGS?\s|COOK\s*TIME|PREP\s*TIME|TOTAL\s*TIME|ACTIVE\s*TIME|INACTIVE\s*TIME)\b/.test(trimmed);
}

// ===== INGREDIENT & INSTRUCTION DETECTION =====

function parseIngredientLine(text: string): ParsedIngredient {
  let cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return { quantity: 1, unit: 'piece', name: text };

  cleaned = resolveUnicodeFractions(cleaned);

  // Remove leading bullet, dash, dot
  cleaned = cleaned.replace(/^[\-–—•·*]\s*/, '').trim();

  // Extract parentheticals as notes
  const noteParts: string[] = [];
  {
    let parenResult = '';
    let i = 0;
    while (i < cleaned.length) {
      if (cleaned[i] === '(') {
        let depth = 1;
        let j = i + 1;
        while (j < cleaned.length && depth > 0) {
          if (cleaned[j] === '(') depth++;
          else if (cleaned[j] === ')') depth--;
          j++;
        }
        const content = cleaned.slice(i + 1, j - 1).trim();
        if (content) noteParts.push(`(${content})`);
        parenResult += ' ';
        i = j;
      } else {
        parenResult += cleaned[i];
        i++;
      }
    }
    cleaned = parenResult.replace(/\s+/g, ' ').trim();
  }

  // Handle commas: separate notes from name parts
  const commaParts = cleaned.split(/,\s*/);
  if (commaParts.length > 1) {
    const noteKeywords = /^(at |room temp|softened|melted|divided|chopped|diced|minced|to taste|optional|packed|sifted|plus |for |thinly |finely |roughly |coarsely |freshly |lightly |well |cut |peeled|trimmed|seeded|deveined|thawed|drained|rinsed|warmed|cooled|chilled|beaten|whisked|grated|shredded|sliced|cubed|julienned|halved|quartered|crushed|crumbled|torn|toasted|roasted|approx)/i;
    const mainParts: string[] = [];
    for (const part of commaParts) {
      if (noteKeywords.test(part.trim())) {
        noteParts.push(part.trim());
      } else {
        mainParts.push(part.trim());
      }
    }
    cleaned = mainParts.join(' ').replace(/\s+/g, ' ').trim();
  }

  // Main regex: qty + optional unit + name
  const mainRegex = new RegExp(
    `^([\\d]+\\s+[\\d]+\\/[\\d]+|[\\d]+\\/[\\d]+|[\\d]+\\.\\d+|[\\d]+)\\s*(?:(${UNIT_REGEX_STR})\\.?\\s+)?(.+)$`,
    'i'
  );

  const match = cleaned.match(mainRegex);
  if (match) {
    const rawQty = match[1];
    const rawUnit = match[2] || '';
    let name = (match[3] || cleaned).trim();
    const quantity = parseQuantity(rawQty);

    let unit = rawUnit;
    if (/^(large|medium|small)$/i.test(rawUnit)) {
      name = rawUnit.toLowerCase() + ' ' + name;
      unit = 'piece';
    }

    const normalizedUnit = unit ? normalizeUnit(unit) : 'piece';
    name = name.replace(/^of\s+/i, '').replace(/\.\s*$/, '').trim();
    const notes = noteParts.length > 0 ? noteParts.join(', ') : undefined;
    return { quantity, unit: normalizedUnit, name: titleCaseIngredient(name), notes };
  }

  cleaned = cleaned.replace(/^of\s+/i, '').trim();
  const notes = noteParts.length > 0 ? noteParts.join(', ') : undefined;
  return { quantity: 1, unit: 'piece', name: titleCaseIngredient(cleaned), notes };
}

/**
 * Strong ingredient check: line starts with number/fraction AND has a recognized unit or food word.
 * This is stricter than the old version which just checked for a leading number.
 */
function looksLikeIngredient(line: string): boolean {
  const trimmed = line.replace(/^[\-–—•·*]\s*/, '').trim();
  const resolved = resolveUnicodeFractions(trimmed);

  // Must start with a number or fraction
  if (!/^(\d|½|⅓|⅔|¼|¾|⅕|⅛|⅜|⅝|⅞)/.test(trimmed)) return false;

  // Check for a recognized unit after the number
  const unitCheck = new RegExp(`^[\\d./½⅓⅔¼¾⅕⅛⅜⅝⅞\\s]+(?:${UNIT_REGEX_STR})\\b`, 'i');
  if (unitCheck.test(resolved)) return true;

  // Check for food words even without a unit (e.g., "2 eggs", "3 tomatoes")
  if (FOOD_WORDS.test(trimmed)) return true;

  // Number followed by a word that's at least 3 chars (not OCR garbage like "2 Gs" or "4 I")
  const afterNum = resolved.replace(/^[\d./\s]+/, '').trim();
  if (afterNum.length >= 3 && /^[a-zA-Z]/.test(afterNum)) {
    // Additional check: the remaining text should look like real words
    const words = afterNum.split(/\s+/);
    const realWords = words.filter(w => w.length >= 3 || /^(of|or|to|a|an)$/i.test(w));
    if (realWords.length >= 1) return true;
  }

  return false;
}

/**
 * Check if a line looks like an ingredient, with even stricter criteria.
 * Used in the "unknown" section where we need high confidence.
 */
function strongIngredientMatch(line: string): boolean {
  const trimmed = line.replace(/^[\-–—•·*]\s*/, '').trim();
  const resolved = resolveUnicodeFractions(trimmed);

  // Must start with a number
  if (!/^(\d|½|⅓|⅔|¼|¾|⅕|⅛|⅜|⅝|⅞)/.test(trimmed)) return false;

  // Must have EITHER a recognized unit OR a known food word
  const unitCheck = new RegExp(`^[\\d./½⅓⅔¼¾⅕⅛⅜⅝⅞\\s]+(?:${UNIT_REGEX_STR})\\b`, 'i');
  if (unitCheck.test(resolved)) return true;
  if (FOOD_WORDS.test(trimmed)) return true;

  return false;
}

// Detect if a line looks like an instruction step
function looksLikeInstruction(line: string): boolean {
  const trimmed = line.trim();
  // Starts with step number like "1.", "1)", "Step 1"
  if (/^(step\s*)?\d+[\.\):\-]\s*/i.test(trimmed)) return true;
  // Contains cooking verbs
  if (/\b(preheat|mix|stir|add|combine|cook|bake|whisk|fold|pour|heat|sauté|saute|simmer|boil|fry|roast|grill|dice|chop|slice|blend|knead|let\s+rest|set\s+aside|bring|reduce|season|serve|place|remove|transfer|cover|cool|drain|toss|drizzle|sprinkle|mash|puree|marinate|arrange|spread|brush|coat|deep.fry|deglaze|flambé|flambe|julienne|mince|sear|steam|blanch|braise|broil|caramelize|cream|ferment|glaze|infuse|pickle|poach|proof|scald|smoke|temper|whip|zest)\b/i.test(trimmed)) return true;
  return false;
}

// Detect section header patterns
function looksLikeSectionHeader(line: string): boolean {
  const trimmed = line.trim();
  // "For the X:", "X:", all caps short line, or bold markers
  if (/^(for\s+the\s+|for\s+)/i.test(trimmed) && trimmed.length < 50) return true;
  if (/^[A-Z][A-Z\s&]+:?\s*$/.test(trimmed) && trimmed.length < 40) return true;
  if (/^#+\s+/.test(trimmed)) return true; // Markdown headers
  if (/^\*\*.*\*\*$/.test(trimmed)) return true; // Bold markdown
  return false;
}

// Extract time info from instructions
function extractTimesFromInstructions(instructions: string[]): { prep: number; cook: number } {
  let totalMinutes = 0;
  const timeRegex = /(\d+)\s*(?:to\s*\d+\s*)?(?:minutes?|mins?|hours?|hrs?)/gi;

  for (const text of instructions) {
    let match;
    while ((match = timeRegex.exec(text)) !== null) {
      const num = parseInt(match[1]);
      const unit = match[0].toLowerCase();
      if (unit.includes('hour') || unit.includes('hr')) {
        totalMinutes += num * 60;
      } else {
        totalMinutes += num;
      }
    }
  }

  // Split: first 30% is prep, rest is cook (rough heuristic)
  if (totalMinutes > 0) {
    const prep = Math.round(totalMinutes * 0.3);
    const cook = totalMinutes - prep;
    return { prep, cook };
  }
  return { prep: 15, cook: 30 };
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    // Split into lines, filter empty
    const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (rawLines.length === 0) {
      return NextResponse.json({ error: 'No content found in text' }, { status: 400 });
    }

    // Phase 0: Pre-filter — remove garbage lines and narrative prose
    const cleanedLines: string[] = [];
    for (const line of rawLines) {
      if (isGarbageLine(line)) continue;
      if (isNarrativeProse(line)) continue;
      cleanedLines.push(line);
    }

    if (cleanedLines.length === 0) {
      return NextResponse.json({ error: 'No usable recipe content found in text' }, { status: 400 });
    }

    // Phase 1: Detect title (first non-ingredient, non-instruction, non-metadata line)
    let title = '';
    let startIdx = 0;

    for (let i = 0; i < Math.min(5, cleanedLines.length); i++) {
      const line = cleanedLines[i];
      // Skip hashtag-only lines, @mentions, or very short lines
      if (/^[#@]/.test(line) || line.length < 3) continue;
      // Skip "recipe" label
      if (/^recipe:?\s*$/i.test(line)) continue;
      // Skip metadata lines
      if (isMetadataLine(line)) continue;

      // This is likely the title
      if (!looksLikeIngredient(line) && !looksLikeInstruction(line)) {
        title = line.replace(/^(recipe:?\s*)/i, '').replace(/[🍕🍳🥘🍲🍝🍜🍛🍚🥗🥙🌮🌯🥪🫔🧆🍔🍟🍕🌭🥚🥓🥞🧇🥐🍞🥖🥨🧀🥩🍗🍖🍠🥟🥠🥡🍱🍣🍤🍙🍘🍥🥮🍡🍧🍦🧁🍩🍪🎂🍰🥧🍮🍭🍬🍫🍿🍩🧂🥫🍯]+/g, '').trim();
        startIdx = i + 1;
        break;
      }
    }

    if (!title && cleanedLines.length > 0) {
      title = cleanedLines[0].replace(/[^\w\s\-']/g, '').trim();
      startIdx = 1;
    }

    // Phase 2: Parse metadata from all lines first (collect times, servings)
    const metadata: RecipeMetadata = {};
    const metadataLineIndices = new Set<number>();

    for (let i = startIdx; i < cleanedLines.length; i++) {
      const line = cleanedLines[i];
      if (isMetadataLine(line)) {
        const meta = parseMetadataLine(line);
        if (meta) {
          if (meta.servings) metadata.servings = meta.servings;
          if (meta.servingsUnit) metadata.servingsUnit = meta.servingsUnit;
          if (meta.cookTime) metadata.cookTime = meta.cookTime;
          if (meta.prepTime) metadata.prepTime = meta.prepTime;
          if (meta.totalTime) metadata.totalTime = meta.totalTime;
          metadataLineIndices.add(i);
        }
      }
    }

    // Phase 3: Classify remaining lines
    const ingredients: ParsedIngredient[] = [];
    const instructionTexts: string[] = [];
    let currentSection: 'unknown' | 'ingredients' | 'instructions' = 'unknown';
    let servings = metadata.servings || 4;

    // Look for explicit section headers
    const ingredientHeaderRegex = /^(ingredients?|what you.?ll need|you.?ll need|shopping list)\s*:?\s*$/i;
    const instructionHeaderRegex = /^(instructions?|directions?|method|steps?|how to make|preparation|procedure)\s*:?\s*$/i;
    const servingsRegex = /(?:serves?|servings?|makes?|yield|portions?)\s*:?\s*(\d+)/i;

    for (let i = startIdx; i < cleanedLines.length; i++) {
      // Skip lines already consumed as metadata
      if (metadataLineIndices.has(i)) continue;

      const line = cleanedLines[i];

      // Check for servings info (inline, not already caught by metadata parser)
      const servingsMatch = line.match(servingsRegex);
      if (servingsMatch && !metadata.servings) {
        servings = parseInt(servingsMatch[1]) || 4;
        // If this line is ONLY servings info, skip it
        if (line.trim().length < 30) continue;
      }

      // Skip hashtag lines (Instagram)
      if (/^#\w/.test(line) && !line.startsWith('# ')) continue;
      // Skip emoji-only lines
      if (/^[\p{Emoji}\s]+$/u.test(line) && !/\w/.test(line)) continue;

      // Check for section headers
      if (ingredientHeaderRegex.test(line)) {
        currentSection = 'ingredients';
        continue;
      }
      if (instructionHeaderRegex.test(line)) {
        currentSection = 'instructions';
        continue;
      }

      // Section sub-headers (e.g., "For the dough:")
      if (currentSection === 'ingredients' && looksLikeSectionHeader(line)) {
        const headerName = line.replace(/^(for\s+the\s+|for\s+|#+\s+|\*\*|\*)/i, '').replace(/[:*]+$/, '').trim();
        if (headerName) {
          ingredients.push({ name: headerName, quantity: 0, unit: '', is_header: true });
        }
        continue;
      }

      // Classify by context and content
      if (currentSection === 'ingredients') {
        if (looksLikeInstruction(line) && !looksLikeIngredient(line) && line.length > 40) {
          // Switched to instructions
          currentSection = 'instructions';
          instructionTexts.push(line.replace(/^(step\s*)?\d+[\.\):\-]\s*/i, '').trim());
        } else if (looksLikeIngredient(line)) {
          const parsed = parseIngredientLine(line);
          if (parsed.name) ingredients.push(parsed);
        } else if (line.length < 50 && FOOD_WORDS.test(line)) {
          // Short line with a food word but no quantity — could be "goat cheese and bread"
          const parsed = parseIngredientLine(line);
          if (parsed.name) ingredients.push(parsed);
        }
        // Otherwise skip — don't add random text as ingredients
      } else if (currentSection === 'instructions') {
        const cleanedStep = line.replace(/^(step\s*)?\d+[\.\):\-]\s*/i, '').trim();
        if (cleanedStep && cleanedStep.length > 5) instructionTexts.push(cleanedStep);
      } else {
        // Unknown section — auto-detect with STRICT criteria
        if (strongIngredientMatch(line)) {
          currentSection = 'ingredients';
          const parsed = parseIngredientLine(line);
          if (parsed.name) ingredients.push(parsed);
        } else if (looksLikeInstruction(line)) {
          currentSection = 'instructions';
          const cleanedStep = line.replace(/^(step\s*)?\d+[\.\):\-]\s*/i, '').trim();
          if (cleanedStep) instructionTexts.push(cleanedStep);
        } else if (line.length > 80) {
          // Long line is probably an instruction paragraph
          currentSection = 'instructions';
          instructionTexts.push(line);
        } else if (ingredientHeaderRegex.test(line.replace(/:?\s*$/, ''))) {
          currentSection = 'ingredients';
        } else if (instructionHeaderRegex.test(line.replace(/:?\s*$/, ''))) {
          currentSection = 'instructions';
        }
        // Otherwise: skip entirely. Don't guess.
      }
    }

    // Phase 4: Extract times — prefer metadata, fall back to instruction analysis
    let prepTime = metadata.prepTime || 0;
    let cookTime = metadata.cookTime || 0;

    if (metadata.totalTime && !prepTime && !cookTime) {
      prepTime = Math.round(metadata.totalTime * 0.3);
      cookTime = metadata.totalTime - prepTime;
    }

    if (!prepTime && !cookTime) {
      const times = extractTimesFromInstructions(instructionTexts);
      prepTime = times.prep;
      cookTime = times.cook;
    }

    // Phase 5: Format instructions
    const instructions = instructionTexts.map((text, idx) => ({
      step_number: idx + 1,
      text,
    }));

    // Phase 6: Format ingredients for the form
    const formIngredients = ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
      notes: ing.notes || '',
      ...(ing.is_header ? { is_header: true } : {}),
    }));

    return NextResponse.json({
      title: title || 'Untitled Recipe',
      description: '',
      cuisine_type: 'Other',
      difficulty: 'medium',
      prep_time_minutes: prepTime,
      cook_time_minutes: cookTime,
      servings,
      ingredients: formIngredients,
      instructions,
      source_type: 'pasted',
    });
  } catch (error) {
    console.error('Parse text error:', error);
    return NextResponse.json(
      { error: 'Failed to parse recipe text' },
      { status: 500 }
    );
  }
}
