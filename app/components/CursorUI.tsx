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
          className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer text-sm ${
            node.isActive ? 'bg-blue-600' : ''
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
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
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1" />
              )}
              {node.isOpen ? (
                <FolderOpen className="w-4 h-4 mr-2 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 mr-2 text-blue-400" />
              )}
            </>
          ) : (
            <>
              <div className="w-3 h-3 mr-1" />
              <File className="w-4 h-4 mr-2 text-gray-400" />
            </>
          )}
          <span className="text-gray-300">{node.name}</span>
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
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Menu Bar */}
      <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-4 text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">File</span>
          <span className="text-gray-400">Edit</span>
          <span className="text-gray-400">View</span>
          <span className="text-gray-400">Go</span>
          <span className="text-gray-400">Run</span>
          <span className="text-gray-400">Terminal</span>
          <span className="text-gray-400">Help</span>
        </div>
        <div className="flex-1 flex justify-center">
          <span className="text-gray-300">AI Development Platform</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Maximize2 className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-12' : 'w-64'} bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-200`}>
          {/* Sidebar Header */}
          <div className="h-10 border-b border-gray-700 flex items-center px-3">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">EXPLORER</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-6 w-6 p-0"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu className="w-4 h-4" />
            </Button>
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
            <div className="flex-1 flex flex-col items-center py-4 space-y-4">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Home className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <SearchIcon className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <GitBranch className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bug className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Activity className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center">
            <div className="flex items-center space-x-1 px-2">
              {tabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`flex items-center px-3 py-1 rounded-t text-sm cursor-pointer border-r border-gray-700 ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white border-b-2 border-blue-500'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <File className="w-3 h-3 mr-2" />
                  <span>{tab.name}</span>
                  {tab.isDirty && <div className="w-2 h-2 bg-yellow-400 rounded-full ml-2" />}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-4 w-4 p-0 hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex-1" />
            <div className="flex items-center space-x-2 px-2">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="w-4 h-4" />
              </Button>
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
                <div className="h-full flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-400 mb-2">Welcome to AI Development Platform</h2>
                    <p className="text-gray-500">Open a file from the explorer to start coding</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - AI Assistant */}
            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
              {/* AI Assistant Header */}
              <div className="h-10 border-b border-gray-700 flex items-center px-3">
                <Brain className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-sm font-medium">AI Assistant</span>
                <div className="flex-1" />
                <Badge variant="default" className="text-xs">
                  Active
                </Badge>
              </div>

              {/* AI Suggestions */}
              <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="p-3 bg-gray-700 rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          variant={
                            suggestion.type === 'suggestion' ? 'default' :
                            suggestion.type === 'optimization' ? 'secondary' : 'outline'
                          }
                          className="text-xs"
                        >
                          {suggestion.type}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{suggestion.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {suggestion.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Chat Input */}
              <div className="border-t border-gray-700 p-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask AI..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  />
                  <Button size="sm">
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="h-48 bg-gray-800 border-t border-gray-700 flex flex-col">
            {/* Panel Tabs */}
            <div className="h-8 border-b border-gray-700 flex items-center px-3">
              <div className="flex items-center space-x-4 text-xs">
                <span className="text-blue-400 border-b border-blue-400">Terminal</span>
                <span className="text-gray-400">Problems</span>
                <span className="text-gray-400">Output</span>
                <span className="text-gray-400">Debug Console</span>
              </div>
              <div className="flex-1" />
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 p-3 font-mono text-sm">
              <div className="text-green-400">$ npm run dev</div>
              <div className="text-gray-300">Starting development server...</div>
              <div className="text-gray-300">✓ Ready on http://localhost:3000</div>
              <div className="text-gray-300">✓ Compiled successfully</div>
              <div className="text-gray-500">$ _</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-gray-800 border-t border-gray-700 flex items-center px-3 text-xs">
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">Ln 1, Col 1</span>
          <span className="text-gray-400">TypeScript</span>
          <span className="text-gray-400">UTF-8</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center space-x-4">
          <span className="text-gray-400">AI: Active</span>
          <span className="text-gray-400">Git: main</span>
          <span className="text-gray-400">No errors</span>
        </div>
      </div>
    </div>
  );
}