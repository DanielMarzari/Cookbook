import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

interface ParsedRecipe {
  title: string;
  description?: string;
  image?: string;
  ingredients: ParsedIngredient[];
  instructions: Array<{ text: string }>;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings?: number;
  yield?: string;
}

async function fetchRecipe(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  return response.text();
}

// Find Recipe object in JSON-LD, handling @graph arrays and nested structures
function findRecipeInJsonLd(obj: any): any | null {
  if (!obj) return null;

  // Direct Recipe type
  if (obj['@type'] === 'Recipe') return obj;

  // Array of types (e.g. ["Recipe"])
  if (Array.isArray(obj['@type']) && obj['@type'].includes('Recipe')) return obj;

  // @graph array (very common on WordPress recipe sites)
  if (obj['@graph'] && Array.isArray(obj['@graph'])) {
    for (const item of obj['@graph']) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
  }

  // Top-level array
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
  }

  return null;
}

function parseJsonLd(html: string): Partial<ParsedRecipe> | null {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  for (let i = 0; i < scripts.length; i++) {
    try {
      const json = JSON.parse($(scripts[i]).html() || '{}');
      const recipe = findRecipeInJsonLd(json);

      if (recipe) {
        // Parse image - can be string, object, or array
        let image = '';
        if (typeof recipe.image === 'string') {
          image = recipe.image;
        } else if (Array.isArray(recipe.image)) {
          image = typeof recipe.image[0] === 'string' ? recipe.image[0] : recipe.image[0]?.url || '';
        } else if (recipe.image?.url) {
          image = recipe.image.url;
        }

        // Parse instructions - can be strings, objects, or sections
        // Sections become header markers like "--- For the Dough ---"
        const instructions: Array<{ text: string }> = [];
        const rawInstructions = recipe.recipeInstructions || [];
        for (const inst of rawInstructions) {
          if (typeof inst === 'string') {
            instructions.push({ text: inst });
          } else if (inst['@type'] === 'HowToStep') {
            instructions.push({ text: inst.text || '' });
          } else if (inst['@type'] === 'HowToSection') {
            // Add section name as a header step
            if (inst.name) {
              instructions.push({ text: `--- ${inst.name} ---` });
            }
            if (inst.itemListElement) {
              for (const step of inst.itemListElement) {
                instructions.push({ text: typeof step === 'string' ? step : step.text || '' });
              }
            }
          }
        }

        // Parse ingredient groups - some recipes have sections like "For the Dough", "For the Filling"
        // recipeIngredient is usually a flat array, but ingredient text might contain group headers
        const ingredientGroups: ParsedIngredient[] = [];
        const rawIngredients = recipe.recipeIngredient || [];
        for (const ing of rawIngredients) {
          if (typeof ing !== 'string') continue;
          const trimmed = ing.trim();
          // Detect group headers: "For the dough:", "Filling:", etc.
          if (/^(for\s+(the\s+)?|the\s+)/i.test(trimmed) && trimmed.length < 60 && !trimmed.match(/^\d/)) {
            ingredientGroups.push({ name: `--- ${trimmed.replace(/:$/, '')} ---`, quantity: 0, unit: '', notes: undefined });
          } else {
            ingredientGroups.push(parseIngredient(trimmed));
          }
        }

        return {
          title: recipe.name || '',
          description: recipe.description || '',
          image,
          servings: parseInt(recipe.recipeYield?.[0] || recipe.recipeYield) || undefined,
          yield: Array.isArray(recipe.recipeYield) ? recipe.recipeYield[0] : recipe.recipeYield,
          prepTime: parseDuration(recipe.prepTime),
          cookTime: parseDuration(recipe.cookTime),
          totalTime: parseDuration(recipe.totalTime),
          ingredients: ingredientGroups,
          instructions,
        };
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

// Parse ISO 8601 duration (PT1H30M, PT45M, PT2H, P1DT2H, etc.)
function parseDuration(duration: string | undefined): number | undefined {
  if (!duration || typeof duration !== 'string') return undefined;

  // Must start with P to be valid ISO 8601
  if (!duration.startsWith('P')) return undefined;

  let minutes = 0;
  const days = duration.match(/(\d+)D/);
  const hours = duration.match(/(\d+)H/);
  const mins = duration.match(/(\d+)M/);
  // Ignore seconds

  if (days) minutes += parseInt(days[1]) * 24 * 60;
  if (hours) minutes += parseInt(hours[1]) * 60;
  if (mins) minutes += parseInt(mins[1]);

  // Sanity check: cap at 7 days (10080 minutes). Anything beyond is likely a parsing error.
  if (minutes > 10080) return undefined;

  return minutes || undefined;
}

// Unicode fraction map
const UNICODE_FRACTIONS: Record<string, number> = {
  '½': 0.5, '⅓': 1/3, '⅔': 2/3, '¼': 0.25, '¾': 0.75,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8,
  '⅙': 1/6, '⅚': 5/6, '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
};

// Convert Unicode fractions to decimal in a string
function resolveUnicodeFractions(text: string): string {
  let result = text;
  for (const [frac, val] of Object.entries(UNICODE_FRACTIONS)) {
    // "1½" or "1 ½" → combined decimal
    result = result.replace(new RegExp(`(\\d+)\\s*${frac}`, 'g'), (_, whole) => {
      return String(parseFloat(whole) + val);
    });
    // standalone "½" → "0.5"
    result = result.replace(new RegExp(frac, 'g'), String(val));
  }
  return result;
}

// Parse a raw quantity string (handles "1 1/2", "1/2", "0.75", "1.5", etc.)
function parseQuantity(raw: string): number {
  const s = raw.trim();
  if (s.includes('/')) {
    // Could be "1 1/2" or just "1/2"
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

// Known unit patterns (order matters: longer/more-specific first)
const UNIT_PATTERNS = [
  'tablespoons?', 'teaspoons?', 'tbsp', 'tsp',
  'cups?', 'ounces?', 'oz', 'pounds?', 'lbs?',
  'grams?', 'kilograms?', 'kg', 'milliliters?', 'ml', 'liters?',
  'pinch(?:es)?', 'dash(?:es)?', 'cloves?', 'slices?',
  'pieces?', 'cans?', 'packages?', 'sticks?', 'bunches?',
  'sprigs?', 'heads?', 'stalks?', 'bags?', 'large', 'medium', 'small',
];
const UNIT_REGEX_STR = UNIT_PATTERNS.join('|');

// Parse a single ingredient string like "1 stick (½ cup) unsalted butter" or "¾ cup sugar"
function parseIngredient(text: string): ParsedIngredient {
  let cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return { quantity: 1, unit: 'piece', name: text };

  // Resolve Unicode fractions first (½ → 0.5, ¾ → 0.75, 1½ → 1.5, etc.)
  cleaned = resolveUnicodeFractions(cleaned);

  // Extract trailing notes after comma (", at room temperature", ", divided", etc.)
  let notes = '';
  const commaMatch = cleaned.match(/^(.+?),\s*(.+)$/);
  if (commaMatch) {
    const afterComma = commaMatch[2];
    // Split on comma if what follows looks like a prep note
    const noteKeywords = /^(at |room temp|softened|melted|divided|chopped|diced|minced|to taste|optional|packed|sifted|plus |for |or |thinly |finely |roughly |coarsely |freshly |lightly |well |cut |peeled|trimmed|seeded|deveined|thawed|drained|rinsed|warmed|cooled|chilled|beaten|whisked|sifted|grated|shredded|sliced|cubed|julienned|halved|quartered|crushed|crumbled|torn|toasted|roasted)/i;
    if (noteKeywords.test(afterComma)) {
      cleaned = commaMatch[1].trim();
      notes = afterComma.trim();
    }
  }

  // Handle parenthetical alternate measurements: "1 stick (½ cup) butter"
  // Extract and save the parenthetical as a note, parse the primary measurement
  const parenMatch = cleaned.match(/^(.+?)\s*\(([^)]+)\)\s*(.*)$/);
  let beforeParen = cleaned;
  if (parenMatch) {
    const parenContent = parenMatch[2].trim();
    // Check if parenthetical contains a measurement (number + unit)
    const hasMeasurement = /[\d.]+\s*(cup|tbsp|tsp|oz|g|ml|lb)/i.test(parenContent);
    if (hasMeasurement) {
      beforeParen = (parenMatch[1] + ' ' + parenMatch[3]).replace(/\s+/g, ' ').trim();
      notes = notes ? `(${parenContent}), ${notes}` : `(${parenContent})`;
    }
  }

  // Main regex: number (decimal or fraction) + optional unit + name
  // IMPORTANT: [\\d.]+ must come AFTER the mixed-number/fraction alternatives in the group,
  // but the alternation order must allow decimals to match fully.
  const mainRegex = new RegExp(
    `^([\\d]+\\s+[\\d]+\\/[\\d]+|[\\d]+\\/[\\d]+|[\\d]+\\.\\d+|[\\d]+)\\s*(?:(${UNIT_REGEX_STR})\\.?\\s+)?(.+)$`,
    'i'
  );

  const match = beforeParen.match(mainRegex);
  if (match) {
    const rawQty = match[1];
    const rawUnit = match[2] || '';
    let name = (match[3] || beforeParen).trim();

    const quantity = parseQuantity(rawQty);

    // If unit matched "large"/"medium"/"small", fold it into the name as a descriptor
    let unit = rawUnit;
    if (/^(large|medium|small)$/i.test(rawUnit)) {
      name = rawUnit.toLowerCase() + ' ' + name;
      unit = 'piece';
    }

    const normalizedUnit = unit ? normalizeUnit(unit) : 'piece';

    // Clean up name: remove trailing periods, extra whitespace
    name = name.replace(/\.\s*$/, '').trim();

    return { quantity, unit: normalizedUnit, name, notes: notes || undefined };
  }

  return { quantity: 1, unit: 'piece', name: cleaned, notes: notes || undefined };
}

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

// Fallback HTML parser - specifically looks for ingredient and instruction sections
function parseFallback(html: string): Partial<ParsedRecipe> {
  const $ = cheerio.load(html);

  // Title: first h1, or h2 with recipe-like class
  const title =
    $('h1').first().text().trim() ||
    $('h2').first().text().trim() ||
    'Imported Recipe';

  // Description: meta description or first paragraph
  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';

  // Image: og:image or first large image
  const image =
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    '';

  // --- INGREDIENTS ---
  // Strategy: find a heading that says "Ingredients", then grab the list items after it
  const ingredients: ParsedIngredient[] = [];

  // Method 1: Look for elements with ingredient-related classes/IDs
  const ingredientSelectors = [
    '[class*="ingredient"] li',
    '[class*="ingredient"] span',
    '[class*="ingredient"] p',
    '[id*="ingredient"] li',
    '[data-ingredient]',
    '.wprm-recipe-ingredient',
    '.tasty-recipe-ingredients li',
    '.recipe-ingredients li',
    '.ingredients-list li',
    '.ingredient-list li',
    '.recipe__ingredients li',
  ];

  for (const selector of ingredientSelectors) {
    $(selector).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 2 && text.length < 200) {
        ingredients.push(parseIngredient(text));
      }
    });
    if (ingredients.length > 0) break;
  }

  // Method 2: Find heading that says "Ingredients" and grab the next list
  if (ingredients.length === 0) {
    $('h1, h2, h3, h4, h5, h6, strong, b, [class*="heading"]').each((_, heading) => {
      const headingText = $(heading).text().trim().toLowerCase();
      if (headingText.includes('ingredient') && ingredients.length === 0) {
        // Look for the next <ul> or <ol> after this heading
        let next = $(heading).next();
        // Walk up to parent if heading is inside a wrapper
        if (!next.length || (!next.is('ul') && !next.is('ol'))) {
          next = $(heading).parent().next();
        }
        // Keep walking siblings
        let attempts = 0;
        while (next.length && attempts < 5) {
          if (next.is('ul') || next.is('ol')) {
            next.find('li').each((_, li) => {
              const text = $(li).text().replace(/\s+/g, ' ').trim();
              if (text.length > 2 && text.length < 200) {
                ingredients.push(parseIngredient(text));
              }
            });
            break;
          }
          // Some sites put each ingredient in a <p> or <div>
          if (next.is('p, div') && !next.find('h1, h2, h3, h4, h5, h6').length) {
            const text = next.text().replace(/\s+/g, ' ').trim();
            if (text.length > 2 && text.length < 200 && !text.toLowerCase().includes('instruction')) {
              ingredients.push(parseIngredient(text));
            }
          }
          next = next.next();
          attempts++;
        }
      }
    });
  }

  // --- INSTRUCTIONS ---
  const instructions: Array<{ text: string }> = [];

  // Method 1: Look for elements with instruction-related classes
  const instructionSelectors = [
    '[class*="instruction"] li',
    '[class*="instruction"] p',
    '[class*="direction"] li',
    '[class*="direction"] p',
    '[class*="step"] li',
    '[class*="step"] p',
    '.wprm-recipe-instruction',
    '.tasty-recipe-instructions li',
    '.recipe-directions li',
    '.recipe__instructions li',
  ];

  for (const selector of instructionSelectors) {
    $(selector).each((_, el) => {
      const text = $(el).text().replace(/\s+/g, ' ').trim();
      if (text.length > 10 && text.length < 1000) {
        instructions.push({ text });
      }
    });
    if (instructions.length > 0) break;
  }

  // Method 2: Find heading that says "Instructions/Directions" and grab the next list
  if (instructions.length === 0) {
    $('h1, h2, h3, h4, h5, h6, strong, b, [class*="heading"]').each((_, heading) => {
      const headingText = $(heading).text().trim().toLowerCase();
      if ((headingText.includes('instruction') || headingText.includes('direction') || headingText.includes('method') || headingText.includes('steps')) && instructions.length === 0) {
        let next = $(heading).next();
        if (!next.length) {
          next = $(heading).parent().next();
        }
        let attempts = 0;
        while (next.length && attempts < 10) {
          if (next.is('ol')) {
            next.find('li').each((_, li) => {
              const text = $(li).text().replace(/\s+/g, ' ').trim();
              if (text.length > 10 && text.length < 1000) {
                instructions.push({ text });
              }
            });
            break;
          }
          if (next.is('ul')) {
            next.find('li').each((_, li) => {
              const text = $(li).text().replace(/\s+/g, ' ').trim();
              if (text.length > 10 && text.length < 1000) {
                instructions.push({ text });
              }
            });
            break;
          }
          if (next.is('p, div') && !next.find('h1, h2, h3, h4, h5, h6').length) {
            const text = next.text().replace(/\s+/g, ' ').trim();
            if (text.length > 10 && text.length < 1000) {
              instructions.push({ text });
            }
          }
          next = next.next();
          attempts++;
        }
      }
    });
  }

  return {
    title,
    description,
    image,
    ingredients: ingredients.slice(0, 50),
    instructions: instructions.slice(0, 30),
    servings: undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    const html = await fetchRecipe(url);

    // Extract site title from meta tags or hostname
    const $ = cheerio.load(html);
    const siteTitle = $('meta[property="og:site_name"]').attr('content') || new URL(url).hostname.replace('www.', '');

    // Try JSON-LD first (most reliable), then fall back to HTML parsing
    let recipe = parseJsonLd(html);
    if (!recipe || !recipe.ingredients?.length) {
      const fallback = parseFallback(html);
      // Merge: prefer JSON-LD data but use fallback for missing fields
      recipe = {
        title: recipe?.title || fallback.title,
        description: recipe?.description || fallback.description,
        image: recipe?.image || fallback.image,
        ingredients: recipe?.ingredients?.length ? recipe.ingredients : fallback.ingredients,
        instructions: recipe?.instructions?.length ? recipe.instructions : fallback.instructions,
        prepTime: recipe?.prepTime || fallback.prepTime,
        cookTime: recipe?.cookTime || fallback.cookTime,
        totalTime: recipe?.totalTime,
        servings: recipe?.servings || fallback.servings,
      };
    }

    const prepTime = recipe.prepTime || 0;
    const cookTime = recipe.cookTime || 0;
    const totalTime = recipe.totalTime || prepTime + cookTime;

    // Collect all meaningful images from the page for user selection
    const allImages: string[] = [];
    const seenUrls = new Set<string>();

    // Add the primary recipe image first
    if (recipe.image) {
      allImages.push(recipe.image);
      seenUrls.add(recipe.image);
    }

    // Gather all images from the page
    $('img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
      if (!src) return;

      // Resolve relative URLs
      let fullUrl = src;
      try {
        fullUrl = new URL(src, url).href;
      } catch {}

      // Skip tiny images (icons, tracking pixels), duplicates, and data URIs
      const width = parseInt($(el).attr('width') || '0');
      const height = parseInt($(el).attr('height') || '0');
      if ((width > 0 && width < 100) || (height > 0 && height < 100)) return;
      if (seenUrls.has(fullUrl)) return;
      if (fullUrl.startsWith('data:')) return;
      if (fullUrl.includes('pixel') || fullUrl.includes('tracking') || fullUrl.includes('badge') || fullUrl.includes('icon')) return;

      seenUrls.add(fullUrl);
      allImages.push(fullUrl);
    });

    // Also grab og:image and other meta images
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage && !seenUrls.has(ogImage)) {
      allImages.push(ogImage);
      seenUrls.add(ogImage);
    }

    return NextResponse.json({
      title: recipe.title || 'Imported Recipe',
      description: recipe.description || '',
      image_url: recipe.image || '',
      all_images: allImages.slice(0, 20), // Cap at 20 images
      ingredients: recipe.ingredients || [],
      instructions:
        recipe.instructions?.map((inst, i) => ({
          step_number: i + 1,
          text: inst.text,
        })) || [],
      prep_time_minutes: prepTime,
      cook_time_minutes: cookTime,
      total_time_minutes: totalTime,
      servings: recipe.servings || 4,
      source_url: url,
      source_name: siteTitle,
    });
  } catch (error) {
    console.error('Error importing recipe:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to import recipe from URL',
      },
      { status: 500 }
    );
  }
}
