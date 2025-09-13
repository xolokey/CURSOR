import { NextRequest, NextResponse } from 'next/server';
import { ExtensionManager } from '@/lib/extension-manager';

const extensionManager = new ExtensionManager('/tmp/extensions');

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ extensionId: string }> }
) {
  try {
    const { extensionId } = await params;

    await extensionManager.initialize();
    await extensionManager.installExtension(extensionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Install extension error:', error);
    return NextResponse.json(
      { error: 'Failed to install extension' },
      { status: 500 }
    );
  }
}
