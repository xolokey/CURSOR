'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  Upload, 
  Download, 
  Plus, 
  Minus, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  MessageSquare,
  Hash
} from 'lucide-react';

interface GitStatus {
  current: string;
  tracking: string | null;
  ahead: number;
  behind: number;
  files: Array<{
    path: string;
    index: string;
    working_dir: string;
  }>;
  staged: string[];
  not_added: string[];
  conflicted: string[];
  created: string[];
  deleted: string[];
  modified: string[];
  renamed: Array<{ from: string; to: string }>;
}

interface GitCommit {
  hash: string;
  date: string;
  message: string;
  author_name: string;
  author_email: string;
  refs: string;
}

export function GitPanel() {
  const [status, setStatus] = useState<GitStatus | null>(null);
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('status');

  useEffect(() => {
    loadGitData();
  }, []);

  const loadGitData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, commitsRes, branchesRes] = await Promise.all([
        fetch('/api/git?action=status'),
        fetch('/api/git?action=log&count=20'),
        fetch('/api/git?action=branches'),
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setStatus(statusData);
      }

      if (commitsRes.ok) {
        const commitsData = await commitsRes.json();
        setCommits(commitsData);
      }

      if (branchesRes.ok) {
        const branchesData = await branchesRes.json();
        setBranches(branchesData);
      }
    } catch (error) {
      console.error('Failed to load git data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitAction = async (action: string, data?: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/git', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...data }),
      });

      if (response.ok) {
        await loadGitData();
      } else {
        const error = await response.json();
        console.error('Git action failed:', error);
      }
    } catch (error) {
      console.error('Git action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommit = () => {
    if (commitMessage.trim()) {
      handleGitAction('commit', { message: commitMessage });
      setCommitMessage('');
    }
  };

  const getFileStatusIcon = (file: any) => {
    if (file.index === 'A') return <Plus className="w-3 h-3 text-green-500" />;
    if (file.index === 'D') return <Minus className="w-3 h-3 text-red-500" />;
    if (file.index === 'M') return <AlertCircle className="w-3 h-3 text-yellow-500" />;
    if (file.index === 'R') return <RotateCcw className="w-3 h-3 text-blue-500" />;
    return <AlertCircle className="w-3 h-3 text-gray-500" />;
  };

  const getFileStatusColor = (file: any) => {
    if (file.index === 'A') return 'bg-green-500/10 text-green-700';
    if (file.index === 'D') return 'bg-red-500/10 text-red-700';
    if (file.index === 'M') return 'bg-yellow-500/10 text-yellow-700';
    if (file.index === 'R') return 'bg-blue-500/10 text-blue-700';
    return 'bg-gray-500/10 text-gray-700';
  };

  return (
    <Card className="w-80 h-full bg-card border-border flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-4 h-4 text-primary" />
          <h3 className="font-semibold">Git</h3>
          {isLoading && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
        </div>
        <Button size="sm" variant="outline" onClick={loadGitData} disabled={isLoading}>
          <RotateCcw className="w-3 h-3 mr-1" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="commits">History</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="flex-1 p-3 space-y-4">
          {status ? (
            <>
              {/* Branch Info */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Current Branch</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{status.current}</Badge>
                  {status.tracking && (
                    <span className="text-xs text-muted-foreground">
                      tracking {status.tracking}
                    </span>
                  )}
                </div>
                {(status.ahead > 0 || status.behind > 0) && (
                  <div className="flex gap-2 text-xs">
                    {status.ahead > 0 && (
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">
                        {status.ahead} ahead
                      </Badge>
                    )}
                    {status.behind > 0 && (
                      <Badge variant="secondary" className="bg-orange-500/10 text-orange-700">
                        {status.behind} behind
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Staged Changes */}
              {status.staged.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Staged Changes</h4>
                  <ScrollArea className="h-24">
                    <div className="space-y-1">
                      {status.staged.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="truncate">{file}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Modified Files */}
              {status.files.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Modified Files</h4>
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {status.files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          {getFileStatusIcon(file)}
                          <span className="truncate flex-1">{file.path}</span>
                          <Badge variant="outline" className={`text-xs ${getFileStatusColor(file)}`}>
                            {file.index}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Commit Actions */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Commit Changes</h4>
                <div className="space-y-2">
                  <Input
                    placeholder="Commit message..."
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCommit()}
                    className="text-xs"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGitAction('add', { files: status?.not_added || [] })}
                      disabled={!status?.not_added.length}
                      className="flex-1 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Stage All
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCommit}
                      disabled={!commitMessage.trim() || !status?.staged.length}
                      className="flex-1 text-xs"
                    >
                      <GitCommit className="w-3 h-3 mr-1" />
                      Commit
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGitAction('push')}
                      disabled={status.ahead === 0}
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Push
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGitAction('pull')}
                      disabled={status.behind === 0}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Pull
                    </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <GitBranch className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No git repository found</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleGitAction('init')}
                className="mt-2"
              >
                Initialize Repository
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="commits" className="flex-1 p-3">
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {commits.map((commit, index) => (
                <Card key={index} className="p-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-mono">{commit.hash.substring(0, 7)}</span>
                      <Badge variant="outline" className="text-xs">
                        {commit.refs}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{commit.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{commit.author_name}</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(commit.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="branches" className="flex-1 p-3">
          <ScrollArea className="h-96">
            <div className="space-y-1">
              {branches.map((branch, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm">{branch}</span>
                    {branch === status?.current && (
                      <Badge variant="default" className="text-xs">current</Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleGitAction('checkout', { branch })}
                      disabled={branch === status?.current}
                      className="h-6 w-6 p-0"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                    {branch !== status?.current && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleGitAction('deleteBranch', { branch })}
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
