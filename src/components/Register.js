import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!(formData.email && formData.password && formData.name)) {
      toast.warn("Fields are empty", {
        autoClose: 1000,
      });
    } else {
      axios
        .post("https://lucky-shop-backend.onrender.com/register", formData)
        .then((resp) => {
          console.log(resp.data);
          if (resp.data.message) {
            toast.success("Success", {
              position: "top-right",
              autoClose: 1000,
            });

            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            setFormData({
              name: "",
              email: "",
              password: "",
            });

            navigation("/login");
          } else {
            toast.error("Error", {
              position: "top-right",
              autoClose: 1000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error, {
            theme: "light",
          });
        });
    }
  };

  return (
    <div className="login-form container">
      <form method="post" onSubmit={submit}>
        {" "}
        <div className="login">
          {" "}
          <input
            type="text"
            className="form-control"
            name="name"
            id="name"
            autoComplete="off"
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="email"
            className="form-control my-3"
            onChange={handleChange}
            name="email"
            autoComplete="off"
            id="email"
            placeholder="Email"
          />
          <input
            onChange={handleChange}
            autoComplete="off"
            type="password"
            className="form-control my-3"
            name="password"
            id="password"
            placeholder="Password"
          />
          <div className="register-footer">
            <button className="btn btn-success">Register</button>
            <Link
              to="/login"
              style={{ backgroundColor: "#D7DBD4" }}
              className=" btn mx-3"
            >
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
