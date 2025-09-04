'use client';

import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { KolamEditor } from './KolamEditor';
import { KolamExplorer } from './KolamExplorer';
import { KolamAnalyzer } from './KolamAnalyzer';
import { KolamLearning } from './KolamLearning';
import { KolamRuleEditor } from './KolamRuleEditor';

export const KolamPlatform: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generator');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'generator':
        return <KolamEditor />;
      case 'explorer':
        return <KolamExplorer />;
      case 'analyzer':
        return <KolamAnalyzer />;
      case 'learning':
        return <KolamLearning />;
      case 'rules':
        return <KolamRuleEditor />;
      default:
        return <KolamEditor />;
    }
  };

  return (
    <div className="kolam-platform min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About Zen Kolam</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A comprehensive platform for analyzing, generating, and learning about traditional South Indian kolam patterns. 
                Combining mathematical rigor with cultural preservation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• AI-powered kolam analysis</li>
                <li>• Traditional pattern generation</li>
                <li>• Interactive learning modules</li>
                <li>• Cultural context and history</li>
                <li>• Mathematical explanations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/in/rishi-balamurugan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/crazzygamerr/zen-kolam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Zen Kolam. Preserving traditional art through modern technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};