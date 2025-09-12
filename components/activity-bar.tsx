'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  GitBranch, 
  MessageSquare, 
  Settings, 
  Play, 
  Bug, 
  Database,
  Terminal,
  Package,
  BarChart3,
  Users,
  Zap
} from 'lucide-react';

interface ActivityBarProps {
  activePanel: string;
  onPanelChange: (panel: string) => void;
  notifications?: Record<string, number>;
}

export function ActivityBar({ activePanel, onPanelChange, notifications = {} }: ActivityBarProps) {
  const activities = [
    { id: 'explorer', icon: FileText, label: 'Explorer', badge: notifications.files },
    { id: 'search', icon: Search, label: 'Search', badge: notifications.search },
    { id: 'git', icon: GitBranch, label: 'Source Control', badge: notifications.git },
    { id: 'ai', icon: MessageSquare, label: 'AI Assistant', badge: notifications.ai },
    { id: 'debug', icon: Bug, label: 'Run and Debug', badge: notifications.debug },
    { id: 'extensions', icon: Package, label: 'Extensions', badge: notifications.extensions },
    { id: 'database', icon: Database, label: 'Database', badge: notifications.database },
    { id: 'terminal', icon: Terminal, label: 'Terminal', badge: notifications.terminal },
    { id: 'performance', icon: BarChart3, label: 'Performance', badge: notifications.performance },
    { id: 'collaboration', icon: Users, label: 'Collaboration', badge: notifications.collaboration },
    { id: 'settings', icon: Settings, label: 'Settings', badge: notifications.settings },
  ];

  return (
    <div className="w-12 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-2 space-y-1">
      {activities.map((activity) => {
        const Icon = activity.icon;
        const isActive = activePanel === activity.id;
        
        return (
          <Button
            key={activity.id}
            variant="ghost"
            size="sm"
            className={`w-10 h-10 p-0 relative ${
              isActive 
                ? 'bg-sidebar-accent text-sidebar-foreground' 
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
            onClick={() => onPanelChange(activity.id)}
            title={activity.label}
          >
            <Icon className="w-5 h-5" />
            {activity.badge && activity.badge > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {activity.badge > 99 ? '99+' : activity.badge}
              </Badge>
            )}
          </Button>
        );
      })}
      
      {/* Bottom section */}
      <div className="mt-auto space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          title="Quick Actions"
        >
          <Zap className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
