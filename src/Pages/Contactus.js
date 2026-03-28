import { useEffect, useState } from "react";
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

 // Mobile validation
    if (name === "mobile") {
      if (!/^\d*$/.test(value) || value.length > 10) {
        return; // ❌ block non-numeric input
      }
    }
    // ✅ Only allow gmail emails
    if (name === "email") {
      if (value && !value.endsWith("@gmail.com")) {
        // allow typing but block invalid full entry if needed

        setFormData({ ...formData, [name]: value });
        return;
      }
    }

    // ✅ Allow only letters and space
    if (name === "name") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        return; // ❌ block numbers & special chars
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // ✅ fetch contact data
  const getData = async () => {
    try {
      const res = await axios.get(
        "https://lucky-shop-backend.onrender.com/contact",
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

  async function getuserData(){
    const userDetails = await JSON.parse(localStorage.getItem("userDetails"));
    if(userDetails){
      setFormData({
        name: userDetails.name || "",
        email: userDetails.email || "",
        mobile: userDetails.mobile || "",
        address: userDetails.address || "",
      });
    }
  }

  // ✅ correct useEffect
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("Items")) || [];
    setItem(storedCart);
    setCount(storedCart.length);
    getData();
    getItems();
    getuserData();
  }, []);

  // ✅ submit form
  const submit = (e) => {
    e.preventDefault();

    if (!(formData.name && formData.email && formData.message)) {
      toast.warn("Fields are empty", {
        position: "bottom-center",
        autoClose: 1000,
      });
      return;
    }

    // 🔥 STRICT GMAIL VALIDATION
    const email = formData.email.toLowerCase().trim();

    if (!email.endsWith("@gmail.com")) {
      toast.error("Only Gmail (@gmail.com) is allowed ❌", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return; // ❌ STOP API CALL
    }

    if (formData.message.length < 25) {
      toast.error("Message must be at least 25 characters long ❌", {
        position: "bottom-center",
        autoClose: 1500,
      });
      return;
    }

    // ✅ IF VALID → SEND TO DATABASE
    axios
      .post("https://lucky-shop-backend.onrender.com/contact", formData)
      .then((resp) => {
        if (resp.data.message) {
          toast.success("Message Sent Successfully ✅", {
            autoClose: 1000,
            position: "bottom-center",
          });

          getData();
          clearForm();
        } else {
          toast.error("Only Gmail addresses are allowed ❌", {
            position: "bottom-center",
            autoClose: 1000,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Server Error ❌", {
          position: "bottom-center",
          autoClose: 1000,
        });
      });
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center", color: "green" }}>Contact us</h2>
      <hr />
      <h3 style={{ color: "blue", textAlign: "center" }}>Get in Touch</h3>
      <p style={{ textAlign: "center" }}>
        We would love to hear from you! Whether you have a question about our
        products, need assistance with your order, or just want to share your
        feedback, feel free to reach out to us. Our team is here to help and
        ensure you have the best experience with LuckyFruits.
      </p>

      <div className="form-content">
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

        <form onSubmit={submit} className="contact-input">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name} // ✅ controlled input
            onChange={handleChange}
            className="form-control my-2"
          />
          <label htmlFor="mobile">Mobile</label>
          <input
            type="number"
            name="mobile"
            placeholder="Enter 10-digit Mobile Number"
            value={formData.mobile} // ✅ controlled input
            onChange={handleChange}
            maxLength="10"
            className="form-control my-2"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
            title="Only Gmail addresses allowed"
            value={formData.email}
            onChange={handleChange}
            className="form-control my-2"
          />
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            rows={3}
            placeholder="Message"
            value={formData.message}
            minLength={25}
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
       <div className="about-us">
          <div className="row">
            <div className="col-md-6">
              <h3 className="text-center shop-name">
                Lucky Maharashtra Nariyal Suppliers
              </h3>
              <h6 className="text-center">
                We are the wholesaler of Green Coconut, Mango, Pineapple, Apple,
                Chicoo, Orange, Grapes, Pomegranate, etc
              </h6>
              <h6 className="text-center shop-name">
                We are offering Home Delivery Service Excellent Quality of
                Fruits are available
              </h6>
              <h5 className="text-center shop-name">
                Address : Shop No.293, Basement, New.B.J. Market, Jalgaon
              </h5>

              <p className="text-center shop-name fw-semibold">
                Feel Free to Contact Us
              </p>
              <p className="text-center shop-name">
                <i className="fa-solid fa-phone"></i> +91 9822516757 <br />
                <i className="fa-solid fa-phone"></i> +91 8983306757
              </p>
            </div>

            <div className="col-md-6">
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.553823638174!2d75.56621797400855!3d21.010514988407337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90fa67a280937%3A0x110c4a0c9002729e!2sLucky%20Maharashtra%20Nariyal%20Suppliers!5e0!3m2!1sen!2sin!4v1708224901113!5m2!1sen!2sin"
                  className="map-iframe"
                  title="g-map"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Contactus;
