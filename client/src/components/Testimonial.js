import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Testimonial.css";

const testimonialsData = [
  {
    id: 1,
    name: "Dr. Suresh Patil",
    role: "Physician & Regular Subscriber",
    location: "Civil Lines, Jalgaon",
    initials: "SP",
    stars: 5,
    date: "Yesterday",
    product: "🥥 Tender Green Coconuts",
    review:
      "We order tender green coconuts daily for our clinic and family. They are always sweet, water-heavy, and cleanly trimmed. Truly the freshest and most dependable supplier in Jalgaon!",
  },
  {
    id: 2,
    name: "Pooja Sharma",
    role: "Verified Home Buyer",
    location: "Ramanand Nagar, Jalgaon",
    initials: "PS",
    stars: 5,
    date: "2 days ago",
    product: "🍎 Kashmiri Apples & Pears",
    review:
      "The seasonal apples and pears were naturally sweet and crisp without any artificial wax or chemical smell. Prompt doorstep delivery arrived in under 45 minutes!",
  },
  {
    id: 3,
    name: "Irfan Khan",
    role: "F&B Manager, Grand Plaza",
    location: "Near B.J. Market, Jalgaon",
    initials: "IK",
    stars: 5,
    date: "4 days ago",
    product: "📦 Bulk Wholesale Supply",
    review:
      "Lucky Fruits is our trusted wholesale fruit partner for banquet events and catering. Excellent fruit grading, fair wholesale pricing, and guaranteed fresh morning deliveries.",
  },
  {
    id: 4,
    name: "Sneha Joshi",
    role: "Verified Shopper",
    location: "Navi Peth, Jalgaon",
    initials: "SJ",
    stars: 5,
    date: "1 week ago",
    product: "🧺 Festive Fruit Basket",
    review:
      "I ordered an assorted fruit hamper for a family pooja. The presentation was exquisite and every piece was pristine, ripe, and juicy. All our guests complimented the quality!",
  },
  {
    id: 5,
    name: "Rahul Deshmukh",
    role: "Corporate Professional",
    location: "MIDC Sector, Jalgaon",
    initials: "RD",
    stars: 5,
    date: "2 weeks ago",
    product: "🥭 Alphonso Mangoes & Papaya",
    review:
      "Ordering on this website is so smooth and convenient. Cash on delivery gives complete trust, and the quality is far superior to standard market stalls. Highly recommended!",
  },
  {
    id: 6,
    name: "Anita Choudhary",
    role: "Verified Homemaker",
    location: "Ring Road, Jalgaon",
    initials: "AC",
    stars: 5,
    date: "3 weeks ago",
    product: "🍊 Sweet Oranges & Pineapples",
    review:
      "The sweet oranges and pineapples were bursting with natural juice. The coconut malai is always fresh and tender. Lucky Fruits is now our permanent family fruit store!",
  },
];

function Testimonial() {
  const number = 9822516757;
  const whatsappFeedbackLink = `https://wa.me/${number}?text=Hi%20Lucky%20Fruits,%20I%20would%20like%20to%20share%20my%20review:`;

  return (
    <section className="lucky-testimonials-wrapper" aria-label="Customer Testimonials">
      <div className="lucky-testimonials-container">
        {/* Header Area */}
        <div className="lucky-testi-header">
          <div className="lucky-testi-badge">
            <i className="fa-solid fa-star"></i>
            <span>Real Customer Experiences</span>
          </div>

          <h2 className="lucky-testi-heading">
            Loved by Thousands Across <span className="text-emerald">Jalgaon</span>
          </h2>

          <p className="lucky-testi-subtitle">
            See what local families, juice centers, and hotels have to say about our 100% farm-fresh 
            fruits and tender green coconut delivery.
          </p>

          {/* Aggregate Rating Pill */}
          <div className="lucky-rating-strip">
            <div className="lucky-rating-stars-group">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <span className="lucky-rating-score">4.9 / 5.0</span>
            </div>
            <div className="lucky-rating-divider"></div>
            <span className="lucky-rating-count">
              Based on <strong>1,200+ Verified Orders</strong> in Jalgaon
            </span>
          </div>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          className="lucky-swiper-container"
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonialsData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="lucky-testi-card">
                <i className="fa-solid fa-quote-right lucky-quote-watermark"></i>

                {/* Top: Stars & Verified Badge */}
                <div className="lucky-card-top-bar">
                  <div className="lucky-stars-row">
                    {[...Array(item.stars)].map((_, i) => (
                      <i className="fa-solid fa-star" key={i}></i>
                    ))}
                  </div>

                  <span className="lucky-verified-badge">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>Verified Buyer</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="lucky-review-quote">
                  "{item.review}"
                </p>

                {/* Product Purchased Tag */}
                <div className="lucky-product-tag">
                  <span>{item.product}</span>
                </div>

                {/* Author Profile */}
                <div className="lucky-author-row">
                  <div className="lucky-author-avatar">
                    {item.initials}
                  </div>
                  <div className="lucky-author-info">
                    <h3 className="lucky-author-name">{item.name}</h3>
                    <span className="lucky-author-location">
                      {item.location} • {item.date}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Bottom Feedback Prompt Bar */}
        <div className="lucky-testi-footer-bar">
          <div className="lucky-testi-prompt-left">
            <div className="lucky-prompt-icon">
              <i className="fa-regular fa-comment-dots"></i>
            </div>
            <div className="lucky-prompt-text">
              <h4>Enjoyed your fresh fruits or coconuts?</h4>
              <p>Share your review with our team and get featured on our website!</p>
            </div>
          </div>

          <a
            href={whatsappFeedbackLink}
            target="_blank"
            rel="noopener noreferrer"
            className="lucky-whatsapp-review-btn"
          >
            <i className="fa-brands fa-whatsapp"></i>
            <span>Share Feedback on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
