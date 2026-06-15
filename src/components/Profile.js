import axios from "axios";
import React, { useEffect, useState } from "react";
import "../App.css";
import { toast } from "react-toastify";
function Profile() {
  const [data, setdata] = useState(null);
  const [order, setOrder] = useState(null);
  const getuserData = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    setdata(userDetails);
  };
  function getOrderData() {
    axios
      .post("https://lucky-shop-backend.onrender.com/getorder", {
        data: data.email,
      })
      .then((res) => {
        console.log(res.data);
        // const sortedOrders = res.data.sort((a, b) => new Date(b.time) - new Date(a.time));
        setOrder(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleCancelOrder = (orderId) => {
    let ask = window.confirm(`Are you sure you want to cancel this order?`);
    if (!ask) return;
    axios
      .delete(`https://lucky-shop-backend.onrender.com/delete-order/${orderId}`)
      .then((resp) => {
        toast.success("Order Cancelled Successfully", {
          autoClose: 1000,
          position: "bottom-center",
        });
        getOrderData(); // Refresh order data after cancellation
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to cancel order");
      });
  };

  useEffect(() => {
    getuserData();
  }, []);

  useEffect(() => {
    if (data) {
      getOrderData();
    }
  }, [data]);
  return (
    <div className="container">
      <div className="card w-100">
        <div className="card-body">
          <h5 className="card-title">Name: {data ? data.name : "N/A"}</h5>
          <p className="card-text">Email: {data ? data.email : "N/A"}</p>
          <p className="card-text">Mobile: {data ? data.mobile : "N/A"}</p>
          <p className="card-text">Address: {data ? data.address : "N/A"}</p>
        </div>
      </div>
      <div className="card w-100 mt-4">
        <div className="card-body">
          <h5 className="card-title">Order History</h5>
          {order && order.length > 0 ? (
            <ul className="list-group list-group-flush">
              {order.map((item, index) => (
                <li key={index} className="list-group-item">
                  <strong>Order Name:</strong> {item.name}
                  <br />
                  <strong>Items:</strong>{" "}
                  {item.items
                    .map(
                      (subItem) =>
                        subItem.name +
                        " (Qty: " +
                        subItem.count +
                        "*" +
                        subItem.rate +
                        ")",
                    )
                    .join(", ")}
                  <br />
                  <strong>Time:</strong> {item.time}
                  <br />
                  <strong>Mobile:</strong> {item.mobile}
                  <br />
                  <strong>Address:</strong> {item.address}
                  <br />
                  <strong>Payment ID:</strong> {item.payement_id}
                  <br />
                  <strong>Total:</strong> {item.total}
                  {/* 🔥 CANCEL BUTTON */}
                  {item.status === "Pending" ? (
                    <button
                      className="btn btn-danger w-auto cancel-btn"
                      onClick={() => handleCancelOrder(item._id)}
                    >
                      Cancel Order
                    </button>
                  ) : (
                    <h6>Status: {item.status}</h6>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
