import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DatasetProvider } from "@/context/DatasetContext"; // ✅ import the provider
import ImageExplorer from "@/components/ImageExplorer";
import TimelapseControl from "@/components/TimelapseControl";

createRoot(document.getElementById("root")!).render(
  <DatasetProvider>
    <App />
  </DatasetProvider>
);
export default function Home() {
  return (
    <>
      <ImageExplorer />
      <TimelapseControl />
    </>
  );
}