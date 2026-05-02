"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getIndoorGeoJson, updateIndoorGeoJson } from "@/api/apiProduct";
import toast from "react-hot-toast";
import LoadingIndicator from "@/components/Loading";

type Coordinate = number[];
type LineStringCoordinates = Coordinate[];
type PolygonCoordinates = Coordinate[][];
type GeometryCoordinates =
  | Coordinate
  | LineStringCoordinates
  | PolygonCoordinates;

interface GeoJSONFeature {
  type: string;
  properties?: {
    featureType?: string;
    level?: string;
    amenity?: string;
    name?: string;
    [key: string]: string | number | boolean | undefined;
  };
  geometry?: {
    type: string;
    coordinates: GeometryCoordinates;
  };
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

interface Metadata {
  roomName?: string;
  roomWidth?: number;
  roomHeight?: number;
  roomArea?: number;
  currentLevel?: number;
  [key: string]: string | number | boolean | undefined;
}

interface Bounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

export default function GeoJSONRenderer() {
  const [input, setInput] = useState("");
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const [error, setError] = useState("");
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [showLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [availableLevels, setAvailableLevels] = useState(["all"]);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [id, setId] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchGeoJson() {
      const data = await getIndoorGeoJson();

      if (data != null) {
        const [{ content, id }] = data;
        setId(id);
        setInput(content);
      }
    }

    fetchGeoJson();
  }, []);

  useEffect(() => {
    if (input) {
      processGeoJSON();
    }
  }, [input]);

  async function updateGejson() {
    const { data, error } = await updateIndoorGeoJson(id, input);

    console.log(error);

    if (data != null) {
      const data = await getIndoorGeoJson();

      if (data != null) {
        const [{ content }] = data;
        setInput(content);
        toast.success("Successfully Updated!");
      }
    }
  }

