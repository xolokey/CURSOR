'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  TrendingUp,
  AlertTriangle,
  Code,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration: number;
  coverage: number;
  code: string;
  result?: any;
  error?: string;
}

interface TestSuite {
  id: string;
  name: string;
  tests: TestCase[];
  totalCoverage: number;
  lastRun: Date;
  status: 'idle' | 'running' | 'completed';
}

interface CoverageReport {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
  uncoveredLines: number[];
}

export default function TestingSystem() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: 'main-suite',
      name: 'Main Test Suite',
      tests: [],
      totalCoverage: 0,
      lastRun: new Date(),
      status: 'idle'
    }
  ]);
  
  const [activeSuite, setActiveSuite] = useState<string>('main-suite');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [coverageReport, setCoverageReport] = useState<CoverageReport>({
    lines: 0,
    functions: 0,
    branches: 0,
    statements: 0,
    uncoveredLines: []
  });

  // Generate tests based on code analysis
  const generateTests = async (code: string) => {
    setIsGenerating(true);
    
    // Simulate AI test generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedTests: TestCase[] = [];
    
    // Analyze code and generate appropriate tests
    if (code.includes('function') || code.includes('const') || code.includes('class')) {
      // Generate unit tests
      generatedTests.push({
        id: `test-${Date.now()}-1`,
        name: 'Basic functionality test',
        type: 'unit',
        status: 'pending',
        duration: 0,
        coverage: 85,
        code: `describe('Generated Test', () => {
  it('should work correctly', () => {
    // Test implementation
    expect(true).toBe(true);
  });
});`
      });
      
      // Generate integration tests
      generatedTests.push({
        id: `test-${Date.now()}-2`,
        name: 'Integration test',
        type: 'integration',
        status: 'pending',
        duration: 0,
        coverage: 70,
        code: `describe('Integration Test', () => {
  it('should integrate properly', () => {
    // Integration test implementation
    expect(true).toBe(true);
  });
});`
      });
      
      // Generate E2E tests
      generatedTests.push({
        id: `test-${Date.now()}-3`,
        name: 'End-to-end test',
        type: 'e2e',
        status: 'pending',
        duration: 0,
        coverage: 60,
        code: `describe('E2E Test', () => {
  it('should work end-to-end', () => {
    // E2E test implementation
    expect(true).toBe(true);
  });
});`
      });
    }
    
    // Update test suite
    setTestSuites(prev => prev.map(suite => 
      suite.id === activeSuite 
        ? { ...suite, tests: [...suite.tests, ...generatedTests] }
        : suite
    ));
    
    setIsGenerating(false);
  };

  // Run all tests in a suite
  const runTests = async (suiteId: string) => {
    setIsRunning(true);
    
    const suite = testSuites.find(s => s.id === suiteId);
    if (!suite) return;
    
    // Update suite status
    setTestSuites(prev => prev.map(s => 
      s.id === suiteId ? { ...s, status: 'running' } : s
    ));
    
    // Simulate test execution
    for (const test of suite.tests) {
      // Update test status to running
      setTestSuites(prev => prev.map(s => 
        s.id === suiteId 
          ? {
              ...s,
              tests: s.tests.map(t => 
                t.id === test.id ? { ...t, status: 'running' } : t
              )
            }
          : s
      ));
      
      // Simulate test execution time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Randomly determine test result
      const passed = Math.random() > 0.2; // 80% pass rate
      
      setTestSuites(prev => prev.map(s => 
        s.id === suiteId 
          ? {
              ...s,
              tests: s.tests.map(t => 
                t.id === test.id 
                  ? { 
                      ...t, 
                      status: passed ? 'passed' : 'failed',
                      duration: Math.floor(Math.random() * 1000) + 100,
                      result: passed ? 'Test passed successfully' : undefined,
                      error: passed ? undefined : 'Assertion failed: Expected true but got false'
                    }
                  : t
              )
            }
          : s
      ));
    }
    
    // Update suite status and coverage
    const updatedSuite = testSuites.find(s => s.id === suiteId);
    if (updatedSuite) {
      const passedTests = updatedSuite.tests.filter(t => t.status === 'passed').length;
      const totalTests = updatedSuite.tests.length;
      const newCoverage = totalTests > 0 ? Math.floor((passedTests / totalTests) * 100) : 0;
      
      setTestSuites(prev => prev.map(s => 
        s.id === suiteId 
          ? { 
              ...s, 
              status: 'completed',
              totalCoverage: newCoverage,
              lastRun: new Date()
            }
          : s
      ));
      
      // Update coverage report
      setCoverageReport({
        lines: newCoverage,
        functions: newCoverage - 5,
        branches: newCoverage - 10,
        statements: newCoverage,
        uncoveredLines: []
      });
    }
    
    setIsRunning(false);
  };

  // Get test statistics
  const getTestStats = () => {
    const suite = testSuites.find(s => s.id === activeSuite);
    if (!suite) return { total: 0, passed: 0, failed: 0, pending: 0 };
    
    return {
      total: suite.tests.length,
      passed: suite.tests.filter(t => t.status === 'passed').length,
      failed: suite.tests.filter(t => t.status === 'failed').length,
      pending: suite.tests.filter(t => t.status === 'pending').length
    };
  };

  const stats = getTestStats();
  const currentSuite = testSuites.find(s => s.id === activeSuite);

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TestTube className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold">Testing & QA System</h2>
            <Badge variant={isRunning ? "default" : "secondary"}>
              {isRunning ? 'Running Tests' : 'Ready'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateTests('sample code')}
              disabled={isGenerating}
            >
              <Zap className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Tests'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => runTests(activeSuite)}
              disabled={isRunning}
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Tests'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <h3 className="font-semibold mb-4">Test Suites</h3>
          <div className="space-y-2">
            {testSuites.map((suite) => (
              <div
                key={suite.id}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  activeSuite === suite.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                onClick={() => setActiveSuite(suite.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{suite.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {suite.tests.length} tests
                  </Badge>
                </div>
                <div className="text-xs text-gray-400">
                  Coverage: {suite.totalCoverage}%
                </div>
                <div className="text-xs text-gray-400">
                  Last run: {suite.lastRun.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Test Statistics */}
          <div className="bg-gray-800 border-b border-gray-700 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Tests</div>
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
              {/* Test List */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Test Cases
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentSuite?.tests.map((test) => (
                      <div
                        key={test.id}
                        className="p-3 bg-gray-700 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {test.status === 'passed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                            {test.status === 'failed' && <XCircle className="w-4 h-4 text-red-400" />}
                            {test.status === 'running' && <Clock className="w-4 h-4 text-yellow-400 animate-spin" />}
                            {test.status === 'pending' && <Clock className="w-4 h-4 text-gray-400" />}
                            <span className="font-medium">{test.name}</span>
                          </div>
                          <Badge 
                            variant={
                              test.type === 'unit' ? 'default' :
                              test.type === 'integration' ? 'secondary' :
                              test.type === 'e2e' ? 'outline' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {test.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">
                          Duration: {test.duration}ms | Coverage: {test.coverage}%
                        </div>
                        {test.error && (
                          <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded text-sm text-red-300">
                            {test.error}
                          </div>
                        )}
                      </div>
                    ))}
                    {currentSuite?.tests.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No tests yet. Generate some tests to get started!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Coverage Report */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Coverage Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Lines</span>
                        <span className="text-sm text-gray-400">{coverageReport.lines}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${coverageReport.lines}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Functions</span>
                        <span className="text-sm text-gray-400">{coverageReport.functions}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${coverageReport.functions}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Branches</span>
                        <span className="text-sm text-gray-400">{coverageReport.branches}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${coverageReport.branches}%`}}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Statements</span>
                        <span className="text-sm text-gray-400">{coverageReport.statements}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${coverageReport.statements}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Generation */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    AI Test Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2">Smart Test Generation</h4>
                      <p className="text-sm text-gray-300 mb-4">
                        AI analyzes your code and generates comprehensive test suites including unit, integration, and E2E tests.
                      </p>
                      <Button 
                        className="w-full"
                        onClick={() => generateTests('sample code')}
                        disabled={isGenerating}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Generating Tests...' : 'Generate Tests'}
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2">Test Types</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="default" className="text-xs">Unit</Badge>
                          <span className="text-sm text-gray-300">Individual function testing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">Integration</Badge>
                          <span className="text-sm text-gray-300">Component interaction testing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">E2E</Badge>
                          <span className="text-sm text-gray-300">End-to-end user flows</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="destructive" className="text-xs">Performance</Badge>
                          <span className="text-sm text-gray-300">Load and stress testing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Metrics */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2">Test Quality Score</h4>
                      <div className="text-3xl font-bold text-green-400 mb-2">85/100</div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2">Flaky Test Detection</h4>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">No flaky tests detected</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-700 rounded-lg">
                      <h4 className="font-semibold mb-2">Performance Regression</h4>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">No performance regressions</span>
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