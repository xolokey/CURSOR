import { NextRequest, NextResponse } from 'next/server';
import { Debugger } from '@/lib/debugger';

const debugManager = new Debugger();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    await debugManager.continue(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Continue error:', error);
    return NextResponse.json(
      { error: 'Failed to continue' },
      { status: 500 }
    );
  }
}
