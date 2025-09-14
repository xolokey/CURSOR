'use client';

import { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Search
} from 'lucide-react';
import TestingSystem from './TestingSystem';
import DevOpsSystem from './DevOpsSystem';
import CollaborationSystem from './CollaborationSystem';

interface CodeFile {
  name: string;
  content: string;
  language: string;
  lastModified: Date;
}

interface AIResponse {
  type: 'suggestion' | 'explanation' | 'refactor' | 'test';
  content: string;
  confidence: number;
  timestamp: Date;
}

export default function AICodingInterface() {
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null);
  const [files, setFiles] = useState<CodeFile[]>([
    {
      name: 'main.ts',
      content: `// Welcome to AI-Powered Development Platform
// Start coding and let AI assist you!

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// AI will suggest optimizations, tests, and improvements
console.log(fibonacci(10));`,
      language: 'typescript',
      lastModified: new Date()
    }
  ]);
  
  const [aiResponses, setAiResponses] = useState<AIResponse[]>([]);
  const [isAIActive, setIsAIActive] = useState(true);
  const [selectedTab, setSelectedTab] = useState('code');
  const editorRef = useRef<any>(null);

  // AI-powered code analysis
  const analyzeCode = async (code: string) => {
    if (!isAIActive) return;
    
    // Simulate AI analysis
    const responses: AIResponse[] = [];
    
    // Pattern detection
    if (code.includes('fibonacci')) {
      responses.push({
        type: 'suggestion',
        content: 'Consider using memoization to optimize this recursive function for better performance.',
        confidence: 0.95,
        timestamp: new Date()
      });
    }
    
    // Test generation suggestion
    if (code.includes('function')) {
      responses.push({
        type: 'test',
        content: 'I can generate unit tests for your functions. Would you like me to create test cases?',
        confidence: 0.88,
        timestamp: new Date()
      });
    }
    
    // Code explanation
    if (code.length > 100) {
      responses.push({
        type: 'explanation',
        content: 'This code appears to implement a mathematical algorithm. I can explain the logic and suggest improvements.',
        confidence: 0.82,
        timestamp: new Date()
      });
    }
    
    setAiResponses(prev => [...responses, ...prev].slice(0, 10));
  };

  // Handle code changes
  const handleCodeChange = (value: string | undefined) => {
    if (!activeFile || !value) return;
    
    const updatedFile = { ...activeFile, content: value, lastModified: new Date() };
    setActiveFile(updatedFile);
    
    setFiles(prev => prev.map(f => f.name === activeFile.name ? updatedFile : f));
    
    // Trigger AI analysis
    setTimeout(() => analyzeCode(value), 1000);
  };

  // Generate tests
  const generateTests = async () => {
    if (!activeFile) return;
    
    const testCode = `// Generated tests for ${activeFile.name}
import { describe, it, expect } from 'vitest';

describe('${activeFile.name}', () => {
  it('should calculate fibonacci correctly', () => {
    expect(fibonacci(0)).toBe(0);
    expect(fibonacci(1)).toBe(1);
    expect(fibonacci(5)).toBe(5);
    expect(fibonacci(10)).toBe(55);
  });
  
  it('should handle edge cases', () => {
    expect(fibonacci(-1)).toBe(0);
  });
});`;
    
    const testFile: CodeFile = {
      name: `${activeFile.name.replace('.ts', '.test.ts')}`,
      content: testCode,
      language: 'typescript',
      lastModified: new Date()
    };
    
    setFiles(prev => [...prev, testFile]);
    setActiveFile(testFile);
  };

  // Run code
  const runCode = async () => {
    if (!activeFile) return;
    
    // Simulate code execution
    const response: AIResponse = {
      type: 'explanation',
      content: `Code executed successfully! Output: ${activeFile.content.includes('fibonacci(10)') ? '55' : 'No output detected'}`,
      confidence: 1.0,
      timestamp: new Date()
    };
    
    setAiResponses(prev => [response, ...prev].slice(0, 10));
  };

  // Initialize with first file
  useEffect(() => {
    if (files.length > 0 && !activeFile) {
      setActiveFile(files[0]);
    }
  }, [files, activeFile]);

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">AI Development Platform</h1>
            <Badge variant={isAIActive ? "default" : "secondary"}>
              <Brain className="w-4 h-4 mr-1" />
              AI {isAIActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAIActive(!isAIActive)}
            >
              <Brain className="w-4 h-4 mr-1" />
              Toggle AI
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <h3 className="font-semibold mb-4">Project Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  activeFile?.name === file.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setActiveFile(file)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{file.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {file.language}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold mb-2">AI Tools</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={generateTests}
              >
                <TestTube className="w-4 h-4 mr-2" />
                Generate Tests
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={runCode}
              >
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
            <TabsList className="bg-gray-800 border-b border-gray-700">
              <TabsTrigger value="code" className="flex items-center">
                <Code className="w-4 h-4 mr-2" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center">
                <TestTube className="w-4 h-4 mr-2" />
                Testing
              </TabsTrigger>
              <TabsTrigger value="devops" className="flex items-center">
                <GitBranch className="w-4 h-4 mr-2" />
                DevOps
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Collaboration
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="flex-1 m-0">
              <div className="h-full flex">
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={activeFile?.language || 'typescript'}
                    value={activeFile?.content || ''}
                    onChange={handleCodeChange}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                    }}
                    onMount={(editor) => {
                      editorRef.current = editor;
                    }}
                  />
                </div>
                
                {/* AI Suggestions Panel */}
                <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
                  <h3 className="font-semibold mb-4">AI Suggestions</h3>
                  <div className="space-y-3">
                    {aiResponses.map((response, index) => (
                      <Card key={index} className="bg-gray-700 border-gray-600">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge 
                              variant={
                                response.type === 'suggestion' ? 'default' :
                                response.type === 'test' ? 'secondary' :
                                response.type === 'explanation' ? 'outline' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {response.type}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {Math.round(response.confidence * 100)}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{response.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {response.timestamp.toLocaleTimeString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      AI Code Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Pattern Detection</h4>
                        <p className="text-sm text-gray-300">
                          AI has detected recursive patterns in your code. Consider optimization strategies.
                        </p>
                      </div>
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Code Quality</h4>
                        <p className="text-sm text-gray-300">
                          Your code has good structure. Suggestions for improvement available.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      AI Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-300">
                          Ask me anything about your code! I can explain, optimize, or help debug.
                        </p>
                      </div>
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="flex-1 m-0">
              <TestingSystem />
            </TabsContent>

            <TabsContent value="devops" className="flex-1 m-0">
              <DevOpsSystem />
            </TabsContent>

            <TabsContent value="collaboration" className="flex-1 m-0">
              <CollaborationSystem />
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Developer Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Lines of Code</h4>
                        <p className="text-2xl font-bold text-blue-400">1,247</p>
                      </div>
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Commits Today</h4>
                        <p className="text-2xl font-bold text-green-400">8</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Code Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Code Quality Score</h4>
                        <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <p className="text-sm text-gray-300">85/100</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Security Scan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        Run Security Scan
                      </Button>
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Vulnerabilities</h4>
                        <p className="text-sm text-green-400">✓ No critical issues found</p>
                        <p className="text-sm text-yellow-400">⚠ 2 minor warnings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      Secrets Detection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700 rounded-lg">
                        <h4 className="font-semibold mb-2">Secrets Scan</h4>
                        <p className="text-sm text-green-400">✓ No secrets detected</p>
                        <p className="text-sm text-gray-300">Last scan: 2 minutes ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}