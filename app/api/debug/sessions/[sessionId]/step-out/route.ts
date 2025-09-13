import { NextRequest, NextResponse } from 'next/server';
import { Debugger } from '@/lib/debugger';

const debugManager = new Debugger();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    await debugManager.stepOut(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Step out error:', error);
    return NextResponse.json(
      { error: 'Failed to step out' },
      { status: 500 }
    );
  }
}
