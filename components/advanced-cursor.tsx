'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAdvancedCursor, UseAdvancedCursorOptions } from '@/hooks/use-advanced-cursor';
import { CustomCursor, CursorAnimation } from '@/lib/cursor-system';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mouse, 
  Eye, 
  Hand, 
  Headphones, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Target,
  Sparkles,
  Zap,
  Palette,
  Accessibility,
  Gamepad2,
  Monitor,
  Smartphone,
  Glasses
} from 'lucide-react';

interface AdvancedCursorProps {
  enabled?: boolean;
  onSettingsChange?: (settings: UseAdvancedCursorOptions) => void;
}

export function AdvancedCursor({ enabled = true, onSettingsChange }: AdvancedCursorProps) {
  const [settings, setSettings] = useState<UseAdvancedCursorOptions>({
    enabled,
    pointerLock: false,
    customCursors: [],
    animations: []
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<'desktop' | 'mobile' | 'vr' | 'ar'>('desktop');

  const {
    state,
    isInitialized,
    isPointerLocked,
    setCursor,
    addCustomCursor,
    removeCustomCursor,
    setCursorScale,
    setCursorOpacity,
    setCursorRotation,
    playAnimation,
    addAnimation,
    setContextCursor,
    requestPointerLock,
    exitPointerLock,
    enableLargeCursor,
    enableHighContrastCursor,
    enableDwellSelection,
    enableMultipleCursors,
    enableGestureControl,
    enableVoiceControl,
    isSupported
  } = useAdvancedCursor(settings);

  // Initialize with default cursors and animations
  useEffect(() => {
    if (!isInitialized) return;

    // Add default custom cursors
    const defaultCursors: CustomCursor[] = [
      {
        id: 'gaming',
        name: 'Gaming Crosshair',
        type: 'svg',
        data: '<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="none" stroke="#00ff00" stroke-width="2"/><line x1="16" y1="4" x2="16" y2="12" stroke="#00ff00" stroke-width="2"/><line x1="16" y1="20" x2="16" y2="28" stroke="#00ff00" stroke-width="2"/><line x1="4" y1="16" x2="12" y2="16" stroke="#00ff00" stroke-width="2"/><line x1="20" y1="16" x2="28" y2="16" stroke="#00ff00" stroke-width="2"/></svg>',
        hotspot: { x: 16, y: 16 },
        size: { width: 32, height: 32 }
      },
      {
        id: 'creative',
        name: 'Creative Brush',
        type: 'svg',
        data: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3z" fill="#ff6b6b"/><path d="M20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z" fill="#ff6b6b"/></svg>',
        hotspot: { x: 2, y: 22 },
        size: { width: 24, height: 24 }
      },
      {
        id: 'precision',
        name: 'Precision Dot',
        type: 'svg',
        data: '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="#007acc" stroke-width="2"/><circle cx="8" cy="8" r="2" fill="#007acc"/></svg>',
        hotspot: { x: 8, y: 8 },
        size: { width: 16, height: 16 }
      }
    ];

    defaultCursors.forEach(cursor => addCustomCursor(cursor));

    // Add default animations
    const defaultAnimations: CursorAnimation[] = [
      {
        id: 'pulse',
        name: 'Pulse',
        keyframes: [
          { offset: 0, properties: { scale: 1, opacity: 1 } },
          { offset: 0.5, properties: { scale: 1.2, opacity: 0.8 } },
          { offset: 1, properties: { scale: 1, opacity: 1 } }
        ],
        duration: 1000,
        easing: 'ease-in-out',
        loop: true,
        direction: 'normal'
      },
      {
        id: 'spin',
        name: 'Spin',
        keyframes: [
          { offset: 0, properties: { rotation: 0 } },
          { offset: 1, properties: { rotation: 360 } }
        ],
        duration: 2000,
        easing: 'linear',
        loop: true,
        direction: 'normal'
      },
      {
        id: 'glow',
        name: 'Glow',
        keyframes: [
          { offset: 0, properties: { opacity: 0.5, filter: 'brightness(1)' } },
          { offset: 0.5, properties: { opacity: 1, filter: 'brightness(1.5)' } },
          { offset: 1, properties: { opacity: 0.5, filter: 'brightness(1)' } }
        ],
        duration: 1500,
        easing: 'ease-in-out',
        loop: true,
        direction: 'normal'
      }
    ];

    defaultAnimations.forEach(animation => addAnimation(animation));

  }, [isInitialized, addCustomCursor, addAnimation]);

  const handleSettingsChange = (newSettings: Partial<UseAdvancedCursorOptions>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    onSettingsChange?.(updatedSettings);
  };

  const handlePointerLock = async () => {
    const element = document.documentElement;
    if (isPointerLocked) {
      exitPointerLock();
    } else {
      await requestPointerLock(element);
    }
  };

  const handleModeChange = (mode: 'desktop' | 'mobile' | 'vr' | 'ar') => {
    setActiveMode(mode);
    
    // Update cursor based on mode
    switch (mode) {
      case 'desktop':
        setContextCursor('text');
        break;
      case 'mobile':
        setContextCursor('pointer');
        break;
      case 'vr':
        setContextCursor('none');
        break;
      case 'ar':
        setContextCursor('none');
        break;
    }
  };

  if (!enabled || !isInitialized) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-card/95 backdrop-blur-sm border-border shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mouse className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Advanced Cursor</h3>
              <Badge variant="outline" className="text-xs">
                {isPointerLocked ? 'Locked' : 'Free'}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {isExpanded && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="accessibility">A11y</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pointer Lock</span>
                    <Switch
                      checked={isPointerLocked}
                      onCheckedChange={handlePointerLock}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mode</label>
                    <div className="flex gap-1">
                      {[
                        { id: 'desktop', icon: Monitor, label: 'Desktop' },
                        { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                        { id: 'vr', icon: Glasses, label: 'VR' },
                        { id: 'ar', icon: Target, label: 'AR' }
                      ].map(({ id, icon: Icon, label }) => (
                        <Button
                          key={id}
                          size="sm"
                          variant={activeMode === id ? 'default' : 'outline'}
                          onClick={() => handleModeChange(id as any)}
                          className="flex-1"
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scale: {state?.scale.toFixed(1)}</label>
                    <Slider
                      value={[state?.scale || 1]}
                      onValueChange={([value]) => setCursorScale(value)}
                      min={0.5}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Opacity: {Math.round((state?.opacity || 1) * 100)}%</label>
                    <Slider
                      value={[state?.opacity || 1]}
                      onValueChange={([value]) => setCursorOpacity(value)}
                      min={0.1}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="effects" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Animations</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['pulse', 'spin', 'glow'].map(animation => (
                        <Button
                          key={animation}
                          size="sm"
                          variant="outline"
                          onClick={() => playAnimation(animation)}
                          className="text-xs"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          {animation}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Custom Cursors</label>
                    <div className="space-y-1">
                      {['gaming', 'creative', 'precision'].map(cursor => (
                        <Button
                          key={cursor}
                          size="sm"
                          variant="outline"
                          onClick={() => setCursor(cursor)}
                          className="w-full justify-start text-xs"
                        >
                          <Target className="w-3 h-3 mr-2" />
                          {cursor}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rotation: {Math.round(state?.rotation || 0)}°</label>
                    <Slider
                      value={[state?.rotation || 0]}
                      onValueChange={([value]) => setCursorRotation(value)}
                      min={0}
                      max={360}
                      step={15}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="accessibility" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Large Cursor</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={enableLargeCursor}
                    >
                      <Accessibility className="w-3 h-3 mr-1" />
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Contrast</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={enableHighContrastCursor}
                    >
                      <Accessibility className="w-3 h-3 mr-1" />
                      Enable
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dwell Selection (ms)</label>
                    <Slider
                      value={[1000]}
                      onValueChange={([value]) => enableDwellSelection(value)}
                      min={500}
                      max={3000}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Voice Control</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={enableVoiceControl}
                      className="w-full"
                      disabled={!isSupported.voiceControl}
                    >
                      <Headphones className="w-3 h-3 mr-1" />
                      Enable Voice Control
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Eye Tracking</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSettingsChange({
                        eyeTracking: {
                          enabled: true,
                          calibration: true,
                          dwellTime: 1000,
                          onGaze: (x, y) => console.log('Gaze:', x, y),
                          onBlink: () => console.log('Blink detected'),
                          onDwell: (element) => element.click()
                        }
                      })}
                      className="w-full"
                      disabled={!isSupported.eyeTracking}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Enable Eye Tracking
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hand Tracking</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSettingsChange({
                        handTracking: {
                          enabled: true,
                          gestures: ['swipe', 'pinch', 'grab', 'point'],
                          onGesture: (gesture, confidence) => console.log('Gesture:', gesture, confidence),
                          onPinch: (strength) => console.log('Pinch:', strength),
                          onGrab: (strength) => console.log('Grab:', strength),
                          onPoint: (x, y) => console.log('Point:', x, y)
                        }
                      })}
                      className="w-full"
                      disabled={!isSupported.handTracking}
                    >
                      <Hand className="w-3 h-3 mr-1" />
                      Enable Hand Tracking
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">VR/AR Support</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSettingsChange({
                        vrAr: {
                          mode: 'vr',
                          headGaze: true,
                          rayCasting: true,
                          handTracking: true,
                          onHeadGaze: (x, y, z) => console.log('Head gaze:', x, y, z),
                          onRayHit: (x, y, z, element) => console.log('Ray hit:', x, y, z, element),
                          onHandGesture: (gesture, hand) => console.log('Hand gesture:', gesture, hand)
                        }
                      })}
                      className="w-full"
                      disabled={!isSupported.vr}
                    >
                      <Glasses className="w-3 h-3 mr-1" />
                      Enable VR/AR
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Multiple Cursors</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={enableMultipleCursors}
                      className="w-full"
                    >
                      <Gamepad2 className="w-3 h-3 mr-1" />
                      Enable Multi-Cursor
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gesture Control</label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => enableGestureControl(['swipe', 'pinch', 'rotate'])}
                      className="w-full"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Enable Gestures
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {!isExpanded && (
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {state ? `X: ${Math.round(state.x)}, Y: ${Math.round(state.y)}` : 'Initializing...'}
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCursor('default')}
                  className="h-6 w-6 p-0"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => playAnimation('pulse')}
                  className="h-6 w-6 p-0"
                >
                  <Sparkles className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

