import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { toast } from "react-toastify";

function Dorder() {
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const [Order, setOrder] = useState([]);
  const getData = () => {
    axios.get("https://lucky-shop-backend.onrender.com/order").then((resp) => {
      console.log(resp.data);
      setOrder(resp.data);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const rows = Order.map((value) => {
    createData(value.name, value.email);
  });

  const handleDelete = (e,name) => {
    let ask = window.confirm(`Are you sure you want to delete order of ${name}?`);
    if (!ask) return;
    axios
      .delete(`https://lucky-shop-backend.onrender.com/delete-order/${e}`)
      .then((resp) => {
        toast.success("Order Deleted Successfully",{
          autoClose: 1000,
          position:"top-center"
        });
      });
    getData();
  };

  return (
    <>
    <div className="order-table">
      <table className=" table container table-hover">
        <thead>
          <tr className="text-center">
            <th scope="col">No</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Address</th>
            <th scope="col">Mobile</th>
            <th scope="col">Items</th>
            <th scope="col">Total</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableContainer className="mx-2" component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Address&nbsp;</TableCell>
            <TableCell align="right">Mobile&nbsp;</TableCell>
            <TableCell align="right">Items&nbsp;</TableCell>
            <TableCell align="right">Total&nbsp;</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            
            
            
            
            {Order.map((row) => (
              <TableRow
            key={row.name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
            <TableCell component="th" scope="row">
            {row.name}
              </TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{row.address}</TableCell>
              <TableCell align="right">{row.mobile}</TableCell>
              <TableCell align="right">{row.items.map((value)=>{
                return(
                  <>
                  <p>Item Name = {value.name}</p> 
                  <p>Item rate = {value.rate}</p> 
                  
                  </>
                  
                  )
                  })}</TableCell>
                  <TableCell align="right">{row.total}</TableCell>
                  </TableRow>
                  ))}
        </TableBody>
        </Table>
    </TableContainer> */}

          {Order.map((value, index) => {
            return (
              <tr key={index + 1}>
                <th scope="row">{index + 1}</th>
                <td>{value.name}</td>
                <td>{value.email}</td>
                <td>{value.address}</td>
                <td>{value.mobile}</td>
                <td>
                  {value.items.map((value, index) => {
                    return (
                      <>
                        <li key={index + 1} style={{listStyle:"none", textAlign:"left", marginBottom:"5px", width:"200px"}}>
                          {value.name} : {value.rate} * {value.count} 
                        </li>
                      </>
                    );
                  })}
                </td>
                <td>{value.total}</td>
                <td>
                  <i
                    class="fa-solid fa-check"
                    style={{ fontSize: "1.4rem" }}
                  ></i>
                  {/* <button className="btn btn-primary">Complete</button> */}
                </td>
                <td>
                  <i
                    class="fa-solid fa-trash text-danger"
                    
                    onClick={() => handleDelete(value._id,value.name)}
                    ></i>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
          </div>
    </>
  );
}

export default Dorder;
