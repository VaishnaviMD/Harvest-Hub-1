import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "../signin.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phNo, setPhNo] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !name) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await api.signUp({
        email,
        password,
        name,
        type,
        phNo,
        location,
      });
      
      if (response && response.success) {
        login(response.user, response.token);
        navigate("/");
      } else {
        setError(response?.message || "Signup failed");
      }
    } catch (err) {
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
    <div className="signin-container">
      <div style={{ textAlign: "left" }}>
        <button className="btn-outline" onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = "/")}>← Back</button>
      </div>
      <Link to="/" className="logo">🌱 <span>Harvest Hub</span></Link>
      <div className="card">
        <div className="card-header">
          <h2>Create Account</h2>
          <p>Shop fresh or start selling as a farmer</p>
        </div>
        <form onSubmit={submit} className="form">
          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" value={phNo} onChange={(e) => setPhNo(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="form-group">
            <label>I am a *</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="Customer">Customer</option>
              <option value="Farmer">Farmer</option>
            </select>
          </div>
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center small" style={{ marginTop: "0.75rem" }}>
          Already have an account? <Link to="/signin" className="link">Sign in</Link>
        </p>
      </div>
    </div>
    </section>
  );
}


