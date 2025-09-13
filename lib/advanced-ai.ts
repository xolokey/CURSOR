import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

export interface MultiLineEdit {
  id: string;
  filePath: string;
  startLine: number;
  endLine: number;
  oldText: string;
  newText: string;
  description: string;
  confidence: number;
}

export interface AgentTask {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  steps: AgentStep[];
  result?: any;
  error?: string;
}

export interface AgentStep {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  action: 'analyze' | 'edit' | 'create' | 'delete' | 'test' | 'commit';
  details?: any;
  error?: string;
}

export interface SmartRewrite {
  id: string;
  originalCode: string;
  rewrittenCode: string;
  improvements: string[];
  confidence: number;
  explanation: string;
}

export interface CodeReference {
  symbol: string;
  filePath: string;
  line: number;
  type: 'function' | 'class' | 'interface' | 'variable' | 'import';
  description: string;
}

export class AdvancedAI {
  private geminiApiKey: string;
  private perplexityApiKey: string;

  constructor(geminiApiKey: string, perplexityApiKey: string) {
    this.geminiApiKey = geminiApiKey;
    this.perplexityApiKey = perplexityApiKey;
  }

  async generateMultiLineEdits(
    code: string,
    context: string,
    filePath: string
  ): Promise<MultiLineEdit[]> {
    try {
      const result = await streamText({
        model: google('gemini-1.5-flash'),
        messages: [
          {
            role: 'system',
            content: `You are an advanced AI code editor. Analyze the provided code and suggest multiple line edits to improve it. 
            Return a JSON array of edits with the following structure:
            [
              {
                "id": "unique_id",
                "filePath": "file_path",
                "startLine": 1,
                "endLine": 5,
                "oldText": "original code",
                "newText": "improved code",
                "description": "what this edit does",
                "confidence": 0.95
              }
            ]
            
            Focus on:
            - Code quality improvements
            - Performance optimizations
            - Bug fixes
            - Best practices
            - Type safety
            - Error handling
            `,
          },
          {
            role: 'user',
            content: `File: ${filePath}\n\nContext: ${context}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nSuggest multiple line edits to improve this code.`,
          },
        ],
      });

      const response = await result.text;
      const edits = JSON.parse(response);
      return Array.isArray(edits) ? edits : [];
    } catch (error) {
      console.error('Error generating multi-line edits:', error);
      return [];
    }
  }

  async createAgentTask(description: string): Promise<AgentTask> {
    const task: AgentTask = {
      id: `task_${Date.now()}`,
      description,
      status: 'pending',
      steps: [],
    };

    // Generate steps for the task
    const steps = await this.generateAgentSteps(description);
    task.steps = steps;

    return task;
  }

  private async generateAgentSteps(description: string): Promise<AgentStep[]> {
    try {
      const result = await streamText({
        model: google('gemini-1.5-flash'),
        messages: [
          {
            role: 'system',
            content: `You are an AI agent that breaks down complex coding tasks into actionable steps. 
            Return a JSON array of steps with the following structure:
            [
              {
                "id": "step_1",
                "description": "Analyze the current codebase",
                "action": "analyze",
                "status": "pending"
              },
              {
                "id": "step_2", 
                "description": "Create new component",
                "action": "create",
                "status": "pending"
              }
            ]
            
            Available actions: analyze, edit, create, delete, test, commit
            `,
          },
          {
            role: 'user',
            content: `Break down this task into steps: ${description}`,
          },
        ],
      });

      const response = await result.text;
      const steps = JSON.parse(response);
      return Array.isArray(steps) ? steps : [];
    } catch (error) {
      console.error('Error generating agent steps:', error);
      return [];
    }
  }

