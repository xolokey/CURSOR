import { promises as fs } from 'fs';
import path from 'path';

export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  publisher: string;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords: string[];
  categories: string[];
  icon?: string;
  readme?: string;
  changelog?: string;
  installed: boolean;
  enabled: boolean;
  dependencies: string[];
  activationEvents: string[];
  main: string;
  contributes?: {
    commands?: ExtensionCommand[];
    keybindings?: ExtensionKeybinding[];
    menus?: ExtensionMenu[];
    languages?: ExtensionLanguage[];
    themes?: ExtensionTheme[];
    grammars?: ExtensionGrammar[];
    snippets?: ExtensionSnippet[];
    views?: ExtensionView[];
    configuration?: ExtensionConfiguration;
  };
}

export interface ExtensionCommand {
  command: string;
  title: string;
  category?: string;
  icon?: string;
}

export interface ExtensionKeybinding {
  command: string;
  key: string;
  when?: string;
  mac?: string;
  linux?: string;
  win?: string;
}

export interface ExtensionMenu {
  command: string;
  when?: string;
  group?: string;
}

export interface ExtensionLanguage {
  id: string;
  aliases: string[];
  extensions: string[];
  configuration: string;
}

export interface ExtensionTheme {
  label: string;
  uiTheme: 'vs' | 'vs-dark' | 'hc-black';
  path: string;
}

export interface ExtensionGrammar {
  language: string;
  scopeName: string;
  path: string;
}

export interface ExtensionSnippet {
  language: string;
  path: string;
}

export interface ExtensionView {
  id: string;
  name: string;
  when?: string;
}

export interface ExtensionConfiguration {
  title: string;
  properties: Record<string, any>;
}

export interface ExtensionManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  publisher: string;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords: string[];
  categories: string[];
  icon?: string;
  readme?: string;
  changelog?: string;
  main: string;
  activationEvents: string[];
  contributes?: any;
}

export class ExtensionManager {
  private extensions: Map<string, Extension> = new Map();
  private extensionsPath: string;
  private installedExtensions: Set<string> = new Set();

  constructor(extensionsPath: string) {
    this.extensionsPath = extensionsPath;
  }

  async initialize(): Promise<void> {
    await this.loadInstalledExtensions();
    await this.loadMarketplaceExtensions();
  }

  async installExtension(extensionId: string): Promise<void> {
    try {
      const extension = this.extensions.get(extensionId);
      if (!extension) {
        throw new Error('Extension not found');
      }

      // Create extension directory
      const extensionDir = path.join(this.extensionsPath, extensionId);
      await fs.mkdir(extensionDir, { recursive: true });

      // Download and extract extension (simplified)
      await this.downloadExtension(extension, extensionDir);

      // Mark as installed
      extension.installed = true;
      this.installedExtensions.add(extensionId);

      // Save extension state
      await this.saveExtensionState();

      console.log(`Installed extension: ${extension.name}`);
    } catch (error) {
      console.error('Failed to install extension:', error);
      throw error;
    }
  }

  async uninstallExtension(extensionId: string): Promise<void> {
    try {
      const extension = this.extensions.get(extensionId);
      if (!extension) {
        throw new Error('Extension not found');
      }

      // Remove extension directory
      const extensionDir = path.join(this.extensionsPath, extensionId);
      await fs.rmdir(extensionDir, { recursive: true });

      // Mark as uninstalled
      extension.installed = false;
      this.installedExtensions.delete(extensionId);

      // Save extension state
      await this.saveExtensionState();

      console.log(`Uninstalled extension: ${extension.name}`);
    } catch (error) {
      console.error('Failed to uninstall extension:', error);
      throw error;
    }
  }

  async enableExtension(extensionId: string): Promise<void> {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      throw new Error('Extension not found');
    }

