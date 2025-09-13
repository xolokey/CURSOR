'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bug, 
  Play, 
  Pause, 
  Square, 
  SkipForward, 
  ArrowDown, 
  ArrowUp,
  CheckCircle, 
  XCircle, 
  Clock,
  Settings,
  Plus,
  Minus,
  Trash2,
  Eye,
  EyeOff,
  Code,
  Terminal,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface Breakpoint {
  id: string;
  filePath: string;
  line: number;
  column?: number;
  condition?: string;
  hitCount?: number;
  enabled: boolean;
}

interface DebugSession {
  id: string;
  name: string;
  type: 'node' | 'browser' | 'python' | 'java' | 'cpp';
  status: 'stopped' | 'running' | 'paused' | 'terminated';
  breakpoints: Breakpoint[];
  variables: DebugVariable[];
  callStack: CallFrame[];
  currentFrame?: number;
}

interface DebugVariable {
  name: string;
  value: any;
  type: string;
  scope: 'local' | 'global' | 'closure';
  children?: DebugVariable[];
}

interface CallFrame {
  name: string;
  filePath: string;
  line: number;
  column: number;
  variables: DebugVariable[];
}

interface DebugPanelProps {
  currentFile?: {
    name: string;
    path: string;
  };
  onAddBreakpoint?: (filePath: string, line: number) => void;
  onRemoveBreakpoint?: (breakpointId: string) => void;
}

