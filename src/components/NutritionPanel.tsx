'use client';

import { useState, useEffect } from 'react';
import { NutritionInfo } from '@/lib/types';

interface NutritionPanelProps {
  nutrition: NutritionInfo;
  servings: number;
  scaleFactor: number;
  weight?: number; // grams per serving
}

type NutritionToggle = 'per-serving' | 'per-100g' | 'total';

export default function NutritionPanel({
  nutrition,
  servings,
  scaleFactor,
  weight,
}: NutritionPanelProps) {
  const [toggle, setToggle] = useState<NutritionToggle>('per-serving');
  const [displayNutrition, setDisplayNutrition] = useState(nutrition);
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    let scaled = { ...nutrition };

    if (toggle === 'per-100g' && weight) {
      // Scale nutrition to per 100g
      const servingGrams = weight;
      const multiplier = 100 / servingGrams;
      scaled = {
        calories: nutrition.calories * multiplier,
        protein: nutrition.protein * multiplier,
        carbs: nutrition.carbs * multiplier,
        fat: nutrition.fat * multiplier,
        fiber: nutrition.fiber * multiplier,
        sugar: nutrition.sugar * multiplier,
        sodium: nutrition.sodium * multiplier,
      };
    } else if (toggle === 'total') {
      // Scale nutrition for total recipe
      const totalServings = servings * scaleFactor;
      scaled = {
        calories: nutrition.calories * totalServings,
        protein: nutrition.protein * totalServings,
        carbs: nutrition.carbs * totalServings,
        fat: nutrition.fat * totalServings,
        fiber: nutrition.fiber * totalServings,
        sugar: nutrition.sugar * totalServings,
        sodium: nutrition.sodium * totalServings,
      };
    }

    setDisplayNutrition(scaled);
  }, [toggle, nutrition, servings, scaleFactor, weight]);

  const macroTotal = displayNutrition.protein + displayNutrition.carbs + displayNutrition.fat;
  const proteinPercent = macroTotal > 0 ? (displayNutrition.protein / macroTotal) * 100 : 0;
  const carbsPercent = macroTotal > 0 ? (displayNutrition.carbs / macroTotal) * 100 : 0;
  const fatPercent = macroTotal > 0 ? (displayNutrition.fat / macroTotal) * 100 : 0;

  const toggleLabel = {
    'per-serving': 'Per Serving',
    'per-100g': 'Per 100g',
    'total': 'Total',
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-warm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text">Nutrition</h3>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['per-serving', 'per-100g', 'total'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setToggle(t)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                toggle === t
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {toggleLabel[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Macros Chart */}
      <div className="mb-6">
        <div className="flex gap-1 h-6 rounded-lg overflow-hidden bg-gray-100 mb-3">
          {macroTotal > 0 && (
            <>
              <div
                className="bg-blue-500"
                style={{ width: `${proteinPercent}%` }}
                title={`Protein: ${displayNutrition.protein.toFixed(1)}g`}
              />
              <div
                className="bg-yellow-500"
                style={{ width: `${carbsPercent}%` }}
                title={`Carbs: ${displayNutrition.carbs.toFixed(1)}g`}
              />
              <div
                className="bg-orange-500"
                style={{ width: `${fatPercent}%` }}
                title={`Fat: ${displayNutrition.fat.toFixed(1)}g`}
              />
            </>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-text-secondary">Protein</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-text-secondary">Carbs</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-500" />
            <span className="text-text-secondary">Fat</span>
          </div>
        </div>
      </div>

      {/* Nutrition Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {displayNutrition.calories.toFixed(0)}
          </p>
          <p className="text-xs text-text-secondary">Calories</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {displayNutrition.protein.toFixed(1)}
          </p>
          <p className="text-xs text-text-secondary">Protein (g)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {displayNutrition.carbs.toFixed(1)}
          </p>
          <p className="text-xs text-text-secondary">Carbs (g)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {displayNutrition.fat.toFixed(1)}
          </p>
          <p className="text-xs text-text-secondary">Fat (g)</p>
        </div>
      </div>

      {/* Additional Nutrition */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-text-secondary">Fiber</p>
            <p className="font-semibold text-text">
              {displayNutrition.fiber.toFixed(1)}g
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Sugar</p>
            <p className="font-semibold text-text">
              {displayNutrition.sugar.toFixed(1)}g
            </p>
          </div>
          <div>
            <p className="text-text-secondary">Sodium</p>
            <p className="font-semibold text-text">
              {displayNutrition.sodium.toFixed(0)}mg
            </p>
          </div>
        </div>
      </div>

      {toggle === 'per-100g' && !weight && (
        <p className="mt-4 text-xs text-text-secondary italic">
          Weight per serving not available
        </p>
      )}
    </div>
  );
}
