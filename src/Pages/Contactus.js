import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ import toast
import "react-toastify/dist/ReactToastify.css";
import "../App.css";
function Contactus() {
  const [item, setItem] = useState([]);
  const [count, setCount] = useState(0); // ✅ added
  const [data, setData] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // ✅ handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ fetch contact data
  const getData = async () => {
    try {
      const res = await axios.get(
        "https://lucky-shop-backend.onrender.com/contact"
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ dummy function (if needed)
  const getItems = () => {
    console.log("Get items called");
  };

  // ✅ clear form properly
  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  // ✅ correct useEffect
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("Items")) || [];
    setItem(storedCart);
    setCount(storedCart.length);
    getData();
    getItems();
  }, []);

  // ✅ submit form
  const submit = (e) => {
    e.preventDefault();

    if (!(formData.email && formData.message && formData.name)) {
      toast.warn("Fields are empty");
      return;
    }

    axios
      .post("https://lucky-shop-backend.onrender.com/contact", formData)
      .then((resp) => {
        if (resp.data.message) {
          toast.success("Message Sent Successfully ✅",{
            autoClose: 1000,
            position: "bottom-center",
          });

          getData();
          clearForm();
        } else {
          toast.error("Something went wrong ❌");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Server Error ❌");
      });
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "green" }}>
        Contact us
      </h1>
      <hr />
<h3 style={{ color: "blue", textAlign: "center" }}>Get in Touch</h3>
      <p style={{ textAlign: "center" }}>
        We would love to hear from you! Whether you have a question about our
        products, need assistance with your order, or just want to share your
        feedback, feel free to reach out to us. Our team is here to help and
        ensure you have the best experience with LuckyFruits.
      </p>
       <div className="contact-info">
         <div className="contact-item">
           <h4>Email</h4>
           <p>contact@blogbeast.in</p>
         </div>
         <div className="contact-item">
           <h4>Phone</h4>
           <p>+91 9822516757</p>
         </div>
       </div>

      <form onSubmit={submit}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name} // ✅ controlled input
          onChange={handleChange}
          className="form-control my-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="form-control my-2"
        />

        <textarea
          name="message"
          rows={3}
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="form-control my-2"
        ></textarea>

        <input
          type="submit"
          className="btn btn-primary my-2"
          value="Submit"
        />
      </form>
    </div>
  );
}

export default Contactus;