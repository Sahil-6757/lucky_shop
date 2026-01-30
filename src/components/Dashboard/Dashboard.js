import React, { useContext, useEffect } from "react";
import DNavbar from "./DNavbar";
import { Outlet, redirect, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { AuthContext } from "../../context/AuthContext";

function Dashboard() {
  const { login, setLogin } = useContext(AuthContext);
  const navigation = useNavigate();

  return (
    <div>
      {login.isloggedin ? (
        <>
          <DNavbar />
          <Outlet />
        </>
      ) : (
        (window.location.href = "/login")
      )}
    </div>
  );
}

export default Dashboard;
