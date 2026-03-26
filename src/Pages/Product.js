import axios from "axios";
import  { useEffect, useState } from "react";
import "../App.css";
function Product() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  return (
    <div>
      <h3 className="text-center my-3">Product Page</h3>
      <hr />
      <h4 className="text-center">Available Items</h4>

      <div className="container">
        <div className="row">
          {currentItems.map((item, index) => (
            <div
              key={index} // ✅ FIX warning
              className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            >
              <div className="card h-100 shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.name}</h5>

                  <p className="card-text small description">
                    {item.description}
                  </p>

                  <p className="fw-bold item-rate text-success">
                    ₹ {item.rate}
                  </p>

                  <button className="btn btn-success mt-auto">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center my-4 flex-wrap">
          <button
            className="btn btn-secondary mx-2 mb-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          <span className="mx-3 align-self-center">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-secondary mx-2 mb-2"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product;
