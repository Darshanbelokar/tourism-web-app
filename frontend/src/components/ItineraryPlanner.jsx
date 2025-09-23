import { useState } from "react";
import { Card } from "./UI/card";
import { Button } from "./UI/button";
import { Badge } from "./UI/badge";
import { Input } from "./UI/input";
import { Textarea } from "./UI/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./UI/select";
import { MapPin, Calendar, Users, Sparkles, Clock, Star } from "lucide-react";

const ItineraryPlanner = () => {
  const [showFullItinerary, setShowFullItinerary] = useState(false);
  const [formData, setFormData] = useState({
    destinations: "",
    duration: "",
    budget: "",
    interests: "",
    groupSize: "",
    travelStyle: ""
  });
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const sampleItinerary = {
    title: "3-Day Eco-Cultural Adventure",
    duration: "3 Days, 2 Nights",
    budget: "₹8,500 per person",
    rating: 4.8,
    highlights: ["Wildlife Safari", "Tribal Village Stay", "Waterfall Trek", "Cultural Workshop"],
    days: [
      {
        day: 1,
        title: "Arrival & Betla National Park",
        activities: [
          { time: "09:00", activity: "Arrival at Ranchi", type: "travel" },
          { time: "11:00", activity: "Drive to Betla National Park", type: "travel" },
          { time: "14:00", activity: "Check-in at Eco Resort", type: "accommodation" },
          { time: "16:00", activity: "Wildlife Safari", type: "activity" },
          { time: "19:00", activity: "Traditional Dinner", type: "meal" }
        ]
      },
      {
        day: 2,
        title: "Cultural Immersion Day",
        activities: [
          { time: "08:00", activity: "Morning Nature Walk", type: "activity" },
          { time: "10:00", activity: "Visit Tribal Village", type: "cultural" },
          { time: "12:00", activity: "Traditional Lunch with Family", type: "meal" },
          { time: "15:00", activity: "Handicraft Workshop", type: "cultural" },
          { time: "18:00", activity: "Folk Dance Performance", type: "cultural" }
        ]
      },
      {
        day: 3,
        title: "Hundru Falls & Departure",
        activities: [
          { time: "09:00", activity: "Check-out & Drive to Hundru Falls", type: "travel" },
          { time: "11:00", activity: "Waterfall Trek & Photography", type: "activity" },
          { time: "14:00", activity: "Lunch at Local Restaurant", type: "meal" },
          { time: "16:00", activity: "Return to Ranchi", type: "travel" },
          { time: "18:00", activity: "Departure", type: "travel" }
        ]
      }
    ]
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'cultural': return '🎭';
      case 'activity': return '🏃';
      case 'meal': return '🍽️';
      case 'travel': return '🚗';
      case 'accommodation': return '🏨';
      default: return '📍';
    }
  };

  return (
    <section id="planner" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            AI-Powered Trip Planner
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let our AI create personalized itineraries based on your interests, 
            budget, and travel style. Every plan supports local communities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Planner Form */}
          <Card className="p-6 shadow-elegant">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Plan Your Journey</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Preferred Destinations <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="e.g., Betla National Park, Netarhat, Deoghar"
                  value={formData.destinations}
                  onChange={(e) => setFormData({...formData, destinations: e.target.value})}
                  className={fieldErrors.destinations ? "border-red-500" : ""}
                />
                {fieldErrors.destinations && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.destinations}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.duration} onValueChange={val => setFormData({...formData, duration: val})}>
                    <SelectTrigger className={fieldErrors.duration ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2">1-2 days</SelectItem>
                      <SelectItem value="3-5">3-5 days</SelectItem>
                      <SelectItem value="6-10">6-10 days</SelectItem>
                      <SelectItem value="10+">10+ days</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.duration && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.duration}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Budget Range <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.budget} onValueChange={val => setFormData({...formData, budget: val})}>
                    <SelectTrigger className={fieldErrors.budget ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget (₹2-5K/day)</SelectItem>
                      <SelectItem value="mid">Mid-range (₹5-10K/day)</SelectItem>
                      <SelectItem value="luxury">Luxury (₹10K+/day)</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.budget && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.budget}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Group Size <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.groupSize} onValueChange={val => setFormData({...formData, groupSize: val})}>
                    <SelectTrigger className={fieldErrors.groupSize ? "border-red-500" : ""}>
                      <SelectValue placeholder="Number of travelers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo (1)</SelectItem>
                      <SelectItem value="couple">Couple (2)</SelectItem>
                      <SelectItem value="family">Family (3-5)</SelectItem>
                      <SelectItem value="group">Group (6+)</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.groupSize && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.groupSize}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Travel Style <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.travelStyle} onValueChange={val => setFormData({...formData, travelStyle: val})}>
                    <SelectTrigger className={fieldErrors.travelStyle ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="relaxed">Relaxed</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.travelStyle && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.travelStyle}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Special Interests
                </label>
                <Textarea 
                  placeholder="e.g., wildlife photography, tribal culture, trekking, handicrafts..."
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                  className="h-20"
                />
              </div>

              <Button
                className="w-full"
                variant="hero"
                size="lg"
                disabled={loading}
                onClick={async () => {
                  // Validate required fields
                  const errors = {};
                  if (!formData.destinations.trim()) errors.destinations = "Please fill this field.";
                  if (!formData.duration) errors.duration = "Please select duration.";
                  if (!formData.budget) errors.budget = "Please select budget.";
                  if (!formData.groupSize) errors.groupSize = "Please select group size.";
                  if (!formData.travelStyle) errors.travelStyle = "Please select travel style.";
                  setFieldErrors(errors);
                  if (Object.keys(errors).length > 0) return;
                  setLoading(true);
                  setError("");
                  try {
                    const response = await fetch('/api/generate-itinerary', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(formData),
                    });
                    if (!response.ok) {
                      const errText = await response.text();
                      throw new Error(errText || 'Failed to generate itinerary');
                    }
                    const data = await response.json();
                    setGeneratedItinerary(data);
                  } catch (error) {
                    setError(error.message || 'Error generating itinerary');
                    console.error('Error generating itinerary:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? (
                  <span className="animate-pulse">Generating...</span>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate AI Itinerary
                  </>
                )}
              </Button>
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
            </div>
          </Card>

          {/* Sample Itinerary or Generated Itinerary */}
          <Card className="p-6 shadow-elegant max-h-[600px] overflow-y-auto">
            {generatedItinerary ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">{generatedItinerary.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-accent fill-current" />
                    <span className="text-sm font-medium">{generatedItinerary.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{generatedItinerary.duration}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <span>💰</span>
                    <span>{generatedItinerary.budget}</span>
                  </Badge>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedItinerary.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Only show days/activities in expanded section below */}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">{sampleItinerary.title}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-accent fill-current" />
                    <span className="text-sm font-medium">{sampleItinerary.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{sampleItinerary.duration}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <span>💰</span>
                    <span>{sampleItinerary.budget}</span>
                  </Badge>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground mb-2">Highlights:</h4>
                  <div className="flex flex-wrap gap-2">
                    {sampleItinerary.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
                {/* Only show days/activities in expanded section below */}
              </>
            )}
            <div className="mt-6 pt-4 border-t border-border">
              <Button
                className="w-full"
                variant={showFullItinerary ? "secondary" : "outline"}
                onClick={() => setShowFullItinerary((prev) => !prev)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {showFullItinerary ? "Hide Full Itinerary" : "View Full Itinerary"}
              </Button>
              {showFullItinerary && (
                <div className="mt-4">
                  <div className="space-y-6">
                    {(generatedItinerary ? generatedItinerary.days : sampleItinerary.days).map((day, dayIndex) => (
                      <div key={dayIndex} className="border-l-2 border-primary/30 pl-4">
                        <h4 className="font-bold text-foreground mb-2 flex items-center space-x-2">
                          <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {day.day}
                          </span>
                          <span>{day.title}</span>
                        </h4>
                        <div className="space-y-2 ml-8">
                          {day.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="flex items-center space-x-3 text-sm">
                              <span className="text-muted-foreground font-mono text-xs min-w-[50px]">
                                {activity.time}
                              </span>
                              <span className="text-lg">{getActivityIcon(activity.type)}</span>
                              <span className="text-foreground">{activity.activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ItineraryPlanner;
