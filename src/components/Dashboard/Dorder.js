import axios from "axios";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import { toast } from "react-toastify";

function Dorder() {
  const [Order, setOrder] = useState([]);
  const getData = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/order`).then((resp) => {
      console.log(resp.data);
      setOrder(resp.data);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/updateOrderStatus/${id}`,
        { status }
      );

      toast.success(`Order marked as ${status}`, {
        position: "top-center",
        autoClose: 1000,
      });

      getData(); // refresh
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (e, name) => {
    let ask = window.confirm(
      `Are you sure you want to delete order of ${name}?`
    );
    if (!ask) return;
    axios
      .delete(`${process.env.REACT_APP_API_URL}/delete-order/${e}`)
      .then((resp) => {
        toast.success("Order Deleted Successfully", {
          autoClose: 1000,
          position: "top-center",
        });
      });
    getData();
  };

  return (
    <div className="container-fluid py-4 px-2 px-md-4 dashboard-main">
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr className="text-center">
              <th scope="col" style={{ textAlign: "left" }}>
                No
              </th>
              <th scope="col" style={{ textAlign: "left" }}>
                Name
              </th>
              <th scope="col" style={{ textAlign: "left" }}>
                Email
              </th>
              <th scope="col" style={{ textAlign: "left" }}>
                Address
              </th>
              <th scope="col" style={{ textAlign: "left" }}>
                Mobile
              </th>
              <th scope="col" style={{ textAlign: "left" }}>
                Items
              </th>
              <th scope="col" style={{ textAlign: "left" }}>
                Total
              </th>
              <th scope="col" style={{ textAlign: "left" }}>
                Status
              </th>
              <th scope="col" style={{ textAlign: "left" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {Order.map((value, index) => {
              return (
                <tr key={value._id || index}>
                  <th scope="row">{index + 1}</th>
                  <td style={{ textAlign: "left" }}>{value.name}</td>
                  <td style={{ textAlign: "left" }}>{value.email}</td>
                  <td style={{ textAlign: "left" }}>{value.address}</td>
                  <td style={{ textAlign: "left" }}>{value.mobile}</td>
                  <td>
                    {value.items.map((itemVal, idx) => {
                      return (
                        <li
                          key={idx}
                          style={{
                            listStyle: "none",
                            textAlign: "left",
                            marginBottom: "5px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {itemVal.name} : {itemVal.rate} * {itemVal.count}
                        </li>
                      );
                    })}
                  </td>
                  <td>{value.total}</td>
                  <td>
                    {value.status === "Pending" ? (
                      <>
                        <button
                          className="btn btn-success btn-sm mx-1"
                          onClick={() => handleStatusChange(value._id, "Delivered")}
                        >
                          Deliver
                        </button>

                        <button
                          className="btn btn-warning btn-sm mx-1"
                          onClick={() => handleStatusChange(value._id, "Cancelled")}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <h6>Status: {value.status}</h6>
                    )}
                  </td>
                  <td>
                    <i
                      className="fa-solid fa-trash text-danger"
                      onClick={() => handleDelete(value._id, value.name)}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dorder;
