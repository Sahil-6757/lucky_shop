import  { useContext, useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

function Checkout() {
  const { count, setCount } = useContext(AuthContext);
  const [Items, setItems] = useState([]);
  const [result, setresult] = useState();

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
    payement_id: "Cash on Delivery",
    total: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value, order: Items, total: result });
  };

  async function getData() {
    const item = await JSON.parse(localStorage.getItem("Items"));
    setItems(item);
  }
  function total() {
    let sum = Items.reduce((curtval, accumulator) => {
      return parseInt(curtval) + parseInt(accumulator.rate * accumulator.count);
    }, 0);
    setresult(sum);
  }
  const handleOrder = () => {
    if (
      (formData.name === "" && formData.email === "" && formData.address === "",
      formData.mobile === "")
    ) {
      toast.error("Fill the information", {
        position: "top-center",
        autoClose: 1000,
      });
    } else {
      axios
        .post("https://lucky-shop-backend.onrender.com/order", formData)
        .then((resp) => {
          let message = resp.data.message;
          if (message === "success") {
            toast.success("Order Placed Successfully", {
              position: "bottom-center",
              autoClose: 1000,
            });
            localStorage.setItem("Items", "[]");
            let countItem = JSON.parse(localStorage.getItem("Items"));
            setCount(countItem.length);
            // navigation("/");
            const orderDetails = `
🛒 New Order
Name: ${formData.name}
Product: ${formData.order.map((item) => `${item.name} (x${item.count})`).join(", ")}
Quantity: ${formData.order.reduce((total, item) => total + item.count, 0)}
Total: ${formData.total}
Address: ${formData.address}
Note: If Shipping Address is longer than 2KM then Additional Charges will be applied. Please contact us for more details.
  `;
            const url = `https://wa.me/${+918983306757}?text=${encodeURIComponent(orderDetails)}`;
            window.open(url, "_blank");
          }
        });
    }
  };

  setTimeout(() => {
    total();
  }, 300);
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container">
      <div className="mb-3 my-3">
        <input
          type="text"
          onChange={handleChange}
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="name"
          name="name"
        />
      </div>
      <div className="mb-3 my-3">
        <input
          onChange={handleChange}
          type="email"
          name="email"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="name@example.com"
        />
      </div>
      <div className="mb-3 my-3">
        <input
          type="text"
          onChange={handleChange}
          name="address"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Shipping Address"
        />
      </div>
      <div className="mb-3 my-3">
        <input
          type="number"
          onChange={handleChange}
          name="mobile"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Mobile No"
        />
      </div>

      <div className="Item_Details">
        <h5 className="text-center">Item Details</h5>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Item Name</th>
              <th scope="col">Item Description</th>
              <th scope="col">Item Count</th>
              <th scope="col">Item Rate</th>
            </tr>
          </thead>
          <tbody>
            {Items.map((value, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{value.name}</td>
                  <td style={{ width: "50%" }}>{value.description}</td>
                  <td>{value.count}</td>
                  <td>{value.rate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="total">
          <div className="total-price">
            <h5>Total = {result}</h5>
          </div>
        </div>
      </div>

      <div className="checkout-btn">
        <button
          className="btn btn-success"
          disabled={Items.length > 0 ? false : true}
          onClick={handleOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;
