import { NextRequest, NextResponse } from 'next/server';
import { Debugger } from '@/lib/debugger';

const debugManager = new Debugger();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    await debugManager.startDebugging(sessionId);
    const session = debugManager.getSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Start debugging error:', error);
    return NextResponse.json(
      { error: 'Failed to start debugging' },
      { status: 500 }
    );
  }
}
