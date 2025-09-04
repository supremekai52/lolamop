# Zen Kolam Platform Architecture

## System Overview

The Zen Kolam platform is a comprehensive system for analyzing, generating, and learning about traditional South Indian kolam patterns. It combines modern web technologies with computer vision and mathematical algorithms to preserve and study cultural heritage.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                        │
├─────────────────────────────────────────────────────────────────┤
│  Navigation Layer                                               │
│  ├── Generator Tab    ├── Explorer Tab    ├── Analyzer Tab      │
│  ├── Learning Tab     └── Rule Editor Tab                       │
├─────────────────────────────────────────────────────────────────┤
│  Component Layer                                                │
│  ├── KolamDisplay     ├── KolamExplanation                      │
│  ├── Navigation       └── Platform Wrapper                     │
├─────────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                           │
│  ├── KolamGenerator   ├── KolamExporter                         │
│  ├── SVGGenerator     └── URL Parameter Management              │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                     │
│  ├── 16 Curve Patterns ├── Kolam Dataset                       │
│  ├── Connectivity Rules └── Cultural Metadata                  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP API
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend (Python FastAPI)                      │
├─────────────────────────────────────────────────────────────────┤
│  API Layer                                                      │
│  ├── /analyze-kolam   └── /reconstruct-kolam                    │
├─────────────────────────────────────────────────────────────────┤
│  Analysis Engine                                                │
│  ├── Computer Vision  ├── Pattern Recognition                   │
│  ├── Symmetry Detection └── Graph Validation                    │
├─────────────────────────────────────────────────────────────────┤
│  Core Libraries                                                 │
│  ├── OpenCV          ├── NumPy           ├── NetworkX          │
│  ├── scikit-image    └── Pillow                                │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### 1. KolamPlatform (Main Container)
- **Purpose**: Root component managing tab navigation and global state
- **Dependencies**: Navigation, all tab components
- **State**: Active tab, global settings

#### 2. Navigation
- **Purpose**: Tab-based navigation with responsive design
- **Features**: Desktop tabs, mobile dropdown, active state management
- **Accessibility**: Keyboard navigation, ARIA labels

#### 3. KolamEditor (Generator Tab)
- **Purpose**: Interactive kolam generation with real-time controls
- **Features**: Size control, animation, export options
- **State**: Pattern data, animation state, export status

#### 4. KolamExplorer (Explorer Tab)
- **Purpose**: Browse curated kolam dataset with filtering
- **Features**: Search, multi-dimensional filtering, pattern details
- **Data Source**: kolamDataset.json

#### 5. KolamAnalyzer (Analyzer Tab)
- **Purpose**: Upload and analyze kolam images using AI backend
- **Features**: Drag-and-drop upload, analysis results, reconstruction
- **Backend Integration**: FastAPI endpoints

#### 6. KolamLearning (Learning Tab)
- **Purpose**: Interactive educational content about kolam principles
- **Features**: Step-by-step tutorials, mathematical explanations
- **Pedagogy**: Progressive disclosure, visual learning

#### 7. KolamRuleEditor (Rule Editor Tab)
- **Purpose**: Advanced rule editing with JSON manipulation
- **Features**: Parameter controls, JSON editor, live preview
- **Validation**: Real-time syntax checking

#### 8. KolamDisplay (Shared Component)
- **Purpose**: SVG rendering with animation support
- **Features**: Responsive scaling, animation controls, export-ready
- **Performance**: Optimized SVG paths, efficient animations

#### 9. KolamExplanation (Shared Component)
- **Purpose**: Educational content about specific patterns
- **Features**: Mathematical analysis, cultural context, drawing instructions
- **Content**: Dynamic based on pattern characteristics

### Backend Services

#### 1. KolamAnalyzer Class
```python
class KolamAnalyzer:
    @staticmethod
    def detect_dots(image: np.ndarray) -> List[Tuple[int, int, int]]
    
    @staticmethod
    def detect_curves(image: np.ndarray) -> List[np.ndarray]
    
    @staticmethod
    def classify_grid_type(dots: List[Tuple[int, int, int]]) -> str
    
    @staticmethod
    def detect_symmetry(image: np.ndarray) -> Dict[str, bool]
    
    @staticmethod
    def classify_kolam_type(curves: List[np.ndarray], dots: List[Tuple[int, int, int]]) -> str
    
    @staticmethod
    def validate_connectivity(curves: List[np.ndarray]) -> bool
```

## Data Flow

### 1. Pattern Generation Flow
```
User Input (size, parameters) 
    ↓
KolamGenerator.proposeKolam1D()
    ↓
Apply symmetry transformations
    ↓
Convert to visual coordinates
    ↓
Generate SVG paths
    ↓
Render in KolamDisplay
```

