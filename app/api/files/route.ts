import { NextRequest, NextResponse } from 'next/server';
import { FileSystemManager } from '@/lib/filesystem';
import path from 'path';

const fsManager = new FileSystemManager(process.cwd());

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const filePath = searchParams.get('path') || '';

    switch (action) {
      case 'list':
        const contents = await fsManager.listDirectory(filePath);
        return NextResponse.json(contents);

      case 'read':
        const content = await fsManager.readFile(filePath);
        return NextResponse.json({ content });

      case 'info':
        const info = await fsManager.getFileInfo(filePath);
        return NextResponse.json(info);

      case 'search':
        const query = searchParams.get('query') || '';
        const extensions = searchParams.get('extensions')?.split(',');
        const results = await fsManager.searchFiles(query, filePath, extensions);
        return NextResponse.json(results);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('File system API error:', error);
    return NextResponse.json(
      { error: 'Failed to process file system request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, path: filePath, content, destination } = await request.json();

    switch (action) {
      case 'write':
        await fsManager.writeFile(filePath, content);
        return NextResponse.json({ success: true });

      case 'createDirectory':
        await fsManager.createDirectory(filePath);
        return NextResponse.json({ success: true });

      case 'delete':
        const info = await fsManager.getFileInfo(filePath);
        if (info.type === 'directory') {
          await fsManager.deleteDirectory(filePath, true);
        } else {
          await fsManager.deleteFile(filePath);
        }
        return NextResponse.json({ success: true });

      case 'move':
        await fsManager.moveFile(filePath, destination);
        return NextResponse.json({ success: true });

      case 'copy':
        await fsManager.copyFile(filePath, destination);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('File system API error:', error);
    return NextResponse.json(
      { error: 'Failed to process file system request' },
      { status: 500 }
    );
  }
}
