// Multi-Agent Collaboration System
export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  capabilities: AgentCapabilities;
  personality: AgentPersonality;
  status: 'idle' | 'working' | 'waiting' | 'error';
  currentTask?: string;
  performance: AgentPerformance;
  preferences: AgentPreferences;
}

export interface AgentRole {
  type: 'coder' | 'reviewer' | 'tester' | 'architect' | 'debugger' | 'documenter' | 'optimizer' | 'security';
  specialization: string[];
  responsibilities: string[];
  priority: number;
}

export interface AgentCapabilities {
  languages: string[];
  frameworks: string[];
  tools: string[];
  skills: string[];
  maxComplexity: number;
  speed: 'slow' | 'medium' | 'fast' | 'ultra_fast';
  accuracy: number;
  creativity: number;
  attentionToDetail: number;
}

export interface AgentPersonality {
  communicationStyle: 'formal' | 'casual' | 'technical' | 'friendly';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  collaborationStyle: 'independent' | 'collaborative' | 'leading';
  problemSolving: 'analytical' | 'creative' | 'systematic' | 'intuitive';
  feedbackStyle: 'constructive' | 'direct' | 'gentle' | 'detailed';
}

export interface AgentPerformance {
  tasksCompleted: number;
  successRate: number;
  averageTime: number;
  qualityScore: number;
  collaborationScore: number;
  lastUpdated: Date;
}

export interface AgentPreferences {
  workingHours: { start: string; end: string };
  maxConcurrentTasks: number;
  preferredComplexity: 'simple' | 'medium' | 'complex';
  communicationFrequency: 'minimal' | 'regular' | 'frequent';
  feedbackFrequency: 'minimal' | 'regular' | 'detailed';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: number;
  estimatedTime: number;
  assignedAgent?: string;
  status: TaskStatus;
  dependencies: string[];
  deliverables: Deliverable[];
  context: TaskContext;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
}

export interface TaskType {
  category: 'development' | 'testing' | 'review' | 'debugging' | 'documentation' | 'optimization' | 'security';
  subcategory: string;
  requirements: string[];
  constraints: string[];
}

export interface TaskStatus {
  current: 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'blocked' | 'cancelled';
  progress: number; // 0-100
  blockers: Blocker[];
  notes: string[];
}

export interface Blocker {
  id: string;
  description: string;
  type: 'dependency' | 'resource' | 'knowledge' | 'technical' | 'external';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface Deliverable {
  id: string;
  type: 'code' | 'documentation' | 'test' | 'review' | 'analysis' | 'design';
  title: string;
  description: string;
  content: string;
  format: string;
  quality: number;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  feedback: Feedback[];
}

export interface Feedback {
  id: string;
  fromAgent: string;
  type: 'suggestion' | 'criticism' | 'praise' | 'question' | 'concern';
  content: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  timestamp: Date;
  resolved: boolean;
  response?: string;
}

export interface TaskContext {
  files: string[];
  codebase: string;
  requirements: string[];
  constraints: string[];
  environment: string;
  dependencies: string[];
  relatedTasks: string[];
  stakeholders: string[];
}

export interface CollaborationSession {
  id: string;
  name: string;
  description: string;
  agents: string[];
  tasks: string[];
  status: 'planning' | 'active' | 'review' | 'completed' | 'paused';
  workflow: Workflow;
  communication: CommunicationChannel[];
  metrics: CollaborationMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  currentStep: number;
  parallel: boolean;
  dependencies: WorkflowDependency[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  agentRole: string;
  inputs: string[];
  outputs: string[];
  duration: number;
  parallel: boolean;
  dependencies: string[];
  qualityGates: QualityGate[];
}

export interface WorkflowDependency {
  from: string;
  to: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'iterative';
  condition?: string;
}

export interface QualityGate {
  id: string;
  name: string;
  type: 'code_review' | 'testing' | 'security_scan' | 'performance_check' | 'documentation_review';
  criteria: QualityCriteria[];
  required: boolean;
  approver: string;
}

export interface QualityCriteria {
  metric: string;
  threshold: number;
  operator: 'greater_than' | 'less_than' | 'equals' | 'contains' | 'not_contains';
  weight: number;
}

export interface CommunicationChannel {
  id: string;
  type: 'chat' | 'voice' | 'video' | 'shared_workspace' | 'notification';
  participants: string[];
  active: boolean;
  history: CommunicationMessage[];
}

export interface CommunicationMessage {
  id: string;
  fromAgent: string;
  content: string;
  type: 'text' | 'code' | 'file' | 'task_update' | 'status_change';
  timestamp: Date;
  readBy: string[];
  reactions: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  agentId: string;
  timestamp: Date;
}

export interface CollaborationMetrics {
  efficiency: number;
  quality: number;
  communication: number;
  coordination: number;
  satisfaction: number;
  velocity: number;
  bottlenecks: Bottleneck[];
  improvements: Improvement[];
}

export interface Bottleneck {
  id: string;
  description: string;
  type: 'agent' | 'task' | 'workflow' | 'communication' | 'resource';
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: number;
  suggestions: string[];
}

export interface Improvement {
  id: string;
  description: string;
  type: 'process' | 'tool' | 'training' | 'workflow' | 'communication';
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'proposed' | 'approved' | 'in_progress' | 'completed';
}

export class MultiAgentCollaborationEngine {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private sessions: Map<string, CollaborationSession> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize default agents
    await this.initializeDefaultAgents();
    
