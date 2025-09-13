import { NextRequest, NextResponse } from 'next/server';
import { AdvancedAI } from '@/lib/advanced-ai';

const advancedAI = new AdvancedAI(
  process.env.GEMINI_API_KEY || '',
  process.env.PERPLEXITY_API_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { code, filePath, context } = await request.json();

    if (!code || !filePath) {
      return NextResponse.json(
        { error: 'Code and filePath are required' },
        { status: 400 }
      );
    }

    const edits = await advancedAI.generateMultiLineEdits(code, context || '', filePath);
    return NextResponse.json(edits);
  } catch (error) {
    console.error('Multi-edit API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate multi-line edits' },
      { status: 500 }
    );
  }
}
