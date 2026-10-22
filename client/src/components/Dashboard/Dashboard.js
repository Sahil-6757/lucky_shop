import { useContext, useEffect, useState } from "react";
import DNavbar from "./DNavbar";
import { Outlet, Navigate, Link } from "react-router-dom";
import "./Dashboard.css";
import { AuthContext } from "../../context/AuthContext";

function Dashboard() {
  const { login, setLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // ✅ Load login from localStorage
  useEffect(() => {
    const userLogin = localStorage.getItem("Login");
    setLogin(userLogin === "true");
    setLoading(false);
  }, []);

  // ✅ Prevent flicker
  if (loading) return null;

  // ❌ If not logged in → redirect
  if (!login) {
    return <Navigate to="/login" />;
  }

  // ✅ If logged in → show dashboard
  return (
    <div className="d-flex flex-column flex-md-row min-vh-100 w-100">
      <DNavbar />
      <div className="flex-grow-1 overflow-hidden dashboard-content-wrapper d-flex flex-column">
        {/* Dynamic Top Header for Dashboard */}
        <header className="bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center dashboard-top-header shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <h4 className="fw-bold m-0 text-dark header-shop-title">
              Lucky Fruits <span className="text-success" style={{ fontWeight: 600 }}>Administration</span>
            </h4>
            <span className="badge rounded-pill bg-light text-success border border-success-subtle px-3 py-1 d-none d-sm-inline-flex align-items-center gap-2">
              <span className="lucky-pulse-beacon" style={{ width: "6px", height: "6px" }}></span>
              Jalgaon Depot
            </span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Link
              to="/"
              className="btn btn-sm btn-outline-success rounded-pill px-3 py-1 fw-semibold d-inline-flex align-items-center gap-2"
              title="View Customer Store"
            >
              <i className="fa-solid fa-store"></i>
              <span className="d-none d-md-inline">Customer Store</span>
            </Link>
          </div>
        </header>
        <div className="flex-grow-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
