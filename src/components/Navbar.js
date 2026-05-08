import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useRef, useState } from "react";
import siteIcon from "../assets/siteIcon.jpg";
function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();
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
    setLogin(false);
  };

  const handleBars = () => {
    setMenuOpen(!menuOpen);
  };

    const scrollTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };
  useEffect(() => {
    try {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      const userLogin = localStorage.getItem("Login");
      setLogin(userLogin === "true");
      console.log(userLogin);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    } catch (error) {}
  }, []);

  return (
    <>
      <div className="navbar">
        <a className="site-Title text-success" href="/" onClick={scrollTop}>
          <Link
            to={"/"}
            className="nav-link active luckyFruits"
            aria-current="page"
          >
            Lucky Fruits

          <img src={siteIcon} alt="Site Icon" className="site-icon" />
          </Link>
        </a>
        <div className="navbar-middle">
          <a className="navbar-brand text-success" onClick={scrollTop}>
            <Link
              to={"/aboutus"}
              className="nav-link active aboutus hover-link mx-2"
              aria-current="page"
            >
              About us
            </Link>
          </a>

          <a className="navbar-brand text-success" onClick={scrollTop}>
            <Link
              to={"/product"}
              className="nav-link active aboutus hover-link mx-2"
              aria-current="page"
            >
              Product
            </Link>
          </a>
          <a className="navbar-brand text-success" onClick={scrollTop}>
            <Link
              to={"/contactus"}
              className="nav-link active aboutus hover-link mx-2"
              aria-current="page"
            >
              Contact us
            </Link>
          </a>
        </div>

        <div className="profile-dropdown" ref={dropdownRef}>
          {login ? (
            <>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/dashboard" className="dropdown-item">
                    Dashboard
                  </Link>

                  <Link to="/profile" className="dropdown-item">
                    My Profile
                  </Link>

                  <div className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </>
          ) : (
            ""
          )}
        </div>

        <div className="Navbar-login">
          <Link
            to="cart"
            onClick={scrollTop}
            className="fa-solid fa-cart-shopping cart-icon align-center"
          ></Link>
           <Link
            to="profile"
            onClick={scrollTop}
            className="fa-solid fa-user mx-3 cart-icon align-center"
          ></Link>
           <Link
            to="login"
            onClick={scrollTop}
            className="fa-solid fa-sign-in mx-3 cart-icon align-center"
          ></Link>
          <p className="cart-count">{count == null ? 0 : count}</p>
          {/* {login ? (
            <Link to="login" className="btn login-btn mx-3">
              <h5 onClick={handleLogout}>Logout</h5>
            </Link>
          ) : (
            <Link to="login" className="btn login-btn mx-3">
              <h5>Login</h5>
            </Link>
          )} */}
          <i className="fa-solid fa-bars" onClick={handleBars}></i>
          {menuOpen && (
            <div className="mobile-menu">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link to="/aboutus" onClick={() => setMenuOpen(false)}>
                About
              </Link>
              <Link to="/contactus" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
              <Link to="/product" onClick={() => setMenuOpen(false)}>
                Product
              </Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                Cart
              </Link>

              {login && (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              )}

              {login ? (
                <div onClick={handleLogout}>Logout</div>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </div>
          )}
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
