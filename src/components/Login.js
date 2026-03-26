import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import siteIcon from "../assets/siteIcon.jpg";
import "../App.css";

function Login() {
  const { setLogin } = useContext(AuthContext);
  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginBtn = (e) => {
    e.preventDefault();

    if (!(formData.email && formData.password)) {
      toast.warn("Fields are empty", {
        autoClose: 1000,
      });
      return;
    }

    axios
      .post("https://lucky-shop-backend.onrender.com/login", formData)
      .then((resp) => {
        let result = resp.data.message;

        // ✅ NORMAL USER LOGIN
        if (result === "login Success") {
          toast.success("Login Success", {
            position: "top-center",
            autoClose: 1000,
          });

          setLogin(true); // 🔥 FIX
          localStorage.setItem("Login", "true"); // 🔥 FIX

          // navigation("/");
        }

        // ✅ ADMIN LOGIN
        else if (result === "Admin login Success") {
          toast.success("Admin Login", {
            position: "top-center",
            autoClose: 1000,
          });

          setLogin(true); // 🔥 FIX
          localStorage.setItem("Login", "true"); // 🔥 FIX

          navigation("/Dashboard");
        }

        // ❌ INVALID
        else {
          toast.error("Invalid Username and Password", {
            position: "top-center",
            autoClose: 1000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Server Error");
      });
  };

  return (
    <div className="login-form container">
      <div className="site-image">
        <img src={siteIcon} alt="Login" style={{ width: "80%" }} />
      </div>

      <div className="login">
        {/* ✅ FIXED form submit */}
        <form onSubmit={loginBtn}>
          <input
            type="email"
            className="form-control login-input"
            name="email"
            onChange={handleChange}
            required
            placeholder="Email"
          />

          <input
            type="password"
            className="form-control login-input my-3"
            name="password"
            onChange={handleChange}
            required
            placeholder="Password"
          />

          <div className="login-register-btn">
            <button type="submit" className="btn btn-success">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;