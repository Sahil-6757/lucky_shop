import { useContext, useState } from "react";
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
   const output =  window.confirm("Are you sure you want to remove this item?") &&
      navigator.vibrate(100);
      console.log(output)
    if (!output) {
      return;
    }
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
            {Items.length === 0 ? (
              <p className="text-center text-muted">No Data Found</p>
            ) : (
              Items.map((value, index) => {
                return (
                  <div className="cart-items">
                    <div className="cart-left d-flex align-items-center gap-3 justify-content-center">
                      <img src={value.image} className="cart-image" alt="img" />

                      <div className="cart-info">
                        <h5>{value.name}</h5>
                        <p className="counter-rate">₹ {value.rate}</p>
                      </div>
                    </div>

                    <div className="cart-right">
                      <div className="counter">
                        <button onClick={() => handleDecrement(index)}>
                          -
                        </button>
                        <span>{value.count}</span>
                        <button onClick={() => handleIncrement(index)}>
                          +
                        </button>
                      </div>

                      <button
                        className="btn btn-danger remove-btn"
                        onClick={() => removeBtn(index)}
                      >
                        <i className="fa-solid fa-trash"></i> 
                      </button>
                    </div>
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
