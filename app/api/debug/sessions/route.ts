import { NextRequest, NextResponse } from 'next/server';
import { Debugger } from '@/lib/debugger';

const debugManager = new Debugger();

export async function GET() {
  try {
    const sessions = debugManager.getAllSessions();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Get debug sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to get debug sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, type, request: reqType, program, args, env, cwd, port, host } = await request.json();

    const config = {
      name: name || 'New Debug Session',
      type: type || 'node',
      request: reqType || 'launch',
      program,
      args,
      env,
      cwd,
      port,
      host,
    };

    const session = await debugManager.createSession(config);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Create debug session error:', error);
    return NextResponse.json(
      { error: 'Failed to create debug session' },
      { status: 500 }
    );
  }
}
