'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy,
  FileCode,
  FileImage,
  FileJson,
  Database,
  Code,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface FileInfo {
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

interface DirectoryContents {
  files: FileInfo[];
  directories: FileInfo[];
  totalFiles: number;
  totalDirectories: number;
  totalSize: number;
}

interface FileExplorerProps {
  onFileSelect: (file: FileInfo) => void;
  onFileOpen: (file: FileInfo) => void;
  currentPath?: string;
}

export function FileExplorer({ onFileSelect, onFileOpen, currentPath = '' }: FileExplorerProps) {
  const [contents, setContents] = useState<DirectoryContents | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  const loadDirectory = async (path: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/files?action=list&path=${encodeURIComponent(path)}`);
      if (response.ok) {
        const data = await response.json();
        setContents(data);
      }
    } catch (error) {
      console.error('Failed to load directory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = (file: FileInfo) => {
    if (file.type === 'directory') {
      toggleFolder(file.path);
    } else {
      setSelectedFile(file.path);
      onFileSelect(file);
    }
  };

  const handleFileDoubleClick = (file: FileInfo) => {
    if (file.type === 'file') {
      onFileOpen(file);
    }
  };

  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (file: FileInfo) => {
    if (file.type === 'directory') {
      return expandedFolders.has(file.path) ? 
        <FolderOpen className="w-4 h-4 text-blue-500" /> : 
        <Folder className="w-4 h-4 text-blue-500" />;
    }

    const ext = file.extension?.toLowerCase();
    switch (ext) {
      case '.tsx':
      case '.ts':
      case '.js':
      case '.jsx':
        return <FileCode className="w-4 h-4 text-blue-400" />;
      case '.css':
      case '.scss':
      case '.sass':
        return <FileCode className="w-4 h-4 text-pink-400" />;
      case '.json':
        return <FileJson className="w-4 h-4 text-yellow-400" />;
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.svg':
        return <FileImage className="w-4 h-4 text-green-400" />;
      case '.sql':
        return <Database className="w-4 h-4 text-orange-400" />;
      case '.md':
        return <FileText className="w-4 h-4 text-gray-400" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const filteredContents = contents ? {
    ...contents,
    directories: contents.directories.filter(dir => 
      !searchQuery || dir.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    files: contents.files.filter(file => 
      !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  } : null;

  return (
    <Card className="w-80 h-full bg-card border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Explorer</h3>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => {/* TODO: Create new file */}}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-7 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredContents ? (
            <div className="space-y-1">
              {/* Directories */}
              {filteredContents.directories.map((dir) => (
                <div key={dir.path} className="space-y-1">
                  <div
                    className="flex items-center gap-2 px-2 py-1 cursor-pointer text-sm rounded-sm hover:bg-muted/50"
                    onClick={() => handleFileClick(dir)}
                  >
                    <div className="flex items-center gap-1">
                      {expandedFolders.has(dir.path) ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                      {getFileIcon(dir)}
                    </div>
                    <span className="truncate flex-1">{dir.name}</span>
                  </div>
                  
                  {expandedFolders.has(dir.path) && (
                    <div className="ml-4">
                      <FileExplorer
                        onFileSelect={onFileSelect}
                        onFileOpen={onFileOpen}
                        currentPath={dir.path}
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* Files */}
              {filteredContents.files.map((file) => (
                <div
                  key={file.path}
                  className={`flex items-center gap-2 px-2 py-1 cursor-pointer text-sm rounded-sm hover:bg-muted/50 ${
                    selectedFile === file.path ? 'bg-primary/10 text-primary' : ''
                  }`}
                  onClick={() => handleFileClick(file)}
                  onDoubleClick={() => handleFileDoubleClick(file)}
                >
                  {getFileIcon(file)}
                  <span className="truncate flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}

              {filteredContents.directories.length === 0 && filteredContents.files.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No files found</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Failed to load directory</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Directory Info */}
      {filteredContents && (
        <div className="p-2 border-t border-border text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>{filteredContents.totalFiles} files</span>
            <span>{filteredContents.totalDirectories} folders</span>
          </div>
          <div className="text-center">
            {formatFileSize(filteredContents.totalSize)} total
          </div>
        </div>
      )}
    </Card>
  );
}
