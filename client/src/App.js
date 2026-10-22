import "./App.css";
import Navbar from "./components/Navbar";
import Crousel from "./components/Crousel";
import { Route, Routes, Outlet, useLocation } from "react-router-dom";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Register from "./components/Register";
import DNavbar from "./components/Dashboard/DNavbar";
import Dhome from "./components/Dashboard/Dhome";
import Ditem from "./components/Dashboard/Ditem";
import Dorder from "./components/Dashboard/Dorder";
import Contactus from "./Pages/Contactus";
import Dcontact from "./components/Dashboard/Dcontact";
import Duser from "./components/Dashboard/Duser";
import Dashboard from "./components/Dashboard/Dashboard";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Dsetting from "./components/Dashboard/Dsetting";
import Dexpenses from "./components/Dashboard/Dexpenses";
import { useEffect } from "react";
import { AuthContextProvider } from "./context/AuthContextProvider";
import Aboutus from "./Pages/Aboutus";
import Footer from "./components/Footer";
import Product from "./Pages/Product";
import Profile from "./components/Profile";
import DVechical from "./components/Dashboard/Dvehical";
import Daccount from "./components/Dashboard/Daccount";
function App() {
  const location = useLocation();
  const isDashboard = location.pathname.toLowerCase().startsWith("/dashboard");

  useEffect(() => {
    const token = localStorage.getItem("login");
    if (token) {
    }
  }, []);

  return (
    <>
      <AuthContextProvider>
        <ToastContainer
          position="bottom-center"
        />
        {!isDashboard && <Navbar />}
        <Routes>
          <Route Component={Crousel} index="/" />
          <Route Component={Login} path="/login" />
          <Route Component={Aboutus} path="/aboutus" />
          <Route Component={Product} path="/product" />
          <Route Component={Contactus} path="/Contactus" />
          <Route Component={Register} path="/register" />
          <Route Component={Cart} path="/cart" />
          <Route Component={Checkout} path="/checkout" />
          <Route Component={Profile} path="/profile" />
          <Route Component={Dashboard} path="/Dashboard">
            <Route Component={Dhome} path="dHome" />
            <Route Component={Ditem} path="dItem" />
            <Route Component={Dorder} path="dOrder" />
            <Route Component={Dcontact} path="dContact" />
            <Route Component={Duser} path="dUser" />
            <Route Component={Dsetting} path="dSetting" />
            <Route Component={DVechical} path="dVechicalBill" />
            <Route Component={Dexpenses} path="dExpenses" />
            <Route Component={Daccount} path="dAccount" />
          </Route>
        </Routes>
        {!isDashboard && <Footer />}
      </AuthContextProvider>
    </>
  );
}

export default App;
