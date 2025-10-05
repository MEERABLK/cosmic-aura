import { Brain, Layers, Clock, MapPin, BarChart3, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI Pattern Detection",
    description: "Advanced machine learning algorithms identify weather patterns, geological features, and anomalies automatically",
    color: "text-accent",
    glow: "aurora-glow",
  },
  {
    icon: Layers,
    title: "Multi-Layer Visualization",
    description: "Switch between different wavelengths, timestamps, and data sources for comprehensive analysis",
    color: "text-primary",
    glow: "cosmic-glow",
  },
  {
    icon: Clock,
    title: "Time-Lapse Analysis",
    description: "Watch planetary changes unfold over time with interactive playback controls and temporal comparison",
    color: "text-secondary",
    glow: "",
  },
  {
    icon: MapPin,
    title: "Annotation System",
    description: "Mark discoveries, add notes, and share findings with the global research community",
    color: "text-accent",
    glow: "",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description: "Comprehensive metadata, statistics, and visual analytics for every image and dataset",
    color: "text-primary",
    glow: "",
  },
  {
    icon: Users,
    title: "Collaborative Discovery",
    description: "Join a community of researchers and enthusiasts exploring the cosmos together",
    color: "text-secondary",
    glow: "",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Powerful Exploration Features</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to explore and analyze ultra high-resolution space imagery
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`glass-panel p-6 hover:scale-105 transition-all duration-300 ${feature.glow}`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 ${feature.glow}`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
