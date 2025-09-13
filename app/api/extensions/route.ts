import { NextRequest, NextResponse } from 'next/server';
import { ExtensionManager } from '@/lib/extension-manager';

const extensionManager = new ExtensionManager('/tmp/extensions');

export async function GET(request: NextRequest) {
  try {
    await extensionManager.initialize();
    
    const extensions = extensionManager.getAllExtensions();
    const installed = extensionManager.getInstalledExtensions();
    
    return NextResponse.json({
      extensions,
      installed,
    });
  } catch (error) {
    console.error('Get extensions error:', error);
    return NextResponse.json(
      { error: 'Failed to get extensions' },
      { status: 500 }
    );
  }
}
