import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MapView from "../components/MapView";
import { api } from "../services/api";
import BackButton from "../components/BackButton";

export default function DeliveryTracking() {
  const { orderId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch delivery details
    // This would typically come from your API
    // For now, we'll use mock data structure
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return <div>Loading delivery information...</div>;
  }

  const origin = delivery?.pickupLatitude && delivery?.pickupLongitude
    ? { lat: delivery.pickupLatitude, lng: delivery.pickupLongitude }
    : null;
  
  const destination = delivery?.deliveryLatitude && delivery?.deliveryLongitude
    ? { lat: delivery.deliveryLatitude, lng: delivery.deliveryLongitude }
    : null;

  return (
    <section className="section">
      <div className="container">
        <BackButton />
        <h2>Track Your Delivery</h2>
        {delivery && (
          <div className="grid-2">
            <div className="card">
              <h3>Delivery Information</h3>
              <p><strong>Status:</strong> {delivery.status}</p>
              {delivery.distance && <p><strong>Distance:</strong> {delivery.distance.toFixed(2)} km</p>}
              {delivery.estimatedDurationMinutes && (
                <p><strong>Estimated Time:</strong> {delivery.estimatedDurationMinutes} minutes</p>
              )}
              {delivery.estDelTime && (
                <p><strong>Expected Delivery:</strong> {new Date(delivery.estDelTime).toLocaleString()}</p>
              )}
            </div>
            <div className="card">
              <h3>Route Map</h3>
              {origin && destination ? (
                <MapView origin={origin} destination={destination} route={route} />
              ) : (
                <p>Location data not available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

