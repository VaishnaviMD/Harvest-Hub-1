import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <h1>
              Farm Fresh, <span className="highlight">Directly</span> to Your Door
            </h1>
            <p>
              {isAuthenticated 
                ? `Welcome back, ${user?.name || user?.email}! Ready to shop fresh produce?`
                : "Connect directly with local farmers. Get the freshest organic produce at fair prices, while supporting your community."}
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <>
                  <Link to="/products" className="btn-primary">🛒 Start Shopping</Link>
                  {user?.type === "Farmer" && <Link to="/farmer" className="btn-outline">🌿 My Farm</Link>}
                </>
              ) : (
                <>
                  <Link to="/signin" className="btn-primary">Sign In to Shop</Link>
                  <Link to="/signup" className="btn-outline">🌿 I'm a Farmer</Link>
                </>
              )}
            </div>
          </div>
          <div className="hero-image">
            <img src="/hero-farm.jpg" alt="Fresh farm produce" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section muted">
        <div className="container">
          <h2>How Harvest Hub Works</h2>
          <p className="subtitle">Simple, transparent, and designed for both farmers and consumers</p>
          <div className="grid-2">
            <div className="card">
              <h3>For Customers</h3>
              <ol>
                <li>Browse fresh produce from local farmers</li>
                <li>Add items to cart and place orders</li>
                <li>Track delivery with real-time GPS</li>
                <li>Rate and review your purchases</li>
              </ol>
            </div>
            <div className="card">
              <h3>For Farmers</h3>
              <ol>
                <li>Create your farmer profile and shop</li>
                <li>List products with pricing and details</li>
                <li>Manage inventory in real-time</li>
                <li>Receive orders and track earnings</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="section">
        <div className="container">
          <h2>Fresh Categories</h2>
          <p className="subtitle">Explore our wide range of farm-fresh products</p>
          <div className="grid-3">
            <div className="category-card">
              <img src="/category-vegetables.jpg" alt="Vegetables" />
              <div className="overlay">
                <h3>Vegetables</h3>
                <p>120+ varieties</p>
              </div>
            </div>
            <div className="category-card">
              <img src="/category-fruits.jpg" alt="Fruits" />
              <div className="overlay">
                <h3>Fruits</h3>
                <p>80+ varieties</p>
              </div>
            </div>
            <div className="category-card">
              <img src="/category-dairy.jpg" alt="Dairy" />
              <div className="overlay">
                <h3>Dairy</h3>
                <p>50+ products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="section muted">
        <div className="container">
          <h2>Why Choose Harvest Hub?</h2>
          <p className="subtitle">Benefits for everyone in the farm-to-table journey</p>
          <div className="grid-3">
            <div className="card benefit">
              📍
              <h3>GPS Tracking</h3>
              <p>Track your delivery in real-time with integrated Google Maps</p>
            </div>
            <div className="card benefit">
              🛡️
              <h3>Secure Payments</h3>
              <p>Multiple payment options with bank-grade security</p>
            </div>
            <div className="card benefit">
              ⏰
              <h3>Farm Fresh</h3>
              <p>Produce delivered within 24-48 hours of harvest</p>
            </div>
            <div className="card benefit">
              📈
              <h3>Fair Pricing</h3>
              <p>No middlemen means better prices for everyone</p>
            </div>
            <div className="card benefit">
              🌿
              <h3>100% Organic</h3>
              <p>All products are certified organic and pesticide-free</p>
            </div>
            <div className="card benefit">
              🛒
              <h3>Easy Shopping</h3>
              <p>Intuitive interface for seamless browsing and checkout</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container text-center">
          <h2>Ready to Experience Farm-Fresh Goodness?</h2>
          <p>Join thousands of happy customers and farmers on Harvest Hub</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-light">Browse Products</Link>
            <Link to="/signup" className="btn-outline-light">Become a Seller</Link>
          </div>
        </div>
      </section>
    </>
  );
}


