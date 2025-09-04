'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, BookOpen, Lightbulb } from 'lucide-react';
import { KolamGenerator } from '@/utils/kolamGenerator';
import { KolamDisplay } from './KolamDisplay';
import { KolamPattern } from '@/types/kolam';

interface LearningStep {
  id: number;
  title: string;
  description: string;
  concept: string;
  visual_focus: 'dots' | 'curves' | 'symmetry' | 'complete';
}

const LEARNING_STEPS: LearningStep[] = [
  {
    id: 1,
    title: "Grid Foundation",
    description: "Kolams begin with a grid of dots (pulli). These dots serve as anchor points for the entire pattern.",
    concept: "Mathematical grid system provides structure and ensures symmetry",
    visual_focus: 'dots'
  },
  {
    id: 2,
    title: "Curve Patterns",
    description: "Lines and curves connect the dots following 16 traditional curve patterns. Each pattern has specific connection rules.",
    concept: "Graph theory: vertices (dots) connected by edges (curves) following connectivity rules",
    visual_focus: 'curves'
  },
  {
    id: 3,
    title: "Symmetry Rules",
    description: "Traditional kolams follow strict symmetry rules - horizontal, vertical, or rotational symmetry.",
    concept: "Group theory: transformations that preserve the pattern's structure",
    visual_focus: 'symmetry'
  },
  {
    id: 4,
    title: "Complete Pattern",
    description: "The final kolam combines all elements: structured dots, connected curves, and perfect symmetry.",
    concept: "Eulerian paths: continuous drawing without lifting the hand, representing life's continuity",
    visual_focus: 'complete'
  }
];

export const KolamLearning: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pattern, setPattern] = useState<KolamPattern | null>(null);
  const [animationState, setAnimationState] = useState<'stopped' | 'playing' | 'paused'>('stopped');

  // Generate a learning pattern
  useEffect(() => {
    try {
      const learningPattern = KolamGenerator.generateKolam1D(7);
      learningPattern.name = "Learning Kolam";
      setPattern(learningPattern);
    } catch (error) {
      console.error('Error generating learning pattern:', error);
    }
  }, []);

  // Auto-advance steps when playing
  useEffect(() => {
    if (isPlaying && currentStep < LEARNING_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000); // 4 seconds per step

      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === LEARNING_STEPS.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep]);

  const handlePlay = () => {
    setIsPlaying(true);
    setAnimationState('playing');
  };

  const handlePause = () => {
    setIsPlaying(false);
    setAnimationState('paused');
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setAnimationState('stopped');
  };

  const handleStepForward = () => {
    if (currentStep < LEARNING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = LEARNING_STEPS[currentStep];

  return (
    <div className="kolam-learning space-y-8">
      {/* Learning Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <BookOpen className="mr-3 text-amber-600" />
          Learn Kolam Design Principles
        </h2>
        <p className="text-gray-600">
          Discover the mathematical and cultural principles behind traditional kolam patterns through interactive learning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Learning Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Interactive Demonstration</h3>
          
          {pattern ? (
            <div className="bg-amber-900 rounded-lg p-6 flex justify-center">
              <KolamDisplay
                pattern={pattern}
                animate={animationState === 'playing'}
                animationState={animationState}
                animationTiming={3000}
                className="max-w-sm"
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-12 text-center">
              <p className="text-gray-500">Loading learning pattern...</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={handleReset}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Reset to beginning"
            >
              <RotateCcw className="h-5 w-5 text-gray-600" />
            </button>
            
            <button
              onClick={handleStepBack}
              disabled={currentStep === 0}
              className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="Previous step"
            >
              <SkipBack className="h-5 w-5 text-gray-600" />
            </button>

            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStep === LEARNING_STEPS.length - 1}
              className="p-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              title="Next step"
            >
              <SkipForward className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Step {currentStep + 1} of {LEARNING_STEPS.length}</span>
              <span>{Math.round(((currentStep + 1) / LEARNING_STEPS.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / LEARNING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Learning Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
              {currentStep + 1}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{currentStepData.title}</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
                Mathematical Concept
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {currentStepData.concept}
              </p>
            </div>

            {/* Step-specific additional content */}
            {currentStep === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-800 mb-2">Grid Types</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <strong>Square Grid:</strong> Regular spacing, used for daily kolams</li>
                  <li>• <strong>Diamond Grid:</strong> Rotated 45°, creates dynamic patterns</li>
                  <li>• <strong>Triangular Grid:</strong> Complex arrangements for festivals</li>
                </ul>
              </div>
            )}

            {currentStep === 1 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-800 mb-2">16 Curve Patterns</h5>
                <p className="text-sm text-green-700">
                  Traditional kolams use 16 standardized curve patterns, each with specific connection rules. 
                  These patterns ensure the kolam can be drawn as a continuous line.
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-medium text-purple-800 mb-2">Symmetry in Nature</h5>
                <p className="text-sm text-purple-700">
                  Kolam symmetry reflects natural patterns - from flower petals to crystal structures. 
                  This mathematical beauty connects art with science.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h5 className="font-medium text-orange-800 mb-2">Cultural Significance</h5>
                <p className="text-sm text-orange-700">
                  The continuous line represents the cycle of life, prosperity, and protection. 
                  Drawing kolams is a meditative practice that connects mathematics with spirituality.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};