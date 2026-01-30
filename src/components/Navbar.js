import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function Navbar() {
  const { login, setLogin } = useContext(AuthContext);
  const { count, setCount } = useContext(AuthContext);
  // function countItem() {
  //   let items = JSON.parse(localStorage.getItem("Items"));
  //   setcount(items.length);
  // }

  const handleLogout = () => {
    toast.success("Logout Successfully", {
      position: "bottom-center",
      autoClose: 1000,
    });
    localStorage.setItem("Login", false);
    setLogin(false)
  };

  useEffect(() => {
    try {
      let userLogin = localStorage.getItem("Login");
      setLogin(JSON.parse(userLogin));
      console.log(login)
    } catch (error) {}
  }, []);

  return (
    <>
      <div className="navbar">
        <div className="container">
          <a className="navbar-brand text-success" href="/">
            <Link to={"/"} className="nav-link active luckyFruits" aria-current="page">
              Lucky Fruits
            </Link>
          </a>
          {
            login ? (
              <Link to={"Dashboard"} className="nav-link active dashboard" aria-current="page">
                Dashboard
              </Link>
            ) : null
          }

          <div className="Navbar-login">
            <Link
              to="cart"
              className="fa-solid fa-cart-shopping cart-icon align-center"
            ></Link>
            <p className="cart-count">{count == null ? 0 : count}</p>
            {login ? (
              <Link to="login" className="btn login-btn mx-3">
                <h5 onClick={handleLogout}>Logout</h5>
              </Link>
            ) : (
              <Link to="login" className="btn login-btn mx-3">
                <h5>Login</h5>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* <nav className="navbar main-navbar  navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand text-success" href="/">
          <Link to={"/"} className="nav-link active" aria-current="page">
            Lucky Fruits
          </Link>
        </a>
  
        <div
          id="navbarSupportedContent"
          className="collapse navbar-collapse show"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
          <div className="Navbar-login">
            <Link
              to="cart"
              className="fa-solid fa-cart-shopping cart-icon align-center"
            ></Link>
            <p className="cart-count">{count == null ? 0 : count}</p>
            {login.isloggedin ? (
              <Link to="login" className="btn login-btn mx-3">
                <h5 onClick={handleLogout}>Logout</h5>
              </Link>
            ) : (
              <Link to="login" className="btn login-btn mx-3">
                <h5>Login</h5>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav> */}
    </>
  );
}

export default Navbar;
