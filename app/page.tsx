'use client';

import { useState, useEffect } from 'react';
import { ComprehensiveAIPlatform } from '../src/core/ComprehensiveAIPlatform';

export default function Home() {
  const [platform, setPlatform] = useState<ComprehensiveAIPlatform | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializePlatform = async () => {
      try {
        const aiPlatform = new ComprehensiveAIPlatform();
        await aiPlatform.initialize({});
        setPlatform(aiPlatform);
        
        const platformStatus = await aiPlatform.getPlatformStatus();
        setStatus(platformStatus);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize platform:', error);
        setLoading(false);
      }
    };

    initializePlatform();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Initializing AI Platform</h2>
          <p className="text-gray-400">Loading comprehensive development tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Comprehensive AI Development Platform</h1>
              <p className="text-gray-400 mt-2">Advanced search system transformed into full AI-powered development environment</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                status?.status === 'healthy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}>
                {status?.status === 'healthy' ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Coding Intelligence */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AI</span>
              </div>
              <h3 className="text-xl font-semibold ml-3">AI Coding Intelligence</h3>
            </div>
            <ul className="text-gray-300 space-y-2">
              <li>• Long-term project memory</li>
              <li>• Semantic codebase Q&A</li>
              <li>• Design pattern detection</li>
              <li>• Multi-agent workflows</li>
              <li>• Predictive coding</li>
            </ul>
          </div>

          {/* Testing & QA */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">T</span>
              </div>
              <h3 className="text-xl font-semibold ml-3">Testing & QA</h3>
            </div>
            <ul className="text-gray-300 space-y-2">
              <li>• Intelligent test generation</li>
              <li>• Flaky test detection</li>
              <li>• Code coverage analysis</li>
              <li>• Security compliance checks</li>
              <li>• Performance regression detection</li>
            </ul>
          </div>

          {/* DevOps & Automation */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
              <h3 className="text-xl font-semibold ml-3">DevOps & Automation</h3>
            </div>
            <ul className="text-gray-300 space-y-2">
              <li>• Auto-generated CI/CD pipelines</li>
              <li>• Error log analysis</li>
              <li>• Performance profiling</li>
              <li>• Cloud cost optimization</li>
              <li>• Microservice scaffolding</li>
            </ul>
          </div>

          {/* Collaboration */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <h3 className="text-xl font-semibold ml-3">Collaboration</h3>
            </div>
            <ul className="text-gray-300 space-y-2">
              <li>• Team knowledge graph</li>
              <li>• AI code reviews</li>
              <li>• Real-time collaboration</li>
              <li>• Task tracker integrations</li>
              <li>• Documentation automation</li>
            </ul>
          </div>

          {/* Analytics */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <h3 className="text-xl font-semibold ml-3">Analytics & Insights</h3>
            </div>
            <ul className="text-gray-300 space-y-2">
              <li>• Developer productivity metrics</li>
              <li>• Code health scoring</li>
              <li>• Delivery forecasting</li>
              <li>• Architecture cost estimation</li>
              <li>• Performance monitoring</li>
            </ul>
          </div>

          {/* Security */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <h3 className="text-xl font-semibold ml-3">Security & DevSecOps</h3>
            </div>
            <ul className="text-gray-300 space-y-2">
              <li>• Secrets leakage prevention</li>
              <li>• Continuous security scanning</li>
              <li>• Privacy-focused local LLM</li>
              <li>• Quantum-safe cryptography</li>
              <li>• Compliance monitoring</li>
            </ul>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold mb-4">Advanced & Experimental Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Multi-Modal & Accessibility</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Image-to-code conversion</li>
                <li>• Voice-driven coding commands</li>
                <li>• Gesture + speech hybrid coding</li>
                <li>• Touchscreen-optimized UI</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-400">Learning & Onboarding</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• AI-driven project walkthroughs</li>
                <li>• Gamified coding challenges</li>
                <li>• Contextual learning recommendations</li>
                <li>• Interactive tutorials</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-purple-400">Ecosystem & Marketplace</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• Plugin marketplace</li>
                <li>• One-click integrations</li>
                <li>• Private AI model hosting</li>
                <li>• Community tools</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">Experimental Features</h3>
              <ul className="text-gray-300 space-y-1">
                <li>• VR/AR code visualization</li>
                <li>• Real-time architecture heatmaps</li>
                <li>• Context graphs</li>
                <li>• Autonomous coding agents</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform Status */}
        {status && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Platform Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(status.subsystems).map(([subsystem, status]) => (
                <div key={subsystem} className="text-center">
                  <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                    status === 'active' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <p className="text-sm text-gray-300 capitalize">{subsystem.replace(/([A-Z])/g, ' $1')}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>Version: {status.version}</p>
              <p>Last Update: {new Date(status.lastUpdate).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Development Workflow?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            This comprehensive AI platform combines all the features you requested into a single, 
            powerful development environment. From AI-powered coding assistance to advanced security 
            scanning, everything is integrated and ready for production deployment.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Start Development
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
