import  { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";
import Lottie from "lottie-react";
import groovyWalkAnimation from "./Animation - 1726914106175.json";

function Dcontact() {
  const [Contact, setContact] = useState();
  async function getData() {
    axios.get(`${process.env.REACT_APP_API_URL}`).then((resp) => {
      setContact(resp.data);
    });
  }

  const handleDelete = (item) => {
    try {
      axios.delete(`${process.env.REACT_APP_API_URL}/delete/${item}`).then((resp) => {
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
        <table className="table contact-table">
          <thead>
            <tr>
              <th scope="col">Sr.no</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Message</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {Contact ? (
              Contact.map((data, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">
                      {index + 1}
                    </th>
                    <td>{data.name} </td>
                    <td>{data.email}</td>
                    <td>{data.message}</td>
                    <td>
                      <input
                        type="button"
                        onClick={() => handleDelete(data._id)}
                        value="Delete"
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

export default Dcontact;
