import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { packageName } = await request.json();

    if (!packageName) {
      return NextResponse.json(
        { error: 'Package name is required' },
        { status: 400 }
      );
    }

    const command = `pnpm remove ${packageName}`;
    await execAsync(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Uninstall package error:', error);
    return NextResponse.json(
      { error: 'Failed to uninstall package' },
      { status: 500 }
    );
  }
}
