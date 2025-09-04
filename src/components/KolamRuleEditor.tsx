'use client';

import React, { useState, useEffect } from 'react';
import { Code, Download, Upload, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { KolamGenerator } from '@/utils/kolamGenerator';
import { KolamDisplay } from './KolamDisplay';
import { KolamPattern } from '@/types/kolam';

interface KolamRuleSet {
  grid_size: number;
  symmetry_type: '1D' | '2D' | 'none';
  base_patterns: number[];
  name?: string;
  description?: string;
}

const DEFAULT_RULE_SET: KolamRuleSet = {
  grid_size: 7,
  symmetry_type: '1D',
  base_patterns: [1, 3, 5, 7, 9, 11, 13, 15],
  name: "Custom Kolam",
  description: "User-defined kolam pattern"
};

export const KolamRuleEditor: React.FC = () => {
  const [ruleSet, setRuleSet] = useState<KolamRuleSet>(DEFAULT_RULE_SET);
  const [jsonInput, setJsonInput] = useState<string>('');
  const [pattern, setPattern] = useState<KolamPattern | null>(null);
  const [showJsonEditor, setShowJsonEditor] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize JSON input
  useEffect(() => {
    setJsonInput(JSON.stringify(ruleSet, null, 2));
  }, []);

  // Generate pattern when rule set changes
  useEffect(() => {
    generatePatternFromRules();
  }, [ruleSet]);

  const generatePatternFromRules = async () => {
    setIsGenerating(true);
    try {
      // Use the existing generator with the rule set parameters
      const generatedPattern = KolamGenerator.generateKolam1D(ruleSet.grid_size);
      generatedPattern.name = ruleSet.name || "Custom Kolam";
      setPattern(generatedPattern);
    } catch (error) {
      console.error('Error generating pattern from rules:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonInput(value);
    setJsonError(null);

    try {
      const parsed = JSON.parse(value);
      
      // Validate the structure
      if (typeof parsed.grid_size !== 'number' || parsed.grid_size < 3 || parsed.grid_size > 15) {
        throw new Error('grid_size must be a number between 3 and 15');
      }
      
      if (!['1D', '2D', 'none'].includes(parsed.symmetry_type)) {
        throw new Error('symmetry_type must be "1D", "2D", or "none"');
      }
      
      if (!Array.isArray(parsed.base_patterns)) {
        throw new Error('base_patterns must be an array');
      }

      // Update rule set
      setRuleSet(parsed);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid JSON');
    }
  };

  const handleParameterChange = (key: keyof KolamRuleSet, value: any) => {
    const newRuleSet = { ...ruleSet, [key]: value };
    setRuleSet(newRuleSet);
    setJsonInput(JSON.stringify(newRuleSet, null, 2));
  };

  const exportRuleSet = () => {
    const dataStr = JSON.stringify(ruleSet, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ruleSet.name?.replace(/\s+/g, '_').toLowerCase() || 'kolam'}_rules.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importRuleSet = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        setRuleSet(parsed);
        setJsonInput(JSON.stringify(parsed, null, 2));
        setJsonError(null);
      } catch (error) {
        setJsonError('Failed to parse imported file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="kolam-rule-editor space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Code className="mr-3 text-amber-600" />
          Kolam Rule Editor
        </h2>
        <p className="text-gray-600">
          Create and modify kolam patterns using mathematical rules. Edit parameters or JSON directly for precise control.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rule Editor */}
        <div className="space-y-6">
          {/* Parameter Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pattern Parameters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pattern Name
                </label>
                <input
                  type="text"
                  value={ruleSet.name || ''}
                  onChange={(e) => handleParameterChange('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter pattern name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grid Size: {ruleSet.grid_size}×{ruleSet.grid_size}
                </label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={ruleSet.grid_size}
                  onChange={(e) => handleParameterChange('grid_size', parseInt(e.target.value))}
                  className="w-full"
                  style={{ accentColor: '#d97706' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symmetry Type
                </label>
                <select
                  value={ruleSet.symmetry_type}
                  onChange={(e) => handleParameterChange('symmetry_type', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="1D">1D Symmetry</option>
                  <option value="2D">2D Symmetry</option>
                  <option value="none">No Symmetry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={ruleSet.description || ''}
                  onChange={(e) => handleParameterChange('description', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  rows={3}
                  placeholder="Describe your kolam pattern"
                />
              </div>
            </div>
          </div>

          {/* JSON Editor */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">JSON Rule Set</h3>
              <button
                onClick={() => setShowJsonEditor(!showJsonEditor)}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {showJsonEditor ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showJsonEditor ? 'Hide' : 'Show'} JSON
              </button>
            </div>

            {showJsonEditor && (
              <div className="space-y-4">
                <textarea
                  value={jsonInput}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className={`w-full p-4 border rounded-lg font-mono text-sm ${
                    jsonError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  rows={12}
                  placeholder="Enter JSON rule set"
                />
                
                {jsonError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{jsonError}</p>
                  </div>
                )}
              </div>
            )}

            {/* Import/Export Controls */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={exportRuleSet}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                Export Rules
              </button>
              
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer">
                <Upload className="h-4 w-4" />
                Import Rules
                <input
                  type="file"
                  accept=".json"
                  onChange={importRuleSet}
                  className="hidden"
                />
              </label>

              <button
                onClick={generatePatternFromRules}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Preview</h3>
          
          {isGenerating ? (
            <div className="bg-gray-100 rounded-lg p-12 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Generating pattern...</p>
            </div>
          ) : pattern ? (
            <div className="bg-amber-900 rounded-lg p-6 flex justify-center">
              <KolamDisplay
                pattern={pattern}
                animate={false}
                className="max-w-md"
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-12 text-center">
              <p className="text-gray-500">No pattern generated</p>
            </div>
          )}

          {/* Pattern Info */}
          {pattern && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Generated Pattern</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Dots:</span>
                  <span className="font-medium ml-2">{pattern.dots.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Curves:</span>
                  <span className="font-medium ml-2">{pattern.curves.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="font-medium ml-2">{pattern.dimensions.width}×{pattern.dimensions.height}</span>
                </div>
                <div>
                  <span className="text-gray-600">Symmetry:</span>
                  <span className="font-medium ml-2">{pattern.symmetryType}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};