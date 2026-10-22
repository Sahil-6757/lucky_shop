import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Contactus.css";

function Contactus() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile validation: numbers only, max 10 digits
    if (name === "mobile") {
      if (!/^\d*$/.test(value) || value.length > 10) {
        return;
      }
    }

    // Name validation: letters and spaces only
    if (name === "name") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      message: "",
    });
  };

  useEffect(() => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (userDetails) {
        setFormData((prev) => ({
          ...prev,
          name: userDetails.name || prev.name,
          email: userDetails.email || prev.email,
          mobile: userDetails.mobile || prev.mobile,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const submit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.warn("Please fill in all required fields", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    // Strict Gmail check
    const email = formData.email.toLowerCase().trim();
    if (!email.endsWith("@gmail.com")) {
      toast.error("Please enter a valid Gmail address (@gmail.com)", {
        position: "bottom-center",
        autoClose: 1800,
      });
      return;
    }

    if (formData.message.trim().length < 25) {
      toast.error("Message must be at least 25 characters long", {
        position: "bottom-center",
        autoClose: 1800,
      });
      return;
    }

    if (formData.mobile && formData.mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number", {
        position: "bottom-center",
        autoClose: 1800,
      });
      return;
    }

    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_API_URL}/contact`, formData)
      .then((resp) => {
        setLoading(false);
        if (resp.data.message) {
          toast.success("Thank you! Your message has been sent ✅", {
            autoClose: 1500,
            position: "bottom-center",
          });
          clearForm();
        } else {
          toast.error("Could not send message. Please verify your details.", {
            position: "bottom-center",
            autoClose: 1500,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Contact submit error:", error);
        toast.error("Server connection issue. Please try again or call us directly.", {
          position: "bottom-center",
          autoClose: 1800,
        });
      });
  };

  const messageLength = formData.message.trim().length;

  return (
    <div className="lucky-contact-page">
      <div className="lucky-contact-container">
        {/* Hero Header */}
        <header className="lucky-contact-hero">
          <div className="lucky-contact-badge">
            <i className="fa-solid fa-headset"></i>
            <span>We're Here For You</span>
          </div>

          <h1 className="lucky-contact-title">
            Get in Touch with <br />
            <span className="text-emerald">Lucky Fruits</span>
          </h1>

          <p className="lucky-contact-subtitle">
            Whether you need daily coconut delivery, bulk fruits for events, or have questions 
            about our harvest, our Jalgaon team is just a call or message away.
          </p>
        </header>

        {/* Quick Contact Channels Strip */}
        <section className="lucky-channels-grid" aria-label="Quick Contact Channels">
          <a href="tel:9822516757" className="lucky-channel-card">
            <div className="lucky-channel-icon phone">
              <i className="fa-solid fa-phone"></i>
            </div>
            <h3 className="lucky-channel-title">Direct Call</h3>
            <p className="lucky-channel-detail">+91 9822516757</p>
            <span className="lucky-channel-action">Call Now →</span>
          </a>

          <a
            href="https://wa.me/919822516757?text=Hi%20Lucky%20Fruits,%20I%20have%20an%20inquiry:"
            target="_blank"
            rel="noopener noreferrer"
            className="lucky-channel-card"
          >
            <div className="lucky-channel-icon whatsapp">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <h3 className="lucky-channel-title">WhatsApp Chat</h3>
            <p className="lucky-channel-detail">+91 9822516757</p>
            <span className="lucky-channel-action">Chat Live →</span>
          </a>

          <a href="mailto:luckyfruitsjalgaon@gmail.com" className="lucky-channel-card">
            <div className="lucky-channel-icon email">
              <i className="fa-solid fa-envelope"></i>
            </div>
            <h3 className="lucky-channel-title">Email Us</h3>
            <p className="lucky-channel-detail">luckyfruitsjalgaon@gmail.com</p>
            <span className="lucky-channel-action">Send Email →</span>
          </a>

          <a
            href="https://maps.google.com/?q=Lucky+Maharashtra+Nariyal+Suppliers+Jalgaon"
            target="_blank"
            rel="noopener noreferrer"
            className="lucky-channel-card"
          >
            <div className="lucky-channel-icon location">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <h3 className="lucky-channel-title">Wholesale Depot</h3>
            <p className="lucky-channel-detail">New B.J. Market, Jalgaon</p>
            <span className="lucky-channel-action">Get Directions →</span>
          </a>
        </section>

        {/* Main Content: Store Details (Left) + Contact Form (Right) */}
        <div className="lucky-contact-main-grid">
          {/* Store Info Card */}
          <aside className="lucky-store-info-card">
            <div className="lucky-store-header-group">
              <h2 className="lucky-store-title">Lucky Maharashtra Nariyal Suppliers</h2>
              <p className="lucky-store-desc">
                Your premier fruit wholesale & retail distributor in Jalgaon. Offering hand-picked 
                coconuts, mangoes, apples, and seasonal harvests with dependable delivery.
              </p>
            </div>

            <div className="lucky-store-feature-list">
              <div className="lucky-store-feature-item">
                <div className="lucky-store-feature-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div className="lucky-store-feature-text">
                  <h5>Store & Depot Address</h5>
                  <p>Shop No. 293, Basement, New B.J. Market, Jalgaon, Maharashtra 425001</p>
                </div>
              </div>

              <div className="lucky-store-feature-item">
                <div className="lucky-store-feature-icon">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <div className="lucky-store-feature-text">
                  <h5>Fast Local Delivery</h5>
                  <p>Same-day doorstep delivery available across all areas of Jalgaon city.</p>
                </div>
              </div>

              <div className="lucky-store-feature-item">
                <div className="lucky-store-feature-icon">
                  <i className="fa-solid fa-boxes-stacked"></i>
                </div>
                <div className="lucky-store-feature-text">
                  <h5>Wholesale & Event Inquiries</h5>
                  <p>Bulk orders welcomed for weddings, functions, and commercial catering.</p>
                </div>
              </div>
            </div>

            <div className="lucky-store-hours-badge">
              <i className="fa-regular fa-clock"></i>
              <span>Available 9:00 AM – 9:00 PM (All 7 Days)</span>
            </div>
          </aside>

          {/* Contact Form Card */}
          <section className="lucky-contact-form-card">
            <h2 className="lucky-form-heading">Send Us a Message</h2>
            <p className="lucky-form-subheading">
              Fill out the form below and our team will get back to you promptly.
            </p>

            <form onSubmit={submit} className="lucky-form">
              {/* Name Field */}
              <div className="lucky-form-group">
                <label htmlFor="contact-name" className="lucky-form-label">
                  <span>Full Name<span className="req">*</span></span>
                  <span className="hint">Letters only</span>
                </label>
                <div className="lucky-input-wrapper">
                  <i className="fa-solid fa-user lucky-input-icon"></i>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="e.g. Ramesh Patil"
                    value={formData.name}
                    onChange={handleChange}
                    className="lucky-form-input"
                    required
                  />
                </div>
              </div>

              {/* Mobile Field */}
              <div className="lucky-form-group">
                <label htmlFor="contact-mobile" className="lucky-form-label">
                  <span>Mobile Number</span>
                  <span className="hint">{formData.mobile.length}/10 digits</span>
                </label>
                <div className="lucky-input-wrapper">
                  <i className="fa-solid fa-phone lucky-input-icon"></i>
                  <input
                    id="contact-mobile"
                    type="tel"
                    name="mobile"
                    placeholder="e.g. 9822516757"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength="10"
                    className="lucky-form-input"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="lucky-form-group">
                <label htmlFor="contact-email" className="lucky-form-label">
                  <span>Email Address<span className="req">*</span></span>
                  <span className="hint">Gmail only (@gmail.com)</span>
                </label>
                <div className="lucky-input-wrapper">
                  <i className="fa-solid fa-envelope lucky-input-icon"></i>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="yourname@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="lucky-form-input"
                    required
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="lucky-form-group">
                <label htmlFor="contact-message" className="lucky-form-label">
                  <span>Your Message<span className="req">*</span></span>
                  <span className={`lucky-char-counter ${messageLength >= 25 ? "valid" : ""}`}>
                    {messageLength}/25 characters min
                  </span>
                </label>
                <div className="lucky-input-wrapper">
                  <i className="fa-solid fa-comment-dots lucky-textarea-icon"></i>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Write your question, wholesale inquiry, or delivery request here..."
                    value={formData.message}
                    onChange={handleChange}
                    className="lucky-form-textarea"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="lucky-form-submit-btn"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-paper-plane"></i>
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </div>

        {/* Map Section */}
        <section className="lucky-map-section" aria-label="Store Location Map">
          <div className="lucky-map-header">
            <div className="lucky-map-header-text">
              <h3>Visit Our Jalgaon Depot</h3>
              <p>Shop No. 293, Basement, New B.J. Market, Jalgaon, Maharashtra</p>
            </div>
            <a
              href="https://www.google.com/maps/place/Lucky+Maharashtra+Nariyal+Suppliers/@21.010515,75.566218,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="lucky-get-directions-btn"
            >
              <i className="fa-solid fa-diamond-turn-right"></i>
              <span>Get Directions</span>
            </a>
          </div>

          <div className="lucky-map-frame-box">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.553823638174!2d75.56621797400855!3d21.010514988407337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90fa67a280937%3A0x110c4a0c9002729e!2sLucky%20Maharashtra%20Nariyal%20Suppliers!5e0!3m2!1sen!2sin!4v1708224901113!5m2!1sen!2sin"
              className="lucky-map-iframe"
              title="Lucky Maharashtra Nariyal Suppliers Location"
              loading="lazy"
              allowFullScreen=""
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contactus;
