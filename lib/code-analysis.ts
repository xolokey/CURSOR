import { promises as fs } from 'fs';
import path from 'path';

export interface CodeIssue {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  rule: string;
  source: string;
}

export interface CodeMetrics {
  linesOfCode: number;
  linesOfComments: number;
  linesOfBlank: number;
  totalLines: number;
  cyclomaticComplexity: number;
  maintainabilityIndex: number;
  technicalDebt: number;
}

export interface CodeStructure {
  functions: Array<{
    name: string;
    line: number;
    parameters: string[];
    returnType?: string;
    complexity: number;
  }>;
  classes: Array<{
    name: string;
    line: number;
    methods: string[];
    properties: string[];
    extends?: string;
    implements?: string[];
  }>;
  imports: Array<{
    source: string;
    line: number;
    type: 'default' | 'named' | 'namespace';
    names: string[];
  }>;
  exports: Array<{
    name: string;
    line: number;
    type: 'default' | 'named' | 'namespace';
  }>;
}

export class CodeAnalyzer {
  private supportedLanguages = [
    'javascript', 'typescript', 'jsx', 'tsx',
    'python', 'java', 'cpp', 'c', 'php',
    'ruby', 'go', 'rust', 'swift', 'kotlin'
  ];

  async analyzeFile(filePath: string, content: string): Promise<{
    issues: CodeIssue[];
    metrics: CodeMetrics;
    structure: CodeStructure;
  }> {
    const extension = path.extname(filePath).toLowerCase();
    const language = this.getLanguageFromExtension(extension);
    
    if (!this.supportedLanguages.includes(language)) {
      return {
        issues: [],
        metrics: this.calculateBasicMetrics(content),
        structure: this.extractBasicStructure(content, language),
      };
    }

    const issues = await this.lintCode(content, language, filePath);
    const metrics = this.calculateMetrics(content, language);
    const structure = this.extractStructure(content, language);

    return { issues, metrics, structure };
  }

  private getLanguageFromExtension(extension: string): string {
    const languageMap: Record<string, string> = {
      '.js': 'javascript',
      '.jsx': 'jsx',
      '.ts': 'typescript',
      '.tsx': 'tsx',
      '.py': 'python',
      '.java': 'java',
      '.cpp': 'cpp',
      '.cc': 'cpp',
      '.cxx': 'cpp',
      '.c': 'c',
      '.php': 'php',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
      '.swift': 'swift',
      '.kt': 'kotlin',
    };
    return languageMap[extension] || 'text';
  }

  private async lintCode(content: string, language: string, filePath: string): Promise<CodeIssue[]> {
    const issues: CodeIssue[] = [];
    
    // Basic syntax checking for different languages
    switch (language) {
      case 'javascript':
      case 'typescript':
      case 'jsx':
      case 'tsx':
        issues.push(...this.lintJavaScript(content, filePath));
        break;
      case 'python':
        issues.push(...this.lintPython(content, filePath));
        break;
      case 'java':
        issues.push(...this.lintJava(content, filePath));
        break;
      case 'cpp':
      case 'c':
        issues.push(...this.lintCpp(content, filePath));
        break;
    }

    return issues;
  }

