import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";
import "./Duser.css";

function Duser() {
  const [User, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "table"
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // Fetch all registered users from backend API
  const getData = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${process.env.REACT_APP_API_URL}/user`);
      if (Array.isArray(resp.data)) {
        setUser(resp.data);
      } else {
        setUser([]);
      }
    } catch (err) {
      console.error("Users Fetch Error:", err);
      toast.error("Could not fetch user accounts", {
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

  // Delete a customer account with confirmation
  const handleDelete = async (id, name) => {
    const ask = window.confirm(
      `Are you sure you want to permanently delete the account of ${name || "this user"}?`
    );
    if (!ask) return;

    try {
      const resp = await axios.delete(
        `${process.env.REACT_APP_API_URL}/userDelete/${id}`
      );
      if (resp.data.message === "Deleted") {
        toast.success("User account deleted successfully 🗑️", {
          autoClose: 1500,
          position: "bottom-center",
        });
        getData();
      } else {
        toast.error("Unable to delete user");
      }
    } catch (error) {
      console.error("User Delete Error:", error);
      toast.error("Failed to delete user", {
        position: "bottom-center",
        autoClose: 2000,
      });
    }
  };

  // Toggle password masking per user
  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Format date helper
  const formatDate = (rawTime) => {
    if (!rawTime) return "Active Member";
    try {
      const d = new Date(rawTime);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    } catch (e) {
      // ignore
    }
    return String(rawTime);
  };

  // Filtered and sorted user accounts
  const filteredUsers = useMemo(() => {
    let result = [...User];

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((u) => {
        const nameMatch = (u.name || "").toLowerCase().includes(q);
        const emailMatch = (u.email || "").toLowerCase().includes(q);
        const phoneMatch = String(u.phone || u.mobile || "").includes(q);
        const addrMatch = (u.address || "").toLowerCase().includes(q);
        return nameMatch || emailMatch || phoneMatch || addrMatch;
      });
    }

    // Sorting
    if (sortBy === "newest") {
      result.reverse();
    } else if (sortBy === "oldest") {
      // original order
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    return result;
  }, [User, searchQuery, sortBy]);

  return (
    <div className="container-fluid py-4 px-3 px-md-4 lucky-duser-page dashboard-main">
      {/* Hero Header Banner */}
      <div className="lucky-duser-hero">
        <h1 className="lucky-duser-hero-title">
          <i className="fa-solid fa-users-viewfinder text-emerald"></i>
          Registered Users <span>& Accounts</span>
        </h1>
        <p className="lucky-duser-hero-desc">
          Manage fruit store customer profiles, contact credentials, and account authentication records.
        </p>
      </div>

      {/* Metrics Row (3 Cards) */}
      <div className="lucky-user-metrics-grid">
        <div className="lucky-user-metric-card total">
          <div className="lucky-user-metric-info">
            <span className="lucky-user-metric-label">Registered Accounts</span>
            <span className="lucky-user-metric-val">{User.length}</span>
          </div>
          <div className="lucky-user-metric-icon">
            <i className="fa-solid fa-users"></i>
          </div>
        </div>

        <div className="lucky-user-metric-card active-users">
          <div className="lucky-user-metric-info">
            <span className="lucky-user-metric-label">Active Fruit Buyers</span>
            <span className="lucky-user-metric-val">{User.length}</span>
          </div>
          <div className="lucky-user-metric-icon">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
        </div>

        <div className="lucky-user-metric-card security">
          <div className="lucky-user-metric-info">
            <span className="lucky-user-metric-label">Account Security</span>
            <span className="lucky-user-metric-val" style={{ fontSize: "1.2rem", marginTop: "4px" }}>
              Encrypted Auth
            </span>
          </div>
          <div className="lucky-user-metric-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
        </div>
      </div>

      {/* Toolbar Strip */}
      <div className="lucky-user-toolbar">
        <div className="lucky-user-search">
          <i className="fa-solid fa-magnifying-glass lucky-user-search-icon"></i>
          <input
            type="text"
            className="lucky-user-search-input"
            placeholder="Search by customer name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="lucky-user-search-clear"
              onClick={() => setSearchQuery("")}
              title="Clear Search"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <div className="lucky-user-toolbar-right">
          <select
            className="lucky-user-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>

          <div className="lucky-user-view-toggles">
            <button
              type="button"
              className={`lucky-user-view-btn ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
              title="Cards View"
            >
              <i className="fa-solid fa-grip"></i>
              <span className="d-none d-sm-inline">Cards</span>
            </button>
            <button
              type="button"
              className={`lucky-user-view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table View"
            >
              <i className="fa-solid fa-table-list"></i>
              <span className="d-none d-sm-inline">Table</span>
            </button>
          </div>

          <button
            type="button"
            className="lucky-user-refresh-btn"
            onClick={getData}
            title="Refresh Users"
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
            <span className="visually-hidden">Loading users...</span>
          </div>
          <p className="mt-2 text-muted fw-semibold">Loading customer records...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="lucky-users-empty">
          <div className="lucky-empty-icon">
            <i className="fa-solid fa-user-xmark"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">No Users Found</h3>
          <p className="text-muted" style={{ maxWidth: "420px", fontSize: "0.9rem" }}>
            {searchQuery
              ? `No registered accounts matched "${searchQuery}". Try a different keyword.`
              : "No registered customer users in the system yet."}
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
        <div className="lucky-user-cards-grid">
          {filteredUsers.map((user, idx) => {
            const isPasswordVisible = !!visiblePasswords[user._id];
            const initials = getInitials(user.name);

            return (
              <div className="lucky-user-card" key={user._id || idx}>
                {/* Header */}
                <div className="lucky-user-card-header">
                  <div className="lucky-user-avatar">{initials}</div>
                  <div className="lucky-user-header-text">
                    <h3 className="lucky-user-name" title={user.name}>
                      {user.name || "Customer Account"}
                    </h3>
                    <div className="lucky-user-role-badge">
                      <i className="fa-solid fa-check-circle"></i>
                      <span>Verified Buyer</span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="lucky-user-card-body">
                  <div className="lucky-user-info-row">
                    <span className="lucky-user-info-label">
                      <i className="fa-solid fa-envelope"></i> Email
                    </span>
                    <span className="lucky-user-info-val" title={user.email}>
                      {user.email || "—"}
                    </span>
                  </div>

                  {(user.phone || user.mobile) && (
                    <div className="lucky-user-info-row">
                      <span className="lucky-user-info-label">
                        <i className="fa-solid fa-phone"></i> Phone
                      </span>
                      <a
                        href={`tel:${user.phone || user.mobile}`}
                        className="lucky-user-info-val text-decoration-none text-dark fw-bold"
                      >
                        {user.phone || user.mobile}
                      </a>
                    </div>
                  )}

                  {user.address && (
                    <div className="lucky-user-info-row">
                      <span className="lucky-user-info-label">
                        <i className="fa-solid fa-location-dot"></i> City/Addr
                      </span>
                      <span className="lucky-user-info-val" title={user.address}>
                        {user.address}
                      </span>
                    </div>
                  )}

                  {/* Masked Password */}
                  <div>
                    <span className="lucky-user-info-label mb-1">
                      <i className="fa-solid fa-key"></i> Password
                    </span>
                    <div className="lucky-password-box">
                      <span className="lucky-password-text">
                        {isPasswordVisible ? user.password || "••••••••" : "••••••••"}
                      </span>
                      <button
                        type="button"
                        className="lucky-password-toggle-btn"
                        onClick={() => togglePasswordVisibility(user._id)}
                        title={isPasswordVisible ? "Hide Password" : "Show Password"}
                      >
                        <i
                          className={
                            isPasswordVisible
                              ? "fa-solid fa-eye-slash"
                              : "fa-solid fa-eye"
                          }
                        ></i>
                      </button>
                    </div>
                  </div>

                  <div className="lucky-user-info-row mt-1">
                    <span className="lucky-user-info-label">
                      <i className="fa-regular fa-calendar"></i> Member Since
                    </span>
                    <span className="small text-muted">{formatDate(user.time)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="lucky-user-card-footer">
                  {user.email ? (
                    <a
                      href={`mailto:${user.email}`}
                      className="lucky-user-email-btn"
                      title="Send Email"
                    >
                      <i className="fa-solid fa-envelope"></i>
                      <span>Send Mail</span>
                    </a>
                  ) : (
                    <div></div>
                  )}

                  <button
                    type="button"
                    className="lucky-user-del-btn"
                    onClick={() => handleDelete(user._id, user.name)}
                    title="Delete Account"
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
        <div className="lucky-user-table-card table-responsive">
          <table className="lucky-user-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Customer</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Password</th>
                <th>Member Since</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const isPasswordVisible = !!visiblePasswords[user._id];
                const initials = getInitials(user.name);

                return (
                  <tr key={user._id || index}>
                    <td className="fw-bold text-muted">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="lucky-user-avatar"
                          style={{ width: "34px", height: "34px", fontSize: "0.85rem", borderRadius: "10px" }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{user.name || "Customer"}</div>
                          <div className="small text-muted">{user.address || "Jalgaon"}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-decoration-none text-dark fw-semibold">
                        {user.email}
                      </a>
                    </td>
                    <td>{user.phone || user.mobile || "—"}</td>
                    <td>
                      <div className="d-inline-flex align-items-center gap-2 bg-light px-2 py-1 rounded">
                        <span className="font-monospace small">
                          {isPasswordVisible ? user.password || "••••••••" : "••••••••"}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm p-0 text-muted"
                          onClick={() => togglePasswordVisibility(user._id)}
                          title="Toggle"
                        >
                          <i
                            className={
                              isPasswordVisible ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                            }
                            style={{ fontSize: "0.75rem" }}
                          ></i>
                        </button>
                      </div>
                    </td>
                    <td className="small text-muted">{formatDate(user.time)}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                        onClick={() => handleDelete(user._id, user.name)}
                        title="Delete User"
                      >
                        <i className="fa-solid fa-trash-can me-1"></i>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Duser;
