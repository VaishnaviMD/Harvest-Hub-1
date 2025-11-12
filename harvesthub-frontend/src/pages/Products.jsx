import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import { api } from "../services/api";

const FALLBACK_PRODUCTS = [
  { id: 1, name: "Organic Tomatoes", price: 99, category: "Vegetables", image: "/category-vegetables.jpg" },
  { id: 2, name: "Fresh Strawberries", price: 149, category: "Fruits", image: "/category-fruits.jpg" },
  { id: 3, name: "Farm Milk 1L", price: 79, category: "Dairy", image: "/category-dairy.jpg" },
  { id: 4, name: "Kale Bunch", price: 69, category: "Vegetables", image: "/category-vegetables.jpg" },
  { id: 5, name: "Bananas (6)", price: 59, category: "Fruits", image: "/category-fruits.jpg" },
  { id: 6, name: "Greek Yogurt", price: 119, category: "Dairy", image: "/category-dairy.jpg" },
];

export default function Products() {
  const { add } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.getProducts();
        if (mounted) {
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data);
            setError(""); // Clear error if products loaded successfully
          } else {
            setError("No products available. Showing sample data.");
            setProducts(FALLBACK_PRODUCTS);
          }
        }
      } catch (e) {
        console.error("Error loading products:", e);
        if (mounted) {
          setError("Failed to load products. Showing sample data.");
          setProducts(FALLBACK_PRODUCTS);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="section">
      <div className="container">
        <BackButton />
        <h2>Browse Products</h2>
        <p className="subtitle">Add the freshest local produce to your cart</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error && <p className="subtitle" style={{ color: "#b45309" }}>{error}</p>}
            {(products && products.length > 0 ? products : FALLBACK_PRODUCTS) && (
              <div className="grid-3">
                {(products && products.length > 0 ? products : FALLBACK_PRODUCTS).map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={add} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


