"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MousePointer2, Square, Activity, Type, 
  DoorOpen, LayoutGrid, Layers, Settings, Save, 
  Undo, Redo, Lock, Unlock, Trash2, 
  Check, X, ChevronRight, ChevronDown, Map as MapIcon,
  Maximize, Edit3, ArrowRight, ArrowUp, Circle, Download, Copy, CheckCircle2
} from 'lucide-react';

// --- Types & Enums ---

type FeatureType = 
  | 'rectangle' | 'circle' | 'polygon' | 'path' | 'text' 
  | 'door' | 'window' | 'wall' | 'stairs' | 'marker';

interface Point { x: number; y: number; }

interface RoomTemplate {
  name: string;
  width: number;
  height: number;
  description: string;
  icon: any;
}

interface MapLayer {
  id: string;
  name: string;
  isVisible: boolean;
}

interface MapFeature {
  id: string;
  type: FeatureType;
  name: string;
  coordinates: Point[]; // stored in "Meters" relative to origin
  width: number;
  height: number;
  radius: number;
  pathColor: string;
  pathThickness: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  textContent: string;
  fontSize: number;
  rotation: number;
  opacity: number;
  layerId: number;
  level: number;
  amenity?: string;
  isLocked: boolean;
}

// --- Constants ---

const COLORS = [
  '#FF5252', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E',
  '#607D8B', '#424242', '#000000', '#FFFFFF'
];

const TEMPLATES: RoomTemplate[] = [
  { name: 'Custom', width: 7.5, height: 7.0, description: 'Set your own dimensions', icon: Edit3 },
  { name: 'Small Classroom', width: 7.0, height: 7.0, description: '49 m² - 20-25 students', icon: Square },
  { name: 'Standard Classroom', width: 7.0, height: 9.0, description: '63 m² - 30-35 students', icon: Square },
  { name: 'Large Classroom', width: 9.0, height: 9.0, description: '81 m² - 40+ students', icon: LayoutGrid },
  { name: 'Small Office', width: 5.0, height: 4.0, description: '20 m² - Individual office', icon: Square },
  { name: 'Large Office', width: 12.0, height: 10.0, description: '120 m² - Open workspace', icon: LayoutGrid },
  { name: 'Grocery Store', width: 25.0, height: 20.0, description: '500 m² - Small grocery', icon: LayoutGrid },
];

// --- Helper Functions ---

const generateId = () => Math.random().toString(36).substr(2, 9);

const deepCopy = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

const getDistance = (p1: Point, p2: Point) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// --- Main Component ---

