import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    return NextResponse.json(packageJson);
  } catch (error) {
    console.error('Get package.json error:', error);
    return NextResponse.json(
      { error: 'Failed to get package.json' },
      { status: 500 }
    );
  }
}
