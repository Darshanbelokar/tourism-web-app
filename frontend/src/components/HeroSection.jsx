import { useEffect, useState } from "react";
import { Button } from "./UI/button";
import { MapPin, Star, Users, Camera } from "lucide-react";
import heroImage from "../assets/betlaNationalPark/BetlaNationalPark.jpg";

const HeroSection = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className={`mb-6 flex items-center justify-center space-x-2 text-primary-foreground/90 transition-opacity duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium">Discover Jharkhand</span>
          </div>
          
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight transition-transform duration-1000 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Explore the Heart of
            <span className="block text-accent"> Tribal India</span>
          </h1>
          
          <p className={`text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed transition-opacity duration-1500 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
            Experience pristine forests, ancient cultures, and untouched wilderness. 
            Plan your eco-cultural adventure with AI-powered personalized itineraries.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-opacity duration-1500 delay-700 ${animate ? 'opacity-100' : 'opacity-0'}`}>
            <Button variant="hero" size="lg" className="shadow-glow hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <Camera className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Start Your Journey
            </Button>
            <Button variant="cultural" size="lg" className="hover:scale-105 transition-all duration-300 group">
              <Users className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Explore Culture
            </Button>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto transition-opacity duration-1500 delay-900 ${animate ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">50+</div>
              <div className="text-primary-foreground/80">Tourist Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">32</div>
              <div className="text-primary-foreground/80">Tribal Communities</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-2xl md:text-3xl font-bold text-primary-foreground mr-1">4.8</span>
                <Star className="h-5 w-5 text-accent fill-current" />
              </div>
              <div className="text-primary-foreground/80">Tourist Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary-foreground/60 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-px h-8 bg-primary-foreground/40"></div>
          <div className="text-sm">Scroll to explore</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
