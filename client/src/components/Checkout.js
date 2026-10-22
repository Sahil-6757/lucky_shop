import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const { setCount } = useContext(AuthContext);
  const [Items, setItems] = useState([]);
  const [result, setresult] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    time: new Date().toLocaleString(),
    email: "",
    mobile: "",
    address: "",
    city: "Jalgaon",
    postalCode: "425001",
    order: [],
    order_id: "",
    status: "Pending",
    payement_id: "Cash on Delivery",
    total: 0,
  });

  const getuserData = () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      if (userDetails) {
        setFormData((prev) => ({
          ...prev,
          name: userDetails.name || prev.name,
          email: userDetails.email || prev.email,
          mobile: userDetails.mobile || prev.mobile,
          address: userDetails.address || prev.address,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getData = () => {
    try {
      const stored = localStorage.getItem("Items");
      const itemsList = stored ? JSON.parse(stored) : [];
      setItems(Array.isArray(itemsList) ? itemsList : []);
      const totalAmount = (Array.isArray(itemsList) ? itemsList : []).reduce(
        (cur, item) => cur + (Number(item.rate) || 0) * (Number(item.count) || 1),
        0
      );
      setresult(totalAmount);
    } catch (err) {
      console.error(err);
      setItems([]);
      setresult(0);
    }
  };

  useEffect(() => {
    getData();
    getuserData();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      order: Items,
      total: result,
    }));
  }, [Items, result]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Name validation: letters and spaces only
    if (name === "name") {
      newValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    // Mobile validation: digits only, max 10
    if (name === "mobile") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Email formatting: lowercase
    if (name === "email") {
      newValue = value.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      order: Items,
      total: result,
    }));
  };

  const handleOrder = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // Gmail validation
    if (!gmailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid Gmail address (@gmail.com)", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    // Required fields validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !formData.mobile.trim()
    ) {
      toast.error("Please complete all delivery information", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    if (formData.mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    if (Items.length === 0) {
      toast.error("Your cart is empty", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      time: new Date().toLocaleString(),
      order: Items,
      total: result,
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/order`, payload)
      .then((resp) => {
        setLoading(false);
        if (resp.data.message === "success") {
          toast.success("Order Placed Successfully! 🎉", {
            position: "bottom-center",
            autoClose: 1500,
          });

          localStorage.setItem("Items", "[]");
          setCount(0);

          localStorage.setItem(
            "userDetails",
            JSON.stringify({
              name: formData.name,
              email: formData.email,
              mobile: formData.mobile,
              address: formData.address,
            })
          );

          // WhatsApp dispatch message
          const orderDetails = `🛒 *New Order from Lucky Fruits*
👤 *Customer:* ${formData.name}
📞 *Mobile:* ${formData.mobile}
📍 *Address:* ${formData.address}, ${formData.city} (${formData.postalCode})
📦 *Items:* ${Items.map((item) => `${item.name} (${item.rate} x ${item.count})`).join(", ")}
🔢 *Total Items:* ${Items.reduce((total, item) => total + (Number(item.count) || 1), 0)}
💰 *Total Payable:* ₹${result} (Cash on Delivery)
⏰ *Order Time:* ${new Date().toLocaleString()}

*Note:* Orders within 2km get free delivery. Same-day local dispatch in Jalgaon!`;

          const url = `https://wa.me/918983306757?text=${encodeURIComponent(orderDetails)}`;
          window.open(url, "_blank");

          navigation("/profile");
        } else {
          toast.error("Could not place order. Please try again.", {
            position: "bottom-center",
            autoClose: 1500,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Order error:", error);
        toast.error("Server connection issue. Please contact us on WhatsApp.", {
          position: "bottom-center",
          autoClose: 1500,
        });
      });
  };

  const totalQuantity = Items.reduce(
    (acc, it) => acc + (Number(it.count) || 1),
    0
  );

  return (
    <div className="lucky-checkout-page">
      <div className="lucky-checkout-container">
        {/* Breadcrumb & Title */}
        <div className="lucky-checkout-header">
          <div className="lucky-checkout-breadcrumbs">
            <Link to="/">Home</Link>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.7rem" }}></i>
            <Link to="/cart">Shopping Cart</Link>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.7rem" }}></i>
            <span>Secure Checkout</span>
          </div>

          <div className="lucky-checkout-title-row">
            <h1 className="lucky-checkout-heading">
              <i className="fa-solid fa-shield-check" style={{ color: "#10b981" }}></i>
              Finalize Your Order
            </h1>
            <div className="lucky-security-pill">
              <i className="fa-solid fa-lock"></i>
              <span>256-Bit Encrypted & Safe</span>
            </div>
          </div>
        </div>

        {/* Empty Cart Guard */}
        {Items.length === 0 ? (
          <div className="lucky-checkout-empty-state">
            <div className="lucky-checkout-empty-icon">
              <i className="fa-solid fa-basket-shopping"></i>
            </div>
            <h2 className="lucky-checkout-empty-title">No Items in Your Cart</h2>
            <p className="lucky-checkout-empty-desc">
              You must have items in your basket to proceed with checkout. Explore our fresh fruits or coconuts!
            </p>
            <Link to="/product" className="lucky-return-cart-btn">
              <i className="fa-solid fa-apple-whole"></i>
              <span>Explore Fresh Fruits</span>
            </Link>
          </div>
        ) : (
          /* Main 2-Column Checkout Grid */
          <div className="lucky-checkout-grid">
            {/* Left: Customer Information & Delivery Address */}
            <div className="lucky-checkout-left-col">
              {/* Delivery Address Card */}
              <div className="lucky-checkout-card">
                <h2 className="lucky-card-section-title">
                  <i className="fa-solid fa-truck-ramp-box"></i>
                  <span>1. Delivery & Contact Details</span>
                </h2>

                <div className="lucky-form-grid">
                  {/* Full Name */}
                  <div className="lucky-co-form-group">
                    <label htmlFor="co-name" className="lucky-co-label">
                      <span>Full Name<span className="req">*</span></span>
                      <span className="hint">Letters only</span>
                    </label>
                    <div className="lucky-co-input-wrapper">
                      <i className="fa-solid fa-user lucky-co-input-icon"></i>
                      <input
                        id="co-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Patil"
                        className="lucky-co-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile No */}
                  <div className="lucky-co-form-group">
                    <label htmlFor="co-mobile" className="lucky-co-label">
                      <span>Mobile Number<span className="req">*</span></span>
                      <span className="hint">{formData.mobile.length}/10 digits</span>
                    </label>
                    <div className="lucky-co-input-wrapper">
                      <i className="fa-solid fa-phone lucky-co-input-icon"></i>
                      <input
                        id="co-mobile"
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="e.g. 9822516757"
                        maxLength="10"
                        className="lucky-co-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="lucky-co-form-group span-2">
                    <label htmlFor="co-email" className="lucky-co-label">
                      <span>Gmail Address<span className="req">*</span></span>
                      <span className="hint">Must end with @gmail.com</span>
                    </label>
                    <div className="lucky-co-input-wrapper">
                      <i className="fa-solid fa-envelope lucky-co-input-icon"></i>
                      <input
                        id="co-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="yourname@gmail.com"
                        className="lucky-co-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="lucky-co-form-group span-2">
                    <label htmlFor="co-address" className="lucky-co-label">
                      <span>Complete Delivery Address<span className="req">*</span></span>
                      <span className="hint">House/Flat No, Landmark, Area</span>
                    </label>
                    <div className="lucky-co-input-wrapper">
                      <i className="fa-solid fa-location-dot lucky-co-input-icon"></i>
                      <input
                        id="co-address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="e.g. Flat 302, Sai Residency, Near B.J. Market"
                        className="lucky-co-input"
                        required
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="lucky-co-form-group">
                    <label htmlFor="co-city" className="lucky-co-label">
                      <span>City</span>
                    </label>
                    <div className="lucky-co-input-wrapper">
                      <i className="fa-solid fa-city lucky-co-input-icon"></i>
                      <input
                        id="co-city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="lucky-co-input"
                      />
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div className="lucky-co-form-group">
                    <label htmlFor="co-postal" className="lucky-co-label">
                      <span>Postal Pin Code</span>
                    </label>
                    <div className="lucky-co-input-wrapper">
                      <i className="fa-solid fa-map-pin lucky-co-input-icon"></i>
                      <input
                        id="co-postal"
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="lucky-co-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="lucky-checkout-card">
                <h2 className="lucky-card-section-title">
                  <i className="fa-solid fa-wallet"></i>
                  <span>2. Payment Option</span>
                </h2>

                <div className="lucky-payment-option-card">
                  <div className="lucky-payment-left">
                    <div className="lucky-payment-icon">
                      <i className="fa-solid fa-hand-holding-dollar"></i>
                    </div>
                    <div className="lucky-payment-info">
                      <h4>Cash on Delivery (COD)</h4>
                      <p>Pay with cash or UPI directly when your fruits arrive</p>
                    </div>
                  </div>
                  <div className="lucky-payment-checked">
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                </div>

                <div className="lucky-delivery-notice">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>
                    <strong>Delivery Policy:</strong> Free delivery within 2km of our Jalgaon depot. 
                    For extended distances, minor delivery rates may apply. Our dispatch executive will coordinate with you.
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Order Review & Placement Sidebar */}
            <aside className="lucky-checkout-sidebar">
              <div className="lucky-order-review-card">
                <h2 className="lucky-card-section-title">
                  <i className="fa-solid fa-basket-shopping"></i>
                  <span>Order Review ({totalQuantity} items)</span>
                </h2>

                {/* Items List */}
                <div className="lucky-review-items-list">
                  {Items.map((itemRow, index) => (
                    <div className="lucky-review-item" key={index}>
                      <div className="lucky-review-item-left">
                        <img
                          src={itemRow.image}
                          alt={itemRow.name || "Product"}
                          className="lucky-review-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&auto=format&fit=crop&q=60";
                          }}
                        />
                        <div>
                          <h4 className="lucky-review-item-name">{itemRow.name}</h4>
                          <p className="lucky-review-item-qty">
                            ₹{itemRow.rate} × {itemRow.count}
                          </p>
                        </div>
                      </div>

                      <div className="lucky-review-item-total">
                        ₹{(Number(itemRow.rate) || 0) * (Number(itemRow.count) || 1)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Breakdown */}
                <div className="lucky-co-cost-rows">
                  <div className="lucky-co-cost-row">
                    <span>Items Subtotal</span>
                    <span>₹ {result}</span>
                  </div>

                  <div className="lucky-co-cost-row">
                    <span>Doorstep Delivery</span>
                    <span className="badge-free">FREE (&lt;2km)</span>
                  </div>

                  <div className="lucky-co-cost-row">
                    <span>Eco Fruit Packaging</span>
                    <span className="badge-free">FREE</span>
                  </div>

                  <div className="lucky-co-total-row">
                    <span className="lucky-co-total-label">Total Payable</span>
                    <span className="lucky-co-total-price">₹ {result}</span>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button
                  type="button"
                  className="lucky-place-order-cta-btn"
                  disabled={loading || Items.length === 0}
                  onClick={handleOrder}
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-bag-shopping"></i>
                      <span>Confirm & Place Order</span>
                    </>
                  )}
                </button>

                {/* WhatsApp Dispatch Notice */}
                <div className="lucky-whatsapp-dispatch-info">
                  <i className="fa-brands fa-whatsapp"></i>
                  <span>Instant order confirmation via WhatsApp</span>
                </div>

                {/* Trust Badges */}
                <div className="lucky-checkout-trust-box">
                  <div className="lucky-trust-badge-item">
                    <i className="fa-solid fa-shield-heart"></i>
                    <span>100% Quality & Freshness Guarantee</span>
                  </div>
                  <div className="lucky-trust-badge-item">
                    <i className="fa-solid fa-truck-fast"></i>
                    <span>Prompt same-day delivery in Jalgaon</span>
                  </div>
                  <div className="lucky-trust-badge-item">
                    <i className="fa-solid fa-handshake-simple"></i>
                    <span>Zero risk • Pay cash or UPI on delivery</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
