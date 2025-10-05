import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ImageExplorer from "@/components/ImageExplorer";
import TimelapseControl from "@/components/TimelapseControl";
import AnnotationTools from "@/components/AnnotationTools";
import Footer from "@/components/Footer";

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

export default Index;
