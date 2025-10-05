import { Eye, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Embiggen Your Eyes</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Exploring the cosmos through ultra high-resolution NASA imagery
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Earth</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Moon</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mars</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Andromeda</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Access</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center hover:cosmic-glow transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center hover:cosmic-glow transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass-panel flex items-center justify-center hover:cosmic-glow transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2024 NASA Space Apps Challenge. Built with NASA data.</p>
          <p>Made for explorers, researchers, and the curious.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
