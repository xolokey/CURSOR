// Advanced Cursor System - Comprehensive cursor functionality
export interface CursorState {
  x: number;
  y: number;
  isLocked: boolean;
  isVisible: boolean;
  currentCursor: string;
  scale: number;
  rotation: number;
  opacity: number;
  trail: CursorTrailPoint[];
  effects: CursorEffect[];
  context: CursorContext;
  hardwareAcceleration: boolean;
  highDPI: boolean;
  customCursors: Map<string, CustomCursor>;
  animations: Map<string, CursorAnimation>;
}

export interface CursorTrailPoint {
  x: number;
  y: number;
  timestamp: number;
  opacity: number;
  scale: number;
}

export interface CursorEffect {
  id: string;
  type: 'hover' | 'click' | 'drag' | 'scroll' | 'custom';
  animation: string;
  duration: number;
  intensity: number;
  color?: string;
  scale?: number;
}

export interface CursorContext {
  element: HTMLElement | null;
  type: 'text' | 'button' | 'link' | 'image' | 'video' | 'canvas' | 'game' | '3d' | 'vr' | 'ar';
  action: 'hover' | 'click' | 'drag' | 'scroll' | 'select' | 'grab' | 'zoom' | 'rotate';
  distance?: number;
  depth?: number;
  gesture?: string;
}

export interface CustomCursor {
  id: string;
  name: string;
  type: 'css' | 'svg' | 'png' | 'animated' | '3d';
  url?: string;
  data?: string;
  hotspot: { x: number; y: number };
  size: { width: number; height: number };
  frames?: string[];
  frameRate?: number;
  loop?: boolean;
}

export interface CursorAnimation {
  id: string;
  name: string;
  keyframes: CursorKeyframe[];
  duration: number;
  easing: string;
  loop: boolean;
  direction: 'normal' | 'reverse' | 'alternate';
}

export interface CursorKeyframe {
  offset: number;
  properties: {
    transform?: string;
    opacity?: number;
    scale?: number;
    rotation?: number;
    color?: string;
    filter?: string;
  };
}

export interface PointerLockOptions {
  element: HTMLElement;
  onLock?: () => void;
  onUnlock?: () => void;
  onMove?: (movementX: number, movementY: number) => void;
  onError?: (error: Error) => void;
}

export interface EyeTrackingOptions {
  enabled: boolean;
  calibration: boolean;
  dwellTime: number;
  onGaze?: (x: number, y: number) => void;
  onBlink?: () => void;
  onDwell?: (element: HTMLElement) => void;
}

export interface HandTrackingOptions {
  enabled: boolean;
  gestures: string[];
  onGesture?: (gesture: string, confidence: number) => void;
  onPinch?: (strength: number) => void;
  onGrab?: (strength: number) => void;
  onPoint?: (x: number, y: number) => void;
}

export interface VRAROptions {
  mode: 'vr' | 'ar' | 'mixed';
  headGaze: boolean;
  rayCasting: boolean;
  handTracking: boolean;
  onHeadGaze?: (x: number, y: number, z: number) => void;
  onRayHit?: (x: number, y: number, z: number, element: HTMLElement) => void;
  onHandGesture?: (gesture: string, hand: 'left' | 'right') => void;
}

export class AdvancedCursorSystem {
  private state: CursorState;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrame: number | null = null;
  private pointerLockElement: HTMLElement | null = null;
  private eyeTracking: EyeTrackingOptions | null = null;
  private handTracking: HandTrackingOptions | null = null;
  private vrAr: VRAROptions | null = null;
  private eventListeners: Map<string, (e: Event) => void> = new Map();
  private isInitialized = false;

