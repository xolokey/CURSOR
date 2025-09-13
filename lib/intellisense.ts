import { promises as fs } from 'fs';
import path from 'path';
import * as ts from 'typescript';

export interface IntelliSenseItem {
  label: string;
  kind: 'function' | 'class' | 'interface' | 'variable' | 'method' | 'property' | 'keyword' | 'module';
  detail?: string;
  documentation?: string;
  insertText?: string;
  sortText?: string;
  filterText?: string;
  range?: {
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
  };
}

export interface HoverInfo {
  contents: string;
  range?: {
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
  };
}

export interface DefinitionInfo {
  uri: string;
  range: {
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
  };
}

export interface ReferenceInfo {
  uri: string;
  range: {
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
  };
}

export class IntelliSenseProvider {
  private projectRoot: string;
  private program: ts.Program | null = null;
  private checker: ts.TypeChecker | null = null;
  private sourceFiles: Map<string, ts.SourceFile> = new Map();

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  async initialize(): Promise<void> {
    try {
      const configPath = ts.findConfigFile(this.projectRoot, ts.sys.fileExists, 'tsconfig.json');
      if (!configPath) {
        throw new Error('No tsconfig.json found');
      }

      const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
      const parsedConfig = ts.parseJsonConfigFileContent(
        configFile.config,
        ts.sys,
        path.dirname(configPath)
      );

      this.program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
      this.checker = this.program.getTypeChecker();

      // Cache source files
      for (const sourceFile of this.program.getSourceFiles()) {
        this.sourceFiles.set(sourceFile.fileName, sourceFile);
      }
    } catch (error) {
      console.error('Failed to initialize IntelliSense:', error);
    }
  }

  async getCompletions(
    filePath: string,
    line: number,
    column: number
  ): Promise<IntelliSenseItem[]> {
    if (!this.program || !this.checker) {
      return [];
    }

    try {
      const sourceFile = this.sourceFiles.get(filePath);
      if (!sourceFile) {
        return [];
      }

      const position = sourceFile.getPositionOfLineAndCharacter(line, column);
      const completions: IntelliSenseItem[] = [];

      // Get global completions
      const globalCompletions = this.getGlobalCompletions();
      completions.push(...globalCompletions);

      // Get local completions
      const localCompletions = this.getLocalCompletions(sourceFile, position);
      completions.push(...localCompletions);

      // Get import completions
      const importCompletions = await this.getImportCompletions(filePath);
      completions.push(...importCompletions);

      return completions.sort((a, b) => (a.sortText || a.label).localeCompare(b.sortText || b.label));
    } catch (error) {
      console.error('Error getting completions:', error);
      return [];
    }
  }

  async getHoverInfo(
    filePath: string,
    line: number,
    column: number
  ): Promise<HoverInfo | null> {
    if (!this.program || !this.checker) {
      return null;
    }

    try {
      const sourceFile = this.sourceFiles.get(filePath);
      if (!sourceFile) {
        return null;
      }

      const position = sourceFile.getPositionOfLineAndCharacter(line, column);
      const node = this.getNodeAtPosition(sourceFile, position);

      if (!node) {
        return null;
      }

      const symbol = this.checker.getSymbolAtLocation(node);
      if (!symbol) {
        return null;
      }

      const type = this.checker.getTypeOfSymbolAtLocation(symbol, node);
      const documentation = this.getDocumentation(symbol);
      const typeString = this.checker.typeToString(type);

      return {
        contents: `**${symbol.name}**: ${typeString}\n\n${documentation}`,
        range: {
          startLine: sourceFile.getLineAndCharacterOfPosition(node.getStart()).line,
          endLine: sourceFile.getLineAndCharacterOfPosition(node.getEnd()).line,
          startColumn: sourceFile.getLineAndCharacterOfPosition(node.getStart()).character,
          endColumn: sourceFile.getLineAndCharacterOfPosition(node.getEnd()).character,
        },
      };
    } catch (error) {
      console.error('Error getting hover info:', error);
      return null;
    }
  }

  async getDefinition(
    filePath: string,
    line: number,
    column: number
  ): Promise<DefinitionInfo | null> {
    if (!this.program || !this.checker) {
      return null;
    }

    try {
      const sourceFile = this.sourceFiles.get(filePath);
      if (!sourceFile) {
        return null;
      }

      const position = sourceFile.getPositionOfLineAndCharacter(line, column);
      const node = this.getNodeAtPosition(sourceFile, position);

      if (!node) {
        return null;
      }

      const symbol = this.checker.getSymbolAtLocation(node);
      if (!symbol || !symbol.valueDeclaration) {
        return null;
      }

      const declaration = symbol.valueDeclaration;
      const declarationFile = declaration.getSourceFile();
      const { line: defLine, character: defColumn } = declarationFile.getLineAndCharacterOfPosition(declaration.getStart());

      return {
        uri: declarationFile.fileName,
        range: {
          startLine: defLine,
          endLine: defLine,
          startColumn: defColumn,
          endColumn: defColumn + declaration.getWidth(),
        },
      };
    } catch (error) {
      console.error('Error getting definition:', error);
      return null;
    }
  }

