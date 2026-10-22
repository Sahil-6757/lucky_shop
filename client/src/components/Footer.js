import { useState, useEffect } from "react";
import "../App.css";
import siteIcon from "../assets/siteIcon.jpg";
import { Link, useLocation } from "react-router-dom";

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

  const location = useLocation();
  const isDashboard = location.pathname.toLowerCase().startsWith("/dashboard");

  const number = 9822516757;
  const whatsappLink = `https://wa.me/${number}`;

  return (
    <div>
      <div className="container">
        {/* ABOUT + MAP */}
       

        {/* ⭐ TESTIMONIAL SWIPER */}
        <div className="my-5">
          <h3 className="text-center text-success mb-4">Customer Reviews</h3>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            className="swiper"
            pagination={{ clickable: true, bulletClass: "swiper-pagination-bullet", bulletActiveClass: "swiper-pagination-bullet-active" }}
            loop={true}
            autoplay={{ delay: 2500 }}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
          >
            <SwiperSlide>
              <div className="review-card card w-auto">
                <div className="stars">★★★★★</div>
                <p className="date-time">2 day ago</p>
                <p className="description">
                  Fresh fruits quality is amazing. Highly recommended!
                </p>
                <div className="author">— John Doe</div>
              </div>
            </SwiperSlide>

             <SwiperSlide>
              <div className="review-card card w-auto">
                <div className="stars">★★★★★</div>
                <p className="date-time">2 day ago</p>
                <p className="description">
                  Fresh fruits quality is amazing. Highly recommended!
                </p>
                <div className="author">— John Doe</div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="review-card card w-auto">
                <div className="stars">★★★★★</div>
                <p className="date-time">3 day ago</p>
                <p className="description">
                  Fast delivery and great service. Loved it!
                </p>
                <div className="author">— Rahul</div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="review-card card  w-auto">
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

      {!isDashboard && (
        <a
          href={whatsappLink}
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-whatsapp"></i>
        </a>
      )}

      {/* 🔝 SCROLL BUTTON */}
      {showBtn && !isDashboard && (
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
          <p>Available 9:00 AM - 9:00 PM only in Jalgaon.</p>
        </div>

        <div className="two">
          <h3 style={{ textAlign: "center" }}>Short links</h3>
          <ul className="footer-links" style={{ textAlign: "center" }}>
            <li onClick={scrollToTop}>
              <Link to="/aboutus" className="subLinks" style={{ color: "white",textDecoration:"none" }}>
                About Us
              </Link>
            </li>
            <li onClick={scrollToTop}>
              <Link to="/contactus" className="subLinks" style={{ color: "white",textDecoration:"none" }}>
                Contact Us
              </Link>
            </li>
            <li onClick={scrollToTop}>
              <Link to="/product" className="subLinks" style={{ color: "white",textDecoration:"none" }}>
                Products
              </Link>
            </li>
          </ul>
        </div>

        <div className="three">
          <h3 >Address</h3>
          <h5>Lucky Maharashtra Nariyal Suppliers</h5>
          <p >
            Shop No.293, Basement, New.B.J. Market, Jalgaon
          </p>
        </div>
      </div>

     <b>
      <p className="text-center">
        &copy; 2026 Lucky Maharashtra Nariyal Suppliers
      </p></b> 
    </div>
  );
}

export default Footer;
