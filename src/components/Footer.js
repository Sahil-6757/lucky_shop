import React from 'react'

function Footer() {
  return (
    <div>
       
      <div className="about-us">
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
    </div>
  )
}

export default Footer