    extension.enabled = true;
    await this.saveExtensionState();
  }

  async disableExtension(extensionId: string): Promise<void> {
    const extension = this.extensions.get(extensionId);
    if (!extension) {
      throw new Error('Extension not found');
    }

    extension.enabled = false;
    await this.saveExtensionState();
  }

  async searchExtensions(query: string, category?: string): Promise<Extension[]> {
    let results = Array.from(this.extensions.values());

    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(ext => 
        ext.name.toLowerCase().includes(searchTerm) ||
        ext.description.toLowerCase().includes(searchTerm) ||
        ext.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    }

    if (category) {
      results = results.filter(ext => ext.categories.includes(category));
    }

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  getExtension(extensionId: string): Extension | undefined {
    return this.extensions.get(extensionId);
  }

  getAllExtensions(): Extension[] {
    return Array.from(this.extensions.values());
  }

  getInstalledExtensions(): Extension[] {
    return Array.from(this.extensions.values()).filter(ext => ext.installed);
  }

  getEnabledExtensions(): Extension[] {
    return Array.from(this.extensions.values()).filter(ext => ext.enabled);
  }

  getExtensionsByCategory(category: string): Extension[] {
    return Array.from(this.extensions.values()).filter(ext => 
      ext.categories.includes(category)
    );
  }

  async createExtension(manifest: ExtensionManifest): Promise<Extension> {
    const extension: Extension = {
      id: `${manifest.publisher}.${manifest.name}`,
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author,
      publisher: manifest.publisher,
      homepage: manifest.homepage,
      repository: manifest.repository,
      license: manifest.license,
      keywords: manifest.keywords,
      categories: manifest.categories,
      icon: manifest.icon,
      readme: manifest.readme,
      changelog: manifest.changelog,
      installed: false,
      enabled: false,
      dependencies: [],
      activationEvents: manifest.activationEvents,
      main: manifest.main,
      contributes: manifest.contributes,
    };

    this.extensions.set(extension.id, extension);
    return extension;
  }

  private async loadInstalledExtensions(): Promise<void> {
    try {
      const stateFile = path.join(this.extensionsPath, 'extensions.json');
      const stateData = await fs.readFile(stateFile, 'utf-8');
      const state = JSON.parse(stateData);
      
      this.installedExtensions = new Set(state.installed || []);
    } catch (error) {
      // State file doesn't exist, start fresh
      this.installedExtensions = new Set();
    }
  }

  private async loadMarketplaceExtensions(): Promise<void> {
    // Load some popular extensions
    const popularExtensions = [
      {
        id: 'ms-vscode.vscode-typescript-next',
        name: 'TypeScript and JavaScript Language Features',
        version: '5.0.0',
        description: 'Provides TypeScript and JavaScript language support',
        author: 'Microsoft',
        publisher: 'ms-vscode',
        keywords: ['typescript', 'javascript', 'language'],
        categories: ['Programming Languages'],
        installed: this.installedExtensions.has('ms-vscode.vscode-typescript-next'),
        enabled: true,
        dependencies: [],
        activationEvents: ['onLanguage:typescript', 'onLanguage:javascript'],
        main: 'dist/extension.js',
      },
      {
        id: 'esbenp.prettier-vscode',
        name: 'Prettier - Code formatter',
        version: '10.0.0',
        description: 'Code formatter using prettier',
        author: 'Prettier',
        publisher: 'esbenp',
        keywords: ['prettier', 'formatter', 'beautify'],
        categories: ['Formatters'],
        installed: this.installedExtensions.has('esbenp.prettier-vscode'),
        enabled: true,
        dependencies: [],
        activationEvents: ['onLanguage:javascript', 'onLanguage:typescript'],
        main: 'dist/extension.js',
      },
      {
        id: 'ms-python.python',
        name: 'Python',
        version: '2023.0.0',
        description: 'Python language support',
        author: 'Microsoft',
        publisher: 'ms-python',
        keywords: ['python', 'language'],
        categories: ['Programming Languages'],
        installed: this.installedExtensions.has('ms-python.python'),
        enabled: true,
        dependencies: [],
        activationEvents: ['onLanguage:python'],
        main: 'dist/extension.js',
      },
      {
        id: 'ms-vscode.vscode-json',
        name: 'JSON Language Features',
        version: '1.0.0',
        description: 'Provides JSON language support',
        author: 'Microsoft',
        publisher: 'ms-vscode',
        keywords: ['json', 'language'],
        categories: ['Programming Languages'],
        installed: this.installedExtensions.has('ms-vscode.vscode-json'),
        enabled: true,
        dependencies: [],
        activationEvents: ['onLanguage:json'],
        main: 'dist/extension.js',
      },
    ];

    for (const ext of popularExtensions) {
      this.extensions.set(ext.id, ext);
    }
  }

  private async downloadExtension(extension: Extension, targetDir: string): Promise<void> {
    // In a real implementation, this would download from a marketplace
    // For now, we'll just create a placeholder
    const manifestPath = path.join(targetDir, 'package.json');
    const manifest = {
      name: extension.name,
      version: extension.version,
      description: extension.description,
      main: extension.main,
      activationEvents: extension.activationEvents,
      contributes: extension.contributes,
    };

    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  }

  private async saveExtensionState(): Promise<void> {
    const stateFile = path.join(this.extensionsPath, 'extensions.json');
    const state = {
      installed: Array.from(this.installedExtensions),
      timestamp: Date.now(),
    };

    await fs.writeFile(stateFile, JSON.stringify(state, null, 2));
  }
}
