import { useState, useEffect } from "react";
import { Card } from "./UI/card";
import { Button } from "./UI/button";
import { Users, Music, Palette, Home, Calendar } from "lucide-react";
import DokraBronzeFigurines from "@/assets/Dokra art.jpeg";

const experiences = [
  {
    id: 1,
    title: "Tribal Village Homestays",
    description: "Live with local tribal families and experience authentic Jharkhand culture firsthand.",
    icon: Home,
    duration: "2-7 days",
    price: "₹1,500/night",
    includes: ["Traditional meals", "Cultural activities", "Local guide"]
  },
  {
    id: 2,
    title: "Folk Dance Workshops",
    description: "Learn traditional Santali, Oraon and Munda dances from master artists.",
    icon: Music,
    duration: "2-4 hours",
    price: "₹800/person",
    includes: ["Dance lessons", "Traditional costume", "Certificate"]
  },
  {
    id: 3,
    title: "Dokra Art & Handicraft Making",
    description: "Master the ancient lost-wax technique to create beautiful bronze figurines and learn traditional pottery, textiles with tribal artisans.",
    icon: Palette,
    duration: "Half day",
    price: "₹1,200/person",
    includes: ["Materials", "Expert guidance", "Take home crafts"],
    image: DokraBronzeFigurines,
    featured: true
  },
  {
    id: 4,
    title: "Tribal Festival Tours",
    description: "Join authentic celebrations during Sarhul, Karma and other tribal festivals.",
    icon: Calendar,
    duration: "1-3 days",
    price: "₹2,000/day",
    includes: ["Festival access", "Cultural guide", "Traditional meals"]
  }
];

const CulturalExperiences = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <section id="culture" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-opacity duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Authentic Cultural Experiences
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Immerse yourself in the rich tribal heritage of Jharkhand through unique,
            community-based experiences that benefit local communities.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-1500 delay-300 ${animate ? 'opacity-100' : 'opacity-0'}`}>
          {experiences.map((experience) => {
            const IconComponent = experience.icon;
            return (
            <Card key={experience.id} className="p-6 shadow-cultural hover:shadow-glow transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] bg-gradient-cultural text-secondary-foreground">
                {experience.image && experience.featured && (
                  <div className="mb-6 -mx-6 -mt-6">
                    <img 
                      src={experience.image} 
                      alt={experience.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-foreground/20 rounded-full mb-4">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{experience.title}</h3>
                  <p className="text-secondary-foreground/90 text-sm leading-relaxed">
                    {experience.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">{experience.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Price:</span>
                    <span className="text-sm font-bold">{experience.price}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Includes:</h4>
                  <ul className="space-y-1">
                    {experience.includes.map((item, index) => (
                      <li key={index} className="text-sm text-secondary-foreground/90 flex items-center">
                        <div className="w-1 h-1 bg-secondary-foreground/60 rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" className="w-full border-secondary-foreground/30 hover:bg-secondary-foreground/10">
                  <Users className="h-4 w-4 mr-2" />
                  Book Experience
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="cultural" size="lg">
            <Users className="h-5 w-5 mr-2" />
            View All Experiences
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CulturalExperiences;
