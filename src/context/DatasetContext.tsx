import { createContext, useContext, useState } from "react";
import { datasets } from "@/data/datasets";

interface DatasetContextType {
  selectedDataset: any;
  setSelectedDataset: (dataset: any) => void;
  datasets: typeof datasets;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export const DatasetProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDataset, setSelectedDataset] = useState(datasets.Earth[0]);

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
