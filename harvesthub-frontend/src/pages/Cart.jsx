import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/currency";
import BackButton from "../components/BackButton";

export default function Cart() {
  const { items, totals, inc, dec, remove, clear } = useCart();
  return (
    <section className="section">
      <div className="container">
        <BackButton />
        <h2>Your Cart</h2>
        {items.length === 0 ? (
          <>
            <p className="subtitle">Your cart is empty.</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </>
        ) : (
          <div className="grid-2">
            <div>
              {items.map(item => (
                <div key={item.id} className="card" style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <img src={item.image} alt={item.name} style={{ width: 96, height: 96, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <strong>{item.name}</strong>
                      <p className="subtitle">{item.category}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <button className="btn-outline" onClick={() => dec(item.id)}>-</button>
                        <span>{item.qty}</span>
                        <button className="btn-outline" onClick={() => inc(item.id)}>+</button>
                        <button className="btn-outline" onClick={() => remove(item.id)} style={{ marginLeft: "auto" }}>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div>{formatINR(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}
              <button className="btn-outline" onClick={clear}>Clear Cart</button>
            </div>
            <div>
              <div className="card">
                <h3>Order Summary</h3>
                <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal</span><span>{formatINR(totals.subtotal)}</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Shipping</span><span>{formatINR(totals.shipping)}</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Tax</span><span>{formatINR(totals.tax)}</span>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontWeight: 700 }}>
                    <span>Total</span><span>{formatINR(totals.total)}</span>
                  </li>
                </ul>
                <Link to="/checkout" className="btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


