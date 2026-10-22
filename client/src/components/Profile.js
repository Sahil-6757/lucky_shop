import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {
  const [data, setdata] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Modal edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const getuserData = () => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      setdata(userDetails);
      if (userDetails) {
        setEditFormData({
          name: userDetails.name || "",
          mobile: userDetails.mobile || "",
          address: userDetails.address || "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getOrderData = () => {
    if (!data?.email) return;
    setLoading(true);

    axios
      .post(`${process.env.REACT_APP_API_URL}/getOrders`, {
        email: data.email,
        data: data.email,
      })
      .then((res) => {
        setLoading(false);
        const orderList = Array.isArray(res.data) ? res.data : [];
        setOrder(orderList.reverse());
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error fetching order history:", err);
      });
  };

  const handleCancelOrder = (orderId) => {
    const ask = window.confirm("Are you sure you want to cancel this order?");
    if (!ask) return;

    if (navigator.vibrate) {
      navigator.vibrate(80);
    }

    axios
      .delete(`${process.env.REACT_APP_API_URL}/delete-order/${orderId}`)
      .then(() => {
        toast.success("Order Cancelled Successfully", {
          autoClose: 1200,
          position: "bottom-center",
        });
        getOrderData();
      })
      .catch((err) => {
        console.error("Error cancelling order:", err);
        toast.error("Failed to cancel order", {
          position: "bottom-center",
          autoClose: 1200,
        });
      });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim()) {
      toast.warn("Name cannot be empty", { position: "bottom-center" });
      return;
    }

    const updated = {
      ...(data || {}),
      name: editFormData.name.trim(),
      mobile: editFormData.mobile.trim(),
      address: editFormData.address.trim(),
    };

    localStorage.setItem("userDetails", JSON.stringify(updated));
    setdata(updated);
    setIsEditing(false);

    toast.success("Profile updated successfully ✅", {
      position: "bottom-center",
      autoClose: 1200,
    });
  };

  useEffect(() => {
    getuserData();
  }, []);

  useEffect(() => {
    if (data?.email) {
      getOrderData();
    }
  }, [data]);

  // Calculations for stats
  const totalOrders = order ? order.length : 0;
  const pendingOrders = order
    ? order.filter((o) => o.status === "Pending").length
    : 0;
  const completedOrders = order
    ? order.filter(
        (o) => o.status === "Delivered" || o.status === "Completed"
      ).length
    : 0;

  const totalSpend = order
    ? order.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
    : 0;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (!order) return [];
    if (activeTab === "pending") {
      return order.filter((o) => o.status === "Pending");
    }
    if (activeTab === "delivered") {
      return order.filter(
        (o) => o.status === "Delivered" || o.status === "Completed"
      );
    }
    return order;
  }, [order, activeTab]);

  // Initials for avatar
  const initials = data?.name
    ? data.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "LF";

  return (
    <div className="lucky-profile-page">
      <div className="lucky-profile-container">
        {/* Profile Hero Header Card */}
        <section className="lucky-profile-hero-card">
          <div className="lucky-profile-identity">
            <div className="lucky-profile-avatar-circle">{initials}</div>
            <div className="lucky-profile-meta">
              <span className="lucky-profile-role-tag">
                <i className="fa-solid fa-seedling"></i> Lucky Fruits Member
              </span>
              <h1>{data?.name || "Valued Customer"}</h1>
              <div className="lucky-profile-contact-chips">
                <span className="lucky-contact-chip">
                  <i className="fa-solid fa-envelope"></i>
                  {data?.email || "No email on file"}
                </span>
                <span className="lucky-contact-chip">
                  <i className="fa-solid fa-phone"></i>
                  {data?.mobile || "No phone added"}
                </span>
                <span className="lucky-contact-chip">
                  <i className="fa-solid fa-location-dot"></i>
                  Jalgaon, MH
                </span>
              </div>
            </div>
          </div>

          <div className="lucky-profile-hero-actions">
            <button
              type="button"
              className="lucky-profile-action-btn edit"
              onClick={() => setIsEditing(true)}
            >
              <i className="fa-solid fa-pen-to-square"></i>
              <span>Edit Details</span>
            </button>
            <Link
              to="/product"
              className="lucky-profile-action-btn primary"
            >
              <i className="fa-solid fa-apple-whole"></i>
              <span>Order Fruits</span>
            </Link>
          </div>
        </section>

        {/* Stats Counter Strip */}
        <section className="lucky-profile-stats-grid" aria-label="Customer Statistics">
          <div className="lucky-profile-stat-box">
            <div className="lucky-stat-icon-wrapper orders">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div className="lucky-stat-info">
              <span className="lucky-stat-value">{totalOrders}</span>
              <span className="lucky-stat-desc">Total Orders</span>
            </div>
          </div>

          <div className="lucky-profile-stat-box">
            <div className="lucky-stat-icon-wrapper pending">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div className="lucky-stat-info">
              <span className="lucky-stat-value">{pendingOrders}</span>
              <span className="lucky-stat-desc">Pending Dispatch</span>
            </div>
          </div>

          <div className="lucky-profile-stat-box">
            <div className="lucky-stat-icon-wrapper completed">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="lucky-stat-info">
              <span className="lucky-stat-value">{completedOrders}</span>
              <span className="lucky-stat-desc">Delivered Orders</span>
            </div>
          </div>

          <div className="lucky-profile-stat-box">
            <div className="lucky-stat-icon-wrapper spend">
              <i className="fa-solid fa-indian-rupee-sign"></i>
            </div>
            <div className="lucky-stat-info">
              <span className="lucky-stat-value">₹{totalSpend}</span>
              <span className="lucky-stat-desc">Total Harvest Spend</span>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="lucky-profile-main-grid">
          {/* Left Sidebar: Address & Quick Support */}
          <aside className="lucky-profile-sidebar">
            {/* Delivery Address Card */}
            <div className="lucky-profile-card">
              <div className="lucky-profile-card-header">
                <h2 className="lucky-profile-card-title">
                  <i className="fa-solid fa-location-dot"></i>
                  <span>Default Shipping Address</span>
                </h2>
                <button
                  type="button"
                  className="lucky-card-edit-link"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fa-solid fa-pen"></i> Edit
                </button>
              </div>

              <div className="lucky-address-details">
                <div className="lucky-address-line">
                  <i className="fa-solid fa-user"></i>
                  <span>{data?.name || "Recipient Name"}</span>
                </div>
                <div className="lucky-address-line">
                  <i className="fa-solid fa-phone"></i>
                  <span>{data?.mobile || "Contact Mobile"}</span>
                </div>
                <div className="lucky-address-line">
                  <i className="fa-solid fa-map-location-dot"></i>
                  <span>{data?.address || "No address saved yet. Click edit to set default."}</span>
                </div>
                <p className="lucky-address-hint">
                  ✓ Automatically applied during one-click checkout for fast dispatch.
                </p>
              </div>
            </div>

            {/* Quick Support Box */}
            <div className="lucky-support-box">
              <h3>Need Help with an Order?</h3>
              <p>
                Have an inquiry about coconut deliveries or fruit quality? Our Jalgaon team is on standby 9 AM - 9 PM.
              </p>
              <a
                href="https://wa.me/919822516757?text=Hi%20Lucky%20Fruits,%20I%20have%20a%20question%20regarding%20my%20order:"
                target="_blank"
                rel="noreferrer"
                className="lucky-support-whatsapp-btn"
              >
                <i className="fa-brands fa-whatsapp"></i>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </aside>

          {/* Right Column: Order History */}
          <section className="lucky-orders-section">
            <div className="lucky-orders-header-row">
              <h2 className="lucky-orders-heading">
                <span>Order History</span>
                <span className="lucky-orders-count-badge">
                  {filteredOrders.length} {filteredOrders.length === 1 ? "Order" : "Orders"}
                </span>
              </h2>

              {/* Status Tabs */}
              <div className="lucky-status-filter-pills">
                <button
                  type="button"
                  className={`lucky-status-tab-btn ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  All ({totalOrders})
                </button>
                <button
                  type="button"
                  className={`lucky-status-tab-btn ${activeTab === "pending" ? "active" : ""}`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending ({pendingOrders})
                </button>
                <button
                  type="button"
                  className={`lucky-status-tab-btn ${activeTab === "delivered" ? "active" : ""}`}
                  onClick={() => setActiveTab("delivered")}
                >
                  Delivered ({completedOrders})
                </button>
              </div>
            </div>

            {/* Orders Cards List */}
            {loading ? (
              <div className="lucky-orders-empty-state">
                <i className="fa-solid fa-spinner fa-spin lucky-empty-basket-icon" style={{ border: "none" }}></i>
                <h3 className="lucky-empty-orders-title">Fetching Your Orders...</h3>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="lucky-order-cards-list">
                {filteredOrders.map((orderItem, index) => {
                  const statusClass = (orderItem.status || "pending").toLowerCase();
                  const orderIdString = orderItem._id
                    ? orderItem._id.slice(-6).toUpperCase()
                    : `${index + 1}`.padStart(4, "0");

                  // Handle items whether stored as items or order
                  const itemsList = Array.isArray(orderItem.items)
                    ? orderItem.items
                    : Array.isArray(orderItem.order)
                    ? orderItem.order
                    : [];

                  return (
                    <article className="lucky-order-card" key={orderItem._id || index}>
                      {/* Order Card Header */}
                      <div className="lucky-order-card-header">
                        <div className="lucky-order-meta-left">
                          <span className="lucky-order-id-tag">#ORD-{orderIdString}</span>
                          <span className="lucky-order-date">
                            <i className="fa-regular fa-calendar-days"></i>
                            {orderItem.time || "Recent"}
                          </span>
                        </div>

                        <span className={`lucky-status-indicator ${statusClass}`}>
                          {statusClass === "pending" && <i className="fa-solid fa-clock"></i>}
                          {(statusClass === "delivered" || statusClass === "completed") && (
                            <i className="fa-solid fa-check"></i>
                          )}
                          {statusClass === "cancelled" && <i className="fa-solid fa-xmark"></i>}
                          <span>{orderItem.status || "Pending"}</span>
                        </span>
                      </div>

                      {/* Order Card Body */}
                      <div className="lucky-order-card-body">
                        <div className="lucky-order-items-table">
                          {itemsList.map((sub, sIdx) => (
                            <div className="lucky-order-product-row" key={sIdx}>
                              <div className="lucky-order-product-left">
                                <span className="lucky-product-bullet">•</span>
                                <span className="lucky-order-product-name">{sub.name}</span>
                                <span className="lucky-order-product-qty">Qty: {sub.count}</span>
                              </div>
                              <span className="lucky-order-product-rate">
                                ₹{(Number(sub.rate) || 0) * (Number(sub.count) || 1)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {orderItem.address && (
                          <div className="lucky-order-delivery-preview">
                            <i className="fa-solid fa-location-arrow"></i>
                            <span>Delivering to: {orderItem.address}</span>
                          </div>
                        )}
                      </div>

                      {/* Order Card Footer */}
                      <div className="lucky-order-card-footer">
                        <span className="lucky-order-payment-tag">
                          <i className="fa-solid fa-hand-holding-dollar" style={{ color: "#10b981" }}></i>
                          <span>{orderItem.payement_id || "Cash on Delivery"}</span>
                        </span>

                        <div className="lucky-order-total-price-box">
                          <span className="lucky-order-total-amount">
                            Total: ₹{orderItem.total}
                          </span>

                          {orderItem.status === "Pending" && (
                            <button
                              type="button"
                              className="lucky-cancel-order-btn"
                              onClick={() => handleCancelOrder(orderItem._id)}
                              title="Cancel this order"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Empty Orders State */
              <div className="lucky-orders-empty-state">
                <div className="lucky-empty-basket-icon">
                  <i className="fa-solid fa-basket-shopping"></i>
                </div>
                <h3 className="lucky-empty-orders-title">No Orders Found</h3>
                <p className="lucky-empty-orders-text">
                  {activeTab !== "all"
                    ? `You don't have any orders with status "${activeTab}".`
                    : "Looks like you haven't ordered any fresh fruits yet!"}
                </p>
                <Link to="/product" className="lucky-profile-action-btn primary">
                  <i className="fa-solid fa-apple-whole"></i>
                  <span>Explore Fresh Fruits</span>
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="lucky-modal-backdrop" onClick={() => setIsEditing(false)}>
            <div
              className="lucky-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lucky-modal-header">
                <h3 className="lucky-modal-title">Edit Your Details</h3>
                <button
                  type="button"
                  className="lucky-modal-close-btn"
                  onClick={() => setIsEditing(false)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="lucky-modal-form">
                <div className="lucky-modal-field">
                  <label className="lucky-modal-label">Your Full Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="lucky-modal-input"
                    required
                  />
                </div>

                <div className="lucky-modal-field">
                  <label className="lucky-modal-label">Mobile Number</label>
                  <input
                    type="tel"
                    value={editFormData.mobile}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, mobile: e.target.value })
                    }
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    className="lucky-modal-input"
                  />
                </div>

                <div className="lucky-modal-field">
                  <label className="lucky-modal-label">Default Shipping Address</label>
                  <input
                    type="text"
                    value={editFormData.address}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, address: e.target.value })
                    }
                    placeholder="Flat/House No, Landmark, Area in Jalgaon"
                    className="lucky-modal-input"
                  />
                </div>

                <button type="submit" className="lucky-modal-save-btn">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
