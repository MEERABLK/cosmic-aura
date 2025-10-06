// src/components/ImageExplorer.tsx
import React, { useMemo, useState } from "react";
import { ZoomIn, ZoomOut, RotateCw, Download, Layers as LayersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import marsGlobe from "@/assets/marslook.png";

import { aiInsights, DatasetMetadata } from "@/data/datasets";
import { useDataset } from "@/context/DatasetContext";

const ImageExplorer: React.FC = () => {
  // global dataset state (from context)
  const { selectedDataset, setSelectedDataset, datasets: storeDatasets } = useDataset();

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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ai-insights">AI Insights</Label>
                        <Switch id="ai-insights" checked={showAI} onCheckedChange={setShowAI} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="wind">Wind Pattern Overlay</Label>
                        <Switch id="wind" checked={showWind} onCheckedChange={setShowWind} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="compare">Compare Pre/Post Cyclone</Label>
                        <Switch id="compare" checked={compare} onCheckedChange={setCompare} />
                      </div>
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
                <div
                  className="absolute top-1/2 left-1/2 will-change-transform"
                  style={transformStyle}
                >
                  {selectedDataset.planet === "Mars" ? (
                    <img
                      src={marsGlobe} 
                      alt="Mars Globe"
                      className="select-none object-contain"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "600px",
                        borderRadius: "50%",
                      }}
                      draggable={false}
                    />
                  ) : (
                    <img
                      src={selectedDataset.image}
                      alt={selectedDataset.name}
                      className="select-none object-contain"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "600px",
                        borderRadius: "50%",
                      }}
                      draggable={false}
                    />
                  )}

                  {compare && overlayDataset && (
                    <img
                      src={overlayDataset.image}
                      alt={`${overlayDataset.name} overlay`}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      style={{ opacity: overlayOpacity / 100 }}
                      draggable={false}
                    />
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
              </div>
            </Card>
          </div>

          {/* ===== Sidebar on the RIGHT ===== */}
          <div className="space-y-4">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageExplorer;
