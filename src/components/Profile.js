import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Profile() {
    const [data, setdata] = useState(null)
    const [order, setOrder] = useState(null)
      const getuserData = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    setdata(userDetails);
  };
  function getOrderData() {
    axios.post("https://lucky-shop-backend.onrender.com/getorder", { data: data.email })
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
      })
      .catch((err) => {
        console.log(err);
      });   

  }
  useEffect(() => {
  getuserData();
}, []);

useEffect(() => {
  if (data) {
    getOrderData();
  }
}, [data]);
  return (
    <div className='container'>
      <div className="card w-100">
        <div className="card-body">
          <h5 className="card-title">Name: {data ? data.name : "Profile"}</h5>
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
                    
                  <strong>Order Name:</strong> {item.name}<br />
                  <strong>Items:</strong> {item.items.map((subItem) => subItem.name + " (Qty: " + subItem.count + "*"+subItem.rate+")").join(", ")}<br />
                  <strong>Time:</strong> {item.time}<br />
                  <strong>Mobile:</strong> {item.mobile}<br />
                  <strong>Address:</strong> {item.address}<br />

                  <strong>Payment ID:</strong> {item.payement_id}<br />
                  <strong>Total:</strong> {item.total}
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
