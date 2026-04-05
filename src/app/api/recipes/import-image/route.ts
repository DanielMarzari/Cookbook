import { NextRequest, NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const buffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${imageFile.type};base64,${base64}`;

    const {
      data: { text },
    } = await Tesseract.recognize(dataUrl, 'eng', {
      logger: (m: any) => console.log('Tesseract:', m),
    });

    const lines = text.split('\n').filter((line) => line.trim().length > 0);

    const title = lines[0] || 'Recipe from Image';

    const ingredients: Array<{ name: string; quantity: number; unit: string }> =
      [];
    const instructions: Array<{ text: string }> = [];

    let inInstructions = false;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      if (
        line.includes('instructions') ||
        line.includes('directions') ||
        line.includes('steps')
      ) {
        inInstructions = true;
        continue;
      }

      if (inInstructions) {
        if (lines[i].trim().length > 0) {
          instructions.push({ text: lines[i] });
        }
      } else {
        if (lines[i].trim().length > 0) {
          const match = lines[i].match(/^([\d.]+)\s*(\w+)?\s*(.+)$/);
          if (match) {
            ingredients.push({
              quantity: parseFloat(match[1]) || 1,
              unit: match[2] || 'piece',
              name: match[3] || lines[i],
            });
          } else {
            ingredients.push({
              quantity: 1,
              unit: 'piece',
              name: lines[i],
            });
          }
        }
      }
    }

    return NextResponse.json({
      title,
      description: '',
      image_url: '',
      ingredients: ingredients.slice(0, 20),
      instructions: instructions.slice(0, 20),
      prep_time_minutes: 15,
      cook_time_minutes: 30,
      servings: 4,
      cuisine_type: 'Mediterranean',
      difficulty: 'medium',
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to process image',
      },
      { status: 500 }
    );
  }
}
