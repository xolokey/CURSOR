import { NextRequest, NextResponse } from 'next/server';
import { AdvancedAI } from '@/lib/advanced-ai';

const advancedAI = new AdvancedAI(
  process.env.GEMINI_API_KEY || '',
  process.env.PERPLEXITY_API_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { code, prompt } = await request.json();

    if (!code || !prompt) {
      return NextResponse.json(
        { error: 'Code and prompt are required' },
        { status: 400 }
      );
    }

    const rewrite = await advancedAI.generateSmartRewrite(code, prompt);
    return NextResponse.json(rewrite);
  } catch (error) {
    console.error('Smart rewrite API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate smart rewrite' },
      { status: 500 }
    );
  }
}
