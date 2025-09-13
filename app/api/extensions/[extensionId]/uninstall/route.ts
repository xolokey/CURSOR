import { NextRequest, NextResponse } from 'next/server';
import { ExtensionManager } from '@/lib/extension-manager';

const extensionManager = new ExtensionManager('/tmp/extensions');

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ extensionId: string }> }
) {
  try {
    const { extensionId } = await params;

    await extensionManager.initialize();
    await extensionManager.uninstallExtension(extensionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Uninstall extension error:', error);
    return NextResponse.json(
      { error: 'Failed to uninstall extension' },
      { status: 500 }
    );
  }
}
