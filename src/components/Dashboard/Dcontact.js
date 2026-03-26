import  { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Dashboard.css";
import Lottie from "lottie-react";
import groovyWalkAnimation from "./Animation - 1726914106175.json";

function Dcontact() {
  const [Contact, setContact] = useState();
  async function getData() {
    axios.get("https://lucky-shop-backend.onrender.com").then((resp) => {
      setContact(resp.data);
    });
  }

  const handleDelete = (item) => {
    try {
      axios.delete(`https://lucky-shop-backend.onrender.com/delete/${item}`).then((resp) => {
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

      <table className="container contact-table table ">
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
                <tr>
                  <th scope="row" key={index}>
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
            <div className="loading">
            <Lottie
              style={{ marginBottom: "6rem" }}
              animationData={groovyWalkAnimation}
            />
          </div>
          )}
        </tbody>
      </table>
    </>
  );
}

export default Dcontact;
