import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import siteIcon from "../assets/siteIcon.jpg";
import "./Login.css";

function Register() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.warn("Please complete all required fields", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.warn("Password must be at least 6 characters", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_API_URL}/register`, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })
      .then((resp) => {
        setLoading(false);
        if (resp.data.message) {
          toast.success("Account created successfully! Please sign in 🎉", {
            position: "bottom-center",
            autoClose: 1500,
          });

          // Save default name and email for quick login/checkout
          localStorage.setItem(
            "userDetails",
            JSON.stringify({
              name: formData.name.trim(),
              email: formData.email.trim().toLowerCase(),
            })
          );

          navigation("/login");
        } else {
          toast.error("Registration failed. Email may already be in use.", {
            position: "bottom-center",
            autoClose: 1500,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Register error:", error);
        toast.error("Server connection issue. Please try again.", {
          position: "bottom-center",
          autoClose: 1800,
        });
      });
  };

  return (
    <div className="lucky-login-page">
      <div className="lucky-login-card-container">
        {/* Left Brand Panel */}
        <div className="lucky-login-brand-panel">
          <div className="lucky-brand-panel-top">
            <div className="lucky-brand-logo-frame">
              <img src={siteIcon} alt="Lucky Fruits Logo" />
            </div>

            <h2 className="lucky-brand-panel-title">
              Join the Lucky Fruits Family
            </h2>

            <p className="lucky-brand-panel-desc">
              Create an account for one-click checkout, instant order tracking, and exclusive discounts on fresh coconuts and fruits in Jalgaon.
            </p>

            <div className="lucky-brand-feature-list">
              <div className="lucky-brand-feature-item">
                <i className="fa-solid fa-check"></i>
                <span>Fast One-Click Express Checkout</span>
              </div>
              <div className="lucky-brand-feature-item">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>Full Real-Time Order History</span>
              </div>
              <div className="lucky-brand-feature-item">
                <i className="fa-solid fa-shield-heart"></i>
                <span>Exclusive Farm-Fresh Harvest Deals</span>
              </div>
            </div>
          </div>

          <div className="lucky-brand-panel-bottom">
            <span>© 2026 Lucky Maharashtra Nariyal Suppliers</span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lucky-login-form-panel">
          <div className="lucky-login-form-header">
            <h1 className="lucky-login-heading">Create Account</h1>
            <p className="lucky-login-subheading">
              Fill in your details below to get started with fresh deliveries.
            </p>
          </div>

          <form onSubmit={submit} className="lucky-auth-form">
            {/* Full Name */}
            <div className="lucky-auth-field">
              <label htmlFor="reg-name" className="lucky-auth-label">
                Full Name
              </label>
              <div className="lucky-auth-input-wrapper">
                <i className="fa-solid fa-user lucky-auth-input-icon"></i>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Patil"
                  className="lucky-auth-input"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="lucky-auth-field">
              <label htmlFor="reg-email" className="lucky-auth-label">
                Email Address
              </label>
              <div className="lucky-auth-input-wrapper">
                <i className="fa-solid fa-envelope lucky-auth-input-icon"></i>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="yourname@gmail.com"
                  className="lucky-auth-input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="lucky-auth-field">
              <label htmlFor="reg-password" className="lucky-auth-label">
                Password
              </label>
              <div className="lucky-auth-input-wrapper">
                <i className="fa-solid fa-lock lucky-auth-input-icon"></i>
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password (min 6 chars)"
                  className="lucky-auth-input"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="lucky-password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label="Toggle password visibility"
                >
                  <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="lucky-auth-submit-btn"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="lucky-auth-switch-prompt">
            <span>Already have an account?</span>
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
