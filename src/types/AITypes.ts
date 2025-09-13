// ==============================
// AI System Type Definitions
// ==============================

export interface AIAgent {
  id: string;
  type: 'code_generation' | 'code_review' | 'test_generation' | 'code_explanation' | 'security_analysis';
  capabilities: string[];
  context: CodeContext;
  memory: CodeMemory;
  status: 'active' | 'inactive' | 'busy';
  performance?: AgentPerformance;
}

export class CodeContext {
  projectId?: string;
  currentFile?: string;
  language?: string;
  framework?: string;
  dependencies?: string[];
  recentChanges?: CodeChange[];
  userPreferences?: UserPreferences;

  constructor(initialData?: Partial<CodeContext>) {
    if (initialData) {
      Object.assign(this, initialData);
    }
  }
}

export class CodeMemory {
  private contexts: Map<string, any> = new Map();
  private patterns: Map<string, DesignPattern[]> = new Map();
  private learning: Map<string, LearningData[]> = new Map();

  async storeContext(projectId: string, context: any): Promise<void> {
    this.contexts.set(projectId, context);
  }

  async retrieveContext(projectId: string): Promise<any> {
    return this.contexts.get(projectId);
  }

  async storePattern(pattern: DesignPattern): Promise<void> {
    const patterns = this.patterns.get(pattern.type) || [];
    patterns.push(pattern);
    this.patterns.set(pattern.type, patterns);
  }

  async retrievePatterns(type: string): Promise<DesignPattern[]> {
    return this.patterns.get(type) || [];
  }

  async storeLearning(learning: LearningData): Promise<void> {
    const learnings = this.learning.get(learning.topic) || [];
    learnings.push(learning);
    this.learning.set(learning.topic, learnings);
  }

  async retrieveLearning(topic: string): Promise<LearningData[]> {
    return this.learning.get(topic) || [];
  }
}

export interface DesignPattern {
  id: string;
  name: string;
  type: string;
  language: string;
  code: string;
  description: string;
  useCases: string[];
  confidence: number;
  timestamp: Date;
}

export class PatternDetection {
  async detectPatterns(code: string, language: string): Promise<DesignPattern[]> {
    // Mock implementation - would use AST analysis
    return [
      {
        id: 'pattern_1',
        name: 'Singleton',
        type: 'creational',
        language,
        code,
        description: 'Singleton pattern detected',
        useCases: ['Configuration management'],
        confidence: 0.8,
        timestamp: new Date()
      }
    ];
  }

  async suggestImprovements(patterns: DesignPattern[]): Promise<string[]> {
    return [
      'Consider using dependency injection instead of singleton',
      'Add proper error handling',
      'Implement proper lifecycle management'
    ];
  }

  async suggestArchitecturePatterns(spec: string): Promise<DesignPattern[]> {
    return [
      {
        id: 'arch_pattern_1',
        name: 'Microservices',
        type: 'architectural',
        language: 'any',
        code: spec,
        description: 'Microservices architecture suggested',
        useCases: ['Scalable applications'],
        confidence: 0.9,
        timestamp: new Date()
      }
    ];
  }
}

export class SemanticAnalysis {
  async analyzeQuestion(question: string, context?: any): Promise<SemanticResult> {
    return {
      intent: 'code_analysis',
      entities: ['code', 'function', 'class'],
      confidence: 0.85,
      relatedConcepts: ['programming', 'development']
    };
  }

  async analyzeCode(code: string): Promise<CodeAnalysis> {
    return {
      complexity: 5.5,
      maintainability: 8.2,
      testability: 7.8,
      security: 9.0,
      performance: 6.5,
      suggestions: ['Add error handling', 'Improve documentation']
    };
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    // Mock implementation - would use actual embedding model
    return Array.from({ length: 384 }, () => Math.random());
  }
}

export interface SemanticResult {
  intent: string;
  entities: string[];
  confidence: number;
  relatedConcepts: string[];
}

export interface CodeAnalysis {
  complexity: number;
  maintainability: number;
  testability: number;
  security: number;
  performance: number;
  suggestions: string[];
}

export interface CodeChange {
  id: string;
  type: 'addition' | 'modification' | 'deletion';
  file: string;
  content: string;
  timestamp: Date;
  author: string;
}

export interface UserPreferences {
  codingStyle: string;
  preferredLanguages: string[];
  frameworks: string[];
  testingFramework: string;
  documentationStyle: string;
}

export interface AgentPerformance {
  tasksCompleted: number;
  successRate: number;
  averageResponseTime: number;
  userSatisfaction: number;
}

export interface LearningData {
  id: string;
  topic: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  timestamp: Date;
}

// Testing & QA Types
export interface TestSuite {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance';
  tests: TestCase[];
  coverage: CoverageReport;
  status: 'passing' | 'failing' | 'pending';
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  code: string;
  expectedResult: any;
  actualResult?: any;
  status: 'pass' | 'fail' | 'skip' | 'pending';
  executionTime: number;
  mocks: MockData[];
}

export interface MockData {
  id: string;
  type: 'function' | 'service' | 'database' | 'api';
  name: string;
  implementation: string;
  returnValue: any;
}

