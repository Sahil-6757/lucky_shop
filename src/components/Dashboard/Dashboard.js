import React, { useContext, useEffect, useState } from "react";
import DNavbar from "./DNavbar";
import { Outlet, Navigate } from "react-router-dom";
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
    <div>
      <DNavbar />
      <Outlet />
    </div>
  );
}

export default Dashboard;
