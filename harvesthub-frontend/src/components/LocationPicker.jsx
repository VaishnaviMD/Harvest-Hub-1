import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "300px",
  border: "2px solid #ddd",
  borderRadius: "8px",
  position: "relative",
  backgroundColor: "#f0f0f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default function LocationPicker({ onLocationSelect, initialLocation }) {
  const [center, setCenter] = useState(initialLocation || { lat: 12.9716, lng: 77.5946 });
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(newCenter);
          setSelectedLocation(newCenter);
          if (onLocationSelect) onLocationSelect(newCenter);
        },
        () => {
          console.log("Geolocation not available, using default");
        }
      );
    }
  }, [onLocationSelect]);

  const handleMapClick = (e) => {
    // Simple click handler for mock map
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click position to approximate coordinates
    const lat = center.lat + ((rect.height / 2 - y) / rect.height) * 0.1;
    const lng = center.lng + ((x - rect.width / 2) / rect.width) * 0.1;
    
    const location = { lat, lng };
    setSelectedLocation(location);
    if (onLocationSelect) onLocationSelect(location);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(location);
          setSelectedLocation(location);
          if (onLocationSelect) onLocationSelect(location);
        },
        () => {
          alert("Could not get your location. Please select manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div>
      <div style={containerStyle} onClick={handleMapClick}>
        <div style={{ textAlign: "center", color: "#666" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📍</div>
          <p>Click on map to select location</p>
          <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            {selectedLocation 
              ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
              : "No location selected"}
          </p>
        </div>
        {selectedLocation && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "20px",
              height: "20px",
              backgroundColor: "#4caf50",
              borderRadius: "50%",
              border: "3px solid white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          />
        )}
      </div>
      <button
        type="button"
        className="btn-outline"
        style={{ marginTop: "0.5rem", width: "100%" }}
        onClick={useCurrentLocation}
      >
        Use My Current Location
      </button>
      {selectedLocation && (
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
          Selected: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}