export default function IndoorMapCreator() {
  // -- App State --
  const [showSetup, setShowSetup] = useState(true);
  
  // Map Properties
  const [roomName, setRoomName] = useState('Untitled Map');
  const [roomWidth, setRoomWidth] = useState(7.5);
  const [roomHeight, setRoomHeight] = useState(7.0);
  const [baseLat, setBaseLat] = useState(43.60666618464);
  const [baseLon, setBaseLon] = useState(3.92162187466);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [originPos, setOriginPos] = useState<'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'>('bottom-left');
  
  // View State
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isViewLocked, setIsViewLocked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tools & Selection
  const [currentTool, setCurrentTool] = useState<FeatureType | 'select'>('select');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [pathPoints, setPathPoints] = useState<Point[]>([]); 
  
  // Dragging Refs
  const lastMousePosRef = useRef<Point | null>(null);
  const isDraggingRef = useRef(false);

  // Data State
  const [features, setFeatures] = useState<MapFeature[]>([]);
  const [layers, setLayers] = useState<MapLayer[]>([{ id: '0', name: 'Default Layer', isVisible: true }]);
  const [activeLayerId, setActiveLayerId] = useState(0);
  
  // History
  const [history, setHistory] = useState<MapFeature[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Settings
  const [showGrid, setShowGrid] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize, setGridSize] = useState(1.0);
  const [showLabels, setShowLabels] = useState(true);
  const [globalStroke, setGlobalStroke] = useState(2.0);
  const [globalFontSize, setGlobalFontSize] = useState(12.0);
  
  // UI Panels
  const [activePanel, setActivePanel] = useState<'none' | 'layers' | 'properties' | 'tools' | 'settings' | 'export'>('none');
  
  // Export State
  const [isCopied, setIsCopied] = useState(false);

  // -- Initialization --
  
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      if (showSetup) centerMap(width, height);
    }
  }, [showSetup]); 

  // -- History Management --

  const saveToHistory = useCallback((newFeatures: MapFeature[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(deepCopy(newFeatures));
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const updateFeatures = (newFeatures: MapFeature[], save = true) => {
    setFeatures(newFeatures);
    if (save) saveToHistory(newFeatures);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setFeatures(deepCopy(history[historyIndex - 1]));
      setSelectedFeatureId(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setFeatures(deepCopy(history[historyIndex + 1]));
      setSelectedFeatureId(null);
    }
  };

  // -- Coordinate Systems --

  const geoToCanvas = useCallback((point: Point, canvasWidth: number, canvasHeight: number) => {
    const mapScale = Math.min(canvasWidth / roomWidth, canvasHeight / roomHeight) * 0.8; 
    const offsetX = (canvasWidth - roomWidth * mapScale) / 2;
    const offsetY = (canvasHeight - roomHeight * mapScale) / 2;

    const finalScale = mapScale * scale;
    const finalOffsetX = offsetX * scale + pan.x;
    const finalOffsetY = offsetY * scale + pan.y;

    let drawX = point.x;
    let drawY = roomHeight - point.y; 

    if (originPos === 'top-left') { drawY = point.y; }

    return {
      x: finalOffsetX + drawX * finalScale,
      y: finalOffsetY + drawY * finalScale
    };
  }, [roomWidth, roomHeight, scale, pan, originPos]);

  const canvasToGeo = useCallback((point: Point, canvasWidth: number, canvasHeight: number, shouldSnap = true) => {
    const mapScale = Math.min(canvasWidth / roomWidth, canvasHeight / roomHeight) * 0.8;
    const offsetX = (canvasWidth - roomWidth * mapScale) / 2;
    const offsetY = (canvasHeight - roomHeight * mapScale) / 2;

    const finalScale = mapScale * scale;
    const finalOffsetX = offsetX * scale + pan.x;
    const finalOffsetY = offsetY * scale + pan.y;

    let rawX = (point.x - finalOffsetX) / finalScale;
    let rawY = (point.y - finalOffsetY) / finalScale;

    // Inverse origin transform
    let geoX = rawX;
    let geoY = roomHeight - rawY;
    if (originPos === 'top-left') { geoY = rawY; }

    // Snapping Logic
    if (shouldSnap && snapToGrid) {
      geoX = Math.round(geoX / gridSize) * gridSize;
      geoY = Math.round(geoY / gridSize) * gridSize;
    }

    return { x: geoX, y: geoY };
  }, [roomWidth, roomHeight, scale, pan, originPos, snapToGrid, gridSize]);

  const centerMap = (w: number, h: number) => {
    setPan({ x: 0, y: 0 }); 
    setScale(1);
  };

  // -- Canvas Rendering --

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive Canvas Sizing
    const { width, height } = containerRef.current.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Clear
    ctx.fillStyle = '#f3f4f6'; 
    ctx.fillRect(0, 0, width, height);

    // Calculate Room Rect on Canvas
    const bl = geoToCanvas({x: 0, y: 0}, width, height);
    const tr = geoToCanvas({x: roomWidth, y: roomHeight}, width, height);
    
    const roomRectX = Math.min(bl.x, tr.x);
    const roomRectY = Math.min(bl.y, tr.y);
    const roomRectW = Math.abs(tr.x - bl.x);
    const roomRectH = Math.abs(tr.y - bl.y);

    // Draw Room
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(roomRectX, roomRectY, roomRectW, roomRectH);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(roomRectX, roomRectY, roomRectW, roomRectH);

    // Grid
    if (showGrid) {
      ctx.beginPath();
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;
      const mapScale = (roomRectW / roomWidth);
      const step = gridSize * mapScale;
      
      for (let x = roomRectX; x <= roomRectX + roomRectW; x += step) {
        ctx.moveTo(x, roomRectY);
        ctx.lineTo(x, roomRectY + roomRectH);
      }
      for (let y = roomRectY; y <= roomRectY + roomRectH; y += step) {
        ctx.moveTo(roomRectX, y);
        ctx.lineTo(roomRectX + roomRectW, y);
      }
      ctx.stroke();
    }

    // Origin Marker
    const originCanvas = geoToCanvas({x: 0, y: 0}, width, height);
    ctx.fillStyle = '#2196F3';
    ctx.beginPath();
    ctx.arc(originCanvas.x, originCanvas.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Features
    features.forEach(feature => {
      if (!layers[feature.layerId]?.isVisible) return;
      
      const isSelected = feature.id === selectedFeatureId;
      const opacity = feature.opacity;
      const mapScale = (roomRectW / roomWidth);

      ctx.save();
      
      if (['rectangle', 'door', 'window', 'stairs'].includes(feature.type)) {
        const center = geoToCanvas(feature.coordinates[0], width, height);
        const w = feature.width * mapScale;
        const h = feature.height * mapScale;
        const x = center.x - w/2;
        const y = center.y - h/2;

        let fill = feature.fillColor;
        if (feature.type === 'door') fill = '#8D6E63';
        if (feature.type === 'window') fill = '#81D4FA';
        if (feature.type === 'stairs') fill = '#BDBDBD';
        
        ctx.fillStyle = hexToRgba(fill, opacity);
        ctx.fillRect(x, y, w, h);
        
        ctx.strokeStyle = hexToRgba(feature.strokeColor, opacity);
        ctx.lineWidth = isSelected ? feature.strokeWidth + 2 : feature.strokeWidth;
        ctx.strokeRect(x, y, w, h);

        if (feature.type === 'stairs') {
          ctx.strokeStyle = 'rgba(0,0,0,0.3)';
          ctx.lineWidth = 1;
          for(let i=1; i<5; i++) {
             ctx.beginPath();
             ctx.moveTo(x, y + (h/5)*i);
             ctx.lineTo(x+w, y + (h/5)*i);
             ctx.stroke();
          }
        }

        if (isSelected) {
            drawSelectionBox(ctx, x, y, w, h);
            if(feature.isLocked) drawLock(ctx, x+w, y);
        }

      } else if (feature.type === 'circle' || feature.type === 'marker') {
        const center = geoToCanvas(feature.coordinates[0], width, height);
        const r = feature.radius * mapScale;
        
        ctx.beginPath();
        if (feature.type === 'marker') {
          ctx.arc(center.x, center.y, r, Math.PI, 0);
          ctx.lineTo(center.x, center.y + r*2);
          ctx.closePath();
        } else {
          ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        }
        
        ctx.fillStyle = hexToRgba(feature.fillColor, opacity);
        ctx.fill();
        ctx.strokeStyle = hexToRgba(feature.strokeColor, opacity);
        ctx.lineWidth = isSelected ? feature.strokeWidth + 2 : feature.strokeWidth;
        ctx.stroke();
        
        if (isSelected) drawSelectionBox(ctx, center.x - r, center.y - r, r*2, r*2);

      } else if (['path', 'wall', 'polygon'].includes(feature.type)) {
        if (feature.coordinates.length < 2) return;
        
        ctx.beginPath();
        const start = geoToCanvas(feature.coordinates[0], width, height);
        ctx.moveTo(start.x, start.y);
        for(let i=1; i<feature.coordinates.length; i++) {
          const p = geoToCanvas(feature.coordinates[i], width, height);
          ctx.lineTo(p.x, p.y);
        }
        if (feature.type === 'polygon') ctx.closePath();

        if (feature.type === 'polygon') {
          ctx.fillStyle = hexToRgba(feature.fillColor, opacity);
          ctx.fill();
        }

        ctx.strokeStyle = hexToRgba(feature.type === 'polygon' ? feature.strokeColor : feature.pathColor, opacity);
        ctx.lineWidth = isSelected 
          ? (feature.type === 'polygon' ? feature.strokeWidth : feature.pathThickness) + 2 
          : (feature.type === 'polygon' ? feature.strokeWidth : feature.pathThickness);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        if (isSelected) {
          feature.coordinates.forEach(c => {
             const p = geoToCanvas(c, width, height);
             drawHandle(ctx, p.x, p.y);
          });
        }
      } else if (feature.type === 'text') {
        const center = geoToCanvas(feature.coordinates[0], width, height);
        ctx.font = `bold ${feature.fontSize}px sans-serif`;
        ctx.fillStyle = hexToRgba(feature.fillColor, opacity);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(feature.textContent, center.x, center.y);
        
        if (isSelected) {
           const metrics = ctx.measureText(feature.textContent);
           const h = feature.fontSize; 
           drawSelectionBox(ctx, center.x - metrics.width/2 - 5, center.y - h/2 - 5, metrics.width + 10, h + 10);
        }
      }

      // Labels
      if (showLabels && feature.type !== 'text') {
        const center = geoToCanvas(feature.coordinates[0], width, height);
        ctx.font = `500 10px sans-serif`;
        ctx.fillStyle = '#424242';
        ctx.textAlign = 'center';
        ctx.fillText(feature.name, center.x, center.y);
      }

      ctx.restore();
    });

    // Drawing in progress
    if (pathPoints.length > 0) {
      const pts = pathPoints.map(p => geoToCanvas(p, width, height));
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for(let i=1; i<pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      
      ctx.strokeStyle = '#FF9800';
      ctx.lineWidth = 3;
      ctx.stroke();
      pts.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = '#FF9800';
        ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
        ctx.fill();
      });
    }

  }, [features, pan, scale, roomWidth, roomHeight, showGrid, gridSize, selectedFeatureId, pathPoints, showLabels, layers, originPos, activePanel]);


  const drawSelectionBox = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(x-4, y-4, w+8, h+8);
    ctx.setLineDash([]);
  };

  const drawHandle = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
  };

  const drawLock = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillRect(x-3, y-2, 6, 5);
  };

  // -- Interaction Handlers --

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - left;
    const clickY = e.clientY - top;
    
    // Get GeoPos with NO snapping for smooth dragging initialization
    const rawGeoPos = canvasToGeo({x: clickX, y: clickY}, width, height, false);
    // Get Snapped GeoPos for selection/creation
    const snappedGeoPos = canvasToGeo({x: clickX, y: clickY}, width, height, true);

    if (currentTool !== 'select') {
      if (['polygon', 'path', 'wall'].includes(currentTool)) {
        setPathPoints([...pathPoints, snappedGeoPos]);
      } else {
        addFeature(snappedGeoPos);
      }
    } else {
      // Hit Test 
      let hitId: string | null = null;
      for (let i = features.length - 1; i >= 0; i--) {
        const f = features[i];
        if (!layers[f.layerId].isVisible) continue;
        const center = geoToCanvas(f.coordinates[0], width, height);
        const mapScale = (width / roomWidth) * 0.8 * scale;
        
        if (['rectangle', 'door', 'window', 'stairs'].includes(f.type)) {
            const w = f.width * mapScale;
            const h = f.height * mapScale;
            if (clickX >= center.x - w/2 && clickX <= center.x + w/2 &&
                clickY >= center.y - h/2 && clickY <= center.y + h/2) {
                hitId = f.id;
                break;
            }
        } else if (f.type === 'circle' || f.type === 'marker') {
            const r = f.radius * mapScale;
            if (getDistance({x: clickX, y: clickY}, center) <= r) {
                hitId = f.id;
                break;
            }
        } else if (f.type === 'text') {
             if (Math.abs(clickX - center.x) < 40 && Math.abs(clickY - center.y) < 20) {
                 hitId = f.id;
                 break;
             }
        }
        else if (['path', 'wall', 'polygon'].includes(f.type)) {
           const pts = f.coordinates.map(c => geoToCanvas(c, width, height));
           const minX = Math.min(...pts.map(p => p.x));
           const maxX = Math.max(...pts.map(p => p.x));
           const minY = Math.min(...pts.map(p => p.y));
           const maxY = Math.max(...pts.map(p => p.y));
           if (clickX >= minX - 10 && clickX <= maxX + 10 && clickY >= minY - 10 && clickY <= maxY + 10) {
               hitId = f.id;
               break;
           }
        }
      }

      if (hitId) {
        setSelectedFeatureId(hitId);
        isDraggingRef.current = true;
        lastMousePosRef.current = rawGeoPos; 
      } else {
        setSelectedFeatureId(null);
        isDraggingRef.current = false;
        lastMousePosRef.current = null;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
     if (!containerRef.current) return;
     const { width, height } = containerRef.current.getBoundingClientRect();
     
     // Pan View
     if (e.buttons === 1 && (!selectedFeatureId || currentTool !== 'select' || isViewLocked)) {
        setPan({
            x: pan.x + e.movementX,
            y: pan.y + e.movementY
        });
        return;
     }

     // Drag Object
     if (currentTool === 'select' && selectedFeatureId && e.buttons === 1 && !isViewLocked && isDraggingRef.current && lastMousePosRef.current) {
        const currentRawGeo = canvasToGeo({
            x: e.clientX - containerRef.current.getBoundingClientRect().left, 
            y: e.clientY - containerRef.current.getBoundingClientRect().top
        }, width, height, false);

        const deltaX = currentRawGeo.x - lastMousePosRef.current.x;
        const deltaY = currentRawGeo.y - lastMousePosRef.current.y;

        setFeatures(prev => prev.map(f => {
            if (f.id === selectedFeatureId && !f.isLocked) {
                return {
                    ...f,
                    coordinates: f.coordinates.map(c => ({
                        x: c.x + deltaX,
                        y: c.y + deltaY
                    }))
                };
            }
            return f;
        }));
        lastMousePosRef.current = currentRawGeo;
     }
  };
  
  const handlePointerUp = () => {
      isDraggingRef.current = false;
      lastMousePosRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const s = Math.exp(-e.deltaY * 0.001);
    const newScale = Math.max(0.1, Math.min(10, scale * s));
    setScale(newScale);
  };

  // -- Feature Creation --

  const addFeature = (pos: Point) => {
    let newFeature: MapFeature | null = null;
    const base = {
        id: generateId(),
        coordinates: [pos],
        layerId: activeLayerId,
        level: currentLevel,
        isLocked: false,
        opacity: 1,
        rotation: 0,
        // Defaults
        width: 2.0, height: 1.0, radius: 0.5,
        pathColor: '#FFA726', pathThickness: 3.0,
        fillColor: '#64B5F6', strokeColor: '#1976D2', strokeWidth: 2.0,
        textContent: 'Label', fontSize: 16
    };

    switch(currentTool) {
        case 'rectangle': newFeature = { ...base, type: 'rectangle', name: 'Room' }; break;
        case 'circle': newFeature = { ...base, type: 'circle', name: 'Zone' }; break;
        case 'door': newFeature = { ...base, type: 'door', name: 'Door', width: 1.0, height: 0.15 }; break;
        case 'window': newFeature = { ...base, type: 'window', name: 'Window', width: 1.5, height: 0.15 }; break;
        case 'stairs': newFeature = { ...base, type: 'stairs', name: 'Stairs', width: 2.0, height: 1.5 }; break;
        case 'text': newFeature = { ...base, type: 'text', name: 'Label', fillColor: '#000000' }; break;
        case 'marker': newFeature = { ...base, type: 'marker', name: 'POI', radius: 0.3, fillColor: '#E91E63' }; break;
    }

    if (newFeature) {
        updateFeatures([...features, newFeature]);
        setCurrentTool('select');
        setSelectedFeatureId(newFeature.id);
    }
  };

  const finishPath = () => {
      if (pathPoints.length < 2) { setPathPoints([]); return; }
      
      const type = currentTool as FeatureType;
      
      const base = {
        id: generateId(),
        name: 'Feature',
        coordinates: [...pathPoints],
        layerId: activeLayerId,
        level: currentLevel,
        isLocked: false,
        opacity: 1,
        rotation: 0,
        width: 0, height: 0, radius: 0,
        pathColor: '#FFA726', pathThickness: 3.0,
        fillColor: '#64B5F6', strokeColor: '#1976D2', strokeWidth: 2.0,
        textContent: '', fontSize: 12
      };

      if (type === 'wall') {
          base.pathColor = '#424242';
          base.pathThickness = 6.0;
          base.name = 'Wall';
      } else if (type === 'polygon') {
          base.name = 'Room';
      } else {
          base.name = 'Path';
      }

      updateFeatures([...features, { ...base, type }]);
      setPathPoints([]);
      setCurrentTool('select');
  };

  // -- Export --

  const generateGeoJSON = () => {
    // 1. Precise Meters to Lon/Lat conversion from Flutter main.dart logic
    const metersToLonLat = (x: number, y: number) => {
        const metersPerDegreeLat = 111320.0;
        // CRITICAL: Lon conversion depends on Latitude cosine
        const metersPerDegreeLon = 111320.0 * Math.cos(baseLat * Math.PI / 180);
        
        const lon = baseLon + (x / metersPerDegreeLon);
        const lat = baseLat + (y / metersPerDegreeLat);
        return [lon, lat];
    };

    // 2. Prepare Metadata Feature
    const metadataFeature = {
      type: 'Feature',
      properties: {
        featureType: 'metadata',
        roomName: roomName,
        roomWidth: roomWidth,
        roomHeight: roomHeight,
        roomArea: roomWidth * roomHeight,
        baseLatitude: baseLat,
        baseLongitude: baseLon,
        currentLevel: currentLevel,
        origin: originPos,
        layers: layers,
        globalSettings: {
          strokeThickness: globalStroke,
          labelFontSize: globalFontSize,
          showGrid: showGrid,
          snapToGrid: snapToGrid,
          gridSize: gridSize
        },
        timestamp: new Date().toISOString(),
        createdWith: 'Indoor Map Creator v1.0'
      },
      geometry: null
    };

    // 3. Process Map Features
    const geoFeatures = features.map(f => {
        let geometry: any = null;
        
        // Property Mapping exactly like Flutter
        const properties: any = {
            indoor: 'yes',
            level: currentLevel.toString(),
            name: f.name
        };

        // Determine amenity type
        let amenityType = 'area';
        switch(f.type) {
            case 'door': amenityType = 'entrance'; break;
            case 'window': amenityType = 'window'; break;
            case 'stairs': amenityType = 'stairs'; break;
            case 'marker': amenityType = f.amenity || 'poi'; break;
            case 'rectangle': 
            case 'polygon': amenityType = 'room'; break;
            case 'path': amenityType = 'corridor'; break;
            case 'wall': amenityType = 'wall'; break;
            case 'text': amenityType = 'label'; break;
        }

        // Apply specific properties
        if (f.type === 'path') {
            properties['highway'] = 'footway';
        } else if (f.type !== 'text') {
            properties['amenity'] = amenityType;
        }

        if (f.type === 'rectangle' || f.type === 'polygon') {
            properties['building:part'] = 'room';
        } else if (f.type === 'door') {
            properties['door'] = 'yes';
        } else if (f.type === 'window') {
            properties['building:part'] = 'window';
        }

        // Geometry Construction
        if (['rectangle', 'door', 'window', 'stairs'].includes(f.type)) {
            // For these types, we calculate 4 corners from center center
            const x = f.coordinates[0].x;
            const y = f.coordinates[0].y;
            const w = f.width;
            const h = f.height;

            const coords = [
                metersToLonLat(x - w/2, y - h/2),
                metersToLonLat(x + w/2, y - h/2),
                metersToLonLat(x + w/2, y + h/2),
                metersToLonLat(x - w/2, y + h/2),
                metersToLonLat(x - w/2, y - h/2) // Close loop
            ];
            
            // Polygons must be wrapped in another array [ [ring] ]
            geometry = {
                type: 'Polygon',
                coordinates: [coords]
            };
        } 
        else if (f.type === 'circle' || f.type === 'marker') {
            const center = f.coordinates[0];
            geometry = {
                type: 'Point',
                coordinates: metersToLonLat(center.x, center.y)
            };
            if (f.type === 'circle') properties['radius'] = f.radius.toString();
        }
        else if (f.type === 'polygon') {
            const coords = f.coordinates.map(c => metersToLonLat(c.x, c.y));
            // Ensure closed loop
            if (coords.length > 0) coords.push(coords[0]);
            
            geometry = {
                type: 'Polygon',
                coordinates: [coords]
            };
        }
        else if (f.type === 'text') {
             const center = f.coordinates[0];
             geometry = {
                 type: 'Point',
                 coordinates: metersToLonLat(center.x, center.y)
             };
             properties['description'] = f.textContent;
        }
        else if (f.type === 'wall' || f.type === 'path') {
             // Wall must be LineString
             // Format: [ [lon, lat], [lon, lat], ... ]
             const coords = f.coordinates.map(c => metersToLonLat(c.x, c.y));
             
             geometry = {
                 type: 'LineString',
                 coordinates: coords
             };
        }

        return {
            type: 'Feature',
            properties: properties,
            geometry: geometry
        };
    });

    return JSON.stringify({
        type: 'FeatureCollection',
        features: [metadataFeature, ...geoFeatures]
    }, null, 2);
  };
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateGeoJSON());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleDownload = () => {
    const json = generateGeoJSON();
    const blob = new Blob([json], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${roomName.replace(/\s+/g, '_')}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // -- UI Subcomponents --

  if (showSetup) {
    return (
      <div className="fixed inset-0 h-[100dvh] w-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 z-50 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 space-y-6 animate-in zoom-in duration-300">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <MapIcon size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Map</h1>
            <p className="text-gray-500">Configure your initial room settings</p>
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Map Name</label>
                <input 
                  type="text" 
                  value={roomName} onChange={e => setRoomName(e.target.value)} 
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Latitude</label>
                    <input type="number" value={baseLat} onChange={e => setBaseLat(parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Longitude</label>
                    <input type="number" value={baseLon} onChange={e => setBaseLon(parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                </div>
             </div>

             <div>
               <label className="block text-xs font-medium text-gray-700 uppercase mb-2">Room Template</label>
               <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                 {TEMPLATES.map((t, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                          setRoomWidth(t.width);
                          setRoomHeight(t.height);
                      }}
                      className={`shrink-0 w-32 p-3 rounded-xl border-2 text-left transition-all
                        ${roomWidth === t.width && roomHeight === t.height ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}
                      `}
                    >
                       <t.icon size={20} className="mb-2 text-gray-600" />
                       <div className="font-bold text-sm text-gray-800">{t.name}</div>
                       <div className="text-[10px] text-gray-500 leading-tight mt-1">{t.description}</div>
                    </button>
                 ))}
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Width (m)</label>
                    <input type="number" value={roomWidth} onChange={e => setRoomWidth(parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                 </div>
                 <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Height (m)</label>
                    <input type="number" value={roomHeight} onChange={e => setRoomHeight(parseFloat(e.target.value))} className="w-full px-3 py-2 border rounded-lg" />
                 </div>
             </div>
             
             <button 
                onClick={() => { 
                  setShowSetup(false); 
                  // AUTO-GENERATE WALLS
                  const newWalls: MapFeature[] = [
                    {
                      id: generateId(),
                      type: 'wall',
                      name: 'Bottom Wall',
                      coordinates: [{x: 0, y: 0}, {x: roomWidth, y: 0}],
                      layerId: 0, level: currentLevel, isLocked: false,
                      width: 0, height: 0, radius: 0,
                      pathColor: '#424242', pathThickness: 6.0, fillColor: '', strokeColor: '', strokeWidth: 0, textContent: '', fontSize: 0, rotation: 0, opacity: 1, amenity: 'wall'
                    },
                    {
                      id: generateId(),
                      type: 'wall',
                      name: 'Right Wall',
                      coordinates: [{x: roomWidth, y: 0}, {x: roomWidth, y: roomHeight}],
                      layerId: 0, level: currentLevel, isLocked: false,
                      width: 0, height: 0, radius: 0,
                      pathColor: '#424242', pathThickness: 6.0, fillColor: '', strokeColor: '', strokeWidth: 0, textContent: '', fontSize: 0, rotation: 0, opacity: 1, amenity: 'wall'
                    },
                    {
                      id: generateId(),
                      type: 'wall',
                      name: 'Top Wall',
                      coordinates: [{x: roomWidth, y: roomHeight}, {x: 0, y: roomHeight}],
                      layerId: 0, level: currentLevel, isLocked: false,
                      width: 0, height: 0, radius: 0,
                      pathColor: '#424242', pathThickness: 6.0, fillColor: '', strokeColor: '', strokeWidth: 0, textContent: '', fontSize: 0, rotation: 0, opacity: 1, amenity: 'wall'
                    },
                    {
                      id: generateId(),
                      type: 'wall',
                      name: 'Left Wall',
                      coordinates: [{x: 0, y: roomHeight}, {x: 0, y: 0}],
                      layerId: 0, level: currentLevel, isLocked: false,
                      width: 0, height: 0, radius: 0,
                      pathColor: '#424242', pathThickness: 6.0, fillColor: '', strokeColor: '', strokeWidth: 0, textContent: '', fontSize: 0, rotation: 0, opacity: 1, amenity: 'wall'
                    }
                  ];
                  updateFeatures(newWalls); 
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
             >
                Start Creating <ChevronRight size={18} />
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Editor UI
  return (
    <div className="fixed inset-0 h-[100dvh] w-screen flex flex-col bg-gray-50 overflow-hidden font-sans text-gray-900 overscroll-none touch-none">
        
        {/* Top Bar - Simplified */}
        <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between z-10 shadow-sm shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><MapIcon size={20}/></div>
                <div>
                   <h2 className="font-bold text-sm text-gray-800">{roomName}</h2>
                   <div className="text-xs text-gray-500">{roomWidth}m × {roomHeight}m</div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button onClick={() => setIsViewLocked(!isViewLocked)} className={`p-2 rounded-lg ${isViewLocked ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'}`}>
                    {isViewLocked ? <Lock size={20}/> : <Unlock size={20}/>}
                </button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button onClick={undo} disabled={historyIndex <= 0} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><Undo size={20}/></button>
                <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><Redo size={20}/></button>
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                <button onClick={() => centerMap(canvasRef.current?.width || 800, canvasRef.current?.height || 600)} className="p-2 hover:bg-gray-100 rounded-lg"><Maximize size={20}/></button>
            </div>
            
            {/* Right side now empty or just placeholder to balance flex */}
            <div className="w-32"></div> 
        </div>

        {/* Content Area - Flex Container */}
        <div className="flex-1 flex overflow-hidden w-full h-full relative">
            
            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden h-full bg-gray-50" ref={containerRef}>
                <canvas 
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onWheel={handleWheel}
                    className={`w-full h-full touch-none block ${currentTool === 'select' ? (isDraggingRef.current ? 'cursor-grabbing' : 'cursor-default') : 'cursor-crosshair'}`}
                    style={{touchAction: 'none'}}
                />
                
                {/* Properties Floating Card */}
                {selectedFeatureId && (
                    <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-64 animate-in fade-in slide-in-from-left-4 duration-200 z-20">
                        <div className="flex items-center justify-between mb-3">
                             <span className="font-bold text-sm">Properties</span>
                             <button onClick={() => setSelectedFeatureId(null)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                        </div>
                        {features.filter(f => f.id === selectedFeatureId).map(f => (
                           <div key={f.id} className="space-y-3">
                              <div>
                                 <label className="text-[10px] uppercase text-gray-500 font-bold">Name</label>
                                 <input 
                                    value={f.name} 
                                    onChange={(e) => updateFeatures(features.map(x => x.id === f.id ? {...x, name: e.target.value} : x), false)}
                                    className="w-full text-sm border-b border-gray-200 focus:border-blue-500 outline-none py-1"
                                 />
                              </div>

                              {/* Position Editors */}
                              <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                                <label className="text-[10px] uppercase text-blue-600 font-bold flex items-center gap-1 mb-1"><MapIcon size={10}/> Position</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400"><ArrowRight size={12}/></div>
                                        <input 
                                            type="number" 
                                            value={Math.round(f.coordinates[0].x * 100) / 100}
                                            onChange={e => {
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val)) updateFeatures(features.map(x => x.id === f.id ? {...x, coordinates: [{x: val, y: x.coordinates[0].y}, ...x.coordinates.slice(1)]} : x));
                                            }}
                                            className="w-full pl-6 pr-1 py-1 text-sm border rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-1 flex items-center pointer-events-none text-[10px] text-gray-400">X</div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400"><ArrowUp size={12}/></div>
                                        <input 
                                            type="number" 
                                            value={Math.round(f.coordinates[0].y * 100) / 100}
                                            onChange={e => {
                                                const val = parseFloat(e.target.value);
                                                if (!isNaN(val)) updateFeatures(features.map(x => x.id === f.id ? {...x, coordinates: [{x: x.coordinates[0].x, y: val}, ...x.coordinates.slice(1)]} : x));
                                            }}
                                            className="w-full pl-6 pr-1 py-1 text-sm border rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-1 flex items-center pointer-events-none text-[10px] text-gray-400">Y</div>
                                    </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                 {(['rectangle', 'door', 'window', 'stairs'].includes(f.type)) && (
                                    <>
                                      <div>
                                         <label className="text-[10px] uppercase text-gray-500 font-bold">Width</label>
                                         <input type="number" value={f.width} onChange={e => updateFeatures(features.map(x => x.id === f.id ? {...x, width: parseFloat(e.target.value)} : x))} className="w-full text-sm border rounded px-1 py-1"/>
                                      </div>
                                      <div>
                                         <label className="text-[10px] uppercase text-gray-500 font-bold">Height</label>
                                         <input type="number" value={f.height} onChange={e => updateFeatures(features.map(x => x.id === f.id ? {...x, height: parseFloat(e.target.value)} : x))} className="w-full text-sm border rounded px-1 py-1"/>
                                      </div>
                                    </>
                                 )}
                                 {(['circle', 'marker'].includes(f.type)) && (
                                      <div>
                                         <label className="text-[10px] uppercase text-gray-500 font-bold">Radius</label>
                                         <input type="number" value={f.radius} onChange={e => updateFeatures(features.map(x => x.id === f.id ? {...x, radius: parseFloat(e.target.value)} : x))} className="w-full text-sm border rounded px-1 py-1"/>
                                      </div>
                                 )}
                              </div>

                              <div>
                                 <label className="text-[10px] uppercase text-gray-500 font-bold mb-1 block">Color</label>
                                 <div className="flex flex-wrap gap-1">
                                    {COLORS.slice(0, 10).map(c => (
                                        <button 
                                          key={c} 
                                          onClick={() => updateFeatures(features.map(x => x.id === f.id ? {...x, fillColor: c, pathColor: c} : x))}
                                          className="w-5 h-5 rounded-full border border-gray-200"
                                          style={{backgroundColor: c}}
                                        />
                                    ))}
                                 </div>
                              </div>

                              <div className="flex gap-2 pt-2">
                                 <button onClick={() => updateFeatures(features.map(x => x.id === f.id ? {...x, isLocked: !x.isLocked} : x))} className={`flex-1 py-1.5 rounded text-xs font-medium border ${f.isLocked ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                    {f.isLocked ? 'Unlock' : 'Lock'}
                                 </button>
                                 <button onClick={() => {
                                     const copy = deepCopy(f);
                                     copy.id = generateId();
                                     copy.coordinates = copy.coordinates.map(c => ({x: c.x + 0.5, y: c.y + 0.5}));
                                     updateFeatures([...features, copy]);
                                 }} className="flex-1 py-1.5 rounded text-xs font-medium border border-gray-200 hover:bg-gray-50">Duplicate</button>
                                 <button onClick={() => {
                                     updateFeatures(features.filter(x => x.id !== f.id));
                                     setSelectedFeatureId(null);
                                 }} className="p-1.5 rounded text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100"><Trash2 size={16}/></button>
                              </div>
                           </div>
                        ))}
                    </div>
                )}

                {/* Bottom Floating Bar (Drawing Tools) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gray-200 p-1 flex items-center gap-1 z-20">
                    {[
                      { id: 'select', icon: MousePointer2, label: 'Select' },
                      { id: 'wall', icon: LayoutGrid, label: 'Wall' },
                      { id: 'rectangle', icon: Square, label: 'Room' },
                      { id: 'door', icon: DoorOpen, label: 'Door' },
                      { id: 'path', icon: Activity, label: 'Path' },
                      { id: 'text', icon: Type, label: 'Text' },
                    ].map(tool => (
                        <button 
                          key={tool.id}
                          onClick={() => {
                              setCurrentTool(tool.id as any);
                              setPathPoints([]);
                              setSelectedFeatureId(null);
                          }}
                          className={`p-3 rounded-full transition-all ${currentTool === tool.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                          title={tool.label}
                        >
                           <tool.icon size={20} />
                        </button>
                    ))}
                    <div className="w-px h-8 bg-gray-200 mx-1"></div>
                    <button onClick={() => setActivePanel(activePanel === 'tools' ? 'none' : 'tools')} className={`p-3 rounded-full ${activePanel === 'tools' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><ChevronDown size={20}/></button>
                </div>
                
                {/* Bottom Right Floating Group (Layers, Settings, Export) */}
                <div className="absolute bottom-6 right-6 z-20 flex gap-2">
                   <button onClick={() => setActivePanel(activePanel === 'layers' ? 'none' : 'layers')} className={`bg-white p-3 rounded-full shadow-lg border border-gray-200 transition-all ${activePanel === 'layers' ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}>
                      <Layers size={20} />
                   </button>
                   <button onClick={() => setActivePanel(activePanel === 'settings' ? 'none' : 'settings')} className={`bg-white p-3 rounded-full shadow-lg border border-gray-200 transition-all ${activePanel === 'settings' ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50 text-gray-700'}`}>
                      <Settings size={20} />
                   </button>
                   <button onClick={() => setActivePanel(activePanel === 'export' ? 'none' : 'export')} className={`bg-white p-3 rounded-full shadow-lg border border-gray-200 transition-all ${activePanel === 'export' ? 'bg-gray-900 text-white border-gray-900' : 'hover:bg-gray-50 text-gray-700'}`}>
                      <Save size={20} />
                   </button>
                </div>
                
                {/* Finish Path Button */}
                {pathPoints.length > 0 && (
                    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                        <button onClick={finishPath} className="px-4 py-2 bg-green-600 text-white rounded-full shadow-lg font-medium flex items-center gap-2">
                            <Check size={16}/> Finish {currentTool}
                        </button>
                        <button onClick={() => setPathPoints([])} className="px-4 py-2 bg-red-600 text-white rounded-full shadow-lg font-medium flex items-center gap-2">
                            <X size={16}/> Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* Sidebar (Non-blocking layout) */}
            {activePanel !== 'none' && (
                <div className="w-80 border-l border-gray-200 bg-white h-full shadow-xl flex flex-col z-30 animate-in slide-in-from-right duration-200 shrink-0">
                   <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                       <h3 className="font-bold text-gray-800 capitalize flex items-center gap-2">
                          {activePanel === 'layers' && <Layers size={18}/>}
                          {activePanel === 'settings' && <Settings size={18}/>}
                          {activePanel === 'tools' && <LayoutGrid size={18}/>}
                          {activePanel === 'export' && <Save size={18}/>}
                          {activePanel}
                       </h3>
                       <button onClick={() => setActivePanel('none')} className="p-1 hover:bg-gray-200 rounded-lg"><X size={18} className="text-gray-500"/></button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-4">
                       {activePanel === 'layers' && (
                           <div className="space-y-4">
                               <button onClick={() => setLayers([...layers, {id: generateId(), name: `Layer ${layers.length+1}`, isVisible: true}])} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 font-medium transition-colors">
                                   + Add Layer
                               </button>
                               <div className="space-y-2">
                                   {layers.map((l, i) => (
                                       <div key={l.id} className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${activeLayerId === i ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`} onClick={() => setActiveLayerId(i)}>
                                           <button onClick={(e) => {
                                               e.stopPropagation();
                                               setLayers(layers.map(lx => lx.id === l.id ? {...lx, isVisible: !lx.isVisible} : lx));
                                           }} className="hover:opacity-70 transition-opacity">
                                               {l.isVisible ? <div className="w-4 h-4 bg-blue-600 rounded-sm"/> : <div className="w-4 h-4 border border-gray-400 rounded-sm"/>}
                                           </button>
                                           <span className="flex-1 font-medium text-sm text-gray-700">{l.name}</span>
                                           <span className="text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded border">{features.filter(f => f.layerId === i).length}</span>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       )}

                       {activePanel === 'tools' && (
                           <div className="grid grid-cols-2 gap-3">
                               {['rectangle', 'circle', 'polygon', 'path', 'wall', 'door', 'window', 'stairs', 'text', 'marker'].map(t => (
                                   <button key={t} onClick={() => { setCurrentTool(t as any); setActivePanel('none'); }} className="p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent hover:text-blue-600 transition-all flex flex-col items-center gap-2 group">
                                       <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors">
                                            {t === 'rectangle' && <Square size={20}/>}
                                            {t === 'circle' && <Circle size={20}/>}
                                            {t === 'door' && <DoorOpen size={20}/>}
                                            {/* Add other icons based on tool */}
                                            {['rectangle', 'circle', 'door'].indexOf(t) === -1 && <LayoutGrid size={20}/>}
                                       </div>
                                       <div className="capitalize font-medium text-sm">{t}</div>
                                   </button>
                               ))}
                           </div>
                       )}

                       {activePanel === 'export' && (
                           <div className="space-y-4">
                               <div className="p-4 bg-gray-900 text-green-400 font-mono text-[10px] rounded-lg overflow-x-auto h-[400px] shadow-inner leading-relaxed whitespace-pre">
                                   {generateGeoJSON()}
                               </div>
                               <button onClick={handleDownload} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition-transform active:scale-95 flex items-center justify-center gap-2"><Download size={18}/> Download .geojson</button>
                               <button onClick={handleCopy} className={`w-full py-3 border rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${isCopied ? 'bg-green-50 text-green-700 border-green-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                                  {isCopied ? <CheckCircle2 size={18}/> : <Copy size={18}/>} 
                                  {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                               </button>
                           </div>
                       )}
                       
                       {activePanel === 'settings' && (
                           <div className="space-y-6">
                               <div className="space-y-3">
                                   <label className="text-xs font-bold uppercase text-gray-500">Grid Options</label>
                                   <div className="flex items-center gap-3">
                                       <button onClick={() => setShowGrid(!showGrid)} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${showGrid ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>Show Grid</button>
                                       <button onClick={() => setSnapToGrid(!snapToGrid)} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${snapToGrid ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:bg-gray-50'}`}>Snap to Grid</button>
                                   </div>
                               </div>
                               <div className="space-y-3">
                                   <div className="flex justify-between">
                                        <label className="text-xs font-bold uppercase text-gray-500">Grid Size</label>
                                        <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">{gridSize}m</span>
                                   </div>
                                   <input type="range" min="0.5" max="5" step="0.5" value={gridSize} onChange={e => setGridSize(parseFloat(e.target.value))} className="w-full accent-blue-600"/>
                               </div>
                               <div className="space-y-3">
                                   <label className="text-xs font-bold uppercase text-gray-500">Labels</label>
                                   <div className="flex items-center justify-between p-3 border rounded-lg">
                                       <span className="text-sm font-medium">Show Feature Labels</span>
                                       <button onClick={() => setShowLabels(!showLabels)} className={`w-11 h-6 rounded-full transition-colors relative ${showLabels ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${showLabels ? 'left-6' : 'left-1'}`}/>
                                       </button>
                                   </div>
                               </div>
                           </div>
                       )}
                   </div>
                </div>
            )}
        </div>
    </div>
  );
}