  private lintJavaScript(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for common issues
      if (line.includes('console.log') && !line.includes('//')) {
        issues.push({
          line: lineNumber,
          column: line.indexOf('console.log'),
          message: 'Consider removing console.log statements in production code',
          severity: 'warning',
          rule: 'no-console',
          source: filePath,
        });
      }

      if (line.includes('==') && !line.includes('===')) {
        issues.push({
          line: lineNumber,
          column: line.indexOf('=='),
          message: 'Use strict equality (===) instead of loose equality (==)',
          severity: 'warning',
          rule: 'eqeqeq',
          source: filePath,
        });
      }

      if (line.includes('var ') && !line.includes('//')) {
        issues.push({
          line: lineNumber,
          column: line.indexOf('var'),
          message: 'Use let or const instead of var',
          severity: 'warning',
          rule: 'no-var',
          source: filePath,
        });
      }

      // Check for missing semicolons
      if (line.trim() && !line.trim().endsWith(';') && !line.trim().endsWith('{') && 
          !line.trim().endsWith('}') && !line.trim().endsWith(',') && 
          !line.trim().startsWith('//') && !line.trim().startsWith('*') &&
          !line.trim().startsWith('/*') && !line.trim().startsWith('*/')) {
        issues.push({
          line: lineNumber,
          column: line.length,
          message: 'Missing semicolon',
          severity: 'warning',
          rule: 'semi',
          source: filePath,
        });
      }
    });

    return issues;
  }

  private lintPython(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for common Python issues
      if (line.includes('print(') && !line.includes('#')) {
        issues.push({
          line: lineNumber,
          column: line.indexOf('print('),
          message: 'Consider using logging instead of print statements',
          severity: 'info',
          rule: 'no-print',
          source: filePath,
        });
      }

      if (line.includes('import *')) {
        issues.push({
          line: lineNumber,
          column: line.indexOf('import *'),
          message: 'Avoid wildcard imports',
          severity: 'warning',
          rule: 'no-wildcard-import',
          source: filePath,
        });
      }
    });

    return issues;
  }

  private lintJava(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for common Java issues
      if (line.includes('System.out.println') && !line.includes('//')) {
        issues.push({
          line: lineNumber,
          column: line.indexOf('System.out.println'),
          message: 'Consider using a proper logging framework',
          severity: 'info',
          rule: 'no-sysout',
          source: filePath,
        });
      }
    });

    return issues;
  }

  private lintCpp(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for common C++ issues
      if (line.includes('using namespace std') && !line.includes('//')) {
        issues.push({
          line: lineNumber,
          column: line.indexOf('using namespace std'),
          message: 'Avoid using namespace std in header files',
          severity: 'warning',
          rule: 'no-using-namespace-std',
          source: filePath,
        });
      }
    });

    return issues;
  }

  private calculateMetrics(content: string, language: string): CodeMetrics {
    const lines = content.split('\n');
    let linesOfCode = 0;
    let linesOfComments = 0;
    let linesOfBlank = 0;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed === '') {
        linesOfBlank++;
      } else if (this.isCommentLine(trimmed, language)) {
        linesOfComments++;
      } else {
        linesOfCode++;
      }
    });

    const cyclomaticComplexity = this.calculateCyclomaticComplexity(content, language);
    const maintainabilityIndex = this.calculateMaintainabilityIndex(linesOfCode, cyclomaticComplexity);
    const technicalDebt = this.calculateTechnicalDebt(linesOfCode, cyclomaticComplexity);

    return {
      linesOfCode,
      linesOfComments,
      linesOfBlank,
      totalLines: lines.length,
      cyclomaticComplexity,
      maintainabilityIndex,
      technicalDebt,
    };
  }

  private calculateBasicMetrics(content: string): CodeMetrics {
    const lines = content.split('\n');
    const linesOfCode = lines.filter(line => line.trim() !== '').length;
    
    return {
      linesOfCode,
      linesOfComments: 0,
      linesOfBlank: lines.length - linesOfCode,
      totalLines: lines.length,
      cyclomaticComplexity: 1,
      maintainabilityIndex: 100,
      technicalDebt: 0,
    };
  }

  private isCommentLine(line: string, language: string): boolean {
    const commentPatterns: Record<string, RegExp> = {
      javascript: /^(\/\/|\/\*|\*)/,
      typescript: /^(\/\/|\/\*|\*)/,
      jsx: /^(\/\/|\/\*|\*)/,
      tsx: /^(\/\/|\/\*|\*)/,
      python: /^#/,
      java: /^(\/\/|\/\*|\*)/,
      cpp: /^(\/\/|\/\*|\*)/,
      c: /^(\/\/|\/\*|\*)/,
      php: /^(\/\/|\/\*|\*|#)/,
      ruby: /^#/,
      go: /^\/\//,
      rust: /^(\/\/|\/\*|\*)/,
    };

    const pattern = commentPatterns[language];
    return pattern ? pattern.test(line) : false;
  }

  private calculateCyclomaticComplexity(content: string, language: string): number {
    let complexity = 1; // Base complexity

    const complexityKeywords = [
      'if', 'else', 'while', 'for', 'switch', 'case', 'catch', '&&', '||',
      '?', ':', 'try', 'finally', 'do'
    ];

    const lines = content.split('\n');
    lines.forEach(line => {
      complexityKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        const matches = line.match(regex);
        if (matches) {
          complexity += matches.length;
        }
      });
    });

    return complexity;
  }

  private calculateMaintainabilityIndex(linesOfCode: number, cyclomaticComplexity: number): number {
    // Simplified maintainability index calculation
    const halsteadVolume = linesOfCode * Math.log2(linesOfCode + 1);
    const maintainabilityIndex = Math.max(0, 100 - (halsteadVolume / 100) - (cyclomaticComplexity * 2));
    return Math.round(maintainabilityIndex);
  }

  private calculateTechnicalDebt(linesOfCode: number, cyclomaticComplexity: number): number {
    // Simplified technical debt calculation (in minutes)
    const baseDebt = linesOfCode * 0.1;
    const complexityDebt = cyclomaticComplexity * 5;
    return Math.round(baseDebt + complexityDebt);
  }

  private extractStructure(content: string, language: string): CodeStructure {
    const functions: CodeStructure['functions'] = [];
    const classes: CodeStructure['classes'] = [];
    const imports: CodeStructure['imports'] = [];
    const exports: CodeStructure['exports'] = [];

    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmed = line.trim();

      // Extract functions
      if (language === 'javascript' || language === 'typescript') {
        const functionMatch = trimmed.match(/function\s+(\w+)\s*\(([^)]*)\)/);
        if (functionMatch) {
          functions.push({
            name: functionMatch[1],
            line: lineNumber,
            parameters: functionMatch[2].split(',').map(p => p.trim()).filter(p => p),
            complexity: this.calculateCyclomaticComplexity(line, language),
          });
        }

        const arrowFunctionMatch = trimmed.match(/(\w+)\s*=\s*\(([^)]*)\)\s*=>/);
        if (arrowFunctionMatch) {
          functions.push({
            name: arrowFunctionMatch[1],
            line: lineNumber,
            parameters: arrowFunctionMatch[2].split(',').map(p => p.trim()).filter(p => p),
            complexity: this.calculateCyclomaticComplexity(line, language),
          });
        }
      }

      // Extract imports
      if (trimmed.startsWith('import ')) {
        const importMatch = trimmed.match(/import\s+(?:(\w+)|{([^}]+)}|(\* as \w+))\s+from\s+['"]([^'"]+)['"]/);
        if (importMatch) {
          imports.push({
            source: importMatch[4],
            line: lineNumber,
            type: importMatch[1] ? 'default' : importMatch[3] ? 'namespace' : 'named',
            names: importMatch[2] ? importMatch[2].split(',').map(n => n.trim()) : [importMatch[1] || importMatch[3]],
          });
        }
      }

      // Extract exports
      if (trimmed.startsWith('export ')) {
        const exportMatch = trimmed.match(/export\s+(?:default\s+)?(?:function\s+(\w+)|const\s+(\w+)|let\s+(\w+)|var\s+(\w+)|class\s+(\w+)|{([^}]+)}|(\w+))/);
        if (exportMatch) {
          const name = exportMatch[1] || exportMatch[2] || exportMatch[3] || exportMatch[4] || exportMatch[5] || exportMatch[7];
          exports.push({
            name: name || 'unnamed',
            line: lineNumber,
            type: trimmed.includes('default') ? 'default' : 'named',
          });
        }
      }
    });

    return { functions, classes, imports, exports };
  }

  private extractBasicStructure(content: string, language: string): CodeStructure {
    return {
      functions: [],
      classes: [],
      imports: [],
      exports: [],
    };
  }
}
