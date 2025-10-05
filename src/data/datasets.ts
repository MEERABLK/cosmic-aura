// src/data/datasets.ts
import earthSample from "@/assets/earth-sample.jpg";
import cycloneImage from "@/assets/tropical-cyclone-02a.png";
import preCycloneImage from "@/assets/pre-cyclone-02a-arabian-sea-2024.jpg";
import stage1Image from "@/assets/cyclone-02a-stage1.jpg";
import stage2Image from "@/assets/cyclone-02a-stage2.jpg";
import stage3Image from "@/assets/cyclone-02a-stage3.jpg";
import andromedaImage from "@/assets/andromeda.jpg";

export interface DatasetMetadata {
  id: string;
  name: string;
  planet: string;
  coordinates?: { lat: number; lon: number };
  timestamp: string; // ISO YYYY-MM-DD
  instrument: string;
  windSpeed?: string;
  description: string;
  source: string;
  resolution: string;
  wavelength: string;
  image: string;     // Vite image imports resolve to string URLs
  thumbnail: string;
}

export const datasets: Record<string, DatasetMetadata[]> = {
  Earth: [
    {
      id: "pre-cyclone-02a",
      name: "Pre-Cyclone 02A – Arabian Sea",
      planet: "Earth",
      coordinates: { lat: 15.0, lon: 62.0 },
      timestamp: "2024-11-18",
      instrument: "MODIS/VIIRS True Color",
      windSpeed: "10 kts",
      description:
        "Satellite view before Cyclone 02A formed, showing early disturbances in the North Arabian Sea.",
      source: "NASA MODIS/VIIRS",
      resolution: "2.1 GP",
      wavelength: "True Color Composite",
      image: preCycloneImage,
      thumbnail: preCycloneImage,
    },
    {
      id: "cyclone-02a-stage1",
      name: "Cyclone 02A – Early Development",
      planet: "Earth",
      coordinates: { lat: 15.0, lon: 62.0 },
      timestamp: "2025-02-26",
      instrument: "MODIS/VIIRS True Color",
      windSpeed: "25 kts",
      description:
        "Formation of a tropical depression — visible spiral structure starting to form.",
      source: "NASA MODIS/VIIRS",
      resolution: "2.1 GP",
      wavelength: "True Color Composite",
      image: stage1Image,
      thumbnail: stage1Image,
    },
    {
      id: "cyclone-02a-stage2",
      name: "Cyclone 02A – Strengthening",
      planet: "Earth",
      coordinates: { lat: 15.0, lon: 62.0 },
      timestamp: "2025-06-06",
      instrument: "MODIS/VIIRS True Color",
      windSpeed: "45 kts",
      description:
        "Mid-strength tropical storm with increasing convection and a better-defined eye.",
      source: "NASA MODIS/VIIRS",
      resolution: "2.1 GP",
      wavelength: "True Color Composite",
      image: stage2Image,
      thumbnail: stage2Image,
    },
    {
      id: "cyclone-02a-stage3",
      name: "Cyclone 02A – Intensifying",
      planet: "Earth",
      coordinates: { lat: 15.0, lon: 62.0 },
      timestamp: "2025-09-14",
      instrument: "MODIS/VIIRS True Color",
      windSpeed: "55 kts",
      description:
        "Rapid intensification — organized eyewall and strong cloud bands visible.",
      source: "NASA MODIS/VIIRS",
      resolution: "2.1 GP",
      wavelength: "True Color Composite",
      image: stage3Image,
      thumbnail: stage3Image,
    },
    {
      id: "tropical-cyclone-02a",
      name: "Tropical Cyclone 02A – Landfall",
      planet: "Earth",
      coordinates: { lat: 15.0, lon: 62.0 },
      timestamp: "2025-10-03",
      instrument: "MODIS/VIIRS True Color",
      windSpeed: "65 kts",
      description:
        "Final stage — Tropical Cyclone 02A making landfall near the Pakistan coastline.",
      source: "NASA MODIS/VIIRS",
      resolution: "2.1 GP",
      wavelength: "True Color Composite",
      image: cycloneImage,
      thumbnail: cycloneImage,
    },
  ],

  Moon: [
    {
      id: "moon-sample",
      name: "Lunar Surface",
      planet: "Moon",
      timestamp: "2024-09-15",
      instrument: "LRO Camera",
      description: "Detailed view of the lunar surface showing craters and maria.",
      source: "NASA LRO",
      resolution: "0.5 GP",
      wavelength: "Visible",
      image: earthSample, // Placeholder
      thumbnail: earthSample,
    },
  ],

  Mars: [
    {
      id: "mars-sample",
      name: "Martian Terrain",
      planet: "Mars",
      timestamp: "2024-08-22",
      instrument: "HiRISE",
      description:
        "High-resolution view of Martian surface features and geological formations.",
      source: "NASA MRO HiRISE",
      resolution: "1.5 GP",
      wavelength: "RGB Composite",
      image: earthSample, // Placeholder
      thumbnail: earthSample,
    },
  ],

  Andromeda: [
    {
      
  id: "andromeda-sample",
  name: "Andromeda Galaxy",
  planet: "Andromeda",
  timestamp: "2024-07-10",
  instrument: "Hubble Space Telescope",
  description: "Deep space observation of the Andromeda Galaxy showing stellar formations.",
  source: "NASA Hubble",
  resolution: "3.2 GP",
  wavelength: "Multi-spectrum",
  image: andromedaImage,
  thumbnail: andromedaImage,
}

    
  ],
};

export const aiInsights: Record<
  string,
  Array<{ pattern: string; confidence: number }>
> = {
  "pre-cyclone-02a": [
    { pattern: "Low-pressure System", confidence: 82 },
    { pattern: "Developing Rotation", confidence: 78 },
  ],
  "cyclone-02a-stage1": [
    { pattern: "Spiral Bands", confidence: 86 },
  ],
  "cyclone-02a-stage2": [
    { pattern: "Deep Convection", confidence: 90 },
  ],
  "cyclone-02a-stage3": [
    { pattern: "Defined Eyewall", confidence: 93 },
  ],
  "tropical-cyclone-02a": [
    { pattern: "Cyclonic Rotation", confidence: 98 },
    { pattern: "Eye Wall Structure", confidence: 95 },
    { pattern: "Storm Bands", confidence: 92 },
    { pattern: "Convective Activity", confidence: 89 },
  ],
  "moon-sample": [
    { pattern: "Impact Craters", confidence: 96 },
    { pattern: "Regolith Patterns", confidence: 84 },
  ],
  "mars-sample": [
    { pattern: "Erosion Patterns", confidence: 91 },
    { pattern: "Geological Layers", confidence: 88 },
  ],
  "andromeda-sample": [
    { pattern: "Star Clusters", confidence: 97 },
    { pattern: "Spiral Arms", confidence: 93 },
  ],
};

// (Optional demo frames; safe to keep or remove if unused)
export const earthTimelapseFrames: DatasetMetadata[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: `earth-timelapse-${i}`,
    name: `Earth - Day ${i * 30}`,
    planet: "Earth",
    timestamp: `2024-${String(i + 1).padStart(2, "0")}-01`,
    instrument: "MODIS",
    description: `Earth time-lapse frame ${i + 1}, showing changes in weather systems and cloud cover.`,
    source: "NASA MODIS",
    resolution: "1.2 GP",
    wavelength: "Visible",
    image: i % 2 === 0 ? earthSample : cycloneImage, // alt demo
    thumbnail: i % 2 === 0 ? earthSample : cycloneImage,
  })
);
