'use client';

import { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Play, 
  Save, 
  Code, 
  Brain, 
  TestTube, 
  GitBranch, 
  Users, 
  BarChart3,
  Shield,
  Zap,
  MessageSquare,
  FileText,
  Search,
  Settings,
  Terminal,
  File,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Activity,
  Bell,
  Command,
  Maximize2,
  Minimize2,
  X,
  Menu,
  Home,
  Search as SearchIcon,
  GitCommit,
  Bug,
  Lightbulb,
  History,
  BookOpen,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
  isOpen?: boolean;
  isActive?: boolean;
}

interface Tab {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
  fileId: string;
}

export default function CursorUI() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: 'root',
      name: 'ai-platform',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: [
            {
              id: 'components',
              name: 'components',
              type: 'folder',
              isOpen: true,
              children: [
                {
                  id: 'AICodingInterface.tsx',
                  name: 'AICodingInterface.tsx',
                  type: 'file',
                  content: `'use client';

import { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

export default function AICodingInterface() {
  const [code, setCode] = useState('// Welcome to AI-Powered Development Platform');
  
  return (
    <div className="h-screen flex flex-col">
      <Editor
        height="100%"
        language="typescript"
        value={code}
        onChange={(value) => setCode(value || '')}
        theme="vs-dark"
      />
    </div>
  );
}`,
                  language: 'typescript'
                },
                {
                  id: 'TestingSystem.tsx',
                  name: 'TestingSystem.tsx',
                  type: 'file',
                  content: `import { useState } from 'react';

export default function TestingSystem() {
  const [tests, setTests] = useState([]);
  
  const generateTests = async () => {
    // AI test generation logic
  };
  
  return (
    <div>
      <h2>Testing System</h2>
      <button onClick={generateTests}>Generate Tests</button>
    </div>
  );
}`,
                  language: 'typescript'
                }
              ]
            },
            {
              id: 'types',
              name: 'types',
              type: 'folder',
              children: [
                {
                  id: 'AITypes.ts',
                  name: 'AITypes.ts',
                  type: 'file',
                  content: `export interface AIAgent {
  id: string;
  name: string;
  capabilities: string[];
}

export interface CodeContext {
  file: string;
  content: string;
  language: string;
}`,
                  language: 'typescript'
                }
              ]
            }
          ]
        },
        {
          id: 'app',
          name: 'app',
          type: 'folder',
          children: [
            {
              id: 'page.tsx',
              name: 'page.tsx',
              type: 'file',
              content: `export default function Home() {
  return (
    <div>
      <h1>AI Development Platform</h1>
    </div>
  );
}`,
              language: 'typescript'
            }
          ]
        },
        {
          id: 'package.json',
          name: 'package.json',
          type: 'file',
          content: `{
  "name": "ai-development-platform",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "next": "^14.0.0"
  }
}`,
          language: 'json'
        }
      ]
    }
  ]);
  
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: '1',
      type: 'suggestion',
      content: 'Consider adding error handling to this function',
      confidence: 0.95,
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'optimization',
      content: 'This could be optimized using useMemo for better performance',
      confidence: 0.88,
      timestamp: new Date()
    }
  ]);

  const editorRef = useRef<any>(null);

  // Open file and create tab
  const openFile = (file: FileNode) => {
    if (file.type === 'file' && file.content) {
      const existingTab = tabs.find(tab => tab.fileId === file.id);
      if (existingTab) {
        setActiveTab(existingTab.id);
        return;
      }

      const newTab: Tab = {
        id: `tab-${file.id}`,
        name: file.name,
        content: file.content,
        language: file.language || 'typescript',
        isDirty: false,
        fileId: file.id
      };

      setTabs(prev => [...prev, newTab]);
      setActiveTab(newTab.id);
    }
  };

  // Close tab
  const closeTab = (tabId: string) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null);
    }
  };

  // Toggle folder
  const toggleFolder = (folderId: string) => {
    const updateTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === folderId) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };
    setFileTree(updateTree(fileTree));
  };

  // Render file tree
  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <div
          className={`flex items-center py-0.5 px-1 hover:bg-[#2a2d2e] cursor-pointer text-sm select-none ${
            node.isActive ? 'bg-[#094771]' : ''
          }`}
          style={{ paddingLeft: `${level * 12 + 4}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              openFile(node);
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="w-3 h-3 mr-1 text-[#cccccc]" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1 text-[#cccccc]" />
              )}
              {node.isOpen ? (
                <FolderOpen className="w-4 h-4 mr-2 text-[#4ec9b0]" />
              ) : (
                <Folder className="w-4 h-4 mr-2 text-[#4ec9b0]" />
              )}
            </>
          ) : (
            <>
              <div className="w-3 h-3 mr-1" />
              <File className="w-4 h-4 mr-2 text-[#cccccc]" />
            </>
          )}
          <span className="text-[#cccccc] text-sm">{node.name}</span>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>
            {renderFileTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="h-screen flex flex-col bg-[#1e1e1e] text-white font-mono">
      {/* Top Menu Bar */}
      <div className="h-7 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-3 text-xs">
        <div className="flex items-center space-x-6">
          <span className="text-[#cccccc] hover:text-white cursor-pointer">File</span>
          <span className="text-[#cccccc] hover:text-white cursor-pointer">Edit</span>
          <span className="text-[#cccccc] hover:text-white cursor-pointer">View</span>
          <span className="text-[#cccccc] hover:text-white cursor-pointer">Go</span>
          <span className="text-[#cccccc] hover:text-white cursor-pointer">Run</span>
          <span className="text-[#cccccc] hover:text-white cursor-pointer">Terminal</span>
          <span className="text-[#cccccc] hover:text-white cursor-pointer">Help</span>
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-[#cccccc] text-xs">AI Development Platform</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="h-5 w-5 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center">
            <Minimize2 className="w-3 h-3 text-[#cccccc]" />
          </button>
          <button className="h-5 w-5 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center">
            <Maximize2 className="w-3 h-3 text-[#cccccc]" />
          </button>
          <button className="h-5 w-5 hover:bg-[#e81123] rounded-sm flex items-center justify-center">
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-12' : 'w-64'} bg-[#252526] border-r border-[#3e3e42] flex flex-col transition-all duration-200`}>
          {/* Sidebar Header */}
          <div className="h-9 border-b border-[#3e3e42] flex items-center px-3">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-[#cccccc]" />
                <span className="text-xs text-[#cccccc] font-semibold tracking-wide">EXPLORER</span>
              </div>
            )}
            <button
              className="ml-auto h-6 w-6 p-0 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="w-4 h-4 text-[#cccccc]" />
            </button>
          </div>

          {/* Sidebar Content */}
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {renderFileTree(fileTree)}
              </div>
            </div>
          )}

          {/* Sidebar Icons when collapsed */}
          {sidebarCollapsed && (
            <div className="flex-1 flex flex-col items-center py-2 space-y-1">
              <button className="h-8 w-8 p-0 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center">
                <Home className="w-4 h-4 text-[#cccccc]" />
              </button>
              <button className="h-8 w-8 p-0 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center">
                <SearchIcon className="w-4 h-4 text-[#cccccc]" />
              </button>
              <button className="h-8 w-8 p-0 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-[#cccccc]" />
              </button>
              <button className="h-8 w-8 p-0 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center">
                <Bug className="w-4 h-4 text-[#cccccc]" />
              </button>
              <button className="h-8 w-8 p-0 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center">
                <Activity className="w-4 h-4 text-[#cccccc]" />
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="h-9 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center">
            <div className="flex items-center">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center px-4 py-1 text-sm cursor-pointer border-r border-[#3e3e42] ${
                    activeTab === tab.id
                      ? 'bg-[#1e1e1e] text-[#ffffff] border-b-2 border-[#007acc]'
                      : 'bg-[#2d2d30] text-[#cccccc] hover:bg-[#3e3e42]'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <File className="w-3 h-3 mr-2" />
                  <span className="text-sm">{tab.name}</span>
                  {tab.isDirty && <div className="w-2 h-2 bg-[#f39c12] rounded-full ml-2" />}
                  <button
                    className="ml-2 h-4 w-4 p-0 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex items-center space-x-1 px-2">
              <button className="h-6 w-6 p-0 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center">
                <Plus className="w-4 h-4 text-[#cccccc]" />
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex">
            {/* Main Editor */}
            <div className="flex-1">
              {activeTabData ? (
                <Editor
                  height="100%"
                  language={activeTabData.language}
                  value={activeTabData.content}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    renderWhitespace: 'selection',
                    cursorBlinking: 'blink',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    contextmenu: true,
                    mouseWheelZoom: true,
                    multiCursorModifier: 'ctrlCmd',
                    formatOnPaste: true,
                    formatOnType: true,
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: 'on',
                    tabCompletion: 'on',
                    wordBasedSuggestions: 'off',
                    parameterHints: { enabled: true },
                    quickSuggestions: {
                      other: true,
                      comments: false,
                      strings: false
                    }
                  }}
                  onMount={(editor) => {
                    editorRef.current = editor;
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
                  <div className="text-center">
                    <Code className="w-16 h-16 text-[#3e3e42] mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-[#cccccc] mb-2">Welcome to AI Development Platform</h2>
                    <p className="text-[#808080]">Open a file from the explorer to start coding</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - AI Assistant */}
            <div className="w-80 bg-[#252526] border-l border-[#3e3e42] flex flex-col">
              {/* AI Assistant Header */}
              <div className="h-9 border-b border-[#3e3e42] flex items-center px-3">
                <Brain className="w-4 h-4 text-[#4ec9b0] mr-2" />
                <span className="text-sm font-medium text-[#cccccc]">AI Assistant</span>
                <div className="flex-1" />
                <div className="px-2 py-0.5 bg-[#0e639c] rounded text-xs text-white">
                  Active
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-3 bg-[#2d2d30] rounded border border-[#3e3e42]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`px-2 py-0.5 rounded text-xs ${
                          suggestion.type === 'suggestion' ? 'bg-[#0e639c] text-white' :
                          suggestion.type === 'optimization' ? 'bg-[#4ec9b0] text-[#1e1e1e]' : 'bg-[#3e3e42] text-[#cccccc]'
                        }`}>
                          {suggestion.type}
                        </div>
                        <span className="text-xs text-[#808080]">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-[#cccccc]">{suggestion.content}</p>
                      <p className="text-xs text-[#808080] mt-2">
                        {suggestion.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Chat Input */}
              <div className="border-t border-[#3e3e42] p-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask AI..."
                    className="flex-1 bg-[#3c3c3c] border border-[#3e3e42] rounded px-3 py-2 text-sm text-[#cccccc] placeholder-[#808080] focus:outline-none focus:border-[#007acc]"
                  />
                  <button className="px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] rounded text-sm text-white">
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="h-48 bg-[#1e1e1e] border-t border-[#3e3e42] flex flex-col">
            {/* Panel Tabs */}
            <div className="h-8 border-b border-[#3e3e42] flex items-center px-3">
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-[#4ec9b0] border-b border-[#4ec9b0]">Terminal</span>
                <span className="text-[#808080] hover:text-[#cccccc] cursor-pointer">Problems</span>
                <span className="text-[#808080] hover:text-[#cccccc] cursor-pointer">Output</span>
                <span className="text-[#808080] hover:text-[#cccccc] cursor-pointer">Debug Console</span>
              </div>
              <div className="flex-1" />
              <button className="h-6 w-6 p-0 hover:bg-[#3e3e42] rounded-sm flex items-center justify-center">
                <X className="w-3 h-3 text-[#cccccc]" />
              </button>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 p-3 font-mono text-sm bg-[#0c0c0c]">
              <div className="text-[#4ec9b0]">$ npm run dev</div>
              <div className="text-[#cccccc]">Starting development server...</div>
              <div className="text-[#cccccc]">✓ Ready on http://localhost:3000</div>
              <div className="text-[#cccccc]">✓ Compiled successfully</div>
              <div className="text-[#808080]">$ _</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] border-t border-[#3e3e42] flex items-center px-3 text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-white">Ln 1, Col 1</span>
          <span className="text-white">TypeScript</span>
          <span className="text-white">UTF-8</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <span className="text-white">AI: Active</span>
          <span className="text-white">Git: main</span>
          <span className="text-white">No errors</span>
        </div>
      </div>
    </div>
  );
}