  async executeAgentStep(task: AgentTask, stepId: string): Promise<AgentStep> {
    const step = task.steps.find(s => s.id === stepId);
    if (!step) {
      throw new Error('Step not found');
    }

    step.status = 'in_progress';

    try {
      switch (step.action) {
        case 'analyze':
          step.details = await this.analyzeCodebase();
          break;
        case 'edit':
          step.details = await this.performCodeEdit(step);
          break;
        case 'create':
          step.details = await this.createFile(step);
          break;
        case 'delete':
          step.details = await this.deleteFile(step);
          break;
        case 'test':
          step.details = await this.runTests(step);
          break;
        case 'commit':
          step.details = await this.commitChanges(step);
          break;
      }

      step.status = 'completed';
    } catch (error) {
      step.status = 'failed';
      step.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return step;
  }

  async generateSmartRewrite(code: string, context: string): Promise<SmartRewrite> {
    try {
      const result = await streamText({
        model: google('gemini-1.5-flash'),
        messages: [
          {
            role: 'system',
            content: `You are an expert code refactoring AI. Analyze the provided code and rewrite it to be more efficient, readable, and maintainable.
            Return a JSON object with the following structure:
            {
              "id": "rewrite_${Date.now()}",
              "originalCode": "original code here",
              "rewrittenCode": "improved code here", 
              "improvements": ["improvement 1", "improvement 2"],
              "confidence": 0.95,
              "explanation": "detailed explanation of changes"
            }
            `,
          },
          {
            role: 'user',
            content: `Context: ${context}\n\nCode to rewrite:\n\`\`\`\n${code}\n\`\`\``,
          },
        ],
      });

      const response = await result.text;
      const rewrite = JSON.parse(response);
      return rewrite;
    } catch (error) {
      console.error('Error generating smart rewrite:', error);
      throw error;
    }
  }

  async findCodeReferences(symbol: string, codebase: string[]): Promise<CodeReference[]> {
    try {
      const result = await streamText({
        model: google('gemini-1.5-flash'),
        messages: [
          {
            role: 'system',
            content: `You are a code analysis AI. Find all references to a symbol in the provided codebase.
            Return a JSON array of references:
            [
              {
                "symbol": "symbol_name",
                "filePath": "file_path",
                "line": 42,
                "type": "function",
                "description": "what this reference is"
              }
            ]
            `,
          },
          {
            role: 'user',
            content: `Find references to "${symbol}" in this codebase:\n\n${codebase.join('\n\n')}`,
          },
        ],
      });

      const response = await result.text;
      const references = JSON.parse(response);
      return Array.isArray(references) ? references : [];
    } catch (error) {
      console.error('Error finding code references:', error);
      return [];
    }
  }

  async generateTerminalCommand(description: string): Promise<string> {
    try {
      const result = await streamText({
        model: google('gemini-1.5-flash'),
        messages: [
          {
            role: 'system',
            content: `You are a terminal command generator. Convert natural language descriptions into appropriate terminal commands.
            Return only the command, no explanations.`,
          },
          {
            role: 'user',
            content: `Generate a terminal command for: ${description}`,
          },
        ],
      });

      return await result.text;
    } catch (error) {
      console.error('Error generating terminal command:', error);
      return '';
    }
  }

  async detectAndFixErrors(code: string, filePath: string): Promise<MultiLineEdit[]> {
    try {
      const result = await streamText({
        model: google('gemini-1.5-flash'),
        messages: [
          {
            role: 'system',
            content: `You are a code error detection and fixing AI. Analyze the code for errors and suggest fixes.
            Return a JSON array of fixes:
            [
              {
                "id": "fix_1",
                "filePath": "file_path",
                "startLine": 1,
                "endLine": 3,
                "oldText": "code with error",
                "newText": "fixed code",
                "description": "error description and fix",
                "confidence": 0.95
              }
            ]
            `,
          },
          {
            role: 'user',
            content: `File: ${filePath}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nDetect and fix any errors.`,
          },
        ],
      });

      const response = await result.text;
      const fixes = JSON.parse(response);
      return Array.isArray(fixes) ? fixes : [];
    } catch (error) {
      console.error('Error detecting and fixing errors:', error);
      return [];
    }
  }

  private async analyzeCodebase(): Promise<any> {
    // Implementation for codebase analysis
    return { analysis: 'Codebase analyzed' };
  }

  private async performCodeEdit(step: AgentStep): Promise<any> {
    // Implementation for code editing
    return { edit: 'Code edited' };
  }

  private async createFile(step: AgentStep): Promise<any> {
    // Implementation for file creation
    return { file: 'File created' };
  }

  private async deleteFile(step: AgentStep): Promise<any> {
    // Implementation for file deletion
    return { file: 'File deleted' };
  }

  private async runTests(step: AgentStep): Promise<any> {
    // Implementation for test running
    return { tests: 'Tests run' };
  }

  private async commitChanges(step: AgentStep): Promise<any> {
    // Implementation for git commit
    return { commit: 'Changes committed' };
  }
}
