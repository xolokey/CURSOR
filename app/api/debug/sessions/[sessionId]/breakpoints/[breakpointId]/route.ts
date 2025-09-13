import { NextRequest, NextResponse } from 'next/server';
import { Debugger } from '@/lib/debugger';

const debugManager = new Debugger();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string; breakpointId: string }> }
) {
  try {
    const { sessionId, breakpointId } = await params;

    await debugManager.removeBreakpoint(sessionId, breakpointId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove breakpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to remove breakpoint' },
      { status: 500 }
    );
  }
}
