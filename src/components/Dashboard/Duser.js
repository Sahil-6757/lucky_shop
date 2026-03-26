import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import "./Dashboard.css";
import groovyWalkAnimation from "./Animation - 1726914106175.json";
function Duser() {
  const [User, setUser] = useState();

  async function getData() {
    axios.get("https://lucky-shop-backend.onrender.com/user").then((resp) => {
      setUser(resp.data);
      console.log(User);
    });
  }

  const handleDelete = (index) => {
    try {
      axios
        .delete(`https://lucky-shop-backend.onrender.com/userDelete/${index}`)
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
    <>
      <table className="container user-table table">
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
                <tr>
                  <th className="text-center" scope="row" key={index}>
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
            <div className="loading">
              <div className="sub-loading">

              <Lottie
                style={{ marginBottom: "6rem" }}
                animationData={groovyWalkAnimation}
              />
              </div>
            </div>
          )}
        </tbody>
      </table>
    </>
  );
}

export default Duser;
