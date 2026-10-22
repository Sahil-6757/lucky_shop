import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import siteIcon from "../assets/siteIcon.jpg";
import "./Login.css";

function Login() {
  const { setLogin } = useContext(AuthContext);
  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loginBtn = (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.warn("Please enter both email and password", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_API_URL}/login`, {
        email: formData.email.trim(),
        password: formData.password,
      })
      .then((resp) => {
        setLoading(false);
        const result = resp.data.message;

        // Normal User Login
        if (result === "login Success") {
          toast.success("Welcome back! Login Successful 🎉", {
            position: "bottom-center",
            autoClose: 1200,
          });

          setLogin(true);
          localStorage.setItem("Login", "true");

          // Save userDetails from server if available
          if (resp.data.user && resp.data.user.length > 0) {
            const u = resp.data.user[0];
            localStorage.setItem(
              "userDetails",
              JSON.stringify({
                name: u.name || "",
                email: u.email || formData.email.trim(),
                mobile: u.phone || u.mobile || "",
                address: u.address || "",
              })
            );
          }

          navigation("/dashboard/dHome");
        }
        // Admin Login
        else if (result === "Admin login Success") {
          toast.success("Welcome Administrator! 🛡️", {
            position: "bottom-center",
            autoClose: 1200,
          });

          setLogin(true);
          localStorage.setItem("Login", "true");

          navigation("/Dashboard/dHome");
        }
        // Invalid credentials
        else {
          toast.error("Invalid Email or Password. Please try again ❌", {
            position: "bottom-center",
            autoClose: 1500,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Login error:", error);
        toast.error("Server connection issue. Please check your credentials.", {
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
              Nature's Freshness, Handpicked Daily.
            </h2>

            <p className="lucky-brand-panel-desc">
              Your trusted partner for green coconuts, seasonal apples, mangoes, and wholesale fruit supply in Jalgaon.
            </p>

            <div className="lucky-brand-feature-list">
              <div className="lucky-brand-feature-item">
                <i className="fa-solid fa-check"></i>
                <span>100% Farm-Fresh & Naturally Ripened</span>
              </div>
              <div className="lucky-brand-feature-item">
                <i className="fa-solid fa-truck-fast"></i>
                <span>Fast Same-Day Doorstep Delivery</span>
              </div>
              <div className="lucky-brand-feature-item">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span>Zero Risk: Cash on Delivery Available</span>
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
            <h1 className="lucky-login-heading">Welcome Back</h1>
            <p className="lucky-login-subheading">
              Sign in with your email to manage orders and track shipments.
            </p>
          </div>

          <form onSubmit={loginBtn} className="lucky-auth-form">
            {/* Email Field */}
            <div className="lucky-auth-field">
              <label htmlFor="auth-email" className="lucky-auth-label">
                Email Address
              </label>
              <div className="lucky-auth-input-wrapper">
                <i className="fa-solid fa-envelope lucky-auth-input-icon"></i>
                <input
                  id="auth-email"
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

            {/* Password Field */}
            <div className="lucky-auth-field">
              <label htmlFor="auth-password" className="lucky-auth-label">
                Password
              </label>
              <div className="lucky-auth-input-wrapper">
                <i className="fa-solid fa-lock lucky-auth-input-icon"></i>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="lucky-auth-input"
                  required
                  autoComplete="current-password"
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

            {/* Options Row (Remember Me & Forgot Password) */}
            <div className="lucky-auth-options-row">
              <label className="lucky-remember-checkbox-group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/contactus"
                className="lucky-forgot-password-link"
              >
                Need Help?
              </Link>
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
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          {/* <div className="lucky-auth-switch-prompt">
            <span>Don't have an account yet?</span>
            <Link to="/register">Create an Account</Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Login;