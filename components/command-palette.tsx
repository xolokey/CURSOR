'use client';

import { useState, useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  GitBranch, 
  MessageSquare, 
  Settings, 
  Play, 
  Bug, 
  Terminal,
  Package,
  BarChart3,
  Users,
  Zap,
  Code,
  Save,
  Folder,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info,
  Keyboard,
  Palette,
  Monitor,
  Moon,
  Sun
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
  keywords?: string[];
  shortcut?: string;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
}

export function CommandPalette({ isOpen, onClose, onCommand }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    // File Operations
    {
      id: 'file.new',
      title: 'New File',
      description: 'Create a new file',
      icon: FileText,
      keywords: ['new', 'create', 'file'],
      shortcut: 'Ctrl+N',
      action: () => onCommand('new-file'),
      category: 'File'
    },
    {
      id: 'file.open',
      title: 'Open File',
      description: 'Open an existing file',
      icon: Folder,
      keywords: ['open', 'file', 'browse'],
      shortcut: 'Ctrl+O',
      action: () => onCommand('open-file'),
      category: 'File'
    },
    {
      id: 'file.save',
      title: 'Save File',
      description: 'Save the current file',
      icon: Save,
      keywords: ['save', 'file'],
      shortcut: 'Ctrl+S',
      action: () => onCommand('save-file'),
      category: 'File'
    },
    {
      id: 'file.saveAs',
      title: 'Save As',
      description: 'Save file with a new name',
      icon: Save,
      keywords: ['save', 'as', 'rename'],
      shortcut: 'Ctrl+Shift+S',
      action: () => onCommand('save-as'),
      category: 'File'
    },
    {
      id: 'file.close',
      title: 'Close File',
      description: 'Close the current file',
      icon: FileText,
      keywords: ['close', 'file'],
      shortcut: 'Ctrl+W',
      action: () => onCommand('close-file'),
      category: 'File'
    },

    // Edit Operations
    {
      id: 'edit.undo',
      title: 'Undo',
      description: 'Undo the last action',
      icon: RotateCcw,
      keywords: ['undo', 'revert'],
      shortcut: 'Ctrl+Z',
      action: () => onCommand('undo'),
      category: 'Edit'
    },
    {
      id: 'edit.redo',
      title: 'Redo',
      description: 'Redo the last undone action',
      icon: RotateCcw,
      keywords: ['redo', 'repeat'],
      shortcut: 'Ctrl+Y',
      action: () => onCommand('redo'),
      category: 'Edit'
    },
    {
      id: 'edit.copy',
      title: 'Copy',
      description: 'Copy selected text',
      icon: Copy,
      keywords: ['copy', 'duplicate'],
      shortcut: 'Ctrl+C',
      action: () => onCommand('copy'),
      category: 'Edit'
    },
    {
      id: 'edit.paste',
      title: 'Paste',
      description: 'Paste from clipboard',
      icon: Copy,
      keywords: ['paste', 'insert'],
      shortcut: 'Ctrl+V',
      action: () => onCommand('paste'),
      category: 'Edit'
    },
    {
      id: 'edit.find',
      title: 'Find',
      description: 'Find text in current file',
      icon: Search,
      keywords: ['find', 'search', 'text'],
      shortcut: 'Ctrl+F',
      action: () => onCommand('find'),
      category: 'Edit'
    },
    {
      id: 'edit.replace',
      title: 'Replace',
      description: 'Find and replace text',
      icon: Search,
      keywords: ['replace', 'find', 'substitute'],
      shortcut: 'Ctrl+H',
      action: () => onCommand('replace'),
      category: 'Edit'
    },

    // View Operations
    {
      id: 'view.commandPalette',
      title: 'Command Palette',
      description: 'Open command palette',
      icon: Keyboard,
      keywords: ['command', 'palette', 'commands'],
      shortcut: 'Ctrl+Shift+P',
      action: () => onCommand('command-palette'),
      category: 'View'
    },
    {
      id: 'view.quickOpen',
      title: 'Quick Open',
      description: 'Quickly open files',
      icon: FileText,
      keywords: ['quick', 'open', 'files'],
      shortcut: 'Ctrl+P',
      action: () => onCommand('quick-open'),
      category: 'View'
    },
    {
      id: 'view.toggleSidebar',
      title: 'Toggle Sidebar',
      description: 'Show or hide the sidebar',
      icon: FileText,
      keywords: ['sidebar', 'toggle', 'panel'],
      shortcut: 'Ctrl+B',
      action: () => onCommand('toggle-sidebar'),
      category: 'View'
    },
    {
      id: 'view.toggleTerminal',
      title: 'Toggle Terminal',
      description: 'Show or hide the terminal',
      icon: Terminal,
      keywords: ['terminal', 'console', 'toggle'],
      shortcut: 'Ctrl+`',
      action: () => onCommand('toggle-terminal'),
      category: 'View'
    },

    // Git Operations
    {
      id: 'git.commit',
      title: 'Commit Changes',
      description: 'Commit staged changes',
      icon: GitBranch,
      keywords: ['commit', 'git', 'save'],
      shortcut: 'Ctrl+Shift+C',
      action: () => onCommand('git-commit'),
      category: 'Git'
    },
    {
      id: 'git.push',
      title: 'Push Changes',
      description: 'Push commits to remote',
      icon: Upload,
      keywords: ['push', 'git', 'upload'],
      shortcut: 'Ctrl+Shift+P',
      action: () => onCommand('git-push'),
      category: 'Git'
    },
    {
      id: 'git.pull',
      title: 'Pull Changes',
      description: 'Pull changes from remote',
      icon: Download,
      keywords: ['pull', 'git', 'download'],
      shortcut: 'Ctrl+Shift+P',
      action: () => onCommand('git-pull'),
      category: 'Git'
    },
    {
      id: 'git.status',
      title: 'Git Status',
      description: 'Show git status',
      icon: GitBranch,
      keywords: ['status', 'git', 'changes'],
      action: () => onCommand('git-status'),
      category: 'Git'
    },

    // AI Operations
    {
      id: 'ai.chat',
      title: 'AI Chat',
      description: 'Open AI assistant',
      icon: MessageSquare,
      keywords: ['ai', 'chat', 'assistant'],
      shortcut: 'Ctrl+Shift+A',
      action: () => onCommand('ai-chat'),
      category: 'AI'
    },
    {
      id: 'ai.explain',
      title: 'Explain Code',
      description: 'Explain selected code',
      icon: MessageSquare,
      keywords: ['explain', 'ai', 'code'],
      action: () => onCommand('ai-explain'),
      category: 'AI'
    },
    {
      id: 'ai.generate',
      title: 'Generate Code',
      description: 'Generate code with AI',
      icon: Code,
      keywords: ['generate', 'ai', 'code'],
      action: () => onCommand('ai-generate'),
      category: 'AI'
    },
    {
      id: 'ai.refactor',
      title: 'Refactor Code',
      description: 'Refactor selected code',
      icon: Code,
      keywords: ['refactor', 'ai', 'improve'],
      action: () => onCommand('ai-refactor'),
      category: 'AI'
    },

    // Debug Operations
    {
      id: 'debug.start',
      title: 'Start Debugging',
      description: 'Start debugging session',
      icon: Play,
      keywords: ['debug', 'start', 'run'],
      shortcut: 'F5',
      action: () => onCommand('debug-start'),
      category: 'Debug'
    },
    {
      id: 'debug.stop',
      title: 'Stop Debugging',
      description: 'Stop debugging session',
      icon: Bug,
      keywords: ['debug', 'stop', 'end'],
      shortcut: 'Shift+F5',
      action: () => onCommand('debug-stop'),
      category: 'Debug'
    },
    {
      id: 'debug.toggleBreakpoint',
      title: 'Toggle Breakpoint',
      description: 'Toggle breakpoint on current line',
      icon: Bug,
      keywords: ['breakpoint', 'debug', 'toggle'],
      shortcut: 'F9',
      action: () => onCommand('debug-breakpoint'),
      category: 'Debug'
    },

    // Settings
    {
      id: 'settings.open',
      title: 'Open Settings',
      description: 'Open application settings',
      icon: Settings,
      keywords: ['settings', 'preferences', 'config'],
      shortcut: 'Ctrl+,',
      action: () => onCommand('settings'),
      category: 'Settings'
    },
    {
      id: 'settings.theme',
      title: 'Toggle Theme',
      description: 'Switch between light and dark theme',
      icon: Palette,
      keywords: ['theme', 'dark', 'light', 'color'],
      shortcut: 'Ctrl+Shift+T',
      action: () => onCommand('toggle-theme'),
      category: 'Settings'
    },
    {
      id: 'settings.keyboard',
      title: 'Keyboard Shortcuts',
      description: 'View and edit keyboard shortcuts',
      icon: Keyboard,
      keywords: ['shortcuts', 'keyboard', 'keys'],
      shortcut: 'Ctrl+K Ctrl+S',
      action: () => onCommand('keyboard-shortcuts'),
      category: 'Settings'
    },
  ];

  const filteredCommands = commands.filter(command => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      command.title.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  });

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    if (!groups[command.category]) {
      groups[command.category] = [];
    }
    groups[command.category].push(command);
    return groups;
  }, {} as Record<string, CommandItem[]>);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (command: CommandItem) => {
    command.action();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              ref={inputRef}
              placeholder="Type a command or search..."
              value={search}
              onValueChange={setSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-96 overflow-y-auto overflow-x-hidden">
            {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
              <Command.Group key={category} heading={category}>
                {categoryCommands.map((command) => {
                  const Icon = command.icon;
                  return (
                    <Command.Item
                      key={command.id}
                      value={command.title}
                      onSelect={() => handleSelect(command)}
                      className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent"
                    >
                      <Icon className="h-4 w-4" />
                      <div className="flex-1">
                        <div className="font-medium">{command.title}</div>
                        {command.description && (
                          <div className="text-xs text-muted-foreground">
                            {command.description}
                          </div>
                        )}
                      </div>
                      {command.shortcut && (
                        <Badge variant="outline" className="text-xs">
                          {command.shortcut}
                        </Badge>
                      )}
                    </Command.Item>
                  );
                })}
              </Command.Group>
            ))}
            {filteredCommands.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No commands found.
              </div>
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
