import React from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";

function DNavbar() {
  // function menuBtnChange() {
  //   if (sidebar.classList.contains("open")) {
  //     closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
  //   } else {
  //     closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  //   }
  // }

  const handleBars = () => {};
  return (
    <>
    
      <div className="left-panel">
        <ul>
          {/* <li>
            <i className="fa-icon fa-solid fa-bars p-4"></i>
          </li> */}

          <Link to={"dHome"} className="link my-4">
            <i className="fa-icon fa-solid fa-house"></i>
            <span className="nav-title">Home</span>
          </Link>

          <Link to={"dItem"} className="link my-4">
            <i className="fa-icon fa-solid fa-list "></i>
            <span className="nav-title">Items</span>
          </Link>
          <Link to={"dOrder"} className="link my-4">
            <i className="fa-icon fa-solid Dnavbar-shopping-cart fa-cart-shopping "></i>
            <span className="nav-title">Order</span>
          </Link>
          <Link to={"dContact"} className="link my-4">
            <i className="fa-icon fa-solid fa-id-card"></i>
            <span className="nav-title">Contacts</span>
          </Link>
          <Link to={"dUser"} className="link my-4">
            <i className="fa-icon fa-solid fa-user "></i>
            <span className="nav-title">Users</span>
          </Link>
          <Link to={"dSetting"} className="link my-4">
            <i className="fa-icon fa-solid fa-gear "></i>
            <span className="nav-title">Settings</span>
          </Link>
        </ul>
      </div>
    </>
  );
}

export default DNavbar;
