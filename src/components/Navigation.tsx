'use client';

import React from 'react';
import { Palette, Search, BookOpen, Code, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'generator', label: 'Generator', icon: Palette, description: 'Create new kolam patterns' },
  { id: 'explorer', label: 'Explorer', icon: Search, description: 'Browse traditional patterns' },
  { id: 'analyzer', label: 'Analyzer', icon: Sparkles, description: 'Analyze uploaded images' },
  { id: 'learning', label: 'Learning', icon: BookOpen, description: 'Learn design principles' },
  { id: 'rules', label: 'Rule Editor', icon: Code, description: 'Edit pattern rules' },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Zen Kolam</h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                    title={tab.description}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              {TABS.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};