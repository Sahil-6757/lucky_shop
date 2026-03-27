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
      <div id="carouselExampleCaptions" className="carousel slide" style={{top:"-10px"}}>
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

    <div className="container my-3">
  <h4 className="text-center text-success">Fast Fruit Delivery</h4>
  <h5 className="text-center text-warning">
    Do Order with a wholesale price
  </h5>

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
          onClick={() => handleCard(value, index)}
        >
          <img
            src={value.image}
            alt={value.name}
            className="fruit-img"
          />

          <div className="fruit-body text-center">
            <h5>{value.name}</h5>

            <p className="small description">
              {value.description}
            </p>

            <p className="fw-bold text-success">
              ₹ {value.rate}
            </p>

            <button className="btn btn-success btn-sm">
              Order Now
            </button>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>
    </>
  );
}

export default Crousel;
