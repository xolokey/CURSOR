'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Code, 
  Clock,
  Target,
  Zap,
  Activity,
  FileText,
  GitBranch,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Calendar,
  PieChart,
  LineChart
} from 'lucide-react';

interface DeveloperMetric {
  id: string;
  name: string;
  commits: number;
  linesAdded: number;
  linesRemoved: number;
  pullRequests: number;
  codeReviews: number;
  productivity: number;
  lastActive: Date;
}

interface CodeHealthMetric {
  complexity: number;
  maintainability: number;
  testCoverage: number;
  technicalDebt: number;
  codeQuality: number;
  lastUpdated: Date;
}

interface ProjectMetric {
  totalFiles: number;
  totalLines: number;
  languages: { [key: string]: number };
  fileTypes: { [key: string]: number };
  growthRate: number;
  lastCommit: Date;
}

interface PerformanceMetric {
  buildTime: number;
  testTime: number;
  deployTime: number;
  bundleSize: number;
  loadTime: number;
  errorRate: number;
  uptime: number;
}

export default function AnalyticsSystem() {
  const [developerMetrics, setDeveloperMetrics] = useState<DeveloperMetric[]>([
    {
      id: '1',
      name: 'John Doe',
      commits: 45,
      linesAdded: 2340,
      linesRemoved: 890,
      pullRequests: 12,
      codeReviews: 28,
      productivity: 85,
      lastActive: new Date()
    },
    {
      id: '2',
      name: 'Jane Smith',
      commits: 38,
      linesAdded: 1890,
      linesRemoved: 560,
      pullRequests: 8,
      codeReviews: 22,
      productivity: 78,
      lastActive: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      name: 'Mike Johnson',
      commits: 29,
      linesAdded: 1450,
      linesRemoved: 320,
      pullRequests: 6,
      codeReviews: 18,
      productivity: 72,
      lastActive: new Date(Date.now() - 7200000)
    }
  ]);

  const [codeHealth, setCodeHealth] = useState<CodeHealthMetric>({
    complexity: 3.2,
    maintainability: 85,
    testCoverage: 78,
    technicalDebt: 12,
    codeQuality: 88,
    lastUpdated: new Date()
  });

  const [projectMetrics, setProjectMetrics] = useState<ProjectMetric>({
    totalFiles: 156,
    totalLines: 12450,
    languages: {
      'TypeScript': 45,
      'JavaScript': 25,
      'CSS': 15,
      'HTML': 10,
      'JSON': 5
    },
    fileTypes: {
      'Components': 35,
      'Utils': 20,
      'Tests': 30,
      'Config': 15
    },
    growthRate: 15.2,
    lastCommit: new Date()
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric>({
    buildTime: 2.3,
    testTime: 1.8,
    deployTime: 0.9,
    bundleSize: 1.2,
    loadTime: 0.8,
    errorRate: 0.2,
    uptime: 99.8
  });

  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update some metrics randomly
      setPerformanceMetrics(prev => ({
        ...prev,
        buildTime: prev.buildTime + (Math.random() - 0.5) * 0.2,
        testTime: prev.testTime + (Math.random() - 0.5) * 0.1,
        loadTime: prev.loadTime + (Math.random() - 0.5) * 0.05
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate team productivity
  const getTeamProductivity = () => {
    const total = developerMetrics.reduce((sum, dev) => sum + dev.productivity, 0);
    return Math.round(total / developerMetrics.length);
  };

  // Get top performer
  const getTopPerformer = () => {
    return developerMetrics.reduce((top, dev) => 
      dev.productivity > top.productivity ? dev : top
    );
  };

  const teamProductivity = getTeamProductivity();
  const topPerformer = getTopPerformer();

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BarChart3 className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold">Analytics & Insights</h2>
            <Badge variant="default">
              Real-time Data
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Team Productivity Overview */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Productivity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{teamProductivity}%</div>
                  <div className="text-sm text-gray-400">Average Productivity</div>
                </div>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2">Top Performer</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{topPerformer.name}</span>
                    <Badge variant="default" className="text-xs">
                      {topPerformer.productivity}%
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {developerMetrics.map((dev) => (
                    <div key={dev.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{dev.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{width: `${dev.productivity}%`}}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{dev.productivity}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Health Metrics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Code Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Quality</span>
                    <span className="text-sm text-gray-400">{codeHealth.codeQuality}/100</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{width: `${codeHealth.codeQuality}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">{codeHealth.testCoverage}%</div>
                    <div className="text-xs text-gray-400">Test Coverage</div>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">{codeHealth.maintainability}</div>
                    <div className="text-xs text-gray-400">Maintainability</div>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-yellow-400">{codeHealth.complexity}</div>
                    <div className="text-xs text-gray-400">Complexity</div>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-red-400">{codeHealth.technicalDebt}h</div>
                    <div className="text-xs text-gray-400">Tech Debt</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Uptime</span>
                    <span className="text-sm text-green-400">{performanceMetrics.uptime}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{width: `${performanceMetrics.uptime}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">{performanceMetrics.buildTime}s</div>
                    <div className="text-xs text-gray-400">Build Time</div>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-green-400">{performanceMetrics.testTime}s</div>
                    <div className="text-xs text-gray-400">Test Time</div>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">{performanceMetrics.loadTime}s</div>
                    <div className="text-xs text-gray-400">Load Time</div>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-lg font-bold text-yellow-400">{performanceMetrics.bundleSize}MB</div>
                    <div className="text-xs text-gray-400">Bundle Size</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Statistics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Project Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{projectMetrics.totalFiles}</div>
                    <div className="text-sm text-gray-400">Total Files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{projectMetrics.totalLines.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Lines of Code</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2">Language Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(projectMetrics.languages).map(([lang, percentage]) => (
                      <div key={lang} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{lang}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{width: `${percentage}%`}}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Developer Activity */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Developer Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {developerMetrics.map((dev) => (
                  <div key={dev.id} className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{dev.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {dev.commits} commits
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>+{dev.linesAdded} lines</div>
                      <div>-{dev.linesRemoved} lines</div>
                      <div>{dev.pullRequests} PRs</div>
                      <div>{dev.codeReviews} reviews</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Forecasting */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Delivery Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2">Sprint Progress</h4>
                  <div className="text-2xl font-bold text-green-400 mb-2">78%</div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2">Estimated Completion</h4>
                  <div className="text-lg font-bold text-blue-400">3 days</div>
                  <div className="text-sm text-gray-400">Based on current velocity</div>
                </div>
                
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2">Velocity Trend</h4>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">+12% this sprint</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Architecture Cost Estimation */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2">Monthly Costs</h4>
                  <div className="text-2xl font-bold text-green-400 mb-2">$127.50</div>
                  <div className="text-sm text-gray-400">↓ 15% from last month</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Infrastructure</span>
                    <span className="text-gray-400">$89.20</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Development Tools</span>
                    <span className="text-gray-400">$23.80</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Monitoring</span>
                    <span className="text-gray-400">$14.50</span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-700 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm">Cost per Developer</h4>
                  <div className="text-lg font-bold text-blue-400">$42.50</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}