'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  GitBranch, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings,
  BarChart3,
  Zap,
  Cloud,
  Server,
  Database,
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';

interface PipelineStage {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'security' | 'performance';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration: number;
  logs: string[];
  startTime?: Date;
  endTime?: Date;
}

interface Pipeline {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  stages: PipelineStage[];
  trigger: 'push' | 'pull_request' | 'schedule' | 'manual';
  branch: string;
  commit: string;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
}

interface PerformanceMetrics {
  buildTime: number;
  testTime: number;
  deployTime: number;
  bundleSize: number;
  memoryUsage: number;
  cpuUsage: number;
}

export default function DevOpsSystem() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: 'main-pipeline',
      name: 'Main CI/CD Pipeline',
      status: 'idle',
      stages: [],
      trigger: 'push',
      branch: 'main',
      commit: 'abc123',
      startTime: new Date(),
      endTime: new Date()
    }
  ]);
  
  const [activePipeline, setActivePipeline] = useState<string>('main-pipeline');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    buildTime: 0,
    testTime: 0,
    deployTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    cpuUsage: 0
  });

  // Generate CI/CD pipeline
  const generatePipeline = async () => {
    setIsGenerating(true);
    
    // Simulate AI pipeline generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const stages: PipelineStage[] = [
      {
        id: 'build-stage',
        name: 'Build',
        type: 'build',
        status: 'pending',
        duration: 0,
        logs: []
      },
      {
        id: 'test-stage',
        name: 'Test',
        type: 'test',
        status: 'pending',
        duration: 0,
        logs: []
      },
      {
        id: 'security-stage',
        name: 'Security Scan',
        type: 'security',
        status: 'pending',
        duration: 0,
        logs: []
      },
      {
        id: 'deploy-stage',
        name: 'Deploy',
        type: 'deploy',
        status: 'pending',
        duration: 0,
        logs: []
      }
    ];
    
    setPipelines(prev => prev.map(p => 
      p.id === activePipeline 
        ? { ...p, stages }
        : p
    ));
    
    setIsGenerating(false);
  };

  // Run pipeline
  const runPipeline = async (pipelineId: string) => {
    setIsRunning(true);
    
    const pipeline = pipelines.find(p => p.id === pipelineId);
    if (!pipeline) return;
    
    // Update pipeline status
    setPipelines(prev => prev.map(p => 
      p.id === pipelineId 
        ? { ...p, status: 'running', startTime: new Date() }
        : p
    ));
    
    // Simulate pipeline execution
    for (const stage of pipeline.stages) {
      // Update stage status to running
      setPipelines(prev => prev.map(p => 
        p.id === pipelineId 
          ? {
              ...p,
              stages: p.stages.map(s => 
                s.id === stage.id 
                  ? { ...s, status: 'running', startTime: new Date() }
                  : s
              )
            }
          : p
      ));
      
      // Simulate stage execution
      const stageDuration = Math.floor(Math.random() * 5000) + 1000;
      await new Promise(resolve => setTimeout(resolve, stageDuration));
      
      // Randomly determine stage result
      const passed = Math.random() > 0.1; // 90% pass rate
      
      setPipelines(prev => prev.map(p => 
        p.id === pipelineId 
          ? {
              ...p,
              stages: p.stages.map(s => 
                s.id === stage.id 
                  ? { 
                      ...s, 
                      status: passed ? 'passed' : 'failed',
                      duration: stageDuration,
                      endTime: new Date(),
                      logs: [
                        `Starting ${s.name} stage...`,
                        `Running ${s.type} operations...`,
                        passed ? `${s.name} completed successfully` : `${s.name} failed with errors`
                      ]
                    }
                  : s
              )
            }
          : p
      ));
      
      // If stage failed, stop pipeline
      if (!passed) {
        setPipelines(prev => prev.map(p => 
          p.id === pipelineId 
            ? { ...p, status: 'failed', endTime: new Date() }
            : p
        ));
        setIsRunning(false);
        return;
      }
    }
    
    // Pipeline completed successfully
    const endTime = new Date();
    const duration = pipeline.startTime ? endTime.getTime() - pipeline.startTime.getTime() : 0;
    
    setPipelines(prev => prev.map(p => 
      p.id === pipelineId 
        ? { 
            ...p, 
            status: 'completed', 
            endTime,
            duration
          }
        : p
    ));
    
    // Update performance metrics
    setPerformanceMetrics({
      buildTime: Math.floor(Math.random() * 30) + 10,
      testTime: Math.floor(Math.random() * 20) + 5,
      deployTime: Math.floor(Math.random() * 15) + 3,
      bundleSize: Math.floor(Math.random() * 500) + 1000,
      memoryUsage: Math.floor(Math.random() * 20) + 30,
      cpuUsage: Math.floor(Math.random() * 30) + 20
    });
    
    setIsRunning(false);
  };

  // Get pipeline statistics
  const getPipelineStats = () => {
    const pipeline = pipelines.find(p => p.id === activePipeline);
    if (!pipeline) return { total: 0, passed: 0, failed: 0, pending: 0 };
    
    return {
      total: pipeline.stages.length,
      passed: pipeline.stages.filter(s => s.status === 'passed').length,
      failed: pipeline.stages.filter(s => s.status === 'failed').length,
      pending: pipeline.stages.filter(s => s.status === 'pending').length
    };
  };

  const stats = getPipelineStats();
  const currentPipeline = pipelines.find(p => p.id === activePipeline);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <GitBranch className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold">DevOps & Automation</h2>
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? 'Pipeline Running' : 'Ready'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generatePipeline}
              disabled={isGenerating}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Pipeline'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => runPipeline(activePipeline)}
              disabled={isRunning}
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Pipeline'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <h3 className="font-semibold mb-4">Pipelines</h3>
          <div className="space-y-2">
            {pipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  activePipeline === pipeline.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setActivePipeline(pipeline.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{pipeline.name}</span>
                  <Badge 
                    variant={
                      pipeline.status === 'completed' ? 'default' :
                      pipeline.status === 'failed' ? 'destructive' :
                      pipeline.status === 'running' ? 'secondary' : 'outline'
                    }
                    className="text-xs"
                  >
                    {pipeline.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-400">
                  Branch: {pipeline.branch}
                </div>
                <div className="text-xs text-gray-400">
                  Trigger: {pipeline.trigger}
                </div>
                {pipeline.duration && (
                  <div className="text-xs text-gray-400">
                    Duration: {Math.round(pipeline.duration / 1000)}s
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Pipeline Statistics */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Stages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.passed}</div>
                <div className="text-sm text-gray-400">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pipeline Stages */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Pipeline Stages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentPipeline?.stages.map((stage) => (
                      <div
                        key={stage.id}
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {stage.status === 'passed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                            {stage.status === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
                            {stage.status === 'running' && <Clock className="w-4 h-4 text-yellow-400 animate-spin" />}
                            {stage.status === 'pending' && <Clock className="w-4 h-4 text-gray-400" />}
                            <span className="font-medium">{stage.name}</span>
                          </div>
                          <Badge 
                            variant={
                              stage.type === 'build' ? 'default' :
                              stage.type === 'test' ? 'secondary' :
                              stage.type === 'deploy' ? 'outline' :
                              stage.type === 'security' ? 'destructive' : 'default'
                            }
                            className="text-xs"
                          >
                            {stage.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">
                          Duration: {stage.duration}ms
                        </div>
                        {stage.logs.length > 0 && (
                          <div className="mt-2 p-2 bg-gray-800 rounded text-xs text-gray-300 font-mono">
                            {stage.logs.map((log, index) => (
                              <div key={index}>{log}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {currentPipeline?.stages.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No pipeline stages yet. Generate a pipeline to get started!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Build Time</span>
                        <span className="text-sm text-gray-400">{performanceMetrics.buildTime}s</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${Math.min(performanceMetrics.buildTime * 2, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Test Time</span>
                        <span className="text-sm text-gray-400">{performanceMetrics.testTime}s</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${Math.min(performanceMetrics.testTime * 3, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Deploy Time</span>
                        <span className="text-sm text-gray-400">{performanceMetrics.deployTime}s</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${Math.min(performanceMetrics.deployTime * 4, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Bundle Size</span>
                        <span className="text-sm text-gray-400">{performanceMetrics.bundleSize}KB</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${Math.min(performanceMetrics.bundleSize / 20, 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Infrastructure Monitoring */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="w-5 h-5 mr-2" />
                    Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Cloud className="w-4 h-4 text-blue-400" />
                          <span className="font-medium">Cloud Resources</span>
                        </div>
                        <Badge variant="default" className="text-xs">Healthy</Badge>
                      </div>
                      <div className="text-sm text-gray-300">
                        CPU: {performanceMetrics.cpuUsage}% | Memory: {performanceMetrics.memoryUsage}%
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-green-400" />
                          <span className="font-medium">Database</span>
                        </div>
                        <Badge variant="default" className="text-xs">Connected</Badge>
                      </div>
                      <div className="text-sm text-gray-300">
                        Response time: 12ms | Connections: 45/100
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-purple-400" />
                          <span className="font-medium">Security</span>
                        </div>
                        <Badge variant="default" className="text-xs">Secure</Badge>
                      </div>
                      <div className="text-sm text-gray-300">
                        No vulnerabilities detected
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Optimization */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Cost Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2">Monthly Costs</h4>
                      <div className="text-2xl font-bold text-green-400 mb-2">$127.50</div>
                      <div className="text-sm text-gray-400">↓ 15% from last month</div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2">Resource Usage</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Compute</span>
                          <span>67%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Storage</span>
                          <span>34%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Network</span>
                          <span>23%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2">Optimization Suggestions</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">Consider auto-scaling for peak hours</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-gray-300">Unused resources detected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}