export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return Response.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.USDA_API_KEY || 'DEMO_KEY';
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${apiKey}&pageSize=10`
    );

    if (!response.ok) {
      throw new Error('USDA API request failed');
    }

    const data = await response.json();

    // Parse and simplify results
    const results = (data.foods || []).map((food: any) => {
      const nutrients = food.foodNutrients || [];

      const getNutrient = (id: number): number => {
        const nutrient = nutrients.find((n: any) => n.nutrientId === id);
        return nutrient?.value || 0;
      };

      return {
        fdcId: food.fdcId,
        description: food.description,
        foodCategory: food.foodCategory || 'Unknown',
        dataType: food.dataType,
        nutrition: {
          calories: getNutrient(1008) || 0, // Energy, kcal
          protein: getNutrient(1003) || 0, // Protein
          carbs: getNutrient(1005) || 0, // Carbohydrates
          fat: getNutrient(1004) || 0, // Total lipid
          fiber: getNutrient(1079) || 0, // Fiber, total dietary
          sugar: getNutrient(2000) || 0, // Sugars, total including NLEA
          sodium: getNutrient(1093) || 0, // Sodium
        },
      };
    });

    return Response.json(results);
  } catch (error) {
    console.error('USDA API error:', error);
    return Response.json(
      { error: 'Failed to search USDA database' },
      { status: 500 }
    );
  }
}
