import { useEffect, useMemo, useRef, useState } from "react";
import { Pencil, MapPin, MessageSquare, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDataset } from "@/context/DatasetContext";

type Tool = "marker" | "note" | "highlight" | null;

interface BaseAnn {
  id: string;
  type: "marker" | "note" | "highlight";
  x: number;
  y: number;
  timestamp: string;
  content?: string;
  width?: number;
  height?: number;
}

const AnnotationTools = () => {
  const { selectedDataset } = useDataset();

  const [annotations, setAnnotations] = useState<BaseAnn[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>(null);

  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ xPct: number; yPct: number } | null>(null);
  const [tempRect, setTempRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const STORAGE_KEY = useMemo(() => `ann:${selectedDataset.id}`, [selectedDataset.id]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    setAnnotations(raw ? (JSON.parse(raw) as BaseAnn[]) : []);
  }, [STORAGE_KEY]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
  }, [annotations, STORAGE_KEY]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const pctFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    return { xPct, yPct };
  };

  const add = (ann: Omit<BaseAnn, "id" | "timestamp"> & Partial<Pick<BaseAnn, "timestamp">>) =>
    setAnnotations((prev) => [
      ...prev,
      { ...ann, id: crypto.randomUUID(), timestamp: ann.timestamp ?? "just now" },
    ]);

  const handleDelete = (id: string) => setAnnotations((prev) => prev.filter((a) => a.id !== id));

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === "marker") {
      const { xPct, yPct } = pctFromEvent(e);
      add({ type: "marker", x: xPct, y: yPct, content: "New marker" });
      setActiveTool(null);
    }
    if (activeTool === "note") {
      const { xPct, yPct } = pctFromEvent(e);
      const text = window.prompt("Enter note text:") ?? "";
      if (text.trim()) add({ type: "note", x: xPct, y: yPct, content: text.trim() });
      setActiveTool(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== "highlight") return;
    const { xPct, yPct } = pctFromEvent(e);
    dragStart.current = { xPct, yPct };
    setTempRect({ x: xPct, y: yPct, w: 0, h: 0 });
    setDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || activeTool !== "highlight" || !dragStart.current) return;
    const { xPct, yPct } = pctFromEvent(e);
    const sx = dragStart.current.xPct;
    const sy = dragStart.current.yPct;
    const x = Math.min(sx, xPct);
    const y = Math.min(sy, yPct);
    const w = Math.abs(xPct - sx);
    const h = Math.abs(yPct - sy);
    setTempRect({ x, y, w, h });
  };

  const handleMouseUp = () => {
    if (activeTool !== "highlight" || !dragging || !tempRect) return;
    if (tempRect.w > 0.5 && tempRect.h > 0.5) {
      add({
        type: "highlight",
        x: tempRect.x,
        y: tempRect.y,
        width: tempRect.w,
        height: tempRect.h,
        content: "Highlight",
      });
    }
    setDragging(false);
    dragStart.current = null;
    setTempRect(null);
    setActiveTool(null);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Annotation & Discovery Tools</span>
          </h2>
          <p className="text-muted-foreground text-lg">Mark, annotate, and share your discoveries</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <Card className="glass-panel p-6">
              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/50">
                <Button
                  size="sm"
                  variant={activeTool === "marker" ? "default" : "outline"}
                  className={activeTool === "marker" ? "bg-primary cosmic-glow" : "glass-panel"}
                  onClick={() => setActiveTool("marker")}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Marker
                </Button>
                <Button
                  size="sm"
                  variant={activeTool === "note" ? "default" : "outline"}
                  className={activeTool === "note" ? "bg-accent aurora-glow" : "glass-panel"}
                  onClick={() => setActiveTool("note")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Note
                </Button>
                <Button
                  size="sm"
                  variant={activeTool === "highlight" ? "default" : "outline"}
                  className={activeTool === "highlight" ? "bg-secondary" : "glass-panel"}
                  onClick={() => setActiveTool("highlight")}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Highlight
                </Button>

                <div className="flex-1" />
                <Button
                  size="sm"
                  className="bg-primary"
                  onClick={() => {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
                    alert("Session saved! Your annotations are safely stored.");
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Session
                </Button>
              </div>

              {/* Canvas image + annotations */}
              <div
                className={`relative aspect-video bg-background/50 rounded-lg overflow-hidden ${
                  activeTool ? "cursor-crosshair" : "cursor-default"
                }`}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  src={selectedDataset.image}
                  alt={selectedDataset.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-90 select-none"
                  draggable={false}
                />

                {tempRect && (
                  <div
                    className="absolute bg-yellow-400/25 border border-yellow-400 rounded pointer-events-none"
                    style={{
                      top: `${tempRect.y}%`,
                      left: `${tempRect.x}%`,
                      width: `${tempRect.w}%`,
                      height: `${tempRect.h}%`,
                    }}
                  />
                )}

                {annotations.map((a) =>
                  a.type === "highlight" ? (
                    <div
                      key={a.id}
                      className="absolute bg-yellow-400/20 border border-yellow-400 rounded pointer-events-none"
                      style={{
                        top: `${a.y}%`,
                        left: `${a.x}%`,
                        width: `${a.width}%`,
                        height: `${a.height}%`,
                      }}
                      title={a.content}
                    />
                  ) : (
                    <div
                      key={a.id}
                      className={`absolute pointer-events-none ${
                        a.type === "marker"
                          ? "w-6 h-6 rounded-full border-2 border-primary bg-primary/20 animate-pulse"
                          : "px-2 py-1 rounded bg-accent text-accent-foreground text-xs shadow"
                      }`}
                      style={{
                        top: `${a.y}%`,
                        left: `${a.x}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {a.type === "marker" ? (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          {a.content ?? "Marker"}
                        </div>
                      ) : (
                        a.content
                      )}
                    </div>
                  )
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{annotations.length}</div>
                  <div className="text-xs text-muted-foreground">Total Annotations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">12</div>
                  <div className="text-xs text-muted-foreground">Discoveries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">3</div>
                  <div className="text-xs text-muted-foreground">Shared</div>
                </div>
              </div>
            </Card>
          </div>

          {/* List */}
          <div>
            <Card className="glass-panel p-4">
              <h3 className="font-semibold mb-4">Your Annotations</h3>
              <div className="space-y-3">
                {annotations.map((a) => (
                  <div key={a.id} className="glass-panel p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={
                          a.type === "marker"
                            ? "border-primary text-primary"
                            : a.type === "note"
                            ? "border-accent text-accent"
                            : "border-secondary text-secondary"
                        }
                      >
                        {a.type}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleDelete(a.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm mb-1">{a.content ?? (a.type === "highlight" ? "Highlight" : "Marker")}</p>
                    <p className="text-xs text-muted-foreground">{a.timestamp || now()}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="glass-panel p-4 rounded-lg text-center cosmic-glow">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="font-semibold">Explorer Badge</div>
                  <div className="text-xs text-muted-foreground">10+ Annotations Made</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnotationTools;
