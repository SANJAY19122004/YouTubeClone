import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../context/AuthContext";
import "./Auth.css";

// Login page - allows users to sign in
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form field states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error and loading states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate fields
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // Send login request to backend
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // Save user and token to auth context
      login(res.data.user, res.data.token);

      // Redirect to home page
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="logo-icon">▶</span>
          <span className="logo-text">YouTube</span>
        </div>

        <h1 className="auth-title">Sign In</h1>
        <p className="auth-subtitle">to continue to YouTube</p>

        {/* Error message */}
        {error && <div className="auth-error">{error}</div>}

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