### 2. Image Analysis Flow
```
User uploads image
    ↓
Frontend sends to /analyze-kolam
    ↓
Backend processes with OpenCV
    ↓
Extract dots, curves, symmetry
    ↓
Classify type and validate connectivity
    ↓
Return analysis JSON
    ↓
Frontend displays results
```

### 3. Pattern Reconstruction Flow
```
Analyzed image
    ↓
Extract geometric features
    ↓
Map to 16 curve patterns
    ↓
Generate rule set JSON
    ↓
Reconstruct as SVG
    ↓
Return both rule set and SVG
```

## Mathematical Foundation

### 16 Curve Pattern System
Based on traditional kolam drawing, each grid cell can contain one of 16 predefined curve patterns:

```typescript
interface KolamCurvePattern {
  id: number;                    // 1-16 pattern index
  points: CurvePoint[];          // Curve coordinate points
  hasDownConnection: boolean;    // Can connect downward
  hasRightConnection: boolean;   // Can connect rightward
}
```

### Connectivity Rules
```typescript
// Patterns that can connect in each direction
pt_dn = [0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1];
pt_rt = [0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1];

// Compatible pattern combinations
mate_pt_dn = {
  1: [2, 3, 5, 6, 9, 10, 12],
  2: [4, 7, 8, 11, 13, 14, 15, 16]
};
```

### Symmetry Transformations
```typescript
// Mirror transformations for symmetry
h_inv = [1, 2, 5, 4, 3, 9, 8, 7, 6, 10, 11, 12, 15, 14, 13, 16];
v_inv = [1, 4, 3, 2, 5, 7, 6, 9, 8, 10, 11, 14, 13, 12, 15, 16];
```

## Performance Considerations

### Frontend Optimization
- **SVG Rendering**: Vector-based for scalability
- **Animation Performance**: CSS transforms and stroke-dasharray
- **Code Splitting**: Lazy loading of tab components
- **Responsive Design**: Mobile-first approach

### Backend Optimization
- **Image Processing**: Resize large images before analysis
- **Caching**: Cache analysis results for repeated requests
- **Async Processing**: Non-blocking image operations
- **Memory Management**: Efficient OpenCV usage

## Security Considerations

### Frontend Security
- **Input Validation**: File type and size restrictions
- **XSS Prevention**: Sanitized SVG output
- **CORS Configuration**: Restricted origins

### Backend Security
- **File Upload Limits**: Maximum file size restrictions
- **Input Sanitization**: Validate all uploaded images
- **Error Handling**: No sensitive information in error messages
- **Rate Limiting**: Prevent abuse of analysis endpoints

## Deployment Architecture

### Development Environment
```
Frontend: http://localhost:3000 (Next.js)
Backend:  http://localhost:8000 (FastAPI)
```

### Production Environment
```
Frontend: Vercel/Netlify (Static deployment)
Backend:  Heroku/AWS/GCP (Container deployment)
Database: Not required (stateless analysis)
CDN:      For static assets and generated SVGs
```

## API Integration

### Frontend to Backend Communication
```typescript
// Analysis request
const response = await fetch('http://localhost:8000/analyze-kolam', {
  method: 'POST',
  body: formData,
});

// Handle response
const result: AnalysisResult = await response.json();
```

### Error Handling Strategy
```typescript
try {
  const result = await analyzeKolam(file);
  setAnalysisResult(result);
} catch (error) {
  setError(error.message);
  // Graceful degradation - continue with frontend-only features
}
```

## Extensibility

### Adding New Analysis Features
1. **Extend KolamAnalyzer class** with new methods
2. **Update API endpoints** to include new data
3. **Modify frontend components** to display new information
4. **Add tests** for new functionality

### Adding New Pattern Types
1. **Extend KOLAM_CURVE_PATTERNS** with new patterns
2. **Update connectivity rules** for new patterns
3. **Modify generator algorithm** to handle new types
4. **Update cultural dataset** with new pattern information

### Adding New Export Formats
1. **Extend KolamExporter class** with new format methods
2. **Update UI** with new export options
3. **Add format-specific optimizations**
4. **Test cross-platform compatibility**

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Component logic and utilities
- **Integration Tests**: Component interactions
- **Visual Tests**: SVG rendering accuracy
- **Performance Tests**: Animation smoothness

### Backend Testing
- **Unit Tests**: Individual analysis functions
- **Integration Tests**: Full analysis pipeline
- **Image Tests**: Various kolam image types
- **Performance Tests**: Analysis speed and memory usage

## Monitoring and Analytics

### Frontend Monitoring
- **User Interactions**: Track feature usage
- **Performance Metrics**: Page load times, animation performance
- **Error Tracking**: Client-side error reporting

### Backend Monitoring
- **API Performance**: Response times and success rates
- **Resource Usage**: CPU and memory consumption
- **Error Rates**: Analysis failure tracking
- **Image Processing**: Success rates by image type

This architecture ensures scalability, maintainability, and cultural authenticity while providing a modern, accessible platform for kolam education and preservation.