// ...existing code...
import { Card } from "./UI/card";
import { Button } from "./UI/button";
import { MapPin, Star, Clock, Camera } from "lucide-react";
import BetlaNationalPark from "@/assets/BetlaNationalPark.jpg";
import  Netarhat from "@/assets/Netarhat.jpg";
import HundruFalls from "@/assets/Hundru.jpeg";
import DeogharTemple from "@/assets/Deoghartemple.jpg";


const destinations = [
  {
    id: 1,
    name: "Betla National Park",
    image: BetlaNationalPark,
    rating: 4.8,
    duration: "2-3 days",
    description: "Home to majestic elephants and diverse wildlife in pristine sal forests.",
    highlights: ["Wildlife Safari", "Elephant Spotting", "Nature Trails"],
    location: "Palamau District"
  },
  {
    id: 2,
    name: "Netarhat Hill Station",
    image: Netarhat,
    rating: 4.7,
    duration: "1-2 days", 
    description: "The 'Queen of Chotanagpur' with breathtaking sunrise and sunset views.",
    highlights: ["Sunrise Point", "Magnolia Point", "Cool Climate"],
    location: "Latehar District"
  },
  {
    id: 3,
    name: "Hundru Falls",
    image: HundruFalls,
    rating: 4.6,
    duration: "1 day",
    description: "Spectacular 98-meter waterfall perfect for nature photography.",
    highlights: ["Waterfall Trek", "Photography", "Natural Pool"],
    location: "Ranchi"
  },
  {
    id: 4,
    name: "Deoghar Temple Complex",
    image: DeogharTemple,
    rating: 4.9,
    duration: "1-2 days",
    description: "Sacred Jyotirlinga temple and spiritual center of Jharkhand.",
    highlights: ["Baidyanath Temple", "Spiritual Experience", "Cultural Heritage"],
    location: "Deoghar"
  }
];

const FeaturedDestinations = () => {
  return (
    <section id="destinations" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Destinations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover Jharkhand's most breathtaking locations, from wild national parks 
            to serene hill stations and sacred temples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Card key={destination.id} className="group overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                  <Star className="h-4 w-4 text-accent fill-current" />
                  <span className="text-sm font-medium">{destination.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {destination.duration}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 text-muted-foreground text-sm mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{destination.location}</span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">{destination.name}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{destination.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights.map((highlight, index) => (
                    <span 
                      key={index}
                      className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                
                <Button className="w-full" variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Explore More
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            View All Destinations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;