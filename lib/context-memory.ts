// Advanced Context Retention & Long-Term Memory System
export interface ProjectContext {
  id: string;
  name: string;
  path: string;
  architecture: ProjectArchitecture;
  conventions: CodingConventions;
  patterns: CodePattern[];
  decisions: DecisionHistory[];
  dependencies: DependencyMap;
  lastUpdated: Date;
  version: string;
}

export interface ProjectArchitecture {
  type: 'monorepo' | 'microservices' | 'monolith' | 'spa' | 'ssr' | 'mobile' | 'desktop';
  framework: string;
  language: string;
  structure: DirectoryStructure;
  patterns: string[];
  conventions: string[];
}

export interface DirectoryStructure {
  src: string;
  components: string;
  utils: string;
  api: string;
  tests: string;
  docs: string;
  config: string;
  [key: string]: string;
}

export interface CodingConventions {
  naming: {
    variables: 'camelCase' | 'snake_case' | 'PascalCase' | 'kebab-case';
    functions: 'camelCase' | 'snake_case' | 'PascalCase' | 'kebab-case';
    classes: 'PascalCase' | 'camelCase';
    constants: 'UPPER_SNAKE_CASE' | 'camelCase';
    files: 'kebab-case' | 'camelCase' | 'PascalCase';
  };
  formatting: {
    indentSize: number;
    useTabs: boolean;
    quoteStyle: 'single' | 'double';
    semicolons: boolean;
    trailingCommas: boolean;
  };
  style: {
    maxLineLength: number;
    functionLength: number;
    complexity: number;
  };
}

export interface CodePattern {
  id: string;
  name: string;
  type: 'component' | 'hook' | 'utility' | 'api' | 'test' | 'config';
  description: string;
  code: string;
  usage: string[];
  tags: string[];
  frequency: number;
  lastUsed: Date;
}

export interface DecisionHistory {
  id: string;
  timestamp: Date;
  context: string;
  decision: string;
  rationale: string;
  alternatives: string[];
  impact: 'high' | 'medium' | 'low';
  status: 'active' | 'deprecated' | 'replaced';
  relatedFiles: string[];
}

export interface DependencyMap {
  runtime: Record<string, string>;
  dev: Record<string, string>;
  peer: Record<string, string>;
  optional: Record<string, string>;
  conflicts: string[];
  vulnerabilities: Vulnerability[];
}

export interface Vulnerability {
  package: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  fix: string;
  cve?: string;
}

export interface MemoryEntry {
  id: string;
  type: 'conversation' | 'code' | 'decision' | 'pattern' | 'issue' | 'solution';
  content: string;
  context: string;
  timestamp: Date;
  importance: number;
  tags: string[];
  relatedEntries: string[];
  embeddings?: number[];
}

export interface ContextSearchResult {
  entry: MemoryEntry;
  score: number;
  relevance: string[];
  context: string;
}

export class ContextMemoryManager {
  private projects: Map<string, ProjectContext> = new Map();
  private memories: Map<string, MemoryEntry> = new Map();
  private embeddings: Map<string, number[]> = new Map();
  private searchIndex: Map<string, string[]> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load existing context from storage
    await this.loadFromStorage();
    
    // Initialize search index
    this.buildSearchIndex();
    
