import React, { useEffect, useState } from "react";
import heroCar from "../assets/heroCar.mp4";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCogs, FaSearch, FaBolt, FaCarSide } from "react-icons/fa";
import { FaWrench, FaHeadset, FaPhoneAlt, FaShieldAlt, FaMapMarkedAlt, FaCalendarCheck, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaQuestionCircle, FaHeadphonesAlt, FaRegComments } from "react-icons/fa";

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4041/api/variant/all-variants")
      .then((res) => {
        setVehicles(res.data.slice(0, 3));
      })
      .catch((err) => console.error("Error fetching featured vehicles:", err));
  }, []);

  const handleBookClick = (vehicleId, imageUrl) => {
    localStorage.setItem("imageKey", imageUrl);
    navigate(`/booking/${vehicleId}`);
  };

  return (
    <div className="bg-light">
      <div className="position-relative text-white text-center" style={{ height: "670px", overflow: "hidden" }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-100 h-100"
          style={{ objectFit: "cover", filter: "brightness(60%)" }}
        >
          <source src={heroCar} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="position-absolute top-50 start-50 translate-middle">
          <h1 className="fw-bold display-3 text-info">Welcome to Car Rental System</h1>
          <p className="lead pt-3 text-light">Find the best cars at the most affordable prices.</p>
        </div>
      </div>

      <div className="container py-5">
        <h3 className="text-center text-primary fw-bold mb-4">About This Project</h3>
        <div className="row text-center mt-5">
          <div className="col-md-6 mb-4">
            <div className="p-4 bg-white shadow-sm rounded-4 h-100">
              <FaCarSide className="fs-1 text-info mb-3" />
              <h5 className="fw-bold mb-2">Modern Car Rental Platform</h5>
              <p className="text-muted">
                Built using <strong>React.js</strong> and <strong>Spring Boot</strong>, the platform offers seamless car booking and vehicle exploration features.
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="p-4 bg-white shadow-sm rounded-4 h-100">
              <FaCogs className="fs-1 text-info mb-3" />
              <h5 className="fw-bold mb-2">Tech Stack</h5>
              <p className="text-muted">
                Technologies used include React.js, Bootstrap, Spring Boot, REST APIs, MySQL, and Axios.
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="p-4 bg-white shadow-sm rounded-4 h-100">
              <FaSearch className="fs-1 text-info mb-3" />
              <h5 className="fw-bold mb-2">Smart Search & Filter</h5>
              <p className="text-muted">
                Easily browse vehicles by company name with real-time filtering and dynamic sorting.
              </p>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="p-4 bg-white shadow-sm rounded-4 h-100">
              <FaBolt className="fs-1 text-info mb-3" />
              <h5 className="fw-bold mb-2">Performance & Scalability</h5>
              <p className="text-muted">
                Optimized for speed, the system supports fast loading and is designed to scale as data grows.
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-muted mt-4 fs-5">
          🚗 Whether it's for a business trip, vacation, or daily use — our platform helps you rent the perfect car in just a few clicks.
        </p>
      </div>


      <div className="container py-5">
        <h3 className="text-center text-primary fw-bold mb-4">Explore Our Cars</h3>
        <div className="row g-4  mt-5">
          {vehicles.length > 0 ? (
            vehicles.map((car, index) => (
              <div className="col-sm-12 col-md-6 col-lg-4" key={`explore-${index}`}>
                <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden">
                  <img
                    src={
                      car.imageUrl
                        ? `http://localhost:4041/imgs/${car.imageUrl}`
                        : "https://via.placeholder.com/300"
                    }
                    className="card-img-top"
                    alt={car.variantName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark">{car.variantName}</h5>
                    <p className="text-muted mb-2">{car.company?.companyName}</p>
                    <p>
                      <strong>Model ::</strong> {car.modelNumber} | <strong>Year:</strong> {car.year}
                    </p>
                    <p>
                      <strong>Fuel ::</strong> {car.fuelType} | <strong>AC:</strong>{" "}
                      {car.isAc ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Seats ::</strong> {car.seatCapacity}
                    </p>
                    <p className="fw-bold text-success">₹{car.rentPerDay} / day</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">Loading vehicle details...</p>
          )}
        </div>
      </div>


      <div className="container py-4">
        <h3 className="text-center text-primary fw-bold pb-5">Our Projects</h3>
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="p-5 bg-light shadow-lg rounded-4 h-100">
              <h5 className="fw-bold mb-3 text-warning">Car Booking Portal</h5>
              <p className="text-muted mb-3">A fully-featured car rental application designed to provide seamless user experience with role-based access and real-time booking capabilities. Users can select from a diverse range of cars, filter by location, and securely book online.</p>
              <ul className="list-unstyled">
                <li><strong>Features ::</strong> Role-based access, real-time car availability, multiple payment options, user-friendly interface</li>
                <li><strong>Technologies ::</strong> Spring Boot, React, MySQL, RESTful APIs</li>
                <li><strong>Professional Impact:</strong> Streamlines the car rental process, enhancing user satisfaction with timely bookings and payments.</li>
              </ul>
              <a href="#" className="btn btn-danger btn-sm">Learn More</a>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-5 bg-light shadow-lg rounded-4 h-100">
              <h5 className="fw-bold mb-3 text-warning">Payment Gateway Integration</h5>
              <p className="text-muted mb-3">Secure and efficient payment gateway integration offering multiple payment options, including credit/debit cards, digital wallets, and secure payment methods. It ensures safe transactions and transaction history tracking.</p>
              <ul className="list-unstyled">
                <li><strong>Features:</strong> Multiple payment options, secure transactions, transaction history, PCI DSS compliance</li>
                <li><strong>Technologies ::</strong> Stripe API, Spring Security, OAuth2</li>
                <li><strong>Professional Impact ::</strong> Enhances the trust of customers by offering secure and reliable payment methods, increasing conversion rates and customer retention.</li>
              </ul>
              <a href="#" className="btn btn-danger btn-sm">Learn More</a>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-5 bg-light shadow-lg rounded-4 h-100">
              <h5 className="fw-bold mb-3 text-warning">Notifications & Alerts</h5>
              <p className="text-muted mb-3">Real-time notifications and alerts system designed to keep users informed of booking statuses, payments, and upcoming rentals. Users receive notifications via SMS or email, enhancing the customer experience.</p>
              <ul className="list-unstyled">
                <li><strong>Features:</strong> Real-time alerts, booking confirmations, payment reminders, SMS/email notifications</li>
                <li><strong>Technologies ::</strong> Twilio API, Spring Boot, WebSockets</li>
                <li><strong>Professional Impact ::</strong> Improves customer engagement and retention by keeping users informed with timely alerts about their rentals and bookings.</li>
              </ul>
              <a href="#" className="btn btn-danger btn-sm">Learn More</a>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5 bg-light">
        <h3 className="text-center text-primary fw-bold mb-3 pb-5">Our Premium Services</h3>
        <div className="row text-center mb-3">
          <div className="col-md-4 mb-4">
            <div className="p-5 shadow-lg rounded-4 h-100 bg-white transition-all hover:shadow-2xl hover:bg-warning">
              <FaWrench className="fs-1 text-warning mb-3" />
              <h5 className="fw-bold mb-3 text-dark">Car Maintenance</h5>
              <p className="text-muted mb-4">Our certified technicians use cutting-edge tools to ensure your vehicle is always in top condition. Regular inspections and top-tier parts are used for the best driving experience.</p>
              <ul className="list-unstyled text-start">
                <li><strong>Key Features ::</strong> Regular inspections, certified technicians, high-quality parts</li>
                <li><strong>Benefits ::</strong> Enhanced safety, reliability, and smooth performance</li>
              </ul>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-5 shadow-lg rounded-4 h-100 bg-white transition-all hover:shadow-2xl hover:bg-warning">
              <FaHeadset className="fs-1 text-warning mb-3" />
              <h5 className="fw-bold mb-3 text-dark">24/7 Customer Support</h5>
              <p className="text-muted mb-4">Our dedicated support team is available around the clock to assist with bookings, provide answers to your queries, and resolve any issues promptly, ensuring you have a stress-free experience.</p>
              <ul className="list-unstyled text-start">
                <li><strong>Key Features ::</strong> Round-the-clock availability, multilingual support, fast response</li>
                <li><strong>Benefits ::</strong> Immediate assistance, hassle-free experience, customer satisfaction</li>
              </ul>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="p-5 shadow-lg rounded-4 h-100 bg-white transition-all hover:shadow-2xl hover:bg-warning">
              <FaShieldAlt className="fs-1 text-warning mb-3" />
              <h5 className="fw-bold mb-3 text-dark">Secure Transactions</h5>
              <p className="text-muted mb-4">We prioritize your security by offering a safe and encrypted payment gateway, ensuring that all your transactions are secure and your data remains private.</p>
              <ul className="list-unstyled text-start">
                <li><strong>Key Features ::</strong> PCI DSS compliance, encrypted transactions, multiple payment options</li>
                <li><strong>Benefits ::</strong> Peace of mind, secure payments, data privacy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-8 mb-5 mx-auto mt-3">
        <h3 className="text-center text-primary fw-bold mb-4 pb-3 fs-2">Contact Information</h3>
        <div className="p-5 bg-light shadow-lg rounded-4 h-100 border border-primary border-opacity-25">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="mb-5">
                <h6 className="fw-semibold text-info mb-3 fs-5">📍 Get in Touch</h6>
                <p className="mb-3 text-dark fs-6">
                  <FaPhoneAlt className="me-2 text-primary fs-5" />
                  <strong>Phone ::</strong>{" "}
                  <span className="text-secondary">+91 7350925310</span>
                </p>
                <p className="mb-3 text-dark fs-6">
                  <FaEnvelope className="me-2 text-primary fs-5" />
                  <strong>Email ::</strong>{" "}
                  <span className="text-secondary">support@carrental.com</span>
                </p>
                <p className="mb-3 text-dark fs-6">
                  <FaCarSide className="me-2 text-primary fs-5" />
                  <strong>Address ::</strong>{" "}
                  <span className="text-secondary">1234 Car Avenue, Pune, Maharashtra</span>
                </p>
              </div>

              <div className="mt-5">
                <h6 className="fw-semibold text-info mb-3 fs-5">🛠️ Support Options</h6>
                <p className="mb-3 text-dark fs-6">
                  <FaQuestionCircle className="me-2 text-primary fs-5" />
                  <strong>FAQs ::</strong>{" "}
                  <span className="text-secondary">Visit our <a href="/" className="text-info">FAQ page</a> for more information.</span>
                </p>
                <p className="mb-3 text-dark fs-6">
                  <FaHeadphonesAlt className="me-2 text-primary fs-5" />
                  <strong>Support Center ::</strong>{" "}
                  <span className="text-secondary">Our dedicated support team is ready to assist you. Reach us at :: <a href="tel:+919876543210" className="text-info">+91 7350925310</a></span>
                </p>
                <p className="mb-3 text-dark fs-6">
                  <FaRegComments className="me-2 text-primary fs-5" />
                  <strong>Live Chat ::</strong>{" "}
                  <span className="text-secondary">Click <a href="https://wa.me/qr/E2FB6TTDNMXEJ1" className="text-info">here</a> to start WhatsApp chat with our customer support.</span>
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-5">
                <h6 className="fw-semibold text-info mb-3 fs-5">🌐 Follow Us</h6>
                <div className="d-flex align-items-center fs-4">
                  <a href="https://www.facebook.com" className="text-primary me-4" target="_blank" rel="noopener noreferrer">
                    <FaFacebook />
                  </a>
                  <a href="https://twitter.com" className="text-info me-4" target="_blank" rel="noopener noreferrer">
                    <FaTwitter />
                  </a>
                  <a href="https://www.linkedin.com" className="text-primary me-4" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                  <a href="https://www.instagram.com" className="text-danger" target="_blank" rel="noopener noreferrer">
                    <FaInstagram />
                  </a>
                </div>
              </div>

              <div>
                <h6 className="fw-semibold text-info mb-3 fs-5">🗺️ Find Us</h6>
                <div className="ratio ratio-16x9 rounded-3 border border-secondary overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.087569725944!2d73.79685987511913!3d18.52047238257454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf0a83f3b90d%3A0x93127e418fbab68b!2sWarje%2C%20Pune%2C%20Maharashtra%20411058!5e0!3m2!1sen!2sin!4v1713785134927!5m2!1sen!2sin"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Car Rental Warje Map"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <footer className="bg-dark text-white pt-5 pb-2  mt-5">
        <div className="container pb-5">
          <div className="row text-center text-md-start pb-5">

            <div className="col-md-4 mb-4">
              <h5 className="text-info">Car Rental</h5>
              <p>Your trusted partner in car rentals. Fast, reliable, and affordable car booking services.</p>
              <p className="mt-3">Serving customers across Maharashtra with a fleet of well-maintained cars and exceptional service.</p>
            </div>

            <div className="col-md-4 mb-4">
              <h5 className="text-info">Contact</h5>
              <p>
                <strong>Email ::</strong>{" "}
                <span className="text-white text-decoration-none link-light link-underline-opacity-0 link-underline-opacity-75-hover">
                  support@carrental.com
                </span>
              </p>
              <p>
                <strong>Phone ::</strong>{" "}
                <span className="text-white link-light link-underline-opacity-0 link-underline-opacity-75-hover">
                  +91-7350925310
                </span>
              </p>
              <p>
                <strong>Address ::</strong>{" "}
                <span className="text-white link-light link-underline-opacity-0 link-underline-opacity-75-hover">
                  123 Car Avenue, Pune, Maharashtra
                </span>
              </p>
              <p>
                <strong>Working Hours ::</strong>{" "}
                <span className="text-white link-light link-underline-opacity-0 link-underline-opacity-75-hover">
                  Mon - Fri: 9 AM to 6 PM
                </span>
              </p>
            </div>

            <div className="col-md-4 mb-4">
              <h5 className="text-info">Why Choose Us</h5>
              <ul className="list-unstyled">
                <li className="link-light link-underline-opacity-0 link-underline-opacity-75-hover">✔️ Easy Booking Process</li>
                <li className="link-light link-underline-opacity-0 link-underline-opacity-75-hover">✔️ Wide Range of Vehicles</li>
                <li className="link-light link-underline-opacity-0 link-underline-opacity-75-hover">✔️ 24/7 Customer Support</li>
                <li className="link-light link-underline-opacity-0 link-underline-opacity-75-hover">✔️ Well-Maintained & Sanitized Cars</li>
                <li className="link-light link-underline-opacity-0 link-underline-opacity-75-hover">✔️ Affordable Pricing</li>
              </ul>
            </div>
          </div>

          <div className="col-md-12 d-flex justify-content-center align-items-center">
            <ul className="list-unstyled d-flex">
              <li>
                <a href="/privacy-policy" className="text-white link-light link-underline-opacity-0 link-underline-opacity-75-hover">
                  Privacy Policy
                </a>
                <span className="mx-3">|</span>
                <a href="/terms-of-service" className="text-white link-light link-underline-opacity-0 link-underline-opacity-75-hover">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <hr className="bg-white" />
          <p className="mb-0 text-center pb-3 pt-2">
            &copy; 2025 <span className="text-info">Car Rental System</span>. All Rights Reserved.
          </p>
        </div>
      </footer>


    </div>
  );
};

export default Home;

