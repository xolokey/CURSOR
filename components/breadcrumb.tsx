'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Home, 
  Folder, 
  FileText,
  Settings,
  Search,
  GitBranch,
  MessageSquare
} from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType<any>;
  type?: 'folder' | 'file' | 'directory' | 'root';
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onItemClick: (item: BreadcrumbItem) => void;
  onHomeClick?: () => void;
}

export function Breadcrumb({ items, onItemClick, onHomeClick }: BreadcrumbProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const getItemIcon = (item: BreadcrumbItem) => {
    if (item.icon) {
      const Icon = item.icon;
      return <Icon className="w-3 h-3" />;
    }

    switch (item.type) {
      case 'folder':
      case 'directory':
        return <Folder className="w-3 h-3" />;
      case 'file':
        return <FileText className="w-3 h-3" />;
      case 'root':
        return <Home className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  return (
    <div className="flex items-center h-6 px-2 bg-breadcrumb-background border-b border-breadcrumb-border text-xs text-breadcrumb-foreground">
      {/* Home button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-5 px-1 text-xs hover:bg-breadcrumb-item-hoverBackground"
        onClick={onHomeClick}
        title="Home"
      >
        <Home className="w-3 h-3" />
      </Button>

      {/* Breadcrumb items */}
      <div className="flex items-center ml-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-3 h-3 mx-1 text-muted-foreground" />
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs hover:bg-breadcrumb-item-hoverBackground flex items-center gap-1"
              onClick={() => onItemClick(item)}
              title={item.path}
            >
              {getItemIcon(item)}
              <span className="truncate max-w-32">{item.label}</span>
            </Button>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="ml-auto flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1 text-xs hover:bg-breadcrumb-item-hoverBackground"
          onClick={() => setShowDropdown(!showDropdown)}
          title="Quick Actions"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </div>

      {/* Dropdown menu */}
      {showDropdown && (
        <div className="absolute top-6 right-2 z-50 bg-popover border border-popover-border rounded-md shadow-lg py-1 min-w-48">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-7"
            onClick={() => {
              onItemClick({ id: 'search', label: 'Search', path: '/search', icon: Search });
              setShowDropdown(false);
            }}
          >
            <Search className="w-3 h-3 mr-2" />
            Search
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-7"
            onClick={() => {
              onItemClick({ id: 'git', label: 'Git', path: '/git', icon: GitBranch });
              setShowDropdown(false);
            }}
          >
            <GitBranch className="w-3 h-3 mr-2" />
            Git
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-xs h-7"
            onClick={() => {
              onItemClick({ id: 'ai', label: 'AI Assistant', path: '/ai', icon: MessageSquare });
              setShowDropdown(false);
            }}
          >
            <MessageSquare className="w-3 h-3 mr-2" />
            AI Assistant
          </Button>
        </div>
      )}
    </div>
  );
}
