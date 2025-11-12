import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/currency";
import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { api } from "../services/api";

const FALLBACK = {
  id: 0, name: "Sample Product", price: 99, category: "General", image: "/category-vegetables.jpg",
  description: "Sample product shown due to connectivity issue."
};

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getProductById(id);
        if (mounted) setProduct(data);
      } catch (e) {
        setError("Failed to load product. Showing sample.");
        setProduct(FALLBACK);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <BackButton />
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section">
        <div className="container">
          <BackButton />
          <p>Product not found. <Link to="/products" className="btn-outline">Back to Products</Link></p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <BackButton />
        <div className="grid-2">
          <div>
            <img src={product.image} alt={product.name} />
          </div>
          <div>
            <h2>{product.name}</h2>
            <p className="subtitle">{product.category}</p>
            <p style={{ margin: "1rem 0" }}>{product.description}</p>
            <strong style={{ fontSize: "1.25rem" }}>{formatINR(product.price)}</strong>
            <div style={{ marginTop: "1rem" }}>
              <button className="btn-primary" onClick={() => add(product)}>Add to cart</button>
              <Link to="/products" className="btn-outline" style={{ marginLeft: "0.5rem" }}>Back</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


