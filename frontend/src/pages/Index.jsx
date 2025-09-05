import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import CulturalExperiences from "@/components/CulturalExperiences";
import LocalMarketplace from "@/components/LocalMarketPlace";
import ItineraryPlanner from "@/components/ItineraryPlanner";
import ChatbotInterface from "@/components/ChatbotInterfaceEnhanced";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedDestinations />
        <CulturalExperiences />
        <LocalMarketplace />
        <ItineraryPlanner />
      </main>
      <ChatbotInterface />

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">JharkhandTourism</h3>
              <p className="text-primary-foreground/80 text-sm">
                Discover the authentic beauty and culture of Jharkhand through
                sustainable and community-based tourism.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Destinations</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Betla National Park</li>
                <li>Netarhat Hill Station</li>
                <li>Hundru Falls</li>
                <li>Deoghar Temple</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Experiences</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>Tribal Village Stays</li>
                <li>Wildlife Safari</li>
                <li>Cultural Workshops</li>
                <li>Eco Trekking</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>24/7 Chat Support</li>
                <li>Travel Insurance</li>
                <li>Local Guides</li>
                <li>Emergency Assistance</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
            <p>
              &copy; 2024 JharkhandTourism. Promoting sustainable and authentic
              travel experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
