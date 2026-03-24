import React, { useContext, useState } from "react";
import "../App.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Cart() {
  const [Items, setItems] = useState([]);
  const { count, setCount } = useContext(AuthContext);
  async function getData() {
    const item = await JSON.parse(localStorage.getItem("Items"));
    setItems(item);
  }

  useEffect(() => {
    getData();
  }, []);

  const removeBtn = (index) => {
    const newItems = Items.filter((_, i) => i !== index);
    localStorage.setItem("Items", JSON.stringify(newItems));
    setItems(newItems);
    let countItem = JSON.parse(localStorage.getItem("Items"));
    setCount(countItem.length);
    getData();
  };

  const handleDecrement = (index) => {
    const newItems = [...Items];
    if (newItems[index].count > 1) {
      newItems[index].count -= 1;
      localStorage.setItem("Items", JSON.stringify(newItems));
      setItems(newItems);
    }
  };

  const handleIncrement = (index) => {
    const newItems = [...Items];
    newItems[index].count += 1;
    localStorage.setItem("Items", JSON.stringify(newItems));
    setItems(newItems);
  };

  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="cart-container">
            <div className="header">
              <h2 className="text-center text-success">Cart </h2>
            </div>

            <hr />
            {Items == null ? (
              <p className="text-center">No Data Found</p>
            ) : (
              Items.map((value, index) => {
                return (
                  <div
                    className="cart-items my-2"
                    style={{
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      padding: 10,
                    }}
                  >
                      <img
                        src={value.image}
                        className="cart-image"
                        alt="image"
                      />
                      <h4 className="px-2">{value.name}</h4>
                      {/* <p className="px-2" >{value.description}</p> */}
                      <div className="counter">
                      <p className="counter-rate">{value.rate}</p>
                      <button className="decrement" onClick={() => handleDecrement(index)}>-</button>
                      <span className="count-value">{value.count}</span>
                      <button className="increment" onClick={() => handleIncrement(index)}>+</button>
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => removeBtn(index)}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                  </div>
                );
              })
            )}

            <hr />

            <div className="checkout-btn">
              {Items == null ? (
                ""
              ) : (
                <Link
                  to={"/checkout"}
                  className="btn btn-success"
                  disabled={Items.length > 0 ? false : true}
                >
                  Checkout
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