  constructor() {
    this.state = {
      x: 0,
      y: 0,
      isLocked: false,
      isVisible: true,
      currentCursor: 'default',
      scale: 1,
      rotation: 0,
      opacity: 1,
      trail: [],
      effects: [],
      context: {
        element: null,
        type: 'text',
        action: 'hover'
      },
      hardwareAcceleration: true,
      highDPI: window.devicePixelRatio > 1,
      customCursors: new Map(),
      animations: new Map()
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Create cursor canvas
    this.createCursorCanvas();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize default cursors
    this.initializeDefaultCursors();
    
    // Set up hardware acceleration
    this.setupHardwareAcceleration();
    
    // Initialize high DPI support
    this.setupHighDPISupport();
    
    this.isInitialized = true;
  }

  private createCursorCanvas(): void {
    if (typeof window === 'undefined') return;
    
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'advanced-cursor-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    this.canvas.style.mixBlendMode = 'difference';
    
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d', {
      alpha: true,
      desynchronized: true
    });
    
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    if (!this.canvas || !this.ctx) return;
    
    const dpr = this.state.highDPI ? window.devicePixelRatio : 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;
    // Mouse movement
    const mouseMoveHandler = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      this.updatePosition(mouseEvent.clientX, mouseEvent.clientY);
      this.addTrailPoint(mouseEvent.clientX, mouseEvent.clientY);
      this.updateContext(mouseEvent.target as HTMLElement);
    };

    // Pointer lock events
    const pointerLockChangeHandler = () => {
      this.state.isLocked = document.pointerLockElement === this.pointerLockElement;
    };

    const pointerLockErrorHandler = (e: Event) => {
      console.error('Pointer lock error:', e);
    };

    // Mouse enter/leave
    const mouseEnterHandler = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      this.state.isVisible = true;
      this.updateContext(mouseEvent.target as HTMLElement);
    };

    const mouseLeaveHandler = () => {
      this.state.isVisible = false;
    };

    // Click effects
    const clickHandler = (e: Event) => {
      this.addEffect({
        id: `click-${Date.now()}`,
        type: 'click',
        animation: 'pulse',
        duration: 300,
        intensity: 1,
        scale: 1.2
      });
    };

    // Hover effects
    const mouseOverHandler = (e: Event) => {
      this.addEffect({
        id: `hover-${Date.now()}`,
        type: 'hover',
        animation: 'glow',
        duration: 200,
        intensity: 0.8
      });
    };

    // Wheel events
    const wheelHandler = (e: Event) => {
      const wheelEvent = e as WheelEvent;
      this.addEffect({
        id: `scroll-${Date.now()}`,
        type: 'scroll',
        animation: 'ripple',
        duration: 400,
        intensity: Math.abs(wheelEvent.deltaY) / 100
      });
    };

    // Register event listeners
    this.eventListeners.set('mousemove', mouseMoveHandler);
    this.eventListeners.set('pointerlockchange', pointerLockChangeHandler);
    this.eventListeners.set('pointerlockerror', pointerLockErrorHandler);
    this.eventListeners.set('mouseenter', mouseEnterHandler);
    this.eventListeners.set('mouseleave', mouseLeaveHandler);
    this.eventListeners.set('click', clickHandler);
    this.eventListeners.set('mouseover', mouseOverHandler);
    this.eventListeners.set('wheel', wheelHandler);

    // Add listeners
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('pointerlockchange', pointerLockChangeHandler);
    document.addEventListener('pointerlockerror', pointerLockErrorHandler);
    document.addEventListener('mouseenter', mouseEnterHandler);
    document.addEventListener('mouseleave', mouseLeaveHandler);
    document.addEventListener('click', clickHandler);
    document.addEventListener('mouseover', mouseOverHandler);
    document.addEventListener('wheel', wheelHandler);
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private updatePosition(x: number, y: number): void {
    this.state.x = x;
    this.state.y = y;
  }

  private addTrailPoint(x: number, y: number): void {
    const point: CursorTrailPoint = {
      x,
      y,
      timestamp: Date.now(),
      opacity: 1,
      scale: 1
    };

    this.state.trail.push(point);

    // Limit trail length
    if (this.state.trail.length > 20) {
      this.state.trail.shift();
    }
  }

  private updateContext(element: HTMLElement | null): void {
    if (!element) return;

    this.state.context.element = element;

    // Determine context type
    const tagName = element.tagName.toLowerCase();
    const className = element.className;
    
    if (tagName === 'input' || tagName === 'textarea') {
      this.state.context.type = 'text';
      this.state.context.action = 'hover';
    } else if (tagName === 'button' || className.includes('btn')) {
      this.state.context.type = 'button';
      this.state.context.action = 'hover';
    } else if (tagName === 'a' || className.includes('link')) {
      this.state.context.type = 'link';
      this.state.context.action = 'hover';
    } else if (tagName === 'img' || tagName === 'video') {
      this.state.context.type = 'image';
      this.state.context.action = 'hover';
    } else if (className.includes('game') || className.includes('canvas')) {
      this.state.context.type = 'game';
      this.state.context.action = 'hover';
    } else if (className.includes('3d') || className.includes('webgl')) {
      this.state.context.type = '3d';
      this.state.context.action = 'hover';
    } else {
      this.state.context.type = 'text';
      this.state.context.action = 'hover';
    }

    // Update cursor based on context
    this.updateCursorForContext();
  }

  private updateCursorForContext(): void {
    const { type, action } = this.state.context;
    
    let cursor = 'default';
    
    switch (type) {
      case 'text':
        cursor = 'text';
        break;
      case 'button':
        cursor = 'pointer';
        break;
      case 'link':
        cursor = 'pointer';
        break;
      case 'image':
        cursor = action === 'grab' ? 'grabbing' : 'grab';
        break;
      case 'game':
        cursor = 'crosshair';
        break;
      case '3d':
        cursor = 'crosshair';
        break;
      case 'vr':
        cursor = 'none';
        break;
      case 'ar':
        cursor = 'none';
        break;
    }

    this.setCursor(cursor);
  }

  private addEffect(effect: CursorEffect): void {
    this.state.effects.push(effect);
    
    // Remove effect after duration
    setTimeout(() => {
      const index = this.state.effects.findIndex(e => e.id === effect.id);
      if (index > -1) {
        this.state.effects.splice(index, 1);
      }
    }, effect.duration);
  }

  private setupHardwareAcceleration(): void {
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = 'high';
    }
  }

  private setupHighDPISupport(): void {
    if (this.state.highDPI && this.canvas) {
      const dpr = window.devicePixelRatio;
      this.canvas.style.imageRendering = 'pixelated';
    }
  }

  private initializeDefaultCursors(): void {
    // Add default custom cursors
    this.addCustomCursor({
      id: 'default',
      name: 'Default',
      type: 'css',
      hotspot: { x: 0, y: 0 },
      size: { width: 16, height: 16 }
    });

    this.addCustomCursor({
      id: 'pointer',
      name: 'Pointer',
      type: 'css',
      hotspot: { x: 0, y: 0 },
      size: { width: 16, height: 16 }
    });

    this.addCustomCursor({
      id: 'text',
      name: 'Text',
      type: 'css',
      hotspot: { x: 8, y: 8 },
      size: { width: 16, height: 16 }
    });

    this.addCustomCursor({
      id: 'crosshair',
      name: 'Crosshair',
      type: 'css',
      hotspot: { x: 8, y: 8 },
      size: { width: 16, height: 16 }
    });
  }

  // Public API methods
  async requestPointerLock(options: PointerLockOptions): Promise<void> {
    this.pointerLockElement = options.element;
    
    try {
      await options.element.requestPointerLock();
      options.onLock?.();
    } catch (error) {
      options.onError?.(error as Error);
    }
  }

  exitPointerLock(): void {
    document.exitPointerLock();
  }

  setCursor(cursor: string): void {
    this.state.currentCursor = cursor;
    document.body.style.cursor = cursor;
  }

  addCustomCursor(cursor: CustomCursor): void {
    this.state.customCursors.set(cursor.id, cursor);
  }

  removeCustomCursor(id: string): void {
    this.state.customCursors.delete(id);
  }

  setCursorScale(scale: number): void {
    this.state.scale = scale;
  }

  setCursorOpacity(opacity: number): void {
    this.state.opacity = opacity;
  }

  setCursorRotation(rotation: number): void {
    this.state.rotation = rotation;
  }

  addAnimation(animation: CursorAnimation): void {
    this.state.animations.set(animation.id, animation);
  }

  playAnimation(id: string): void {
    const animation = this.state.animations.get(id);
    if (animation) {
      // Implement animation playback
      this.executeAnimation(animation);
    }
  }

  private executeAnimation(animation: CursorAnimation): void {
    // Animation implementation
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animation.duration, 1);
      
      // Apply keyframe properties
      const currentKeyframe = this.getCurrentKeyframe(animation, progress);
      if (currentKeyframe) {
        this.applyKeyframeProperties(currentKeyframe);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  private getCurrentKeyframe(animation: CursorAnimation, progress: number): CursorKeyframe | null {
    for (let i = 0; i < animation.keyframes.length; i++) {
      const keyframe = animation.keyframes[i];
      if (progress <= keyframe.offset) {
        return keyframe;
      }
    }
    return animation.keyframes[animation.keyframes.length - 1];
  }

  private applyKeyframeProperties(keyframe: CursorKeyframe): void {
    const { properties } = keyframe;
    
    if (properties.scale !== undefined) {
      this.state.scale = properties.scale;
    }
    
    if (properties.rotation !== undefined) {
      this.state.rotation = properties.rotation;
    }
    
    if (properties.opacity !== undefined) {
      this.state.opacity = properties.opacity;
    }
  }

  // Eye tracking methods
  enableEyeTracking(options: EyeTrackingOptions): void {
    this.eyeTracking = options;
    // Implement eye tracking integration
    this.initializeEyeTracking();
  }

  private initializeEyeTracking(): void {
    // Placeholder for eye tracking implementation
    // This would integrate with WebGazer.js or similar
  }

  // Hand tracking methods
  enableHandTracking(options: HandTrackingOptions): void {
    this.handTracking = options;
    // Implement hand tracking integration
    this.initializeHandTracking();
  }

  private initializeHandTracking(): void {
    // Placeholder for hand tracking implementation
    // This would integrate with MediaPipe or similar
  }

  // VR/AR methods
  enableVRAR(options: VRAROptions): void {
    this.vrAr = options;
    // Implement VR/AR integration
    this.initializeVRAR();
  }

  private initializeVRAR(): void {
    // Placeholder for VR/AR implementation
    // This would integrate with WebXR
  }

  // Rendering
  render(): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Render cursor trail
    this.renderTrail();
    
    // Render cursor effects
    this.renderEffects();
    
    // Render main cursor
    this.renderMainCursor();
  }

  private renderTrail(): void {
    if (!this.ctx) return;

    this.state.trail.forEach((point, index) => {
      const age = Date.now() - point.timestamp;
      const opacity = Math.max(0, 1 - age / 1000) * point.opacity;
      
      this.ctx!.globalAlpha = opacity;
      this.ctx!.fillStyle = '#007acc';
      this.ctx!.beginPath();
      this.ctx!.arc(point.x, point.y, 2 * point.scale, 0, Math.PI * 2);
      this.ctx!.fill();
    });
  }

  private renderEffects(): void {
    if (!this.ctx) return;

    this.state.effects.forEach(effect => {
      this.renderEffect(effect);
    });
  }

  private renderEffect(effect: CursorEffect): void {
    if (!this.ctx) return;

    const { x, y } = this.state;
    
    switch (effect.animation) {
      case 'pulse':
        this.renderPulseEffect(x, y, effect);
        break;
      case 'glow':
        this.renderGlowEffect(x, y, effect);
        break;
      case 'ripple':
        this.renderRippleEffect(x, y, effect);
        break;
    }
  }

  private renderPulseEffect(x: number, y: number, effect: CursorEffect): void {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.globalAlpha = effect.intensity;
    this.ctx.fillStyle = effect.color || '#007acc';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10 * effect.scale!, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  private renderGlowEffect(x: number, y: number, effect: CursorEffect): void {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.shadowColor = effect.color || '#007acc';
    this.ctx.shadowBlur = 20 * effect.intensity;
    this.ctx.fillStyle = effect.color || '#007acc';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  private renderRippleEffect(x: number, y: number, effect: CursorEffect): void {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.strokeStyle = effect.color || '#007acc';
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = effect.intensity;
    
    for (let i = 0; i < 3; i++) {
      const radius = 10 + i * 10;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  private renderMainCursor(): void {
    if (!this.ctx || !this.state.isVisible) return;

    const { x, y, scale, rotation, opacity } = this.state;
    
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.scale(scale, scale);
    
    // Render custom cursor or default
    const customCursor = this.state.customCursors.get(this.state.currentCursor);
    if (customCursor) {
      this.renderCustomCursor(customCursor);
    } else {
      this.renderDefaultCursor();
    }
    
    this.ctx.restore();
  }

  private renderCustomCursor(cursor: CustomCursor): void {
    if (!this.ctx) return;

    // Implementation depends on cursor type
    switch (cursor.type) {
      case 'svg':
        this.renderSVGCursor(cursor);
        break;
      case 'png':
        this.renderPNGCursor(cursor);
        break;
      case 'animated':
        this.renderAnimatedCursor(cursor);
        break;
      case '3d':
        this.render3DCursor(cursor);
        break;
    }
  }

  private renderSVGCursor(cursor: CustomCursor): void {
    if (!this.ctx || !cursor.data) return;

    // Parse and render SVG
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(cursor.data, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    
    // Convert SVG to canvas drawing
    // This is a simplified implementation
    this.ctx.fillStyle = '#007acc';
    this.ctx.fillRect(-8, -8, 16, 16);
  }

  private renderPNGCursor(cursor: CustomCursor): void {
    if (!this.ctx || !cursor.url) return;

    const img = new Image();
    img.onload = () => {
      this.ctx!.drawImage(img, -cursor.hotspot.x, -cursor.hotspot.y);
    };
    img.src = cursor.url;
  }

  private renderAnimatedCursor(cursor: CustomCursor): void {
    if (!this.ctx || !cursor.frames) return;

    const frameIndex = Math.floor(Date.now() / (1000 / (cursor.frameRate || 30))) % cursor.frames.length;
    const frame = cursor.frames[frameIndex];
    
    // Render current frame
    this.ctx.fillStyle = frame;
    this.ctx.fillRect(-8, -8, 16, 16);
  }

  private render3DCursor(cursor: CustomCursor): void {
    if (!this.ctx) return;

    // Simple 3D cursor representation
    this.ctx.fillStyle = '#007acc';
    this.ctx.fillRect(-6, -6, 12, 12);
    
    // Add 3D effect
    this.ctx.strokeStyle = '#005a9e';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(-6, -6, 12, 12);
  }

  private renderDefaultCursor(): void {
    if (!this.ctx) return;

    this.ctx.fillStyle = '#007acc';
    this.ctx.fillRect(-8, -8, 16, 16);
  }

  // Start rendering loop
  startRendering(): void {
    if (this.animationFrame) return;

    const render = () => {
      this.render();
      this.animationFrame = requestAnimationFrame(render);
    };

    render();
  }

  // Stop rendering loop
  stopRendering(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  // Cleanup
  destroy(): void {
    this.stopRendering();
    
    // Remove event listeners
    this.eventListeners.forEach((listener, event) => {
      document.removeEventListener(event, listener);
    });
    this.eventListeners.clear();
    
    // Remove canvas
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
      this.ctx = null;
    }
    
    this.isInitialized = false;
  }

  // Getters
  getState(): CursorState {
    return { ...this.state };
  }

  isPointerLocked(): boolean {
    return this.state.isLocked;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.state.x, y: this.state.y };
  }
}

