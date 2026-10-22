import { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import siteIcon from "../../assets/siteIcon.jpg";
import "./DNavbar.css";

function DNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLogin } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState({ name: "Admin Operator", initial: "A" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("userDetails");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) {
          setAdminUser({
            name: parsed.name,
            initial: parsed.name.charAt(0).toUpperCase(),
          });
        } else if (parsed.email) {
          const emailName = parsed.email.split("@")[0];
          setAdminUser({
            name: emailName.charAt(0).toUpperCase() + emailName.slice(1),
            initial: emailName.charAt(0).toUpperCase(),
          });
        }
      }
    } catch (e) {
      // fallback to default
    }
  }, []);

  const isCurrent = (path) => {
    const current = location.pathname.toLowerCase();
    const target = path.toLowerCase();
    if (target === "dhome" && (current === "/dashboard" || current === "/dashboard/")) {
      return true;
    }
    return current.endsWith(target);
  };

  const handleLogout = () => {
    toast.success("Logged out successfully 👋", {
      position: "bottom-center",
      autoClose: 1000,
    });
    localStorage.setItem("Login", "false");
    setLogin(false);
    navigate("/login");
  };

  const navGroups = [
    {
      groupTitle: "Store & Catalog",
      groupIcon: "fa-solid fa-store",
      items: [
        { path: "dHome", label: "Dashboard Overview", icon: "fa-solid fa-chart-pie", badge: "Live" },
        { path: "dItem", label: "Fruit Inventory", icon: "fa-solid fa-apple-whole" },
        { path: "dOrder", label: "Customer Orders", icon: "fa-solid fa-cart-shopping" },
        { path: "dContact", label: "Inquiries & Messages", icon: "fa-solid fa-envelope-open-text" },
        { path: "dUser", label: "Registered Users", icon: "fa-solid fa-users" },
      ],
    },
    {
      groupTitle: "Finance & Operations",
      groupIcon: "fa-solid fa-vault",
      items: [
        { path: "dSetting", label: "Daily Transactions", icon: "fa-solid fa-money-bill-transfer" },
        { path: "dAccount", label: "Bank Accounts", icon: "fa-solid fa-building-columns" },
        { path: "dVechicalBill", label: "Vehicle & Logistics", icon: "fa-solid fa-truck-fast" },
        { path: "dExpenses", label: "Expenses & Bills", icon: "fa-solid fa-receipt" },
      ],
    },
  ];

  return (
    <>
      {/* Top Mobile Bar for Dashboard (Visible only on tablets & phones) */}
      <div className="lucky-admin-mobile-topbar">
        <button
          type="button"
          className="lucky-admin-mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open Sidebar Menu"
        >
          <i className="fa-solid fa-bars"></i>
          <span>Menu</span>
        </button>

        <div className="lucky-admin-mobile-brand">
          <img src={siteIcon} alt="Lucky Fruits Logo" />
          <span>Lucky<span>Fruits</span></span>
        </div>

        <Link to="/" className="lucky-admin-mobile-store-btn" title="View Customer Store">
          <i className="fa-solid fa-store"></i>
        </Link>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="lucky-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Floating Toggle Button for Mobile Devices */}
      <button
        type="button"
        className="lucky-admin-mobile-toggle"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label="Toggle Dashboard Menu"
        title="Toggle Dashboard Menu"
      >
        <i className={mobileOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
      </button>

      {/* Main Admin Sidebar */}
      <aside className={`lucky-admin-sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="lucky-sidebar-header">
          <div className="lucky-sidebar-brand-wrapper">
            <div className="lucky-sidebar-logo-frame">
              <img src={siteIcon} alt="Lucky Fruits Admin Logo" />
              <span className="lucky-logo-online-dot" title="Depot Online"></span>
            </div>
            <div className="lucky-sidebar-brand-text">
              <h2 className="lucky-sidebar-brand-title">
                Lucky<span>Fruits</span>
              </h2>
              <div className="lucky-sidebar-suite-badge">
                <i className="fa-solid fa-shield-halved me-1"></i>
                Admin Suite
              </div>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            type="button"
            className="lucky-sidebar-close-btn d-md-none"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Depot Status Strip */}
        <div className="lucky-depot-strip">
          <div className="lucky-depot-pill">
            <span className="lucky-pulse-beacon"></span>
            <span className="lucky-depot-name">Jalgaon Depot</span>
            <span className="lucky-depot-divider">•</span>
            <span className="lucky-depot-status">Live</span>
          </div>
        </div>

        {/* Navigation Content */}
        <div className="lucky-sidebar-nav-content">
          {navGroups.map((group, gIdx) => (
            <div className="lucky-nav-group" key={gIdx}>
              <div className="lucky-nav-group-header">
                <i className={`${group.groupIcon} lucky-nav-group-icon`}></i>
                <h3 className="lucky-nav-group-label">{group.groupTitle}</h3>
              </div>
              <div className="lucky-nav-group-list">
                {group.items.map((navItem) => {
                  const active = isCurrent(navItem.path);

                  return (
                    <Link
                      key={navItem.path}
                      to={navItem.path}
                      className={`lucky-sidebar-link ${active ? "active" : ""}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <div className="lucky-link-main">
                        <div className="lucky-sidebar-link-icon">
                          <i className={navItem.icon}></i>
                        </div>
                        <span className="lucky-link-label">{navItem.label}</span>
                      </div>
                      <div className="lucky-link-meta">
                        {navItem.badge && (
                          <span className={`lucky-link-badge ${active ? "active" : ""}`}>
                            {navItem.badge}
                          </span>
                        )}
                        <i className="fa-solid fa-chevron-right lucky-link-arrow"></i>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="lucky-sidebar-footer">
          {/* Admin Identity Card */}
          <div className="lucky-admin-profile-card">
            <div className="lucky-admin-avatar">
              {adminUser.initial}
            </div>
            <div className="lucky-admin-info">
              <div className="lucky-admin-name" title={adminUser.name}>
                {adminUser.name}
              </div>
              <div className="lucky-admin-role">
                <span className="lucky-status-dot"></span>
                <span>Depot Manager</span>
              </div>
            </div>
          </div>

          <div className="lucky-sidebar-footer-actions">
            <Link
              to="/"
              className="lucky-sidebar-footer-link"
              title="View Live Customer Storefront"
            >
              <span>
                <i className="fa-solid fa-store me-2"></i>
                Live Storefront
              </span>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem" }}></i>
            </Link>

            <button
              type="button"
              className="lucky-sidebar-logout-btn"
              onClick={handleLogout}
              title="Sign out of Admin Dashboard"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default DNavbar;
