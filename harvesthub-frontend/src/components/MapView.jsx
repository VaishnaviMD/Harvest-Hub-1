import { useMemo } from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
  border: "2px solid #ddd",
  borderRadius: "8px",
  position: "relative",
  backgroundColor: "#e8f5e9",
  overflow: "hidden",
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

export default function MapView({ origin, destination, route }) {
  const center = useMemo(() => {
    if (origin) return origin;
    if (destination) return destination;
    return defaultCenter;
  }, [origin, destination]);

  // Calculate midpoint for centering
  const mapCenter = useMemo(() => {
    if (origin && destination) {
      return {
        lat: (origin.lat + destination.lat) / 2,
        lng: (origin.lng + destination.lng) / 2,
      };
    }
    return center;
  }, [origin, destination, center]);

  return (
    <div style={containerStyle}>
      <div style={{ 
        position: "absolute", 
        top: "10px", 
        left: "10px", 
        backgroundColor: "white", 
        padding: "0.5rem", 
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        fontSize: "0.9rem",
        zIndex: 10,
      }}>
        <div>📍 Pickup: {origin ? `${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}` : "N/A"}</div>
        <div style={{ marginTop: "0.25rem" }}>
          🏠 Delivery: {destination ? `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}` : "N/A"}
        </div>
      </div>
      
      {/* Mock map visualization */}
      <div style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
      }}>
        {/* Origin marker */}
        {origin && (
          <div
            style={{
              position: "absolute",
              left: "30%",
              top: "40%",
              transform: "translate(-50%, -50%)",
              width: "30px",
              height: "30px",
              backgroundColor: "#4caf50",
              borderRadius: "50%",
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
            title={`Pickup: ${origin.lat}, ${origin.lng}`}
          >
            📍
          </div>
        )}
        
        {/* Destination marker */}
        {destination && (
          <div
            style={{
              position: "absolute",
              left: "70%",
              top: "60%",
              transform: "translate(-50%, -50%)",
              width: "30px",
              height: "30px",
              backgroundColor: "#ff5722",
              borderRadius: "50%",
              border: "3px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
            title={`Delivery: ${destination.lat}, ${destination.lng}`}
          >
            🏠
          </div>
        )}
        
        {/* Route line (mock) */}
        {origin && destination && (
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <line
              x1="30%"
              y1="40%"
              x2="70%"
              y2="60%"
              stroke="#4caf50"
              strokeWidth="3"
              strokeDasharray="5,5"
              opacity="0.6"
            />
          </svg>
        )}
        
        {/* Grid pattern for map effect */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          opacity: 0.3,
        }} />
      </div>
      
      {(!origin || !destination) && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "#666",
        }}>
          <p>Map visualization</p>
          <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            {!origin && !destination && "No location data available"}
            {origin && !destination && "Waiting for delivery location"}
            {!origin && destination && "Waiting for pickup location"}
          </p>
        </div>
      )}
    </div>
  );
}

