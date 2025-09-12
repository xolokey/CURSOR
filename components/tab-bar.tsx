'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  FileText, 
  FileCode, 
  FileImage, 
  FileJson, 
  Database,
  Code,
  Save,
  AlertCircle,
  CheckCircle,
  Circle
} from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  path: string;
  isDirty: boolean;
  isActive: boolean;
  type: 'file' | 'folder';
  extension?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabCloseOthers?: (tabId: string) => void;
  onTabCloseAll?: () => void;
  onTabCloseToRight?: (tabId: string) => void;
  onTabCloseToLeft?: (tabId: string) => void;
}

export function TabBar({ 
  tabs, 
  activeTabId, 
  onTabSelect, 
  onTabClose,
  onTabCloseOthers,
  onTabCloseAll,
  onTabCloseToRight,
  onTabCloseToLeft
}: TabBarProps) {
  const [contextMenuTab, setContextMenuTab] = useState<string | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const getFileIcon = (tab: Tab) => {
    if (tab.type === 'folder') {
      return <FileText className="w-3 h-3" />;
    }

    const ext = tab.extension?.toLowerCase();
    switch (ext) {
      case '.tsx':
      case '.ts':
      case '.js':
      case '.jsx':
        return <FileCode className="w-3 h-3 text-blue-400" />;
      case '.css':
      case '.scss':
      case '.sass':
        return <FileCode className="w-3 h-3 text-pink-400" />;
      case '.json':
        return <FileJson className="w-3 h-3 text-yellow-400" />;
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
      case '.svg':
        return <FileImage className="w-3 h-3 text-green-400" />;
      case '.sql':
        return <Database className="w-3 h-3 text-orange-400" />;
      case '.md':
        return <FileText className="w-3 h-3 text-gray-400" />;
      default:
        return <FileText className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (tab: Tab) => {
    if (tab.isDirty) {
      return <Circle className="w-2 h-2 text-blue-500 fill-current" />;
    }
    return <CheckCircle className="w-2 h-2 text-green-500" />;
  };

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setContextMenuTab(tabId);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenuTab) return;

    switch (action) {
      case 'close':
        onTabClose(contextMenuTab);
        break;
      case 'closeOthers':
        onTabCloseOthers?.(contextMenuTab);
        break;
      case 'closeToRight':
        onTabCloseToRight?.(contextMenuTab);
        break;
      case 'closeToLeft':
        onTabCloseToLeft?.(contextMenuTab);
        break;
      case 'closeAll':
        onTabCloseAll?.();
        break;
    }
    setContextMenuTab(null);
  };

  if (tabs.length === 0) {
    return (
      <div className="h-8 bg-tab-inactiveBackground border-b border-tab-border flex items-center px-2">
        <div className="text-xs text-muted-foreground">No files open</div>
      </div>
    );
  }

  return (
    <div className="h-8 bg-tab-inactiveBackground border-b border-tab-border flex items-center overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center min-w-0 max-w-48 group ${
            tab.isActive 
              ? 'bg-tab-activeBackground border-r border-tab-border' 
              : 'bg-tab-inactiveBackground hover:bg-tab-hoverBackground'
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 text-xs justify-start flex-1 min-w-0 ${
              tab.isActive ? 'text-tab-activeForeground' : 'text-tab-inactiveForeground'
            }`}
            onClick={() => onTabSelect(tab.id)}
            onContextMenu={(e) => handleContextMenu(e, tab.id)}
          >
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {getFileIcon(tab)}
              <span className="truncate">{tab.name}</span>
              {getStatusIcon(tab)}
            </div>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-tab-closeButton-hoverBackground"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}

      {/* Context Menu */}
      {contextMenuTab && (
        <div
          className="fixed z-50 bg-popover border border-popover-border rounded-md shadow-lg py-1 min-w-32"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
          }}
          onMouseLeave={() => setContextMenuTab(null)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-7"
            onClick={() => handleContextMenuAction('close')}
          >
            Close
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-7"
            onClick={() => handleContextMenuAction('closeOthers')}
          >
            Close Others
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-7"
            onClick={() => handleContextMenuAction('closeToRight')}
          >
            Close to Right
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-7"
            onClick={() => handleContextMenuAction('closeToLeft')}
          >
            Close to Left
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-7"
            onClick={() => handleContextMenuAction('closeAll')}
          >
            Close All
          </Button>
        </div>
      )}
    </div>
  );
}
