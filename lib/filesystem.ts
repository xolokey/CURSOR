import { promises as fs } from 'fs';
import path from 'path';
import chokidar from 'chokidar';

export interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  modified: Date;
  created: Date;
  isHidden: boolean;
  extension?: string;
  mimeType?: string;
}

export interface DirectoryContents {
  files: FileInfo[];
  directories: FileInfo[];
  totalFiles: number;
  totalDirectories: number;
  totalSize: number;
}

export class FileSystemManager {
  private basePath: string;
  private watchers: Map<string, any> = new Map();

  constructor(basePath: string) {
    this.basePath = path.resolve(basePath);
  }

  async readFile(filePath: string): Promise<string> {
    try {
      const fullPath = this.resolvePath(filePath);
      return await fs.readFile(fullPath, 'utf-8');
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      throw error;
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      const fullPath = this.resolvePath(filePath);
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, content, 'utf-8');
    } catch (error) {
      console.error(`Failed to write file ${filePath}:`, error);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = this.resolvePath(filePath);
      await fs.unlink(fullPath);
    } catch (error) {
      console.error(`Failed to delete file ${filePath}:`, error);
      throw error;
    }
  }

  async createDirectory(dirPath: string): Promise<void> {
    try {
      const fullPath = this.resolvePath(dirPath);
      await fs.mkdir(fullPath, { recursive: true });
    } catch (error) {
      console.error(`Failed to create directory ${dirPath}:`, error);
      throw error;
    }
  }

  async deleteDirectory(dirPath: string, recursive: boolean = false): Promise<void> {
    try {
      const fullPath = this.resolvePath(dirPath);
      await fs.rmdir(fullPath, { recursive });
    } catch (error) {
      console.error(`Failed to delete directory ${dirPath}:`, error);
      throw error;
    }
  }

  async moveFile(sourcePath: string, destPath: string): Promise<void> {
    try {
      const fullSourcePath = this.resolvePath(sourcePath);
      const fullDestPath = this.resolvePath(destPath);
      const destDir = path.dirname(fullDestPath);
      await fs.mkdir(destDir, { recursive: true });
      await fs.rename(fullSourcePath, fullDestPath);
    } catch (error) {
      console.error(`Failed to move file from ${sourcePath} to ${destPath}:`, error);
      throw error;
    }
  }

  async copyFile(sourcePath: string, destPath: string): Promise<void> {
    try {
      const fullSourcePath = this.resolvePath(sourcePath);
      const fullDestPath = this.resolvePath(destPath);
      const destDir = path.dirname(fullDestPath);
      await fs.mkdir(destDir, { recursive: true });
      await fs.copyFile(fullSourcePath, fullDestPath);
    } catch (error) {
      console.error(`Failed to copy file from ${sourcePath} to ${destPath}:`, error);
      throw error;
    }
  }

  async getFileInfo(filePath: string): Promise<FileInfo> {
    try {
      const fullPath = this.resolvePath(filePath);
      const stats = await fs.stat(fullPath);
      const parsedPath = path.parse(fullPath);
      
      return {
        name: parsedPath.base,
        path: filePath,
        type: stats.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        modified: stats.mtime,
        created: stats.birthtime,
        isHidden: parsedPath.base.startsWith('.'),
        extension: parsedPath.ext || undefined,
        mimeType: this.getMimeType(parsedPath.ext),
      };
    } catch (error) {
      console.error(`Failed to get file info for ${filePath}:`, error);
      throw error;
    }
  }

  async listDirectory(dirPath: string = ''): Promise<DirectoryContents> {
    try {
      const fullPath = this.resolvePath(dirPath);
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      
      const files: FileInfo[] = [];
      const directories: FileInfo[] = [];
      let totalSize = 0;

      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);
        const fileInfo = await this.getFileInfo(entryPath);
        
        if (fileInfo.type === 'directory') {
          directories.push(fileInfo);
        } else {
          files.push(fileInfo);
          totalSize += fileInfo.size;
        }
      }

      // Sort directories first, then files, both alphabetically
      directories.sort((a, b) => a.name.localeCompare(b.name));
      files.sort((a, b) => a.name.localeCompare(b.name));

      return {
        files,
        directories,
        totalFiles: files.length,
        totalDirectories: directories.length,
        totalSize,
      };
    } catch (error) {
      console.error(`Failed to list directory ${dirPath}:`, error);
      throw error;
    }
  }

  async searchFiles(query: string, dirPath: string = '', extensions?: string[]): Promise<FileInfo[]> {
    try {
      const results: FileInfo[] = [];
      const contents = await this.listDirectory(dirPath);

      // Search in current directory
      for (const file of contents.files) {
        if (this.matchesSearch(file, query, extensions)) {
          results.push(file);
        }
      }

      // Recursively search in subdirectories
      for (const dir of contents.directories) {
        const subResults = await this.searchFiles(query, dir.path, extensions);
        results.push(...subResults);
      }

      return results;
    } catch (error) {
      console.error(`Failed to search files in ${dirPath}:`, error);
      throw error;
    }
  }

  async watchDirectory(dirPath: string, callback: (event: string, filePath: string) => void): Promise<void> {
    try {
      const fullPath = this.resolvePath(dirPath);
      
      if (this.watchers.has(dirPath)) {
        await this.unwatchDirectory(dirPath);
      }

      const watcher = chokidar.watch(fullPath, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: true,
      });

      watcher
        .on('add', (filePath) => callback('add', this.relativePath(filePath)))
        .on('change', (filePath) => callback('change', this.relativePath(filePath)))
        .on('unlink', (filePath) => callback('unlink', this.relativePath(filePath)))
        .on('addDir', (filePath) => callback('addDir', this.relativePath(filePath)))
        .on('unlinkDir', (filePath) => callback('unlinkDir', this.relativePath(filePath)));

      this.watchers.set(dirPath, watcher);
    } catch (error) {
      console.error(`Failed to watch directory ${dirPath}:`, error);
      throw error;
    }
  }

  async unwatchDirectory(dirPath: string): Promise<void> {
    try {
      const watcher = this.watchers.get(dirPath);
      if (watcher) {
        await watcher.close();
        this.watchers.delete(dirPath);
      }
    } catch (error) {
      console.error(`Failed to unwatch directory ${dirPath}:`, error);
      throw error;
    }
  }

  async unwatchAll(): Promise<void> {
    try {
      for (const [dirPath, watcher] of this.watchers) {
        await watcher.close();
      }
      this.watchers.clear();
    } catch (error) {
      console.error('Failed to unwatch all directories:', error);
      throw error;
    }
  }

  private resolvePath(filePath: string): string {
    const resolved = path.resolve(this.basePath, filePath);
    if (!resolved.startsWith(this.basePath)) {
      throw new Error('Path traversal detected');
    }
    return resolved;
  }

  private relativePath(fullPath: string): string {
    return path.relative(this.basePath, fullPath);
  }

  private matchesSearch(file: FileInfo, query: string, extensions?: string[]): boolean {
    const queryLower = query.toLowerCase();
    
    // Check filename match
    if (!file.name.toLowerCase().includes(queryLower)) {
      return false;
    }

    // Check extension filter
    if (extensions && file.extension) {
      return extensions.includes(file.extension);
    }

    return true;
  }

  private getMimeType(extension: string): string | undefined {
    const mimeTypes: Record<string, string> = {
      '.js': 'application/javascript',
      '.ts': 'application/typescript',
      '.tsx': 'application/typescript',
      '.jsx': 'application/javascript',
      '.json': 'application/json',
      '.html': 'text/html',
      '.css': 'text/css',
      '.scss': 'text/scss',
      '.sass': 'text/sass',
      '.md': 'text/markdown',
      '.txt': 'text/plain',
      '.py': 'text/x-python',
      '.java': 'text/x-java',
      '.cpp': 'text/x-c++',
      '.c': 'text/x-c',
      '.php': 'text/x-php',
      '.rb': 'text/x-ruby',
      '.go': 'text/x-go',
      '.rs': 'text/x-rust',
      '.xml': 'application/xml',
      '.yaml': 'application/x-yaml',
      '.yml': 'application/x-yaml',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    return mimeTypes[extension.toLowerCase()];
  }
}
