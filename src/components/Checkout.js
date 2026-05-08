import { useContext, useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { count, setCount } = useContext(AuthContext);
  const [Items, setItems] = useState([]);
  const [result, setresult] = useState();
  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    time: new Date().toLocaleString(),
    email: "",
    mobile: "",
    address: "",
    order: [],
    city: "",
    postalCode: "",
    order_id: "",
    status: "Pending",
    payement_id: "Cash on Delivery",
    total: "",
  });

  const getuserData = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        name: userDetails.name || "",
        email: userDetails.email || "",
        mobile: userDetails.mobile || "",
        address: userDetails.address || "",
      }));

    }
    getData();
  };

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Name validation
    if (name === "name") {
      newValue = value.replace(/[^A-Za-z\s]/g, "");
    }

    // Mobile validation
    if (name === "mobile") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Email formatting
    if (name === "email") {
      newValue = value.toLowerCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      order: Items,
      total: result,
    }));
  };

  async function getData() {
    const item = JSON.parse(localStorage.getItem("Items"));
    setItems(item || []);
  }

  function total() {
    let sum = Items.reduce((cur, item) => {
      return cur + item.rate * item.count;
    }, 0);
    setresult(sum);
  }

  // ✅ HANDLE ORDER (FIXED)
  const handleOrder = () => {
    navigator.vibrate(100);

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    // Gmail validation
    if (!gmailRegex.test(formData.email)) {
      toast.error("Only Gmail addresses are allowed", {
        position: "bottom-center",
        autoClose: 1000,
      });
      return;
    }

    // Required fields validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.mobile
    ) {
      toast.error("Fill all the information", {
        position: "bottom-center",
        autoClose: 1000,
      });
      return;
    }

    // API call
    axios
      .post("https://lucky-shop-backend.onrender.com/order", formData)
      .then((resp) => {
        if (resp.data.message === "success") {
          toast.success("Order Placed Successfully", {
            position: "bottom-center",
            autoClose: 1000,
          });

          localStorage.setItem("Items", "[]");
          setCount(0);
          navigation("/profile");

          const orderDetails = `
🛒 New Order
Name: ${formData.name}
Product: ${formData.order.map((item) => `${item.name} (${item.rate} x ${item.count})`).join(", ")}
Quantity: ${formData.order.reduce((total, item) => total + item.count, 0)}
Total: ${formData.total}
Mobile: ${formData.mobile}
Address: ${formData.address}
Note: If Distance is more than 2km then delivery charge will be applied. Please contact us for more details.
`;

          localStorage.setItem(
            "userDetails",
            JSON.stringify({
              name: formData.name,
              email: formData.email,
              mobile: formData.mobile,
              address: formData.address,
            }),
          );

          const url = `https://wa.me/918983306757?text=${encodeURIComponent(orderDetails)}`;
          window.open(url, "_blank");
        }
      });
  };

  useEffect(() => {
    getData();
    getuserData();
  }, []);

useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    order: Items,
    total: result,
  }));
  total();
}, [Items, result]);

  return (
    <div className="container">
      {/* NAME */}
      <div className="mb-3 my-3">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter Name"
        />
      </div>

      {/* EMAIL */}
      <div className="mb-3 my-3">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter Gmail (example@gmail.com)"
        />
      </div>

      {/* ADDRESS */}
      <div className="mb-3 my-3">
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="form-control"
          placeholder="Shipping Address"
        />
      </div>

      {/* MOBILE */}
      <div className="mb-3 my-3">
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="form-control"
          placeholder="Enter 10-digit Mobile No"
        />
      </div>

      {/* ITEMS */}
      <div className="Item_Details">
        <h5 className="text-center">Item Details</h5>
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Item Name</th>
              <th>Count</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Items.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.count}</td>
                <td>{item.rate}</td>
                <td>{item.count * item.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h5 className="result">Total = {result}</h5>
      </div>

      {/* BUTTON */}
      <div className="checkout-btn">
        <button
          className="btn btn-success"
          disabled={Items.length === 0}
          onClick={handleOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;
