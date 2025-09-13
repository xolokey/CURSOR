import { NextRequest, NextResponse } from 'next/server';
import { Debugger } from '@/lib/debugger';

const debugManager = new Debugger();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { expression } = await request.json();

    if (!expression) {
      return NextResponse.json(
        { error: 'Expression is required' },
        { status: 400 }
      );
    }

    const result = await debugManager.evaluateExpression(sessionId, expression);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Evaluate expression error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate expression' },
      { status: 500 }
    );
  }
}