  async getReferences(
    filePath: string,
    line: number,
    column: number
  ): Promise<ReferenceInfo[]> {
    if (!this.program || !this.checker) {
      return [];
    }

    try {
      const sourceFile = this.sourceFiles.get(filePath);
      if (!sourceFile) {
        return [];
      }

      const position = sourceFile.getPositionOfLineAndCharacter(line, column);
      const node = this.getNodeAtPosition(sourceFile, position);

      if (!node) {
        return [];
      }

      const symbol = this.checker.getSymbolAtLocation(node);
      if (!symbol) {
        return [];
      }

      const references: ReferenceInfo[] = [];

      // Find references across all source files
      for (const [fileName, sourceFile] of this.sourceFiles) {
        const referencesInFile = this.findReferencesInFile(sourceFile, symbol);
        references.push(...referencesInFile);
      }

      return references;
    } catch (error) {
      console.error('Error getting references:', error);
      return [];
    }
  }

  private getGlobalCompletions(): IntelliSenseItem[] {
    return [
      {
        label: 'console',
        kind: 'variable',
        detail: 'Console API',
        documentation: 'Provides access to the browser\'s debugging console.',
      },
      {
        label: 'window',
        kind: 'variable',
        detail: 'Window object',
        documentation: 'The global window object.',
      },
      {
        label: 'document',
        kind: 'variable',
        detail: 'Document object',
        documentation: 'The document object representing the web page.',
      },
      {
        label: 'setTimeout',
        kind: 'function',
        detail: 'setTimeout(callback, delay)',
        documentation: 'Calls a function after a specified delay.',
      },
      {
        label: 'setInterval',
        kind: 'function',
        detail: 'setInterval(callback, delay)',
        documentation: 'Calls a function repeatedly with a fixed delay.',
      },
      {
        label: 'Promise',
        kind: 'class',
        detail: 'Promise constructor',
        documentation: 'Represents the eventual completion of an asynchronous operation.',
      },
      {
        label: 'fetch',
        kind: 'function',
        detail: 'fetch(url, options)',
        documentation: 'Makes a network request and returns a Promise.',
      },
    ];
  }

  private getLocalCompletions(sourceFile: ts.SourceFile, position: number): IntelliSenseItem[] {
    const completions: IntelliSenseItem[] = [];

    // This is a simplified implementation
    // In a real implementation, you would traverse the AST to find local variables, functions, etc.

    return completions;
  }

  private async getImportCompletions(filePath: string): Promise<IntelliSenseItem[]> {
    const completions: IntelliSenseItem[] = [];

    try {
      // Get package.json dependencies
      const packageJsonPath = path.join(this.projectRoot, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

      for (const [name, version] of Object.entries(dependencies)) {
        completions.push({
          label: name,
          kind: 'module',
          detail: `import from '${name}'`,
          documentation: `Import from ${name} (${version})`,
        });
      }
    } catch (error) {
      console.error('Error getting import completions:', error);
    }

    return completions;
  }

  private getNodeAtPosition(sourceFile: ts.SourceFile, position: number): ts.Node | null {
    let node: ts.Node | null = sourceFile;

    const visit = (n: ts.Node): ts.Node | null => {
      if (n.getStart() <= position && position < n.getEnd()) {
        node = n;
        ts.forEachChild(n, visit);
      }
      return null;
    };

    ts.forEachChild(sourceFile, visit);
    return node;
  }

  private getDocumentation(symbol: ts.Symbol): string {
    if (!symbol.valueDeclaration) return '';
    
    const sourceFile = symbol.valueDeclaration.getSourceFile();
    const fullText = sourceFile.getFullText();
    const start = symbol.valueDeclaration.getFullStart();
    const end = symbol.valueDeclaration.getStart();
    
    // Extract JSDoc comments before the declaration
    const beforeDeclaration = fullText.substring(0, end);
    const jsdocMatch = beforeDeclaration.match(/\*\/\s*\/\*\*[\s\S]*?\*\//g);
    
    if (jsdocMatch && jsdocMatch.length > 0) {
      return jsdocMatch[jsdocMatch.length - 1];
    }
    
    return '';
  }

  private findReferencesInFile(sourceFile: ts.SourceFile, symbol: ts.Symbol): ReferenceInfo[] {
    const references: ReferenceInfo[] = [];

    const visit = (node: ts.Node) => {
      if (ts.isIdentifier(node)) {
        const nodeSymbol = this.checker?.getSymbolAtLocation(node);
        if (nodeSymbol && nodeSymbol === symbol) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
          references.push({
            uri: sourceFile.fileName,
            range: {
              startLine: line,
              endLine: line,
              startColumn: character,
              endColumn: character + node.getWidth(),
            },
          });
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
    return references;
  }
}
