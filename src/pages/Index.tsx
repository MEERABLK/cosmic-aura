import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ImageExplorer from "@/components/ImageExplorer";
import TimelapseControl from "@/components/TimelapseControl";
import AnnotationTools from "@/components/AnnotationTools";
import Footer from "@/components/Footer";
import MarsMap from "@/components/MarsMap";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <ImageExplorer />
      <TimelapseControl />
      <AnnotationTools />
      <Footer />
    </div>
  );
};
<section className="py-20">
  <h2 className="text-3xl font-bold text-center mb-6 text-gradient">Mars Zoomable Map</h2>
  <MarsMap />
</section>
export default Index;
