import image1 from "../image/image1.jpg";
import image2 from "../image/image2.jpg";
import image3 from "../image/image3.jpg";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
// import coconut from "../image/coconut.webp";

function Crousel() {
  let itemArray = [];
  const { count, setCount } = useContext(AuthContext);
  const [item, setItem] = useState([]);
  const [contact, setContact] = useState();
  const [Data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  function clearForm() {
    setFormData({
      name: "",
      email: "",
      message: "",
    });
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  try {
    useEffect(() => {
      const storedCart = JSON.parse(localStorage.getItem("Items")) || [];
      setItem(storedCart);
      setCount(storedCart.length);
      getData();
      getItems();
    }, []);
  } catch (error) {
    console.log(error);
  }

  const getItems = async () => {
    await axios
      .get("https://lucky-shop-backend.onrender.com/item")
      .then((resp) => {
        setData(resp.data);
      });
  };

  async function getData() {
    axios.get("https://lucky-shop-backend.onrender.com").then((resp) => {
      setContact(resp.data);
    });
  }

  const handleCard = (value, index) => {
    let cartItems = localStorage.getItem("Items");
    let parseData = JSON.parse(cartItems);
    parseData?.map((data) => {
      itemArray.push(data.name);
    });

    if (itemArray.includes(value.name)) {
      toast.warn("Item already in cart", {
        position: "top-center",
        autoClose: 1000,
      });
    } else {
      let cart = {
        name: value.name,
        description: value.description,
        rate: value.rate,
        image: value.image,
        count: 1,
      };

      

      toast.success("Added to Cart", {
        position: "top-center",
        autoClose: 1000,
      });

      // ✅ Correct way
      const updatedCart = [...item, cart];

      setItem(updatedCart);

      localStorage.setItem("Items", JSON.stringify(updatedCart));

      setCount(updatedCart.length);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!(formData.email && formData.message && formData.name)) {
      toast.warn("Fields are empty", {
        autoClose: 1000,
        pauseOnFocusLoss: false,
      });
    } else {
      axios
        .post("https://lucky-shop-backend.onrender.com/contact", formData)
        .then((resp) => {
          if (resp.data.message) {
            toast.success("Success", {
              position: "top-right",
              autoClose: 1000,
            });
            getData();
            clearForm();
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
          } else {
            toast.error("Error", {
              position: "top-right",
              autoClose: 1000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error, {
            theme: "light",
          });
        });
    }
  };
  return (
    <>
      <div id="carouselExampleCaptions" className="carousel slide">
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={image1} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Fresh Full Water Coconut</h5>
              <p>Daily import fresh coconut from various Konkan area.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={image2} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Second slide label</h5>
              <p>
                Some representative placeholder content for the second slide.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={image3} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Third slide label</h5>
              <p>
                Some representative placeholder content for the third slide.
              </p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="container my-3" style={{ width: "100%" }}>
        <h4 className="text-center text-success"> Fast Fruit Delivery </h4>
        <h5 className="text-center text-warning">
          Do Order with a wholesale price
        </h5>
        <div className="row">
          {Data.length < 0 ? (
            <p>No Data Found</p>
          ) : (
            Data.map((value, index) => {
              // console.log(value);
              return (
                <>
                  {index < 0 ? (
                    <p>No item Found</p>
                  ) : (
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4 item-card">
                      <div
                        className="fruit-card"
                        onClick={() => handleCard(value, index)}
                        key={value.image}
                        style={{ width: "20rem", height: "auto", left: "80px" }}
                      >
                        <img
                          src={value.image}
                          alt={value.image}
                          className="fruit-img"
                        />

                        <div className="fruit-body">
                          <h5 className="card-title text-center">
                            {value.name}
                          </h5>
                          <p className="card-text text-center">
                            {value.description}
                          </p>
                          <p className="card-text text-center ">
                            Rate: {value.rate}
                          </p>
                          <div className="buttonElement">
                            <button className="btn btn-success">
                              Order Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <img src={`data:${value.image.contentType};base64,${Buffer.from(value.image.data).toString('base64')}`} alt={value.image.data} style={{height:"23px", width:"23px"}}/> */}
                </>
              );
            })
          )}
        </div>
      </div>

      <div className="about-us">
        <h2 className="text-center">About Us</h2>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h3 className="text-center shop-name">
                Lucky Maharashtra Nariyal Suppliers
              </h3>
              <h6 className="text-center  ">
                We are the wholesaler of Green Coconut, Mango, Pineapple, Apple,
                Chicoo, Orange, Grapes, Pomegranate, etc
              </h6>
              <h6 className="text-center shop-name">
                We are offering Home Delivery Service Excellent Quality of
                Fruits are available
              </h6>
              <h5 className="text-center shop-name">
                Address : Shop No.293, Basement, New.B.J. Market, Jalgaon
              </h5>

              <p className="text-center shop-name fw-semibold">
                Feel Free to Contact Us{" "}
              </p>
              <p className="text-center shop-name">
                <i className="fa-solid fa-phone"></i>+91 9822516757 <br />
                <i className="fa-solid fa-phone"></i>+91 8983306757
              </p>
            </div>
            <div className="col-md-6 google-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.553823638174!2d75.56621797400855!3d21.010514988407337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90fa67a280937%3A0x110c4a0c9002729e!2sLucky%20Maharashtra%20Nariyal%20Suppliers!5e0!3m2!1sen!2sin!4v1708224901113!5m2!1sen!2sin"
                className="google-map"
                title="g-map"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-us">
        {/* <p>{josndata.message}</p> */}
        <h2 className="text-center">Contact Us</h2>
        <div className="container">
          <form action="" method="post" onSubmit={submit}>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              id="name"
              className="form-control my-2"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Email"
              onChange={handleChange}
              className="form-control my-2"
            />
            <textarea
              cols={3}
              name="message"
              id="message"
              onChange={handleChange}
              rows={3}
              className="form-control my-2"
              placeholder="Message"
            ></textarea>
            <input
              type="submit"
              className="btn btn-primary my-2"
              value="submit"
            />
          </form>
        </div>
        <h6 className="text-center my-5">
          {" "}
          Design and Developed By Arbaz khan
        </h6>
      </div>
    </>
  );
}

export default Crousel;
