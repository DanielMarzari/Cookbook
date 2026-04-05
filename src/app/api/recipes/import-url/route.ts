import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface ParsedIngredient {
  name: string;
  quantity: number;
  unit: string;
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
        const instructions: Array<{ text: string }> = [];
        const rawInstructions = recipe.recipeInstructions || [];
        for (const inst of rawInstructions) {
          if (typeof inst === 'string') {
            instructions.push({ text: inst });
          } else if (inst['@type'] === 'HowToStep') {
            instructions.push({ text: inst.text || '' });
          } else if (inst['@type'] === 'HowToSection' && inst.itemListElement) {
            for (const step of inst.itemListElement) {
              instructions.push({ text: typeof step === 'string' ? step : step.text || '' });
            }
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
          ingredients: (recipe.recipeIngredient || []).map((ing: string) =>
            parseIngredient(typeof ing === 'string' ? ing : '')
          ),
          instructions,
        };
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

// Parse ISO 8601 duration (PT1H30M, PT45M, PT2H, etc.)
function parseDuration(duration: string | undefined): number | undefined {
  if (!duration) return undefined;
  let minutes = 0;
  const hours = duration.match(/(\d+)H/);
  const mins = duration.match(/(\d+)M/);
  if (hours) minutes += parseInt(hours[1]) * 60;
  if (mins) minutes += parseInt(mins[1]);
  return minutes || undefined;
}

// Parse a single ingredient string like "1 1/2 cups all-purpose flour"
function parseIngredient(text: string): ParsedIngredient {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return { quantity: 1, unit: 'piece', name: text };

  // Common units to look for
  const units = [
    'cups?', 'tablespoons?', 'tbsp', 'teaspoons?', 'tsp',
    'ounces?', 'oz', 'pounds?', 'lbs?', 'grams?', 'g',
    'kilograms?', 'kg', 'milliliters?', 'ml', 'liters?', 'l',
    'pinch(?:es)?', 'dash(?:es)?', 'cloves?', 'slices?',
    'pieces?', 'cans?', 'packages?', 'sticks?', 'bunches?',
    'sprigs?', 'heads?', 'stalks?', 'bags?',
  ];
  const unitPattern = units.join('|');

  // Match: quantity (possibly fraction) + unit + name
  // Examples: "1 1/2 cups flour", "2 tbsp olive oil", "3 large eggs"
  const fractionRegex = new RegExp(
    `^([\\d]+(?:\\s+[\\d]+\\/[\\d]+)?|[\\d]+\\/[\\d]+|[\\d.]+)\\s*(?:(${unitPattern})\\.?\\s+)?(.+)$`,
    'i'
  );

  const match = cleaned.match(fractionRegex);
  if (match) {
    const rawQty = match[1];
    const unit = match[2] || 'piece';
    const name = match[3] || cleaned;

    // Parse fractions like "1 1/2" or "1/2"
    let quantity = 0;
    if (rawQty.includes('/')) {
      const parts = rawQty.split(/\s+/);
      for (const part of parts) {
        if (part.includes('/')) {
          const [num, den] = part.split('/');
          quantity += parseInt(num) / parseInt(den);
        } else {
          quantity += parseFloat(part);
        }
      }
    } else {
      quantity = parseFloat(rawQty) || 1;
    }

    // Normalize unit names
    const normalizedUnit = normalizeUnit(unit);

    return { quantity, unit: normalizedUnit, name: name.trim() };
  }

  return { quantity: 1, unit: 'piece', name: cleaned };
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

    return NextResponse.json({
      title: recipe.title || 'Imported Recipe',
      description: recipe.description || '',
      image_url: recipe.image || '',
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
