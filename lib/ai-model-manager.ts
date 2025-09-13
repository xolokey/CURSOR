// AI Model Choice & Switching System
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'code' | 'image' | 'multimodal' | 'embedding' | 'custom';
  capabilities: ModelCapabilities;
  performance: ModelPerformance;
  cost: ModelCost;
  availability: ModelAvailability;
  configuration: ModelConfiguration;
  metadata: ModelMetadata;
}

export interface ModelCapabilities {
  languages: string[];
  maxTokens: number;
  contextWindow: number;
  functions: string[];
  features: string[];
  modalities: string[];
  specializations: string[];
}

export interface ModelPerformance {
  speed: 'slow' | 'medium' | 'fast' | 'ultra_fast';
  accuracy: number;
  latency: number;
  throughput: number;
  reliability: number;
  consistency: number;
}

export interface ModelCost {
  inputTokens: number; // per 1K tokens
  outputTokens: number; // per 1K tokens
  requests: number; // per request
  monthly: number; // monthly subscription
  currency: string;
  freeTier: {
    enabled: boolean;
    limit: number;
    resetPeriod: 'daily' | 'monthly';
  };
}

export interface ModelAvailability {
  status: 'available' | 'limited' | 'unavailable' | 'maintenance';
  regions: string[];
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
    requestsPerDay: number;
    tokensPerDay: number;
  };
  sla: number; // uptime percentage
}

export interface ModelConfiguration {
  temperature: number;
  topP: number;
  maxTokens: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
  customParameters: Record<string, any>;
}

export interface ModelMetadata {
  version: string;
  releaseDate: Date;
  lastUpdated: Date;
  documentation: string;
  changelog: string[];
  knownIssues: string[];
  recommendations: string[];
}

export interface ModelSelectionCriteria {
  task: string;
  priority: 'speed' | 'quality' | 'cost' | 'balanced';
  constraints: {
    maxLatency?: number;
    maxCost?: number;
    minAccuracy?: number;
    requiredFeatures?: string[];
    language?: string;
    contextSize?: number;
  };
  preferences: {
    provider?: string;
    modelType?: string;
    avoidModels?: string[];
  };
}

export interface ModelSwitch {
  id: string;
  fromModel: string;
  toModel: string;
  reason: string;
  timestamp: Date;
  performance: {
    latency: number;
    quality: number;
    cost: number;
  };
  user: string;
  context: string;
}

export interface ModelUsage {
  modelId: string;
  timestamp: Date;
  tokens: number;
  cost: number;
  latency: number;
  quality: number;
  task: string;
  success: boolean;
  error?: string;
}

export interface ModelRecommendation {
  modelId: string;
  score: number;
  reasons: string[];
  alternatives: string[];
  confidence: number;
}

export class AIModelManager {
  private models: Map<string, AIModel> = new Map();
  private currentModel: string | null = null;
  private usage: Map<string, ModelUsage[]> = new Map();
  private switches: ModelSwitch[] = [];
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load available models
    await this.loadAvailableModels();
    
    // Set default model
    this.setDefaultModel();
    
