# Kolam Analyzer Backend

Python FastAPI service for analyzing traditional kolam patterns using computer vision and machine learning.

## Features

- **Image Analysis**: Detect dots and curves in uploaded kolam images
- **Pattern Classification**: Identify kolam types (pulli, sikku, chuzhi)
- **Symmetry Detection**: Analyze bilateral and rotational symmetry
- **Grid Recognition**: Classify grid arrangements (square, diamond, irregular)
- **Connectivity Validation**: Check Eulerian path properties
- **Pattern Reconstruction**: Convert images back to SVG and rule sets

## Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Start server
python start.py
```

## API Endpoints

### POST /analyze-kolam
Analyze uploaded kolam image and extract design principles.

**Request:**
- Content-Type: multipart/form-data
- Body: image file (PNG/JPG/JPEG/GIF/BMP)

**Response:**
```json
{
  "success": true,
  "analysis": {
    "grid": "7x7 square",
    "kolam_type": "sikku",
    "symmetry": {
      "type": "4-fold rotational",
      "details": {
        "horizontal": true,
        "vertical": true,
        "rotational_90": true,
        "four_fold": true
      }
    },
    "curves_used": [3, 7, 12],
    "connected": true,
    "dots_detected": 49,
    "curves_detected": 24,
    "estimated_size": 7,
    "cultural_notes": "Line-based kolam with continuous paths, festival style"
  }
}
```

### POST /reconstruct-kolam
Reconstruct kolam as SVG and rule set from uploaded image.

**Request:**
- Content-Type: multipart/form-data
- Body: image file

**Response:**
```json
{
  "success": true,
  "reconstruction": {
    "svg": "<svg>...</svg>",
    "rule_set": {
      "grid_size": 7,
      "patterns": [...],
      "symmetry_type": "1D",
      "cultural_type": "sikku"
    },
    "confidence": 0.85
  }
}
```

## Computer Vision Pipeline

### 1. Dot Detection
- **Preprocessing**: Gaussian blur for noise reduction
- **Circle Detection**: Hough Circle Transform with optimized parameters
- **Filtering**: Remove false positives based on size and spacing

### 2. Curve Detection
- **Edge Detection**: Canny edge detector with adaptive thresholds
- **Contour Analysis**: Find and approximate curve contours
- **Curve Fitting**: Convert pixel coordinates to smooth curves

### 3. Grid Classification
- **Distance Analysis**: Calculate spacing between detected dots
- **Pattern Recognition**: Identify square, diamond, or irregular arrangements
- **Size Estimation**: Determine grid dimensions from dot distribution

### 4. Symmetry Analysis
- **Reflection Symmetry**: Compare image halves for bilateral symmetry
- **Rotational Symmetry**: Test 90°, 180°, and 270° rotations
- **Statistical Validation**: Use pixel difference thresholds for accuracy

### 5. Connectivity Validation
- **Graph Construction**: Create graph from curve endpoints
- **Eulerian Path**: Check for continuous drawing possibility
- **Component Analysis**: Identify connected components

## Algorithm Details

### Dot Detection Parameters
```python
circles = cv2.HoughCircles(
    blurred,
    cv2.HOUGH_GRADIENT,
    dp=1,           # Inverse ratio of accumulator resolution
    minDist=20,     # Minimum distance between circle centers
    param1=50,      # Upper threshold for edge detection
    param2=30,      # Accumulator threshold for center detection
    minRadius=3,    # Minimum circle radius
    maxRadius=15    # Maximum circle radius
)
```

### Edge Detection Parameters
```python
edges = cv2.Canny(
    gray,
    50,             # Lower threshold
    150,            # Upper threshold
    apertureSize=3  # Sobel kernel size
)
```

### Symmetry Thresholds
- **Horizontal/Vertical**: Mean pixel difference < 30
- **Rotational**: Mean absolute difference < 30
- **Statistical Confidence**: 95% similarity required

## Cultural Classification

### Kolam Types
- **Pulli**: Dot-heavy patterns (dots > curves × 2)
- **Sikku**: Line-heavy patterns (curves > dots)
- **Chuzhi**: Balanced patterns (roughly equal dots and curves)

### Regional Styles
- **Tamil Nadu**: Traditional grid-based patterns
- **Karnataka**: Rangoli variations with color emphasis
- **Andhra Pradesh**: Muggulu with geometric complexity

### Occasion Classification
- **Daily Practice**: Simple 3×3 to 5×5 grids
- **Weekly Ritual**: Medium 7×7 to 9×9 grids
- **Festival Celebration**: Complex 11×11+ grids

## Error Handling

The API includes comprehensive error handling:
- **Image Validation**: Check file format and size
- **Processing Errors**: Graceful fallbacks for analysis failures
- **Parameter Validation**: Ensure valid input ranges
- **Timeout Protection**: Prevent long-running analysis

## Performance Optimization

- **Image Preprocessing**: Resize large images for faster processing
- **Caching**: Cache analysis results for repeated requests
- **Async Processing**: Non-blocking image analysis
- **Memory Management**: Efficient OpenCV memory usage

## Dependencies

- **FastAPI**: Modern Python web framework
- **OpenCV**: Computer vision and image processing
- **NumPy**: Numerical computing and array operations
- **scikit-image**: Advanced image processing algorithms
- **NetworkX**: Graph theory and connectivity analysis
- **Pillow**: Image format handling and conversion

## Development

### Running in Development
```bash
# Install development dependencies
pip install -r requirements.txt

# Start with auto-reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Testing
```bash
# Run tests
python -m pytest tests/

# Test specific endpoint
curl -X POST "http://localhost:8000/analyze-kolam" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@test_kolam.jpg"
```

### Adding New Analysis Features

1. **Extend KolamAnalyzer class** with new methods
2. **Add endpoint** in main.py
3. **Update response models** for new data
4. **Test with sample images** to validate accuracy

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloud Deployment
- **Heroku**: Use Procfile with gunicorn
- **AWS Lambda**: Serverless deployment with API Gateway
- **Google Cloud Run**: Containerized deployment
- **Azure Container Instances**: Scalable container hosting

## Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-analysis`
3. **Add tests** for new functionality
4. **Update documentation** with new features
5. **Submit pull request** with detailed description

## License

MIT License - see LICENSE file for details.