import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";
import "./Navbar.css";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import siteIcon from "../assets/siteIcon.jpg";

function Navbar() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { login, setLogin } = useContext(AuthContext);
  const { count } = useContext(AuthContext);

  const handleLogout = () => {
    toast.success("Logout Successfully", {
      position: "bottom-center",
      autoClose: 1000,
    });
    localStorage.setItem("Login", "false");
    setLogin(false);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const handleBars = () => {
    setMenuOpen((prev) => !prev);
    setDropdownOpen(false);
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.toLowerCase().startsWith(path.toLowerCase())) return true;
    return false;
  };

  useEffect(() => {
    try {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
        if (
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(e.target) &&
          !e.target.closest(".lucky-mobile-toggle-btn")
        ) {
          setMenuOpen(false);
        }
      };

      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          setMenuOpen(false);
          setDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside, { passive: true });
      window.addEventListener("keydown", handleKeyDown);

      const userLogin = localStorage.getItem("Login");
      setLogin(userLogin === "true");

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
        window.removeEventListener("keydown", handleKeyDown);
      };
    } catch (error) {
      console.error(error);
    }
  }, [setLogin]);

  // Lock body scroll when mobile side navbar is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="lucky-navbar-wrapper navbar">
      {/* Brand & Logo */}
      <Link to="/" className="lucky-brand-link" onClick={scrollTop}>
        <div className="lucky-brand-logo-container">
          <img src={siteIcon} alt="Lucky Fruits Logo" className="lucky-brand-icon" />
        </div>
        <div className="lucky-brand-text-block">
          <span className="lucky-brand-title">
            Lucky<span className="brand-accent">Fruits</span>
          </span>
          <span className="lucky-brand-tagline">Fresh & Organic</span>
        </div>
      </Link>

      {/* Desktop Navigation Island */}
      <nav className="lucky-nav-center" aria-label="Main Navigation">
        <Link
          to="/"
          onClick={scrollTop}
          className={`lucky-nav-pill ${isActive("/") ? "active" : ""}`}
        >
          <i className="fa-solid fa-house"></i>
          <span>Home</span>
        </Link>
        <Link
          to="/aboutus"
          onClick={scrollTop}
          className={`lucky-nav-pill ${isActive("/aboutus") ? "active" : ""}`}
        >
          <i className="fa-solid fa-circle-info"></i>
          <span>About us</span>
        </Link>
        <Link
          to="/product"
          onClick={scrollTop}
          className={`lucky-nav-pill ${isActive("/product") ? "active" : ""}`}
        >
          <i className="fa-solid fa-apple-whole"></i>
          <span>Products</span>
        </Link>
        <Link
          to="/contactus"
          onClick={scrollTop}
          className={`lucky-nav-pill ${isActive("/contactus") ? "active" : ""}`}
        >
          <i className="fa-solid fa-envelope"></i>
          <span>Contact us</span>
        </Link>
      </nav>

      {/* Right Action Controls */}
      <div className="lucky-nav-right">
        {/* Cart Link with Badge */}
        <Link
          to="/cart"
          onClick={scrollTop}
          className="lucky-action-circle-btn"
          aria-label="Shopping Cart"
          title="Shopping Cart"
        >
          <i className="fa-solid fa-cart-shopping"></i>
          {count != null && count > 0 ? (
            <span className="lucky-cart-badge">{count}</span>
          ) : null}
        </Link>

        {/* Profile / Dropdown */}
        <div className="lucky-profile-dropdown-wrapper" ref={dropdownRef}>
          {login ? (
            <button
              type="button"
              className={`lucky-action-circle-btn ${dropdownOpen ? "active" : ""}`}
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-label="User Account Menu"
              title="User Account"
            >
              <i className="fa-solid fa-user"></i>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={scrollTop}
              className="lucky-action-circle-btn"
              aria-label="Sign In"
              title="Sign In"
            >
              <i className="fa-regular fa-user"></i>
            </Link>
          )}

          {login && dropdownOpen && (
            <div className="lucky-dropdown-panel">
              <div className="lucky-dropdown-header">
                <i className="fa-solid fa-circle-user lucky-dropdown-avatar"></i>
                <div className="lucky-dropdown-user-info">
                  <span className="lucky-dropdown-user-name">Welcome!</span>
                  <span className="lucky-dropdown-user-role">Member</span>
                </div>
              </div>

              <Link
                to="/dashboard"
                className="lucky-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  scrollTop();
                }}
              >
                <i className="fa-solid fa-chart-line"></i>
                <span>Dashboard</span>
              </Link>

              <Link
                to="/profile"
                className="lucky-dropdown-item"
                onClick={() => {
                  setDropdownOpen(false);
                  scrollTop();
                }}
              >
                <i className="fa-solid fa-id-card"></i>
                <span>My Profile</span>
              </Link>

              <button
                type="button"
                className="lucky-dropdown-item logout-item"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Login / Logout Pill CTA (Desktop) */}
        {login ? (
          <button
            type="button"
            className="lucky-nav-cta logout-cta"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="lucky-nav-cta login-cta"
            onClick={scrollTop}
          >
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
            <span>Login</span>
          </Link>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={`lucky-mobile-toggle-btn ${menuOpen ? "open" : ""}`}
          onClick={handleBars}
          aria-label="Toggle Navigation Menu"
        >
          <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </button>
      </div>
    </header>

    {/* Mobile Side Navbar Backdrop (Outside header so not trapped by backdrop-filter) */}
    <div
        className={`lucky-side-nav-backdrop ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      ></div>

      {/* Mobile Side Navbar Drawer */}
      <aside
        className={`lucky-side-navbar ${menuOpen ? "open" : ""}`}
        ref={mobileMenuRef}
        aria-label="Mobile Navigation Drawer"
      >
        {/* Drawer Header */}
        <div className="lucky-side-nav-header">
          <div className="lucky-side-nav-brand">
            <div className="lucky-side-nav-logo-box">
              <img src={siteIcon} alt="Lucky Fruits Logo" />
            </div>
            <div className="lucky-side-nav-brand-text">
              <span className="title">Lucky<span>Fruits</span></span>
              <span className="subtitle">Fresh & Organic</span>
            </div>
          </div>
          <button
            type="button"
            className="lucky-side-nav-close-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* User Status Card */}
        <div className="lucky-side-nav-user-card">
          {login ? (
            <div className="lucky-side-user-row">
              <div className="lucky-side-user-avatar">
                <i className="fa-solid fa-user-check"></i>
              </div>
              <div className="lucky-side-user-info">
                <span className="name">Welcome, Member!</span>
                <span className="status">🟢 Logged In</span>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="lucky-side-login-banner"
              onClick={() => {
                setMenuOpen(false);
                scrollTop();
              }}
            >
              <div className="lucky-side-login-icon">
                <i className="fa-regular fa-user"></i>
              </div>
              <div className="lucky-side-login-text">
                <span className="primary">Sign In / Register</span>
                <span className="secondary">Order tracking & fast checkout</span>
              </div>
              <i className="fa-solid fa-chevron-right ms-auto"></i>
            </Link>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="lucky-side-nav-links">
          <Link
            to="/"
            className={`lucky-side-nav-item ${isActive("/") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <div className="lucky-side-item-icon"><i className="fa-solid fa-house"></i></div>
            <span>Home</span>
          </Link>

          <Link
            to="/aboutus"
            className={`lucky-side-nav-item ${isActive("/aboutus") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <div className="lucky-side-item-icon"><i className="fa-solid fa-circle-info"></i></div>
            <span>About Us</span>
          </Link>

          <Link
            to="/product"
            className={`lucky-side-nav-item ${isActive("/product") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <div className="lucky-side-item-icon"><i className="fa-solid fa-apple-whole"></i></div>
            <span>All Products</span>
            <span className="lucky-side-pill-badge">Fresh</span>
          </Link>

          <Link
            to="/contactus"
            className={`lucky-side-nav-item ${isActive("/contactus") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <div className="lucky-side-item-icon"><i className="fa-solid fa-envelope"></i></div>
            <span>Contact & Depot</span>
          </Link>

          <Link
            to="/cart"
            className={`lucky-side-nav-item ${isActive("/cart") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <div className="lucky-side-item-icon"><i className="fa-solid fa-cart-shopping"></i></div>
            <span>Shopping Cart</span>
            {count != null && count > 0 && (
              <span className="lucky-side-cart-badge">{count}</span>
            )}
          </Link>

          {login && (
            <>
              <div className="lucky-side-nav-divider"></div>
              <Link
                to="/profile"
                className={`lucky-side-nav-item ${isActive("/profile") ? "active" : ""}`}
                onClick={() => {
                  setMenuOpen(false);
                  scrollTop();
                }}
              >
                <div className="lucky-side-item-icon"><i className="fa-solid fa-id-card"></i></div>
                <span>My Profile & Orders</span>
              </Link>

              <Link
                to="/dashboard"
                className={`lucky-side-nav-item ${isActive("/dashboard") ? "active" : ""}`}
                onClick={() => {
                  setMenuOpen(false);
                  scrollTop();
                }}
              >
                <div className="lucky-side-item-icon"><i className="fa-solid fa-chart-line"></i></div>
                <span>Admin Dashboard</span>
              </Link>
            </>
          )}
        </nav>

        {/* Quick Order Actions */}
        <div className="lucky-side-nav-actions">
          <a
            href="https://wa.me/919822516757?text=Hi%20Lucky%20Fruits,%20I%20have%20an%20order%20inquiry:"
            target="_blank"
            rel="noopener noreferrer"
            className="lucky-side-btn-wa"
          >
            <i className="fa-brands fa-whatsapp"></i>
            <span>Order on WhatsApp</span>
          </a>
          <a href="tel:9822516757" className="lucky-side-btn-call">
            <i className="fa-solid fa-phone"></i>
            <span>Call +91 9822516757</span>
          </a>
        </div>

        {/* Footer Auth Button */}
        <div className="lucky-side-nav-bottom">
          {login ? (
            <button
              type="button"
              className="lucky-side-auth-btn logout"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="lucky-side-auth-btn login"
              onClick={() => {
                setMenuOpen(false);
                scrollTop();
              }}
            >
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Sign In / Register</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

export default Navbar;