    this.isInitialized = true;
  }

  // Model Management
  async loadAvailableModels(): Promise<void> {
    const availableModels: AIModel[] = [
      // OpenAI Models
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        type: 'multimodal',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'],
          maxTokens: 128000,
          contextWindow: 128000,
          functions: ['code_generation', 'code_explanation', 'debugging', 'refactoring', 'testing'],
          features: ['vision', 'function_calling', 'json_mode', 'parallel_tool_calling'],
          modalities: ['text', 'image'],
          specializations: ['reasoning', 'code', 'analysis']
        },
        performance: {
          speed: 'fast',
          accuracy: 0.95,
          latency: 1200,
          throughput: 1000,
          reliability: 0.99,
          consistency: 0.92
        },
        cost: {
          inputTokens: 0.005,
          outputTokens: 0.015,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: false, limit: 0, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 500,
            tokensPerMinute: 150000,
            requestsPerDay: 10000,
            tokensPerDay: 1000000
          },
          sla: 99.9
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 4096,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '4.0',
          releaseDate: new Date('2024-05-13'),
          lastUpdated: new Date(),
          documentation: 'https://platform.openai.com/docs/models/gpt-4o',
          changelog: ['Added vision capabilities', 'Improved code generation'],
          knownIssues: ['Occasional hallucinations in complex code'],
          recommendations: ['Best for complex reasoning tasks', 'Use for code generation and analysis']
        }
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai',
        type: 'multimodal',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust'],
          maxTokens: 128000,
          contextWindow: 128000,
          functions: ['code_generation', 'code_explanation', 'debugging'],
          features: ['vision', 'function_calling', 'json_mode'],
          modalities: ['text', 'image'],
          specializations: ['code', 'analysis']
        },
        performance: {
          speed: 'ultra_fast',
          accuracy: 0.90,
          latency: 600,
          throughput: 2000,
          reliability: 0.99,
          consistency: 0.88
        },
        cost: {
          inputTokens: 0.00015,
          outputTokens: 0.0006,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: false, limit: 0, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 1000,
            tokensPerMinute: 200000,
            requestsPerDay: 20000,
            tokensPerDay: 2000000
          },
          sla: 99.9
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 4096,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '4.0-mini',
          releaseDate: new Date('2024-07-18'),
          lastUpdated: new Date(),
          documentation: 'https://platform.openai.com/docs/models/gpt-4o-mini',
          changelog: ['Faster and more cost-effective than GPT-4o'],
          knownIssues: [],
          recommendations: ['Best for simple to medium complexity tasks', 'Great for rapid prototyping']
        }
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        type: 'text',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust'],
          maxTokens: 16384,
          contextWindow: 16384,
          functions: ['code_generation', 'code_explanation'],
          features: ['function_calling', 'json_mode'],
          modalities: ['text'],
          specializations: ['code', 'conversation']
        },
        performance: {
          speed: 'ultra_fast',
          accuracy: 0.85,
          latency: 300,
          throughput: 3000,
          reliability: 0.99,
          consistency: 0.85
        },
        cost: {
          inputTokens: 0.0005,
          outputTokens: 0.0015,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: false, limit: 0, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 2000,
            tokensPerMinute: 300000,
            requestsPerDay: 50000,
            tokensPerDay: 5000000
          },
          sla: 99.9
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 4096,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '3.5-turbo',
          releaseDate: new Date('2023-03-01'),
          lastUpdated: new Date(),
          documentation: 'https://platform.openai.com/docs/models/gpt-3-5-turbo',
          changelog: ['Improved code generation', 'Better instruction following'],
          knownIssues: ['Limited context window', 'Less accurate than GPT-4'],
          recommendations: ['Good for simple tasks', 'Cost-effective option']
        }
      },

      // Google Models
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        type: 'multimodal',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'kotlin', 'swift'],
          maxTokens: 2000000,
          contextWindow: 2000000,
          functions: ['code_generation', 'code_explanation', 'debugging', 'refactoring', 'testing', 'analysis'],
          features: ['vision', 'function_calling', 'json_mode', 'parallel_tool_calling', 'long_context'],
          modalities: ['text', 'image', 'audio', 'video'],
          specializations: ['reasoning', 'code', 'analysis', 'long_context']
        },
        performance: {
          speed: 'medium',
          accuracy: 0.94,
          latency: 2000,
          throughput: 800,
          reliability: 0.98,
          consistency: 0.90
        },
        cost: {
          inputTokens: 0.00125,
          outputTokens: 0.005,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: true, limit: 1500, resetPeriod: 'daily' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 300,
            tokensPerMinute: 100000,
            requestsPerDay: 5000,
            tokensPerDay: 500000
          },
          sla: 99.5
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 8192,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '1.5-pro',
          releaseDate: new Date('2024-02-15'),
          lastUpdated: new Date(),
          documentation: 'https://ai.google.dev/docs/gemini_api_overview',
          changelog: ['Added long context support', 'Improved code generation'],
          knownIssues: ['Slower than GPT-4o', 'Limited function calling'],
          recommendations: ['Best for long context tasks', 'Great for code analysis']
        }
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        type: 'multimodal',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust'],
          maxTokens: 1000000,
          contextWindow: 1000000,
          functions: ['code_generation', 'code_explanation', 'debugging'],
          features: ['vision', 'function_calling', 'json_mode', 'long_context'],
          modalities: ['text', 'image'],
          specializations: ['code', 'analysis', 'long_context']
        },
        performance: {
          speed: 'fast',
          accuracy: 0.88,
          latency: 800,
          throughput: 1500,
          reliability: 0.99,
          consistency: 0.87
        },
        cost: {
          inputTokens: 0.000075,
          outputTokens: 0.0003,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: true, limit: 1500, resetPeriod: 'daily' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 1000,
            tokensPerMinute: 200000,
            requestsPerDay: 20000,
            tokensPerDay: 2000000
          },
          sla: 99.5
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 8192,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '1.5-flash',
          releaseDate: new Date('2024-05-14'),
          lastUpdated: new Date(),
          documentation: 'https://ai.google.dev/docs/gemini_api_overview',
          changelog: ['Faster than Pro version', 'Good balance of speed and quality'],
          knownIssues: [],
          recommendations: ['Good for rapid development', 'Cost-effective for most tasks']
        }
      },

      // Anthropic Models
      {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        type: 'text',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby'],
          maxTokens: 200000,
          contextWindow: 200000,
          functions: ['code_generation', 'code_explanation', 'debugging', 'refactoring', 'testing', 'analysis'],
          features: ['function_calling', 'json_mode', 'long_context', 'code_execution'],
          modalities: ['text'],
          specializations: ['reasoning', 'code', 'analysis', 'long_context']
        },
        performance: {
          speed: 'fast',
          accuracy: 0.96,
          latency: 1000,
          throughput: 1200,
          reliability: 0.99,
          consistency: 0.94
        },
        cost: {
          inputTokens: 0.003,
          outputTokens: 0.015,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: false, limit: 0, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu'],
          rateLimits: {
            requestsPerMinute: 400,
            tokensPerMinute: 120000,
            requestsPerDay: 8000,
            tokensPerDay: 800000
          },
          sla: 99.9
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 4096,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '3.5-sonnet',
          releaseDate: new Date('2024-06-20'),
          lastUpdated: new Date(),
          documentation: 'https://docs.anthropic.com/claude/docs',
          changelog: ['Improved code generation', 'Better reasoning capabilities'],
          knownIssues: ['Limited to text only', 'No vision capabilities'],
          recommendations: ['Best for complex reasoning', 'Excellent for code analysis']
        }
      },

      // Local Models
      {
        id: 'codellama-34b',
        name: 'CodeLlama 34B',
        provider: 'local',
        type: 'code',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'cpp', 'c'],
          maxTokens: 16384,
          contextWindow: 16384,
          functions: ['code_generation', 'code_explanation', 'debugging', 'completion'],
          features: ['code_specialized', 'offline'],
          modalities: ['text'],
          specializations: ['code', 'completion']
        },
        performance: {
          speed: 'slow',
          accuracy: 0.82,
          latency: 5000,
          throughput: 200,
          reliability: 0.95,
          consistency: 0.80
        },
        cost: {
          inputTokens: 0,
          outputTokens: 0,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: true, limit: 999999, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['local'],
          rateLimits: {
            requestsPerMinute: 60,
            tokensPerMinute: 10000,
            requestsPerDay: 1000,
            tokensPerDay: 100000
          },
          sla: 95.0
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 2048,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '34b',
          releaseDate: new Date('2023-08-24'),
          lastUpdated: new Date(),
          documentation: 'https://huggingface.co/codellama/CodeLlama-34b-Python-hf',
          changelog: ['Specialized for code generation', 'Open source'],
          knownIssues: ['Requires local GPU', 'Slower than cloud models'],
          recommendations: ['Best for privacy', 'Good for offline development']
        }
      }
    ];

    for (const model of availableModels) {
      this.models.set(model.id, model);
    }
  }

  private setDefaultModel(): void {
    // Set GPT-4o as default for best overall performance
    this.currentModel = 'gpt-4o';
  }

  // Model Selection
  async selectModel(criteria: ModelSelectionCriteria): Promise<ModelRecommendation> {
    const recommendations = await this.getModelRecommendations(criteria);
    return recommendations[0];
  }

  async getModelRecommendations(criteria: ModelSelectionCriteria): Promise<ModelRecommendation[]> {
    const recommendations: ModelRecommendation[] = [];
    
    for (const [modelId, model] of this.models) {
      if (model.availability.status !== 'available') continue;
      
      const score = this.calculateModelScore(model, criteria);
      if (score > 0.5) {
        recommendations.push({
          modelId,
          score,
          reasons: this.getScoreReasons(model, criteria),
          alternatives: this.getAlternatives(modelId, criteria),
          confidence: this.calculateConfidence(model, criteria)
        });
      }
    }
    
    return recommendations.sort((a, b) => b.score - a.score);
  }

  private calculateModelScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 0;
    const weights = this.getPriorityWeights(criteria.priority);
    
    // Performance score
    const performanceScore = this.calculatePerformanceScore(model, criteria);
    score += performanceScore * weights.performance;
    
    // Cost score
    const costScore = this.calculateCostScore(model, criteria);
    score += costScore * weights.cost;
    
    // Capability score
    const capabilityScore = this.calculateCapabilityScore(model, criteria);
    score += capabilityScore * weights.capability;
    
    // Availability score
    const availabilityScore = this.calculateAvailabilityScore(model, criteria);
    score += availabilityScore * weights.availability;
    
    return Math.min(1, Math.max(0, score));
  }

  private getPriorityWeights(priority: string): Record<string, number> {
    const weights = {
      speed: { performance: 0.6, cost: 0.2, capability: 0.1, availability: 0.1 },
      quality: { performance: 0.4, cost: 0.1, capability: 0.4, availability: 0.1 },
      cost: { performance: 0.2, cost: 0.6, capability: 0.1, availability: 0.1 },
      balanced: { performance: 0.3, cost: 0.3, capability: 0.3, availability: 0.1 }
    };
    return weights[priority as keyof typeof weights] || weights.balanced;
  }

  private calculatePerformanceScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 0;
    
    // Speed score
    const speedScores = { 'slow': 0.2, 'medium': 0.5, 'fast': 0.8, 'ultra_fast': 1.0 };
    score += speedScores[model.performance.speed] * 0.3;
    
    // Accuracy score
    score += model.performance.accuracy * 0.4;
    
    // Latency score (lower is better)
    const maxLatency = criteria.constraints.maxLatency || 5000;
    const latencyScore = Math.max(0, 1 - (model.performance.latency / maxLatency));
    score += latencyScore * 0.3;
    
    return score;
  }

  private calculateCostScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 1; // Start with highest score (lowest cost)
    
    // Cost per token
    const avgCost = (model.cost.inputTokens + model.cost.outputTokens) / 2;
    const maxCost = criteria.constraints.maxCost || 0.01;
    if (maxCost > 0) {
      score *= Math.max(0.1, 1 - (avgCost / maxCost));
    }
    
    // Free tier bonus
    if (model.cost.freeTier.enabled) {
      score *= 1.2;
    }
    
    return Math.min(1, score);
  }

  private calculateCapabilityScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 0;
    
    // Language support
    if (criteria.constraints.language) {
      if (model.capabilities.languages.includes(criteria.constraints.language)) {
        score += 0.3;
      }
    } else {
      score += 0.3; // Assume supported if no specific language required
    }
    
    // Required features
    if (criteria.constraints.requiredFeatures) {
      const supportedFeatures = criteria.constraints.requiredFeatures.filter(
        feature => model.capabilities.features.includes(feature)
      );
      score += (supportedFeatures.length / criteria.constraints.requiredFeatures.length) * 0.4;
    } else {
      score += 0.4;
    }
    
    // Context size
    if (criteria.constraints.contextSize) {
      const contextScore = Math.min(1, model.capabilities.contextWindow / criteria.constraints.contextSize);
      score += contextScore * 0.3;
    } else {
      score += 0.3;
    }
    
    return score;
  }

  private calculateAvailabilityScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 0;
    
    // Status
    if (model.availability.status === 'available') {
      score += 0.5;
    } else if (model.availability.status === 'limited') {
      score += 0.3;
    }
    
    // SLA
    score += (model.availability.sla / 100) * 0.3;
    
    // Rate limits (higher is better)
    const rateLimitScore = Math.min(1, model.availability.rateLimits.requestsPerMinute / 1000);
    score += rateLimitScore * 0.2;
    
    return score;
  }

  private getScoreReasons(model: AIModel, criteria: ModelSelectionCriteria): string[] {
    const reasons: string[] = [];
    
    if (model.performance.accuracy > 0.9) {
      reasons.push('High accuracy');
    }
    
    if (model.performance.speed === 'ultra_fast' || model.performance.speed === 'fast') {
      reasons.push('Fast response time');
    }
    
    if (model.cost.freeTier.enabled) {
      reasons.push('Free tier available');
    }
    
    if (model.capabilities.contextWindow > 100000) {
      reasons.push('Large context window');
    }
    
    if (model.capabilities.features.includes('vision')) {
      reasons.push('Vision capabilities');
    }
    
    return reasons;
  }

  private getAlternatives(modelId: string, criteria: ModelSelectionCriteria): string[] {
    const alternatives: string[] = [];
    const currentModel = this.models.get(modelId);
    if (!currentModel) return alternatives;
    
    for (const [id, model] of this.models) {
      if (id === modelId) continue;
      if (model.provider === currentModel.provider) {
        alternatives.push(id);
      }
    }
    
    return alternatives.slice(0, 3);
  }

  private calculateConfidence(model: AIModel, criteria: ModelSelectionCriteria): number {
    let confidence = 0.5;
    
    // More data points = higher confidence
    const usageData = this.usage.get(model.id) || [];
    if (usageData.length > 10) {
      confidence += 0.2;
    }
    
    // Recent usage = higher confidence
    const recentUsage = usageData.filter(u => 
      Date.now() - u.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    );
    if (recentUsage.length > 0) {
      confidence += 0.2;
    }
    
    // High success rate = higher confidence
    const successRate = usageData.length > 0 ? 
      usageData.filter(u => u.success).length / usageData.length : 0.5;
    confidence += successRate * 0.1;
    
    return Math.min(1, confidence);
  }

  // Model Switching
  async switchModel(modelId: string, reason: string, context: string = ''): Promise<boolean> {
    const model = this.models.get(modelId);
    if (!model || model.availability.status !== 'available') {
      return false;
    }
    
    const previousModel = this.currentModel;
    this.currentModel = modelId;
    
    // Record the switch
    const switchRecord: ModelSwitch = {
      id: `switch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromModel: previousModel || 'none',
      toModel: modelId,
      reason,
      timestamp: new Date(),
      performance: {
        latency: model.performance.latency,
        quality: model.performance.accuracy,
        cost: (model.cost.inputTokens + model.cost.outputTokens) / 2
      },
      user: 'system',
      context
    };
    
    this.switches.push(switchRecord);
    
    return true;
  }

  // Usage Tracking
  async recordUsage(usage: Omit<ModelUsage, 'timestamp'>): Promise<void> {
    const usageRecord: ModelUsage = {
      ...usage,
      timestamp: new Date()
    };
    
    const modelUsages = this.usage.get(usage.modelId) || [];
    modelUsages.push(usageRecord);
    this.usage.set(usage.modelId, modelUsages);
  }

  // Model Information
  getModel(modelId: string): AIModel | undefined {
    return this.models.get(modelId);
  }

  getAllModels(): AIModel[] {
    return Array.from(this.models.values());
  }

  getCurrentModel(): AIModel | null {
    if (!this.currentModel) return null;
    return this.models.get(this.currentModel) || null;
  }

  getModelUsage(modelId: string, timeRange?: { start: Date; end: Date }): ModelUsage[] {
    const usages = this.usage.get(modelId) || [];
    
    if (!timeRange) return usages;
    
    return usages.filter(usage => 
      usage.timestamp >= timeRange.start && usage.timestamp <= timeRange.end
    );
  }

  getModelSwitches(): ModelSwitch[] {
    return [...this.switches];
  }

  // Cost Analysis
  getCostAnalysis(timeRange: { start: Date; end: Date }): {
    totalCost: number;
    costByModel: Record<string, number>;
    costByTask: Record<string, number>;
    averageCostPerRequest: number;
    projectedMonthlyCost: number;
  } {
    const usages = Array.from(this.usage.values()).flat();
    const filteredUsages = usages.filter(usage => 
      usage.timestamp >= timeRange.start && usage.timestamp <= timeRange.end
    );
    
    const analysis = {
      totalCost: 0,
      costByModel: {} as Record<string, number>,
      costByTask: {} as Record<string, number>,
      averageCostPerRequest: 0,
      projectedMonthlyCost: 0
    };
    
    for (const usage of filteredUsages) {
      analysis.totalCost += usage.cost;
      analysis.costByModel[usage.modelId] = (analysis.costByModel[usage.modelId] || 0) + usage.cost;
      analysis.costByTask[usage.task] = (analysis.costByTask[usage.task] || 0) + usage.cost;
    }
    
    analysis.averageCostPerRequest = filteredUsages.length > 0 ? 
      analysis.totalCost / filteredUsages.length : 0;
    
    // Project monthly cost based on current usage
    const daysInRange = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const dailyCost = analysis.totalCost / daysInRange;
    analysis.projectedMonthlyCost = dailyCost * 30;
    
    return analysis;
  }

  // Performance Analysis
  getPerformanceAnalysis(timeRange: { start: Date; end: Date }): {
    averageLatency: number;
    averageQuality: number;
    successRate: number;
    performanceByModel: Record<string, { latency: number; quality: number; successRate: number }>;
  } {
    const usages = Array.from(this.usage.values()).flat();
    const filteredUsages = usages.filter(usage => 
      usage.timestamp >= timeRange.start && usage.timestamp <= timeRange.end
    );
    
    const analysis = {
      averageLatency: 0,
      averageQuality: 0,
      successRate: 0,
      performanceByModel: {} as Record<string, { latency: number; quality: number; successRate: number }>
    };
    
    if (filteredUsages.length === 0) return analysis;
    
    // Calculate overall metrics
    analysis.averageLatency = filteredUsages.reduce((sum, u) => sum + u.latency, 0) / filteredUsages.length;
    analysis.averageQuality = filteredUsages.reduce((sum, u) => sum + u.quality, 0) / filteredUsages.length;
    analysis.successRate = filteredUsages.filter(u => u.success).length / filteredUsages.length;
    
    // Calculate per-model metrics
    const modelGroups = filteredUsages.reduce((groups, usage) => {
      if (!groups[usage.modelId]) groups[usage.modelId] = [];
      groups[usage.modelId].push(usage);
      return groups;
    }, {} as Record<string, ModelUsage[]>);
    
    for (const [modelId, modelUsages] of Object.entries(modelGroups)) {
      analysis.performanceByModel[modelId] = {
        latency: modelUsages.reduce((sum, u) => sum + u.latency, 0) / modelUsages.length,
        quality: modelUsages.reduce((sum, u) => sum + u.quality, 0) / modelUsages.length,
        successRate: modelUsages.filter(u => u.success).length / modelUsages.length
      };
    }
    
    return analysis;
  }

  // Auto-switching based on performance
  async autoSwitchIfNeeded(): Promise<boolean> {
    if (!this.currentModel) return false;
    
    const currentModel = this.models.get(this.currentModel);
    if (!currentModel) return false;
    
    // Get recent performance data
    const recentUsage = this.getModelUsage(this.currentModel, {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      end: new Date()
    });
    
    if (recentUsage.length < 5) return false; // Need enough data
    
    // Calculate performance metrics
    const avgLatency = recentUsage.reduce((sum, u) => sum + u.latency, 0) / recentUsage.length;
    const successRate = recentUsage.filter(u => u.success).length / recentUsage.length;
    const avgQuality = recentUsage.reduce((sum, u) => sum + u.quality, 0) / recentUsage.length;
    
    // Check if we should switch
    const shouldSwitch = (
      avgLatency > currentModel.performance.latency * 1.5 || // 50% slower than expected
      successRate < 0.8 || // Less than 80% success rate
      avgQuality < currentModel.performance.accuracy * 0.8 // 20% lower quality than expected
    );
    
    if (!shouldSwitch) return false;
    
    // Find a better model
    const criteria: ModelSelectionCriteria = {
      task: 'general',
      priority: 'balanced',
      constraints: {
        maxLatency: avgLatency * 0.8,
        minAccuracy: avgQuality * 1.1
      },
      preferences: {}
    };
    
    const recommendations = await this.getModelRecommendations(criteria);
    const bestAlternative = recommendations.find(rec => rec.modelId !== this.currentModel);
    
    if (bestAlternative && bestAlternative.score > 0.7) {
      return await this.switchModel(
        bestAlternative.modelId,
        'Auto-switch due to performance issues',
        `Previous model: ${avgLatency}ms latency, ${(successRate * 100).toFixed(1)}% success rate`
      );
    }
    
    return false;
  }
}
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: 'text' | 'code' | 'image' | 'multimodal' | 'embedding' | 'custom';
  capabilities: ModelCapabilities;
  performance: ModelPerformance;
  cost: ModelCost;
  availability: ModelAvailability;
  configuration: ModelConfiguration;
  metadata: ModelMetadata;
}

export interface ModelCapabilities {
  languages: string[];
  maxTokens: number;
  contextWindow: number;
  functions: string[];
  features: string[];
  modalities: string[];
  specializations: string[];
}

export interface ModelPerformance {
  speed: 'slow' | 'medium' | 'fast' | 'ultra_fast';
  accuracy: number;
  latency: number;
  throughput: number;
  reliability: number;
  consistency: number;
}

export interface ModelCost {
  inputTokens: number; // per 1K tokens
  outputTokens: number; // per 1K tokens
  requests: number; // per request
  monthly: number; // monthly subscription
  currency: string;
  freeTier: {
    enabled: boolean;
    limit: number;
    resetPeriod: 'daily' | 'monthly';
  };
}

export interface ModelAvailability {
  status: 'available' | 'limited' | 'unavailable' | 'maintenance';
  regions: string[];
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
    requestsPerDay: number;
    tokensPerDay: number;
  };
  sla: number; // uptime percentage
}

export interface ModelConfiguration {
  temperature: number;
  topP: number;
  maxTokens: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
  customParameters: Record<string, any>;
}

export interface ModelMetadata {
  version: string;
  releaseDate: Date;
  lastUpdated: Date;
  documentation: string;
  changelog: string[];
  knownIssues: string[];
  recommendations: string[];
}

export interface ModelSelectionCriteria {
  task: string;
  priority: 'speed' | 'quality' | 'cost' | 'balanced';
  constraints: {
    maxLatency?: number;
    maxCost?: number;
    minAccuracy?: number;
    requiredFeatures?: string[];
    language?: string;
    contextSize?: number;
  };
  preferences: {
    provider?: string;
    modelType?: string;
    avoidModels?: string[];
  };
}

export interface ModelSwitch {
  id: string;
  fromModel: string;
  toModel: string;
  reason: string;
  timestamp: Date;
  performance: {
    latency: number;
    quality: number;
    cost: number;
  };
  user: string;
  context: string;
}

export interface ModelUsage {
  modelId: string;
  timestamp: Date;
  tokens: number;
  cost: number;
  latency: number;
  quality: number;
  task: string;
  success: boolean;
  error?: string;
}

export interface ModelRecommendation {
  modelId: string;
  score: number;
  reasons: string[];
  alternatives: string[];
  confidence: number;
}

export class AIModelManager {
  private models: Map<string, AIModel> = new Map();
  private currentModel: string | null = null;
  private usage: Map<string, ModelUsage[]> = new Map();
  private switches: ModelSwitch[] = [];
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load available models
    await this.loadAvailableModels();
    
    // Set default model
    this.setDefaultModel();
    
    this.isInitialized = true;
  }

  // Model Management
  async loadAvailableModels(): Promise<void> {
    const availableModels: AIModel[] = [
      // OpenAI Models
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        type: 'multimodal',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'],
          maxTokens: 128000,
          contextWindow: 128000,
          functions: ['code_generation', 'code_explanation', 'debugging', 'refactoring', 'testing'],
          features: ['vision', 'function_calling', 'json_mode', 'parallel_tool_calling'],
          modalities: ['text', 'image'],
          specializations: ['reasoning', 'code', 'analysis']
        },
        performance: {
          speed: 'fast',
          accuracy: 0.95,
          latency: 1200,
          throughput: 1000,
          reliability: 0.99,
          consistency: 0.92
        },
        cost: {
          inputTokens: 0.005,
          outputTokens: 0.015,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: false, limit: 0, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 500,
            tokensPerMinute: 150000,
            requestsPerDay: 10000,
            tokensPerDay: 1000000
          },
          sla: 99.9
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 4096,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '4.0',
          releaseDate: new Date('2024-05-13'),
          lastUpdated: new Date(),
          documentation: 'https://platform.openai.com/docs/models/gpt-4o',
          changelog: ['Added vision capabilities', 'Improved code generation'],
          knownIssues: ['Occasional hallucinations in complex code'],
          recommendations: ['Best for complex reasoning tasks', 'Use for code generation and analysis']
        }
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai',
        type: 'multimodal',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust'],
          maxTokens: 128000,
          contextWindow: 128000,
          functions: ['code_generation', 'code_explanation', 'debugging'],
          features: ['vision', 'function_calling', 'json_mode'],
          modalities: ['text', 'image'],
          specializations: ['code', 'analysis']
        },
        performance: {
          speed: 'ultra_fast',
          accuracy: 0.90,
          latency: 600,
          throughput: 2000,
          reliability: 0.99,
          consistency: 0.88
        },
        cost: {
          inputTokens: 0.00015,
          outputTokens: 0.0006,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: false, limit: 0, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 1000,
            tokensPerMinute: 200000,
            requestsPerDay: 20000,
            tokensPerDay: 2000000
          },
          sla: 99.9
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 4096,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '4.0-mini',
          releaseDate: new Date('2024-07-18'),
          lastUpdated: new Date(),
          documentation: 'https://platform.openai.com/docs/models/gpt-4o-mini',
          changelog: ['Faster and more cost-effective than GPT-4o'],
          knownIssues: [],
          recommendations: ['Best for simple to medium complexity tasks', 'Great for rapid prototyping']
        }
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        type: 'text',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust'],
          maxTokens: 16384,
          contextWindow: 16384,
          functions: ['code_generation', 'code_explanation'],
          features: ['function_calling', 'json_mode'],
          modalities: ['text'],
          specializations: ['code', 'conversation']
        },
        performance: {
          speed: 'ultra_fast',
          accuracy: 0.85,
          latency: 300,
          throughput: 3000,
          reliability: 0.99,
          consistency: 0.85
        },
        cost: {
          inputTokens: 0.0005,
          outputTokens: 0.0015,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: false, limit: 0, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 2000,
            tokensPerMinute: 300000,
            requestsPerDay: 50000,
            tokensPerDay: 5000000
          },
          sla: 99.9
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 4096,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '3.5-turbo',
          releaseDate: new Date('2023-03-01'),
          lastUpdated: new Date(),
          documentation: 'https://platform.openai.com/docs/models/gpt-3-5-turbo',
          changelog: ['Improved code generation', 'Better instruction following'],
          knownIssues: ['Limited context window', 'Less accurate than GPT-4'],
          recommendations: ['Good for simple tasks', 'Cost-effective option']
        }
      },

      // Google Models
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        type: 'multimodal',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'kotlin', 'swift'],
          maxTokens: 2000000,
          contextWindow: 2000000,
          functions: ['code_generation', 'code_explanation', 'debugging', 'refactoring', 'testing', 'analysis'],
          features: ['vision', 'function_calling', 'json_mode', 'parallel_tool_calling', 'long_context'],
          modalities: ['text', 'image', 'audio', 'video'],
          specializations: ['reasoning', 'code', 'analysis', 'long_context']
        },
        performance: {
          speed: 'medium',
          accuracy: 0.94,
          latency: 2000,
          throughput: 800,
          reliability: 0.98,
          consistency: 0.90
        },
        cost: {
          inputTokens: 0.00125,
          outputTokens: 0.005,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: true, limit: 1500, resetPeriod: 'daily' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 300,
            tokensPerMinute: 100000,
            requestsPerDay: 5000,
            tokensPerDay: 500000
          },
          sla: 99.5
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 8192,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '1.5-pro',
          releaseDate: new Date('2024-02-15'),
          lastUpdated: new Date(),
          documentation: 'https://ai.google.dev/docs/gemini_api_overview',
          changelog: ['Added long context support', 'Improved code generation'],
          knownIssues: ['Slower than GPT-4o', 'Limited function calling'],
          recommendations: ['Best for long context tasks', 'Great for code analysis']
        }
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        type: 'multimodal',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust'],
          maxTokens: 1000000,
          contextWindow: 1000000,
          functions: ['code_generation', 'code_explanation', 'debugging'],
          features: ['vision', 'function_calling', 'json_mode', 'long_context'],
          modalities: ['text', 'image'],
          specializations: ['code', 'analysis', 'long_context']
        },
        performance: {
          speed: 'fast',
          accuracy: 0.88,
          latency: 800,
          throughput: 1500,
          reliability: 0.99,
          consistency: 0.87
        },
        cost: {
          inputTokens: 0.000075,
          outputTokens: 0.0003,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: true, limit: 1500, resetPeriod: 'daily' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu', 'asia'],
          rateLimits: {
            requestsPerMinute: 1000,
            tokensPerMinute: 200000,
            requestsPerDay: 20000,
            tokensPerDay: 2000000
          },
          sla: 99.5
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 8192,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '1.5-flash',
          releaseDate: new Date('2024-05-14'),
          lastUpdated: new Date(),
          documentation: 'https://ai.google.dev/docs/gemini_api_overview',
          changelog: ['Faster than Pro version', 'Good balance of speed and quality'],
          knownIssues: [],
          recommendations: ['Good for rapid development', 'Cost-effective for most tasks']
        }
      },

      // Anthropic Models
      {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        type: 'text',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby'],
          maxTokens: 200000,
          contextWindow: 200000,
          functions: ['code_generation', 'code_explanation', 'debugging', 'refactoring', 'testing', 'analysis'],
          features: ['function_calling', 'json_mode', 'long_context', 'code_execution'],
          modalities: ['text'],
          specializations: ['reasoning', 'code', 'analysis', 'long_context']
        },
        performance: {
          speed: 'fast',
          accuracy: 0.96,
          latency: 1000,
          throughput: 1200,
          reliability: 0.99,
          consistency: 0.94
        },
        cost: {
          inputTokens: 0.003,
          outputTokens: 0.015,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: false, limit: 0, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['us', 'eu'],
          rateLimits: {
            requestsPerMinute: 400,
            tokensPerMinute: 120000,
            requestsPerDay: 8000,
            tokensPerDay: 800000
          },
          sla: 99.9
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 4096,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '3.5-sonnet',
          releaseDate: new Date('2024-06-20'),
          lastUpdated: new Date(),
          documentation: 'https://docs.anthropic.com/claude/docs',
          changelog: ['Improved code generation', 'Better reasoning capabilities'],
          knownIssues: ['Limited to text only', 'No vision capabilities'],
          recommendations: ['Best for complex reasoning', 'Excellent for code analysis']
        }
      },

      // Local Models
      {
        id: 'codellama-34b',
        name: 'CodeLlama 34B',
        provider: 'local',
        type: 'code',
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp', 'go', 'rust', 'php', 'ruby', 'cpp', 'c'],
          maxTokens: 16384,
          contextWindow: 16384,
          functions: ['code_generation', 'code_explanation', 'debugging', 'completion'],
          features: ['code_specialized', 'offline'],
          modalities: ['text'],
          specializations: ['code', 'completion']
        },
        performance: {
          speed: 'slow',
          accuracy: 0.82,
          latency: 5000,
          throughput: 200,
          reliability: 0.95,
          consistency: 0.80
        },
        cost: {
          inputTokens: 0,
          outputTokens: 0,
          requests: 0,
          monthly: 0,
          currency: 'USD',
          freeTier: { enabled: true, limit: 999999, resetPeriod: 'monthly' }
        },
        availability: {
          status: 'available',
          regions: ['local'],
          rateLimits: {
            requestsPerMinute: 60,
            tokensPerMinute: 10000,
            requestsPerDay: 1000,
            tokensPerDay: 100000
          },
          sla: 95.0
        },
        configuration: {
          temperature: 0.1,
          topP: 0.9,
          maxTokens: 2048,
          frequencyPenalty: 0,
          presencePenalty: 0,
          stopSequences: [],
          customParameters: {}
        },
        metadata: {
          version: '34b',
          releaseDate: new Date('2023-08-24'),
          lastUpdated: new Date(),
          documentation: 'https://huggingface.co/codellama/CodeLlama-34b-Python-hf',
          changelog: ['Specialized for code generation', 'Open source'],
          knownIssues: ['Requires local GPU', 'Slower than cloud models'],
          recommendations: ['Best for privacy', 'Good for offline development']
        }
      }
    ];

    for (const model of availableModels) {
      this.models.set(model.id, model);
    }
  }

  private setDefaultModel(): void {
    // Set GPT-4o as default for best overall performance
    this.currentModel = 'gpt-4o';
  }

  // Model Selection
  async selectModel(criteria: ModelSelectionCriteria): Promise<ModelRecommendation> {
    const recommendations = await this.getModelRecommendations(criteria);
    return recommendations[0];
  }

  async getModelRecommendations(criteria: ModelSelectionCriteria): Promise<ModelRecommendation[]> {
    const recommendations: ModelRecommendation[] = [];
    
    for (const [modelId, model] of this.models) {
      if (model.availability.status !== 'available') continue;
      
      const score = this.calculateModelScore(model, criteria);
      if (score > 0.5) {
        recommendations.push({
          modelId,
          score,
          reasons: this.getScoreReasons(model, criteria),
          alternatives: this.getAlternatives(modelId, criteria),
          confidence: this.calculateConfidence(model, criteria)
        });
      }
    }
    
    return recommendations.sort((a, b) => b.score - a.score);
  }

  private calculateModelScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 0;
    const weights = this.getPriorityWeights(criteria.priority);
    
    // Performance score
    const performanceScore = this.calculatePerformanceScore(model, criteria);
    score += performanceScore * weights.performance;
    
    // Cost score
    const costScore = this.calculateCostScore(model, criteria);
    score += costScore * weights.cost;
    
    // Capability score
    const capabilityScore = this.calculateCapabilityScore(model, criteria);
    score += capabilityScore * weights.capability;
    
    // Availability score
    const availabilityScore = this.calculateAvailabilityScore(model, criteria);
    score += availabilityScore * weights.availability;
    
    return Math.min(1, Math.max(0, score));
  }

  private getPriorityWeights(priority: string): Record<string, number> {
    const weights = {
      speed: { performance: 0.6, cost: 0.2, capability: 0.1, availability: 0.1 },
      quality: { performance: 0.4, cost: 0.1, capability: 0.4, availability: 0.1 },
      cost: { performance: 0.2, cost: 0.6, capability: 0.1, availability: 0.1 },
      balanced: { performance: 0.3, cost: 0.3, capability: 0.3, availability: 0.1 }
    };
    return weights[priority as keyof typeof weights] || weights.balanced;
  }

  private calculatePerformanceScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 0;
    
    // Speed score
    const speedScores = { 'slow': 0.2, 'medium': 0.5, 'fast': 0.8, 'ultra_fast': 1.0 };
    score += speedScores[model.performance.speed] * 0.3;
    
    // Accuracy score
    score += model.performance.accuracy * 0.4;
    
    // Latency score (lower is better)
    const maxLatency = criteria.constraints.maxLatency || 5000;
    const latencyScore = Math.max(0, 1 - (model.performance.latency / maxLatency));
    score += latencyScore * 0.3;
    
    return score;
  }

  private calculateCostScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 1; // Start with highest score (lowest cost)
    
    // Cost per token
    const avgCost = (model.cost.inputTokens + model.cost.outputTokens) / 2;
    const maxCost = criteria.constraints.maxCost || 0.01;
    if (maxCost > 0) {
      score *= Math.max(0.1, 1 - (avgCost / maxCost));
    }
    
    // Free tier bonus
    if (model.cost.freeTier.enabled) {
      score *= 1.2;
    }
    
    return Math.min(1, score);
  }

  private calculateCapabilityScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 0;
    
    // Language support
    if (criteria.constraints.language) {
      if (model.capabilities.languages.includes(criteria.constraints.language)) {
        score += 0.3;
      }
    } else {
      score += 0.3; // Assume supported if no specific language required
    }
    
    // Required features
    if (criteria.constraints.requiredFeatures) {
      const supportedFeatures = criteria.constraints.requiredFeatures.filter(
        feature => model.capabilities.features.includes(feature)
      );
      score += (supportedFeatures.length / criteria.constraints.requiredFeatures.length) * 0.4;
    } else {
      score += 0.4;
    }
    
    // Context size
    if (criteria.constraints.contextSize) {
      const contextScore = Math.min(1, model.capabilities.contextWindow / criteria.constraints.contextSize);
      score += contextScore * 0.3;
    } else {
      score += 0.3;
    }
    
    return score;
  }

  private calculateAvailabilityScore(model: AIModel, criteria: ModelSelectionCriteria): number {
    let score = 0;
    
    // Status
    if (model.availability.status === 'available') {
      score += 0.5;
    } else if (model.availability.status === 'limited') {
      score += 0.3;
    }
    
    // SLA
    score += (model.availability.sla / 100) * 0.3;
    
    // Rate limits (higher is better)
    const rateLimitScore = Math.min(1, model.availability.rateLimits.requestsPerMinute / 1000);
    score += rateLimitScore * 0.2;
    
    return score;
  }

  private getScoreReasons(model: AIModel, criteria: ModelSelectionCriteria): string[] {
    const reasons: string[] = [];
    
    if (model.performance.accuracy > 0.9) {
      reasons.push('High accuracy');
    }
    
    if (model.performance.speed === 'ultra_fast' || model.performance.speed === 'fast') {
      reasons.push('Fast response time');
    }
    
    if (model.cost.freeTier.enabled) {
      reasons.push('Free tier available');
    }
    
    if (model.capabilities.contextWindow > 100000) {
      reasons.push('Large context window');
    }
    
    if (model.capabilities.features.includes('vision')) {
      reasons.push('Vision capabilities');
    }
    
    return reasons;
  }

  private getAlternatives(modelId: string, criteria: ModelSelectionCriteria): string[] {
    const alternatives: string[] = [];
    const currentModel = this.models.get(modelId);
    if (!currentModel) return alternatives;
    
    for (const [id, model] of this.models) {
      if (id === modelId) continue;
      if (model.provider === currentModel.provider) {
        alternatives.push(id);
      }
    }
    
    return alternatives.slice(0, 3);
  }

  private calculateConfidence(model: AIModel, criteria: ModelSelectionCriteria): number {
    let confidence = 0.5;
    
    // More data points = higher confidence
    const usageData = this.usage.get(model.id) || [];
    if (usageData.length > 10) {
      confidence += 0.2;
    }
    
    // Recent usage = higher confidence
    const recentUsage = usageData.filter(u => 
      Date.now() - u.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
    );
    if (recentUsage.length > 0) {
      confidence += 0.2;
    }
    
    // High success rate = higher confidence
    const successRate = usageData.length > 0 ? 
      usageData.filter(u => u.success).length / usageData.length : 0.5;
    confidence += successRate * 0.1;
    
    return Math.min(1, confidence);
  }

  // Model Switching
  async switchModel(modelId: string, reason: string, context: string = ''): Promise<boolean> {
    const model = this.models.get(modelId);
    if (!model || model.availability.status !== 'available') {
      return false;
    }
    
    const previousModel = this.currentModel;
    this.currentModel = modelId;
    
    // Record the switch
    const switchRecord: ModelSwitch = {
      id: `switch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromModel: previousModel || 'none',
      toModel: modelId,
      reason,
      timestamp: new Date(),
      performance: {
        latency: model.performance.latency,
        quality: model.performance.accuracy,
        cost: (model.cost.inputTokens + model.cost.outputTokens) / 2
      },
      user: 'system',
      context
    };
    
    this.switches.push(switchRecord);
    
    return true;
  }

  // Usage Tracking
  async recordUsage(usage: Omit<ModelUsage, 'timestamp'>): Promise<void> {
    const usageRecord: ModelUsage = {
      ...usage,
      timestamp: new Date()
    };
    
    const modelUsages = this.usage.get(usage.modelId) || [];
    modelUsages.push(usageRecord);
    this.usage.set(usage.modelId, modelUsages);
  }

  // Model Information
  getModel(modelId: string): AIModel | undefined {
    return this.models.get(modelId);
  }

  getAllModels(): AIModel[] {
    return Array.from(this.models.values());
  }

  getCurrentModel(): AIModel | null {
    if (!this.currentModel) return null;
    return this.models.get(this.currentModel) || null;
  }

  getModelUsage(modelId: string, timeRange?: { start: Date; end: Date }): ModelUsage[] {
    const usages = this.usage.get(modelId) || [];
    
    if (!timeRange) return usages;
    
    return usages.filter(usage => 
      usage.timestamp >= timeRange.start && usage.timestamp <= timeRange.end
    );
  }

  getModelSwitches(): ModelSwitch[] {
    return [...this.switches];
  }

  // Cost Analysis
  getCostAnalysis(timeRange: { start: Date; end: Date }): {
    totalCost: number;
    costByModel: Record<string, number>;
    costByTask: Record<string, number>;
    averageCostPerRequest: number;
    projectedMonthlyCost: number;
  } {
    const usages = Array.from(this.usage.values()).flat();
    const filteredUsages = usages.filter(usage => 
      usage.timestamp >= timeRange.start && usage.timestamp <= timeRange.end
    );
    
    const analysis = {
      totalCost: 0,
      costByModel: {} as Record<string, number>,
      costByTask: {} as Record<string, number>,
      averageCostPerRequest: 0,
      projectedMonthlyCost: 0
    };
    
    for (const usage of filteredUsages) {
      analysis.totalCost += usage.cost;
      analysis.costByModel[usage.modelId] = (analysis.costByModel[usage.modelId] || 0) + usage.cost;
      analysis.costByTask[usage.task] = (analysis.costByTask[usage.task] || 0) + usage.cost;
    }
    
    analysis.averageCostPerRequest = filteredUsages.length > 0 ? 
      analysis.totalCost / filteredUsages.length : 0;
    
    // Project monthly cost based on current usage
    const daysInRange = (timeRange.end.getTime() - timeRange.start.getTime()) / (1000 * 60 * 60 * 24);
    const dailyCost = analysis.totalCost / daysInRange;
    analysis.projectedMonthlyCost = dailyCost * 30;
    
    return analysis;
  }

  // Performance Analysis
  getPerformanceAnalysis(timeRange: { start: Date; end: Date }): {
    averageLatency: number;
    averageQuality: number;
    successRate: number;
    performanceByModel: Record<string, { latency: number; quality: number; successRate: number }>;
  } {
    const usages = Array.from(this.usage.values()).flat();
    const filteredUsages = usages.filter(usage => 
      usage.timestamp >= timeRange.start && usage.timestamp <= timeRange.end
    );
    
    const analysis = {
      averageLatency: 0,
      averageQuality: 0,
      successRate: 0,
      performanceByModel: {} as Record<string, { latency: number; quality: number; successRate: number }>
    };
    
    if (filteredUsages.length === 0) return analysis;
    
    // Calculate overall metrics
    analysis.averageLatency = filteredUsages.reduce((sum, u) => sum + u.latency, 0) / filteredUsages.length;
    analysis.averageQuality = filteredUsages.reduce((sum, u) => sum + u.quality, 0) / filteredUsages.length;
    analysis.successRate = filteredUsages.filter(u => u.success).length / filteredUsages.length;
    
    // Calculate per-model metrics
    const modelGroups = filteredUsages.reduce((groups, usage) => {
      if (!groups[usage.modelId]) groups[usage.modelId] = [];
      groups[usage.modelId].push(usage);
      return groups;
    }, {} as Record<string, ModelUsage[]>);
    
    for (const [modelId, modelUsages] of Object.entries(modelGroups)) {
      analysis.performanceByModel[modelId] = {
        latency: modelUsages.reduce((sum, u) => sum + u.latency, 0) / modelUsages.length,
        quality: modelUsages.reduce((sum, u) => sum + u.quality, 0) / modelUsages.length,
        successRate: modelUsages.filter(u => u.success).length / modelUsages.length
      };
    }
    
    return analysis;
  }

  // Auto-switching based on performance
  async autoSwitchIfNeeded(): Promise<boolean> {
    if (!this.currentModel) return false;
    
    const currentModel = this.models.get(this.currentModel);
    if (!currentModel) return false;
    
    // Get recent performance data
    const recentUsage = this.getModelUsage(this.currentModel, {
      start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      end: new Date()
    });
    
    if (recentUsage.length < 5) return false; // Need enough data
    
    // Calculate performance metrics
    const avgLatency = recentUsage.reduce((sum, u) => sum + u.latency, 0) / recentUsage.length;
    const successRate = recentUsage.filter(u => u.success).length / recentUsage.length;
    const avgQuality = recentUsage.reduce((sum, u) => sum + u.quality, 0) / recentUsage.length;
    
    // Check if we should switch
    const shouldSwitch = (
      avgLatency > currentModel.performance.latency * 1.5 || // 50% slower than expected
      successRate < 0.8 || // Less than 80% success rate
      avgQuality < currentModel.performance.accuracy * 0.8 // 20% lower quality than expected
    );
    
    if (!shouldSwitch) return false;
    
    // Find a better model
    const criteria: ModelSelectionCriteria = {
      task: 'general',
      priority: 'balanced',
      constraints: {
        maxLatency: avgLatency * 0.8,
        minAccuracy: avgQuality * 1.1
      },
      preferences: {}
    };
    
    const recommendations = await this.getModelRecommendations(criteria);
    const bestAlternative = recommendations.find(rec => rec.modelId !== this.currentModel);
    
    if (bestAlternative && bestAlternative.score > 0.7) {
      return await this.switchModel(
        bestAlternative.modelId,
        'Auto-switch due to performance issues',
        `Previous model: ${avgLatency}ms latency, ${(successRate * 100).toFixed(1)}% success rate`
      );
    }
    
    return false;
  }
}




