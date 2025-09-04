# Zen Kolam - Complete Kolam Analyzer & Generator Platform

A comprehensive Next.js + Python platform for analyzing, generating, and learning about traditional South Indian kolam patterns. This project satisfies the AICTE problem statement: "Identify the design principles behind kolam designs and recreate the kolams."

## 🌟 Features

### 🎨 **Kolam Generator**
- **Advanced Algorithm**: Uses authentic 16-curve pattern system with mathematical connectivity rules
- **1D/2D Symmetry**: Generate patterns with horizontal, vertical, and rotational symmetry
- **Live Animation**: Watch patterns draw themselves with customizable timing
- **Multiple Exports**: SVG, PNG, and animated GIF downloads

### 🔍 **Kolam Analyzer** (AI-Powered)
- **Computer Vision**: Detect dots and curves using OpenCV and Hough transforms
- **Pattern Recognition**: Classify kolam types (pulli, sikku, chuzhi) automatically
- **Symmetry Detection**: Identify bilateral and rotational symmetry patterns
- **Graph Validation**: Check Eulerian path connectivity for authentic kolams
- **Cultural Classification**: Determine regional styles and occasions

### 📚 **Learning Mode**
- **Interactive Tutorials**: Step-by-step explanation of kolam principles
- **Mathematical Concepts**: Graph theory, symmetry, and tessellation explained
- **Cultural Context**: Historical significance and regional variations
- **Progressive Animation**: Visual learning with pause/play controls

### 🗂️ **Pattern Explorer**
- **Curated Dataset**: 50+ authentic kolam patterns with metadata
- **Advanced Filtering**: Search by type, difficulty, region, and occasion
- **Cultural Information**: Traditional context and mathematical properties
- **Pattern Comparison**: Side-by-side analysis of different styles

### ⚙️ **Rule Editor**
- **JSON-Based Rules**: Edit kolam generation parameters directly
- **Live Preview**: See changes instantly as you modify rules
- **Import/Export**: Share and save custom rule sets
- **Validation**: Real-time error checking for rule syntax

## 🏗️ Architecture

### Frontend (Next.js 15 + TypeScript)
```
src/
├── components/
│   ├── KolamPlatform.tsx      # Main platform wrapper
│   ├── KolamGenerator.tsx     # Pattern generation interface
│   ├── KolamAnalyzer.tsx      # Image upload and analysis
│   ├── KolamExplorer.tsx      # Pattern browsing and filtering
│   ├── KolamLearning.tsx      # Interactive learning modules
│   ├── KolamRuleEditor.tsx    # JSON rule editing
│   ├── KolamDisplay.tsx       # SVG rendering component
│   ├── KolamExplanation.tsx   # Pattern explanation panel
│   └── Navigation.tsx         # Platform navigation
├── utils/
│   ├── kolamGenerator.ts      # Core generation algorithm
│   ├── kolamExporter.ts       # Export functionality
│   ├── svgGenerator.ts        # SVG creation utilities
│   └── svgPathGenerator.ts    # SVG path generation
├── data/
│   ├── kolamPatterns.ts       # 16 curve pattern definitions
│   ├── kolamDataset.json      # Curated kolam collection
│   └── kolamPatternsData.json # Pattern coordinate data
└── types/
    └── kolam.ts               # TypeScript type definitions
```

### Backend (Python + FastAPI)
```
backend/
├── main.py              # FastAPI server with analysis endpoints
├── requirements.txt     # Python dependencies
└── start.py            # Server startup script
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.8+ (for analyzer backend)

### Frontend Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Backend Setup (Optional - for analyzer features)
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the analyzer service
python start.py
```

The backend runs on `http://localhost:8000` and provides:
- `/analyze-kolam` - Image analysis endpoint
- `/reconstruct-kolam` - Pattern reconstruction endpoint

## 📖 Core Algorithm Explanation

### Kolam Generation Algorithm
Based on the research paper "Kolam Generator" (MATLAB Central), our implementation uses:

```typescript
// 1. Generate base pattern using connectivity rules
const matrix = KolamGenerator.proposeKolam1D(size);

// 2. Apply symmetry transformations
const symmetricMatrix = applySymmetryRules(matrix, symmetryType);

// 3. Convert to visual coordinates
const pattern = drawKolam(symmetricMatrix);

// 4. Render as SVG with 16 curve patterns
const svg = generateKolamSVG(pattern, options);
```

