'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Palette, 
  Zap, 
  Eye, 
  Hand, 
  Headphones,
  Download,
  Upload,
  Save,
  RotateCcw,
  Play,
  Pause,
  Sparkles,
  Target,
  Gamepad2,
  Monitor,
  Smartphone,
  Glasses,
  Accessibility
} from 'lucide-react';
import { CursorThemeManager, CursorTheme } from '@/lib/cursor-themes';
import { CursorEffectManager, CursorEffectConfig } from '@/lib/cursor-effects';

interface CursorSettingsProps {
  onThemeChange?: (theme: CursorTheme) => void;
  onEffectChange?: (effects: string[]) => void;
  onSettingsChange?: (settings: any) => void;
}

export function CursorSettings({ onThemeChange, onEffectChange, onSettingsChange }: CursorSettingsProps) {
  const [themeManager] = useState(() => new CursorThemeManager());
  const [effectManager] = useState(() => new CursorEffectManager(document.createElement('canvas')));
  const [currentTheme, setCurrentTheme] = useState<CursorTheme | null>(null);
  const [availableEffects, setAvailableEffects] = useState<CursorEffectConfig[]>([]);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    scale: 1,
    opacity: 1,
    trail: false,
    effects: true,
    animations: true,
    pointerLock: false,
    eyeTracking: false,
    handTracking: false,
    voiceControl: false,
    vrAr: false
  });

  useEffect(() => {
    // Initialize with default theme
    const defaultTheme = themeManager.getCurrentTheme();
    if (defaultTheme) {
      setCurrentTheme(defaultTheme);
      onThemeChange?.(defaultTheme);
    }

    // Load available effects
    setAvailableEffects(effectManager.getAvailableEffects());
  }, [themeManager, effectManager, onThemeChange]);

  const handleThemeChange = (themeId: string) => {
    const theme = themeManager.getTheme(themeId);
    if (theme) {
      setCurrentTheme(theme);
      onThemeChange?.(theme);
      
      // Update settings from theme
      setSettings(prev => ({
        ...prev,
        ...theme.settings
      }));
    }
  };

  const handleEffectToggle = (effectId: string) => {
    setActiveEffects(prev => {
      const newEffects = prev.includes(effectId)
        ? prev.filter(id => id !== effectId)
        : [...prev, effectId];
      
      onEffectChange?.(newEffects);
      return newEffects;
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      onSettingsChange?.(newSettings);
      return newSettings;
    });
  };

  const handleExportTheme = () => {
    if (currentTheme) {
      const themeData = themeManager.exportTheme(currentTheme.id);
      const blob = new Blob([themeData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentTheme.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const themeData = e.target?.result as string;
        if (themeManager.importTheme(themeData)) {
          const themes = themeManager.getAllThemes();
          const importedTheme = themes[themes.length - 1];
          setCurrentTheme(importedTheme);
          onThemeChange?.(importedTheme);
        }
      };
      reader.readAsText(file);
    }
  };

  const themes = themeManager.getAllThemes();
  const categories = [...new Set(themes.map(theme => theme.category))];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Cursor Settings</h2>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExportTheme}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline" asChild>
              <label>
                <Upload className="w-4 h-4 mr-1" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportTheme}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="space-y-4 mt-6">
            <div className="space-y-4">
              {categories.map(category => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-medium capitalize">{category} Themes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themes
                      .filter(theme => theme.category === category)
                      .map(theme => (
                        <Card
                          key={theme.id}
                          className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                            currentTheme?.id === theme.id
                              ? 'ring-2 ring-primary bg-primary/5'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleThemeChange(theme.id)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{theme.name}</h4>
                              {currentTheme?.id === theme.id && (
                                <Badge variant="default" className="text-xs">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {theme.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {theme.effects.slice(0, 3).map(effect => (
                                  <Badge key={effect} variant="outline" className="text-xs">
                                    {effect}
                                  </Badge>
                                ))}
                                {theme.effects.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{theme.effects.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Scale: {theme.settings.scale}x</span>
                              <span>•</span>
                              <span>Opacity: {Math.round(theme.settings.opacity * 100)}%</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Available Effects</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveEffects(availableEffects.map(e => e.id))}
                  >
                    Enable All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveEffects([])}
                  >
                    Disable All
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableEffects.map(effect => (
                  <Card
                    key={effect.id}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      activeEffects.includes(effect.id)
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleEffectToggle(effect.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium capitalize">{effect.name}</h4>
                        <Switch
                          checked={activeEffects.includes(effect.id)}
                          onCheckedChange={() => handleEffectToggle(effect.id)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {effect.type} effect
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline">
                          {effect.duration}ms
                        </Badge>
                        <Badge variant="outline">
                          {effect.intensity * 100}% intensity
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 mt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Settings</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scale: {settings.scale.toFixed(1)}x</label>
                    <Slider
                      value={[settings.scale]}
                      onValueChange={([value]) => handleSettingChange('scale', value)}
                      min={0.5}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Opacity: {Math.round(settings.opacity * 100)}%</label>
                    <Slider
                      value={[settings.opacity]}
                      onValueChange={([value]) => handleSettingChange('opacity', value)}
                      min={0.1}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Enable Trail</span>
                    <Switch
                      checked={settings.trail}
                      onCheckedChange={(checked) => handleSettingChange('trail', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Enable Effects</span>
                    <Switch
                      checked={settings.effects}
                      onCheckedChange={(checked) => handleSettingChange('effects', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Enable Animations</span>
                    <Switch
                      checked={settings.animations}
                      onCheckedChange={(checked) => handleSettingChange('animations', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Advanced Features</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">Pointer Lock</span>
                    </div>
                    <Switch
                      checked={settings.pointerLock}
                      onCheckedChange={(checked) => handleSettingChange('pointerLock', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Eye Tracking</span>
                    </div>
                    <Switch
                      checked={settings.eyeTracking}
                      onCheckedChange={(checked) => handleSettingChange('eyeTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Hand className="w-4 h-4" />
                      <span className="text-sm font-medium">Hand Tracking</span>
                    </div>
                    <Switch
                      checked={settings.handTracking}
                      onCheckedChange={(checked) => handleSettingChange('handTracking', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Headphones className="w-4 h-4" />
                      <span className="text-sm font-medium">Voice Control</span>
                    </div>
                    <Switch
                      checked={settings.voiceControl}
                      onCheckedChange={(checked) => handleSettingChange('voiceControl', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Glasses className="w-4 h-4" />
                      <span className="text-sm font-medium">VR/AR Support</span>
                    </div>
                    <Switch
                      checked={settings.vrAr}
                      onCheckedChange={(checked) => handleSettingChange('vrAr', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4 mt-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accessibility Features</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Accessibility className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">Large Cursor</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Increase cursor size for better visibility
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Enable Large Cursor
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">High Contrast</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        High contrast colors for better visibility
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Enable High Contrast
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">Dwell Selection</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Hover to select without clicking
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Enable Dwell Selection
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">Voice Control</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Control cursor with voice commands
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Enable Voice Control
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
