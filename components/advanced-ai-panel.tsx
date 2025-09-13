'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Wand2, 
  Code, 
  Play, 
  Pause, 
  Square, 
  CheckCircle, 
  XCircle, 
  Clock,
  Sparkles,
  Zap,
  Brain,
  Target,
  ArrowRight,
  Copy,
  Download,
  Upload,
  Settings,
  Trash2,
  Edit3,
  Plus,
  Minus
} from 'lucide-react';

interface MultiLineEdit {
  id: string;
  filePath: string;
  startLine: number;
  endLine: number;
  oldText: string;
  newText: string;
  description: string;
  confidence: number;
}

interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  steps: AgentStep[];
  result?: any;
  error?: string;
}

interface AgentStep {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  action: 'analyze' | 'edit' | 'create' | 'delete' | 'test' | 'commit';
  details?: any;
}

interface SmartRewrite {
  id: string;
  originalCode: string;
  rewrittenCode: string;
  improvements: string[];
  confidence: number;
  explanation: string;
}

interface AdvancedAIPanelProps {
  currentFile?: {
    name: string;
    path: string;
    content: string;
  };
  onApplyEdit?: (edit: MultiLineEdit) => void;
  onApplyRewrite?: (rewrite: SmartRewrite) => void;
}

export function AdvancedAIPanel({ currentFile, onApplyEdit, onApplyRewrite }: AdvancedAIPanelProps) {
  const [activeTab, setActiveTab] = useState('multi-edit');
  const [multiLineEdits, setMultiLineEdits] = useState<MultiLineEdit[]>([]);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [smartRewrites, setSmartRewrites] = useState<SmartRewrite[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskDescription, setTaskDescription] = useState('');
  const [rewritePrompt, setRewritePrompt] = useState('');

  const generateMultiLineEdits = async () => {
    if (!currentFile) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/multi-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentFile.content,
          filePath: currentFile.path,
          context: 'Improve code quality and performance',
        }),
      });

      if (response.ok) {
        const edits = await response.json();
        setMultiLineEdits(edits);
      }
    } catch (error) {
      console.error('Failed to generate multi-line edits:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const createAgentTask = async () => {
    if (!taskDescription.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/agent-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: taskDescription,
        }),
      });

      if (response.ok) {
        const task = await response.json();
        setAgentTasks(prev => [task, ...prev]);
        setTaskDescription('');
      }
    } catch (error) {
      console.error('Failed to create agent task:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSmartRewrite = async () => {
    if (!currentFile || !rewritePrompt.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/smart-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentFile.content,
          prompt: rewritePrompt,
        }),
      });

      if (response.ok) {
        const rewrite = await response.json();
        setSmartRewrites(prev => [rewrite, ...prev]);
        setRewritePrompt('');
      }
    } catch (error) {
      console.error('Failed to generate smart rewrite:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const executeAgentStep = async (taskId: string, stepId: string) => {
    try {
      const response = await fetch('/api/ai/execute-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, stepId }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setAgentTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ));
      }
    } catch (error) {
      console.error('Failed to execute agent step:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700';
      case 'failed':
        return 'bg-red-500/10 text-red-700';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <Card className="w-80 h-full bg-card border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Advanced AI</h3>
          {isGenerating && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
        </div>
        <p className="text-xs text-muted-foreground">
          Multi-line edits, agent mode, and smart rewrites
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="multi-edit">Multi-Edit</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="rewrite">Rewrite</TabsTrigger>
        </TabsList>

        <TabsContent value="multi-edit" className="flex-1 p-3 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              <h4 className="font-medium text-sm">Multi-Line Edits</h4>
            </div>
            <Button
              size="sm"
              onClick={generateMultiLineEdits}
              disabled={!currentFile || isGenerating}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Edits
            </Button>
          </div>

          <ScrollArea className="h-64">
            <div className="space-y-2">
              {multiLineEdits.map((edit) => (
                <Card key={edit.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {edit.filePath}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(edit.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm">{edit.description}</p>
                    <div className="text-xs text-muted-foreground">
                      Lines {edit.startLine}-{edit.endLine}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onApplyEdit?.(edit)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="agent" className="flex-1 p-3 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <h4 className="font-medium text-sm">Agent Mode</h4>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Describe a task for the AI agent..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="text-xs"
              />
              <Button
                size="sm"
                onClick={createAgentTask}
                disabled={!taskDescription.trim() || isGenerating}
                className="w-full"
              >
                <Bot className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          </div>

          <ScrollArea className="h-64">
            <div className="space-y-2">
              {agentTasks.map((task) => (
                <Card key={task.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="text-sm font-medium">{task.description}</span>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(task.status)}`}>
                        {task.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {task.steps.map((step) => (
                        <div key={step.id} className="flex items-center gap-2 text-xs">
                          {getStatusIcon(step.status)}
                          <span className="flex-1">{step.description}</span>
                          {step.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => executeAgentStep(task.id, step.id)}
                              className="h-6 px-2"
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="rewrite" className="flex-1 p-3 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <h4 className="font-medium text-sm">Smart Rewrite</h4>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Describe how to improve the code..."
                value={rewritePrompt}
                onChange={(e) => setRewritePrompt(e.target.value)}
                className="text-xs"
              />
              <Button
                size="sm"
                onClick={generateSmartRewrite}
                disabled={!currentFile || !rewritePrompt.trim() || isGenerating}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" />
                Rewrite Code
              </Button>
            </div>
          </div>

          <ScrollArea className="h-64">
            <div className="space-y-2">
              {smartRewrites.map((rewrite) => (
                <Card key={rewrite.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(rewrite.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm">{rewrite.explanation}</p>
                    <div className="space-y-1">
                      <h5 className="text-xs font-medium">Improvements:</h5>
                      {rewrite.improvements.map((improvement, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {improvement}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onApplyRewrite?.(rewrite)}
                        className="flex-1"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Apply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