export function DebugPanel({ currentFile, onAddBreakpoint, onRemoveBreakpoint }: DebugPanelProps) {
  const [activeTab, setActiveTab] = useState('breakpoints');
  const [sessions, setSessions] = useState<DebugSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [breakpoints, setBreakpoints] = useState<Breakpoint[]>([]);
  const [variables, setVariables] = useState<DebugVariable[]>([]);
  const [callStack, setCallStack] = useState<CallFrame[]>([]);
  const [expandedVariables, setExpandedVariables] = useState<Set<string>>(new Set());
  const [expression, setExpression] = useState('');

  useEffect(() => {
    loadDebugSessions();
  }, []);

  const loadDebugSessions = async () => {
    try {
      const response = await fetch('/api/debug/sessions');
      if (response.ok) {
        const sessions = await response.json();
        setSessions(sessions);
      }
    } catch (error) {
      console.error('Failed to load debug sessions:', error);
    }
  };

  const createSession = async () => {
    try {
      const response = await fetch('/api/debug/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New Debug Session',
          type: 'node',
          request: 'launch',
        }),
      });

      if (response.ok) {
        const session = await response.json();
        setSessions(prev => [session, ...prev]);
        setCurrentSession(session.id);
      }
    } catch (error) {
      console.error('Failed to create debug session:', error);
    }
  };

  const startDebugging = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/debug/sessions/${sessionId}/start`, {
        method: 'POST',
      });

      if (response.ok) {
        setCurrentSession(sessionId);
        // Update session status
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'running' }
            : session
        ));
      }
    } catch (error) {
      console.error('Failed to start debugging:', error);
    }
  };

  const pauseDebugging = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/debug/sessions/${sessionId}/pause`, {
        method: 'POST',
      });

      if (response.ok) {
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'paused' }
            : session
        ));
      }
    } catch (error) {
      console.error('Failed to pause debugging:', error);
    }
  };

  const stopDebugging = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/debug/sessions/${sessionId}/stop`, {
        method: 'POST',
      });

      if (response.ok) {
        setSessions(prev => prev.map(session => 
          session.id === sessionId 
            ? { ...session, status: 'terminated' }
            : session
        ));
        if (currentSession === sessionId) {
          setCurrentSession(null);
        }
      }
    } catch (error) {
      console.error('Failed to stop debugging:', error);
    }
  };

  const addBreakpoint = async (filePath: string, line: number) => {
    if (!currentSession) return;

    try {
      const response = await fetch(`/api/debug/sessions/${currentSession}/breakpoints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, line }),
      });

      if (response.ok) {
        const breakpoint = await response.json();
        setBreakpoints(prev => [breakpoint, ...prev]);
        onAddBreakpoint?.(filePath, line);
      }
    } catch (error) {
      console.error('Failed to add breakpoint:', error);
    }
  };

  const removeBreakpoint = async (breakpointId: string) => {
    if (!currentSession) return;

    try {
      const response = await fetch(`/api/debug/sessions/${currentSession}/breakpoints/${breakpointId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBreakpoints(prev => prev.filter(bp => bp.id !== breakpointId));
        onRemoveBreakpoint?.(breakpointId);
      }
    } catch (error) {
      console.error('Failed to remove breakpoint:', error);
    }
  };

  const toggleBreakpoint = async (breakpointId: string) => {
    if (!currentSession) return;

    try {
      const response = await fetch(`/api/debug/sessions/${currentSession}/breakpoints/${breakpointId}/toggle`, {
        method: 'POST',
      });

      if (response.ok) {
        setBreakpoints(prev => prev.map(bp => 
          bp.id === breakpointId 
            ? { ...bp, enabled: !bp.enabled }
            : bp
        ));
      }
    } catch (error) {
      console.error('Failed to toggle breakpoint:', error);
    }
  };

  const stepOver = async () => {
    if (!currentSession) return;

    try {
      await fetch(`/api/debug/sessions/${currentSession}/step-over`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to step over:', error);
    }
  };

  const stepInto = async () => {
    if (!currentSession) return;

    try {
      await fetch(`/api/debug/sessions/${currentSession}/step-into`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to step into:', error);
    }
  };

  const stepOut = async () => {
    if (!currentSession) return;

    try {
      await fetch(`/api/debug/sessions/${currentSession}/step-out`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to step out:', error);
    }
  };

  const continueExecution = async () => {
    if (!currentSession) return;

    try {
      await fetch(`/api/debug/sessions/${currentSession}/continue`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to continue execution:', error);
    }
  };

  const evaluateExpression = async () => {
    if (!currentSession || !expression.trim()) return;

    try {
      const response = await fetch(`/api/debug/sessions/${currentSession}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Expression result:', result);
      }
    } catch (error) {
      console.error('Failed to evaluate expression:', error);
    }
  };

  const toggleVariableExpansion = (variableName: string) => {
    setExpandedVariables(prev => {
      const newSet = new Set(prev);
      if (newSet.has(variableName)) {
        newSet.delete(variableName);
      } else {
        newSet.add(variableName);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'stopped':
        return <Square className="w-4 h-4 text-gray-500" />;
      case 'terminated':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/10 text-green-700';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-700';
      case 'stopped':
        return 'bg-gray-500/10 text-gray-700';
      case 'terminated':
        return 'bg-red-500/10 text-red-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  const renderVariable = (variable: DebugVariable, depth = 0) => {
    const isExpanded = expandedVariables.has(variable.name);
    const hasChildren = variable.children && variable.children.length > 0;

    return (
      <div key={variable.name} className="ml-4">
        <div 
          className="flex items-center gap-2 py-1 cursor-pointer hover:bg-muted/50"
          onClick={() => hasChildren && toggleVariableExpansion(variable.name)}
        >
          {hasChildren && (
            isExpanded ? 
              <ChevronDown className="w-3 h-3" /> : 
              <ChevronRight className="w-3 h-3" />
          )}
          <span className="text-sm font-mono">{variable.name}</span>
          <span className="text-xs text-muted-foreground">:</span>
          <span className="text-sm">{String(variable.value)}</span>
          <Badge variant="outline" className="text-xs">
            {variable.type}
          </Badge>
        </div>
        {isExpanded && hasChildren && (
          <div>
            {variable.children!.map(child => renderVariable(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-80 h-full bg-card border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <Bug className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Debug</h3>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={createSession}>
            <Plus className="w-3 h-3 mr-1" />
            New
          </Button>
          {currentSession && (
            <>
              <Button size="sm" variant="outline" onClick={() => startDebugging(currentSession!)}>
                <Play className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => pauseDebugging(currentSession!)}>
                <Pause className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => stopDebugging(currentSession!)}>
                <Square className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="breakpoints">Breakpoints</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="callstack">Call Stack</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
        </TabsList>

        <TabsContent value="breakpoints" className="flex-1 p-3 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Breakpoints</h4>
              {currentFile && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addBreakpoint(currentFile.path, 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              )}
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {breakpoints.map((breakpoint) => (
                  <div key={breakpoint.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleBreakpoint(breakpoint.id)}
                      className="h-6 w-6 p-0"
                    >
                      {breakpoint.enabled ? 
                        <Eye className="w-3 h-3" /> : 
                        <EyeOff className="w-3 h-3" />
                      }
                    </Button>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono truncate">{breakpoint.filePath}</div>
                      <div className="text-xs text-muted-foreground">Line {breakpoint.line}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeBreakpoint(breakpoint.id)}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="variables" className="flex-1 p-3 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Variables</h4>
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {variables.map(variable => renderVariable(variable))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="callstack" className="flex-1 p-3 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Call Stack</h4>
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {callStack.map((frame, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                    <FileText className="w-3 h-3 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono">{frame.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {frame.filePath}:{frame.line}:{frame.column}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="console" className="flex-1 p-3 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Debug Console</h4>
            <div className="space-y-2">
              <div className="flex gap-1">
                <Input
                  placeholder="Enter expression to evaluate..."
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className="text-xs"
                />
                <Button size="sm" onClick={evaluateExpression}>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={stepOver}>
                  <SkipForward className="w-3 h-3 mr-1" />
                  Step Over
                </Button>
                <Button size="sm" variant="outline" onClick={stepInto}>
                  <ArrowDown className="w-3 h-3 mr-1" />
                  Step Into
                </Button>
                <Button size="sm" variant="outline" onClick={stepOut}>
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Step Out
                </Button>
                <Button size="sm" variant="outline" onClick={continueExecution}>
                  <Play className="w-3 h-3 mr-1" />
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
