import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import "./Dashboard.css";
import "./Dorder.css";

function Dorder() {
  const [Order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Fetch all orders from backend API
  const getData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${process.env.REACT_APP_API_URL}/order`);
      if (Array.isArray(resp.data)) {
        setOrder(resp.data);
      } else {
        setOrder([]);
      }
    } catch (err) {
      console.error("Orders Fetch Error:", err);
      toast.error("Could not fetch customer orders", {
        position: "bottom-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Update order delivery/fulfillment status
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/updateOrderStatus/${id}`,
        { status }
      );

      toast.success(`Order marked as ${status} ✓`, {
        position: "bottom-center",
        autoClose: 1500,
      });

      if (selectedReceipt && selectedReceipt._id === id) {
        setSelectedReceipt((prev) => ({ ...prev, status }));
      }

      getData();
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Failed to update order status", {
        position: "bottom-center",
        autoClose: 2000,
      });
    }
  };

  // Delete an order record
  const handleDelete = async (id, name) => {
    const ask = window.confirm(
      `Are you sure you want to delete order of ${name || "this customer"}?`
    );
    if (!ask) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/delete-order/${id}`);
      toast.success("Order deleted successfully 🗑️", {
        autoClose: 1500,
        position: "bottom-center",
      });
      if (selectedReceipt && selectedReceipt._id === id) {
        setSelectedReceipt(null);
      }
      getData();
    } catch (err) {
      console.error("Delete Order Error:", err);
      toast.error("Failed to delete order", {
        position: "bottom-center",
        autoClose: 2000,
      });
    }
  };

  // Safe total amount parser
  const parseTotal = (val) => {
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.]/g, "");
    return parseFloat(cleaned) || 0;
  };

  // Metric counts
  const pendingCount = useMemo(
    () => Order.filter((o) => (o.status || "").toLowerCase() === "pending").length,
    [Order]
  );

  const deliveredCount = useMemo(
    () => Order.filter((o) => (o.status || "").toLowerCase() === "delivered").length,
    [Order]
  );

  const cancelledCount = useMemo(
    () => Order.filter((o) => (o.status || "").toLowerCase() === "cancelled").length,
    [Order]
  );

  const totalRevenue = useMemo(
    () => Order.reduce((acc, curr) => acc + parseTotal(curr.total), 0),
    [Order]
  );

  // Format date helper
  const formatDate = (rawTime) => {
    if (!rawTime) return "Recently Placed";
    try {
      const d = new Date(rawTime);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    } catch (e) {
      // ignore
    }
    return String(rawTime);
  };

  // Clean phone number for tel/WhatsApp
  const cleanPhone = (phone) => {
    if (!phone) return "";
    return String(phone).replace(/[^0-9]/g, "");
  };

  // Filtered and sorted order list
  const filteredOrders = useMemo(() => {
    let result = [...Order];

    // Status Tab Filtering
    if (activeTab === "pending") {
      result = result.filter((o) => (o.status || "").toLowerCase() === "pending");
    } else if (activeTab === "delivered") {
      result = result.filter((o) => (o.status || "").toLowerCase() === "delivered");
    } else if (activeTab === "cancelled") {
      result = result.filter((o) => (o.status || "").toLowerCase() === "cancelled");
    }

    // Search Query (Customer Name, Email, Phone, Address, or Item names)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o) => {
        const nameMatch = (o.name || "").toLowerCase().includes(q);
        const emailMatch = (o.email || "").toLowerCase().includes(q);
        const phoneMatch = String(o.mobile || "").includes(q);
        const addrMatch = (o.address || "").toLowerCase().includes(q);
        const idMatch = (o.order_id || o._id || "").toLowerCase().includes(q);
        const itemMatch =
          Array.isArray(o.items) &&
          o.items.some((it) => (it.name || "").toLowerCase().includes(q));

        return nameMatch || emailMatch || phoneMatch || addrMatch || idMatch || itemMatch;
      });
    }

    // Sorting
    if (sortBy === "newest") {
      result.reverse();
    } else if (sortBy === "oldest") {
      // keep original order
    } else if (sortBy === "amount-high") {
      result.sort((a, b) => parseTotal(b.total) - parseTotal(a.total));
    } else if (sortBy === "amount-low") {
      result.sort((a, b) => parseTotal(a.total) - parseTotal(b.total));
    }

    return result;
  }, [Order, activeTab, searchQuery, sortBy]);

  return (
    <div className="container-fluid py-4 px-3 px-md-4 lucky-dorder-page dashboard-main">
      {/* Hero Header Banner */}
      <div className="lucky-dorder-hero">
        <h1 className="lucky-dorder-hero-title">
          <i className="fa-solid fa-cart-flatbed-suitcase text-emerald"></i>
          Customer Orders <span>& Dispatch</span>
        </h1>
        <p className="lucky-dorder-hero-desc">
          Live fulfillment tracking, order status management, and customer delivery coordination for Jalgaon depot.
        </p>
      </div>

      {/* Order Metrics Strip (4 Cards) */}
      <div className="lucky-order-metrics-grid">
        <div className="lucky-metric-card total">
          <div className="lucky-metric-info">
            <span className="lucky-metric-label">Total Orders</span>
            <span className="lucky-metric-val">{Order.length}</span>
          </div>
          <div className="lucky-metric-icon-box">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
        </div>

        <div className="lucky-metric-card pending">
          <div className="lucky-metric-info">
            <span className="lucky-metric-label">Pending Dispatch</span>
            <span className="lucky-metric-val">{pendingCount}</span>
          </div>
          <div className="lucky-metric-icon-box">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
        </div>

        <div className="lucky-metric-card delivered">
          <div className="lucky-metric-info">
            <span className="lucky-metric-label">Fulfilled & Delivered</span>
            <span className="lucky-metric-val">{deliveredCount}</span>
          </div>
          <div className="lucky-metric-icon-box">
            <i className="fa-solid fa-truck-ramp-box"></i>
          </div>
        </div>

        <div className="lucky-metric-card revenue">
          <div className="lucky-metric-info">
            <span className="lucky-metric-label">Depot Order Value</span>
            <span className="lucky-metric-val">₹{totalRevenue.toLocaleString("en-IN")}</span>
          </div>
          <div className="lucky-metric-icon-box">
            <i className="fa-solid fa-indian-rupee-sign"></i>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="lucky-order-toolbar">
        <div className="lucky-toolbar-top">
          {/* Status Tabs */}
          <div className="lucky-status-tabs">
            <button
              type="button"
              className={`lucky-status-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Orders
              <span className="lucky-tab-badge">{Order.length}</span>
            </button>

            <button
              type="button"
              className={`lucky-status-tab-btn ${activeTab === "pending" ? "active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              <span className="lucky-pulse-orange"></span>
              Pending Dispatch
              <span className="lucky-tab-badge">{pendingCount}</span>
            </button>

            <button
              type="button"
              className={`lucky-status-tab-btn ${activeTab === "delivered" ? "active" : ""}`}
              onClick={() => setActiveTab("delivered")}
            >
              <i className="fa-solid fa-check me-1" style={{ fontSize: "0.75rem" }}></i>
              Delivered
              <span className="lucky-tab-badge">{deliveredCount}</span>
            </button>

            <button
              type="button"
              className={`lucky-status-tab-btn ${activeTab === "cancelled" ? "active" : ""}`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled
              <span className="lucky-tab-badge">{cancelledCount}</span>
            </button>
          </div>

          {/* View Toggles & Refresh */}
          <div className="lucky-toolbar-actions">
            <div className="lucky-view-toggle-group">
              <button
                type="button"
                className={`lucky-view-toggle-btn ${viewMode === "cards" ? "active" : ""}`}
                onClick={() => setViewMode("cards")}
                title="Cards View"
              >
                <i className="fa-solid fa-grip"></i>
                <span className="d-none d-sm-inline">Cards</span>
              </button>
              <button
                type="button"
                className={`lucky-view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
                title="Table View"
              >
                <i className="fa-solid fa-table-list"></i>
                <span className="d-none d-sm-inline">Table</span>
              </button>
            </div>

            <button
              type="button"
              className="lucky-refresh-btn"
              onClick={getData}
              title="Refresh Orders"
            >
              <i className={`fa-solid fa-rotate-right ${loading ? "fa-spin" : ""}`}></i>
              <span className="d-none d-sm-inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search and Sort Row */}
        <div className="lucky-toolbar-bottom">
          <div className="lucky-order-search">
            <i className="fa-solid fa-magnifying-glass lucky-order-search-icon"></i>
            <input
              type="text"
              className="lucky-order-search-input"
              placeholder="Search by customer name, phone, email, address, or fruit item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="lucky-order-search-clear"
                onClick={() => setSearchQuery("")}
                title="Clear Search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <select
            className="lucky-order-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Main Order Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
          <p className="mt-2 text-muted fw-semibold">Fetching latest depot orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="lucky-orders-empty">
          <div className="lucky-empty-icon">
            <i className="fa-solid fa-inbox"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">No Orders Found</h3>
          <p className="text-muted" style={{ maxWidth: "420px", fontSize: "0.9rem" }}>
            {searchQuery
              ? `No customer orders matched your search "${searchQuery}". Try a different keyword.`
              : activeTab !== "all"
              ? `There are currently no orders in "${activeTab}" status.`
              : "No customer orders have been placed yet."}
          </p>
          {(searchQuery || activeTab !== "all") && (
            <button
              type="button"
              className="btn btn-outline-success rounded-pill px-4 mt-2"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        /* ================= CARDS VIEW ================= */
        <div className="lucky-order-cards-grid">
          {filteredOrders.map((order, idx) => {
            const isPending = (order.status || "").toLowerCase() === "pending";
            const isDelivered = (order.status || "").toLowerCase() === "delivered";
            const isCancelled = (order.status || "").toLowerCase() === "cancelled";
            const phone = cleanPhone(order.mobile);
            const orderShortId = order.order_id || (order._id ? `#${order._id.slice(-6).toUpperCase()}` : `#${idx + 1}`);

            return (
              <div className="lucky-order-card" key={order._id || idx}>
                {/* Card Header */}
                <div className="lucky-order-card-header">
                  <span className="lucky-order-id-pill">{orderShortId}</span>

                  <span
                    className={`lucky-status-pill ${
                      isDelivered ? "delivered" : isCancelled ? "cancelled" : "pending"
                    }`}
                  >
                    {isPending && <span className="lucky-pulse-orange"></span>}
                    {isDelivered && <i className="fa-solid fa-check"></i>}
                    {isCancelled && <i className="fa-solid fa-xmark"></i>}
                    {order.status || "Pending"}
                  </span>
                </div>

                {/* Card Body */}
                <div className="lucky-order-card-body">
                  {/* Customer Info & Direct Communication */}
                  <div className="lucky-customer-block">
                    <div>
                      <h3 className="lucky-customer-name" title={order.name}>
                        {order.name || "Customer"}
                      </h3>
                      <div className="lucky-customer-time">
                        <i className="fa-regular fa-clock"></i>
                        <span>{formatDate(order.time)}</span>
                      </div>
                    </div>

                    <div className="lucky-comm-shortcuts">
                      {phone && (
                        <>
                          <a
                            href={`tel:${phone}`}
                            className="lucky-comm-btn phone"
                            title={`Call ${order.name}: ${phone}`}
                          >
                            <i className="fa-solid fa-phone"></i>
                          </a>
                          <a
                            href={`https://wa.me/91${phone}?text=${encodeURIComponent(
                              `Hello ${order.name || "Customer"}, this is Lucky Fruits Jalgaon depot regarding your order of ₹${order.total}. Your fresh fruit delivery is scheduled!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lucky-comm-btn whatsapp"
                            title={`WhatsApp ${order.name}`}
                          >
                            <i className="fa-brands fa-whatsapp"></i>
                          </a>
                        </>
                      )}
                      {order.email && (
                        <a
                          href={`mailto:${order.email}`}
                          className="lucky-comm-btn email"
                          title={`Email ${order.email}`}
                        >
                          <i className="fa-solid fa-envelope"></i>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.address && (
                    <div className="lucky-address-box">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>{order.address}</span>
                    </div>
                  )}

                  {/* Items Summary */}
                  <div className="lucky-items-box">
                    <div className="lucky-items-title">Ordered Fresh Fruits</div>
                    <div className="lucky-items-pills-wrap">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((it, iIdx) => (
                          <div className="lucky-item-pill" key={iIdx}>
                            <span>{it.name}</span>
                            <span className="lucky-item-qty">×{it.count || 1}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-muted small">No items itemized</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer & Action Buttons */}
                <div className="lucky-order-card-footer">
                  <div className="lucky-order-total-block">
                    <span className="lucky-total-label">Total Amount</span>
                    <span className="lucky-total-amount">₹{order.total}</span>
                  </div>

                  <div className="lucky-order-card-actions">
                    {/* View Receipt Button */}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill px-2"
                      onClick={() => setSelectedReceipt(order)}
                      title="View itemized receipt"
                    >
                      <i className="fa-solid fa-receipt"></i>
                    </button>

                    {/* Fulfill / Cancel Buttons */}
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          className="lucky-action-deliver-btn"
                          onClick={() => handleStatusChange(order._id, "Delivered")}
                          title="Mark order as Delivered"
                        >
                          <i className="fa-solid fa-truck-fast"></i>
                          Deliver
                        </button>

                        <button
                          type="button"
                          className="lucky-action-cancel-btn"
                          onClick={() => handleStatusChange(order._id, "Cancelled")}
                          title="Cancel Order"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-light border text-muted"
                        onClick={() => handleStatusChange(order._id, "Pending")}
                        title="Revert status to Pending"
                      >
                        Reopen
                      </button>
                    )}

                    {/* Delete Record Button */}
                    <button
                      type="button"
                      className="lucky-action-delete-btn"
                      onClick={() => handleDelete(order._id, order.name)}
                      title="Delete order permanently"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= COMPACT TABLE VIEW ================= */
        <div className="lucky-table-card table-responsive">
          <table className="lucky-orders-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Order / Customer</th>
                <th>Contact</th>
                <th>Delivery Address</th>
                <th>Fruit Items</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const isPending = (order.status || "").toLowerCase() === "pending";
                const isDelivered = (order.status || "").toLowerCase() === "delivered";
                const isCancelled = (order.status || "").toLowerCase() === "cancelled";
                const phone = cleanPhone(order.mobile);

                return (
                  <tr key={order._id || index}>
                    <td className="fw-bold text-muted">{index + 1}</td>
                    <td>
                      <div className="fw-bold text-dark">{order.name}</div>
                      <div className="small text-muted">{formatDate(order.time)}</div>
                    </td>
                    <td>
                      {phone && (
                        <div className="d-flex align-items-center gap-1">
                          <a href={`tel:${phone}`} className="text-decoration-none text-dark fw-semibold">
                            {order.mobile}
                          </a>
                          <a
                            href={`https://wa.me/91${phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-success ms-1"
                            title="Chat on WhatsApp"
                          >
                            <i className="fa-brands fa-whatsapp"></i>
                          </a>
                        </div>
                      )}
                      {order.email && <div className="small text-muted">{order.email}</div>}
                    </td>
                    <td style={{ maxWidth: "220px" }}>
                      <span className="small text-secondary" title={order.address}>
                        {order.address}
                      </span>
                    </td>
                    <td style={{ maxWidth: "240px" }}>
                      {Array.isArray(order.items) &&
                        order.items.map((it, iIdx) => (
                          <div key={iIdx} className="small text-dark">
                            • {it.name} <span className="text-muted">(×{it.count || 1})</span>
                          </div>
                        ))}
                    </td>
                    <td>
                      <span className="fw-bold text-success fs-6">₹{order.total}</span>
                    </td>
                    <td>
                      <span
                        className={`lucky-status-pill ${
                          isDelivered ? "delivered" : isCancelled ? "cancelled" : "pending"
                        }`}
                      >
                        {isPending && <span className="lucky-pulse-orange"></span>}
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1"
                          onClick={() => setSelectedReceipt(order)}
                          title="Receipt"
                        >
                          <i className="fa-solid fa-receipt"></i>
                        </button>

                        {isPending && (
                          <>
                            <button
                              type="button"
                              className="btn btn-sm btn-success rounded-pill px-2 py-1"
                              onClick={() => handleStatusChange(order._id, "Delivered")}
                              title="Deliver"
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-warning rounded-pill px-2 py-1"
                              onClick={() => handleStatusChange(order._id, "Cancelled")}
                              title="Cancel"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                          onClick={() => handleDelete(order._id, order.name)}
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= RECEIPT & DETAIL MODAL ================= */}
      {selectedReceipt && (
        <div className="lucky-modal-backdrop" onClick={() => setSelectedReceipt(null)}>
          <div className="lucky-receipt-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="lucky-receipt-header">
              <div>
                <h3 className="lucky-receipt-title">Order Dispatch Slip</h3>
                <span className="small text-light opacity-75">
                  Lucky Fruits Depot • Jalgaon
                </span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-circle"
                onClick={() => setSelectedReceipt(null)}
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="lucky-receipt-body">
              <div className="row g-3 pb-3 border-bottom">
                <div className="col-6">
                  <div className="text-muted small fw-bold text-uppercase">Customer</div>
                  <div className="fw-bold text-dark fs-6">{selectedReceipt.name}</div>
                  <div className="small text-muted">{selectedReceipt.mobile}</div>
                  <div className="small text-muted">{selectedReceipt.email}</div>
                </div>
                <div className="col-6 text-end">
                  <div className="text-muted small fw-bold text-uppercase">Order Details</div>
                  <div className="fw-bold text-dark">{selectedReceipt.order_id || `#${selectedReceipt._id?.slice(-6).toUpperCase()}`}</div>
                  <div className="small text-muted">{formatDate(selectedReceipt.time)}</div>
                  <span
                    className={`lucky-status-pill mt-1 ${
                      selectedReceipt.status === "Delivered"
                        ? "delivered"
                        : selectedReceipt.status === "Cancelled"
                        ? "cancelled"
                        : "pending"
                    }`}
                  >
                    {selectedReceipt.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="py-3 border-bottom">
                <div className="text-muted small fw-bold text-uppercase mb-1">
                  <i className="fa-solid fa-location-dot text-danger me-1"></i> Delivery Address
                </div>
                <div className="text-dark small bg-light p-2 rounded">
                  {selectedReceipt.address || "Local Pickup at Depot"}
                </div>
              </div>

              {/* Itemized Table */}
              <table className="lucky-receipt-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style={{ textAlign: "center" }}>Qty</th>
                    <th style={{ textAlign: "right" }}>Rate</th>
                    <th style={{ textAlign: "right" }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(selectedReceipt.items) &&
                    selectedReceipt.items.map((it, idx) => {
                      const count = it.count || 1;
                      const rateNum = parseTotal(it.rate);
                      const subtotal = rateNum * count;

                      return (
                        <tr key={idx}>
                          <td className="fw-semibold text-dark">{it.name}</td>
                          <td style={{ textAlign: "center" }}>{count}</td>
                          <td style={{ textAlign: "right" }}>{it.rate}</td>
                          <td style={{ textAlign: "right" }} className="fw-bold">
                            ₹{subtotal > 0 ? subtotal : it.rate}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* Grand Total */}
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                <span className="fw-bold fs-5 text-dark">Grand Total</span>
                <span className="fw-bold fs-4 text-success">₹{selectedReceipt.total}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="lucky-receipt-footer">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-3"
                onClick={() => window.print()}
              >
                <i className="fa-solid fa-print me-1"></i>
                Print Slip
              </button>

              <div className="d-flex align-items-center gap-2">
                {selectedReceipt.status === "Pending" ? (
                  <button
                    type="button"
                    className="btn btn-success rounded-pill px-4 fw-bold"
                    onClick={() => handleStatusChange(selectedReceipt._id, "Delivered")}
                  >
                    <i className="fa-solid fa-truck-fast me-1"></i>
                    Mark Delivered
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-success rounded-pill px-3"
                    onClick={() => setSelectedReceipt(null)}
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dorder;
