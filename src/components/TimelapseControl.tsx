// src/components/TimelapseControl.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useDataset } from "@/context/DatasetContext";
import { moonTimelapseFrames, DatasetMetadata } from "@/data/datasets";

const TICK_MS = 1000; // 1s/frame

export default function TimelapseControl() {
  const { datasets, setSelectedDataset, selectedDataset } = useDataset();

  // Build EARTH frames (Cyclone sequence)
  const earthFrames = useMemo(() => {
    const earth = datasets.Earth ?? [];
    const pick = (id: string) => earth.find((d) => d.id === id) as DatasetMetadata | undefined;
    return [pick("pre-cyclone-02a"), pick("cyclone-02a-stage1"), pick("cyclone-02a-stage2"), pick("cyclone-02a-stage3"), pick("tropical-cyclone-02a")].filter(
      Boolean
    ) as DatasetMetadata[];
  }, [datasets]);

  // Decide which planet’s frames to use based on current selection
  const isMoon = selectedDataset?.planet === "Moon";
  const frames = isMoon ? moonTimelapseFrames : earthFrames;

  const TOTAL = isMoon ? frames.length - 1 : 319; // Moon: 0..4 ; Earth: 0..319
const STEP = isMoon ? 1 : 32;

  // Labels per planet
  const startLabel = isMoon ? "Frame 1" : "Day 0 (Nov 18, 2024)";
  const endLabel = isMoon ? `Frame ${frames.length}` : "Day 319 (Oct 3, 2025)";
  const title = isMoon ? "Moon Time-Lapse" : "Cyclone 02A Time-Lapse";
  const subtitle = isMoon ? "5 sequential LRO images" : "Pre-Cyclone (Day 0) → Cyclone (Day 319)";

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [cursor, setCursor] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  // Map slider value -> frame index
  const sliderToIndex = (v: number) => {
    if (!frames.length) return 0;
if (isMoon) return Math.min(frames.length - 1, Math.max(0, v));
    // Earth: 0..319 -> 0..(frames-1)
    const idx = Math.round((v / 319) * (frames.length - 1));
    return Math.min(frames.length - 1, Math.max(0, idx));
  };

  // Apply current frame to the explorer
  useEffect(() => {
    if (!frames.length) return;
    setSelectedDataset(frames[sliderToIndex(cursor)]);
  }, [cursor, frames, setSelectedDataset]);

  // Reset playhead when the planet changes
  useEffect(() => {
    setIsPlaying(false);
    setCursor(TOTAL);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [isMoon, TOTAL]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = window.setInterval(() => {
      setCursor((prev) => {
        const next = prev + STEP;
        return next > TOTAL ? (isMoon ? 0 : 0) : next;
      });
    }, TICK_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, STEP, TOTAL, isMoon]);

  // Handlers
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setCursor(0);
      setIsPlaying(true);
    }
  };
  const handleSlider = (v: number[]) => setCursor(v[0]);
  const skipToStart = () => setCursor(0);
  const skipToEnd = () => setCursor(TOTAL);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">{title}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{subtitle}</p>
        </div>

        <Card className="glass-panel p-8 max-w-4xl mx-auto">
          {/* Slider */}
          <div className="space-y-2 mb-6">
            <Slider
              value={[cursor]}
              onValueChange={handleSlider}
              max={TOTAL}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{startLabel}</span>
              <span className="font-medium text-foreground">
  {isMoon
    ? // Map Moon frames to days
      `Day ${[0, 100, 200, 300, 319][cursor] ?? 0} / 319`
    : `Day ${cursor} / 319`}
</span>

              <span>{endLabel}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button size="sm" variant="outline" className="glass-panel" onClick={skipToStart}>
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="lg"
              className={`cosmic-glow ${isPlaying ? "bg-secondary" : "bg-primary"}`}
              onClick={handlePlayPause}
              disabled={!frames.length}
            >
              {isPlaying ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>

            <Button size="sm" variant="outline" className="glass-panel" onClick={skipToEnd}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Footer stats */}
          <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
            {isMoon ? (
              <>
                <div>
                  <div className="text-2xl font-bold text-primary">LRO</div>
                  <div className="text-xs text-muted-foreground">Instrument</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{frames.length} frames</div>
                  <div className="text-xs text-muted-foreground">Sequential images</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">Moon</div>
                  <div className="text-xs text-muted-foreground">Target</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="text-2xl font-bold text-primary">Nov 18, 2024</div>
                  <div className="text-xs text-muted-foreground">Start</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">Oct 3, 2025</div>
                  <div className="text-xs text-muted-foreground">End</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">319 days</div>
                  <div className="text-xs text-muted-foreground">Total span</div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
