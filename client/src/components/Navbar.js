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

      document.addEventListener("mousedown", handleClickOutside);
      const userLogin = localStorage.getItem("Login");
      setLogin(userLogin === "true");

      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    } catch (error) {
      console.error(error);
    }
  }, [setLogin]);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
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

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="lucky-mobile-menu-drawer" ref={mobileMenuRef}>
          <Link
            to="/"
            className={`lucky-mobile-menu-link ${isActive("/") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
          </Link>
          <Link
            to="/aboutus"
            className={`lucky-mobile-menu-link ${isActive("/aboutus") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <i className="fa-solid fa-circle-info"></i>
            <span>About us</span>
          </Link>
          <Link
            to="/product"
            className={`lucky-mobile-menu-link ${isActive("/product") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <i className="fa-solid fa-apple-whole"></i>
            <span>Products</span>
          </Link>
          <Link
            to="/contactus"
            className={`lucky-mobile-menu-link ${isActive("/contactus") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <i className="fa-solid fa-envelope"></i>
            <span>Contact us</span>
          </Link>
          <Link
            to="/cart"
            className={`lucky-mobile-menu-link ${isActive("/cart") ? "active" : ""}`}
            onClick={() => {
              setMenuOpen(false);
              scrollTop();
            }}
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span>Cart</span>
            {count != null && count > 0 && (
              <span className="lucky-mobile-cart-badge">{count}</span>
            )}
          </Link>

          {login && (
            <>
              <div className="lucky-mobile-menu-divider"></div>
              <Link
                to="/dashboard"
                className="lucky-mobile-menu-link"
                onClick={() => {
                  setMenuOpen(false);
                  scrollTop();
                }}
              >
                <i className="fa-solid fa-chart-line"></i>
                <span>Dashboard</span>
              </Link>
              <Link
                to="/profile"
                className="lucky-mobile-menu-link"
                onClick={() => {
                  setMenuOpen(false);
                  scrollTop();
                }}
              >
                <i className="fa-solid fa-id-card"></i>
                <span>My Profile</span>
              </Link>
            </>
          )}

          <div className="lucky-mobile-menu-divider"></div>

          {login ? (
            <button
              type="button"
              className="lucky-mobile-auth-btn logout"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="lucky-mobile-auth-btn login"
              onClick={() => {
                setMenuOpen(false);
                scrollTop();
              }}
            >
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              <span>Login</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
