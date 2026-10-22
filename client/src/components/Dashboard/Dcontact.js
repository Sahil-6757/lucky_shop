import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";
import "./Dcontact.css";

function Dcontact() {
  const [Contact, setContact] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Fetch all contact messages from backend API
  const getData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${process.env.REACT_APP_API_URL}`);
      if (Array.isArray(resp.data)) {
        setContact(resp.data);
      } else {
        setContact([]);
      }
    } catch (err) {
      console.error("Inquiries Fetch Error:", err);
      toast.error("Could not fetch customer messages", {
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

  // Delete message with confirmation
  const handleDelete = async (id, name) => {
    const ask = window.confirm(
      `Are you sure you want to delete inquiry from ${name || "this customer"}?`
    );
    if (!ask) return;

    try {
      const resp = await axios.delete(
        `${process.env.REACT_APP_API_URL}/delete/${id}`
      );
      if (resp.data.message === "Deleted") {
        toast.success("Message deleted successfully 🗑️", {
          autoClose: 1500,
          position: "bottom-center",
        });
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(null);
        }
        getData();
      } else {
        toast.error("Unable to delete message");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete message", {
        position: "bottom-center",
        autoClose: 2000,
      });
    }
  };

  // Generate sender initials
  const getInitials = (name) => {
    if (!name) return "C";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Format date helper
  const formatDate = (rawTime) => {
    if (!rawTime) return "Recent Inquiry";
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

  // Filtered and sorted inquiries
  const filteredContacts = useMemo(() => {
    let result = [...Contact];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q) ||
          (c.message || "").toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "newest") {
      result.reverse();
    } else if (sortBy === "oldest") {
      // original order
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return result;
  }, [Contact, searchQuery, sortBy]);

  return (
    <div className="container-fluid py-4 px-3 px-md-4 lucky-dcontact-page dashboard-main">
      {/* Hero Header Banner */}
      <div className="lucky-dcontact-hero">
        <h1 className="lucky-dcontact-hero-title">
          <i className="fa-solid fa-envelope-open-text text-emerald"></i>
          Customer Inquiries <span>& Messages</span>
        </h1>
        <p className="lucky-dcontact-hero-desc">
          Review customer questions, fruit wholesale requests, and direct feedback sent through the storefront.
        </p>
      </div>

      {/* Metrics Row (3 Cards) */}
      <div className="lucky-contact-metrics-grid">
        <div className="lucky-contact-metric-card total">
          <div className="lucky-contact-metric-info">
            <span className="lucky-contact-metric-label">Total Messages</span>
            <span className="lucky-contact-metric-val">{Contact.length}</span>
          </div>
          <div className="lucky-contact-metric-icon">
            <i className="fa-solid fa-inbox"></i>
          </div>
        </div>

        <div className="lucky-contact-metric-card support">
          <div className="lucky-contact-metric-info">
            <span className="lucky-contact-metric-label">Support Inquiries</span>
            <span className="lucky-contact-metric-val">{Contact.length}</span>
          </div>
          <div className="lucky-contact-metric-icon">
            <i className="fa-solid fa-headset"></i>
          </div>
        </div>

        <div className="lucky-contact-metric-card channel">
          <div className="lucky-contact-metric-info">
            <span className="lucky-contact-metric-label">Response Channel</span>
            <span className="lucky-contact-metric-val" style={{ fontSize: "1.2rem", marginTop: "4px" }}>
              Direct Mail
            </span>
          </div>
          <div className="lucky-contact-metric-icon">
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
      </div>

      {/* Toolbar Strip */}
      <div className="lucky-contact-toolbar">
        <div className="lucky-contact-search">
          <i className="fa-solid fa-magnifying-glass lucky-contact-search-icon"></i>
          <input
            type="text"
            className="lucky-contact-search-input"
            placeholder="Search by customer name, email, or message keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="lucky-contact-search-clear"
              onClick={() => setSearchQuery("")}
              title="Clear Search"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <div className="lucky-contact-toolbar-right">
          <select
            className="lucky-contact-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name-asc">Sender: A to Z</option>
          </select>

          <div className="lucky-contact-view-toggles">
            <button
              type="button"
              className={`lucky-contact-view-btn ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
              title="Cards View"
            >
              <i className="fa-solid fa-grip"></i>
              <span className="d-none d-sm-inline">Cards</span>
            </button>
            <button
              type="button"
              className={`lucky-contact-view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <i className="fa-solid fa-table-list"></i>
              <span className="d-none d-sm-inline">Table</span>
            </button>
          </div>

          <button
            type="button"
            className="lucky-contact-refresh-btn"
            onClick={getData}
            title="Refresh Inquiries"
          >
            <i className={`fa-solid fa-rotate-right ${loading ? "fa-spin" : ""}`}></i>
            <span className="d-none d-sm-inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading inquiries...</span>
          </div>
          <p className="mt-2 text-muted fw-semibold">Loading customer inquiries...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="lucky-contacts-empty">
          <div className="lucky-empty-icon">
            <i className="fa-solid fa-envelope-circle-check"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">No Messages Found</h3>
          <p className="text-muted" style={{ maxWidth: "420px", fontSize: "0.9rem" }}>
            {searchQuery
              ? `No inquiries matched "${searchQuery}". Try searching with different keywords.`
              : "Your inbox is empty. No customer inquiries have been submitted yet."}
          </p>
          {searchQuery && (
            <button
              type="button"
              className="btn btn-outline-success rounded-pill px-4 mt-2"
              onClick={() => setSearchQuery("")}
            >
              Reset Search Filter
            </button>
          )}
        </div>
      ) : viewMode === "cards" ? (
        /* ================= CARDS VIEW ================= */
        <div className="lucky-contact-cards-grid">
          {filteredContacts.map((item, idx) => {
            const initials = getInitials(item.name);

            return (
              <div className="lucky-inquiry-card" key={item._id || idx}>
                {/* Header */}
                <div className="lucky-inquiry-card-header">
                  <div className="lucky-inquiry-sender-wrap">
                    <div className="lucky-sender-avatar">{initials}</div>
                    <div className="lucky-sender-meta">
                      <h3 className="lucky-sender-name" title={item.name}>
                        {item.name || "Anonymous Visitor"}
                      </h3>
                      <div className="lucky-inquiry-time">
                        <i className="fa-regular fa-clock"></i>
                        <span>{formatDate(item.time)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="lucky-inquiry-card-body">
                  <div className="lucky-sender-email-row">
                    <i className="fa-solid fa-envelope"></i>
                    <span>{item.email || "No email provided"}</span>
                  </div>

                  <div className="lucky-inquiry-message-box">
                    <i className="fa-solid fa-quote-left text-success opacity-50 me-2"></i>
                    {item.message}
                  </div>
                </div>

                {/* Footer */}
                <div className="lucky-inquiry-card-footer">
                  <div className="d-flex align-items-center gap-2">
                    {item.email && (
                      <a
                        href={`mailto:${item.email}?subject=${encodeURIComponent(
                          `Reply from Lucky Fruits Depot regarding your message`
                        )}&body=${encodeURIComponent(
                          `Hello ${item.name || "Customer"},\n\nThank you for reaching out to Lucky Fruits Jalgaon depot.\n\n`
                        )}`}
                        className="lucky-inquiry-reply-btn"
                        title="Reply via Email"
                      >
                        <i className="fa-solid fa-reply"></i>
                        <span>Reply</span>
                      </a>
                    )}

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary rounded-pill px-2"
                      onClick={() => setSelectedInquiry(item)}
                      title="Inspect full message"
                    >
                      <i className="fa-solid fa-expand"></i>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="lucky-inquiry-del-btn"
                    onClick={() => handleDelete(item._id, item.name)}
                    title="Delete Message"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= COMPACT TABLE VIEW ================= */
        <div className="lucky-contact-table-card table-responsive">
          <table className="lucky-contact-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Sender</th>
                <th>Email Address</th>
                <th>Inquiry Message</th>
                <th>Received</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((item, index) => {
                const initials = getInitials(item.name);

                return (
                  <tr key={item._id || index}>
                    <td className="fw-bold text-muted">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="lucky-sender-avatar"
                          style={{ width: "34px", height: "34px", fontSize: "0.85rem", borderRadius: "10px" }}
                        >
                          {initials}
                        </div>
                        <span className="fw-bold text-dark">{item.name || "Visitor"}</span>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${item.email}`} className="text-decoration-none text-dark fw-semibold">
                        {item.email}
                      </a>
                    </td>
                    <td style={{ maxWidth: "340px" }}>
                      <div
                        className="text-truncate text-secondary"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedInquiry(item)}
                        title="Click to view full message"
                      >
                        {item.message}
                      </div>
                    </td>
                    <td className="small text-muted">{formatDate(item.time)}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className="d-inline-flex align-items-center gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1"
                          onClick={() => setSelectedInquiry(item)}
                          title="View"
                        >
                          <i className="fa-solid fa-expand"></i>
                        </button>

                        {item.email && (
                          <a
                            href={`mailto:${item.email}?subject=${encodeURIComponent(
                              `Reply from Lucky Fruits Depot`
                            )}`}
                            className="btn btn-sm btn-success rounded-pill px-2 py-1 text-white"
                            title="Reply via Email"
                          >
                            <i className="fa-solid fa-reply"></i>
                          </a>
                        )}

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1"
                          onClick={() => handleDelete(item._id, item.name)}
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

      {/* ================= INQUIRY DETAIL MODAL ================= */}
      {selectedInquiry && (
        <div
          className="lucky-contact-modal-backdrop"
          onClick={() => setSelectedInquiry(null)}
        >
          <div
            className="lucky-contact-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="lucky-contact-modal-header">
              <div>
                <h3 className="fw-bold fs-5 m-0 text-white">Customer Inquiry Details</h3>
                <span className="small text-light opacity-75">
                  Lucky Fruits Depot • Jalgaon Support
                </span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-circle"
                onClick={() => setSelectedInquiry(null)}
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="lucky-contact-modal-body">
              <div className="pb-3 border-bottom mb-3">
                <div className="text-muted small fw-bold text-uppercase">Sender</div>
                <div className="fw-bold fs-5 text-dark">{selectedInquiry.name}</div>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-success text-decoration-none fw-semibold small"
                >
                  <i className="fa-solid fa-envelope me-1"></i>
                  {selectedInquiry.email}
                </a>
                <div className="small text-muted mt-1">
                  <i className="fa-regular fa-clock me-1"></i>
                  Received: {formatDate(selectedInquiry.time)}
                </div>
              </div>

              <div>
                <div className="text-muted small fw-bold text-uppercase mb-2">
                  Full Customer Message
                </div>
                <div className="p-3 bg-light rounded-3 text-dark" style={{ lineHeight: 1.7, fontSize: "0.95rem" }}>
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="lucky-contact-modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary rounded-pill px-3"
                onClick={() => setSelectedInquiry(null)}
              >
                Close
              </button>

              <div className="d-flex align-items-center gap-2">
                {selectedInquiry.email && (
                  <a
                    href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                      `Reply from Lucky Fruits Depot regarding your message`
                    )}&body=${encodeURIComponent(
                      `Hello ${selectedInquiry.name || "Customer"},\n\nThank you for reaching out to Lucky Fruits Jalgaon depot.\n\n`
                    )}`}
                    className="btn btn-success rounded-pill px-4 fw-bold"
                  >
                    <i className="fa-solid fa-reply me-1"></i>
                    Reply via Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dcontact;
