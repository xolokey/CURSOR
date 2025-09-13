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
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  ExternalLink,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  Terminal,
  Settings
} from 'lucide-react';

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  latestVersion?: string;
  isOutdated: boolean;
  isDevDependency: boolean;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords: string[];
  dependencies: string[];
  size?: number;
  lastUpdated?: string;
}

interface PackageManagerProps {
  onInstallPackage?: (packageName: string, version?: string, isDev?: boolean) => void;
  onUninstallPackage?: (packageName: string) => void;
  onUpdatePackage?: (packageName: string) => void;
  onRunScript?: (scriptName: string) => void;
}

export function PackageManager({ 
  onInstallPackage, 
  onUninstallPackage, 
  onUpdatePackage, 
  onRunScript 
}: PackageManagerProps) {
  const [activeTab, setActiveTab] = useState('installed');
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set());
  const [packageJson, setPackageJson] = useState<any>(null);
  const [scripts, setScripts] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPackages();
    loadPackageJson();
  }, []);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Failed to load packages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPackageJson = async () => {
    try {
      const response = await fetch('/api/packages/package-json');
      if (response.ok) {
        const data = await response.json();
        setPackageJson(data);
        setScripts(data.scripts || {});
      }
    } catch (error) {
      console.error('Failed to load package.json:', error);
    }
  };

  const installPackage = async (packageName: string, version?: string, isDev = false) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/packages/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageName, version, isDev }),
      });

      if (response.ok) {
        await loadPackages();
        await loadPackageJson();
        onInstallPackage?.(packageName, version, isDev);
      }
    } catch (error) {
      console.error('Failed to install package:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uninstallPackage = async (packageName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/packages/uninstall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageName }),
      });

      if (response.ok) {
        await loadPackages();
        await loadPackageJson();
        onUninstallPackage?.(packageName);
      }
    } catch (error) {
      console.error('Failed to uninstall package:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePackage = async (packageName: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/packages/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageName }),
      });

      if (response.ok) {
        await loadPackages();
        onUpdatePackage?.(packageName);
      }
    } catch (error) {
      console.error('Failed to update package:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runScript = async (scriptName: string) => {
    try {
      const response = await fetch('/api/packages/run-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptName }),
      });

      if (response.ok) {
        onRunScript?.(scriptName);
      }
    } catch (error) {
      console.error('Failed to run script:', error);
    }
  };

  const togglePackageExpansion = (packageName: string) => {
    setExpandedPackages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(packageName)) {
        newSet.delete(packageName);
      } else {
        newSet.add(packageName);
      }
      return newSet;
    });
  };

  const filteredPackages = packages.filter(pkg => 
    !searchQuery || 
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const outdatedPackages = packages.filter(pkg => pkg.isOutdated);
  const devDependencies = packages.filter(pkg => pkg.isDevDependency);
  const regularDependencies = packages.filter(pkg => !pkg.isDevDependency);

  const renderPackageCard = (pkg: PackageInfo) => {
    const isExpanded = expandedPackages.has(pkg.name);

    return (
      <Card key={pkg.name} className="p-3 hover:shadow-md transition-shadow">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-sm">{pkg.name}</h3>
                <p className="text-xs text-muted-foreground">v{pkg.version}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {pkg.isOutdated && (
                <Badge variant="destructive" className="text-xs">
                  Outdated
                </Badge>
              )}
              {pkg.isDevDependency && (
                <Badge variant="outline" className="text-xs">
                  Dev
                </Badge>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => togglePackageExpansion(pkg.name)}
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
            {pkg.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {pkg.size && (
                <span>{Math.round(pkg.size / 1024)}KB</span>
              )}
              {pkg.lastUpdated && (
                <span>{new Date(pkg.lastUpdated).toLocaleDateString()}</span>
              )}
            </div>

            <div className="flex gap-1">
              {pkg.isOutdated && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updatePackage(pkg.name)}
                  disabled={isLoading}
                  className="h-6 px-2 text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Update
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => uninstallPackage(pkg.name)}
                disabled={isLoading}
                className="h-6 px-2 text-xs text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-2 pt-2 border-t">
              {pkg.latestVersion && pkg.isOutdated && (
                <div className="text-xs">
                  <strong>Latest:</strong> v{pkg.latestVersion}
                </div>
              )}
              {pkg.license && (
                <div className="text-xs">
                  <strong>License:</strong> {pkg.license}
                </div>
              )}
              {pkg.homepage && (
                <div className="text-xs">
                  <strong>Homepage:</strong> 
                  <a href={pkg.homepage} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                    {pkg.homepage}
                  </a>
                </div>
              )}
              {pkg.keywords.length > 0 && (
                <div className="text-xs">
                  <strong>Keywords:</strong> {pkg.keywords.join(', ')}
                </div>
              )}
              {pkg.dependencies.length > 0 && (
                <div className="text-xs">
                  <strong>Dependencies:</strong> {pkg.dependencies.length}
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
          <h2 className="text-lg font-semibold">Package Manager</h2>
          {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={loadPackages}
            disabled={isLoading}
            className="h-9 px-3"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="outdated">Outdated ({outdatedPackages.length})</TabsTrigger>
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Dependencies</h4>
                {regularDependencies.map(pkg => renderPackageCard(pkg))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Dev Dependencies</h4>
                {devDependencies.map(pkg => renderPackageCard(pkg))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="outdated" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {outdatedPackages.map(pkg => renderPackageCard(pkg))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="scripts" className="flex-1 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {Object.entries(scripts).map(([name, command]) => (
                <Card key={name} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{name}</h4>
                      <p className="text-xs text-muted-foreground font-mono">{command}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => runScript(name)}
                      className="h-8 px-3"
                    >
                      <Terminal className="w-3 h-3 mr-1" />
                      Run
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="search" className="flex-1 p-4">
          <div className="space-y-4">
            <div className="text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Search for packages to install</p>
              <p className="text-xs">Package search functionality coming soon</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
