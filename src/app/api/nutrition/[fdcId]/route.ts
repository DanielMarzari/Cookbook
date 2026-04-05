export async function GET(
  request: Request,
  { params }: { params: Promise<{ fdcId: string }> }
) {
  const { fdcId } = await params;

  if (!fdcId) {
    return Response.json(
      { error: 'FDC ID is required' },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.USDA_API_KEY || 'DEMO_KEY';
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('USDA API request failed');
    }

    const data = await response.json();
    const nutrients = data.foodNutrients || [];

    const getNutrient = (id: number): number => {
      const nutrient = nutrients.find((n: any) => n.nutrientId === id);
      return nutrient?.value || 0;
    };

    const result = {
      fdcId: data.fdcId,
      description: data.description,
      nutrition: {
        calories: getNutrient(1008) || 0,
        protein: getNutrient(1003) || 0,
        carbs: getNutrient(1005) || 0,
        fat: getNutrient(1004) || 0,
        fiber: getNutrient(1079) || 0,
        sugar: getNutrient(2000) || 0,
        sodium: getNutrient(1093) || 0,
      },
    };

    return Response.json(result);
  } catch (error) {
    console.error('USDA API error:', error);
    return Response.json(
      { error: 'Failed to fetch nutrition data' },
      { status: 500 }
    );
  }
}
