// src/context/DatasetContext.tsx
import React, { createContext, useContext, useState } from "react";
import { datasets } from "@/data/datasets";
import type { DatasetMetadata } from "@/data/datasets";

type DatasetMap = typeof datasets;

interface DatasetContextType {
  selectedDataset: DatasetMetadata;
  setSelectedDataset: (dataset: DatasetMetadata) => void;
  datasets: DatasetMap;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = datasets.Earth?.[0];
  if (!initial) {
    throw new Error("datasets.Earth is empty — add at least one dataset to Earth.");
  }

  const [selectedDataset, setSelectedDataset] = useState<DatasetMetadata>(initial);

  return (
    <DatasetContext.Provider value={{ selectedDataset, setSelectedDataset, datasets }}>
      {children}
    </DatasetContext.Provider>
  );
};

export const useDataset = () => {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error("useDataset must be used within a DatasetProvider");
  return ctx;
};
