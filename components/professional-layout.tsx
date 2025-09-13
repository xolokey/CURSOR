'use client';

import { useState, useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { ActivityBar } from './activity-bar';
import { CommandPalette } from './command-palette';
import { QuickOpen } from './quick-open';
import { StatusBar } from './status-bar';
import { TabBar } from './tab-bar';
import { Breadcrumb } from './breadcrumb';
import { FileExplorer as FileExplorerComponent } from './file-explorer';
import { GitPanel } from './git-panel';
import { AdvancedEditor } from './advanced-editor';
import { AdvancedAIPanel } from './advanced-ai-panel';
import { DebugPanel } from './debug-panel';
import { ExtensionMarketplace } from './extension-marketplace';
import { PackageManager } from './package-manager';
// AIChat and TerminalComponent will be passed as props
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Folder, 
  MessageSquare, 
  GitBranch, 
  Search, 
  Settings, 
  Play, 
  Bug, 
  Package, 
  Database, 
  Terminal, 
  BarChart3, 
  Users,
  Brain,
  Code,
  Zap 
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

interface Tab {
  id: string;
  name: string;
  path: string;
  isDirty: boolean;
  isActive: boolean;
  type: 'file' | 'folder';
  extension?: string;
}

interface ProfessionalLayoutProps {
  onNotification?: (message: string, type: 'success' | 'error' | 'info') => void;
  AIChatComponent?: React.ComponentType<any>;
  TerminalComponent?: React.ComponentType<any>;
}

export function ProfessionalLayout({ onNotification, AIChatComponent, TerminalComponent }: ProfessionalLayoutProps) {
  const [activePanel, setActivePanel] = useState<'explorer' | 'search' | 'git' | 'ai' | 'debug' | 'extensions' | 'packages' | 'none'>('explorer');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [currentFile, setCurrentFile] = useState<FileInfo | null>(null);
  const [code, setCode] = useState('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickOpenOpen, setIsQuickOpenOpen] = useState(false);
  const [isAdvancedAIVisible, setIsAdvancedAIVisible] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [gitStatus, setGitStatus] = useState({
    current: 'main',
    ahead: 0,
    behind: 0,
    modified: 0,
    staged: 0,
  });
  const [diagnostics, setDiagnostics] = useState({
    errors: 0,
    warnings: 0,
    info: 0,
  });

  // Keyboard shortcuts
  useHotkeys('ctrl+shift+p', () => setIsCommandPaletteOpen(true));
  useHotkeys('ctrl+p', () => setIsQuickOpenOpen(true));
  useHotkeys('ctrl+`', () => setIsTerminalVisible(!isTerminalVisible));
  useHotkeys('ctrl+b', () => setActivePanel(activePanel === 'explorer' ? 'none' : 'explorer'));
  useHotkeys('ctrl+shift+g', () => setActivePanel('git'));
  useHotkeys('ctrl+shift+a', () => setActivePanel('ai'));
  useHotkeys('ctrl+alt+a', () => setIsAdvancedAIVisible(!isAdvancedAIVisible));

  const handleFileSelect = async (file: FileInfo) => {
    setCurrentFile(file);
    if (file.type === 'file') {
      try {
        const response = await fetch(`/api/files?action=read&path=${encodeURIComponent(file.path)}`);
        if (response.ok) {
          const data = await response.json();
          setCode(data.content);
          
          // Add or update tab
          const newTab: Tab = {
            id: file.path,
            name: file.name,
            path: file.path,
            isDirty: false,
            isActive: true,
            type: file.type,
            extension: file.extension,
          };
          
          setTabs(prev => {
            const existing = prev.find(tab => tab.id === file.path);
            if (existing) {
              return prev.map(tab => 
                tab.id === file.path 
                  ? { ...tab, isActive: true }
                  : { ...tab, isActive: false }
              );
            }
            return prev.map(tab => ({ ...tab, isActive: false })).concat(newTab);
          });
          
          setActiveTab(file.path);
        }
      } catch (error) {
        console.error('Failed to load file:', error);
        onNotification?.('Failed to load file', 'error');
      }
    }
  };

  const handleFileOpen = async (file: FileInfo) => {
    await handleFileSelect(file);
  };

  const handleSave = async (content: string) => {
    if (currentFile) {
      try {
        const response = await fetch('/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'write',
            path: currentFile.path,
            content: content,
          }),
        });
        
        if (response.ok) {
          onNotification?.('File saved successfully!', 'success');
          setTabs(prev => prev.map(tab => 
            tab.id === currentFile.path 
              ? { ...tab, isDirty: false }
              : tab
          ));
        } else {
          onNotification?.('Failed to save file', 'error');
        }
      } catch (error) {
        console.error('Save failed:', error);
        onNotification?.('Failed to save file', 'error');
      }
    }
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setTabs(prev => prev.map(tab => 
      tab.id === tabId 
        ? { ...tab, isActive: true }
        : { ...tab, isActive: false }
    ));
    
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setCurrentFile({
        name: tab.name,
        path: tab.path,
        type: tab.type === 'folder' ? 'directory' : 'file',
        size: 0,
        modified: new Date(),
        created: new Date(),
        isHidden: false,
        extension: tab.extension,
      });
    }
  };

  const handleTabClose = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      if (tabId === activeTab) {
        const nextTab = newTabs[newTabs.length - 1];
        if (nextTab) {
          setActiveTab(nextTab.id);
          setTabs(prev => prev.map(tab => 
            tab.id === nextTab.id 
              ? { ...tab, isActive: true }
              : { ...tab, isActive: false }
          ));
        } else {
          setActiveTab(null);
          setCurrentFile(null);
          setCode('');
        }
      }
      return newTabs;
    });
  };

  const handleCommand = (command: string) => {
    switch (command) {
      case 'new-file':
        onNotification?.('New file command', 'info');
        break;
      case 'open-file':
        onNotification?.('Open file command', 'info');
        break;
      case 'save-file':
        handleSave(code);
        break;
      case 'toggle-sidebar':
        setActivePanel(activePanel === 'explorer' ? 'none' : 'explorer');
        break;
      case 'toggle-terminal':
        setIsTerminalVisible(!isTerminalVisible);
        break;
      case 'git-status':
        setActivePanel('git');
        break;
      case 'ai-chat':
        setActivePanel('ai');
        break;
      case 'toggle-advanced-ai':
        setIsAdvancedAIVisible(!isAdvancedAIVisible);
        break;
      default:
        onNotification?.(`Command: ${command}`, 'info');
    }
  };

  const handleQuickOpenSelect = (item: any) => {
    if (item.type === 'file') {
      handleFileSelect(item);
    } else {
      handleCommand(item.path);
    }
  };

  const getLanguageFromExtension = (extension?: string) => {
    if (!extension) return 'text';
    const languageMap: Record<string, string> = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.c': 'c',
      '.php': 'php',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
      '.swift': 'swift',
      '.kt': 'kotlin',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.json': 'json',
      '.md': 'markdown',
      '.xml': 'xml',
      '.yaml': 'yaml',
      '.yml': 'yaml',
    };
    return languageMap[extension.toLowerCase()] || 'text';
  };

  const breadcrumbItems = currentFile ? [
    { id: 'root', label: 'Workspace', path: '/', type: 'root' as const },
    { id: 'file', label: currentFile.name, path: currentFile.path, type: currentFile.type },
  ] : [
    { id: 'root', label: 'Workspace', path: '/', type: 'root' as const },
  ];

  const renderPanel = () => {
    switch (activePanel) {
      case 'explorer':
        return (
          <FileExplorerComponent 
            onFileSelect={handleFileSelect} 
            onFileOpen={handleFileOpen}
          />
        );
      case 'git':
        return <GitPanel />;
      case 'ai':
        return currentFile && AIChatComponent ? (
          <AIChatComponent 
            currentFile={{
              id: currentFile.path,
              name: currentFile.name,
              type: currentFile.type === 'directory' ? 'folder' : 'file',
              path: currentFile.path,
            }} 
            currentCode={code} 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4" />
              <p>Select a file to start AI chat</p>
            </div>
          </div>
        );
      case 'debug':
        return (
          <DebugPanel 
            currentFile={currentFile ? {
              name: currentFile.name,
              path: currentFile.path,
            } : undefined}
          />
        );
      case 'extensions':
        return <ExtensionMarketplace />;
      case 'packages':
        return <PackageManager />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Top Bar */}
      <div className="h-8 bg-titleBar-background border-b border-titleBar-border flex items-center justify-between px-2 text-xs text-titleBar-foreground">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">Cursor Clone</span>
          <span className="text-muted-foreground">-</span>
          <span>Untitled Workspace</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
            <span className="text-xs">−</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
            <span className="text-xs">□</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
            <span className="text-xs">×</span>
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Activity Bar */}
        <ActivityBar 
          activePanel={activePanel} 
          onPanelChange={setActivePanel}
          notifications={{
            files: 0,
            search: 0,
            git: gitStatus.modified + gitStatus.staged,
            ai: 0,
            debug: 0,
            extensions: 0,
            packages: 0,
            database: 0,
            terminal: 0,
            performance: 0,
            collaboration: 0,
            settings: 0,
          }}
        />

        {/* Sidebar */}
        {activePanel !== 'none' && (
          <div className="w-80 border-r border-sidebar-border bg-sidebar-background">
            {renderPanel()}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Breadcrumb */}
          <Breadcrumb 
            items={breadcrumbItems}
            onItemClick={(item) => {
              if (item.type === 'file' && currentFile) {
                // File is already selected, no need to reload
                return;
              }
            }}
          />

          {/* Tab Bar */}
          {tabs.length > 0 && (
            <TabBar
              tabs={tabs}
              activeTabId={activeTab || ''}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
              onTabCloseOthers={(tabId) => {
                setTabs(prev => prev.filter(tab => tab.id === tabId));
                setActiveTab(tabId);
              }}
              onTabCloseAll={() => {
                setTabs([]);
                setActiveTab(null);
                setCurrentFile(null);
                setCode('');
              }}
            />
          )}

          {/* Editor Area */}
          <div className="flex-1 flex">
            <div className="flex-1">
              {currentFile ? (
                <AdvancedEditor
                  filePath={currentFile.path}
                  content={code}
                  language={getLanguageFromExtension(currentFile.extension)}
                  onSave={handleSave}
                  onRun={() => onNotification?.('Running code...', 'info')}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center bg-editor-background">
                  <div className="text-center space-y-4">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold">Welcome to Cursor Clone</h3>
                      <p className="text-muted-foreground">Select a file from the explorer to start coding</p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <p>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+P</kbd> to quick open files</p>
                      <p>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Shift+P</kbd> to open command palette</p>
                      <p>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+`</kbd> to toggle terminal</p>
                      <p>Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Alt+A</kbd> to toggle advanced AI</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Advanced AI Panel */}
            {isAdvancedAIVisible && (
              <div className="w-80 border-l border-border bg-sidebar-background">
                <AdvancedAIPanel 
                  currentFile={currentFile ? {
                    name: currentFile.name,
                    path: currentFile.path,
                    content: code,
                  } : undefined}
                  onApplyEdit={(edit) => {
                    // Apply multi-line edit
                    onNotification?.(`Applied edit: ${edit.description}`, 'success');
                  }}
                  onApplyRewrite={(rewrite) => {
                    // Apply smart rewrite
                    setCode(rewrite.rewrittenCode);
                    onNotification?.(`Applied rewrite: ${rewrite.explanation}`, 'success');
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal */}
      {isTerminalVisible && TerminalComponent && (
        <div className="h-64 border-t border-terminal-border bg-terminal-background">
          <TerminalComponent 
            isVisible={isTerminalVisible} 
            onClose={() => setIsTerminalVisible(false)} 
          />
        </div>
      )}

      {/* Status Bar */}
      <StatusBar
        gitStatus={gitStatus}
        diagnostics={diagnostics}
        isConnected={true}
        onAction={(action) => {
          switch (action) {
            case 'git-status':
              setActivePanel('git');
              break;
            case 'toggle-terminal':
              setIsTerminalVisible(!isTerminalVisible);
              break;
            case 'ai-status':
              setActivePanel('ai');
              break;
            default:
              onNotification?.(`Action: ${action}`, 'info');
          }
        }}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onCommand={handleCommand}
      />

      {/* Quick Open */}
      <QuickOpen
        isOpen={isQuickOpenOpen}
        onClose={() => setIsQuickOpenOpen(false)}
        onItemSelect={handleQuickOpenSelect}
        recentFiles={tabs.map(tab => ({
          id: tab.id,
          name: tab.name,
          path: tab.path,
          type: tab.type,
          icon: FileText,
          category: 'Recent',
          lastOpened: new Date(),
        }))}
      />
    </div>
  );
}