### Key Mathematical Concepts

1. **16 Curve Patterns**: Each grid cell uses one of 16 predefined curve patterns
2. **Connectivity Rules**: `pt_dn` and `pt_rt` arrays define which patterns can connect
3. **Symmetry Transforms**: `h_inv` and `v_inv` arrays create mirror symmetries
4. **Graph Theory**: Patterns form connected graphs with Eulerian path properties

### Cultural Authenticity

- **Traditional Types**: Pulli (dots), Sikku (lines), Chuzhi (mixed)
- **Regional Variations**: Tamil Nadu, Karnataka, Andhra Pradesh styles
- **Occasion-Based**: Daily, festival, temple, and wedding kolams
- **Mathematical Heritage**: 2000+ years of geometric pattern tradition

## 🔬 Analysis Features

### Computer Vision Pipeline
1. **Preprocessing**: Gaussian blur and noise reduction
2. **Dot Detection**: Hough Circle Transform with parameter tuning
3. **Curve Detection**: Canny edge detection + contour analysis
4. **Grid Classification**: Distance analysis for square/diamond/irregular grids
5. **Symmetry Analysis**: Reflection and rotation detection
6. **Connectivity Validation**: Graph theory for Eulerian path checking

### Pattern Recognition
- **Type Classification**: ML-based classification of kolam types
- **Cultural Mapping**: Automatic region and occasion identification
- **Rule Extraction**: Convert visual patterns back to generation rules
- **Confidence Scoring**: Reliability metrics for analysis results

## 📱 Mobile Support

The platform is fully responsive with:
- Touch-friendly controls for mobile devices
- Optimized SVG rendering for all screen sizes
- Progressive web app capabilities
- Offline pattern generation (frontend only)

## 🎯 Export Options

### Static Exports
- **SVG**: Vector format for scalability and web embedding
- **PNG**: High-resolution raster images
- **JSON**: Rule sets for sharing and modification

### Dynamic Exports
- **Animated GIF**: Progressive drawing animation
- **Embed Code**: HTML snippets for websites
- **API URLs**: Direct links to generated patterns

## 🔗 API Endpoints

### Static SVG Generation
```
GET /api/kolam?size=7&background=%23fef3c7&brush=%23d97706
```

Parameters:
- `size`: Grid size (3-15)
- `background`: Background color (hex)
- `brush`: Line/dot color (hex)

### Analysis Endpoints (Backend Required)
```
POST /analyze-kolam
Content-Type: multipart/form-data
Body: image file

POST /reconstruct-kolam  
Content-Type: multipart/form-data
Body: image file
```

## 🧪 Development

### Running Tests
```bash
# Frontend tests
pnpm test

# Backend tests
cd backend && python -m pytest
```

### Code Structure
- **Modular Components**: Each feature in separate, focused components
- **Type Safety**: Full TypeScript coverage with strict typing
- **Performance**: SVG-based rendering for optimal performance
- **Accessibility**: WCAG 2.1 compliant interface design

## 📚 Educational Value

### Mathematical Learning
- **Graph Theory**: Vertices, edges, and connectivity
- **Symmetry Groups**: Reflection and rotation transformations
- **Tessellation**: Regular and semi-regular tilings
- **Algorithm Design**: Pattern generation and validation

### Cultural Preservation
- **Historical Context**: 2000+ years of kolam tradition
- **Regional Diversity**: Different styles across South India
- **Spiritual Significance**: Meditation and mathematical contemplation
- **Modern Applications**: Computer graphics and pattern design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Research Foundation**: Based on "Kolam Generator" by MATLAB Central
- **Cultural Consultants**: Tamil Nadu kolam artists and mathematicians
- **Academic Support**: AICTE problem statement guidance
- **Open Source**: Built with Next.js, FastAPI, OpenCV, and modern web technologies

## 🔮 Future Enhancements

- **AI Generation**: GPT-based kolam creation from text prompts
- **AR Visualization**: Mobile AR for real-world kolam projection
- **Community Features**: User-generated pattern sharing
- **Advanced ML**: GAN-based novel pattern generation
- **Educational Integration**: Curriculum modules for schools

---

**Zen Kolam** - Where ancient wisdom meets modern technology. Preserving cultural heritage through mathematical beauty.