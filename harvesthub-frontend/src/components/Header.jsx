import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <Link to="/" className="logo" aria-label="Harvest Hub Home">
          🌱 <span>Harvest Hub</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="nav-buttons">
          {isAuthenticated ? (
            <>
              <span style={{ marginRight: "1rem", color: "#333", fontWeight: 500 }}>
                Welcome, {user?.name || user?.email}!
              </span>
              <Link to="/cart" className="btn-outline" aria-label="Cart">Cart</Link>
              <button onClick={handleLogout} className="btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-outline">Sign in</Link>
              <Link to="/signup" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}


