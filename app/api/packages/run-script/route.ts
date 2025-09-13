import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { scriptName } = await request.json();

    if (!scriptName) {
      return NextResponse.json(
        { error: 'Script name is required' },
        { status: 400 }
      );
    }

    const command = `pnpm run ${scriptName}`;
    const { stdout, stderr } = await execAsync(command);

    return NextResponse.json({ 
      success: true, 
      output: stdout,
      error: stderr 
    });
  } catch (error) {
    console.error('Run script error:', error);
    return NextResponse.json(
      { error: 'Failed to run script' },
      { status: 500 }
    );
  }
}
