"""
Kolam Analyzer Backend - FastAPI service for analyzing traditional kolam patterns
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from skimage import measure, morphology
import networkx as nx
from typing import List, Dict, Tuple, Optional
import json
import base64
from io import BytesIO
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Kolam Analyzer API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://zen-kolam.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class KolamAnalyzer:
    """Core kolam analysis engine using computer vision and graph theory"""
    
    @staticmethod
    def detect_dots(image: np.ndarray) -> List[Tuple[int, int, int]]:
        """Detect kolam dots using Hough Circle Transform"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (9, 9), 2)
        
        # Detect circles using HoughCircles
        circles = cv2.HoughCircles(
            blurred,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=20,
            param1=50,
            param2=30,
            minRadius=3,
            maxRadius=15
        )
        
        dots = []
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")
            for (x, y, r) in circles:
                dots.append((x, y, r))
        
        return dots
    
    @staticmethod
    def detect_curves(image: np.ndarray) -> List[np.ndarray]:
        """Detect curves and lines using edge detection and contour analysis"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Edge detection
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        
        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Filter and process contours
        curves = []
        for contour in contours:
            if cv2.contourArea(contour) > 50:  # Filter small noise
                # Approximate contour to reduce points
                epsilon = 0.02 * cv2.arcLength(contour, True)
                approx = cv2.approxPolyDP(contour, epsilon, True)
                curves.append(approx.reshape(-1, 2))
        
        return curves
    
    @staticmethod
    def classify_grid_type(dots: List[Tuple[int, int, int]]) -> str:
        """Classify grid arrangement (square, diamond, irregular)"""
        if len(dots) < 4:
            return "irregular"
        
        # Extract coordinates
        coords = np.array([(x, y) for x, y, _ in dots])
        
        # Calculate distances between adjacent dots
        distances = []
        for i in range(len(coords)):
            for j in range(i + 1, len(coords)):
                dist = np.linalg.norm(coords[i] - coords[j])
                distances.append(dist)
        
        # Analyze distance distribution
        distances = np.array(distances)
        std_dev = np.std(distances)
        
        if std_dev < 10:  # Very uniform spacing
            return "square"
        elif std_dev < 25:  # Moderate variation
            return "diamond"
        else:
            return "irregular"
    
    @staticmethod
    def detect_symmetry(image: np.ndarray) -> Dict[str, bool]:
        """Detect various types of symmetry in the kolam"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        h, w = gray.shape
        
        # Horizontal symmetry
        left_half = gray[:, :w//2]
        right_half = cv2.flip(gray[:, w//2:], 1)
        h_symmetry = np.mean(np.abs(left_half - right_half[:, :left_half.shape[1]])) < 30
        
        # Vertical symmetry
        top_half = gray[:h//2, :]
        bottom_half = cv2.flip(gray[h//2:, :], 0)
        v_symmetry = np.mean(np.abs(top_half - bottom_half[:top_half.shape[0], :])) < 30
        
        # Rotational symmetry (90 degrees)
        rotated_90 = cv2.rotate(gray, cv2.ROTATE_90_CLOCKWISE)
        r_symmetry = np.mean(np.abs(gray - rotated_90)) < 30
        
        return {
            "horizontal": h_symmetry,
            "vertical": v_symmetry,
            "rotational_90": r_symmetry,
            "four_fold": h_symmetry and v_symmetry and r_symmetry
        }
    
    @staticmethod
    def classify_kolam_type(curves: List[np.ndarray], dots: List[Tuple[int, int, int]]) -> str:
        """Classify kolam type based on curve and dot patterns"""
        total_curves = len(curves)
        total_dots = len(dots)
        
        if total_dots > total_curves * 2:
            return "pulli"  # Dot-heavy kolam
        elif total_curves > total_dots:
            return "sikku"  # Line-heavy kolam
        else:
            return "chuzhi"  # Balanced kolam
    
    @staticmethod
    def validate_connectivity(curves: List[np.ndarray]) -> bool:
        """Check if curves form connected paths (Eulerian path validation)"""
        if not curves:
            return False
        
        # Create graph from curve endpoints
        G = nx.Graph()
        
        for i, curve in enumerate(curves):
            if len(curve) >= 2:
                start = tuple(curve[0])
                end = tuple(curve[-1])
                G.add_edge(start, end, curve_id=i)
        
        # Check if graph is connected and has Eulerian path
        if not nx.is_connected(G):
            return False
        
        # Count odd-degree vertices (Eulerian path condition)
        odd_degree_vertices = sum(1 for node in G.nodes() if G.degree(node) % 2 == 1)
        return odd_degree_vertices <= 2

@app.get("/")
async def root():
    return {"message": "Kolam Analyzer API", "version": "1.0.0"}

@app.post("/analyze-kolam")
async def analyze_kolam(file: UploadFile = File(...)):
    """Analyze uploaded kolam image and extract design principles"""
    try:
        # Read and process image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Analyze kolam components
        analyzer = KolamAnalyzer()
        
        # Detect dots and curves
        dots = analyzer.detect_dots(image)
        curves = analyzer.detect_curves(image)
        
        # Classify grid and kolam type
        grid_type = analyzer.classify_grid_type(dots)
        kolam_type = analyzer.classify_kolam_type(curves, dots)
        
        # Detect symmetry
        symmetry = analyzer.detect_symmetry(image)
        
        # Validate connectivity
        is_connected = analyzer.validate_connectivity(curves)
        
        # Determine grid size estimation
        if dots:
            coords = np.array([(x, y) for x, y, _ in dots])
            x_range = np.max(coords[:, 0]) - np.min(coords[:, 0])
            y_range = np.max(coords[:, 1]) - np.min(coords[:, 1])
            estimated_size = max(3, min(15, int(np.sqrt(len(dots)))))
        else:
            estimated_size = 7
        
        # Map detected curves to 16 base patterns (simplified mapping)
        curves_used = []
        for i, curve in enumerate(curves[:16]):  # Limit to 16 for mapping
            # Simple heuristic mapping based on curve complexity
            curve_length = len(curve)
            if curve_length < 5:
                curves_used.append(1)  # Simple pattern
            elif curve_length < 15:
                curves_used.append(min(16, (i % 8) + 2))  # Medium patterns
            else:
                curves_used.append(min(16, (i % 4) + 13))  # Complex patterns
        
        # Cultural classification
        cultural_notes = {
            "pulli": "Dot-based kolam, often used for daily practice",
            "sikku": "Line-based kolam with continuous paths, festival style",
            "chuzhi": "Balanced kolam combining dots and lines"
        }
        
        return JSONResponse({
            "success": True,
            "analysis": {
                "grid": f"{estimated_size}x{estimated_size} {grid_type}",
                "kolam_type": kolam_type,
                "symmetry": {
                    "type": "4-fold rotational" if symmetry["four_fold"] else 
                           "bilateral" if symmetry["horizontal"] and symmetry["vertical"] else
                           "horizontal" if symmetry["horizontal"] else
                           "vertical" if symmetry["vertical"] else "asymmetric",
                    "details": symmetry
                },
                "curves_used": curves_used,
                "connected": is_connected,
                "dots_detected": len(dots),
                "curves_detected": len(curves),
                "estimated_size": estimated_size,
                "cultural_notes": cultural_notes.get(kolam_type, "Traditional geometric pattern")
            }
        })
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/reconstruct-kolam")
async def reconstruct_kolam(file: UploadFile = File(...)):
    """Reconstruct kolam as SVG and rule set"""
    try:
        # Read and process image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        analyzer = KolamAnalyzer()
        
        # Extract components
        dots = analyzer.detect_dots(image)
        curves = analyzer.detect_curves(image)
        
        # Generate rule set (simplified reconstruction)
        rule_set = {
            "grid_size": max(3, min(15, int(np.sqrt(len(dots))) if dots else 7)),
            "patterns": [],
            "symmetry_type": "1D",
            "cultural_type": analyzer.classify_kolam_type(curves, dots)
        }
        
        # Map curves to patterns
        for i, curve in enumerate(curves):
            if len(curve) >= 2:
                # Normalize coordinates to 0-1 range
                normalized_points = []
                for point in curve:
                    x_norm = (point[0] - np.min(curve[:, 0])) / max(1, np.max(curve[:, 0]) - np.min(curve[:, 0]))
                    y_norm = (point[1] - np.min(curve[:, 1])) / max(1, np.max(curve[:, 1]) - np.min(curve[:, 1]))
                    normalized_points.append({"x": float(x_norm), "y": float(y_norm)})
                
                rule_set["patterns"].append({
                    "id": i + 1,
                    "points": normalized_points,
                    "hasDownConnection": len(normalized_points) > 3,
                    "hasRightConnection": len(normalized_points) > 2
                })
        
        # Generate basic SVG reconstruction
        svg_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style="background-color: #fef3c7;">
    <defs>
        <style>
            .kolam-curve {{ fill: none; stroke: #92400e; stroke-width: 2; stroke-linecap: round; }}
            .kolam-dot {{ fill: #92400e; }}
        </style>
    </defs>"""
        
        # Add reconstructed dots
        for x, y, r in dots:
            # Scale to SVG coordinates
            svg_x = (x / image.shape[1]) * 400
            svg_y = (y / image.shape[0]) * 400
            svg_content += f'\n    <circle class="kolam-dot" cx="{svg_x}" cy="{svg_y}" r="3"/>'
        
        # Add reconstructed curves
        for curve in curves:
            if len(curve) >= 2:
                path_data = f"M {(curve[0][0] / image.shape[1]) * 400} {(curve[0][1] / image.shape[0]) * 400}"
                for point in curve[1:]:
                    svg_x = (point[0] / image.shape[1]) * 400
                    svg_y = (point[1] / image.shape[0]) * 400
                    path_data += f" L {svg_x} {svg_y}"
                svg_content += f'\n    <path class="kolam-curve" d="{path_data}"/>'
        
        svg_content += "\n</svg>"
        
        return JSONResponse({
            "success": True,
            "reconstruction": {
                "svg": svg_content,
                "rule_set": rule_set,
                "confidence": 0.85  # Placeholder confidence score
            }
        })
        
    except Exception as e:
        logger.error(f"Reconstruction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Reconstruction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)