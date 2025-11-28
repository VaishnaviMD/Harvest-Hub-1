import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "../components/BackButton";
import LocationPicker from "../components/LocationPicker";
import { formatINR } from "../utils/currency";
import { api } from "../services/api";

export default function Checkout() {
  const { items, totals, clear } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [payment, setPayment] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const navigate = useNavigate();

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationPicker(false);
  };

  const handleRazorpayPayment = async () => {};

  const createOrder = async (orderData) => {
    try {
      const response = await api.createOrder(orderData);
      alert(`Order placed successfully! Thank you, ${user?.name || user?.email}.`);
      clear();
      navigate("/");
    } catch (err) {
      console.error("Order error:", err);
      const errorMessage = err.message || "Unknown error occurred";
      alert(`Failed to place order: ${errorMessage}. Please try again.`);
    }
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    if (!address.trim()) {
      alert("Please enter your delivery address");
      return;
    }
    
    setLoading(true);
    
    try {
      const orderData = {
        address,
        paymentMethod: payment,
        items: items.map(i => ({ 
          productId: i.productId || i.id, 
          quantity: i.qty, 
          price: i.price 
        })),
      };

      await createOrder(orderData);
    } catch (err) {
      console.error("Order error:", err);
      alert(`Failed to place order: ${err.message || "Unknown error"}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <BackButton />
        <h2>Checkout</h2>
        <div className="grid-2">
          <form className="card" onSubmit={placeOrder}>
            <h3>Shipping Details</h3>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Full Name</label>
              <input value={user?.name || ""} disabled style={{ backgroundColor: "#f5f5f5" }} />
            </div>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Email</label>
              <input value={user?.email || ""} disabled style={{ backgroundColor: "#f5f5f5" }} />
            </div>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Delivery Address *</label>
              <textarea 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                required 
                rows="3"
                placeholder="Enter your complete delivery address"
              />
              <button 
                type="button" 
                className="btn-outline" 
                style={{ marginTop: "0.5rem" }}
                onClick={() => setShowLocationPicker(!showLocationPicker)}
              >
                {showLocationPicker ? "Hide" : "Pick Location on Map"}
              </button>
              {showLocationPicker && (
                <div style={{ marginTop: "1rem" }}>
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                </div>
              )}
            </div>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Payment Method</label>
              <select value={payment} onChange={(e) => setPayment(e.target.value)}>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }} disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
          <div className="card">
            <h3>Order Summary</h3>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
              {items.map(i => (
                <li key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span>{i.name} × {i.qty}</span>
                  <span>{formatINR(i.price * i.qty)}</span>
                </li>
              ))}
              <li style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontWeight: 700 }}>
                <span>Total</span><span>{formatINR(totals.total)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
