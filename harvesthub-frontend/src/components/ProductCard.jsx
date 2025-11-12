import { formatINR } from "../utils/currency";
import { useState } from "react";
import Toast from "./Toast";

export default function ProductCard({ product, onAddToCart }) {
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setShowToast(true);
  };

  return (
    <>
      <div className="card">
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p style={{ color: "#555", margin: "0.25rem 0 0.75rem" }}>{product.category}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong>{formatINR(product.price)}</strong>
          <button className="btn-primary" onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
      {showToast && (
        <Toast 
          message={`${product.name} has been added to cart!`} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </>
  );
}