    // Load existing workflows
    await this.loadWorkflows();
    
    this.isInitialized = true;
  }

  // Agent Management
  async createAgent(agent: Omit<Agent, 'id' | 'status' | 'performance' | 'currentTask'>): Promise<string> {
    const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newAgent: Agent = {
      ...agent,
      id: agentId,
      status: 'idle',
      performance: {
        tasksCompleted: 0,
        successRate: 0,
        averageTime: 0,
        qualityScore: 0,
        collaborationScore: 0,
        lastUpdated: new Date()
      }
    };

    this.agents.set(agentId, newAgent);
    return agentId;
  }

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    const updatedAgent = { ...agent, ...updates };
    this.agents.set(agentId, updatedAgent);
    return true;
  }

  async removeAgent(agentId: string): Promise<boolean> {
    // Check if agent has active tasks
    const activeTasks = Array.from(this.tasks.values()).filter(
      task => task.assignedAgent === agentId && task.status.current === 'in_progress'
    );
    
    if (activeTasks.length > 0) {
      throw new Error('Cannot remove agent with active tasks');
    }

    return this.agents.delete(agentId);
  }

  // Task Management
  async createTask(task: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTask: Task = {
      ...task,
      id: taskId,
      status: {
        current: 'pending',
        progress: 0,
        blockers: [],
        notes: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.set(taskId, newTask);
    return taskId;
  }

  async assignTask(taskId: string, agentId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    const agent = this.agents.get(agentId);
    
    if (!task || !agent) return false;
    if (agent.status !== 'idle') return false;

    task.assignedAgent = agentId;
    task.status.current = 'assigned';
    task.updatedAt = new Date();
    
    agent.status = 'working';
    agent.currentTask = taskId;

    return true;
  }

  async startTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || !task.assignedAgent) return false;

    const agent = this.agents.get(task.assignedAgent);
    if (!agent || agent.status !== 'working') return false;

    task.status.current = 'in_progress';
    task.status.progress = 0;
    task.updatedAt = new Date();

    return true;
  }

  async updateTaskProgress(taskId: string, progress: number, notes?: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || task.status.current !== 'in_progress') return false;

    task.status.progress = Math.max(0, Math.min(100, progress));
    task.updatedAt = new Date();
    
    if (notes) {
      task.status.notes.push(notes);
    }

