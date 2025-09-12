'use client';

import { useState, useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Save, 
  Play, 
  Bug, 
  FileText, 
  GitBranch, 
  GitCommit, 
  AlertCircle,
  CheckCircle,
  Info,
  Code,
  BarChart3,
  Settings
} from 'lucide-react';

interface CodeIssue {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
  source: string;
}

interface CodeMetrics {
  linesOfCode: number;
  linesOfComments: number;
  linesOfBlank: number;
  totalLines: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  technicalDebt: number;
}

interface AdvancedEditorProps {
  filePath: string;
  content: string;
  language: string;
  onSave: (content: string) => void;
  onRun?: () => void;
}

export function AdvancedEditor({ filePath, content, language, onSave, onRun }: AdvancedEditorProps) {
  const [code, setCode] = useState(content);
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [metrics, setMetrics] = useState<CodeMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setCode(content);
  }, [content]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure editor
    editor.updateOptions({
      minimap: { enabled: true },
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true,
      },
    });

    // Add keyboard shortcuts
    editor.addCommand(2097, () => { // Ctrl/Cmd + S
      handleSave();
    });

    editor.addCommand(2098, () => { // Ctrl/Cmd + R
      handleRun();
    });
  };

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(code);
      // Auto-analyze after save
      await analyzeCode();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = () => {
    if (onRun) {
      onRun();
    }
  };

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, content: code }),
      });

      if (response.ok) {
        const analysis = await response.json();
        setIssues(analysis.issues || []);
        setMetrics(analysis.metrics || null);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="font-mono text-sm">{filePath}</span>
          <Badge variant="outline" className="text-xs">
            {language}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={analyzeCode}
            disabled={isAnalyzing}
          >
            <Bug className="w-4 h-4 mr-1" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRun}
            disabled={!onRun}
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              tabSize: 2,
              insertSpaces: true,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              renderWhitespace: 'selection',
              cursorBlinking: 'blink',
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-muted/20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Quick Actions</h3>
                <div className="space-y-1">
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <Code className="w-4 h-4 mr-2" />
                    Format Code
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <GitCommit className="w-4 h-4 mr-2" />
                    Commit Changes
                  </Button>
                  <Button size="sm" variant="outline" className="w-full justify-start">
                    <GitBranch className="w-4 h-4 mr-2" />
                    Create Branch
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">File Info</h3>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Lines:</span>
                    <span>{code.split('\n').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Characters:</span>
                    <span>{code.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Words:</span>
                    <span>{code.split(/\s+/).filter(w => w).length}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="issues" className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Code Issues</h3>
                <ScrollArea className="h-96">
                  {issues.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p>No issues found</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {issues.map((issue, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-start gap-2">
                            {getSeverityIcon(issue.severity)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={getSeverityColor(issue.severity)} className="text-xs">
                                  {issue.severity}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Line {issue.line}, Col {issue.column}
                                </span>
                              </div>
                              <p className="text-sm">{issue.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Rule: {issue.rule}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Code Metrics</h3>
                {metrics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Lines of Code:</span>
                        <span>{metrics.linesOfCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Lines:</span>
                        <span>{metrics.totalLines}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comments:</span>
                        <span>{metrics.linesOfComments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Blank Lines:</span>
                        <span>{metrics.linesOfBlank}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Complexity:</span>
                        <span className={metrics.cyclomaticComplexity > 10 ? 'text-red-500' : 'text-green-500'}>
                          {metrics.cyclomaticComplexity}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Maintainability:</span>
                        <span className={metrics.maintainabilityIndex < 50 ? 'text-red-500' : 'text-green-500'}>
                          {metrics.maintainabilityIndex}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Technical Debt:</span>
                        <span className={metrics.technicalDebt > 60 ? 'text-red-500' : 'text-green-500'}>
                          {metrics.technicalDebt}m
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-xs">
                        <BarChart3 className="w-4 h-4" />
                        <span>Code Quality Score</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              metrics.maintainabilityIndex > 80 ? 'bg-green-500' :
                              metrics.maintainabilityIndex > 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${metrics.maintainabilityIndex}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                    <p>No metrics available</p>
                    <p className="text-xs">Analyze code to see metrics</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
