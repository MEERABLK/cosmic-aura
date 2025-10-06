// src/data/datasets.ts
import earthSample from "@/assets/earth-sample.jpg";
import cycloneImage from "@/assets/tropical-cyclone-02a.png";
import preCycloneImage from "@/assets/pre-cyclone-02a-arabian-sea-2024.jpg";
import stage1Image from "@/assets/cyclone-02a-stage1.jpg";
import stage2Image from "@/assets/cyclone-02a-stage2.jpg";
import stage3Image from "@/assets/cyclone-02a-stage3.jpg";
import andromedaImage from "@/assets/andromeda.jpg";

// Moon frames
import moon01 from "@/assets/moon/moon0.jpg";
import moon02 from "@/assets/moon/moon100.jpg";
import moon03 from "@/assets/moon/moon200.jpg";
import moon04 from "@/assets/moon/moon300.jpg";
import moon05 from "@/assets/moon/moon319.jpg";

// --- Type ---
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

// --- Moon frames export ---
export const moonTimelapseFrames: DatasetMetadata[] = [
  {
    id: "moon-frame-1",
    name: "Moon – Frame 1",
    planet: "Moon",
    timestamp: "2025-01-01",
    instrument: "LROC",
    description: "Lunar surface detail",
    source: "NASA LRO / LROC",
    resolution: "HD",
    wavelength: "Visible",
    image: moon01,
    thumbnail: moon01,
  },
  {
    id: "moon-frame-2",
    name: "Moon – Frame 2",
    planet: "Moon",
    timestamp: "2025-01-02",
    instrument: "LROC",
    description: "Lunar surface detail",
    source: "NASA LRO / LROC",
    resolution: "HD",
    wavelength: "Visible",
    image: moon02,
    thumbnail: moon02,
  },
  {
    id: "moon-frame-3",
    name: "Moon – Frame 3",
    planet: "Moon",
    timestamp: "2025-01-03",
    instrument: "LROC",
    description: "Lunar surface detail",
    source: "NASA LRO / LROC",
    resolution: "HD",
    wavelength: "Visible",
    image: moon03,
    thumbnail: moon03,
  },
  {
    id: "moon-frame-4",
    name: "Moon – Frame 4",
    planet: "Moon",
    timestamp: "2025-01-04",
    instrument: "LROC",
    description: "Lunar surface detail",
    source: "NASA LRO / LROC",
    resolution: "HD",
    wavelength: "Visible",
    image: moon04,
    thumbnail: moon04,
  },
  {
    id: "moon-frame-5",
    name: "Moon – Frame 5",
    planet: "Moon",
    timestamp: "2025-01-05",
    instrument: "LROC",
    description: "Lunar surface detail",
    source: "NASA LRO / LROC",
    resolution: "HD",
    wavelength: "Visible",
    image: moon05,
    thumbnail: moon05,
  },
];

// --- Datasets ---
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

  Moon: [...moonTimelapseFrames],

  Mars: [
    {
      id: "mars-global-color",
      name: "Mars Global Mosaic (MDIM21)",
      planet: "Mars",
      timestamp: "2024-12-01",
      instrument: "MOLA + Viking Color Mosaic",
      description:
        "Global map tiles from NASA Mars Trek (MDIM21_ClrMosaic_Global_1024)",
      source: "NASA Mars Trek / USGS Astrogeology",
      resolution: "1024ppd (~60 m/pixel)",
      wavelength: "Visible Color",
      image:
        "https://trek.nasa.gov/tiles/tileserver/mars/1.0.0/MDIM21_ClrMosaic_Global_1024/default/default028mm/3/4/2.jpg",
      thumbnail:
        "https://trek.nasa.gov/tiles/tileserver/mars/1.0.0/MDIM21_ClrMosaic_Global_1024/default/default028mm/3/4/2.jpg",
    },
  ],

  Andromeda: [
    {
      id: "andromeda-sample",
      name: "Andromeda Galaxy",
      planet: "Andromeda",
      timestamp: "2024-07-10",
      instrument: "Hubble Space Telescope",
      description:
        "Deep space observation of the Andromeda Galaxy showing stellar formations.",
      source: "NASA Hubble",
      resolution: "3.2 GP",
      wavelength: "Multi-spectrum",
      image: andromedaImage,
      thumbnail: andromedaImage,
    },
  ],
};

// --- Optional AI insights ---
export const aiInsights: Record<string, Array<{ pattern: string; confidence: number }>> = {
  "pre-cyclone-02a": [
    { pattern: "Low-pressure System", confidence: 82 },
    { pattern: "Developing Rotation", confidence: 78 },
  ],
  "cyclone-02a-stage1": [{ pattern: "Spiral Bands", confidence: 86 }],
  "cyclone-02a-stage2": [{ pattern: "Deep Convection", confidence: 90 }],
  "cyclone-02a-stage3": [{ pattern: "Defined Eyewall", confidence: 93 }],
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
