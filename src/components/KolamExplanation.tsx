'use client';

import React from 'react';
import { Info, Compass, Calculator, Heart, Globe } from 'lucide-react';
import { KolamPattern } from '@/types/kolam';

interface KolamExplanationProps {
  pattern: KolamPattern;
  analysisData?: {
    grid: string;
    kolam_type: string;
    symmetry: { type: string };
    connected: boolean;
    cultural_notes: string;
  };
}

export const KolamExplanation: React.FC<KolamExplanationProps> = ({ 
  pattern, 
  analysisData 
}) => {
  // Determine kolam characteristics
  const gridSize = pattern.grid.size;
  const dotCount = pattern.dots.length;
  const curveCount = pattern.curves.length;
  const symmetryType = pattern.symmetryType;

  // Mathematical analysis
  const isEulerianPath = curveCount > 0; // Simplified check
  const complexityScore = Math.min(10, Math.floor((gridSize * curveCount) / 10));

  // Cultural classification based on pattern characteristics
  const getKolamType = () => {
    if (analysisData) return analysisData.kolam_type;
    
    if (dotCount > curveCount * 2) return 'pulli';
    if (curveCount > dotCount) return 'sikku';
    return 'chuzhi';
  };

  const getOccasionType = () => {
    if (gridSize <= 5) return 'Daily practice';
    if (gridSize <= 9) return 'Weekly ritual';
    return 'Festival celebration';
  };

  const getMathematicalConcept = () => {
    const concepts = [];
    
    if (symmetryType === '1D') concepts.push('1D symmetry');
    if (symmetryType === '2D') concepts.push('2D symmetry');
    if (isEulerianPath) concepts.push('Eulerian path');
    if (gridSize % 2 === 1) concepts.push('Odd-order tessellation');
    
    return concepts.join(', ') || 'Basic geometric pattern';
  };

  const kolamType = getKolamType();
  const occasionType = getOccasionType();
  const mathematicalConcept = getMathematicalConcept();

  return (
    <div className="kolam-explanation bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Info className="mr-2 text-amber-600" />
        Pattern Explanation
      </h3>

      <div className="space-y-6">
        {/* Technical Analysis */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <Calculator className="h-4 w-4 mr-2 text-blue-500" />
            Mathematical Properties
          </h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Grid:</span>
                <p className="text-blue-600">{gridSize}×{gridSize} {pattern.grid.cells[0]?.[0]?.dotCenter ? 'dot grid' : 'geometric grid'}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Symmetry:</span>
                <p className="text-blue-600">{analysisData?.symmetry.type || symmetryType}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Elements:</span>
                <p className="text-blue-600">{dotCount} dots, {curveCount} curves</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Connectivity:</span>
                <p className="text-blue-600">{analysisData?.connected !== false ? 'Connected' : 'Disconnected'}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <span className="text-blue-700 font-medium">Mathematical Concept:</span>
              <p className="text-blue-600 mt-1">{mathematicalConcept}</p>
            </div>
          </div>
        </div>

        {/* Cultural Context */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            Cultural Significance
          </h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-red-700 font-medium">Type:</span>
                <p className="text-red-600 capitalize">{kolamType}</p>
              </div>
              <div>
                <span className="text-red-700 font-medium">Occasion:</span>
                <p className="text-red-600">{occasionType}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-red-600 leading-relaxed">
                {analysisData?.cultural_notes || 
                 `This ${kolamType} kolam represents traditional South Indian geometric art. 
                  The ${symmetryType} symmetry and ${gridSize}×${gridSize} grid structure 
                  follow ancient mathematical principles, symbolizing cosmic order and prosperity.`}
              </p>
            </div>
          </div>
        </div>

        {/* Regional Context */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <Globe className="h-4 w-4 mr-2 text-green-500" />
            Regional & Historical Context
          </h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-sm text-green-700 space-y-2">
              <p>
                <strong>Origin:</strong> Tamil Nadu, South India - practiced for over 2,000 years
              </p>
              <p>
                <strong>Purpose:</strong> Daily spiritual practice, welcoming prosperity, and mathematical meditation
              </p>
              <p>
                <strong>Tradition:</strong> Drawn with rice flour at dawn, representing the impermanence of life and the beauty of creation
              </p>
              <p>
                <strong>Modern Relevance:</strong> Studied in mathematics education for symmetry, graph theory, and algorithmic thinking
              </p>
            </div>
          </div>
        </div>

        {/* Drawing Instructions */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <Compass className="h-4 w-4 mr-2 text-purple-500" />
            Traditional Drawing Method
          </h4>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <ol className="text-sm text-purple-700 space-y-2">
              <li><strong>1. Dot Grid:</strong> Place {dotCount} dots in a {gridSize}×{gridSize} grid pattern</li>
              <li><strong>2. Connect Curves:</strong> Draw {curveCount} connecting curves following traditional patterns</li>
              <li><strong>3. Maintain Symmetry:</strong> Ensure {symmetryType} symmetry throughout the design</li>
              <li><strong>4. Continuous Path:</strong> Complete the kolam as a single continuous line when possible</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};