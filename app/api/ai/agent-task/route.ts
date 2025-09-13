import { NextRequest, NextResponse } from 'next/server';
import { AdvancedAI } from '@/lib/advanced-ai';

const advancedAI = new AdvancedAI(
  process.env.GEMINI_API_KEY || '',
  process.env.PERPLEXITY_API_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const task = await advancedAI.createAgentTask(description);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Agent task API error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent task' },
      { status: 500 }
    );
  }
}
