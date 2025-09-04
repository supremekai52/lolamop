'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, Sparkles, Calendar, MapPin } from 'lucide-react';
import kolamDataset from '@/data/kolamDataset.json';
import { KolamGenerator } from '@/utils/kolamGenerator';
import { KolamDisplay } from './KolamDisplay';
import { KolamPattern } from '@/types/kolam';

interface KolamDatasetItem {
  id: string;
  name: string;
  grid_size: number;
  grid_type: string;
  kolam_type: string;
  region: string;
  occasion: string;
  symmetry: string;
  cultural_notes: string;
  mathematical_concept: string;
  difficulty: string;
  patterns_used: number[];
  rule_set: {
    grid_size: number;
    symmetry_type: string;
    base_patterns: number[];
  };
}

export const KolamExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [filteredKolams, setFilteredKolams] = useState<KolamDatasetItem[]>(kolamDataset.kolams);
  const [selectedKolam, setSelectedKolam] = useState<KolamDatasetItem | null>(null);
  const [generatedPattern, setGeneratedPattern] = useState<KolamPattern | null>(null);

  // Filter kolams based on search and filters
  useEffect(() => {
    let filtered = kolamDataset.kolams.filter((kolam) => {
      const matchesSearch = kolam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           kolam.cultural_notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || kolam.kolam_type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || kolam.difficulty === selectedDifficulty;
      const matchesRegion = selectedRegion === 'all' || kolam.region === selectedRegion;
      const matchesOccasion = selectedOccasion === 'all' || kolam.occasion === selectedOccasion;

      return matchesSearch && matchesType && matchesDifficulty && matchesRegion && matchesOccasion;
    });

    setFilteredKolams(filtered);
  }, [searchTerm, selectedType, selectedDifficulty, selectedRegion, selectedOccasion]);

  // Generate pattern when kolam is selected
  useEffect(() => {
    if (selectedKolam) {
      try {
        const pattern = KolamGenerator.generateKolam1D(selectedKolam.grid_size);
        pattern.name = selectedKolam.name;
        setGeneratedPattern(pattern);
      } catch (error) {
        console.error('Error generating pattern:', error);
        setGeneratedPattern(null);
      }
    }
  }, [selectedKolam]);

  // Get unique values for filters
  const kolamTypes = [...new Set(kolamDataset.kolams.map(k => k.kolam_type))];
  const difficulties = [...new Set(kolamDataset.kolams.map(k => k.difficulty))];
  const regions = [...new Set(kolamDataset.kolams.map(k => k.region))];
  const occasions = [...new Set(kolamDataset.kolams.map(k => k.occasion))];

  return (
    <div className="kolam-explorer space-y-8">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Grid className="mr-3 text-amber-600" />
          Explore Traditional Kolam Patterns
        </h2>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search kolams by name or cultural notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Types</option>
              {kolamTypes.map(type => (
                <option key={type} value={type} className="capitalize">{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty} className="capitalize">{difficulty}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
            <select
              value={selectedOccasion}
              onChange={(e) => setSelectedOccasion(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Occasions</option>
              {occasions.map(occasion => (
                <option key={occasion} value={occasion}>{occasion}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolam List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Found {filteredKolams.length} kolams
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredKolams.map((kolam) => (
                <div
                  key={kolam.id}
                  onClick={() => setSelectedKolam(kolam)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedKolam?.id === kolam.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                  }`}
                >
                  <h4 className="font-medium text-gray-800">{kolam.name}</h4>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                    <span className="flex items-center">
                      <Grid className="h-3 w-3 mr-1" />
                      {kolam.grid_size}×{kolam.grid_size}
                    </span>
                    <span className="flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {kolam.difficulty}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {kolam.region}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {kolam.cultural_notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Kolam Details */}
        <div className="lg:col-span-2">
          {selectedKolam ? (
            <div className="space-y-6">
              {/* Generated Pattern */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedKolam.name}</h3>
                
                {generatedPattern ? (
                  <div className="flex justify-center bg-amber-900 rounded-lg p-8">
                    <KolamDisplay
                      pattern={generatedPattern}
                      animate={false}
                      className="max-w-md"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">Generating pattern...</p>
                  </div>
                )}
              </div>

              {/* Kolam Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Pattern Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Technical Details</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Grid Size:</span>
                          <span className="font-medium">{selectedKolam.grid_size}×{selectedKolam.grid_size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Grid Type:</span>
                          <span className="font-medium capitalize">{selectedKolam.grid_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kolam Type:</span>
                          <span className="font-medium capitalize">{selectedKolam.kolam_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Symmetry:</span>
                          <span className="font-medium">{selectedKolam.symmetry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Difficulty:</span>
                          <span className="font-medium capitalize">{selectedKolam.difficulty}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Patterns Used</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedKolam.patterns_used.map((pattern) => (
                          <span
                            key={pattern}
                            className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium"
                          >
                            {pattern}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Cultural Context
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Region:</span>
                          <span className="font-medium">{selectedKolam.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Occasion:</span>
                          <span className="font-medium">{selectedKolam.occasion}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                        {selectedKolam.cultural_notes}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Mathematical Concept</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedKolam.mathematical_concept}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Select a Kolam Pattern</h3>
              <p className="text-gray-500">
                Choose a kolam from the list to view its details and cultural significance
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};