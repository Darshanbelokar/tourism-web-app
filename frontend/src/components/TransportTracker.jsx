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

      <div className="grid gap-4 mb-6">
        {transportRoutes.map((route) => (
          <Card key={route.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="grid md:grid-cols-6 gap-4 items-center">
              {/* Transport Type & Route */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {getTransportIcon(route.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{route.from}</span>
                    <span className="text-gray-400">→</span>
                    <span className="font-semibold">{route.to}</span>
                  </div>
                  <p className="text-sm text-gray-500">{route.operator}</p>
                </div>
              </div>

              {/* Timing */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-semibold">{route.departure} - {route.arrival}</div>
                  <div className="text-sm text-gray-500">{route.duration}</div>
                </div>
              </div>

              {/* Status */}
              <div>
                <Badge className={`${getStatusColor(route.status)} border-0`}>
                  {route.status}
                </Badge>
                {route.delay > 0 && (
                  <div className="text-sm text-red-600 mt-1">+{route.delay} min</div>
                )}
              </div>

              {/* Next Stop */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">Next Stop</div>
                  <div className="text-sm text-gray-600">{route.nextStop}</div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{route.price}</div>
                <div className="text-sm text-gray-500">per person</div>
              </div>

              {/* Action */}
              <div>
                <Button 
                  size="sm" 
                  onClick={() => setSelectedRoute(route)}
                  variant="outline"
                >
                  Track
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Transport Tips */}
      <Card className="p-6 bg-blue-50">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Transport Tips for Jharkhand</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Best Travel Times</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Early morning (6 AM - 8 AM) for hill stations</li>
              <li>• Avoid monsoon season (July-September) for rural areas</li>
              <li>• Book train tickets in advance during festivals</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Popular Routes</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ranchi ↔ Netarhat (Most scenic route)</li>
              <li>• Jamshedpur ↔ Hundru Falls (Day trip)</li>
              <li>• Ranchi ↔ Betla National Park (Wildlife tour)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Selected Route Details Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Route Details</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedRoute(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {getTransportIcon(selectedRoute.type)}
                </div>
                <div>
                  <div className="font-semibold">{selectedRoute.from} → {selectedRoute.to}</div>
                  <div className="text-sm text-gray-500">{selectedRoute.operator}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Departure: <span className="font-semibold">{selectedRoute.departure}</span></div>
                  <div>Arrival: <span className="font-semibold">{selectedRoute.arrival}</span></div>
                  <div>Duration: <span className="font-semibold">{selectedRoute.duration}</span></div>
                  <div>Price: <span className="font-semibold text-green-600">{selectedRoute.price}</span></div>
                </div>
              </div>
              
              <div>
                <Badge className={`${getStatusColor(selectedRoute.status)} border-0`}>
                  {selectedRoute.status}
                </Badge>
              </div>
              
              <Button className="w-full">
                Book Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default TransportTracker;
