'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  GitBranch, 
  GitCommit, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Zap, 
  Wifi, 
  WifiOff,
  Bell,
  Settings,
  Terminal,
  MessageSquare,
  Code,
  Bug,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface StatusBarProps {
  gitStatus?: {
    current: string;
    ahead: number;
    behind: number;
    modified: number;
    staged: number;
  };
  diagnostics?: {
    errors: number;
    warnings: number;
    info: number;
  };
  isConnected?: boolean;
  onAction?: (action: string) => void;
}

export function StatusBar({ 
  gitStatus, 
  diagnostics = { errors: 0, warnings: 0, info: 0 },
  isConnected = true,
  onAction 
}: StatusBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDebugging, setIsDebugging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getDiagnosticIcon = () => {
    if (diagnostics.errors > 0) {
      return <AlertCircle className="w-3 h-3 text-red-500" />;
    }
    if (diagnostics.warnings > 0) {
      return <AlertCircle className="w-3 h-3 text-yellow-500" />;
    }
    if (diagnostics.info > 0) {
      return <Info className="w-3 h-3 text-blue-500" />;
    }
    return <CheckCircle className="w-3 h-3 text-green-500" />;
  };

  const getDiagnosticCount = () => {
    const total = diagnostics.errors + diagnostics.warnings + diagnostics.info;
    return total > 0 ? total : '';
  };

  return (
    <div className="h-6 bg-statusBar-background border-t border-statusBar-border flex items-center justify-between px-2 text-xs text-statusBar-foreground">
      {/* Left side */}
      <div className="flex items-center space-x-2">
        {/* Git Status */}
        {gitStatus && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
              onClick={() => onAction?.('git-status')}
            >
              <GitBranch className="w-3 h-3 mr-1" />
              {gitStatus.current}
              {gitStatus.ahead > 0 && (
                <Badge variant="outline" className="ml-1 text-xs">
                  +{gitStatus.ahead}
                </Badge>
              )}
              {gitStatus.behind > 0 && (
                <Badge variant="outline" className="ml-1 text-xs">
                  -{gitStatus.behind}
                </Badge>
              )}
            </Button>
            <Separator orientation="vertical" className="h-4" />
          </>
        )}

        {/* Diagnostics */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
          onClick={() => onAction?.('problems')}
        >
          {getDiagnosticIcon()}
          <span className="ml-1">{getDiagnosticCount()}</span>
        </Button>

        {/* Connection Status */}
        <div className="flex items-center">
          {isConnected ? (
            <Wifi className="w-3 h-3 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 text-red-500" />
          )}
        </div>
      </div>

      {/* Center - Debug Controls */}
      <div className="flex items-center space-x-1">
        {isDebugging ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
              onClick={() => {
                setIsDebugging(false);
                onAction?.('debug-stop');
              }}
            >
              <Square className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
              onClick={() => onAction?.('debug-pause')}
            >
              <Pause className="w-3 h-3" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
            onClick={() => {
              setIsDebugging(true);
              onAction?.('debug-start');
            }}
          >
            <Play className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        {/* AI Status */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
          onClick={() => onAction?.('ai-status')}
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          AI
        </Button>

        <Separator orientation="vertical" className="h-4" />

        {/* Language Mode */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
          onClick={() => onAction?.('select-language')}
        >
          <Code className="w-3 h-3 mr-1" />
          TypeScript
        </Button>

        <Separator orientation="vertical" className="h-4" />

        {/* Terminal */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
          onClick={() => onAction?.('toggle-terminal')}
        >
          <Terminal className="w-3 h-3 mr-1" />
          Terminal
        </Button>

        <Separator orientation="vertical" className="h-4" />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
          onClick={() => onAction?.('notifications')}
        >
          <Bell className="w-3 h-3" />
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs hover:bg-statusBar-item-hoverBackground"
          onClick={() => onAction?.('settings')}
        >
          <Settings className="w-3 h-3" />
        </Button>

        <Separator orientation="vertical" className="h-4" />

        {/* Time */}
        <div className="text-xs text-statusBar-foreground">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
}
