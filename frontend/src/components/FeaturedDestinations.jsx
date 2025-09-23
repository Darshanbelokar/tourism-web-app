import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./UI/card";
import { Button } from "./UI/button";
import { MapPin, Star, Clock, Camera, AlertCircle, ArrowRight } from "lucide-react";
import BetlaNationalPark from "@/assets/betlaNationalPark/BetlaNationalPark.jpg";
import { Tiger, Image2, Image3, Image4 } from "@/assets/betlaNationalPark/betlaWildlife";
import Netarhat from "@/assets/netarhatHillStation/Netarhat.jpg";
import { Netarhat1, Netarhat2, Netarhat3, Netarhat4 } from "@/assets/netarhatHillStation/netarhatImages";
import HundruFalls from "@/assets/hundruFalls/Hundru.jpeg";
import Hundru1 from "@/assets/hundruFalls/Hundru1.jpg";
import Hundru2 from "@/assets/hundruFalls/Hundru2.jpeg";
import Hundru3 from "@/assets/hundruFalls/Hundru3.jpg";

import DeogharTemple from "@/assets/deogharTempleComplex/DeogharTemple.jpg";
import Deoghar1 from "@/assets/deogharTempleComplex/Deoghar1.jpg";
import Deoghar2 from "@/assets/deogharTempleComplex/Deoghar2.jpeg";
import Deoghar3 from "@/assets/deogharTempleComplex/Deoghar3.jpg";
import Deoghar4 from "@/assets/deogharTempleComplex/Deoghar4.webp";
import Handicrafts from "@/assets/betlaNationalPark/handicrafts.jpeg";
import HandMadePottery from "@/assets/betlaNationalPark/HandMadePottery.jpeg";
import SantalBambooBasket from "@/assets/SantalBambooBasket.jpeg";
import TribalJwellerySett from "@/assets/TribalJwellerySett.jpeg";

// Fallback static data in case API fails
const fallbackDestinations = [
  {
    id: 1,
    name: "Betla National Park",
    image: BetlaNationalPark,
    rating: 4.8,
    duration: "2-3 days",
    description: "Home to majestic elephants and diverse wildlife in pristine sal forests.",
    highlights: ["Wildlife Safari", "Elephant Spotting", "Nature Trails"],
    location: "Palamau District",
  images: [Tiger, Image2, Image3, Image4]
  },
  {
    id: 2,
    name: "Netarhat Hill Station",
    image: Netarhat,
    rating: 4.7,
    duration: "1-2 days",
    description: "The 'Queen of Chotanagpur' with breathtaking sunrise and sunset views.",
    highlights: ["Sunrise Point", "Magnolia Point", "Cool Climate"],
    location: "Latehar District",
  images: [Netarhat1, Netarhat2, Netarhat3, Netarhat4]
  },
  {
    id: 3,
    name: "Hundru Falls",
    image: HundruFalls,
    rating: 4.6,
    duration: "1 day",
    description: "Spectacular 98-meter waterfall perfect for nature photography.",
    highlights: ["Waterfall Trek", "Photography", "Natural Pool"],
    location: "Ranchi",
  images: [HundruFalls, Hundru1, Hundru2, Hundru3]
  },
  {
    id: 4,
    name: "Deoghar Temple Complex",
    image: DeogharTemple,
    rating: 4.9,
    duration: "1-2 days",
    description: "Sacred Jyotirlinga temple and spiritual center of Jharkhand.",
    highlights: ["Baidyanath Temple", "Spiritual Experience", "Cultural Heritage"],
    location: "Deoghar",
  images: [Deoghar1, Deoghar2, Deoghar3, Deoghar4]
  }
];

const FeaturedDestinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  // Helper to compute API base (supports VITE_BACKEND_URL or same-origin relative paths)
  const getApiBase = () => {
    // In production we use relative paths. During dev, a VITE_BACKEND_URL can be provided
    return import.meta.env.VITE_BACKEND_URL || '';
  };

  // Fetch data from backend API with polling every 30 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchDestinations = async () => {
      try {
  const response = await fetch(`${getApiBase()}/api/spots`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Map API data to include image imports for known spots
        const mappedData = data.map((spot) => {
          let image, images;
          switch (spot.name) {
            case "Betla National Park":
              image = BetlaNationalPark;
              images = [Tiger, Image2, Image3, Image4];
              break;
            case "Netarhat Hill Station":
              image = Netarhat;
              images = [Netarhat1, Netarhat2, Netarhat3, Netarhat4];
              break;
            case "Hundru Falls":
              image = HundruFalls;
              break;
            case "Deoghar Temple Complex":
              image = DeogharTemple;
              break;
            default:
              image = null;
          }
          return { ...spot, image, images: images || spot.images || [image] };
        });

        if (isMounted) {
          setDestinations(mappedData.length > 0 ? mappedData : fallbackDestinations);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setDestinations(fallbackDestinations);
          setLoading(false);
        }
      }
    };

    fetchDestinations();
    const intervalId = setInterval(fetchDestinations, 30000); // 30 seconds polling

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <section id="destinations" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-pulse">
              Featured Destinations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-pulse">
              Discover Jharkhand's most breathtaking locations, from wild national parks
              to serene hill stations and sacred temples.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-72 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Enlarged" className="max-w-3xl max-h-[80vh] rounded shadow-lg border-4 border-white" onClick={e => e.stopPropagation()} />
          <button className="absolute top-6 right-8 text-white text-3xl font-bold" onClick={() => setModalImage(null)}>&times;</button>
        </div>
      )}
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
          {error && (
            <div className="text-red-600 flex items-center justify-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>Error loading destinations: {error}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <Card key={destination._id || destination.id} className="group overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]">
              <div className="relative">
                {destination.image ? (
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
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
                  {destination.highlights && destination.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => toggleExpand(destination._id || destination.id)}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {expandedId === (destination._id || destination.id) ? "Show Less" : "Explore More"}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => navigate(`/destinations/${destination._id || destination.id}`)}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>

                {expandedId === (destination._id || destination.id) && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {(destination.images && destination.images.length > 0 ? destination.images : [destination.image]).map((imgSrc, idx) => (
                      <img
                        key={idx}
                        src={imgSrc}
                        alt={`${destination.name} photo ${idx + 1}`}
                        className="w-full h-32 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => setModalImage(imgSrc)}
                      />
                    ))}
                  </div>
                )}
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
  </>
  );
}

export default FeaturedDestinations;
