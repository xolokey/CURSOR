'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AdvancedCursorSystem, CursorState, CustomCursor, CursorAnimation, PointerLockOptions, EyeTrackingOptions, HandTrackingOptions, VRAROptions } from '@/lib/cursor-system';

export interface UseAdvancedCursorOptions {
  enabled?: boolean;
  pointerLock?: boolean;
  eyeTracking?: EyeTrackingOptions;
  handTracking?: HandTrackingOptions;
  vrAr?: VRAROptions;
  customCursors?: CustomCursor[];
  animations?: CursorAnimation[];
  onStateChange?: (state: CursorState) => void;
  onPointerLock?: (locked: boolean) => void;
  onEyeGaze?: (x: number, y: number) => void;
  onHandGesture?: (gesture: string, confidence: number) => void;
  onVRARInteraction?: (type: string, data: any) => void;
}

export function useAdvancedCursor(options: UseAdvancedCursorOptions = {}) {
  const {
    enabled = true,
    pointerLock = false,
    eyeTracking,
    handTracking,
    vrAr,
    customCursors = [],
    animations = [],
    onStateChange,
    onPointerLock,
    onEyeGaze,
    onHandGesture,
    onVRARInteraction
  } = options;

  const cursorSystemRef = useRef<AdvancedCursorSystem | null>(null);
  const [state, setState] = useState<CursorState | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  // Initialize cursor system
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const initializeCursor = async () => {
      const cursorSystem = new AdvancedCursorSystem();
      await cursorSystem.initialize();
      
      // Add custom cursors
      customCursors.forEach(cursor => {
        cursorSystem.addCustomCursor(cursor);
      });

      // Add animations
      animations.forEach(animation => {
        cursorSystem.addAnimation(animation);
      });

      // Set up eye tracking
      if (eyeTracking) {
        cursorSystem.enableEyeTracking(eyeTracking);
      }

      // Set up hand tracking
      if (handTracking) {
        cursorSystem.enableHandTracking(handTracking);
      }

      // Set up VR/AR
      if (vrAr) {
        cursorSystem.enableVRAR(vrAr);
      }

      cursorSystemRef.current = cursorSystem;
      setIsInitialized(true);
      cursorSystem.startRendering();

      // Set up state monitoring
      const monitorState = () => {
        const currentState = cursorSystem.getState();
        setState(currentState);
        onStateChange?.(currentState);
      };

      const stateInterval = setInterval(monitorState, 16); // ~60fps

      return () => {
        clearInterval(stateInterval);
        cursorSystem.destroy();
      };
    };

    const cleanup = initializeCursor();
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [enabled, customCursors, animations, eyeTracking, handTracking, vrAr, onStateChange]);

  // Pointer lock functionality
  const requestPointerLock = useCallback(async (element: HTMLElement) => {
    if (!cursorSystemRef.current) return;

    const options: PointerLockOptions = {
      element,
      onLock: () => {
        setIsPointerLocked(true);
        onPointerLock?.(true);
      },
      onUnlock: () => {
        setIsPointerLocked(false);
        onPointerLock?.(false);
      },
      onMove: (movementX, movementY) => {
        // Handle raw movement for games/3D apps
        console.log('Raw movement:', movementX, movementY);
      },
      onError: (error) => {
        console.error('Pointer lock error:', error);
      }
    };

    await cursorSystemRef.current.requestPointerLock(options);
  }, [onPointerLock]);

  const exitPointerLock = useCallback(() => {
    if (cursorSystemRef.current) {
      cursorSystemRef.current.exitPointerLock();
    }
  }, []);

  // Cursor control methods
  const setCursor = useCallback((cursor: string) => {
    if (cursorSystemRef.current) {
      cursorSystemRef.current.setCursor(cursor);
    }
  }, []);

  const addCustomCursor = useCallback((cursor: CustomCursor) => {
    if (cursorSystemRef.current) {
      cursorSystemRef.current.addCustomCursor(cursor);
    }
  }, []);

  const removeCustomCursor = useCallback((id: string) => {
    if (cursorSystemRef.current) {
      cursorSystemRef.current.removeCustomCursor(id);
    }
  }, []);

  const setCursorScale = useCallback((scale: number) => {
    if (cursorSystemRef.current) {
      cursorSystemRef.current.setCursorScale(scale);
    }
  }, []);

  const setCursorOpacity = useCallback((opacity: number) => {
    if (cursorSystemRef.current) {
      cursorSystemRef.current.setCursorOpacity(opacity);
    }
  }, []);

  const setCursorRotation = useCallback((rotation: number) => {
    if (cursorSystemRef.current) {
      cursorSystemRef.current.setCursorRotation(rotation);
    }
  }, []);

  const playAnimation = useCallback((id: string) => {
    if (cursorSystemRef.current) {
      cursorSystemRef.current.playAnimation(id);
    }
  }, []);

  const addAnimation = useCallback((animation: CursorAnimation) => {
    if (cursorSystemRef.current) {
      cursorSystemRef.current.addAnimation(animation);
    }
  }, []);

  // Context-aware cursor methods
  const setContextCursor = useCallback((context: string) => {
    const contextCursors: Record<string, string> = {
      text: 'text',
      button: 'pointer',
      link: 'pointer',
      image: 'grab',
      video: 'grab',
      game: 'crosshair',
      '3d': 'crosshair',
      vr: 'none',
      ar: 'none',
      disabled: 'not-allowed',
      loading: 'wait',
      help: 'help',
      resize: 'resize',
      move: 'move',
      copy: 'copy',
      alias: 'alias',
      zoomIn: 'zoom-in',
      zoomOut: 'zoom-out'
    };

    const cursor = contextCursors[context] || 'default';
    setCursor(cursor);
  }, [setCursor]);

  // Accessibility methods
  const enableLargeCursor = useCallback(() => {
    setCursorScale(2);
    setCursorOpacity(1);
  }, [setCursorScale, setCursorOpacity]);

  const enableHighContrastCursor = useCallback(() => {
    // This would typically involve changing cursor colors
    // For now, we'll increase opacity and scale
    setCursorOpacity(1);
    setCursorScale(1.5);
  }, [setCursorOpacity, setCursorScale]);

  const enableDwellSelection = useCallback((dwellTime: number = 1000) => {
    if (eyeTracking) {
      const updatedEyeTracking = {
        ...eyeTracking,
        dwellTime,
        onDwell: (element: HTMLElement) => {
          element.click();
          eyeTracking.onDwell?.(element);
        }
      };
      
      if (cursorSystemRef.current) {
        cursorSystemRef.current.enableEyeTracking(updatedEyeTracking);
      }
    }
  }, [eyeTracking]);

  // Multiple cursor support (experimental)
  const enableMultipleCursors = useCallback(() => {
    // This would require additional implementation
    // For now, we'll just log that it's enabled
    console.log('Multiple cursors enabled (experimental)');
  }, []);

  // Gesture control
  const enableGestureControl = useCallback((gestures: string[] = ['swipe', 'pinch', 'rotate']) => {
    if (handTracking) {
      const updatedHandTracking = {
        ...handTracking,
        gestures,
        onGesture: (gesture: string, confidence: number) => {
          onHandGesture?.(gesture, confidence);
          handTracking.onGesture?.(gesture, confidence);
        }
      };
      
      if (cursorSystemRef.current) {
        cursorSystemRef.current.enableHandTracking(updatedHandTracking);
      }
    }
  }, [handTracking, onHandGesture]);

  // Voice control
  const enableVoiceControl = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // This would integrate with Web Speech API
    if ('speechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        
        // Map voice commands to cursor actions
        const voiceCommands: Record<string, () => void> = {
          'click': () => {
            const element = document.elementFromPoint(state?.x || 0, state?.y || 0) as HTMLElement;
            element?.click();
          },
          'double click': () => {
            const element = document.elementFromPoint(state?.x || 0, state?.y || 0) as HTMLElement;
            element?.dispatchEvent(new MouseEvent('dblclick'));
          },
          'right click': () => {
            const element = document.elementFromPoint(state?.x || 0, state?.y || 0) as HTMLElement;
            element?.dispatchEvent(new MouseEvent('contextmenu'));
          },
          'scroll up': () => {
            window.scrollBy(0, -100);
          },
          'scroll down': () => {
            window.scrollBy(0, 100);
          }
        };
        
        const action = voiceCommands[command];
        if (action) {
          action();
        }
      };
      
      recognition.start();
    }
  }, [state]);

  return {
    // State
    state,
    isInitialized,
    isPointerLocked,
    
    // Basic controls
    setCursor,
    addCustomCursor,
    removeCustomCursor,
    setCursorScale,
    setCursorOpacity,
    setCursorRotation,
    
    // Animations
    playAnimation,
    addAnimation,
    
    // Context awareness
    setContextCursor,
    
    // Pointer lock
    requestPointerLock,
    exitPointerLock,
    
    // Accessibility
    enableLargeCursor,
    enableHighContrastCursor,
    enableDwellSelection,
    
    // Advanced features
    enableMultipleCursors,
    enableGestureControl,
    enableVoiceControl,
    
    // System info
    isSupported: {
      pointerLock: 'pointerLockElement' in document,
      eyeTracking: 'getDisplayMedia' in navigator,
      handTracking: 'mediaDevices' in navigator,
      voiceControl: 'speechRecognition' in window || 'webkitSpeechRecognition' in window,
      vr: 'xr' in navigator,
      ar: 'xr' in navigator
    }
  };
}