    this.isInitialized = true;
  }

  // Project Context Management
  async createProjectContext(project: Omit<ProjectContext, 'id' | 'lastUpdated' | 'version'>): Promise<string> {
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const context: ProjectContext = {
      ...project,
      id,
      lastUpdated: new Date(),
      version: '1.0.0'
    };

    this.projects.set(id, context);
    await this.saveToStorage();
    return id;
  }

  async updateProjectContext(projectId: string, updates: Partial<ProjectContext>): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const updatedProject = {
      ...project,
      ...updates,
      lastUpdated: new Date(),
      version: this.incrementVersion(project.version)
    };

    this.projects.set(projectId, updatedProject);
    await this.saveToStorage();
    return true;
  }

  getProjectContext(projectId: string): ProjectContext | undefined {
    return this.projects.get(projectId);
  }

  getAllProjects(): ProjectContext[] {
    return Array.from(this.projects.values());
  }

  // Memory Management
  async addMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<string> {
    const id = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const memory: MemoryEntry = {
      ...entry,
      id,
      timestamp: new Date()
    };

    this.memories.set(id, memory);
    
    // Generate embeddings for semantic search
    await this.generateEmbeddings(memory);
    
    // Update search index
    this.updateSearchIndex(memory);
    
    await this.saveToStorage();
    return id;
  }

  async updateMemory(memoryId: string, updates: Partial<MemoryEntry>): Promise<boolean> {
    const memory = this.memories.get(memoryId);
    if (!memory) return false;

    const updatedMemory = { ...memory, ...updates };
    this.memories.set(memoryId, updatedMemory);
    
    // Regenerate embeddings if content changed
    if (updates.content) {
      await this.generateEmbeddings(updatedMemory);
      this.updateSearchIndex(updatedMemory);
    }
    
    await this.saveToStorage();
    return true;
  }

  getMemory(memoryId: string): MemoryEntry | undefined {
    return this.memories.get(memoryId);
  }

  // Advanced Search
  async searchMemories(query: string, options: {
    limit?: number;
    threshold?: number;
    types?: string[];
    tags?: string[];
    timeRange?: { start: Date; end: Date };
  } = {}): Promise<ContextSearchResult[]> {
    const {
      limit = 10,
      threshold = 0.7,
      types = [],
      tags = [],
      timeRange
    } = options;

    // Generate query embeddings
    const queryEmbeddings = await this.generateQueryEmbeddings(query);
    
    const results: ContextSearchResult[] = [];
    
    for (const [id, memory] of this.memories) {
      // Filter by type
      if (types.length > 0 && !types.includes(memory.type)) continue;
      
      // Filter by tags
      if (tags.length > 0 && !tags.some(tag => memory.tags.includes(tag))) continue;
      
      // Filter by time range
      if (timeRange && (memory.timestamp < timeRange.start || memory.timestamp > timeRange.end)) continue;
      
      // Calculate similarity
      const similarity = this.calculateSimilarity(queryEmbeddings, memory.embeddings || []);
      
      if (similarity >= threshold) {
        results.push({
          entry: memory,
          score: similarity,
          relevance: this.extractRelevance(query, memory),
          context: this.buildContext(memory)
        });
      }
    }
    
    // Sort by score and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Pattern Recognition
  async analyzeCodePatterns(code: string, filePath: string): Promise<CodePattern[]> {
    const patterns: CodePattern[] = [];
    
    // Extract component patterns
    const componentPatterns = this.extractComponentPatterns(code);
    patterns.push(...componentPatterns);
    
    // Extract hook patterns
    const hookPatterns = this.extractHookPatterns(code);
    patterns.push(...hookPatterns);
    
    // Extract utility patterns
    const utilityPatterns = this.extractUtilityPatterns(code);
    patterns.push(...utilityPatterns);
    
    // Extract API patterns
    const apiPatterns = this.extractAPIPatterns(code);
    patterns.push(...apiPatterns);
    
    // Update existing patterns or create new ones
    for (const pattern of patterns) {
      const existing = this.findExistingPattern(pattern);
      if (existing) {
        existing.frequency++;
        existing.lastUsed = new Date();
        existing.usage.push(filePath);
      } else {
        await this.addMemory({
          type: 'pattern',
          content: pattern.code,
          context: `Pattern found in ${filePath}`,
          importance: 0.8,
          tags: [pattern.type, ...pattern.tags],
          relatedEntries: []
        });
      }
    }
    
    return patterns;
  }

  // Decision Tracking
  async recordDecision(decision: Omit<DecisionHistory, 'id' | 'timestamp'>): Promise<string> {
    const id = `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const decisionRecord: DecisionHistory = {
      ...decision,
      id,
      timestamp: new Date()
    };

    // Add to memory
    await this.addMemory({
      type: 'decision',
      content: decision.decision,
      context: decision.context,
      importance: decision.impact === 'high' ? 0.9 : decision.impact === 'medium' ? 0.7 : 0.5,
      tags: ['decision', decision.impact, ...decision.relatedFiles],
      relatedEntries: []
    });

    // Update project context
    const project = this.getCurrentProject();
    if (project) {
      project.decisions.push(decisionRecord);
      await this.updateProjectContext(project.id, { decisions: project.decisions });
    }

    return id;
  }

  // Context Building
  async buildContextualResponse(query: string, currentFile?: string): Promise<{
    relevantMemories: MemoryEntry[];
    projectContext: ProjectContext | null;
    patterns: CodePattern[];
    decisions: DecisionHistory[];
    suggestions: string[];
  }> {
    // Search for relevant memories
    const relevantMemories = await this.searchMemories(query, { limit: 5 });
    
    // Get current project context
    const projectContext = this.getCurrentProject();
    
    // Find relevant patterns
    const patterns = this.findRelevantPatterns(query);
    
    // Find relevant decisions
    const decisions = this.findRelevantDecisions(query);
    
    // Generate suggestions based on context
    const suggestions = await this.generateContextualSuggestions(query, {
      memories: relevantMemories.map(r => r.entry),
      project: projectContext,
      patterns,
      decisions,
      currentFile
    });

    return {
      relevantMemories: relevantMemories.map(r => r.entry),
      projectContext,
      patterns,
      decisions,
      suggestions
    };
  }

  // Private helper methods
  private async generateEmbeddings(memory: MemoryEntry): Promise<void> {
    // This would integrate with an embedding service like OpenAI's text-embedding-ada-002
    // For now, we'll use a simple hash-based approach
    const content = `${memory.content} ${memory.context} ${memory.tags.join(' ')}`;
    const embeddings = this.simpleEmbedding(content);
    this.embeddings.set(memory.id, embeddings);
    memory.embeddings = embeddings;
  }

  private async generateQueryEmbeddings(query: string): Promise<number[]> {
    return this.simpleEmbedding(query);
  }

  private simpleEmbedding(text: string): number[] {
    // Simple hash-based embedding (in production, use a real embedding service)
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0); // Standard embedding size
    
    for (const word of words) {
      const hash = this.hashString(word);
      const index = hash % 384;
      embedding[index] += 1;
    }
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) return 0;
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }
    
    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  }

  private extractRelevance(query: string, memory: MemoryEntry): string[] {
    const relevance: string[] = [];
    const queryLower = query.toLowerCase();
    
    if (memory.content.toLowerCase().includes(queryLower)) {
      relevance.push('content match');
    }
    
    if (memory.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
      relevance.push('tag match');
    }
    
    if (memory.context.toLowerCase().includes(queryLower)) {
      relevance.push('context match');
    }
    
    return relevance;
  }

  private buildContext(memory: MemoryEntry): string {
    return `${memory.type}: ${memory.content.substring(0, 200)}... (${memory.timestamp.toLocaleDateString()})`;
  }

  private extractComponentPatterns(code: string): CodePattern[] {
    const patterns: CodePattern[] = [];
    
    // React component patterns
    const componentRegex = /(?:function|const)\s+(\w+)\s*(?:=|:)\s*(?:\([^)]*\)\s*=>\s*)?{[\s\S]*?return\s*\([\s\S]*?\)[\s\S]*?}/g;
    let match;
    
    while ((match = componentRegex.exec(code)) !== null) {
      patterns.push({
        id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: match[1],
        type: 'component',
        description: `React component: ${match[1]}`,
        code: match[0],
        usage: [],
        tags: ['react', 'component', 'jsx'],
        frequency: 1,
        lastUsed: new Date()
      });
    }
    
    return patterns;
  }

  private extractHookPatterns(code: string): CodePattern[] {
    const patterns: CodePattern[] = [];
    
    // Custom hook patterns
    const hookRegex = /(?:function|const)\s+use(\w+)\s*(?:=|:)\s*(?:\([^)]*\)\s*=>\s*)?{[\s\S]*?}/g;
    let match;
    
    while ((match = hookRegex.exec(code)) !== null) {
      patterns.push({
        id: `hook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `use${match[1]}`,
        type: 'hook',
        description: `Custom hook: use${match[1]}`,
        code: match[0],
        usage: [],
        tags: ['react', 'hook', 'custom'],
        frequency: 1,
        lastUsed: new Date()
      });
    }
    
    return patterns;
  }

  private extractUtilityPatterns(code: string): CodePattern[] {
    const patterns: CodePattern[] = [];
    
    // Utility function patterns
    const utilityRegex = /(?:function|const)\s+(\w+)\s*(?:=|:)\s*(?:\([^)]*\)\s*=>\s*)?{[\s\S]*?}/g;
    let match;
    
    while ((match = utilityRegex.exec(code)) !== null) {
      if (!match[1].startsWith('use') && !match[1].match(/^[A-Z]/)) {
        patterns.push({
          id: `utility_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: match[1],
          type: 'utility',
          description: `Utility function: ${match[1]}`,
          code: match[0],
          usage: [],
          tags: ['utility', 'function'],
          frequency: 1,
          lastUsed: new Date()
        });
      }
    }
    
    return patterns;
  }

  private extractAPIPatterns(code: string): CodePattern[] {
    const patterns: CodePattern[] = [];
    
    // API endpoint patterns
    const apiRegex = /(?:app\.|router\.)(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let match;
    
    while ((match = apiRegex.exec(code)) !== null) {
      patterns.push({
        id: `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${match[1].toUpperCase()} ${match[2]}`,
        type: 'api',
        description: `API endpoint: ${match[1].toUpperCase()} ${match[2]}`,
        code: match[0],
        usage: [],
        tags: ['api', 'endpoint', match[1].toLowerCase()],
        frequency: 1,
        lastUsed: new Date()
      });
    }
    
    return patterns;
  }

  private findExistingPattern(pattern: CodePattern): CodePattern | null {
    // Simple pattern matching based on name and type
    for (const [id, memory] of this.memories) {
      if (memory.type === 'pattern' && memory.content.includes(pattern.name)) {
        // This is a simplified approach - in production, use more sophisticated matching
        return {
          id: memory.id,
          name: pattern.name,
          type: pattern.type,
          description: memory.content,
          code: memory.content,
          usage: [],
          tags: memory.tags,
          frequency: 1,
          lastUsed: new Date()
        };
      }
    }
    return null;
  }

  private findRelevantPatterns(query: string): CodePattern[] {
    // Search for patterns related to the query
    const results: CodePattern[] = [];
    const queryLower = query.toLowerCase();
    
    for (const [id, memory] of this.memories) {
      if (memory.type === 'pattern' && 
          (memory.content.toLowerCase().includes(queryLower) || 
           memory.tags.some(tag => tag.toLowerCase().includes(queryLower)))) {
        results.push({
          id: memory.id,
          name: memory.content.split('\n')[0] || 'Unknown',
          type: 'component', // Simplified
          description: memory.content,
          code: memory.content,
          usage: [],
          tags: memory.tags,
          frequency: 1,
          lastUsed: memory.timestamp
        });
      }
    }
    
    return results;
  }

  private findRelevantDecisions(query: string): DecisionHistory[] {
    const results: DecisionHistory[] = [];
    const queryLower = query.toLowerCase();
    
    for (const project of this.projects.values()) {
      for (const decision of project.decisions) {
        if (decision.decision.toLowerCase().includes(queryLower) ||
            decision.context.toLowerCase().includes(queryLower) ||
            decision.rationale.toLowerCase().includes(queryLower)) {
          results.push(decision);
        }
      }
    }
    
    return results;
  }

  private async generateContextualSuggestions(query: string, context: any): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Generate suggestions based on patterns
    if (context.patterns.length > 0) {
      suggestions.push(`Consider using the ${context.patterns[0].name} pattern found in your codebase`);
    }
    
    // Generate suggestions based on decisions
    if (context.decisions.length > 0) {
      suggestions.push(`Previous decision: ${context.decisions[0].decision}`);
    }
    
    // Generate suggestions based on project context
    if (context.project) {
      suggestions.push(`Based on your ${context.project.architecture.type} architecture`);
    }
    
    return suggestions;
  }

  private getCurrentProject(): ProjectContext | null {
    // In a real implementation, this would determine the current project
    // For now, return the first project
    return Array.from(this.projects.values())[0] || null;
  }

  private incrementVersion(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  private buildSearchIndex(): void {
    this.searchIndex.clear();
    
    for (const [id, memory] of this.memories) {
      const words = `${memory.content} ${memory.context} ${memory.tags.join(' ')}`
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2);
      
      this.searchIndex.set(id, words);
    }
  }

  private updateSearchIndex(memory: MemoryEntry): void {
    const words = `${memory.content} ${memory.context} ${memory.tags.join(' ')}`
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    this.searchIndex.set(memory.id, words);
  }

  private async loadFromStorage(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('context_memory');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Restore projects
        if (data.projects) {
          for (const project of data.projects) {
            this.projects.set(project.id, project);
          }
        }
        
        // Restore memories
        if (data.memories) {
          for (const memory of data.memories) {
            this.memories.set(memory.id, memory);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load context memory:', error);
    }
  }

  private async saveToStorage(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const data = {
        projects: Array.from(this.projects.values()),
        memories: Array.from(this.memories.values())
      };
      
      localStorage.setItem('context_memory', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save context memory:', error);
    }
  }
}
export interface ProjectContext {
  id: string;
  name: string;
  path: string;
  architecture: ProjectArchitecture;
  conventions: CodingConventions;
  patterns: CodePattern[];
  decisions: DecisionHistory[];
  dependencies: DependencyMap;
  lastUpdated: Date;
  version: string;
}

export interface ProjectArchitecture {
  type: 'monorepo' | 'microservices' | 'monolith' | 'spa' | 'ssr' | 'mobile' | 'desktop';
  framework: string;
  language: string;
  structure: DirectoryStructure;
  patterns: string[];
  conventions: string[];
}

export interface DirectoryStructure {
  src: string;
  components: string;
  utils: string;
  api: string;
  tests: string;
  docs: string;
  config: string;
  [key: string]: string;
}

export interface CodingConventions {
  naming: {
    variables: 'camelCase' | 'snake_case' | 'PascalCase' | 'kebab-case';
    functions: 'camelCase' | 'snake_case' | 'PascalCase' | 'kebab-case';
    classes: 'PascalCase' | 'camelCase';
    constants: 'UPPER_SNAKE_CASE' | 'camelCase';
    files: 'kebab-case' | 'camelCase' | 'PascalCase';
  };
  formatting: {
    indentSize: number;
    useTabs: boolean;
    quoteStyle: 'single' | 'double';
    semicolons: boolean;
    trailingCommas: boolean;
  };
  style: {
    maxLineLength: number;
    functionLength: number;
    complexity: number;
  };
}

export interface CodePattern {
  id: string;
  name: string;
  type: 'component' | 'hook' | 'utility' | 'api' | 'test' | 'config';
  description: string;
  code: string;
  usage: string[];
  tags: string[];
  frequency: number;
  lastUsed: Date;
}

export interface DecisionHistory {
  id: string;
  timestamp: Date;
  context: string;
  decision: string;
  rationale: string;
  alternatives: string[];
  impact: 'high' | 'medium' | 'low';
  status: 'active' | 'deprecated' | 'replaced';
  relatedFiles: string[];
}

export interface DependencyMap {
  runtime: Record<string, string>;
  dev: Record<string, string>;
  peer: Record<string, string>;
  optional: Record<string, string>;
  conflicts: string[];
  vulnerabilities: Vulnerability[];
}

export interface Vulnerability {
  package: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  fix: string;
  cve?: string;
}

export interface MemoryEntry {
  id: string;
  type: 'conversation' | 'code' | 'decision' | 'pattern' | 'issue' | 'solution';
  content: string;
  context: string;
  timestamp: Date;
  importance: number;
  tags: string[];
  relatedEntries: string[];
  embeddings?: number[];
}

export interface ContextSearchResult {
  entry: MemoryEntry;
  score: number;
  relevance: string[];
  context: string;
}

export class ContextMemoryManager {
  private projects: Map<string, ProjectContext> = new Map();
  private memories: Map<string, MemoryEntry> = new Map();
  private embeddings: Map<string, number[]> = new Map();
  private searchIndex: Map<string, string[]> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load existing context from storage
    await this.loadFromStorage();
    
    // Initialize search index
    this.buildSearchIndex();
    
    this.isInitialized = true;
  }

  // Project Context Management
  async createProjectContext(project: Omit<ProjectContext, 'id' | 'lastUpdated' | 'version'>): Promise<string> {
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const context: ProjectContext = {
      ...project,
      id,
      lastUpdated: new Date(),
      version: '1.0.0'
    };

    this.projects.set(id, context);
    await this.saveToStorage();
    return id;
  }

  async updateProjectContext(projectId: string, updates: Partial<ProjectContext>): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const updatedProject = {
      ...project,
      ...updates,
      lastUpdated: new Date(),
      version: this.incrementVersion(project.version)
    };

    this.projects.set(projectId, updatedProject);
    await this.saveToStorage();
    return true;
  }

  getProjectContext(projectId: string): ProjectContext | undefined {
    return this.projects.get(projectId);
  }

  getAllProjects(): ProjectContext[] {
    return Array.from(this.projects.values());
  }

  // Memory Management
  async addMemory(entry: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<string> {
    const id = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const memory: MemoryEntry = {
      ...entry,
      id,
      timestamp: new Date()
    };

    this.memories.set(id, memory);
    
    // Generate embeddings for semantic search
    await this.generateEmbeddings(memory);
    
    // Update search index
    this.updateSearchIndex(memory);
    
    await this.saveToStorage();
    return id;
  }

  async updateMemory(memoryId: string, updates: Partial<MemoryEntry>): Promise<boolean> {
    const memory = this.memories.get(memoryId);
    if (!memory) return false;

    const updatedMemory = { ...memory, ...updates };
    this.memories.set(memoryId, updatedMemory);
    
    // Regenerate embeddings if content changed
    if (updates.content) {
      await this.generateEmbeddings(updatedMemory);
      this.updateSearchIndex(updatedMemory);
    }
    
    await this.saveToStorage();
    return true;
  }

  getMemory(memoryId: string): MemoryEntry | undefined {
    return this.memories.get(memoryId);
  }

  // Advanced Search
  async searchMemories(query: string, options: {
    limit?: number;
    threshold?: number;
    types?: string[];
    tags?: string[];
    timeRange?: { start: Date; end: Date };
  } = {}): Promise<ContextSearchResult[]> {
    const {
      limit = 10,
      threshold = 0.7,
      types = [],
      tags = [],
      timeRange
    } = options;

    // Generate query embeddings
    const queryEmbeddings = await this.generateQueryEmbeddings(query);
    
    const results: ContextSearchResult[] = [];
    
    for (const [id, memory] of this.memories) {
      // Filter by type
      if (types.length > 0 && !types.includes(memory.type)) continue;
      
      // Filter by tags
      if (tags.length > 0 && !tags.some(tag => memory.tags.includes(tag))) continue;
      
      // Filter by time range
      if (timeRange && (memory.timestamp < timeRange.start || memory.timestamp > timeRange.end)) continue;
      
      // Calculate similarity
      const similarity = this.calculateSimilarity(queryEmbeddings, memory.embeddings || []);
      
      if (similarity >= threshold) {
        results.push({
          entry: memory,
          score: similarity,
          relevance: this.extractRelevance(query, memory),
          context: this.buildContext(memory)
        });
      }
    }
    
    // Sort by score and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Pattern Recognition
  async analyzeCodePatterns(code: string, filePath: string): Promise<CodePattern[]> {
    const patterns: CodePattern[] = [];
    
    // Extract component patterns
    const componentPatterns = this.extractComponentPatterns(code);
    patterns.push(...componentPatterns);
    
    // Extract hook patterns
    const hookPatterns = this.extractHookPatterns(code);
    patterns.push(...hookPatterns);
    
    // Extract utility patterns
    const utilityPatterns = this.extractUtilityPatterns(code);
    patterns.push(...utilityPatterns);
    
    // Extract API patterns
    const apiPatterns = this.extractAPIPatterns(code);
    patterns.push(...apiPatterns);
    
    // Update existing patterns or create new ones
    for (const pattern of patterns) {
      const existing = this.findExistingPattern(pattern);
      if (existing) {
        existing.frequency++;
        existing.lastUsed = new Date();
        existing.usage.push(filePath);
      } else {
        await this.addMemory({
          type: 'pattern',
          content: pattern.code,
          context: `Pattern found in ${filePath}`,
          importance: 0.8,
          tags: [pattern.type, ...pattern.tags],
          relatedEntries: []
        });
      }
    }
    
    return patterns;
  }

  // Decision Tracking
  async recordDecision(decision: Omit<DecisionHistory, 'id' | 'timestamp'>): Promise<string> {
    const id = `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const decisionRecord: DecisionHistory = {
      ...decision,
      id,
      timestamp: new Date()
    };

    // Add to memory
    await this.addMemory({
      type: 'decision',
      content: decision.decision,
      context: decision.context,
      importance: decision.impact === 'high' ? 0.9 : decision.impact === 'medium' ? 0.7 : 0.5,
      tags: ['decision', decision.impact, ...decision.relatedFiles],
      relatedEntries: []
    });

    // Update project context
    const project = this.getCurrentProject();
    if (project) {
      project.decisions.push(decisionRecord);
      await this.updateProjectContext(project.id, { decisions: project.decisions });
    }

    return id;
  }

  // Context Building
  async buildContextualResponse(query: string, currentFile?: string): Promise<{
    relevantMemories: MemoryEntry[];
    projectContext: ProjectContext | null;
    patterns: CodePattern[];
    decisions: DecisionHistory[];
    suggestions: string[];
  }> {
    // Search for relevant memories
    const relevantMemories = await this.searchMemories(query, { limit: 5 });
    
    // Get current project context
    const projectContext = this.getCurrentProject();
    
    // Find relevant patterns
    const patterns = this.findRelevantPatterns(query);
    
    // Find relevant decisions
    const decisions = this.findRelevantDecisions(query);
    
    // Generate suggestions based on context
    const suggestions = await this.generateContextualSuggestions(query, {
      memories: relevantMemories.map(r => r.entry),
      project: projectContext,
      patterns,
      decisions,
      currentFile
    });

    return {
      relevantMemories: relevantMemories.map(r => r.entry),
      projectContext,
      patterns,
      decisions,
      suggestions
    };
  }

  // Private helper methods
  private async generateEmbeddings(memory: MemoryEntry): Promise<void> {
    // This would integrate with an embedding service like OpenAI's text-embedding-ada-002
    // For now, we'll use a simple hash-based approach
    const content = `${memory.content} ${memory.context} ${memory.tags.join(' ')}`;
    const embeddings = this.simpleEmbedding(content);
    this.embeddings.set(memory.id, embeddings);
    memory.embeddings = embeddings;
  }

  private async generateQueryEmbeddings(query: string): Promise<number[]> {
    return this.simpleEmbedding(query);
  }

  private simpleEmbedding(text: string): number[] {
    // Simple hash-based embedding (in production, use a real embedding service)
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0); // Standard embedding size
    
    for (const word of words) {
      const hash = this.hashString(word);
      const index = hash % 384;
      embedding[index] += 1;
    }
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) return 0;
    
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      magnitude1 += embedding1[i] * embedding1[i];
      magnitude2 += embedding2[i] * embedding2[i];
    }
    
    return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  }

  private extractRelevance(query: string, memory: MemoryEntry): string[] {
    const relevance: string[] = [];
    const queryLower = query.toLowerCase();
    
    if (memory.content.toLowerCase().includes(queryLower)) {
      relevance.push('content match');
    }
    
    if (memory.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
      relevance.push('tag match');
    }
    
    if (memory.context.toLowerCase().includes(queryLower)) {
      relevance.push('context match');
    }
    
    return relevance;
  }

  private buildContext(memory: MemoryEntry): string {
    return `${memory.type}: ${memory.content.substring(0, 200)}... (${memory.timestamp.toLocaleDateString()})`;
  }

  private extractComponentPatterns(code: string): CodePattern[] {
    const patterns: CodePattern[] = [];
    
    // React component patterns
    const componentRegex = /(?:function|const)\s+(\w+)\s*(?:=|:)\s*(?:\([^)]*\)\s*=>\s*)?{[\s\S]*?return\s*\([\s\S]*?\)[\s\S]*?}/g;
    let match;
    
    while ((match = componentRegex.exec(code)) !== null) {
      patterns.push({
        id: `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: match[1],
        type: 'component',
        description: `React component: ${match[1]}`,
        code: match[0],
        usage: [],
        tags: ['react', 'component', 'jsx'],
        frequency: 1,
        lastUsed: new Date()
      });
    }
    
    return patterns;
  }

  private extractHookPatterns(code: string): CodePattern[] {
    const patterns: CodePattern[] = [];
    
    // Custom hook patterns
    const hookRegex = /(?:function|const)\s+use(\w+)\s*(?:=|:)\s*(?:\([^)]*\)\s*=>\s*)?{[\s\S]*?}/g;
    let match;
    
    while ((match = hookRegex.exec(code)) !== null) {
      patterns.push({
        id: `hook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `use${match[1]}`,
        type: 'hook',
        description: `Custom hook: use${match[1]}`,
        code: match[0],
        usage: [],
        tags: ['react', 'hook', 'custom'],
        frequency: 1,
        lastUsed: new Date()
      });
    }
    
    return patterns;
  }

  private extractUtilityPatterns(code: string): CodePattern[] {
    const patterns: CodePattern[] = [];
    
    // Utility function patterns
    const utilityRegex = /(?:function|const)\s+(\w+)\s*(?:=|:)\s*(?:\([^)]*\)\s*=>\s*)?{[\s\S]*?}/g;
    let match;
    
    while ((match = utilityRegex.exec(code)) !== null) {
      if (!match[1].startsWith('use') && !match[1].match(/^[A-Z]/)) {
        patterns.push({
          id: `utility_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: match[1],
          type: 'utility',
          description: `Utility function: ${match[1]}`,
          code: match[0],
          usage: [],
          tags: ['utility', 'function'],
          frequency: 1,
          lastUsed: new Date()
        });
      }
    }
    
    return patterns;
  }

  private extractAPIPatterns(code: string): CodePattern[] {
    const patterns: CodePattern[] = [];
    
    // API endpoint patterns
    const apiRegex = /(?:app\.|router\.)(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let match;
    
    while ((match = apiRegex.exec(code)) !== null) {
      patterns.push({
        id: `api_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${match[1].toUpperCase()} ${match[2]}`,
        type: 'api',
        description: `API endpoint: ${match[1].toUpperCase()} ${match[2]}`,
        code: match[0],
        usage: [],
        tags: ['api', 'endpoint', match[1].toLowerCase()],
        frequency: 1,
        lastUsed: new Date()
      });
    }
    
    return patterns;
  }

  private findExistingPattern(pattern: CodePattern): CodePattern | null {
    // Simple pattern matching based on name and type
    for (const [id, memory] of this.memories) {
      if (memory.type === 'pattern' && memory.content.includes(pattern.name)) {
        // This is a simplified approach - in production, use more sophisticated matching
        return {
          id: memory.id,
          name: pattern.name,
          type: pattern.type,
          description: memory.content,
          code: memory.content,
          usage: [],
          tags: memory.tags,
          frequency: 1,
          lastUsed: new Date()
        };
      }
    }
    return null;
  }

  private findRelevantPatterns(query: string): CodePattern[] {
    // Search for patterns related to the query
    const results: CodePattern[] = [];
    const queryLower = query.toLowerCase();
    
    for (const [id, memory] of this.memories) {
      if (memory.type === 'pattern' && 
          (memory.content.toLowerCase().includes(queryLower) || 
           memory.tags.some(tag => tag.toLowerCase().includes(queryLower)))) {
        results.push({
          id: memory.id,
          name: memory.content.split('\n')[0] || 'Unknown',
          type: 'component', // Simplified
          description: memory.content,
          code: memory.content,
          usage: [],
          tags: memory.tags,
          frequency: 1,
          lastUsed: memory.timestamp
        });
      }
    }
    
    return results;
  }

  private findRelevantDecisions(query: string): DecisionHistory[] {
    const results: DecisionHistory[] = [];
    const queryLower = query.toLowerCase();
    
    for (const project of this.projects.values()) {
      for (const decision of project.decisions) {
        if (decision.decision.toLowerCase().includes(queryLower) ||
            decision.context.toLowerCase().includes(queryLower) ||
            decision.rationale.toLowerCase().includes(queryLower)) {
          results.push(decision);
        }
      }
    }
    
    return results;
  }

  private async generateContextualSuggestions(query: string, context: any): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Generate suggestions based on patterns
    if (context.patterns.length > 0) {
      suggestions.push(`Consider using the ${context.patterns[0].name} pattern found in your codebase`);
    }
    
    // Generate suggestions based on decisions
    if (context.decisions.length > 0) {
      suggestions.push(`Previous decision: ${context.decisions[0].decision}`);
    }
    
    // Generate suggestions based on project context
    if (context.project) {
      suggestions.push(`Based on your ${context.project.architecture.type} architecture`);
    }
    
    return suggestions;
  }

  private getCurrentProject(): ProjectContext | null {
    // In a real implementation, this would determine the current project
    // For now, return the first project
    return Array.from(this.projects.values())[0] || null;
  }

  private incrementVersion(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  private buildSearchIndex(): void {
    this.searchIndex.clear();
    
    for (const [id, memory] of this.memories) {
      const words = `${memory.content} ${memory.context} ${memory.tags.join(' ')}`
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2);
      
      this.searchIndex.set(id, words);
    }
  }

  private updateSearchIndex(memory: MemoryEntry): void {
    const words = `${memory.content} ${memory.context} ${memory.tags.join(' ')}`
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    this.searchIndex.set(memory.id, words);
  }

  private async loadFromStorage(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('context_memory');
      if (stored) {
        const data = JSON.parse(stored);
        
        // Restore projects
        if (data.projects) {
          for (const project of data.projects) {
            this.projects.set(project.id, project);
          }
        }
        
        // Restore memories
        if (data.memories) {
          for (const memory of data.memories) {
            this.memories.set(memory.id, memory);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load context memory:', error);
    }
  }

  private async saveToStorage(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const data = {
        projects: Array.from(this.projects.values()),
        memories: Array.from(this.memories.values())
      };
      
      localStorage.setItem('context_memory', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save context memory:', error);
    }
  }
}




