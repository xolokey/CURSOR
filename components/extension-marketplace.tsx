'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Search, 
  Download, 
  Trash2, 
  Settings, 
  Star,
  Users,
  Calendar,
  Code,
  Palette,
  Zap,
  Shield,
  Globe,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  publisher: string;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords: string[];
  categories: string[];
  icon?: string;
  readme?: string;
  changelog?: string;
  installed: boolean;
  enabled: boolean;
  dependencies: string[];
  activationEvents: string[];
  main: string;
  rating?: number;
  downloads?: number;
  lastUpdated?: string;
}

interface ExtensionMarketplaceProps {
  onInstallExtension?: (extensionId: string) => void;
  onUninstallExtension?: (extensionId: string) => void;
  onEnableExtension?: (extensionId: string) => void;
  onDisableExtension?: (extensionId: string) => void;
}

export function ExtensionMarketplace({ 
  onInstallExtension, 
  onUninstallExtension, 
  onEnableExtension, 
  onDisableExtension 
}: ExtensionMarketplaceProps) {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [installedExtensions, setInstalledExtensions] = useState<Extension[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'downloads' | 'updated'>('name');
  const [expandedExtensions, setExpandedExtensions] = useState<Set<string>>(new Set());

  const categories = [
    'All',
    'Programming Languages',
    'Formatters',
    'Linters',
    'Themes',
    'Debuggers',
    'Snippets',
    'Keymaps',
    'Other'
  ];

  useEffect(() => {
    loadExtensions();
  }, []);

  const loadExtensions = async () => {
    try {
      const response = await fetch('/api/extensions');
      if (response.ok) {
        const data = await response.json();
        setExtensions(data.extensions || []);
        setInstalledExtensions(data.installed || []);
      }
    } catch (error) {
      console.error('Failed to load extensions:', error);
    }
  };

  const installExtension = async (extensionId: string) => {
    try {
      const response = await fetch(`/api/extensions/${extensionId}/install`, {
        method: 'POST',
      });

      if (response.ok) {
        setExtensions(prev => prev.map(ext => 
          ext.id === extensionId ? { ...ext, installed: true } : ext
        ));
        onInstallExtension?.(extensionId);
      }
    } catch (error) {
      console.error('Failed to install extension:', error);
    }
  };

  const uninstallExtension = async (extensionId: string) => {
    try {
      const response = await fetch(`/api/extensions/${extensionId}/uninstall`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExtensions(prev => prev.map(ext => 
          ext.id === extensionId ? { ...ext, installed: false } : ext
        ));
        setInstalledExtensions(prev => prev.filter(ext => ext.id !== extensionId));
        onUninstallExtension?.(extensionId);
      }
    } catch (error) {
      console.error('Failed to uninstall extension:', error);
    }
  };

  const enableExtension = async (extensionId: string) => {
    try {
      const response = await fetch(`/api/extensions/${extensionId}/enable`, {
        method: 'POST',
      });

      if (response.ok) {
        setExtensions(prev => prev.map(ext => 
          ext.id === extensionId ? { ...ext, enabled: true } : ext
        ));
        setInstalledExtensions(prev => prev.map(ext => 
          ext.id === extensionId ? { ...ext, enabled: true } : ext
        ));
        onEnableExtension?.(extensionId);
      }
    } catch (error) {
      console.error('Failed to enable extension:', error);
    }
  };

  const disableExtension = async (extensionId: string) => {
    try {
      const response = await fetch(`/api/extensions/${extensionId}/disable`, {
        method: 'POST',
      });

      if (response.ok) {
        setExtensions(prev => prev.map(ext => 
          ext.id === extensionId ? { ...ext, enabled: false } : ext
        ));
        setInstalledExtensions(prev => prev.map(ext => 
          ext.id === extensionId ? { ...ext, enabled: false } : ext
        ));
        onDisableExtension?.(extensionId);
      }
    } catch (error) {
      console.error('Failed to disable extension:', error);
    }
  };

  const toggleExtensionExpansion = (extensionId: string) => {
    setExpandedExtensions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(extensionId)) {
        newSet.delete(extensionId);
      } else {
        newSet.add(extensionId);
      }
      return newSet;
    });
  };

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = !searchQuery || 
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      ext.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'downloads':
        return (b.downloads || 0) - (a.downloads || 0);
      case 'updated':
        return new Date(b.lastUpdated || '').getTime() - new Date(a.lastUpdated || '').getTime();
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const renderExtensionCard = (extension: Extension) => {
    const isExpanded = expandedExtensions.has(extension.id);

    return (
      <Card key={extension.id} className="p-4 hover:shadow-md transition-shadow">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {extension.icon ? (
                <img src={extension.icon} alt={extension.name} className="w-8 h-8 rounded" />
              ) : (
                <Package className="w-8 h-8 text-muted-foreground" />
              )}
              <div>
                <h3 className="font-semibold text-sm">{extension.name}</h3>
                <p className="text-xs text-muted-foreground">{extension.publisher}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {extension.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs">{extension.rating.toFixed(1)}</span>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleExtensionExpansion(extension.id)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? 
                  <ChevronDown className="w-3 h-3" /> : 
                  <ChevronRight className="w-3 h-3" />
                }
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">
            {extension.description}
          </p>

          <div className="flex flex-wrap gap-1">
            {extension.categories.slice(0, 2).map(category => (
              <Badge key={category} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
            {extension.categories.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{extension.categories.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {extension.downloads && (
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{extension.downloads.toLocaleString()}</span>
                </div>
              )}
              {extension.lastUpdated && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(extension.lastUpdated).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="flex gap-1">
              {extension.installed ? (
                <>
                  <Button
                    size="sm"
                    variant={extension.enabled ? "default" : "outline"}
                    onClick={() => extension.enabled ? disableExtension(extension.id) : enableExtension(extension.id)}
                    className="h-6 px-2 text-xs"
                  >
                    {extension.enabled ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => uninstallExtension(extension.id)}
                    className="h-6 px-2 text-xs text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => installExtension(extension.id)}
                  className="h-6 px-2 text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Install
                </Button>
              )}
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-2 pt-2 border-t">
              <div className="text-xs">
                <strong>Version:</strong> {extension.version}
              </div>
              {extension.license && (
                <div className="text-xs">
                  <strong>License:</strong> {extension.license}
                </div>
              )}
              <div className="text-xs">
                <strong>Keywords:</strong> {extension.keywords.join(', ')}
              </div>
              {extension.homepage && (
                <div className="text-xs">
                  <strong>Homepage:</strong> 
                  <a href={extension.homepage} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    {extension.homepage}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <Card className="w-full h-full bg-card border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Extensions</h2>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search extensions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="h-9 w-9 p-0"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm border border-border rounded px-2 py-1 bg-background"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-border rounded px-2 py-1 bg-background"
          >
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="downloads">Downloads</option>
            <option value="updated">Last Updated</option>
          </select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="installed">Installed ({installedExtensions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className={viewMode === 'grid' ? 
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 
              'space-y-2'
            }>
              {filteredExtensions.map(extension => renderExtensionCard(extension))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="installed" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className={viewMode === 'grid' ? 
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 
              'space-y-2'
            }>
              {installedExtensions.map(extension => renderExtensionCard(extension))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
