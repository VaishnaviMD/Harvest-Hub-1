import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BackButton from "../components/BackButton";
import LocationPicker from "../components/LocationPicker";
import { formatINR } from "../utils/currency";
import { api } from "../services/api";
import { mockPayment } from "../services/mockPayment";

export default function Checkout() {
  const { items, totals, clear } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [payment, setPayment] = useState("card");
  const [loading, setLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const navigate = useNavigate();

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setShowLocationPicker(false);
  };

  const handleRazorpayPayment = async (orderData) => {
    try {
      // Create payment order (mock or real)
      const paymentOrder = await api.createPaymentOrder({
        amount: totals.total,
        currency: "INR",
        receipt: `ORDER_${Date.now()}`,
      });

      if (!paymentOrder || !paymentOrder.orderId) {
        throw new Error("Failed to create payment order");
      }

      // Use mock payment if Razorpay is not available
      if (!window.Razorpay || paymentOrder.keyId === "mock_key_id") {
        const confirmed = window.confirm(
          `Proceed with payment of ${formatINR(totals.total)}?\n\nThis is a mock payment. In production, this would redirect to Razorpay.`
        );
        
        if (confirmed) {
          const paymentResult = await mockPayment.processPayment(
            paymentOrder.orderId,
            totals.total,
            "card"
          );
          
          if (paymentResult.success) {
            await createOrder(orderData, {
              paymentId: paymentResult.paymentId,
              orderId: paymentOrder.orderId,
              transactionId: paymentResult.transactionId,
              status: "SUCCESS",
            });
          } else {
            alert("Payment failed. Please try again.");
          }
        }
        return;
      }

      // Real Razorpay integration (when available)
      const options = {
        key: paymentOrder.keyId,
        amount: paymentOrder.amount * 100,
        currency: paymentOrder.currency,
        name: "Harvest Hub",
        description: "Order Payment",
        order_id: paymentOrder.orderId,
        handler: async function (response) {
          try {
            const verified = await api.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verified.verified) {
              await createOrder(orderData, {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                status: "SUCCESS",
              });
            } else {
              alert("Payment verification failed. Please try again.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#4caf50",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        alert("Payment failed. Please try again.");
      });
      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to initialize payment. Please try again.");
    }
  };

  const createOrder = async (orderData, paymentData = null) => {
    try {
      const response = await api.createOrder(orderData);
      
      if (paymentData) {
        // Update payment status
        await api.createPayment({
          orderId: response.orderId,
          amount: totals.total,
          paymentMethod: payment,
          transactionId: paymentData.paymentId || paymentData.orderId,
          status: paymentData.status,
        });
      }

      alert(`Order placed successfully! Thank you, ${user?.name || user?.email}. Your payment has been processed.`);
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

      if (payment === "card") {
        // Use Razorpay for card payments
        await handleRazorpayPayment(orderData);
      } else {
        // COD - create order directly
        await createOrder(orderData, {
          status: "PENDING",
          paymentMethod: "cod",
        });
      }
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
                <option value="card">Credit/Debit Card (Razorpay)</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }} disabled={loading}>
              {loading ? "Processing..." : payment === "card" ? "Pay Now" : "Place Order"}
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
