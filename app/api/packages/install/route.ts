import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { packageName, version, isDev } = await request.json();

    if (!packageName) {
      return NextResponse.json(
        { error: 'Package name is required' },
        { status: 400 }
      );
    }

    const packageSpec = version ? `${packageName}@${version}` : packageName;
    const command = `pnpm add ${packageSpec}${isDev ? ' --save-dev' : ''}`;

    await execAsync(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Install package error:', error);
    return NextResponse.json(
      { error: 'Failed to install package' },
      { status: 500 }
    );
  }
}
