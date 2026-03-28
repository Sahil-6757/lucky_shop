import axios from "axios";
import { useEffect, useState, useContext } from "react";
import "../App.css";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

function Product() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { count, setCount } = useContext(AuthContext);

  // ✅ Cart state
  const [item, setItem] = useState(
    JSON.parse(localStorage.getItem("Items")) || [],
  );

  const itemsPerPage = 8;

  useEffect(() => {
    axios
      .get("https://lucky-shop-backend.onrender.com/item")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // ✅ ADD TO CART FIXED
  const handleCard = (value) => {
    navigator.vibrate?.(100);

    let cartItems = JSON.parse(localStorage.getItem("Items")) || [];

    // ✅ Create name array
    const itemArray = cartItems.map((data) => data.name);

    if (itemArray.includes(value.name)) {
      toast.warn("Item already in cart", {
        position: "bottom-center",
        autoClose: 1000,
      });
      return;
    }

    let cart = {
      name: value.name,
      description: value.description,
      rate: value.rate,
      image: value.image,
      count: 1,
    };

    const updatedCart = [...cartItems, cart];

    setItem(updatedCart);
    localStorage.setItem("Items", JSON.stringify(updatedCart));
    setCount(updatedCart.length);

    toast.success("Added to Cart", {
      position: "bottom-center",
      autoClose: 1000,
    });
  };

  return (
    <div className="product-page">
      <h2 className="title">Product</h2>
      <hr />
      <h4 className="subtitle">Available Items</h4>

      <div className="product-container">
        {currentItems.map((item, index) => (
          <div key={index} className="product-card">
            <img src={item.image} alt={item.name} />

            <div className="product-body">
              <h5>{item.name}</h5>
              <p className="desc">{item.description}</p>
              <p className="price">₹ {item.rate}</p>

              <button className="AddtoCart" onClick={() => handleCard(item)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Product;
