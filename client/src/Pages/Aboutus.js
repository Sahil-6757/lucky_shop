import { Link } from "react-router-dom";
import "./Aboutus.css";
import FruitsImage from "../assets/FruitsImage.png";
import Coconut from "../assets/Coconut.png";
import siteIcon from "../assets/siteIcon.jpg";
import Boss from "../assets/Boss.jpeg";
import Bosspic from "../assets/Bosspic.jpeg";
import pineapple from "../assets/pineapple.webp";

function Aboutus() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="lucky-about-page">
      <div className="lucky-about-container">
        {/* Hero Header */}
        <header className="lucky-about-hero">
          <div className="lucky-hero-badge">
            <i className="fa-solid fa-leaf"></i>
            <span>Our Heritage & Passion</span>
          </div>

          <h1 className="lucky-hero-title">
            Cultivating Freshness, <br />
            <span className="highlight-text">Delivering Natural Wellness</span>
          </h1>

          <p className="lucky-hero-subtitle">
            Welcome to <strong>Lucky Maharashtra Nariyal & Fruit Suppliers</strong>. 
            For over a decade, we have been Jalgaon's most reliable provider of pure green coconuts, 
            exotic seasonal fruits, and wholesale produce straight from nature's lap to your doorstep.
          </p>
        </header>

        {/* Key Metrics / Stats Strip */}
        <section className="lucky-stats-strip" aria-label="Company Statistics">
          <div className="lucky-stat-card">
            <div className="lucky-stat-number">15+</div>
            <p className="lucky-stat-label">Years of Fruit Heritage</p>
          </div>
          <div className="lucky-stat-card">
            <div className="lucky-stat-number">10K+</div>
            <p className="lucky-stat-label">Satisfied Customers</p>
          </div>
          <div className="lucky-stat-card">
            <div className="lucky-stat-number">100%</div>
            <p className="lucky-stat-label">Naturally Ripened</p>
          </div>
          <div className="lucky-stat-card">
            <div className="lucky-stat-number">50+</div>
            <p className="lucky-stat-label">Fresh Fruit Varieties</p>
          </div>
        </section>

        {/* Storytelling Rows */}
        <section className="lucky-story-section">
          {/* Row 1: Who We Are */}
          <div className="lucky-story-row">
            <div className="lucky-story-img-wrapper">
              <img src={FruitsImage} alt="Assorted Fresh Fruits" className="lucky-story-img" />
            </div>
            <div className="lucky-story-content">
              <div className="lucky-section-pill">
                <i className="fa-solid fa-seedling"></i>
                <span>Who We Are</span>
              </div>
              <h2 className="lucky-story-heading">Dedicated to Nature's Purest Harvest</h2>
              <p className="lucky-story-text">
                At <strong>LuckyFruits</strong>, we believe food should be as close to nature as possible. 
                We partner with responsible farmers across Maharashtra and India to bring hand-picked, 
                chemical-free, and nutrient-dense fruits directly into your home.
              </p>
              <p className="lucky-story-text">
                Whether you need refreshing green coconuts for daily hydration, crisp apples, sweet mangoes, 
                or bulk wholesale delivery for festivities, we ensure unmatched purity and taste.
              </p>
            </div>
          </div>

          {/* Row 2: Our Vision (Reversed) */}
          <div className="lucky-story-row reverse">
            <div className="lucky-story-img-wrapper">
              <img src={Coconut} alt="Green Tender Coconut" className="lucky-story-img" />
            </div>
            <div className="lucky-story-content">
              <div className="lucky-section-pill">
                <i className="fa-solid fa-eye"></i>
                <span>Our Vision</span>
              </div>
              <h2 className="lucky-story-heading">Empowering Healthy Lifestyles Across Jalgaon</h2>
              <p className="lucky-story-text">
                Our vision is to make premium, farm-fresh fruit accessible, affordable, and convenient 
                for every family. We envision a society that chooses clean, vitamin-rich natural foods 
                over processed snacks.
              </p>
              <ul className="lucky-feature-checklist">
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>Zero harmful chemical ripening agents</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>Sustainably sourced from local and certified orchards</span>
                </li>
                <li>
                  <i className="fa-solid fa-check"></i>
                  <span>Same-day doorstep delivery to preserve natural freshness</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 3: What We Offer */}
          <div className="lucky-story-row">
            <div className="lucky-story-img-wrapper">
              <img src={pineapple} alt="Fresh Pineapple & Tropical Fruits" className="lucky-story-img" />
            </div>
            <div className="lucky-story-content">
              <div className="lucky-section-pill">
                <i className="fa-solid fa-boxes-stacked"></i>
                <span>What We Offer</span>
              </div>
              <h2 className="lucky-story-heading">Comprehensive Fruit Solutions For All</h2>
              <p className="lucky-story-text">
                From individual household orders to massive wedding banquets and wholesale distribution, 
                we cater to all your fruit needs with prompt service and care:
              </p>
              <ul className="lucky-feature-checklist">
                <li>
                  <i className="fa-solid fa-apple-whole"></i>
                  <span>Fresh, seasonal, and exotic hand-sorted fruits</span>
                </li>
                <li>
                  <i className="fa-solid fa-bottle-water"></i>
                  <span>Tender Maharashtra green coconuts with rich water & malai</span>
                </li>
                <li>
                  <i className="fa-solid fa-truck-ramp-box"></i>
                  <span>Wholesale bulk supply for vendors, hotels, and banquets</span>
                </li>
                <li>
                  <i className="fa-solid fa-heart-pulse"></i>
                  <span>Nutritional insights, fruit storage guides, and diet tips</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 4: Our Story (Reversed) */}
          <div className="lucky-story-row reverse">
            <div className="lucky-story-img-wrapper">
              <img src={siteIcon} alt="Lucky Fruits Heritage Logo" className="lucky-story-img" />
            </div>
            <div className="lucky-story-content">
              <div className="lucky-section-pill">
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>Our Story</span>
              </div>
              <h2 className="lucky-story-heading">Built on Honesty, Passion, and Community</h2>
              <p className="lucky-story-text">
                What began as a small wholesale coconut trading stand in Jalgaon has blossomed into 
                one of the region’s premier fruit purveyors. Our growth has been powered by one 
                uncompromising promise: <strong>never compromise on the freshness and quality given to our customers</strong>.
              </p>
              <p className="lucky-story-text">
                Today, Lucky Fruits blends traditional agricultural expertise with modern online convenience, 
                allowing you to order with a click and receive the best harvest of the season.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="lucky-values-section">
          <div className="lucky-values-header">
            <div className="lucky-section-pill">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Why Choose Us</span>
            </div>
            <h2 className="lucky-values-heading">The Lucky Fruits Quality Guarantee</h2>
            <p className="lucky-hero-subtitle" style={{ fontSize: "1rem" }}>
              Every fruit you receive goes through stringent quality checks before arriving at your table.
            </p>
          </div>

          <div className="lucky-values-grid">
            <div className="lucky-value-card">
              <div className="lucky-value-icon">
                <i className="fa-solid fa-seedling"></i>
              </div>
              <h3 className="lucky-value-title">Direct Farm Sourcing</h3>
              <p className="lucky-value-desc">
                Harvested from certified growers, reducing middleman delays and maintaining true orchard flavor.
              </p>
            </div>

            <div className="lucky-value-card">
              <div className="lucky-value-icon">
                <i className="fa-solid fa-shield-heart"></i>
              </div>
              <h3 className="lucky-value-title">Pure & Natural</h3>
              <p className="lucky-value-desc">
                No harmful artificial ripening chemicals or carbide — only 100% wholesome nature.
              </p>
            </div>

            <div className="lucky-value-card">
              <div className="lucky-value-icon">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <h3 className="lucky-value-title">Fast Doorstep Delivery</h3>
              <p className="lucky-value-desc">
                Prompt local delivery across Jalgaon ensures crispness, aroma, and zero transit damage.
              </p>
            </div>

            <div className="lucky-value-card">
              <div className="lucky-value-icon">
                <i className="fa-solid fa-handshake"></i>
              </div>
              <h3 className="lucky-value-title">Honest Pricing</h3>
              <p className="lucky-value-desc">
                Fair rates for both daily household buyers and large-scale commercial wholesale partners.
              </p>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="lucky-leadership-section">
          <div className="lucky-leadership-header">
            <div className="lucky-section-pill">
              <i className="fa-solid fa-user-tie"></i>
              <span>Our Leadership</span>
            </div>
            <h2 className="lucky-leadership-heading">Meet Our Directors</h2>
            <p className="lucky-hero-subtitle" style={{ fontSize: "1rem" }}>
              The dedicated pioneers steering Lucky Maharashtra Nariyal Suppliers with decades of agricultural experience.
            </p>
          </div>

          <div className="lucky-directors-grid">
            {/* Director 1 */}
            <div className="lucky-director-card">
              <div className="lucky-director-image-wrap">
                <img src={Boss} alt="Javed Pathan - Director" className="lucky-director-image" />
                <span className="lucky-director-badge">Founder & Director</span>
              </div>
              <div className="lucky-director-body">
                <h3 className="lucky-director-name">Javed Pathan</h3>
                <span className="lucky-director-role">Founder & Managing Director</span>
                <p className="lucky-director-bio">
                  A visionary entrepreneur with over 15 years in agricultural supply chains. Javed oversees farm partnerships, 
                  product sourcing standards, and strategic growth across Maharashtra.
                </p>
                <div className="lucky-director-contact-strip">
                  <a href="tel:9822516757" className="lucky-contact-btn call">
                    <i className="fa-solid fa-phone"></i>
                    <span>9822516757</span>
                  </a>
                  <a
                    href="https://wa.me/919822516757"
                    target="_blank"
                    rel="noreferrer"
                    className="lucky-contact-btn whatsapp"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Director 2 */}
            <div className="lucky-director-card">
              <div className="lucky-director-image-wrap">
                <img src={Bosspic} alt="Amjad Pathan - Director" className="lucky-director-image" />
                <span className="lucky-director-badge">Co-Founder & Director</span>
              </div>
              <div className="lucky-director-body">
                <h3 className="lucky-director-name">Amjad Pathan</h3>
                <span className="lucky-director-role">Co-Founder & Operations Director</span>
                <p className="lucky-director-bio">
                  The operational backbone of our company, Amjad spearheads customer satisfaction, wholesale logistics, 
                  and quality assurance to ensure every order is dispatched at peak freshness.
                </p>
                <div className="lucky-director-contact-strip">
                  <a href="tel:9822416757" className="lucky-contact-btn call">
                    <i className="fa-solid fa-phone"></i>
                    <span>9822416757</span>
                  </a>
                  <a
                    href="https://wa.me/919822416757"
                    target="_blank"
                    rel="noreferrer"
                    className="lucky-contact-btn whatsapp"
                  >
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="lucky-about-cta-banner">
          <h2 className="lucky-cta-title">
            Taste the Purest Harvest in Jalgaon
          </h2>
          <p className="lucky-cta-desc">
            Explore our daily collection of fresh tender coconuts, seasonal apples, papayas, and more. 
            Enjoy seamless ordering and fast doorstep delivery.
          </p>
          <div className="lucky-cta-buttons">
            <Link to="/product" className="lucky-cta-primary-btn" onClick={scrollTop}>
              <i className="fa-solid fa-apple-whole"></i>
              <span>Explore Fresh Fruits</span>
            </Link>
            <Link to="/contactus" className="lucky-cta-secondary-btn" onClick={scrollTop}>
              <i className="fa-solid fa-envelope"></i>
              <span>Contact Our Team</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Aboutus;
