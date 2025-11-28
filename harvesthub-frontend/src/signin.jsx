// src/pages/SignIn.jsx
import "./signin.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { api } from "./services/api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await api.signIn({ email, password });
      if (response && response.success) {
        login(response.user, response.token);
        navigate("/");
      } else {
        setError(response?.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
    <div className="signin-container">
      {/* Back button for auth page */}
      <div style={{ textAlign: "left" }}>
        <Link to="/" className="btn-outline">← Back</Link>
      </div>
      {/* Logo */}
      <Link to="/" className="logo">
        🌱 <span>Harvest Hub</span>
      </Link>

      {/* Sign In Card */}
      <div className="card">
        <div className="card-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="password-header">
              <label>Password</label>
              <a href="#" className="link">Forgot password?</a>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center small">
          Don’t have an account?{" "}
          <Link to="/signup" className="link">Sign up</Link>
        </p>

        <div className="divider">
          <span>Or continue with</span>
        </div>

        <div className="social-login">
          <button className="btn-outline">Google</button>
          <button className="btn-outline">GitHub</button>
        </div>
      </div>

      {/* User Type Selection */}
      <div className="user-type">
        <p>I am a:</p>
        <div className="user-buttons">
          <button className="btn-outline" onClick={() => navigate("/customer")}>Customer</button>
          <button className="btn-outline" onClick={() => navigate("/farmer")}>Farmer</button>
        </div>
      </div>
    </div>
    </section>
  );
}
