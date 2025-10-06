// src/components/ImageExplorer.tsx
import React, { useMemo, useState } from "react";
import { ZoomIn, ZoomOut, RotateCw, Download, Layers as LayersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

import { aiInsights, DatasetMetadata } from "@/data/datasets";
import { useDataset } from "@/context/DatasetContext";


const ImageExplorer: React.FC = () => {
  // global dataset state (from context)
  const { selectedDataset, setSelectedDataset, datasets: storeDatasets } = useDataset();
const MarsTileLayer: React.FC<{ zoomLevel: number }> = ({ zoomLevel }) => {
  // Example: render a grid of 8x4 tiles for zoom=3
  const tiles = [];
  const maxX = 8;
  const maxY = 4;
  for (let x = 0; x < maxX; x++) {
    for (let y = 0; y < maxY; y++) {
      const url = `https://trek.nasa.gov/tiles/tileserver/mars/1.0.0/MDIM21_ClrMosaic_Global_1024/default/default028mm/${zoomLevel}/${y}/${x}.jpg`;
      tiles.push(
        <img
          key={`${x}-${y}`}
          src={url}
          alt={`Tile ${x},${y}`}
          className="absolute"
          style={{
            left: x * 256,
            top: y * 256,
            width: 256,
            height: 256,
          }}
          draggable={false}
        />
      );
    }
  }

  return (
    <div className="relative" style={{ width: maxX * 256, height: maxY * 256 }}>
      {tiles}
    </div>
  );
};

  // which planet tab is active in the sidebar
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Earth");

  // viewer: zoom / pan
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // toolbar actions
  const handleZoomIn = () => setZoom((z) => Math.min(z + 1, 30));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 1, 1));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // mouse handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);

  // planet & dataset switching
  const handlePlanetChange = (planet: string) => {
    setSelectedPlanet(planet);
    const list = storeDatasets[planet as keyof typeof storeDatasets];
    if (list?.length) {
      setSelectedDataset(list[0]);
      handleReset();
    }
  };
  const handleDatasetChange = (dataset: DatasetMetadata) => {
    setSelectedDataset(dataset);
    handleReset();
  };

  // LAYERS POPOVER state
  const [layersOpen, setLayersOpen] = useState(false);
  const [showAI, setShowAI] = useState(true);
  const [showWind, setShowWind] = useState(false);
  const [compare, setCompare] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(50);

  // choose the pre/post pair for compare overlay
  const preCyclone = useMemo(
    () => storeDatasets.Earth?.find((d) => d.id === "pre-cyclone-02a"),
    [storeDatasets]
  );
  const finalCyclone = useMemo(
    () => storeDatasets.Earth?.find((d) => d.id === "tropical-cyclone-02a"),
    [storeDatasets]
  );

  // the image to overlay when "Compare" is ON
  const overlayDataset = useMemo(() => {
    if (!compare) return null;
    if (!preCyclone || !finalCyclone || !selectedDataset) return null;
    return selectedDataset.id === preCyclone.id ? finalCyclone : preCyclone;
  }, [compare, selectedDataset, preCyclone, finalCyclone]);

  // AI detections for the current image
