// Advanced Cursor Effects Library
export interface CursorEffectConfig {
  id: string;
  name: string;
  type: 'particle' | 'trail' | 'ripple' | 'glow' | 'pulse' | 'magnetic' | 'custom';
  intensity: number;
  duration: number;
  color: string;
  size: number;
  speed: number;
  gravity?: number;
  friction?: number;
  blendMode?: GlobalCompositeOperation;
  customRenderer?: (ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) => void;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  gravity?: number;
  friction?: number;
}

export class CursorEffectManager {
  private effects: Map<string, CursorEffectConfig> = new Map();
  private activeEffects: Map<string, { config: CursorEffectConfig; startTime: number; particles: Particle[] }> = new Map();
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrame: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    if (typeof window === 'undefined') return;
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.initializeDefaultEffects();
  }

  private initializeDefaultEffects(): void {
    // Particle effects
    this.addEffect({
      id: 'sparkles',
      name: 'Sparkles',
      type: 'particle',
      intensity: 1,
      duration: 1000,
      color: '#ffd700',
      size: 2,
      speed: 2,
      gravity: 0.1,
      friction: 0.98
    });

    this.addEffect({
      id: 'fire',
      name: 'Fire',
      type: 'particle',
      intensity: 1,
      duration: 800,
      color: '#ff4500',
      size: 3,
      speed: 1.5,
      gravity: -0.05,
      friction: 0.99
    });

    this.addEffect({
      id: 'smoke',
      name: 'Smoke',
      type: 'particle',
      intensity: 0.8,
      duration: 2000,
      color: '#808080',
      size: 4,
      speed: 0.5,
      gravity: -0.02,
      friction: 0.995
    });

    // Trail effects
    this.addEffect({
      id: 'rainbow-trail',
      name: 'Rainbow Trail',
      type: 'trail',
      intensity: 1,
      duration: 1500,
      color: '#ff0000',
      size: 3,
      speed: 1
    });

    this.addEffect({
      id: 'neon-trail',
      name: 'Neon Trail',
      type: 'trail',
      intensity: 1,
      duration: 1000,
      color: '#00ffff',
      size: 2,
      speed: 1.5
    });

    // Ripple effects
    this.addEffect({
      id: 'water-ripple',
      name: 'Water Ripple',
      type: 'ripple',
      intensity: 1,
      duration: 1200,
      color: '#0066cc',
      size: 20,
      speed: 1
    });

    this.addEffect({
      id: 'energy-ripple',
      name: 'Energy Ripple',
      type: 'ripple',
      intensity: 1,
      duration: 800,
      color: '#ff00ff',
      size: 15,
      speed: 1.5
    });

    // Glow effects
    this.addEffect({
      id: 'aura-glow',
      name: 'Aura Glow',
      type: 'glow',
      intensity: 1,
      duration: 2000,
      color: '#ffffff',
      size: 30,
      speed: 1
    });

    this.addEffect({
      id: 'electric-glow',
      name: 'Electric Glow',
      type: 'glow',
      intensity: 1,
      duration: 1500,
      color: '#00ffff',
      size: 25,
      speed: 1.2
    });

    // Pulse effects
    this.addEffect({
      id: 'heartbeat',
      name: 'Heartbeat',
      type: 'pulse',
      intensity: 1,
      duration: 1000,
      color: '#ff69b4',
      size: 20,
      speed: 1
    });

    this.addEffect({
      id: 'breathing',
      name: 'Breathing',
      type: 'pulse',
      intensity: 0.8,
      duration: 2000,
      color: '#87ceeb',
      size: 25,
      speed: 0.5
    });

    // Magnetic effects
    this.addEffect({
      id: 'magnetic-field',
      name: 'Magnetic Field',
      type: 'magnetic',
      intensity: 1,
      duration: 3000,
      color: '#ff0000',
      size: 40,
      speed: 1
    });

    this.addEffect({
      id: 'gravity-well',
      name: 'Gravity Well',
      type: 'magnetic',
      intensity: 1,
      duration: 2500,
      color: '#800080',
      size: 35,
      speed: 0.8
    });
  }

  addEffect(config: CursorEffectConfig): void {
    this.effects.set(config.id, config);
  }

  removeEffect(id: string): void {
    this.effects.delete(id);
    this.activeEffects.delete(id);
  }

  triggerEffect(id: string, x: number, y: number): void {
    const config = this.effects.get(id);
    if (!config) return;

    const particles: Particle[] = [];
    
    // Generate initial particles based on effect type
    switch (config.type) {
      case 'particle':
        particles.push(...this.generateParticles(config, x, y));
        break;
      case 'trail':
        particles.push(...this.generateTrailParticles(config, x, y));
        break;
      case 'ripple':
        particles.push(...this.generateRippleParticles(config, x, y));
        break;
      case 'glow':
        particles.push(...this.generateGlowParticles(config, x, y));
        break;
      case 'pulse':
        particles.push(...this.generatePulseParticles(config, x, y));
        break;
      case 'magnetic':
        particles.push(...this.generateMagneticParticles(config, x, y));
        break;
    }

    this.activeEffects.set(id, {
      config,
      startTime: Date.now(),
      particles
    });

    if (!this.animationFrame) {
      this.startAnimation();
    }
  }

  private generateParticles(config: CursorEffectConfig, x: number, y: number): Particle[] {
    const particles: Particle[] = [];
    const count = Math.floor(config.intensity * 20);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const velocity = config.speed * (0.5 + Math.random() * 0.5);
      
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: config.duration,
        maxLife: config.duration,
        size: config.size * (0.5 + Math.random() * 0.5),
        color: config.color,
        alpha: 1,
        gravity: config.gravity,
        friction: config.friction
      });
    }

    return particles;
  }

  private generateTrailParticles(config: CursorEffectConfig, x: number, y: number): Particle[] {
    const particles: Particle[] = [];
    const count = Math.floor(config.intensity * 10);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        life: config.duration * (0.5 + Math.random() * 0.5),
        maxLife: config.duration,
        size: config.size,
        color: this.getRainbowColor(i / count),
        alpha: 0.8,
        friction: 0.95
      });
    }

    return particles;
  }

  private generateRippleParticles(config: CursorEffectConfig, x: number, y: number): Particle[] {
    const particles: Particle[] = [];
    const rings = 3;

    for (let ring = 0; ring < rings; ring++) {
      particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        life: config.duration,
        maxLife: config.duration,
        size: config.size + ring * 5,
        color: config.color,
        alpha: 1 - ring * 0.3,
        friction: 1
      });
    }

    return particles;
  }

  private generateGlowParticles(config: CursorEffectConfig, x: number, y: number): Particle[] {
    const particles: Particle[] = [];
    const count = Math.floor(config.intensity * 5);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * config.size,
        y: y + (Math.random() - 0.5) * config.size,
        vx: 0,
        vy: 0,
        life: config.duration,
        maxLife: config.duration,
        size: config.size * (0.3 + Math.random() * 0.7),
        color: config.color,
        alpha: 0.6 + Math.random() * 0.4,
        friction: 1
      });
    }

    return particles;
  }

  private generatePulseParticles(config: CursorEffectConfig, x: number, y: number): Particle[] {
    const particles: Particle[] = [];
    const count = Math.floor(config.intensity * 8);

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const radius = config.size * 0.5;
      
      particles.push({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * config.speed * 0.5,
        vy: Math.sin(angle) * config.speed * 0.5,
        life: config.duration,
        maxLife: config.duration,
        size: config.size * 0.3,
        color: config.color,
        alpha: 0.8,
        friction: 0.98
      });
    }

    return particles;
  }

  private generateMagneticParticles(config: CursorEffectConfig, x: number, y: number): Particle[] {
    const particles: Particle[] = [];
    const count = Math.floor(config.intensity * 15);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * config.size;
      
      particles.push({
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: -Math.cos(angle) * config.speed * 0.3,
        vy: -Math.sin(angle) * config.speed * 0.3,
        life: config.duration,
        maxLife: config.duration,
        size: config.size * 0.2,
        color: config.color,
        alpha: 0.7,
        friction: 0.99
      });
    }

    return particles;
  }

  private getRainbowColor(progress: number): string {
    const hue = progress * 360;
    return `hsl(${hue}, 100%, 50%)`;
  }

  private startAnimation(): void {
    const animate = () => {
      if (!this.ctx || !this.canvas) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      const currentTime = Date.now();
      const effectsToRemove: string[] = [];

      this.activeEffects.forEach((effect, id) => {
        const elapsed = currentTime - effect.startTime;
        const progress = elapsed / effect.config.duration;
        
        if (progress >= 1) {
          effectsToRemove.push(id);
          return;
        }

        this.renderEffect(effect, progress);
      });

      // Remove expired effects
      effectsToRemove.forEach(id => {
        this.activeEffects.delete(id);
      });

      if (this.activeEffects.size > 0) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.animationFrame = null;
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  private renderEffect(effect: { config: CursorEffectConfig; startTime: number; particles: Particle[] }, progress: number): void {
    if (!this.ctx) return;

    effect.particles.forEach(particle => {
      // Update particle physics
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.gravity) {
        particle.vy += particle.gravity;
      }
      
      if (particle.friction) {
        particle.vx *= particle.friction;
        particle.vy *= particle.friction;
      }

      // Update life
      particle.life -= 16; // Assuming 60fps
      particle.alpha = particle.life / particle.maxLife;

      if (particle.alpha <= 0) return;

      // Render particle based on effect type
      if (!this.ctx) return;
      
      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;
      this.ctx.globalCompositeOperation = effect.config.blendMode || 'source-over';
      
      if (effect.config.customRenderer) {
        effect.config.customRenderer(this.ctx, particle.x, particle.y, progress);
      } else {
        this.renderParticle(particle, effect.config, progress);
      }
      
      this.ctx.restore();
    });
  }

  private renderParticle(particle: Particle, config: CursorEffectConfig, progress: number): void {
    if (!this.ctx) return;

    switch (config.type) {
      case 'particle':
        this.renderParticleDot(particle, config);
        break;
      case 'trail':
        this.renderTrailParticle(particle, config, progress);
        break;
      case 'ripple':
        this.renderRippleParticle(particle, config, progress);
        break;
      case 'glow':
        this.renderGlowParticle(particle, config, progress);
        break;
      case 'pulse':
        this.renderPulseParticle(particle, config, progress);
        break;
      case 'magnetic':
        this.renderMagneticParticle(particle, config, progress);
        break;
    }
  }

  private renderParticleDot(particle: Particle, config: CursorEffectConfig): void {
    if (!this.ctx) return;

    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderTrailParticle(particle: Particle, config: CursorEffectConfig, progress: number): void {
    if (!this.ctx) return;

    const size = particle.size * (1 - progress);
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderRippleParticle(particle: Particle, config: CursorEffectConfig, progress: number): void {
    if (!this.ctx) return;

    const size = particle.size * progress;
    this.ctx.strokeStyle = particle.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  private renderGlowParticle(particle: Particle, config: CursorEffectConfig, progress: number): void {
    if (!this.ctx) return;

    const size = particle.size * (0.5 + 0.5 * Math.sin(progress * Math.PI * 4));
    this.ctx.shadowColor = particle.color;
    this.ctx.shadowBlur = 20;
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  private renderPulseParticle(particle: Particle, config: CursorEffectConfig, progress: number): void {
    if (!this.ctx) return;

    const pulse = Math.sin(progress * Math.PI * 6);
    const size = particle.size * (0.5 + 0.5 * pulse);
    this.ctx.fillStyle = particle.color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderMagneticParticle(particle: Particle, config: CursorEffectConfig, progress: number): void {
    if (!this.ctx) return;

    const size = particle.size * (1 - progress);
    this.ctx.strokeStyle = particle.color;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  // Public API
  getAvailableEffects(): CursorEffectConfig[] {
    return Array.from(this.effects.values());
  }

  getActiveEffects(): string[] {
    return Array.from(this.activeEffects.keys());
  }

  clearAllEffects(): void {
    this.activeEffects.clear();
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  destroy(): void {
    this.clearAllEffects();
    this.effects.clear();
  }
}
