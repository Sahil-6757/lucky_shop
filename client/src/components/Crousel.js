import image1 from "../image/image1.jpg";
import image2 from "../image/image2.jpg";
import image3 from "../image/image3.jpg";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
      .get(`${process.env.REACT_APP_API_URL}/item`)
      .then((resp) => {
        setData(resp.data);
      })
      .catch((error) => {
        alert("Failed to fetch items. Please try again later.");
        console.error("Error fetching items:", error);
      });
  };

  async function getData() {
    axios.get(`${process.env.REACT_APP_API_URL}`).then((resp) => {
      setContact(resp.data);
    });
  }

  const handleCard = (value, index) => {
    navigator.vibrate(100);
    let cartItems = localStorage.getItem("Items");
    let parseData = JSON.parse(cartItems);
    parseData?.map((data) => {
      itemArray.push(data.name);
    });

    if (itemArray.includes(value.name)) {
      navigator.vibrate(200, 100, 200);
      toast.warn("Item already in cart", {
        position: "bottom-center",
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
        position: "bottom-center",
        autoClose: 1000,
      });

      // ✅ Correct way
      const updatedCart = [...item, cart];
      setItem(updatedCart);
      localStorage.setItem("Items", JSON.stringify(updatedCart));
      setCount(updatedCart.length);
    }
  };

  return (
    <>

      <div className="Banner">
        <img src={image1} alt="" className="w-100" />
        <div className="Banner-content">
          <h1 >Fresh Full Water <br /> <span className="text-white"> Green Coconut </span></h1>
          <button className="btn btn-success">Order Now</button>
        </div>
      </div>

      <div className="container my-3">
        <h4 className="text-center text-success">Fast Fruit Delivery</h4>
        <h5 className="text-center text-warning">
          Do Order with a wholesale price
        </h5>

        {Data ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500 }}
            loop={true}
            breakpoints={{
              576: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {Data.map((value, index) => (
              <SwiperSlide key={index}>
                <div
                  className="fruit-card"
                >
                  <img
                    src={value.image}
                    alt={value.name}
                    className="fruit-img"
                  />

                  <div className="fruit-body text-center">
                    <h5>{value.name}</h5>

                    <p className="small description">{value.description}</p>

                    <p className="fw-bold text-success">₹ {value.rate}</p>

                    <button className="btn btn-success btn-sm" onClick={() => handleCard(value, index)}>
                      Order Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-danger">No items available</p>
        )}
      </div>
    </>
  );
}

export default Crousel;
