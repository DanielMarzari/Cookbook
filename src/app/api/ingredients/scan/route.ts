import Tesseract from 'tesseract.js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return Response.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const imageData = `data:${file.type};base64,${base64}`;

    // Run OCR
    const { data: { text } } = await Tesseract.recognize(
      imageData,
      'eng',
      { logger: () => {} }
    );

    // Parse nutrition values from OCR text
    const nutrition = parseNutritionFromText(text);

    return Response.json({
      success: true,
      ocrText: text,
      nutrition,
    });
  } catch (error) {
    console.error('OCR error:', error);
    return Response.json(
      { error: 'Failed to scan image' },
      { status: 500 }
    );
  }
}

function parseNutritionFromText(text: string) {
  const patterns = {
    calories: /(?:calories?|cal|energy)[\s:]*(\d+(?:\.\d+)?)/i,
    protein: /(?:protein)[\s:]*(\d+(?:\.\d+)?)/i,
    carbs: /(?:carbohydrates?|carbs|total carbs)[\s:]*(\d+(?:\.\d+)?)/i,
    fat: /(?:total fat|fat)[\s:]*(\d+(?:\.\d+)?)/i,
    fiber: /(?:dietary fiber|fiber)[\s:]*(\d+(?:\.\d+)?)/i,
    sugar: /(?:sugars?)[\s:]*(\d+(?:\.\d+)?)/i,
    sodium: /(?:sodium)[\s:]*(\d+(?:\.\d+)?)/i,
  };

  const nutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
  };

  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = text.match(pattern);
    if (match) {
      nutrition[key as keyof typeof nutrition] = parseFloat(match[1]);
    }
  });

  return nutrition;
}
