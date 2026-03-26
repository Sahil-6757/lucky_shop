import React, { useState, useEffect } from "react";
import "../App.css";
import siteIcon from "../assets/siteIcon.jpg";
import { Link } from "react-router-dom";

// ✅ Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Footer() {

  // ✅ Scroll button state
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
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

  return (
    <div>
      <div className="container">
        {/* ABOUT + MAP */}
        <div className="about-us">
          <div className="row">
            <div className="col-md-6">
              <h3 className="text-center shop-name">
                Lucky Maharashtra Nariyal Suppliers
              </h3>
              <h6 className="text-center">
                We are the wholesaler of Green Coconut, Mango, Pineapple, Apple,
                Chicoo, Orange, Grapes, Pomegranate, etc
              </h6>
              <h6 className="text-center shop-name">
                We are offering Home Delivery Service Excellent Quality of Fruits
                are available
              </h6>
              <h5 className="text-center shop-name">
                Address : Shop No.293, Basement, New.B.J. Market, Jalgaon
              </h5>

              <p className="text-center shop-name fw-semibold">
                Feel Free to Contact Us
              </p>
              <p className="text-center shop-name">
                <i className="fa-solid fa-phone"></i> +91 9822516757 <br />
                <i className="fa-solid fa-phone"></i> +91 8983306757
              </p>
            </div>

            <div className="col-md-6">
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.553823638174!2d75.56621797400855!3d21.010514988407337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90fa67a280937%3A0x110c4a0c9002729e!2sLucky%20Maharashtra%20Nariyal%20Suppliers!5e0!3m2!1sen!2sin!4v1708224901113!5m2!1sen!2sin"
                  className="map-iframe"
                  title="g-map"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* ⭐ TESTIMONIAL SWIPER */}
        <div className="my-5">
          <h3 className="text-center text-success mb-4">
            Customer Reviews
          </h3>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500 }}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
          >
            <SwiperSlide>
              <div className="review-card">
                <div className="stars">★★★★★</div>
                <p className="date-time">2 day ago</p>
                <p className="description">
                  Fresh fruits quality is amazing. Highly recommended!
                </p>
                <div className="author">— John Doe</div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="review-card">
                <div className="stars">★★★★★</div>
                <p className="date-time">3 day ago</p>
                <p className="description">
                  Fast delivery and great service. Loved it!
                </p>
                <div className="author">— Rahul</div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="review-card">
                <div className="stars">★★★★★</div>
                <p className="date-time">5 day ago</p>
                <p className="description">
                  Best wholesale price in market. Will order again.
                </p>
                <div className="author">— Priya</div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919822516757"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fa-brands fa-whatsapp"></i>
      </a>

      {/* 🔝 SCROLL BUTTON */}
      {showBtn && (
        <button className="scroll-top-btn" onClick={scrollToTop}>
          ↑
        </button>
      )}

      {/* FOOTER */}
      <div className="footer">
        <div className="one">
          <img src={siteIcon} alt="siteImage" className="footer-site-icon" />
          <h4 className="text-center text-light">Fast Fruit Delivery</h4>
          <p>We provide excellent quality fruits with fast delivery.</p>
        </div>

        <div className="two">
          <h3 style={{ textAlign: "center" }}>Short links</h3>
          <ul className="footer-links" style={{ textAlign: "center" }}>
            <li><Link to="/aboutus" style={{ color: "white" }}>About Us</Link></li>
            <li><Link to="/contactus" style={{ color: "white" }}>Contact Us</Link></li>
            <li><Link to="/product" style={{ color: "white" }}>Products</Link></li>
          </ul>
        </div>

        <div className="three">
          <h3 style={{ textAlign: "center" }}>Address</h3>
          <p style={{ textAlign: "center" }}>
            Shop No.293, Basement, New.B.J. Market, Jalgaon
          </p>
        </div>
      </div>

      <p className="text-center">
        &copy; 2026 Lucky Maharashtra Nariyal Suppliers
      </p>
    </div>
  );
}

export default Footer;