// Cursor Themes Manager
export interface CursorTheme {
  id: string;
  name: string;
  description: string;
  category: 'gaming' | 'creative' | 'professional' | 'accessibility' | 'custom';
  cursors: {
    default: string;
    pointer: string;
    text: string;
    crosshair: string;
    grab: string;
    grabbing: string;
    notAllowed: string;
    wait: string;
    help: string;
    resize: string;
    move: string;
    copy: string;
    alias: string;
    zoomIn: string;
    zoomOut: string;
  };
  effects: string[];
  animations: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  settings: {
    scale: number;
    opacity: number;
    trail: boolean;
    effects: boolean;
    animations: boolean;
  };
}

export class CursorThemeManager {
  private themes: Map<string, CursorTheme> = new Map();
  private currentTheme: string = 'default';

  constructor() {
    this.initializeDefaultThemes();
  }

  private initializeDefaultThemes(): void {
    // Default Professional Theme
    this.addTheme({
      id: 'default',
      name: 'Default Professional',
      description: 'Clean, professional cursors for development work',
      category: 'professional',
      cursors: {
        default: 'default',
        pointer: 'pointer',
        text: 'text',
        crosshair: 'crosshair',
        grab: 'grab',
        grabbing: 'grabbing',
        notAllowed: 'not-allowed',
        wait: 'wait',
        help: 'help',
        resize: 'resize',
        move: 'move',
        copy: 'copy',
        alias: 'alias',
        zoomIn: 'zoom-in',
        zoomOut: 'zoom-out'
      },
      effects: ['glow', 'pulse'],
      animations: ['smooth'],
      colors: {
        primary: '#007acc',
        secondary: '#cccccc',
        accent: '#ff6b6b',
        background: '#1e1e1e'
      },
      settings: {
        scale: 1,
        opacity: 1,
        trail: false,
        effects: true,
        animations: true
      }
    });

    // Gaming Theme
    this.addTheme({
      id: 'gaming',
      name: 'Gaming Pro',
      description: 'High-performance cursors optimized for gaming',
      category: 'gaming',
      cursors: {
        default: 'gaming-crosshair',
        pointer: 'gaming-pointer',
        text: 'gaming-text',
        crosshair: 'gaming-crosshair',
        grab: 'gaming-grab',
        grabbing: 'gaming-grabbing',
        notAllowed: 'gaming-blocked',
        wait: 'gaming-loading',
        help: 'gaming-help',
        resize: 'gaming-resize',
        move: 'gaming-move',
        copy: 'gaming-copy',
        alias: 'gaming-alias',
        zoomIn: 'gaming-zoom-in',
        zoomOut: 'gaming-zoom-out'
      },
      effects: ['sparkles', 'fire', 'neon-trail'],
      animations: ['pulse', 'spin'],
      colors: {
        primary: '#00ff00',
        secondary: '#ffffff',
        accent: '#ff0000',
        background: '#000000'
      },
      settings: {
        scale: 1.2,
        opacity: 1,
        trail: true,
        effects: true,
        animations: true
      }
    });

    // Creative Theme
    this.addTheme({
      id: 'creative',
      name: 'Creative Studio',
      description: 'Artistic cursors for creative professionals',
      category: 'creative',
      cursors: {
        default: 'creative-brush',
        pointer: 'creative-pointer',
        text: 'creative-text',
        crosshair: 'creative-crosshair',
        grab: 'creative-grab',
        grabbing: 'creative-grabbing',
        notAllowed: 'creative-blocked',
        wait: 'creative-loading',
        help: 'creative-help',
        resize: 'creative-resize',
        move: 'creative-move',
        copy: 'creative-copy',
        alias: 'creative-alias',
        zoomIn: 'creative-zoom-in',
        zoomOut: 'creative-zoom-out'
      },
      effects: ['rainbow-trail', 'water-ripple', 'aura-glow'],
      animations: ['breathing', 'glow'],
      colors: {
        primary: '#ff6b6b',
        secondary: '#4ecdc4',
        accent: '#ffe66d',
        background: '#2c3e50'
      },
      settings: {
        scale: 1.1,
        opacity: 0.9,
        trail: true,
        effects: true,
        animations: true
      }
    });

    // Accessibility Theme
    this.addTheme({
      id: 'accessibility',
      name: 'High Contrast',
      description: 'High-contrast cursors for better visibility',
      category: 'accessibility',
      cursors: {
        default: 'accessibility-default',
        pointer: 'accessibility-pointer',
        text: 'accessibility-text',
        crosshair: 'accessibility-crosshair',
        grab: 'accessibility-grab',
        grabbing: 'accessibility-grabbing',
        notAllowed: 'accessibility-blocked',
        wait: 'accessibility-loading',
        help: 'accessibility-help',
        resize: 'accessibility-resize',
        move: 'accessibility-move',
        copy: 'accessibility-copy',
        alias: 'accessibility-alias',
        zoomIn: 'accessibility-zoom-in',
        zoomOut: 'accessibility-zoom-out'
      },
      effects: ['glow'],
      animations: ['pulse'],
      colors: {
        primary: '#ffff00',
        secondary: '#ffffff',
        accent: '#ff0000',
        background: '#000000'
      },
      settings: {
        scale: 2,
        opacity: 1,
        trail: false,
        effects: true,
        animations: false
      }
    });
  }

  addTheme(theme: CursorTheme): void {
    this.themes.set(theme.id, theme);
  }

  removeTheme(id: string): void {
    this.themes.delete(id);
  }

  getTheme(id: string): CursorTheme | undefined {
    return this.themes.get(id);
  }

  getAllThemes(): CursorTheme[] {
    return Array.from(this.themes.values());
  }

  getThemesByCategory(category: string): CursorTheme[] {
    return Array.from(this.themes.values()).filter(theme => theme.category === category);
  }

  setCurrentTheme(id: string): boolean {
    if (this.themes.has(id)) {
      this.currentTheme = id;
      return true;
    }
    return false;
  }

  getCurrentTheme(): CursorTheme | undefined {
    return this.themes.get(this.currentTheme);
  }

  getCurrentThemeId(): string {
    return this.currentTheme;
  }

  exportTheme(id: string): string {
    const theme = this.themes.get(id);
    if (!theme) return '';
    return JSON.stringify(theme, null, 2);
  }

  importTheme(themeData: string): boolean {
    try {
      const theme: CursorTheme = JSON.parse(themeData);
      if (theme.id && theme.name && theme.cursors) {
        this.addTheme(theme);
        return true;
      }
    } catch (error) {
      console.error('Failed to import theme:', error);
    }
    return false;
  }

  createCustomTheme(baseThemeId: string, customizations: Partial<CursorTheme>): CursorTheme | null {
    const baseTheme = this.themes.get(baseThemeId);
    if (!baseTheme) return null;

    const customTheme: CursorTheme = {
      ...baseTheme,
      ...customizations,
      id: `custom-${Date.now()}`,
      category: 'custom'
    };

    this.addTheme(customTheme);
    return customTheme;
  }
}