    return true;
  }

  async completeTask(taskId: string, deliverables: Deliverable[]): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || task.status.current !== 'in_progress') return false;

    task.status.current = 'completed';
    task.status.progress = 100;
    task.deliverables = deliverables;
    task.completedAt = new Date();
    task.updatedAt = new Date();

    // Update agent status
    if (task.assignedAgent) {
      const agent = this.agents.get(task.assignedAgent);
      if (agent) {
        agent.status = 'idle';
        agent.currentTask = undefined;
        agent.performance.tasksCompleted++;
        agent.performance.lastUpdated = new Date();
      }
    }

    return true;
  }

  // Collaboration Session Management
  async createCollaborationSession(session: Omit<CollaborationSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newSession: CollaborationSession = {
      ...session,
      id: sessionId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sessions.set(sessionId, newSession);
    return sessionId;
  }

  async addAgentToSession(sessionId: string, agentId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const agent = this.agents.get(agentId);
    
    if (!session || !agent) return false;
    if (session.agents.includes(agentId)) return true;

    session.agents.push(agentId);
    session.updatedAt = new Date();
    return true;
  }

  async removeAgentFromSession(sessionId: string, agentId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.agents = session.agents.filter(id => id !== agentId);
    session.updatedAt = new Date();
    return true;
  }

  // Workflow Management
  async createWorkflow(workflow: Omit<Workflow, 'id'>): Promise<string> {
    const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newWorkflow: Workflow = {
      ...workflow,
      id: workflowId
    };

    this.workflows.set(workflowId, newWorkflow);
    return workflowId;
  }

  async executeWorkflow(sessionId: string, workflowId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const workflow = this.workflows.get(workflowId);
    
    if (!session || !workflow) return false;

    session.workflow = workflow;
    session.status = 'active';
    session.updatedAt = new Date();

    // Start workflow execution
    await this.executeWorkflowStep(sessionId, 0);
    return true;
  }

  private async executeWorkflowStep(sessionId: string, stepIndex: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.workflow) return;

    const workflow = session.workflow;
    const step = workflow.steps[stepIndex];
    
    if (!step) {
      // Workflow completed
      session.status = 'completed';
      session.updatedAt = new Date();
      return;
    }

    // Find available agent for this step
    const availableAgent = await this.findAvailableAgent(step.agentRole, session.agents);
    
    if (!availableAgent) {
      // No available agent, wait or retry
      setTimeout(() => this.executeWorkflowStep(sessionId, stepIndex), 5000);
      return;
    }

    // Create task for this step
    const task = await this.createTask({
      title: step.name,
      description: step.description,
      type: {
        category: 'development',
        subcategory: step.agentRole,
        requirements: step.inputs,
        constraints: []
      },
      priority: 'medium',
      complexity: 5,
      estimatedTime: step.duration,
      dependencies: step.dependencies,
      deliverables: [],
      context: {
        files: [],
        codebase: '',
        requirements: step.inputs,
        constraints: [],
        environment: '',
        dependencies: [],
        relatedTasks: [],
        stakeholders: []
      }
    });

    // Assign and start task
    await this.assignTask(task, availableAgent.id);
    await this.startTask(task);

    // Move to next step
    workflow.currentStep = stepIndex + 1;
    session.updatedAt = new Date();
  }

  private async findAvailableAgent(role: string, agentIds: string[]): Promise<Agent | null> {
    for (const agentId of agentIds) {
      const agent = this.agents.get(agentId);
      if (agent && agent.status === 'idle' && agent.role.type === role) {
        return agent;
      }
    }
    return null;
  }

  // Communication
  async sendMessage(sessionId: string, fromAgent: string, content: string, type: string = 'text'): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) return '';

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const message: CommunicationMessage = {
      id: messageId,
      fromAgent,
      content,
      type: type as any,
      timestamp: new Date(),
      readBy: [fromAgent],
      reactions: []
    };

    // Add to communication channel
    const channel = session.communication.find(c => c.active);
    if (channel) {
      channel.history.push(message);
    }

    return messageId;
  }

  async addReaction(sessionId: string, messageId: string, emoji: string, agentId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const channel = session.communication.find(c => c.active);
    if (!channel) return false;

    const message = channel.history.find(m => m.id === messageId);
    if (!message) return false;

    // Remove existing reaction from this agent
    message.reactions = message.reactions.filter(r => r.agentId !== agentId);
    
    // Add new reaction
    message.reactions.push({
      emoji,
      agentId,
      timestamp: new Date()
    });

    return true;
  }

  // Quality Gates
  async executeQualityGate(taskId: string, qualityGateId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    const session = this.sessions.get(task.context.relatedTasks[0]);
    if (!session || !session.workflow) return false;

    const step = session.workflow.steps.find(s => s.qualityGates.some(qg => qg.id === qualityGateId));
    if (!step) return false;

    const qualityGate = step.qualityGates.find(qg => qg.id === qualityGateId);
    if (!qualityGate) return false;

    // Execute quality gate checks
    const results = await this.runQualityChecks(task, qualityGate);
    
    if (results.passed) {
      // Quality gate passed
      task.status.notes.push(`Quality gate ${qualityGate.name} passed`);
      return true;
    } else {
      // Quality gate failed
      task.status.current = 'blocked';
      task.status.blockers.push({
        id: `blocker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        description: `Quality gate ${qualityGate.name} failed: ${results.reasons.join(', ')}`,
        type: 'technical',
        severity: 'high',
        reportedBy: 'system',
        reportedAt: new Date(),
        resolved: false
      });
      return false;
    }
  }

  private async runQualityChecks(task: Task, qualityGate: QualityGate): Promise<{ passed: boolean; reasons: string[] }> {
    const reasons: string[] = [];
    let passed = true;

    for (const criteria of qualityGate.criteria) {
      const result = await this.checkQualityCriteria(task, criteria);
      if (!result.passed) {
        passed = false;
        reasons.push(result.reason);
      }
    }

    return { passed, reasons };
  }

  private async checkQualityCriteria(task: Task, criteria: QualityCriteria): Promise<{ passed: boolean; reason: string }> {
    // This would implement actual quality checks
    // For now, return a mock result
    return { passed: true, reason: '' };
  }

  // Analytics and Metrics
  async getCollaborationMetrics(sessionId: string): Promise<CollaborationMetrics> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const metrics: CollaborationMetrics = {
      efficiency: 0.8,
      quality: 0.85,
      communication: 0.75,
      coordination: 0.9,
      satisfaction: 0.8,
      velocity: 0.7,
      bottlenecks: [],
      improvements: []
    };

    // Calculate actual metrics based on session data
    const tasks = Array.from(this.tasks.values()).filter(t => 
      session.tasks.includes(t.id)
    );

    if (tasks.length > 0) {
      const completedTasks = tasks.filter(t => t.status.current === 'completed');
      metrics.efficiency = completedTasks.length / tasks.length;
      
      const avgQuality = completedTasks.reduce((sum, t) => 
        sum + t.deliverables.reduce((dSum, d) => dSum + d.quality, 0) / t.deliverables.length, 0
      ) / completedTasks.length;
      metrics.quality = avgQuality / 100;
    }

    return metrics;
  }

  // Private helper methods
  private async initializeDefaultAgents(): Promise<void> {
    const defaultAgents = [
      {
        name: 'CodeMaster',
        role: {
          type: 'coder' as const,
          specialization: ['javascript', 'typescript', 'react', 'node.js'],
          responsibilities: ['Write code', 'Implement features', 'Fix bugs'],
          priority: 1
        },
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java'],
          frameworks: ['react', 'vue', 'angular', 'express', 'django'],
          tools: ['vscode', 'git', 'npm', 'yarn'],
          skills: ['frontend', 'backend', 'fullstack'],
          maxComplexity: 8,
          speed: 'fast' as const,
          accuracy: 0.9,
          creativity: 0.8,
          attentionToDetail: 0.85
        },
        personality: {
          communicationStyle: 'technical' as const,
          riskTolerance: 'moderate' as const,
          collaborationStyle: 'collaborative' as const,
          problemSolving: 'analytical' as const,
          feedbackStyle: 'constructive' as const
        },
        preferences: {
          workingHours: { start: '09:00', end: '17:00' },
          maxConcurrentTasks: 3,
          preferredComplexity: 'complex' as const,
          communicationFrequency: 'regular' as const,
          feedbackFrequency: 'detailed' as const
        }
      },
      {
        name: 'ReviewBot',
        role: {
          type: 'reviewer' as const,
          specialization: ['code_review', 'quality_assurance', 'best_practices'],
          responsibilities: ['Review code', 'Check quality', 'Suggest improvements'],
          priority: 2
        },
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp'],
          frameworks: ['react', 'vue', 'angular', 'express', 'django', 'spring'],
          tools: ['eslint', 'prettier', 'sonarqube', 'codeclimate'],
          skills: ['code_review', 'quality_assurance', 'security', 'performance'],
          maxComplexity: 10,
          speed: 'medium' as const,
          accuracy: 0.95,
          creativity: 0.6,
          attentionToDetail: 0.95
        },
        personality: {
          communicationStyle: 'formal' as const,
          riskTolerance: 'conservative' as const,
          collaborationStyle: 'independent' as const,
          problemSolving: 'systematic' as const,
          feedbackStyle: 'detailed' as const
        },
        preferences: {
          workingHours: { start: '08:00', end: '18:00' },
          maxConcurrentTasks: 5,
          preferredComplexity: 'medium' as const,
          communicationFrequency: 'minimal' as const,
          feedbackFrequency: 'detailed' as const
        }
      },
      {
        name: 'TestGenius',
        role: {
          type: 'tester' as const,
          specialization: ['unit_testing', 'integration_testing', 'e2e_testing'],
          responsibilities: ['Write tests', 'Test coverage', 'Quality assurance'],
          priority: 3
        },
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp'],
          frameworks: ['jest', 'mocha', 'cypress', 'selenium', 'pytest'],
          tools: ['jest', 'cypress', 'selenium', 'testcafe', 'playwright'],
          skills: ['testing', 'qa', 'automation', 'coverage'],
          maxComplexity: 7,
          speed: 'fast' as const,
          accuracy: 0.88,
          creativity: 0.7,
          attentionToDetail: 0.9
        },
        personality: {
          communicationStyle: 'friendly' as const,
          riskTolerance: 'moderate' as const,
          collaborationStyle: 'collaborative' as const,
          problemSolving: 'systematic' as const,
          feedbackStyle: 'constructive' as const
        },
        preferences: {
          workingHours: { start: '09:00', end: '17:00' },
          maxConcurrentTasks: 4,
          preferredComplexity: 'medium' as const,
          communicationFrequency: 'regular' as const,
          feedbackFrequency: 'regular' as const
        }
      }
    ];

    for (const agentData of defaultAgents) {
      await this.createAgent(agentData);
    }
  }

  private async loadWorkflows(): Promise<void> {
    // Load predefined workflows
    const defaultWorkflows = [
      {
        name: 'Feature Development',
        steps: [
          {
            id: 'design',
            name: 'Design Phase',
            description: 'Design the feature architecture and implementation plan',
            agentRole: 'architect',
            inputs: ['requirements'],
            outputs: ['design_document', 'architecture'],
            duration: 120,
            parallel: false,
            dependencies: [],
            qualityGates: []
          },
          {
            id: 'implement',
            name: 'Implementation Phase',
            description: 'Implement the feature according to the design',
            agentRole: 'coder',
            inputs: ['design_document', 'architecture'],
            outputs: ['code'],
            duration: 240,
            parallel: false,
            dependencies: ['design'],
            qualityGates: []
          },
          {
            id: 'review',
            name: 'Code Review',
            description: 'Review the implemented code for quality and best practices',
            agentRole: 'reviewer',
            inputs: ['code'],
            outputs: ['review_comments', 'approved_code'],
            duration: 60,
            parallel: false,
            dependencies: ['implement'],
            qualityGates: [
              {
                id: 'code_quality',
                name: 'Code Quality Check',
                type: 'code_review',
                criteria: [
                  { metric: 'complexity', threshold: 10, operator: 'less_than', weight: 1 },
                  { metric: 'coverage', threshold: 80, operator: 'greater_than', weight: 1 }
                ],
                required: true,
                approver: 'reviewer'
              }
            ]
          },
          {
            id: 'test',
            name: 'Testing Phase',
            description: 'Write and execute tests for the feature',
            agentRole: 'tester',
            inputs: ['approved_code'],
            outputs: ['tests', 'test_results'],
            duration: 90,
            parallel: false,
            dependencies: ['review'],
            qualityGates: [
              {
                id: 'test_coverage',
                name: 'Test Coverage Check',
                type: 'testing',
                criteria: [
                  { metric: 'coverage', threshold: 90, operator: 'greater_than', weight: 1 }
                ],
                required: true,
                approver: 'tester'
              }
            ]
          }
        ],
        parallel: false,
        dependencies: []
      }
    ];

    for (const workflowData of defaultWorkflows) {
      await this.createWorkflow(workflowData);
    }
  }

  // Public API
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): CollaborationSession[] {
    return Array.from(this.sessions.values());
  }

  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }
}
export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  capabilities: AgentCapabilities;
  personality: AgentPersonality;
  status: 'idle' | 'working' | 'waiting' | 'error';
  currentTask?: string;
  performance: AgentPerformance;
  preferences: AgentPreferences;
}

export interface AgentRole {
  type: 'coder' | 'reviewer' | 'tester' | 'architect' | 'debugger' | 'documenter' | 'optimizer' | 'security';
  specialization: string[];
  responsibilities: string[];
  priority: number;
}

export interface AgentCapabilities {
  languages: string[];
  frameworks: string[];
  tools: string[];
  skills: string[];
  maxComplexity: number;
  speed: 'slow' | 'medium' | 'fast' | 'ultra_fast';
  accuracy: number;
  creativity: number;
  attentionToDetail: number;
}

export interface AgentPersonality {
  communicationStyle: 'formal' | 'casual' | 'technical' | 'friendly';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  collaborationStyle: 'independent' | 'collaborative' | 'leading';
  problemSolving: 'analytical' | 'creative' | 'systematic' | 'intuitive';
  feedbackStyle: 'constructive' | 'direct' | 'gentle' | 'detailed';
}

export interface AgentPerformance {
  tasksCompleted: number;
  successRate: number;
  averageTime: number;
  qualityScore: number;
  collaborationScore: number;
  lastUpdated: Date;
}

export interface AgentPreferences {
  workingHours: { start: string; end: string };
  maxConcurrentTasks: number;
  preferredComplexity: 'simple' | 'medium' | 'complex';
  communicationFrequency: 'minimal' | 'regular' | 'frequent';
  feedbackFrequency: 'minimal' | 'regular' | 'detailed';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: number;
  estimatedTime: number;
  assignedAgent?: string;
  status: TaskStatus;
  dependencies: string[];
  deliverables: Deliverable[];
  context: TaskContext;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
}

export interface TaskType {
  category: 'development' | 'testing' | 'review' | 'debugging' | 'documentation' | 'optimization' | 'security';
  subcategory: string;
  requirements: string[];
  constraints: string[];
}

export interface TaskStatus {
  current: 'pending' | 'assigned' | 'in_progress' | 'review' | 'completed' | 'blocked' | 'cancelled';
  progress: number; // 0-100
  blockers: Blocker[];
  notes: string[];
}

export interface Blocker {
  id: string;
  description: string;
  type: 'dependency' | 'resource' | 'knowledge' | 'technical' | 'external';
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface Deliverable {
  id: string;
  type: 'code' | 'documentation' | 'test' | 'review' | 'analysis' | 'design';
  title: string;
  description: string;
  content: string;
  format: string;
  quality: number;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: Date;
  feedback: Feedback[];
}

export interface Feedback {
  id: string;
  fromAgent: string;
  type: 'suggestion' | 'criticism' | 'praise' | 'question' | 'concern';
  content: string;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  timestamp: Date;
  resolved: boolean;
  response?: string;
}

export interface TaskContext {
  files: string[];
  codebase: string;
  requirements: string[];
  constraints: string[];
  environment: string;
  dependencies: string[];
  relatedTasks: string[];
  stakeholders: string[];
}

export interface CollaborationSession {
  id: string;
  name: string;
  description: string;
  agents: string[];
  tasks: string[];
  status: 'planning' | 'active' | 'review' | 'completed' | 'paused';
  workflow: Workflow;
  communication: CommunicationChannel[];
  metrics: CollaborationMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  currentStep: number;
  parallel: boolean;
  dependencies: WorkflowDependency[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  agentRole: string;
  inputs: string[];
  outputs: string[];
  duration: number;
  parallel: boolean;
  dependencies: string[];
  qualityGates: QualityGate[];
}

export interface WorkflowDependency {
  from: string;
  to: string;
  type: 'sequential' | 'parallel' | 'conditional' | 'iterative';
  condition?: string;
}

export interface QualityGate {
  id: string;
  name: string;
  type: 'code_review' | 'testing' | 'security_scan' | 'performance_check' | 'documentation_review';
  criteria: QualityCriteria[];
  required: boolean;
  approver: string;
}

export interface QualityCriteria {
  metric: string;
  threshold: number;
  operator: 'greater_than' | 'less_than' | 'equals' | 'contains' | 'not_contains';
  weight: number;
}

export interface CommunicationChannel {
  id: string;
  type: 'chat' | 'voice' | 'video' | 'shared_workspace' | 'notification';
  participants: string[];
  active: boolean;
  history: CommunicationMessage[];
}

export interface CommunicationMessage {
  id: string;
  fromAgent: string;
  content: string;
  type: 'text' | 'code' | 'file' | 'task_update' | 'status_change';
  timestamp: Date;
  readBy: string[];
  reactions: MessageReaction[];
}

export interface MessageReaction {
  emoji: string;
  agentId: string;
  timestamp: Date;
}

export interface CollaborationMetrics {
  efficiency: number;
  quality: number;
  communication: number;
  coordination: number;
  satisfaction: number;
  velocity: number;
  bottlenecks: Bottleneck[];
  improvements: Improvement[];
}

export interface Bottleneck {
  id: string;
  description: string;
  type: 'agent' | 'task' | 'workflow' | 'communication' | 'resource';
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: number;
  suggestions: string[];
}

export interface Improvement {
  id: string;
  description: string;
  type: 'process' | 'tool' | 'training' | 'workflow' | 'communication';
  priority: 'low' | 'medium' | 'high' | 'critical';
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'proposed' | 'approved' | 'in_progress' | 'completed';
}

export class MultiAgentCollaborationEngine {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private sessions: Map<string, CollaborationSession> = new Map();
  private workflows: Map<string, Workflow> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Initialize default agents
    await this.initializeDefaultAgents();
    
    // Load existing workflows
    await this.loadWorkflows();
    
    this.isInitialized = true;
  }

  // Agent Management
  async createAgent(agent: Omit<Agent, 'id' | 'status' | 'performance' | 'currentTask'>): Promise<string> {
    const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newAgent: Agent = {
      ...agent,
      id: agentId,
      status: 'idle',
      performance: {
        tasksCompleted: 0,
        successRate: 0,
        averageTime: 0,
        qualityScore: 0,
        collaborationScore: 0,
        lastUpdated: new Date()
      }
    };

    this.agents.set(agentId, newAgent);
    return agentId;
  }

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    const updatedAgent = { ...agent, ...updates };
    this.agents.set(agentId, updatedAgent);
    return true;
  }

  async removeAgent(agentId: string): Promise<boolean> {
    // Check if agent has active tasks
    const activeTasks = Array.from(this.tasks.values()).filter(
      task => task.assignedAgent === agentId && task.status.current === 'in_progress'
    );
    
    if (activeTasks.length > 0) {
      throw new Error('Cannot remove agent with active tasks');
    }

    return this.agents.delete(agentId);
  }

  // Task Management
  async createTask(task: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTask: Task = {
      ...task,
      id: taskId,
      status: {
        current: 'pending',
        progress: 0,
        blockers: [],
        notes: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks.set(taskId, newTask);
    return taskId;
  }

  async assignTask(taskId: string, agentId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    const agent = this.agents.get(agentId);
    
    if (!task || !agent) return false;
    if (agent.status !== 'idle') return false;

    task.assignedAgent = agentId;
    task.status.current = 'assigned';
    task.updatedAt = new Date();
    
    agent.status = 'working';
    agent.currentTask = taskId;

    return true;
  }

  async startTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || !task.assignedAgent) return false;

    const agent = this.agents.get(task.assignedAgent);
    if (!agent || agent.status !== 'working') return false;

    task.status.current = 'in_progress';
    task.status.progress = 0;
    task.updatedAt = new Date();

    return true;
  }

  async updateTaskProgress(taskId: string, progress: number, notes?: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || task.status.current !== 'in_progress') return false;

    task.status.progress = Math.max(0, Math.min(100, progress));
    task.updatedAt = new Date();
    
    if (notes) {
      task.status.notes.push(notes);
    }

    return true;
  }

  async completeTask(taskId: string, deliverables: Deliverable[]): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task || task.status.current !== 'in_progress') return false;

    task.status.current = 'completed';
    task.status.progress = 100;
    task.deliverables = deliverables;
    task.completedAt = new Date();
    task.updatedAt = new Date();

    // Update agent status
    if (task.assignedAgent) {
      const agent = this.agents.get(task.assignedAgent);
      if (agent) {
        agent.status = 'idle';
        agent.currentTask = undefined;
        agent.performance.tasksCompleted++;
        agent.performance.lastUpdated = new Date();
      }
    }

    return true;
  }

  // Collaboration Session Management
  async createCollaborationSession(session: Omit<CollaborationSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newSession: CollaborationSession = {
      ...session,
      id: sessionId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sessions.set(sessionId, newSession);
    return sessionId;
  }

  async addAgentToSession(sessionId: string, agentId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const agent = this.agents.get(agentId);
    
    if (!session || !agent) return false;
    if (session.agents.includes(agentId)) return true;

    session.agents.push(agentId);
    session.updatedAt = new Date();
    return true;
  }

  async removeAgentFromSession(sessionId: string, agentId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.agents = session.agents.filter(id => id !== agentId);
    session.updatedAt = new Date();
    return true;
  }

  // Workflow Management
  async createWorkflow(workflow: Omit<Workflow, 'id'>): Promise<string> {
    const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newWorkflow: Workflow = {
      ...workflow,
      id: workflowId
    };

    this.workflows.set(workflowId, newWorkflow);
    return workflowId;
  }

  async executeWorkflow(sessionId: string, workflowId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    const workflow = this.workflows.get(workflowId);
    
    if (!session || !workflow) return false;

    session.workflow = workflow;
    session.status = 'active';
    session.updatedAt = new Date();

    // Start workflow execution
    await this.executeWorkflowStep(sessionId, 0);
    return true;
  }

  private async executeWorkflowStep(sessionId: string, stepIndex: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !session.workflow) return;

    const workflow = session.workflow;
    const step = workflow.steps[stepIndex];
    
    if (!step) {
      // Workflow completed
      session.status = 'completed';
      session.updatedAt = new Date();
      return;
    }

    // Find available agent for this step
    const availableAgent = await this.findAvailableAgent(step.agentRole, session.agents);
    
    if (!availableAgent) {
      // No available agent, wait or retry
      setTimeout(() => this.executeWorkflowStep(sessionId, stepIndex), 5000);
      return;
    }

    // Create task for this step
    const task = await this.createTask({
      title: step.name,
      description: step.description,
      type: {
        category: 'development',
        subcategory: step.agentRole,
        requirements: step.inputs,
        constraints: []
      },
      priority: 'medium',
      complexity: 5,
      estimatedTime: step.duration,
      dependencies: step.dependencies,
      deliverables: [],
      context: {
        files: [],
        codebase: '',
        requirements: step.inputs,
        constraints: [],
        environment: '',
        dependencies: [],
        relatedTasks: [],
        stakeholders: []
      }
    });

    // Assign and start task
    await this.assignTask(task, availableAgent.id);
    await this.startTask(task);

    // Move to next step
    workflow.currentStep = stepIndex + 1;
    session.updatedAt = new Date();
  }

  private async findAvailableAgent(role: string, agentIds: string[]): Promise<Agent | null> {
    for (const agentId of agentIds) {
      const agent = this.agents.get(agentId);
      if (agent && agent.status === 'idle' && agent.role.type === role) {
        return agent;
      }
    }
    return null;
  }

  // Communication
  async sendMessage(sessionId: string, fromAgent: string, content: string, type: string = 'text'): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) return '';

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const message: CommunicationMessage = {
      id: messageId,
      fromAgent,
      content,
      type: type as any,
      timestamp: new Date(),
      readBy: [fromAgent],
      reactions: []
    };

    // Add to communication channel
    const channel = session.communication.find(c => c.active);
    if (channel) {
      channel.history.push(message);
    }

    return messageId;
  }

  async addReaction(sessionId: string, messageId: string, emoji: string, agentId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const channel = session.communication.find(c => c.active);
    if (!channel) return false;

    const message = channel.history.find(m => m.id === messageId);
    if (!message) return false;

    // Remove existing reaction from this agent
    message.reactions = message.reactions.filter(r => r.agentId !== agentId);
    
    // Add new reaction
    message.reactions.push({
      emoji,
      agentId,
      timestamp: new Date()
    });

    return true;
  }

  // Quality Gates
  async executeQualityGate(taskId: string, qualityGateId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    const session = this.sessions.get(task.context.relatedTasks[0]);
    if (!session || !session.workflow) return false;

    const step = session.workflow.steps.find(s => s.qualityGates.some(qg => qg.id === qualityGateId));
    if (!step) return false;

    const qualityGate = step.qualityGates.find(qg => qg.id === qualityGateId);
    if (!qualityGate) return false;

    // Execute quality gate checks
    const results = await this.runQualityChecks(task, qualityGate);
    
    if (results.passed) {
      // Quality gate passed
      task.status.notes.push(`Quality gate ${qualityGate.name} passed`);
      return true;
    } else {
      // Quality gate failed
      task.status.current = 'blocked';
      task.status.blockers.push({
        id: `blocker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        description: `Quality gate ${qualityGate.name} failed: ${results.reasons.join(', ')}`,
        type: 'technical',
        severity: 'high',
        reportedBy: 'system',
        reportedAt: new Date(),
        resolved: false
      });
      return false;
    }
  }

  private async runQualityChecks(task: Task, qualityGate: QualityGate): Promise<{ passed: boolean; reasons: string[] }> {
    const reasons: string[] = [];
    let passed = true;

    for (const criteria of qualityGate.criteria) {
      const result = await this.checkQualityCriteria(task, criteria);
      if (!result.passed) {
        passed = false;
        reasons.push(result.reason);
      }
    }

    return { passed, reasons };
  }

  private async checkQualityCriteria(task: Task, criteria: QualityCriteria): Promise<{ passed: boolean; reason: string }> {
    // This would implement actual quality checks
    // For now, return a mock result
    return { passed: true, reason: '' };
  }

  // Analytics and Metrics
  async getCollaborationMetrics(sessionId: string): Promise<CollaborationMetrics> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const metrics: CollaborationMetrics = {
      efficiency: 0.8,
      quality: 0.85,
      communication: 0.75,
      coordination: 0.9,
      satisfaction: 0.8,
      velocity: 0.7,
      bottlenecks: [],
      improvements: []
    };

    // Calculate actual metrics based on session data
    const tasks = Array.from(this.tasks.values()).filter(t => 
      session.tasks.includes(t.id)
    );

    if (tasks.length > 0) {
      const completedTasks = tasks.filter(t => t.status.current === 'completed');
      metrics.efficiency = completedTasks.length / tasks.length;
      
      const avgQuality = completedTasks.reduce((sum, t) => 
        sum + t.deliverables.reduce((dSum, d) => dSum + d.quality, 0) / t.deliverables.length, 0
      ) / completedTasks.length;
      metrics.quality = avgQuality / 100;
    }

    return metrics;
  }

  // Private helper methods
  private async initializeDefaultAgents(): Promise<void> {
    const defaultAgents = [
      {
        name: 'CodeMaster',
        role: {
          type: 'coder' as const,
          specialization: ['javascript', 'typescript', 'react', 'node.js'],
          responsibilities: ['Write code', 'Implement features', 'Fix bugs'],
          priority: 1
        },
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java'],
          frameworks: ['react', 'vue', 'angular', 'express', 'django'],
          tools: ['vscode', 'git', 'npm', 'yarn'],
          skills: ['frontend', 'backend', 'fullstack'],
          maxComplexity: 8,
          speed: 'fast' as const,
          accuracy: 0.9,
          creativity: 0.8,
          attentionToDetail: 0.85
        },
        personality: {
          communicationStyle: 'technical' as const,
          riskTolerance: 'moderate' as const,
          collaborationStyle: 'collaborative' as const,
          problemSolving: 'analytical' as const,
          feedbackStyle: 'constructive' as const
        },
        preferences: {
          workingHours: { start: '09:00', end: '17:00' },
          maxConcurrentTasks: 3,
          preferredComplexity: 'complex' as const,
          communicationFrequency: 'regular' as const,
          feedbackFrequency: 'detailed' as const
        }
      },
      {
        name: 'ReviewBot',
        role: {
          type: 'reviewer' as const,
          specialization: ['code_review', 'quality_assurance', 'best_practices'],
          responsibilities: ['Review code', 'Check quality', 'Suggest improvements'],
          priority: 2
        },
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp'],
          frameworks: ['react', 'vue', 'angular', 'express', 'django', 'spring'],
          tools: ['eslint', 'prettier', 'sonarqube', 'codeclimate'],
          skills: ['code_review', 'quality_assurance', 'security', 'performance'],
          maxComplexity: 10,
          speed: 'medium' as const,
          accuracy: 0.95,
          creativity: 0.6,
          attentionToDetail: 0.95
        },
        personality: {
          communicationStyle: 'formal' as const,
          riskTolerance: 'conservative' as const,
          collaborationStyle: 'independent' as const,
          problemSolving: 'systematic' as const,
          feedbackStyle: 'detailed' as const
        },
        preferences: {
          workingHours: { start: '08:00', end: '18:00' },
          maxConcurrentTasks: 5,
          preferredComplexity: 'medium' as const,
          communicationFrequency: 'minimal' as const,
          feedbackFrequency: 'detailed' as const
        }
      },
      {
        name: 'TestGenius',
        role: {
          type: 'tester' as const,
          specialization: ['unit_testing', 'integration_testing', 'e2e_testing'],
          responsibilities: ['Write tests', 'Test coverage', 'Quality assurance'],
          priority: 3
        },
        capabilities: {
          languages: ['javascript', 'typescript', 'python', 'java', 'csharp'],
          frameworks: ['jest', 'mocha', 'cypress', 'selenium', 'pytest'],
          tools: ['jest', 'cypress', 'selenium', 'testcafe', 'playwright'],
          skills: ['testing', 'qa', 'automation', 'coverage'],
          maxComplexity: 7,
          speed: 'fast' as const,
          accuracy: 0.88,
          creativity: 0.7,
          attentionToDetail: 0.9
        },
        personality: {
          communicationStyle: 'friendly' as const,
          riskTolerance: 'moderate' as const,
          collaborationStyle: 'collaborative' as const,
          problemSolving: 'systematic' as const,
          feedbackStyle: 'constructive' as const
        },
        preferences: {
          workingHours: { start: '09:00', end: '17:00' },
          maxConcurrentTasks: 4,
          preferredComplexity: 'medium' as const,
          communicationFrequency: 'regular' as const,
          feedbackFrequency: 'regular' as const
        }
      }
    ];

    for (const agentData of defaultAgents) {
      await this.createAgent(agentData);
    }
  }

  private async loadWorkflows(): Promise<void> {
    // Load predefined workflows
    const defaultWorkflows = [
      {
        name: 'Feature Development',
        steps: [
          {
            id: 'design',
            name: 'Design Phase',
            description: 'Design the feature architecture and implementation plan',
            agentRole: 'architect',
            inputs: ['requirements'],
            outputs: ['design_document', 'architecture'],
            duration: 120,
            parallel: false,
            dependencies: [],
            qualityGates: []
          },
          {
            id: 'implement',
            name: 'Implementation Phase',
            description: 'Implement the feature according to the design',
            agentRole: 'coder',
            inputs: ['design_document', 'architecture'],
            outputs: ['code'],
            duration: 240,
            parallel: false,
            dependencies: ['design'],
            qualityGates: []
          },
          {
            id: 'review',
            name: 'Code Review',
            description: 'Review the implemented code for quality and best practices',
            agentRole: 'reviewer',
            inputs: ['code'],
            outputs: ['review_comments', 'approved_code'],
            duration: 60,
            parallel: false,
            dependencies: ['implement'],
            qualityGates: [
              {
                id: 'code_quality',
                name: 'Code Quality Check',
                type: 'code_review',
                criteria: [
                  { metric: 'complexity', threshold: 10, operator: 'less_than', weight: 1 },
                  { metric: 'coverage', threshold: 80, operator: 'greater_than', weight: 1 }
                ],
                required: true,
                approver: 'reviewer'
              }
            ]
          },
          {
            id: 'test',
            name: 'Testing Phase',
            description: 'Write and execute tests for the feature',
            agentRole: 'tester',
            inputs: ['approved_code'],
            outputs: ['tests', 'test_results'],
            duration: 90,
            parallel: false,
            dependencies: ['review'],
            qualityGates: [
              {
                id: 'test_coverage',
                name: 'Test Coverage Check',
                type: 'testing',
                criteria: [
                  { metric: 'coverage', threshold: 90, operator: 'greater_than', weight: 1 }
                ],
                required: true,
                approver: 'tester'
              }
            ]
          }
        ],
        parallel: false,
        dependencies: []
      }
    ];

    for (const workflowData of defaultWorkflows) {
      await this.createWorkflow(workflowData);
    }
  }

  // Public API
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getTask(taskId: string): Task | undefined {
    return this.tasks.get(taskId);
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  getSession(sessionId: string): CollaborationSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): CollaborationSession[] {
    return Array.from(this.sessions.values());
  }

  getWorkflow(workflowId: string): Workflow | undefined {
    return this.workflows.get(workflowId);
  }

  getAllWorkflows(): Workflow[] {
    return Array.from(this.workflows.values());
  }
}




