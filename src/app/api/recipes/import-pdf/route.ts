import { NextRequest, NextResponse } from 'next/server';
import { extractRecipeCandidates } from '@/lib/pdf-parser';

/**
 * POST /api/recipes/import-pdf
 *
 * Accepts a multipart/form-data upload with a `file` field (the PDF). Returns
 * an array of detected recipe candidates (title, page, parsed ingredients and
 * instructions). The client multi-selects and posts the chosen candidates to
 * POST /api/recipes to persist them.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'PDF is larger than 20MB' }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const candidates = await extractRecipeCandidates(buffer);

    const filename = 'name' in file && typeof file.name === 'string' ? file.name : 'upload.pdf';

    return NextResponse.json({
      source_filename: filename,
      candidates,
    });
  } catch (error) {
    console.error('Error importing PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse PDF' },
      { status: 500 },
    );
  }
}
