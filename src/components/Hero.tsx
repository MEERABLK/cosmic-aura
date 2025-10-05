import { Button } from "@/components/ui/button";
import { Telescope, Zap, Eye } from "lucide-react";
import heroSpace from "@/assets/hero-space.jpg";

const Hero = () => {
  const scrollToExplorer = () => {
    document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroSpace})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
      </div>

      {/* Animated Stars */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground rounded-full animate-pulse-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-float">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 cosmic-glow rounded-full blur-xl opacity-50" />
              <Eye className="w-20 h-20 text-primary relative z-10" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-gradient">Embiggen Your Eyes</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Explore ultra high-resolution NASA imagery with AI-powered pattern detection, 
            multi-layer overlays, and interactive annotations
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
              <Telescope className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Billion+ Pixel Images</span>
            </div>
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">AI Pattern Detection</span>
            </div>
            <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
              <Eye className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Multi-Layer Analysis</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button 
              size="lg" 
              className="cosmic-glow text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={scrollToExplorer}
            >
              Start Exploring
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="glass-panel text-lg px-8 py-6 border-primary/50 hover:bg-primary/10 font-semibold"
            >
              Watch Tutorial
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Celestial Bodies</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-accent">1B+</div>
              <div className="text-sm text-muted-foreground">Pixels</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-secondary">AI</div>
              <div className="text-sm text-muted-foreground">Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
