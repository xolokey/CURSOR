'use client';

import { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Folder, 
  FileCode, 
  FileImage, 
  FileJson, 
  Database,
  Code,
  Search,
  Clock,
  Star,
  GitBranch,
  MessageSquare,
  Settings,
  Package,
  Terminal,
  Bug,
  BarChart3
} from 'lucide-react';

interface QuickOpenItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder' | 'command' | 'symbol';
  icon: React.ComponentType<any>;
  description?: string;
  category: string;
  lastOpened?: Date;
  isFavorite?: boolean;
}

interface QuickOpenProps {
  isOpen: boolean;
  onClose: () => void;
  onItemSelect: (item: QuickOpenItem) => void;
  recentFiles?: QuickOpenItem[];
  favoriteFiles?: QuickOpenItem[];
}

export function QuickOpen({ 
  isOpen, 
  onClose, 
  onItemSelect, 
  recentFiles = [],
  favoriteFiles = []
}: QuickOpenProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems: QuickOpenItem[] = [
    // Recent Files
    ...recentFiles.map(file => ({ ...file, category: 'Recent' })),
    
    // Favorite Files
    ...favoriteFiles.map(file => ({ ...file, category: 'Favorites' })),
    
    // Commands
    {
      id: 'cmd.new-file',
      name: 'New File',
      path: 'cmd:new-file',
      type: 'command',
      icon: FileText,
      description: 'Create a new file',
      category: 'Commands'
    },
    {
      id: 'cmd.new-folder',
      name: 'New Folder',
      path: 'cmd:new-folder',
      type: 'command',
      icon: Folder,
      description: 'Create a new folder',
      category: 'Commands'
    },
    {
      id: 'cmd.open-folder',
      name: 'Open Folder',
      path: 'cmd:open-folder',
      type: 'command',
      icon: Folder,
      description: 'Open a folder in the workspace',
      category: 'Commands'
    },
    {
      id: 'cmd.save',
      name: 'Save',
      path: 'cmd:save',
      type: 'command',
      icon: FileText,
      description: 'Save the current file',
      category: 'Commands'
    },
    {
      id: 'cmd.save-as',
      name: 'Save As',
      path: 'cmd:save-as',
      type: 'command',
      icon: FileText,
      description: 'Save file with a new name',
      category: 'Commands'
    },
    
    // Git Commands
    {
      id: 'git.commit',
      name: 'Git: Commit',
      path: 'git:commit',
      type: 'command',
      icon: GitBranch,
      description: 'Commit staged changes',
      category: 'Git'
    },
    {
      id: 'git.push',
      name: 'Git: Push',
      path: 'git:push',
      type: 'command',
      icon: GitBranch,
      description: 'Push commits to remote',
      category: 'Git'
    },
    {
      id: 'git.pull',
      name: 'Git: Pull',
      path: 'git:pull',
      type: 'command',
      icon: GitBranch,
      description: 'Pull changes from remote',
      category: 'Git'
    },
    
    // AI Commands
    {
      id: 'ai.chat',
      name: 'AI: Chat',
      path: 'ai:chat',
      type: 'command',
      icon: MessageSquare,
      description: 'Open AI assistant',
      category: 'AI'
    },
    {
      id: 'ai.explain',
      name: 'AI: Explain Code',
      path: 'ai:explain',
      type: 'command',
      icon: Code,
      description: 'Explain selected code',
      category: 'AI'
    },
    {
      id: 'ai.generate',
      name: 'AI: Generate Code',
      path: 'ai:generate',
      type: 'command',
      icon: Code,
      description: 'Generate code with AI',
      category: 'AI'
    },
    
    // Settings
    {
      id: 'settings.open',
      name: 'Settings',
      path: 'settings:open',
      type: 'command',
      icon: Settings,
      description: 'Open application settings',
      category: 'Settings'
    },
    {
      id: 'settings.keyboard',
      name: 'Keyboard Shortcuts',
      path: 'settings:keyboard',
      type: 'command',
      icon: Settings,
      description: 'View and edit keyboard shortcuts',
      category: 'Settings'
    },
    {
      id: 'settings.theme',
      name: 'Toggle Theme',
      path: 'settings:theme',
      type: 'command',
      icon: Settings,
      description: 'Switch between light and dark theme',
      category: 'Settings'
    },
  ];

  const filteredItems = allItems.filter(item => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.path.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower)
    );
  });

  const groupedItems = filteredItems.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {} as Record<string, QuickOpenItem[]>);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (item: QuickOpenItem) => {
    onItemSelect(item);
    onClose();
  };

  const getFileIcon = (item: QuickOpenItem) => {
    if (item.type === 'command') {
      const Icon = item.icon;
      return <Icon className="w-4 h-4" />;
    }

    if (item.type === 'folder') {
      return <Folder className="w-4 h-4 text-blue-500" />;
    }

    // File type icons
    const ext = item.path.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts':
      case 'js':
      case 'jsx':
        return <FileCode className="w-4 h-4 text-blue-400" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <FileCode className="w-4 h-4 text-pink-400" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-yellow-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <FileImage className="w-4 h-4 text-green-400" />;
      case 'sql':
        return <Database className="w-4 h-4 text-orange-400" />;
      case 'md':
        return <FileText className="w-4 h-4 text-gray-400" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatLastOpened = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              ref={inputRef}
              placeholder="Type to search files, commands, or symbols..."
              value={search}
              onValueChange={setSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-96 overflow-y-auto overflow-x-hidden">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <Command.Group key={category} heading={category}>
                {categoryItems.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.name}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                  >
                    {getFileIcon(item)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {item.description}
                        </div>
                      )}
                      {item.path && item.type !== 'command' && (
                        <div className="text-xs text-muted-foreground truncate">
                          {item.path}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {item.isFavorite && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      )}
                      {item.lastOpened && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatLastOpened(item.lastOpened)}
                        </div>
                      )}
                      {item.type === 'command' && (
                        <Badge variant="outline" className="text-xs">
                          Command
                        </Badge>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
            {filteredItems.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No items found.
              </div>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
