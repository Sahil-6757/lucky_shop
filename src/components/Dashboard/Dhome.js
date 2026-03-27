import axios from "axios";
import  { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import "./Dashboard.css";
import { Button } from "@mui/material";
function Dhome() {
  const [rows, setrows] = useState([]);
  const [data, setData] = useState([]);
  const [Id, setId] = useState();
  const [sales, setSales] = useState();
  const [salesTotal, setSalestotal] = useState();
  const [totalVal, setTotal] = useState();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    rate: "",
    quantity: "",
    total: "",
  });
  const date = new Date();
  let datee = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let Datee = `${year}-0${month + 1}-${datee}`;
  const [todayDate, setdate] = useState({
    date: Datee,
  });

  // const columns = [
  //   { field: "name", headerName: "Name", width: 130 },
  //   { field: "date", headerName: "Date", width: 130 },
  //   { field: "rate", headerName: "Rate", width: 130 },
  //   { field: "quantity", headerName: "Quantity", width: 130 },
  //   { field: "total", headerName: "Total", width: 130 },
  //   { field: "action", headerName: "Action", width: 130 },
  // ];

  const getData = () => {
    axios.get("https://lucky-shop-backend.onrender.com/sales").then((resp) => {
      setrows(resp.data);
    });
  };

  let result;

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value, total: totalVal });
  };

  function sum() {
    result = parseInt(formData.rate * formData.quantity);
    setTotal(result);
    setFormData({ ...formData, total: result });
  }

  // function totalSales() {
  //   let sum = data.reduce((curtval, accumulator) => {
  //     console.log(accumulator.quantity)
  //     return parseInt(curtval) + parseInt(accumulator.quantity);
  //   }, 0);

  //   setSales(sum)
  //   console.log(sales)
  // }

  function getsalesData() {
    axios
      .post("https://lucky-shop-backend.onrender.com/sales-result", todayDate)
      .then((resp) => {
        setData(resp.data);
        let result = resp.data;
        let sum = result.reduce((curtval, accumulator) => {
          // console.log(accumulator.quantity)
          return parseInt(curtval) + parseInt(accumulator.quantity);
        }, 0);
        setSales(sum);
        console.log(sum);
        let totalSum = result.reduce((curtval, accumulator) => {
          // console.log(accumulator.quantity)
          return parseInt(curtval) + parseInt(accumulator.total);
        }, 0);
        setSalestotal(totalSum);
        console.log(salesTotal);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleClick = (Eid, Ename, Edate, Erate, Equantity) => {
    document.getElementById("name").value = Ename;
    document.getElementById("date").value = Edate;
    document.getElementById("rate").value = Erate;
    document.getElementById("quantity").value = Equantity;
    setFormData({ name: Ename, date: Edate, rate: Erate, quantity: Equantity });
    setId(Eid);
    getData();
  };

  const handleEdit = () => {
    let name = document.getElementById("name").value;
    let date = document.getElementById("date").value;
    let rate = document.getElementById("rate").value;
    let quantity = document.getElementById("quantity").value;
    if (!(name, date, rate, quantity)) {
      toast.error("Fill the Form", {
        autoClose: 1000,
      });
    } else {
      axios
        .put(
          `https://lucky-shop-backend.onrender.com/sales-edit/${Id}`,
          formData
        )
        .then((resp) => {
          getData();
        });
      toast.success("Updated Succssfully", {
        autoClose: 1000,
      });
    }
    getData();
  };

  const handleDelete = (e, name) => {
    let result = window.confirm(`Are you really want to Delete ${name}`);
    console.log(result);
    if (result) {
      axios
        .delete(`http://localhost:8000/sales-delete/${e}`)
        .then(async (resp) => {
          getData();
          toast.success("Deleted Succssfully", {
            autoClose: 1000,
          });
          await getsalesData();
          document.getElementById("name").value = "";
          document.getElementById("date").value = "";
          document.getElementById("rate").value = "";
          document.getElementById("quantity").value = "";
        })
        .catch((error) => {});
      getData();
      getsalesData();
    }
  };

  const handleBlur = () => {
    sum();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !(formData.name && formData.date && formData.rate && formData.quantity)
    ) {
      toast.warn("Fields are empty", {
        autoClose: 1000,
        pauseOnFocusLoss: false,
      });
    } else {
      axios
        .post("https://lucky-shop-backend.onrender.com/sales", formData)
        .then((resp) => {});
      toast.success("Successfully Saved", {
        autoClose: 1000,
      });
      getsalesData();
      getData();
      document.getElementById("name").value = "";
      document.getElementById("date").value = "";
      document.getElementById("rate").value = "";
      document.getElementById("quantity").value = "";
      document.getElementById("name").focus();
      setFormData({ name: "", date: "", rate: "", quantity: "", total: "" });
    }
    getData();
  };

  const handleReset = () => {
    document.getElementById("name").value = "";
    document.getElementById("date").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("name").focus();
    setFormData({ name: "", date: "", rate: "", quantity: "", total: "" });
  };

  useEffect(() => {
    getData();
    getsalesData();
  }, []);
  return (
    <div className="container">
      <h3 className="text-success text-center">Daily Entry</h3>
      <div className="home-form">
        <form method="post" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            id="name"
            onChange={handleChange}
            className="form-control"
            placeholder="name"
          />
          <input
            type="date"
            name="date"
            id="date"
            onChange={handleChange}
            className="form-control my-1"
          />
          <input
            type="number"
            name="rate"
            id="rate"
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-control my-1"
            placeholder="rate"
          />
          <input
            type="number"
            name="quantity"
            id="quantity"
            onChange={handleChange}
            onBlur={handleBlur}
            className="form-control my-1"
            placeholder="quantity"
          />

          <hr />
          <h4 className="d-flex justify-content-center">Total = {totalVal}</h4>
          {/* <input type="submit" value="Save" className="btn btn-primary" /> */}

          <div className="buttons">

          <Button type="submit" variant="contained">
            
            Save
          </Button>

          <Button
            variant="contained"
            onClick={handleEdit}
            className="mx-3"
            color="success"
          >
            Update
          </Button>

          <Button
            variant="contained"
            onClick={handleReset}
            className="bg-danger"
            color="success"
          >
            Reset
          </Button>
          </div>

          {/* <input
          type="button"
          value="Update"
          onClick={handleEdit}
          className="mx-3 btn btn-secondary"
        /> */}
        </form>
      </div>
      <div className="rightBar">
        <div className="card" style={{ height: "6rem" }}>
          <div className="card-body ">
            <p className="card-text">
              Today's Sales : <b> {sales}</b>
            </p>
            <p className="card-text">
              Today's Total : <b> {salesTotal}</b>
            </p>
          </div>
        </div>
      </div>

      <div class="table-container">
        <table className="table table-hover">
          <thead className="table-head">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Date</th>
              <th scope="col">Rate</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((value, index) => {
              return (
                <tr
                  key={value._id}
                  onClick={() =>
                    handleClick(
                      value._id,
                      value.name,
                      value.date,
                      value.rate,
                      value.quantity
                    )
                  }
                  className="table-row"
                >
                  <th scope="row">{index + 1}</th>
                  <td>{value.name}</td>
                  <td>{value.date}</td>
                  <td>{value.rate}</td>
                  <td>{value.quantity}</td>
                  <td>{value.total}</td>
                  <td>
                    <i
                      className="fa-solid fa-trash text-danger mx-3 "
                      onClick={() => {
                        handleDelete(value._id, value.name);
                      }}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Material UI GridView */}
      {/* <DataGrid
      className="my-3"
        style={{ width: "50rem" }}
        rows={rows}
        getRowId={(row) => row._id}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        
      /> */}
      <Outlet />
    </div>
  );
}

export default Dhome;
