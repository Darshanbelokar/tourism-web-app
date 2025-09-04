import { useState } from "react";
import { Button } from "./UI/button";
import { Menu, X, MapPin, Calendar, MessageCircle, ShoppingBag } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">JharkhandTourism</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#destinations" className="text-foreground hover:text-primary transition-colors">
              Destinations
            </a>
            <a href="#culture" className="text-foreground hover:text-primary transition-colors">
              Culture
            </a>
            <a href="#marketplace" className="text-foreground hover:text-primary transition-colors">
              Marketplace
            </a>
            <a href="#planner" className="text-foreground hover:text-primary transition-colors">
              Plan Trip
            </a>
            <Button variant="hero" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-4">
            <div className="flex flex-col space-y-3">
              <a href="#destinations" className="text-foreground hover:text-primary transition-colors">
                Destinations
              </a>
              <a href="#culture" className="text-foreground hover:text-primary transition-colors">
                Culture
              </a>
              <a href="#marketplace" className="text-foreground hover:text-primary transition-colors">
                Marketplace
              </a>
              <a href="#planner" className="text-foreground hover:text-primary transition-colors">
                Plan Trip
              </a>
              <Button variant="hero" size="sm" className="w-fit">
                <Calendar className="h-4 w-4 mr-2" />
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;