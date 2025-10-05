// src/components/TimelapseControl.tsx
import { useEffect, useRef, useState, useMemo } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useDataset } from "@/context/DatasetContext";

const TOTAL = 319;          // Day 0 → Day 319
const TICK_MS = 1000;  // ⏳ interval between updates (1 second per tick)
const STEP = 32;      // 🌀 move 40 days per tick (was 50)   //  Move 50 days per tick (was 60)


const TimelapseControl = () => {
  const { datasets, setSelectedDataset } = useDataset();

  // 1) Build frames in the exact order you want (Day 0 → 319)
  const frames = useMemo(() => {
    const earth = datasets.Earth ?? [];
    const pick = (id: string) => earth.find((d) => d.id === id);
    return [
      pick("pre-cyclone-02a"),       // Day 0 (Nov 18, 2024)
      pick("cyclone-02a-stage1"),    // Day 100 (Feb 26, 2025)
      pick("cyclone-02a-stage2"),    // Day 200 (Jun 6, 2025)
      pick("cyclone-02a-stage3"),    // Day 300 (Sep 14, 2025)
      pick("tropical-cyclone-02a"),  // Day 319 (Oct 3, 2025)
    ].filter(Boolean);
  }, [datasets]);

  // 2) State
  const [isPlaying, setIsPlaying] = useState(false);
  const [frameDay, setFrameDay] = useState<number>(TOTAL); // start on final frame (cyclone)
  const intervalRef = useRef<number | null>(null);

  // 3) Map day (0..319) → frame index (0..frames.length-1)
  const dayToIndex = (day: number) => {
    if (!frames.length) return 0;
    const idx = Math.round((day / TOTAL) * (frames.length - 1));
    return Math.min(frames.length - 1, Math.max(0, idx));
  };

  // 4) Apply current frame to the explorer
  useEffect(() => {
    if (!frames.length) return;
    const idx = dayToIndex(frameDay);
    setSelectedDataset(frames[idx]!);
  }, [frameDay, frames, setSelectedDataset]);

  // 5) Play/pause behavior (looping)
  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = window.setInterval(() => {
      setFrameDay((prev) => {
        const next = prev + STEP;
        // loop back to 0 once we pass the end
        return next > TOTAL ? 0 : next;
      });
    }, TICK_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      // on play, start from Day 0 (pre-cyclone)
      setFrameDay(0);
      setIsPlaying(true);
    }
  };

  const handleSlider = (v: number[]) => setFrameDay(v[0]);
  const skipToStart = () => setFrameDay(0);
  const skipToEnd = () => setFrameDay(TOTAL);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Cyclone 02A Time-Lapse</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Pre-Cyclone (Day 0) → Cyclone (Day 319), looping playback
          </p>
        </div>

        <Card className="glass-panel p-8 max-w-4xl mx-auto">
          {/* Slider */}
          <div className="space-y-2 mb-6">
            <Slider
              value={[frameDay]}
              onValueChange={handleSlider}
              max={TOTAL}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Day 0 (Nov 18, 2024)</span>
              <span className="font-medium text-foreground">Day {frameDay} / {TOTAL}</span>
              <span>Day 319 (Oct 3, 2025)</span>
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

          {/* Dates */}
          <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">Nov 18, 2024</div>
              <div className="text-xs text-muted-foreground">Start (Pre-Cyclone)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">Oct 3, 2025</div>
              <div className="text-xs text-muted-foreground">End (Cyclone)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{TOTAL} days</div>
              <div className="text-xs text-muted-foreground">Total Span</div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default TimelapseControl;
