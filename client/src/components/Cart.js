import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./Cart.css";

function Cart() {
  const [Items, setItems] = useState([]);
  const { setCount } = useContext(AuthContext);

  async function getData() {
    try {
      const stored = localStorage.getItem("Items");
      const item = stored ? JSON.parse(stored) : [];
      setItems(Array.isArray(item) ? item : []);
      if (Array.isArray(item)) {
        setCount(item.length);
      }
    } catch (e) {
      console.error(e);
      setItems([]);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const removeBtn = (index) => {
    const itemName = Items[index]?.name || "item";
    const confirmed = window.confirm(`Are you sure you want to remove ${itemName} from your cart?`);
    if (!confirmed) {
      return;
    }
    if (navigator.vibrate) {
      navigator.vibrate(80);
    }

    const newItems = Items.filter((_, i) => i !== index);
    localStorage.setItem("Items", JSON.stringify(newItems));
    setItems(newItems);
    setCount(newItems.length);

    toast.info(`${itemName} removed from cart`, {
      position: "bottom-center",
      autoClose: 1200,
    });
  };

  const clearCart = () => {
    if (!Items || Items.length === 0) return;
    const confirmed = window.confirm("Are you sure you want to clear your entire cart?");
    if (!confirmed) return;

    localStorage.setItem("Items", JSON.stringify([]));
    setItems([]);
    setCount(0);

    toast.info("Your cart has been cleared", {
      position: "bottom-center",
      autoClose: 1200,
    });
  };

  const handleDecrement = (index) => {
    const newItems = [...Items];
    if (newItems[index].count > 1) {
      newItems[index].count -= 1;
      localStorage.setItem("Items", JSON.stringify(newItems));
      setItems(newItems);
    } else {
      removeBtn(index);
    }
  };

  const handleIncrement = (index) => {
    const newItems = [...Items];
    newItems[index].count += 1;
    localStorage.setItem("Items", JSON.stringify(newItems));
    setItems(newItems);
  };

  const subtotal =
    Items && Items.length > 0
      ? Items.reduce((acc, item) => acc + (Number(item.rate) || 0) * (Number(item.count) || 1), 0)
      : 0;

  const totalUnits =
    Items && Items.length > 0
      ? Items.reduce((acc, item) => acc + (Number(item.count) || 1), 0)
      : 0;

  return (
    <div className="lucky-cart-page">
      <div className="lucky-cart-container">
        {/* Breadcrumb & Header */}
        <div className="lucky-cart-header">
          <div className="lucky-cart-breadcrumbs">
            <Link to="/" onClick={scrollTop}>
              Home
            </Link>
            <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.7rem" }}></i>
            <span>Shopping Cart</span>
          </div>

          <div className="lucky-cart-title-row">
            <h1 className="lucky-cart-heading">
              <i className="fa-solid fa-basket-shopping" style={{ color: "#10b981" }}></i>
              Your Cart
              {Items && Items.length > 0 && (
                <span className="lucky-cart-count-badge">
                  {Items.length} {Items.length === 1 ? "item" : "items"}
                </span>
              )}
            </h1>

            {Items && Items.length > 0 && (
              <button
                type="button"
                className="lucky-clear-cart-btn"
                onClick={clearCart}
                title="Remove all items from your cart"
              >
                <i className="fa-regular fa-trash-can"></i>
                <span>Clear Cart</span>
              </button>
            )}
          </div>
        </div>

        {/* Promo Banner */}
        <div className="lucky-cart-promo-banner">
          <div className="lucky-promo-icon-box">
            <i className="fa-solid fa-leaf"></i>
          </div>
          <p className="lucky-promo-text">
            <span>Fresh & Organic:</span> All fruits hand-picked and cleaned daily • Enjoy free doorstep delivery in Jalgaon!
          </p>
        </div>

        {/* Empty State */}
        {!Items || Items.length === 0 ? (
          <div className="lucky-cart-empty-state">
            <div className="lucky-empty-icon-circle">
              <i className="fa-solid fa-basket-shopping"></i>
            </div>
            <h2 className="lucky-empty-title">Your Cart is Empty</h2>
            <p className="lucky-empty-desc">
              Looks like you haven't added any fresh fruits, green coconuts, or juices to your basket yet.
            </p>
            <Link
              to="/product"
              className="lucky-empty-cta-btn"
              onClick={scrollTop}
            >
              <i className="fa-solid fa-apple-whole"></i>
              <span>Explore Fresh Products</span>
            </Link>
          </div>
        ) : (
          /* Cart Grid */
          <div className="lucky-cart-grid">
            {/* Left: Product List */}
            <div className="lucky-cart-items-column">
              {Items.map((value, index) => {
                const lineTotal =
                  (Number(value.rate) || 0) * (Number(value.count) || 1);

                return (
                  <div className="lucky-cart-item-card" key={index}>
                    <div className="lucky-item-left-section">
                      <div className="lucky-item-image-wrapper">
                        <img
                          src={value.image}
                          alt={value.name || "Fruit item"}
                          className="lucky-item-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=60";
                          }}
                        />
                      </div>

                      <div className="lucky-item-details">
                        <h3 className="lucky-item-name">{value.name}</h3>
                        <p className="lucky-item-unit-rate">₹ {value.rate} each</p>
                        <p className="lucky-item-line-total">₹ {lineTotal}</p>
                      </div>
                    </div>

                    <div className="lucky-item-right-section">
                      <div className="lucky-quantity-pill">
                        <button
                          type="button"
                          className="lucky-qty-btn"
                          onClick={() => handleDecrement(index)}
                          aria-label="Decrease quantity"
                          title="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="lucky-qty-number">{value.count}</span>
                        <button
                          type="button"
                          className="lucky-qty-btn"
                          onClick={() => handleIncrement(index)}
                          aria-label="Increase quantity"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="lucky-item-remove-btn"
                        onClick={() => removeBtn(index)}
                        title="Remove item"
                        aria-label={`Remove ${value.name}`}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                );
              })}

              <Link
                to="/product"
                className="lucky-continue-shopping-link"
                onClick={scrollTop}
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>Continue shopping for more fresh fruits</span>
              </Link>
            </div>

            {/* Right: Order Summary Sidebar */}
            <aside className="lucky-cart-summary-sidebar">
              <div className="lucky-order-summary-card">
                <h3 className="lucky-summary-title">Order Summary</h3>

                <div className="lucky-summary-rows">
                  <div className="lucky-summary-row">
                    <span>Items ({totalUnits} total)</span>
                    <span>₹ {subtotal}</span>
                  </div>

                  <div className="lucky-summary-row">
                    <span>Delivery</span>
                    <span className="free-delivery-badge">FREE</span>
                  </div>

                  <div className="lucky-summary-row">
                    <span>Eco Packaging</span>
                    <span className="free-delivery-badge">FREE</span>
                  </div>

                  <div className="lucky-summary-divider"></div>

                  <div className="lucky-summary-total-row">
                    <span className="lucky-summary-total-label">Total Payable</span>
                    <span className="lucky-summary-total-price">₹ {subtotal}</span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="lucky-checkout-cta-btn"
                  onClick={scrollTop}
                >
                  <span>Proceed to Checkout</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </Link>

                <div className="lucky-cart-trust-badges">
                  <div className="lucky-trust-item">
                    <i className="fa-solid fa-shield-heart"></i>
                    <span>100% Farm Fresh Quality Guarantee</span>
                  </div>
                  <div className="lucky-trust-item">
                    <i className="fa-solid fa-truck-fast"></i>
                    <span>Same-Day Local Delivery in Jalgaon</span>
                  </div>
                  <div className="lucky-trust-item">
                    <i className="fa-solid fa-hand-holding-dollar"></i>
                    <span>Cash on Delivery Available</span>
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

export default Cart;
