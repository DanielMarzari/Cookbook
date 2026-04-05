'use client';

import { useState } from 'react';

interface RecipeScalingProps {
  originalServings: number;
  onScaleChange: (scaleFactor: number) => void;
}

export default function RecipeScaling({
  originalServings,
  onScaleChange,
}: RecipeScalingProps) {
  const [scaleFactor, setScaleFactor] = useState(1);
  const [customServings, setCustomServings] = useState(originalServings);
  const [useCustom, setUseCustom] = useState(false);

  const presets = [0.5, 1, 2, 3];

  const handlePresetClick = (factor: number) => {
    setScaleFactor(factor);
    setUseCustom(false);
    setCustomServings(originalServings * factor);
    onScaleChange(factor);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setCustomServings(value);
    setUseCustom(true);
    const factor = value / originalServings;
    setScaleFactor(factor);
    onScaleChange(factor);
  };

  const currentServings = useCustom
    ? customServings
    : originalServings * scaleFactor;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 shadow-warm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text mb-2">Recipe Scaling</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">
            Original: {originalServings} servings
          </span>
          <span className="text-primary font-semibold">
            Scaled: {currentServings.toFixed(1)} servings
          </span>
        </div>
      </div>

      {/* Preset buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map((factor) => (
          <button
            key={factor}
            onClick={() => handlePresetClick(factor)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              !useCustom && scaleFactor === factor
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            {factor}x
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-2">
        <label htmlFor="custom-servings" className="text-sm text-text-secondary">
          Custom:
        </label>
        <input
          id="custom-servings"
          type="number"
          value={customServings}
          onChange={handleCustomChange}
          min="0.5"
          step="0.5"
          className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter servings"
        />
        <span className="text-sm text-text-secondary">servings</span>
      </div>
    </div>
  );
}
