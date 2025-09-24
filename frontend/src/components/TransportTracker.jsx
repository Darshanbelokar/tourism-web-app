import React, { useState, useEffect } from 'react';
import { Card } from './UI/card';
import { Button } from './UI/button';
import { Badge } from './UI/badge';
import { MapPin, Clock, Bus, Train, Car, Navigation, RefreshCw } from 'lucide-react';

function TransportTracker() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock transport data for Jharkhand
  const transportRoutes = [
    {
      id: 1,
      from: "Ranchi",
      to: "Betla National Park",
      type: "bus",
      operator: "JRTC",
      departure: "06:00",
      arrival: "09:30",
      duration: "3h 30m",
      price: "₹120",
      status: "On Time",
      nextStop: "Gumla",
      delay: 0
    },
    {
      id: 2,
      from: "Ranchi",
      to: "Netarhat",
      type: "bus",
      operator: "Private",
      departure: "07:30",
      arrival: "11:00",
      duration: "3h 30m",
      price: "₹150",
      status: "Delayed",
      nextStop: "Lohardaga",
      delay: 15
    },
    {
      id: 3,
      from: "Jamshedpur",
      to: "Hundru Falls",
      type: "car",
      operator: "Taxi Service",
      departure: "08:00",
      arrival: "09:45",
      duration: "1h 45m",
      price: "₹800",
      status: "Available",
      nextStop: "Direct",
      delay: 0
    },
    {
      id: 4,
      from: "Ranchi",
      to: "Deoghar",
      type: "train",
      operator: "Indian Railways",
      departure: "14:15",
      arrival: "18:30",
      duration: "4h 15m",
      price: "₹85",
      status: "On Time",
      nextStop: "Jasidih",
      delay: 0
    },
    {
      id: 5,
      from: "Dhanbad",
      to: "Parasnath Hill",
      type: "bus",
      operator: "JRTC",
      departure: "09:00",
      arrival: "10:30",
      duration: "1h 30m",
      price: "₹60",
      status: "Boarding",
      nextStop: "Giridih",
      delay: 0
    }
  ];

  const getTransportIcon = (type) => {
    switch (type) {
      case 'bus': return <Bus className="w-5 h-5" />;
      case 'train': return <Train className="w-5 h-5" />;
      case 'car': return <Car className="w-5 h-5" />;
      default: return <Navigation className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on time': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'boarding': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="transport-tracker p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Transport Tracker</h2>
          <p className="text-gray-600">Real-time transport information across Jharkhand</p>
        </div>
        <Button onClick={refreshData} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {transportRoutes.map((route) => (
          <Card key={route.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Route Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  {getTransportIcon(route.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-lg">
                    <span className="font-bold">{route.from}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-bold">{route.to}</span>
                  </div>
                  <p className="text-gray-600">{route.operator}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{route.price}</div>
                <div className="text-sm text-gray-500">per person</div>
              </div>
            </div>

            {/* Route Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Timing */}
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 mb-2" />
                <div className="text-center">
                  <div className="font-semibold">{route.departure} - {route.arrival}</div>
                  <div className="text-sm text-gray-500">{route.duration}</div>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <div className="mb-2">
                  <Badge className={`${getStatusColor(route.status)} border-0`}>
                    {route.status}
                  </Badge>
                </div>
                {route.delay > 0 && (
                  <div className="text-sm text-red-600">+{route.delay} min delay</div>
                )}
              </div>

              {/* Next Stop */}
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-600 mb-2" />
                <div className="text-center">
                  <div className="font-medium">Next Stop</div>
                  <div className="text-sm text-gray-600">{route.nextStop}</div>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col items-center justify-center p-3">
                <Button 
                  onClick={() => setSelectedRoute(route)}
                  className="w-full"
                >
                  Track Route
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Transport Tips */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h3 className="text-2xl font-bold mb-6 text-blue-800">Transport Tips for Jharkhand</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-blue-700">Best Travel Times</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Early morning (6 AM - 8 AM) for hill stations</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Avoid monsoon season (July-September) for rural areas</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Book train tickets in advance during festivals</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-blue-700">Popular Routes</h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Ranchi ↔ Netarhat (Most scenic route)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Jamshedpur ↔ Hundru Falls (Day trip)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Ranchi ↔ Betla National Park (Wildlife tour)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Selected Route Details Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Route Details</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedRoute(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Route Header */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {getTransportIcon(selectedRoute.type)}
                </div>
                <div>
                  <div className="text-lg font-bold">{selectedRoute.from} → {selectedRoute.to}</div>
                  <div className="text-gray-600">{selectedRoute.operator}</div>
                </div>
              </div>
              
              {/* Journey Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="font-semibold">Departure</div>
                  <div className="text-xl font-bold text-blue-600">{selectedRoute.departure}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="font-semibold">Arrival</div>
                  <div className="text-xl font-bold text-green-600">{selectedRoute.arrival}</div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{selectedRoute.duration}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Price</span>
                  <span className="font-bold text-green-600 text-lg">{selectedRoute.price}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Next Stop</span>
                  <span className="font-semibold">{selectedRoute.nextStop}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Status</span>
                  <Badge className={`${getStatusColor(selectedRoute.status)} border-0`}>
                    {selectedRoute.status}
                  </Badge>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" size="lg">
                  Book Now
                </Button>
                <Button variant="outline" className="flex-1" size="lg">
                  Save Route
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default TransportTracker;
