import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "./UI/card";
import { Button } from "./UI/button";
import { MapPin, Star, Clock, Camera, ArrowLeft, AlertCircle } from "lucide-react";
import FeedbackSystem from "./FeedbackSystem";
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

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  // Helper to compute API base
  const getApiBase = () => {
    return import.meta.env.VITE_BACKEND_URL || '';
  };

  // Static data mapping for known destinations
  const getStaticDestinationData = (destId) => {
    const staticData = {
      "1": {
        id: 1,
        name: "Betla National Park",
        image: BetlaNationalPark,
        rating: 4.8,
        duration: "2-3 days",
        description: "Home to majestic elephants and diverse wildlife in pristine sal forests. Betla National Park is one of India's finest wildlife sanctuaries, offering incredible opportunities to spot tigers, elephants, and various species of deer in their natural habitat.",
        highlights: ["Wildlife Safari", "Elephant Spotting", "Nature Trails", "Bird Watching"],
        location: "Palamau District",
        images: [Tiger, Image2, Image3, Image4],
        details: {
          bestTime: "October to June",
          entryFee: "₹100 for Indians, ₹400 for foreigners",
          activities: ["Jeep Safari", "Elephant Ride", "Nature Walk", "Photography"],
          accommodation: "Available at Betla Tourist Lodge and nearby resorts"
        }
      },
      "2": {
        id: 2,
        name: "Netarhat Hill Station",
        image: Netarhat,
        rating: 4.7,
        duration: "1-2 days",
        description: "The 'Queen of Chotanagpur' with breathtaking sunrise and sunset views. Known for its cool climate, beautiful landscapes, and colonial architecture, Netarhat offers a perfect retreat from the summer heat.",
        highlights: ["Sunrise Point", "Magnolia Point", "Cool Climate", "Colonial Architecture"],
        location: "Latehar District",
        images: [Netarhat1, Netarhat2, Netarhat3, Netarhat4],
        details: {
          bestTime: "October to May",
          entryFee: "Free",
          activities: ["Sunrise viewing", "Photography", "Nature walks", "Horse riding"],
          accommodation: "Available at Forest Rest House and private resorts"
        }
      },
      "3": {
        id: 3,
        name: "Hundru Falls",
        image: HundruFalls,
        rating: 4.6,
        duration: "1 day",
        description: "Spectacular 98-meter waterfall perfect for nature photography. Located in Ranchi district, Hundru Falls is one of the highest waterfalls in Jharkhand and offers stunning views during the monsoon season.",
        highlights: ["Waterfall Trek", "Photography", "Natural Pool", "Picnic Spot"],
        location: "Ranchi",
        images: [HundruFalls, Hundru1, Hundru2, Hundru3],
        details: {
          bestTime: "June to October",
          entryFee: "₹20 for Indians",
          activities: ["Photography", "Trekking", "Swimming", "Nature observation"],
          accommodation: "Available in nearby Ranchi city"
        }
      },
      "4": {
        id: 4,
        name: "Deoghar Temple Complex",
        image: DeogharTemple,
        rating: 4.9,
        duration: "1-2 days",
        description: "Sacred Jyotirlinga temple and spiritual center of Jharkhand. The Baidyanath Temple is one of the 12 Jyotirlingas and attracts millions of devotees throughout the year.",
        highlights: ["Baidyanath Temple", "Spiritual Experience", "Cultural Heritage", "Festivals"],
        location: "Deoghar",
        images: [Deoghar1, Deoghar2, Deoghar3, Deoghar4],
        details: {
          bestTime: "Throughout the year",
          entryFee: "Free",
          activities: ["Temple visit", "Spiritual rituals", "Photography", "Cultural exploration"],
          accommodation: "Available in Deoghar city"
        }
      }
    };
    return staticData[destId];
  };

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const staticData = getStaticDestinationData(id);
        if (staticData) {
          setDestination(staticData);
        } else {
          // Try API call
          const response = await fetch(`${getApiBase()}/api/destinations/${id}`);
          if (!response.ok) throw new Error('Destination not found');
          const data = await response.json();
          setDestination(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!destination) return <div>Destination not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card className="max-w-4xl mx-auto">
          <div className="p-6">
            <img src={destination.image} alt={destination.name} className="w-full h-64 object-cover rounded-lg mb-6" />
            <h1 className="text-3xl font-bold mb-4">{destination.name}</h1>
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-lg">{destination.rating}</span>
              <Clock className="ml-4 h-5 w-5" />
              <span className="ml-1">{destination.duration}</span>
              <MapPin className="ml-4 h-5 w-5" />
              <span className="ml-1">{destination.location}</span>
            </div>
            <p className="text-gray-700 mb-6">{destination.description}</p>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Highlights</h2>
              <div className="flex flex-wrap gap-2">
                {destination.highlights.map((highlight, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <p><strong>Best Time:</strong> {destination.details.bestTime}</p>
              <p><strong>Entry Fee:</strong> {destination.details.entryFee}</p>
              <p><strong>Activities:</strong> {destination.details.activities.join(', ')}</p>
              <p><strong>Accommodation:</strong> {destination.details.accommodation}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {destination.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${destination.name} ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer"
                    onClick={() => setModalImage(image)}
                  />
                ))}
              </div>
            </div>
            <FeedbackSystem targetType="destination" targetId={destination.id} />
          </div>
        </Card>
      </div>
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Modal" className="max-w-full max-h-full" />
        </div>
      )}
    </div>
  );
};

export default DestinationDetail;