export interface CoverageReport {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
  overall: number;
  details: CoverageDetail[];
}

export interface CoverageDetail {
  file: string;
  lines: number;
  functions: number;
  branches: number;
  statements: number;
  uncovered: string[];
}

// DevOps & Automation Types
export interface CICDPipeline {
  id: string;
  name: string;
  type: 'github_actions' | 'jenkins' | 'gitlab' | 'azure_devops';
  stages: PipelineStage[];
  triggers: PipelineTrigger[];
  status: 'active' | 'inactive' | 'error';
}

export interface PipelineStage {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'security_scan';
  commands: string[];
  dependencies: string[];
  timeout: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface PipelineTrigger {
  type: 'push' | 'pull_request' | 'schedule' | 'manual';
  branch?: string;
  schedule?: string;
  conditions?: string[];
}

export interface ErrorAnalysis {
  id: string;
  error: string;
  stackTrace: string;
  frequency: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  suggestedFixes: string[];
  rootCause: string;
  timestamp: Date;
}

// Collaboration Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'reviewer' | 'admin' | 'viewer';
  permissions: string[];
  preferences: UserPreferences;
  activity: ActivityData;
}

export interface ActivityData {
  lastActive: Date;
  commitsToday: number;
  reviewsToday: number;
  linesOfCode: number;
  productivityScore: number;
}

export interface CodeReview {
  id: string;
  pullRequestId: string;
  reviewer: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'dismissed';
  comments: ReviewComment[];
  suggestions: string[];
  aiGenerated: boolean;
  timestamp: Date;
}

export interface ReviewComment {
  id: string;
  line: number;
  content: string;
  type: 'suggestion' | 'question' | 'issue';
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}

// Analytics Types
export interface DeveloperMetrics {
  developerId: string;
  period: string;
  commits: number;
  linesAdded: number;
  linesDeleted: number;
  pullRequests: number;
  reviews: number;
  bugsFixed: number;
  featuresDelivered: number;
  productivityScore: number;
  codeQualityScore: number;
}

export interface CodeHealthMetrics {
  projectId: string;
  maintainability: number;
  complexity: number;
  testCoverage: number;
  securityScore: number;
  performanceScore: number;
  technicalDebt: number;
  trends: MetricTrend[];
}

export interface MetricTrend {
  metric: string;
  value: number;
  change: number;
  period: string;
  direction: 'up' | 'down' | 'stable';
}

// Security Types
export interface SecurityScan {
  id: string;
  type: 'sast' | 'dast' | 'dependency' | 'secrets';
  status: 'pending' | 'running' | 'completed' | 'failed';
  vulnerabilities: Vulnerability[];
  recommendations: SecurityRecommendation[];
  timestamp: Date;
}

export interface Vulnerability {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  file: string;
  line: number;
  cve?: string;
  fix: string;
  confidence: number;
}

export interface SecurityRecommendation {
  id: string;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  implementation: string;
  impact: string;
}

// Multi-Modal Types
export interface VoiceCommand {
  id: string;
  command: string;
  intent: string;
  parameters: Record<string, any>;
  confidence: number;
  timestamp: Date;
}

export interface ImageAnalysis {
  id: string;
  type: 'wireframe' | 'screenshot' | 'diagram';
  content: string;
  extractedCode?: string;
  confidence: number;
  suggestions: string[];
}

// Learning Types
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  modules: LearningModule[];
  estimatedTime: number;
  prerequisites: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  type: 'tutorial' | 'challenge' | 'project' | 'quiz';
  content: string;
  exercises: Exercise[];
  completed: boolean;
}

export interface Exercise {
  id: string;
  type: 'coding' | 'multiple_choice' | 'fill_blank' | 'project';
  question: string;
  solution: string;
  hints: string[];
  difficulty: number;
}

// Marketplace Types
export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: string;
  features: string[];
  rating: number;
  downloads: number;
  price: number;
  free: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: 'slack' | 'notion' | 'figma' | 'postman' | 'confluence';
  configuration: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  lastSync: Date;
}

// Advanced Features Types
export interface ArchitectureVisualization {
  id: string;
  type: '2d' | '3d' | 'heatmap' | 'graph';
  data: any;
  interactions: Interaction[];
  filters: Filter[];
}

export interface Interaction {
  type: 'zoom' | 'pan' | 'select' | 'highlight';
  target: string;
  parameters: Record<string, any>;
}

export interface Filter {
  type: 'component' | 'dependency' | 'performance' | 'complexity';
  value: any;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
}

export interface ContextGraph {
  id: string;
  nodes: ContextNode[];
  edges: ContextEdge[];
  metadata: Record<string, any>;
}

export interface ContextNode {
  id: string;
  type: 'file' | 'function' | 'class' | 'variable' | 'dependency';
  label: string;
  properties: Record<string, any>;
  position: { x: number; y: number };
}

export interface ContextEdge {
  id: string;
  source: string;
  target: string;
  type: 'calls' | 'imports' | 'extends' | 'implements' | 'uses';
  weight: number;
  properties: Record<string, any>;
}