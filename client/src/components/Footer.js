import { useState, useEffect } from "react";
import "./Footer.css";
import siteIcon from "../assets/siteIcon.jpg";
import { Link, useLocation } from "react-router-dom";
import Testimonial from "./Testimonial";

function Footer() {
  // ✅ Scroll button state
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowBtn(true);
      } else {
        setShowBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const location = useLocation();
  const isDashboard = location.pathname.toLowerCase().startsWith("/dashboard");

  const phoneNumber = "9822516757";
  const whatsappLink = `https://wa.me/91${phoneNumber}?text=Hi%20Lucky%20Fruits,%20I%20would%20like%20to%20order%20fresh%20fruits/coconuts:`;
  const mapsLink = "https://maps.google.com/?q=Lucky+Maharashtra+Nariyal+Suppliers+Jalgaon";

  if (isDashboard) {
    return null;
  }

  return (
    <div className="lucky-footer-wrapper-outer">
      {/* ⭐ TESTIMONIALS SECTION */}
      <Testimonial />

      {/* 💬 FLOATING WHATSAPP BUTTON */}
      <a
        href={whatsappLink}
        className="lucky-floating-whatsapp-btn"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order on WhatsApp"
      >
        <div className="lucky-floating-wa-circle">
          <i className="fa-brands fa-whatsapp"></i>
          <span className="lucky-floating-wa-ping"></span>
        </div>
        <span className="lucky-floating-wa-tooltip">
          <i className="fa-brands fa-whatsapp" style={{ color: "#25d366" }}></i>
          Order Fresh Fruits on WhatsApp!
        </span>
      </a>

      {/* 🔝 FLOATING SCROLL BUTTON */}
      {showBtn && (
        <button
          className="lucky-floating-scroll-btn"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          title="Back to top"
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}

      {/* 🌿 ATTRACTIVE FOOTER */}
      <footer className="lucky-footer-root">
        {/* Glowing Top Accent Line */}
        <div className="lucky-footer-top-accent"></div>

        <div className="lucky-footer-container">
          {/* 1️⃣ VALUE PROPOSITION & TRUST STRIP */}
          <section className="lucky-footer-trust-strip" aria-label="Store Guarantees">
            <div className="lucky-trust-grid">
              <div className="lucky-trust-card">
                <div className="lucky-trust-icon-box">
                  <i className="fa-solid fa-leaf"></i>
                </div>
                <div className="lucky-trust-text-block">
                  <h4>100% Farm Fresh</h4>
                  <p>Hand-picked daily from premier coconut farms & fruit orchards.</p>
                </div>
              </div>

              <div className="lucky-trust-card">
                <div className="lucky-trust-icon-box">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <div className="lucky-trust-text-block">
                  <h4>Express Delivery</h4>
                  <p>Fast doorstep delivery across Jalgaon city (9 AM - 9 PM).</p>
                </div>
              </div>

              <div className="lucky-trust-card">
                <div className="lucky-trust-icon-box">
                  <i className="fa-solid fa-boxes-packing"></i>
                </div>
                <div className="lucky-trust-text-block">
                  <h4>Wholesale & Retail</h4>
                  <p>Competitive rates for households, caterers, temples & events.</p>
                </div>
              </div>

              <div className="lucky-trust-card">
                <div className="lucky-trust-icon-box">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div className="lucky-trust-text-block">
                  <h4>Trusted & COD</h4>
                  <p>Pay easily via Cash on Delivery, GPay, PhonePe or UPI.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2️⃣ INTERACTIVE WHATSAPP & CALL ACTION BANNER */}
          <div className="lucky-footer-quick-banner">
            <div className="lucky-quick-banner-left">
              <div className="lucky-quick-badge-icon">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div className="lucky-quick-banner-text">
                <h3>Need Fresh Coconuts or Bulk Fruits Today?</h3>
                <p>Chat directly with our team on WhatsApp for prompt delivery or wholesale pricing.</p>
              </div>
            </div>
            <div className="lucky-quick-banner-actions">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="lucky-btn-whatsapp-action"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Order on WhatsApp</span>
              </a>
              <a href={`tel:${phoneNumber}`} className="lucky-btn-call-action">
                <i className="fa-solid fa-phone"></i>
                <span>Call +91 {phoneNumber}</span>
              </a>
            </div>
          </div>

          {/* 3️⃣ MAIN 4-COLUMN CONTENT GRID */}
          <div className="lucky-footer-main-grid">
            {/* Column 1: Brand & Identity */}
            <div className="lucky-footer-brand-col">
              <Link to="/" onClick={scrollToTop} className="lucky-footer-brand-header">
                <div className="lucky-footer-logo-wrapper">
                  <img src={siteIcon} alt="Lucky Fruits Logo" className="lucky-footer-logo-img" />
                </div>
                <div className="lucky-footer-brand-title">
                  <span>Lucky<span className="accent">Fruits</span></span>
                  <span className="lucky-footer-brand-subtitle">Lucky Maharashtra Nariyal</span>
                </div>
              </Link>

              <p className="lucky-footer-bio">
                Jalgaon’s trusted distributor of premium tender green coconuts, mature puja coconuts, 
                and hand-picked fresh fruits. Bringing farm-fresh vitality directly to your doorstep.
              </p>

              {/* Rating Pill */}
              <div className="lucky-footer-rating-pill">
                <div className="lucky-footer-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <span className="lucky-footer-rating-text">
                  4.9 / 5.0 (2,400+ Happy Customers)
                </span>
              </div>

              {/* Social / Connect icons */}
              <div className="lucky-footer-social-row">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lucky-footer-social-btn wa"
                  title="Chat on WhatsApp"
                  aria-label="WhatsApp"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
                <a
                  href={`tel:${phoneNumber}`}
                  className="lucky-footer-social-btn phone"
                  title="Call Us Now"
                  aria-label="Phone"
                >
                  <i className="fa-solid fa-phone"></i>
                </a>
                <a
                  href="mailto:luckyfruitsjalgaon@gmail.com"
                  className="lucky-footer-social-btn email"
                  title="Send Us An Email"
                  aria-label="Email"
                >
                  <i className="fa-solid fa-envelope"></i>
                </a>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lucky-footer-social-btn map"
                  title="Find us on Google Maps"
                  aria-label="Location"
                >
                  <i className="fa-solid fa-location-dot"></i>
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="lucky-footer-col">
              <h3 className="lucky-footer-col-title">
                <span className="lucky-footer-title-dot"></span>
                Quick Links
              </h3>
              <ul className="lucky-footer-link-list">
                <li className="lucky-footer-link-item" onClick={scrollToTop}>
                  <Link to="/">
                    <i className="fa-solid fa-chevron-right lucky-footer-chevron"></i>
                    <span>Home Page</span>
                  </Link>
                </li>
                <li className="lucky-footer-link-item" onClick={scrollToTop}>
                  <Link to="/aboutus">
                    <i className="fa-solid fa-chevron-right lucky-footer-chevron"></i>
                    <span>About Our Journey</span>
                  </Link>
                </li>
                <li className="lucky-footer-link-item" onClick={scrollToTop}>
                  <Link to="/product">
                    <i className="fa-solid fa-chevron-right lucky-footer-chevron"></i>
                    <span>All Products & Fruits</span>
                  </Link>
                </li>
                <li className="lucky-footer-link-item" onClick={scrollToTop}>
                  <Link to="/contactus">
                    <i className="fa-solid fa-chevron-right lucky-footer-chevron"></i>
                    <span>Contact & Location</span>
                  </Link>
                </li>
                <li className="lucky-footer-link-item" onClick={scrollToTop}>
                  <Link to="/cart">
                    <i className="fa-solid fa-chevron-right lucky-footer-chevron"></i>
                    <span>My Shopping Cart</span>
                  </Link>
                </li>
                <li className="lucky-footer-link-item" onClick={scrollToTop}>
                  <Link to="/profile">
                    <i className="fa-solid fa-chevron-right lucky-footer-chevron"></i>
                    <span>Track Orders & Account</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Fresh Offerings & Specialties */}
            <div className="lucky-footer-col">
              <h3 className="lucky-footer-col-title">
                <span className="lucky-footer-title-dot"></span>
                Our Specialties
              </h3>
              <div className="lucky-footer-tags-list">
                <Link to="/product" onClick={scrollToTop} className="lucky-footer-tag-link">
                  <span className="lucky-footer-tag-emoji">🥥</span>
                  <span>Tender Green Coconut</span>
                  <span className="lucky-footer-tag-badge">Best Seller</span>
                </Link>
                <Link to="/product" onClick={scrollToTop} className="lucky-footer-tag-link">
                  <span className="lucky-footer-tag-emoji">🥥</span>
                  <span>Mature Puja Coconut</span>
                  <span className="lucky-footer-tag-badge">Fresh</span>
                </Link>
                <Link to="/product" onClick={scrollToTop} className="lucky-footer-tag-link">
                  <span className="lucky-footer-tag-emoji">🍎</span>
                  <span>Kashmiri Crisp Apples</span>
                  <span className="lucky-footer-tag-badge">Sweet</span>
                </Link>
                <Link to="/product" onClick={scrollToTop} className="lucky-footer-tag-link">
                  <span className="lucky-footer-tag-emoji">🥭</span>
                  <span>Seasonal Mangoes</span>
                  <span className="lucky-footer-tag-badge">Farm Pick</span>
                </Link>
                <Link to="/product" onClick={scrollToTop} className="lucky-footer-tag-link">
                  <span className="lucky-footer-tag-emoji">🍍</span>
                  <span>Pineapple & Pomegranate</span>
                </Link>
                <Link to="/product" onClick={scrollToTop} className="lucky-footer-tag-link">
                  <span className="lucky-footer-tag-emoji">🧺</span>
                  <span>Bulk Event Crates</span>
                  <span className="lucky-footer-tag-badge">Wholesale</span>
                </Link>
              </div>
            </div>

            {/* Column 4: Contact & Store Depot Info */}
            <div className="lucky-footer-col">
              <h3 className="lucky-footer-col-title">
                <span className="lucky-footer-title-dot"></span>
                Store & Depot
              </h3>

              <div className="lucky-footer-contact-items">
                {/* Address */}
                <div className="lucky-footer-contact-row">
                  <div className="lucky-footer-contact-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <h5>Main Wholesale Depot</h5>
                    <p>Shop No. 293, Basement, New B.J. Market, Jalgaon, Maharashtra 425001</p>
                    <a
                      href={mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lucky-footer-map-link"
                    >
                      <span>Get Directions on Map</span>
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="lucky-footer-contact-row">
                  <div className="lucky-footer-contact-icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <h5>Phone & WhatsApp</h5>
                    <a href={`tel:${phoneNumber}`}>+91 {phoneNumber}</a>
                  </div>
                </div>

                {/* Email */}
                <div className="lucky-footer-contact-row">
                  <div className="lucky-footer-contact-icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <h5>Email Support</h5>
                    <a href="mailto:luckyfruitsjalgaon@gmail.com">
                      luckyfruitsjalgaon@gmail.com
                    </a>
                  </div>
                </div>

                {/* Hours Badge */}
                <div className="lucky-footer-hours-pill">
                  <i className="fa-regular fa-clock"></i>
                  <div>
                    <span className="title">Operating Hours (All 7 Days)</span>
                    <span className="time">9:00 AM – 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4️⃣ BOTTOM BAR: COPYRIGHT & PAYMENTS */}
        <div className="lucky-footer-bottom-bar">
          <div className="lucky-footer-container">
            <div className="lucky-footer-bottom-inner">
              <p className="lucky-footer-copy-text">
                &copy; {new Date().getFullYear()} <strong>Lucky Maharashtra Nariyal Suppliers</strong>. All rights reserved.
              </p>

              {/* Payment methods row */}
              <div className="lucky-footer-payments" aria-label="Accepted payment methods">
                <span className="lucky-payment-pill cod">
                  <i className="fa-solid fa-hand-holding-dollar"></i> Cash on Delivery
                </span>
                <span className="lucky-payment-pill">
                  <i className="fa-brands fa-google-pay"></i> GPay
                </span>
                <span className="lucky-payment-pill">
                  <i className="fa-solid fa-mobile-screen"></i> PhonePe
                </span>
                <span className="lucky-payment-pill">
                  <i className="fa-solid fa-wallet"></i> Paytm / UPI
                </span>
              </div>

              {/* Back to top button */}
              <button
                className="lucky-footer-back-to-top"
                onClick={scrollToTop}
                type="button"
              >
                <span>Back to Top</span>
                <i className="fa-solid fa-arrow-up"></i>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