  const processGeoJSON = () => {
    try {
      const parsed = JSON.parse(input) as GeoJSONData;
      if (parsed.type !== "FeatureCollection") {
        throw new Error("Invalid GeoJSON: Must be a FeatureCollection");
      }

      const meta = parsed.features.find(
        (f: GeoJSONFeature) => f.properties?.featureType === "metadata"
      );
      setMetadata(meta?.properties || null);

      // Extract levels
      const levels = new Set(["all"]);
      parsed.features.forEach((feature: GeoJSONFeature) => {
        const level = feature.properties?.level?.toString() || "0";
        levels.add(level);
      });
      setAvailableLevels(Array.from(levels).sort());

      setGeoData(parsed);
      setError("");
      setScale(1);
      setPan({ x: 0, y: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setGeoData(null);
    }
  };

  // Calculate bounds from all features
  const calculateBounds = (features: GeoJSONFeature[]): Bounds => {
    let minLon = Infinity,
      maxLon = -Infinity;
    let minLat = Infinity,
      maxLat = -Infinity;

    features.forEach((feature: GeoJSONFeature) => {
      if (!feature.geometry || feature.properties?.featureType === "metadata")
        return;

      const processCoord = (coord: number[]) => {
        const lon = coord[0];
        const lat = coord[1];
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      };

      const coords = feature.geometry.coordinates;

      if (feature.geometry.type === "Point") {
        // For Point, coordinates is a single Coordinate (number[])
        processCoord(coords as number[]);
      } else if (feature.geometry.type === "LineString") {
        // For LineString, coordinates is an array of Coordinates (number[][])
        (coords as number[][]).forEach(processCoord);
      } else if (feature.geometry.type === "Polygon") {
        // For Polygon, coordinates is an array of rings (number[][][])
        (coords as number[][][])[0].forEach(processCoord);
      }
    });

    return { minLon, maxLon, minLat, maxLat };
  };

  // Project coordinate to canvas space
  const projectPoint = (
    lon: number,
    lat: number,
    bounds: Bounds,
    canvasWidth: number,
    canvasHeight: number
  ): { x: number; y: number } => {
    const lonRange = bounds.maxLon - bounds.minLon;
    const latRange = bounds.maxLat - bounds.minLat;

    // Calculate scale to fit 90% of canvas
    const scaleX = (canvasWidth * 0.9) / lonRange;
    const scaleY = (canvasHeight * 0.9) / latRange;
    const projScale = Math.min(scaleX, scaleY);

    // Calculate offset to center the map
    const offsetX = (canvasWidth - lonRange * projScale) / 2;
    const offsetY = (canvasHeight - latRange * projScale) / 2;

    // Project coordinates
    const x = (lon - bounds.minLon) * projScale + offsetX;
    const y = canvasHeight - ((lat - bounds.minLat) * projScale + offsetY);

    return { x, y };
  };

  // Draw on canvas
  useEffect(() => {
    if (!geoData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    // Apply transformations
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(scale, scale);
    ctx.translate(width / 2, height / 2);
    ctx.translate(-width / 2, -height / 2);

    const features = geoData.features.filter((f: GeoJSONFeature) => {
      if (f.properties?.featureType === "metadata") return false;
      if (selectedLevel === "all") return true;
      const level = f.properties?.level?.toString() || "0";
      return level === selectedLevel;
    });

    const bounds = calculateBounds(features);

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "rgba(156, 163, 175, 0.2)";
      ctx.lineWidth = 0.5;

      const gridSize = 5; // 5 meters in coordinate space
      const startX = Math.floor(bounds.minLon / gridSize) * gridSize;
      const endX = Math.ceil(bounds.maxLon / gridSize) * gridSize;
      const startY = Math.floor(bounds.minLat / gridSize) * gridSize;
      const endY = Math.ceil(bounds.maxLat / gridSize) * gridSize;

      for (let lon = startX; lon <= endX; lon += gridSize) {
        const { x } = projectPoint(lon, bounds.minLat, bounds, width, height);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let lat = startY; lat <= endY; lat += gridSize) {
        const { y } = projectPoint(bounds.minLon, lat, bounds, width, height);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Draw features
    features.forEach((feature: GeoJSONFeature) => {
      const props = feature.properties || {};
      const geom = feature.geometry;

      if (!geom) return;

      // Determine colors based on amenity
      let fillColor = "rgba(147, 197, 253, 0.6)";
      let strokeColor = "rgba(59, 130, 246, 1)";
      let lineWidth = 2;

      if (props.amenity === "wall") {
        strokeColor = "rgba(66, 66, 66, 0.9)";
        lineWidth = 4;
      } else if (props.amenity === "room") {
        fillColor = "rgba(100, 181, 246, 0.7)";
        strokeColor = "rgba(59, 130, 246, 1)";
      } else if (props.amenity === "entrance") {
        fillColor = "rgba(141, 110, 99, 0.8)";
        strokeColor = "rgba(121, 85, 72, 1)";
      } else if (props.amenity === "window") {
        fillColor = "rgba(129, 212, 250, 0.5)";
        strokeColor = "rgba(3, 169, 244, 1)";
      }

      if (geom.type === "LineString") {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        (geom.coordinates as number[][]).forEach(
          (coord: number[], i: number) => {
            const { x, y } = projectPoint(
              coord[0],
              coord[1],
              bounds,
              width,
              height
            );
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        );
        ctx.stroke();
      } else if (geom.type === "Polygon") {
        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        (geom.coordinates as number[][][])[0].forEach(
          (coord: number[], i: number) => {
            const { x, y } = projectPoint(
              coord[0],
              coord[1],
              bounds,
              width,
              height
            );
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (geom.type === "Point") {
        const coords = geom.coordinates as number[];
        const { x, y } = projectPoint(
          coords[0],
          coords[1],
          bounds,
          width,
          height
        );

        ctx.fillStyle = fillColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    });

    // Draw labels
    if (showLabels) {
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      features.forEach((feature: GeoJSONFeature) => {
        const props = feature.properties || {};
        const name = props.name;
        if (!name) return;

        const geom = feature.geometry;
        if (!geom) return;

        let labelX: number | undefined;
        let labelY: number | undefined;

        if (geom.type === "Point") {
          const coords = geom.coordinates as number[];
          const { x, y } = projectPoint(
            coords[0],
            coords[1],
            bounds,
            width,
            height
          );
          labelX = x;
          labelY = y + 15;
        } else if (geom.type === "Polygon") {
          // Calculate centroid
          let sumX = 0,
            sumY = 0,
            count = 0;
          (geom.coordinates as number[][][])[0].forEach((coord: number[]) => {
            sumX += coord[0];
            sumY += coord[1];
            count++;
          });
          const { x, y } = projectPoint(
            sumX / count,
            sumY / count,
            bounds,
            width,
            height
          );
          labelX = x;
          labelY = y;
        }

        if (labelX !== undefined && labelY !== undefined) {
          // Draw background
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          const metrics = ctx.measureText(name);
          const padding = 4;
          ctx.fillRect(
            labelX - metrics.width / 2 - padding,
            labelY - 7,
            metrics.width + padding * 2,
            14
          );

          // Draw text
          ctx.fillStyle = "#1f2937";
          ctx.fillText(name, labelX, labelY);
        }
      });
    }

    ctx.restore();
  }, [geoData, scale, pan, showLabels, showGrid, selectedLevel]);

  // Handle mouse wheel for zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.5, Math.min(10, prev * delta)));
  };

  // Handle mouse drag for pan
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!input) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-[20px]  text-slate-900">GeoJSON Indoor Map</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          <Card>
            <CardHeader>
              <CardTitle>Input GeoJSON</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your GeoJSON data here..."
                className="max-h-[400px] font-mono text-sm"
              />
              <Button onClick={updateGejson} className="w-full">
                Update
              </Button>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader></CardHeader>
            <CardContent>
              {!geoData ? (
                <div className="flex items-center justify-center max-h-[400px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                  <p className="text-slate-500">
                    Paste GeoJSON and click &ldquo;Render Map&rdquo;
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {metadata && (
                    <div className="bg-slate-50 p-4 rounded-lg grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold">Room:</span>{" "}
                        {metadata.roomName}
                      </div>
                      <div>
                        <span className="font-semibold">Dimensions:</span>{" "}
                        {metadata.roomWidth}m × {metadata.roomHeight}m
                      </div>
                      <div>
                        <span className="font-semibold">Area:</span>{" "}
                        {metadata.roomArea} m²
                      </div>
                      <div>
                        <span className="font-semibold">Level:</span>{" "}
                        {metadata.currentLevel}
                      </div>
                    </div>
                  )}

                  <div
                    ref={containerRef}
                    className="relative bg-white rounded-lg border overflow-hidden"
                    style={{ cursor: isDragging ? "grabbing" : "grab" }}
                  >
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={600}
                      onWheel={handleWheel}
                      onMouseDown={handleMouseDown}
                      className="w-full"
                    />
                    <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full shadow text-xs font-semibold">
                      Zoom: {scale.toFixed(1)}x
                    </div>
                    {selectedLevel !== "all" && (
                      <div className="absolute top-4 left-4 bg-blue-100 px-3 py-1 rounded-full shadow text-xs font-semibold">
                        Level {selectedLevel}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