const detections = aiInsights[selectedDataset.id] ?? [];

  // transform for image container (pan + zoom)
  const transformStyle = {
    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`,
    transition: isDragging ? "none" : "transform 0.2s",
  } as const;

  // list for the current planet tab
  const planetList: DatasetMetadata[] =
    storeDatasets[selectedPlanet as keyof typeof storeDatasets] ?? [];

  return (
    <section id="explorer" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Interactive Image Explorer</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Zoom, pan, and explore high-resolution NASA imagery
          </p>
        </div>

        {/* ==== MAIN GRID: viewer (left 3 cols) + sidebar (right 1 col) ==== */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* ===== Main viewer on the LEFT ===== */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="glass-panel overflow-hidden">
              {/* Toolbar */}
              <div className="border-b border-border/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="glass-panel" onClick={handleZoomIn}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="glass-panel" onClick={handleZoomOut}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="glass-panel" onClick={handleReset}>
                    <RotateCw className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">{Math.round(zoom * 100)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <Popover open={layersOpen} onOpenChange={setLayersOpen}>
                    <PopoverTrigger asChild>
                      <Button size="sm" variant="outline" className="glass-panel">
                        <LayersIcon className="w-4 h-4 mr-2" />
                        Layers
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-72 space-y-4">
                      {/* AI Insights */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ai-insights">AI Insights</Label>
                        <Switch
                          id="ai-insights"
                          checked={showAI}
                          onCheckedChange={setShowAI}
                        />
                      </div>

                      {/* Wind */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="wind">Wind Pattern Overlay</Label>
                        <Switch id="wind" checked={showWind} onCheckedChange={setShowWind} />
                      </div>

                      {/* Compare */}
                      <div className="flex items-center justify-between">
                        <Label htmlFor="compare">Compare Pre/Post Cyclone</Label>
                        <Switch id="compare" checked={compare} onCheckedChange={setCompare} />
                      </div>

                      {/* Opacity slider (only when comparing) */}
                      {compare && (
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <Label>Overlay Opacity</Label>
                            <span className="text-xs text-muted-foreground">{overlayOpacity}%</span>
                          </div>
                          <Slider
                            value={[overlayOpacity]}
                            onValueChange={(v) => setOverlayOpacity(v[0])}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>

                  <Button size="sm" variant="outline" className="glass-panel">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Viewer */}
              <div
                className="relative w-full h-[600px] bg-background/50 overflow-hidden cursor-move"
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
              >
                {/* Moving/zooming group */}
                <div
                  className="absolute top-1/2 left-1/2 will-change-transform"
                  style={transformStyle}
                >
                  {selectedDataset.planet === "Mars" ? (
  <MarsTileLayer zoomLevel={3} />
) : (
<img
  src={selectedDataset.image}
  alt={selectedDataset.name}
  className="select-none object-contain"
  style={{
    width: "100%",       // fill the container width
    height: "auto",      // maintain aspect ratio
    maxWidth: "600px",   // optional: limit maximum size
    borderRadius: "50%", // optional: make it circular
  }}
  draggable={false}
/>
)}

                  {/* Compare overlay */}
                  {compare && overlayDataset && (
                    <img
                      src={overlayDataset.image}
                      alt={`${overlayDataset.name} overlay`}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      style={{ opacity: overlayOpacity / 100 }}
                      draggable={false}
                    />
                  )}

                  {/* Wind overlay (demo SVG) */}
                  {showWind && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 1000 600"
                      style={{ opacity: 0.35 }}
                    >
                      {Array.from({ length: 10 }).map((_, r) =>
                        Array.from({ length: 16 }).map((__, c) => {
                          const x = 30 + c * 60;
                          const y = 30 + r * 55;
                          const angle = (Math.sin(r * 1.2 + c * 0.6) * Math.PI) / 3;
                          const len = 25;
                          const x2 = x + len * Math.cos(angle);
                          const y2 = y + len * Math.sin(angle);
                          return (
                            <g key={`${r}-${c}`}>
                              <line x1={x} y1={y} x2={x2} y2={y2} stroke="white" strokeWidth="2" />
                              <polygon
                                points={`${x2},${y2} ${x2 - 5 * Math.cos(angle - 0.5)},${y2 - 5 * Math.sin(angle - 0.5)} ${x2 - 5 * Math.cos(angle + 0.5)},${y2 - 5 * Math.sin(angle + 0.5)}`}
                                fill="white"
                              />
                            </g>
                          );
                        })
                      )}
                    </svg>
                  )}

                  {/* AI insights badge/box */}
                  {showAI && detections.length > 0 && (
                    <div
                      className="absolute w-32 h-32 border-2 border-accent rounded-lg aurora-glow pointer-events-none animate-pulse"
                      style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                    >
                      <div className="absolute -top-8 left-0 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                        AI Detected: {detections[0].pattern}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Metadata below viewer */}
            <Card className="glass-panel p-4">
              <h3 className="font-semibold mb-3">Metadata</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Source</span>
                  <span className="font-medium text-right">{selectedDataset.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolution</span>
                  <span className="font-medium">{selectedDataset.resolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selectedDataset.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wavelength</span>
                  <span className="font-medium text-right">{selectedDataset.wavelength}</span>
                </div>
                {selectedDataset.coordinates && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coordinates</span>
                    <span className="font-medium">
                      {selectedDataset.coordinates.lat.toFixed(1)}°,{" "}
                      {selectedDataset.coordinates.lon.toFixed(1)}°
                    </span>
                  </div>
                )}
                {selectedDataset.windSpeed && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wind Speed</span>
                    <span className="font-medium">{selectedDataset.windSpeed}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-border/50">
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {selectedDataset.description}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* ===== Sidebar on the RIGHT ===== */}
          <div className="space-y-4">
            {/* Planets */}
            <Card className="glass-panel p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">Celestial Bodies</h3>
              <div className="space-y-2">
                {Object.keys(storeDatasets).map((planet) => (
                  <button
                    key={planet}
                    onClick={() => handlePlanetChange(planet)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      planet === selectedPlanet
                        ? "bg-primary text-primary-foreground cosmic-glow"
                        : "hover:bg-muted"
                    }`}
                  >
                    {planet}
                  </button>
                ))}
              </div>
            </Card>

            {/* Datasets for selected planet */}
            {planetList.length > 0 && (
              <Card className="glass-panel p-4">
                <h3 className="font-semibold mb-3 text-accent">{selectedPlanet} Datasets</h3>
                <div className="space-y-2">
                  {planetList.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleDatasetChange(d)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        d.id === selectedDataset.id
                          ? "bg-accent/20 border border-accent"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{d.timestamp}</div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* AI Insights list */}
            <Card className="glass-panel p-4">
              <h3 className="font-semibold mb-3 text-accent">AI Insights</h3>
              <div className="space-y-3 text-sm">
                {(aiInsights[selectedDataset.id] ?? []).map((it, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        idx === 0 ? "bg-accent" : "bg-secondary"
                      }`}
                    />
                    <div>
                      <div className="font-medium">{it.pattern}</div>
                      <div className="text-muted-foreground text-xs">Confidence: {it.confidence}%</div>
                    </div>
                  </div>
                ))}
                {(!aiInsights[selectedDataset.id] || aiInsights[selectedDataset.id].length === 0) && (
                  <div className="text-xs text-muted-foreground">No AI insights for this image.</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageExplorer;
