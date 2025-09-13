import { NextRequest, NextResponse } from 'next/server';
import { Debugger } from '@/lib/debugger';

const debugManager = new Debugger();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    await debugManager.stepOver(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Step over error:', error);
    return NextResponse.json(
      { error: 'Failed to step over' },
      { status: 500 }
    );
  }
}
