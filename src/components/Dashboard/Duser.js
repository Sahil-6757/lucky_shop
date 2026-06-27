import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import "./Dashboard.css";
import groovyWalkAnimation from "./Animation - 1726914106175.json";
function Duser() {
  const [User, setUser] = useState();

  async function getData() {
    axios.get(`${process.env.REACT_APP_API_URL}/user`).then((resp) => {
      setUser(resp.data);
      console.log(User);
    });
  }

  const handleDelete = (index) => {
    try {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/userDelete/${index}`)
        .then((resp) => {
          if (resp.data.message === "Deleted") {
            toast.success("Deleted Successfully", {
              autoClose: 1000,
              position: "top-right",
            });
            getData();
          } else {
          }
          console.log(resp.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container-fluid py-4 px-2 px-md-4 dashboard-main">
      <div className="table-responsive">
        <table className="table user-table">
          <thead>
            <tr>
              <th className="col text-center">Sr.no</th>
              <th className="col text-center">Name</th>
              <th className="col text-center">Email</th>
              <th className="col text-center">Password</th>
              <th className="col text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {User ? (
              User.map((value, index) => {
                return (
                  <tr key={index}>
                    <th className="text-center" scope="row">
                      {index + 1}
                    </th>
                    <td className="text-center">{value.name} </td>
                    <td className="text-center">{value.email}</td>
                    <td className="text-center">{value.password}</td>
                    <td className="text-center">
                      <input
                        type="button"
                        value="Delete"
                        onClick={() => handleDelete(value._id)}
                        className="btn btn-danger"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  <div className="d-flex justify-content-center align-items-center py-5">
                    <Lottie
                      style={{ height: "150px" }}
                      animationData={groovyWalkAnimation}
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Duser;
