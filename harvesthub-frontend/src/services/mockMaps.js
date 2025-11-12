// Mock Google Maps service that works without API
export const mockMaps = {
  getCoordinatesFromAddress: async (address) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock coordinates based on address
    // In real implementation, this would use Google Geocoding API
    const mockCoords = {
      "bangalore": { latitude: 12.9716, longitude: 77.5946 },
      "mumbai": { latitude: 19.0760, longitude: 72.8777 },
      "delhi": { latitude: 28.6139, longitude: 77.2090 },
      "default": { latitude: 12.9716, longitude: 77.5946 },
    };
    
    const addressLower = address.toLowerCase();
    for (const [key, coords] of Object.entries(mockCoords)) {
      if (addressLower.includes(key)) {
        return coords;
      }
    }
    return mockCoords.default;
  },

  calculateDistanceAndTime: async (originLat, originLng, destLat, destLng) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Calculate approximate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (destLat - originLat) * Math.PI / 180;
    const dLon = (destLng - originLng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(originLat * Math.PI / 180) * Math.cos(destLat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Estimate time (assuming average speed of 30 km/h)
    const duration = Math.round((distance / 30) * 60);
    
    return {
      distance: Math.round(distance * 100) / 100,
      duration,
      distanceText: `${Math.round(distance * 100) / 100} km`,
      durationText: `${duration} mins`,
    };
  },

  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            // Fallback to default location
            resolve({ latitude: 12.9716, longitude: 77.5946 });
          }
        );
      } else {
        resolve({ latitude: 12.9716, longitude: 77.5946 });
      }
    });
  },
};

