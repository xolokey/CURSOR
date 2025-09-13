import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    
    const packages = [
      ...Object.entries(dependencies).map(([name, version]) => ({
        name,
        version: version as string,
        description: `Package: ${name}`,
        isDevDependency: false,
        isOutdated: false,
        keywords: [],
        dependencies: [],
        lastUpdated: new Date().toISOString(),
      })),
      ...Object.entries(devDependencies).map(([name, version]) => ({
        name,
        version: version as string,
        description: `Dev package: ${name}`,
        isDevDependency: true,
        isOutdated: false,
        keywords: [],
        dependencies: [],
        lastUpdated: new Date().toISOString(),
      })),
    ];

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Get packages error:', error);
    return NextResponse.json(
      { error: 'Failed to get packages' },
      { status: 500 }
    );
  }
}
