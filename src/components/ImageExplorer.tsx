import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCw, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { datasets, aiInsights, DatasetMetadata } from "@/data/datasets";
import { useDataset } from "@/context/DatasetContext";

const ImageExplorer = () => {
  const [selectedPlanet, setSelectedPlanet] = useState("Earth");

  // ✅ use the shared dataset
  const { selectedDataset, setSelectedDataset } = useDataset();

  // zoom / pan
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.5, 5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.5, 1));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handlePlanetChange = (planet: string) => {
    setSelectedPlanet(planet);
    const planetDatasets = datasets[planet as keyof typeof datasets];
    if (planetDatasets?.length) {
      setSelectedDataset(planetDatasets[0]);
      handleReset();
    }
  };

  const handleDatasetChange = (dataset: DatasetMetadata) => {
    setSelectedDataset(dataset);
    handleReset();
  };

  const currentInsights = aiInsights[selectedDataset.id] || [];

  const transformStyle = {
    transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`,
    transition: isDragging ? "none" : "transform 0.2s",
  } as const;

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
          {/* Main Viewer */}
          <div className="lg:col-span-3">
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
                  <span className="text-sm text-muted-foreground ml-2">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="glass-panel">
                    <Layers className="w-4 h-4 mr-2" />
                    Layers
                  </Button>
                  <Button size="sm" variant="outline" className="glass-panel">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Viewer Canvas (read-only for annotations) */}
              <div
                className="relative w-full h-[600px] bg-background/50 overflow-hidden cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Transform layer: image + overlays */}
                <div className="absolute top-1/2 left-1/2 will-change-transform" style={transformStyle}>
                  <img
                    src={selectedDataset.image}
                    alt={selectedDataset.name}
                    className="select-none max-w-none"
                    style={{ width: "1000px", height: "auto" }}
                    draggable={false}
                  />

                  {/* AI Highlight (click-through) */}
                  {currentInsights.length > 0 && (
                    <div
                      className="absolute w-32 h-32 border-2 border-accent rounded-lg aurora-glow pointer-events-none animate-pulse"
                      style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                    >
                      <div className="absolute -top-8 left-0 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                        AI Detected: {currentInsights[0].pattern}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-4">
            {/* Planet Selector */}
            <Card className="glass-panel p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Celestial Bodies
              </h3>
              <div className="space-y-2">
                {Object.keys(datasets).map((planet) => (
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

            {/* Dataset Selector */}
            {datasets[selectedPlanet as keyof typeof datasets].length > 1 && (
              <Card className="glass-panel p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent" />
                  {selectedPlanet} Datasets
                </h3>
                <div className="space-y-2">
                  {datasets[selectedPlanet as keyof typeof datasets].map((dataset) => (
                    <button
                      key={dataset.id}
                      onClick={() => handleDatasetChange(dataset)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                        dataset.id === selectedDataset.id
                          ? "bg-accent/20 border border-accent"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="font-medium">{dataset.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {dataset.timestamp}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* AI Insights */}
            <Card className="glass-panel p-4">
              <h3 className="font-semibold mb-3 text-accent">AI Insights</h3>
              <div className="space-y-3 text-sm">
                {currentInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 animate-pulse ${idx === 0 ? "bg-accent" : "bg-secondary"}`} />
                    <div>
                      <div className="font-medium">{insight.pattern}</div>
                      <div className="text-muted-foreground text-xs">
                        Confidence: {insight.confidence}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Metadata */}
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
                      {selectedDataset.coordinates.lat.toFixed(1)}°, {selectedDataset.coordinates.lon.toFixed(1)}°
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
        </div>
      </div>
    </section>
  );
};

export default ImageExplorer;
