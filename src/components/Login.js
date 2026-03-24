import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import siteIcon from "../assets/siteIcon.jpg";
import "../App.css";

function Login() {
  const { login, setLogin } = useContext(AuthContext);

  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // async function getData() {
  //   axios.get("https://lucky-shop-backend.onrender.com").then((resp) => {
  //     console.log(resp.data);
  //   });
  // }

  const loginBtn = (e) => {
    e.preventDefault();
    if (!(formData.email && formData.password)) {
      toast.warn("Fields are empty", {
        autoClose: 1000,
        pauseOnFocusLoss: false,
      });
    } else {
      axios
        .post("https://lucky-shop-backend.onrender.com/login", formData)
        .then((resp) => {
          let result = resp.data.message;
          if (result === "login Success") {
            toast.success("Login Success", {
              position: "top-center",
              autoClose: 1000,
            });
            navigation("/");
          } else if (result === "Admin login Success") {
            toast.success("Admin", {
              position: "top-center",
              autoClose: 1000,
            });
            navigation("/Dashboard");
            setLogin({ isloggedin: true });
            localStorage.setItem("Login", true);
          } else {
            toast.error("Invalid Username and Password", {
              position: "top-center",
              autoClose: 1000,
            });
          }
        })

        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      <div className="login-form container">
        <div className="site-image">
          <img
            src={siteIcon}
            alt="Login"
              style={{ width: "80%", height: "80%" }}
          />
        </div>
        <div className="login">
      <form action="" method="post">
          <div className="login">
            <input
              type="email"
              className="form-control login-input"
              name="email"
              onChange={handleChange}
              required
              id="email"
              placeholder="Email"
            />
            <input
              type="password"
              className="form-control login-input my-3"
              required
              name="password"
              onChange={handleChange}
              id="password"
              placeholder="Password"
            />
            <div className="login-register-btn">

            <button
              type="submit"
              className="btn btn-success"
              onClick={loginBtn}
              >
              Login
            </button>
            {/* <Link
              to="/register"
              style={{ backgroundColor: "#D7DBD4" }}
              className="register-btn btn  mx-3"
              >
              Register
            </Link> */}
              </div>
          </div>
        </form>
        </div>
  
      </div>
    </>
  );
}

export default Login;
