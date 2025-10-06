import React, { useState } from "react";

// A simple Mars base map using NASA WMTS tiles
const MarsMap: React.FC = () => {
  const [zoom, setZoom] = useState(3);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Tile math: convert zoom/position into tile URL pattern
  const tileUrl = (z: number, x: number, y: number) =>
    `https://trek.nasa.gov/tiles/tileserver/mars/1.0.0/MDIM21_ClrMosaic_Global_1024/default/default028mm/${z}/${y}/${x}.jpg`;

  return (
    <div
      className="relative w-full h-[600px] bg-black overflow-hidden cursor-move"
      style={{ touchAction: "none" }}
    >
      {/* Example fixed tile (center region, change coords if needed) */}
      <img
        src={tileUrl(3, 4, 2)}
        alt="Mars Surface"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>
  );
};

export default MarsMap;
