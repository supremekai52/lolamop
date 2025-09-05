'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, Loader2, CheckCircle, XCircle, Info } from 'lucide-react';

// Mock analysis for when backend is not available
interface AnalysisResult {
  success: boolean;
  analysis: {
    grid: string;
    kolam_type: string;
    symmetry: {
      type: string;
      details: {
        horizontal: boolean;
        vertical: boolean;
        rotational_90: boolean;
        four_fold: boolean;
      };
    };
    curves_used: number[];
    connected: boolean;
    dots_detected: number;
    curves_detected: number;
    estimated_size: number;
    cultural_notes: string;
  };
}

interface ReconstructionResult {
  success: boolean;
  reconstruction: {
    svg: string;
    rule_set: {
      grid_size: number;
      patterns: Array<{
        id: number;
        points: Array<{ x: number; y: number }>;
        hasDownConnection: boolean;
        hasRightConnection: boolean;
      }>;
      symmetry_type: string;
      cultural_type: string;
    };
    confidence: number;
  };
}

export const KolamAnalyzer: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [reconstructionResult, setReconstructionResult] = useState<ReconstructionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Display uploaded image
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Reset previous results
    setAnalysisResult(null);
    setReconstructionResult(null);
    setError(null);

    // Analyze the kolam
    await analyzeKolam(file);
  }, []);

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const generateMockAnalysis = (file: File): AnalysisResult => {
    // Generate a realistic mock analysis based on filename or random values
    const mockTypes = ['pulli', 'sikku', 'chuzhi'];
    const mockSymmetries = ['4-fold rotational', 'bilateral', 'horizontal', 'vertical', 'asymmetric'];
    const mockGridSizes = [5, 7, 9, 11];
    
    const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)];
    const randomSymmetry = mockSymmetries[Math.floor(Math.random() * mockSymmetries.length)];
    const randomSize = mockGridSizes[Math.floor(Math.random() * mockGridSizes.length)];
    
    return {
      success: true,
      analysis: {
        grid: `${randomSize}x${randomSize} square`,
        kolam_type: randomType,
        symmetry: {
          type: randomSymmetry,
          details: { horizontal: true, vertical: true, rotational_90: false, four_fold: false }
        },
        curves_used: [1, 3, 7, 12, 15],
        connected: true,
        dots_detected: randomSize * randomSize,
        curves_detected: Math.floor(Math.random() * 10) + 5,
        estimated_size: randomSize,
        cultural_notes: `Mock analysis: This appears to be a traditional ${randomType} kolam with ${randomSymmetry} symmetry. Backend analysis not available.`
      }
    };
  };

  const analyzeKolam = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Check if backend is available
      const isBackendUp = await checkBackendHealth();
      setBackendAvailable(isBackendUp);
      
      if (!isBackendUp) {
        // Use mock analysis when backend is not available
        const mockResult = generateMockAnalysis(file);
        setAnalysisResult(mockResult);
        setError('Backend not available - showing mock analysis. Start the Python backend for real AI analysis.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/analyze-kolam', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
      setBackendAvailable(true);

      // Also reconstruct the kolam
      await reconstructKolam(file);

    } catch (err) {
      // Fallback to mock analysis on any error
      const mockResult = generateMockAnalysis(file);
      setAnalysisResult(mockResult);
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(`Backend connection failed: ${errorMessage}. Showing mock analysis instead.`);
      console.error('Analysis error:', err);
      setBackendAvailable(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reconstructKolam = async (file: File) => {
    setIsReconstructing(true);

    try {
      // Skip reconstruction if backend is not available
      if (backendAvailable === false) {
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/reconstruct-kolam', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Reconstruction failed: ${response.statusText}`);
      }

      const result: ReconstructionResult = await response.json();
      setReconstructionResult(result);

    } catch (err) {
      console.error('Reconstruction error:', err);
      // Don't set error here as analysis might have succeeded
    } finally {
      setIsReconstructing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    multiple: false
  });

  const downloadRuleSet = () => {
    if (!reconstructionResult) return;

    const dataStr = JSON.stringify(reconstructionResult.reconstruction.rule_set, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kolam-rules.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="kolam-analyzer space-y-8">
      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <FileImage className="mr-3 text-amber-600" />
          Upload Kolam Image for Analysis
        </h2>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-amber-500 bg-amber-50'
              : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg text-amber-600">Drop the kolam image here...</p>
          ) : (
            <div>
              <p className="text-lg text-gray-600 mb-2">
                Drag & drop a kolam image here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports PNG, JPG, JPEG, GIF, BMP formats
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <Info className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-amber-700">{error}</span>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {(uploadedImage || isAnalyzing) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Original Image */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Original Image</h3>
            {uploadedImage ? (
              <img
                src={uploadedImage}
                alt="Uploaded kolam"
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          {/* Analysis Results */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              {isAnalyzing ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
              ) : analysisResult ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              ) : (
                <Info className="h-5 w-5 mr-2 text-gray-400" />
              )}
              Analysis Results
            </h3>

            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <p className="text-gray-600">Analyzing kolam pattern...</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Grid:</span>
                    <p className="text-gray-600">{analysisResult.analysis.grid}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <p className="text-gray-600 capitalize">{analysisResult.analysis.kolam_type}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Symmetry:</span>
                    <p className="text-gray-600">{analysisResult.analysis.symmetry.type}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Connected:</span>
                    <p className={`${analysisResult.analysis.connected ? 'text-green-600' : 'text-red-600'}`}>
                      {analysisResult.analysis.connected ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Dots:</span>
                    <p className="text-gray-600">{analysisResult.analysis.dots_detected}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Curves:</span>
                    <p className="text-gray-600">{analysisResult.analysis.curves_detected}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <span className="font-medium text-gray-700">Cultural Notes:</span>
                  <p className="text-gray-600 mt-1">{analysisResult.analysis.cultural_notes}</p>
                </div>

                <div className="border-t pt-4">
                  <span className="font-medium text-gray-700">Patterns Used:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {analysisResult.analysis.curves_used.map((pattern, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium"
                      >
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Upload an image to see analysis results</p>
            )}
          </div>
        </div>
      )}

      {/* Reconstruction Results */}
      {(reconstructionResult || isReconstructing) && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            {isReconstructing ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2 text-amber-500" />
            ) : reconstructionResult ? (
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            ) : (
              <Info className="h-5 w-5 mr-2 text-gray-400" />
            )}
            Reconstructed Kolam
          </h3>

          {isReconstructing ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto mb-2" />
                <p className="text-gray-600">Reconstructing kolam pattern...</p>
              </div>
            </div>
          ) : reconstructionResult ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div
                  className="border border-gray-200 rounded-lg p-4 bg-amber-50"
                  dangerouslySetInnerHTML={{ __html: reconstructionResult.reconstruction.svg }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Reconstruction Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Grid Size:</span>
                      <span className="font-medium">{reconstructionResult.reconstruction.rule_set.grid_size}×{reconstructionResult.reconstruction.rule_set.grid_size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Patterns Found:</span>
                      <span className="font-medium">{reconstructionResult.reconstruction.rule_set.patterns.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span className="font-medium">{(reconstructionResult.reconstruction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cultural Type:</span>
                      <span className="font-medium capitalize">{reconstructionResult.reconstruction.rule_set.cultural_type}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={downloadRuleSet}
                      className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                    >
                      Download Rule Set (JSON)
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([reconstructionResult.reconstruction.svg], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = 'reconstructed-kolam.svg';
                        link.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Download SVG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Backend Status */}
      <div className={`border rounded-lg p-4 ${
        backendAvailable === true 
          ? 'bg-green-50 border-green-200' 
          : backendAvailable === false 
          ? 'bg-amber-50 border-amber-200' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center">
          {backendAvailable === true ? (
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          ) : backendAvailable === false ? (
            <XCircle className="h-5 w-5 text-amber-500 mr-2" />
          ) : (
            <Info className="h-5 w-5 text-blue-500 mr-2" />
          )}
          <div>
            <p className={`font-medium ${
              backendAvailable === true 
                ? 'text-green-800' 
                : backendAvailable === false 
                ? 'text-amber-800' 
                : 'text-blue-800'
            }`}>
              {backendAvailable === true 
                ? 'Backend Connected' 
                : backendAvailable === false 
                ? 'Backend Offline - Using Mock Analysis' 
                : 'Backend Status Unknown'}
            </p>
            <p className={`text-sm ${
              backendAvailable === true 
                ? 'text-green-700' 
                : backendAvailable === false 
                ? 'text-amber-700' 
                : 'text-blue-700'
            }`}>
              {backendAvailable === true 
                ? 'AI-powered analysis is available with full computer vision capabilities.' 
                : backendAvailable === false 
                ? 'Start the Python backend for real AI analysis: cd backend && python start.py' 
                : 'To use full AI analysis, start the Python backend: cd backend && python start.py'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};