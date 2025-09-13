import { NextRequest, NextResponse } from 'next/server';
import { Debugger } from '@/lib/debugger';

const debugManager = new Debugger();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { filePath, line, column, condition } = await request.json();

    if (!filePath || line === undefined) {
      return NextResponse.json(
        { error: 'filePath and line are required' },
        { status: 400 }
      );
    }

    const breakpoint = await debugManager.addBreakpoint(sessionId, filePath, line, column, condition);
    return NextResponse.json(breakpoint);
  } catch (error) {
    console.error('Add breakpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to add breakpoint' },
      { status: 500 }
    );
  }
}
