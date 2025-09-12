import { NextRequest, NextResponse } from 'next/server';
import { CodeAnalyzer } from '@/lib/code-analysis';
import { FileSystemManager } from '@/lib/filesystem';

const fsManager = new FileSystemManager(process.cwd());
const codeAnalyzer = new CodeAnalyzer();

export async function POST(request: NextRequest) {
  try {
    const { filePath, content } = await request.json();

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    let fileContent = content;
    if (!fileContent) {
      fileContent = await fsManager.readFile(filePath);
    }

    const analysis = await codeAnalyzer.analyzeFile(filePath, fileContent);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Code analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code' },
      { status: 500 }
    );
  }
}
