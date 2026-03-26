import "../App.css";
import FruitsImage from "../assets/FruitsImage.png";
import Coconut from "../assets/Coconut.png";
import siteIcon from "../assets/siteIcon.jpg";
import Boss from "../assets/Boss.jpeg";
function Aboutus() {
  return (
    <div className="container">
      <h1 style={{ textAlign: "center", color: "green" }}>About us</h1>
      <hr />
      <div className="subContainer">
        <div className="right">
          <img src={FruitsImage} alt="About Us" className="About-img" />
        </div>
        <div className="left">
          <h3 style={{ color: "blue" }}>Who we are?</h3>
          <p className="About-para">
            Welcome to <b>LuckyFruits</b>, your trusted source for fresh,
            healthy, and delicious fruits. We are passionate about bringing
            nature’s goodness straight to your table. Our platform is dedicated
            to providing high-quality fruits, useful information, and tips that
            help you live a healthier lifestyle.
          </p>
        </div>
      </div>

      <div className="subContainer">
     
        <div className="left">
          <h3 style={{ color: "blue",  }}>Our Vision</h3>
          <p className="About-para">
            We aim to become a trusted platform where people can discover the
            best fruits, health tips, and nutrition knowledge to improve their
            daily lives.
          </p>
        </div>
           <div className="right">
          <img src={Coconut} alt="About Us" className="About-img" />
        </div>
      </div>
      <div className="weOffer">
        <h3 style={{ color: "blue", textAlign: "center" }}>What we offer?</h3>
        <ul className="offer-list">
          <li>🍎 Fresh and seasonal fruits </li>
          <li>🥭 Information about fruit benefits and nutrition </li>
          <li>🍊 Healthy recipes and diet tips </li>
          <li>🍌 Guides on choosing and storing fruits </li>
          <li>🍇 Insights into organic and farm-fresh produce </li>
        </ul>
      </div>
      <div className="subContainer">
        <div className="right">
          <img src={siteIcon} alt="About Us" className="About-img" />
        </div>
        <div className="left">
          <h3 style={{ color: "blue" }}>Our Story</h3>
          <p className="About-para">
            Our journey started with a simple idea — to connect people with
            fresh, natural, and healthy food. With growing awareness about
            health, we wanted to create a platform that not only provides fruits
            but also educates people about their benefits.
          </p>
        </div>
      </div>
      <div className="container">
        <h3 style={{ color: "blue", textAlign: "center" }}>Our Director</h3>
        <p className="About-para">
          Meet our director, a passionate advocate for healthy living and
          sustainable agriculture. With years of experience in the fruit
          industry, they are committed to ensuring that every customer receives
          the highest quality produce.
        </p>
        <div className="subDirector"> 
        <div className="card" style={{ width: "18rem",height:"auto" }}>
          <img src={Boss} className="card-img-top" style={{width:"100%",height:"220px"}} alt="..." />
          <div className="card-body">
            <h5 className="card-title" style={{textAlign:"center"}}>Javed Pathan</h5>
            <p className="card-text">
              Javed Pathan is a visionary leader with a deep passion for fruits
              and healthy living. 
            </p>
            <p className="card-text">Contact no: 9822516757</p>
           
          </div>
        </div>
         <div className="card" style={{ width: "18rem",height:"auto" }}>
          <img src={Boss} className="card-img-top" style={{width:"100%",height:"220px"}} alt="..." />
          <div className="card-body">
            <h5 className="card-title" style={{textAlign:"center"}}>Amjad Pathan</h5>
            <p className="card-text">
                Amjad Pathan is pillar of our organization with a strong commitment to quality and customer satisfaction. 
            </p>
            <p className="card-text">Contact no: 9822416757</p>
           
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Aboutus;
