import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Carousel, Alert, Spinner, Button } from "react-bootstrap";
import {
  FaCogs,
  FaSearch,
  FaBolt,
  FaCarSide,
  FaWrench,
  FaHeadset,
  FaPhoneAlt,
  FaShieldAlt,
  FaMapMarkedAlt,
  FaCalendarCheck,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaQuestionCircle,
  FaHeadphonesAlt,
  FaRegComments,
  FaChevronRight,
  FaGasPump,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import heroCar from "../assets/heroCar.mp4"; // Import the video

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  hover: { scale: 1.03, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" },
};

const serviceVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  hover: { scale: 1.05, backgroundColor: "#f8f9fa" },
};

const projectVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  hover: { scale: 1.02, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }
};

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:4041/api/variant/all-variants");
        setVehicles(response.data.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching featured vehicles:", err);
        setError("Failed to load featured vehicles. Please try again later.");
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleBookClick = (vehicleId, imageUrl) => {
    if (!vehicleId) {
      setError("Invalid vehicle selection");
      return;
    }
    localStorage.setItem("imageKey", imageUrl || "");
    navigate(`/booking/${vehicleId}`);
  };

  return (
    <div className="bg-light">

      <div
        className="position-relative text-white text-center"
        style={{ height: "100vh", maxHeight: "670px", overflow: "hidden" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-100 h-100"
          style={{ objectFit: "cover", filter: "brightness(50%)" }}
        >
          <source src={heroCar} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="position-absolute top-50 start-50 translate-middle w-100 px-3">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fw-bold display-3 text-white mb-3"
            style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
          >
            Drive the Future, Today
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
            className="lead text-light mb-4"
            style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}
          >
            Premium car rentals at your fingertips.
          </motion.p>
          <Button
            variant="info"
            size="lg"
            className="rounded-pill px-5 py-3 fw-bold shadow-lg"
            onClick={() => navigate("/explore")}
          >
            <FaCarSide className="me-2" />
            Explore Our Fleet
          </Button>
        </div>
      </div>


      <div className="container py-5">
        <h2 className="text-center text-primary fw-bold mb-5">About Us</h2>
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        <div className="row text-center mt-5">
          {[
            {
              icon: <FaCarSide className="fs-1 text-primary mb-3" />,
              title: "Modern Car Rental Platform",
              content:
                "Built with cutting-edge technologies, our platform offers a seamless car booking experience.",
            },
            {
              icon: <FaCogs className="fs-1 text-primary mb-3" />,
              title: "Advanced Technology",
              content:
                "We leverage the latest tech to provide you with a fast, reliable, and user-friendly service.",
            },
            {
              icon: <FaSearch className="fs-1 text-primary mb-3" />,
              title: "Easy Search & Booking",
              content:
                "Find your perfect car with our intuitive search and booking system.",
            },
            {
              icon: <FaBolt className="fs-1 text-primary mb-3" />,
              title: "Performance & Reliability",
              content:
                "Our platform is optimized for speed and reliability, ensuring a smooth experience.",
            },
          ].map((item, index) => (
            <div className="col-md-6 mb-4" key={`about-${index}`}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="p-4 bg-white shadow-sm rounded-4 h-100 transition-all"
              >
                {item.icon}
                <h4 className="fw-bold mb-2 text-dark">{item.title}</h4>
                <p className="text-muted">{item.content}</p>
              </motion.div>
            </div>
          ))}
        </div>
        <p className="text-center text-muted mt-4 fs-5">
          At [Your Company Name], we're passionate about connecting you with the perfect
          vehicle for your needs. Whether it's a quick trip across town or a
          cross-country adventure, we've got you covered.
        </p>
      </div>

      <div className="container py-5">
        <h2 className="text-center text-primary fw-bold mb-5">
          Featured Vehicles
        </h2>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-2">Loading our premium selection...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <div className="row g-4 mt-5">
            {vehicles.map((car, index) => (
              <div
                className="col-sm-12 col-md-6 col-lg-4"
                key={`explore-${index}`}
              >
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden transition-all"
                >
                  <img
                    src={(() => {
                      if (!car.imageUrl) return "https://via.placeholder.com/400x250?text=Car+Image";

                      let cleanedPath = car.imageUrl.replace(/.*\/uploads\/imgs\//, "/uploads/imgs/");

                      if (!cleanedPath.startsWith("http")) {
                        cleanedPath = `http://localhost:4041${cleanedPath.startsWith("/") ? "" : "/"}${cleanedPath}`;
                      }

                      return cleanedPath;
                    })()}
                    className="card-img-top"
                    alt={car.variantName}
                    style={{ height: "250px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x250?text=Car+Image";
                    }}
                  />

                  <div className="card-body d-flex flex-column">
                    <h4 className="card-title fw-bold text-dark">
                      {car.variantName}
                    </h4>
                    <p className="text-muted mb-2">
                      {car.company?.companyName || "N/A"}
                    </p>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">
                        <FaGasPump className="me-1" />
                        {car.fuelType || "N/A"}
                      </span>
                      <span className="text-muted">
                        <FaUsers className="me-1" />
                        {car.seatCapacity || "N/A"} Seats
                      </span>
                    </div>
                    <p className="card-text">
                      <strong>Model:</strong> {car.modelNumber || "N/A"} |{" "}
                      <strong>Year:</strong> {car.year || "N/A"}
                    </p>

                    <p className="fw-bold text-success mt-auto">
                      ₹{car.rentPerDay || "0"} / day
                    </p>

                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>


      <div className="container py-5 bg-light">
        <h2 className="text-center text-primary fw-bold mb-5">
          Our Innovations
        </h2>
        <div className="row g-4">
          {[
            {
              title: "Smart Car Rental Platform",
              description:
                "A cutting-edge platform with role-based access, real-time availability, and multiple payment options.",
              features:
                "Role-based access, real-time availability, multiple payment options, user-friendly interface.",
              tech: "React.js, Spring Boot, MySQL, RESTful APIs.",
              impact:
                "Streamlines the car rental process and enhances user satisfaction.",
            },
            {
              title: "Secure Payment Gateway",
              description:
                "Integration of a secure payment gateway with multiple payment options and transaction history.",
              features:
                "Multiple payment options, secure transactions, transaction history, PCI DSS compliance.",
              tech: "Stripe API, Spring Security, OAuth2.",
              impact:
                "Builds customer trust and increases conversion rates with secure transactions.",
            },
            {
              title: "Real-time Notifications",
              description:
                "A system providing real-time updates on booking statuses, payments, and upcoming rentals.",
              features:
                "Real-time alerts, booking confirmations, payment reminders, SMS/email notifications.",
              tech: "Twilio API, Spring Boot, WebSockets.",
              impact:
                "Improves customer engagement and retention with timely and relevant notifications.",
            },
          ].map((project, index) => (
            <div className="col-md-6 col-lg-4" key={`project-${index}`}>
              <motion.div
                variants={projectVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="p-4 bg-white shadow-lg rounded-4 h-100 transition-all"
              >
                <h4 className="fw-bold mb-3 text-info">{project.title}</h4>
                <p className="text-muted mb-3">{project.description}</p>
                <ul className="list-unstyled">
                  <li>
                    <strong>Features:</strong> {project.features}
                  </li>
                  <li>
                    <strong>Technologies:</strong> {project.tech}
                  </li>
                  <li>
                    <strong>Impact:</strong> {project.impact}
                  </li>
                </ul>
                <Button variant="outline-secondary" size="sm" className="mt-3">
                  Learn More <FaChevronRight className="ms-1" />
                </Button>
              </motion.div>
            </div>
          ))}
        </div>
      </div>


      <div className="container py-5">
        <h2 className="text-center text-primary fw-bold mb-5">
          Our Premium Services
        </h2>
        <div className="row g-4">
          {[
            {
              icon: <FaWrench className="fs-1 text-warning mb-3" />,
              title: "Car Maintenance",
              description:
                "Keep your car in top condition with our expert maintenance services.",
              features:
                "Regular inspections, certified technicians, high-quality parts.",
              benefits:
                "Enhanced safety, reliability, and performance.",
            },
            {
              icon: <FaHeadset className="fs-1 text-warning mb-3" />,
              title: "24/7 Customer Support",
              description:
                "Our dedicated support team is here to assist you around the clock.",
              features:
                "Round-the-clock availability, multilingual support, fast response.",
              benefits:
                "Immediate assistance and a hassle-free experience.",
            },
            {
              icon: <FaShieldAlt className="fs-1 text-warning mb-3" />,
              title: "Secure Transactions",
              description:
                "Your security is our priority. Enjoy safe and encrypted transactions.",
              features:
                "PCI DSS compliance, encrypted transactions, multiple payment options.",
              benefits:
                "Peace of mind and data privacy.",
            },
          ].map((service, index) => (
            <div className="col-md-6 col-lg-4" key={`service-${index}`}>
              <motion.div
                variants={serviceVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="p-4 bg-white shadow-lg rounded-4 h-100 transition-all"
              >
                {service.icon}
                <h4 className="fw-bold mb-3 text-dark">{service.title}</h4>
                <p className="text-muted mb-4">{service.description}</p>
                <ul className="list-unstyled">
                  <li>
                    <strong>Key Features:</strong> {service.features}
                  </li>
                  <li>
                    <strong>Benefits:</strong> {service.benefits}
                  </li>
                </ul>
              </motion.div>
            </div>
          ))}
        </div>
      </div>


      <div className="container py-5">
        <h2 className="text-center text-primary fw-bold mb-5">Contact Us</h2>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="p-4 bg-white shadow-lg rounded-4 border border-primary border-opacity-25">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h4 className="fw-semibold text-info mb-3">📍 Get in Touch</h4>
                  <ContactItem icon={<FaPhoneAlt />} label="Phone" value="+91 7350925310" />
                  <ContactItem icon={<FaEnvelope />} label="Email" value="support@carrental.com" />
                  <ContactItem icon={<FaCarSide />} label="Address" value="1234 Car Avenue, Pune, Maharashtra" />
                </div>
                <div className="col-md-6">
                  <h4 className="fw-semibold text-info mb-3">🛠️ Support</h4>
                  <ContactItem
                    icon={<FaQuestionCircle />}
                    label="FAQs"
                    value={<span>Visit our <a href="/" className="text-info">FAQ page</a></span>}
                  />
                  <ContactItem
                    icon={<FaHeadphonesAlt />}
                    label="Support Center"
                    value={<span>Call us: <a href="tel:+919876543210" className="text-info">+91 7350925310</a></span>}
                  />
                  <ContactItem
                    icon={<FaRegComments />}
                    label="Live Chat"
                    value={<span>Chat with us <a href="https://wa.me/qr/E2FB6TTDNMXEJ1" className="text-info">here</a></span>}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-6">
                  <h4 className="fw-semibold text-info mb-3">🌐 Follow Us</h4>
                  <div className="d-flex align-items-center">
                    <SocialIcon href="https://x.com/GokulFalke17" icon={<FaTwitter />} className="text-info" />
                    <SocialIcon href="https://www.linkedin.com/in/gokul-falke-046a7824a/" icon={<FaLinkedin />} className="text-primary" />
                    <SocialIcon href="https://www.instagram.com/xx_gokulfalke17/" icon={<FaInstagram />} className="text-danger" />
                  </div>
                </div>
                <div className="col-md-6">
                  <h4 className="fw-semibold text-info mb-3">📍 Find Us</h4>
                  <div className="ratio ratio-16x9 rounded-3 border border-secondary overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.087569725944!2d73.79685987511913!3d18.52047238257454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf0a83f3b90d%3A0x93127e418fbab68b!2sWarje%2C%20Pune%2C%20Maharashtra%20411058!5e0!3m2!1sen!2sin!4v1713785134927!5m2!1sen!2sin"
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Car Rental Warje Map"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row text-center text-md-start">
            <FooterSection
              title="Car Rental"
              content={[
                "Your trusted partner in car rentals. We offer fast, reliable, and affordable services.",
                "Serving customers across Maharashtra with a wide range of well-maintained cars.",
              ]}
            />
            <FooterSection
              title="Contact"
              items={[
                { label: "Email", value: "support@carrental.com" },
                { label: "Phone", value: "+91-7350925310" },
                { label: "Address", value: "123 Car Avenue, Pune, MH" },
                { label: "Working Hours", value: "Mon - Fri: 9 AM to 6 PM" },
              ]}
            />
            <FooterSection
              title="Why Choose Us"
              items={[
                { value: "Easy Booking Process" },
                { value: "Wide Range of Vehicles" },
                { value: "24/7 Customer Support" },
                { value: "Well-Maintained Cars" },
                { value: "Affordable Pricing" },
              ]}
              isList
            />
          </div>
          <hr className="bg-white my-4" />
          <div className="d-flex justify-content-center align-items-center flex-column flex-md-row">
            <ul className="list-unstyled d-flex me-md-4 mb-2 mb-md-0">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-white link-underline-opacity-75 link-underline"
                >
                  Privacy Policy
                </a>
                <span className="mx-3">|</span>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="text-white link-underline-opacity-75 link-underline"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
            <p className="mb-0 text-center text-md-start">
              © {new Date().getFullYear()} Car Rental System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ContactItem = ({ icon, label, value }) => (
  <p className="mb-3 text-dark fs-6">
    <span className="me-2 text-primary fs-5">{icon}</span>
    <strong>{label}:</strong> <span className="text-secondary">{value}</span>
  </p>
);

const SocialIcon = ({ href, icon, className }) => (
  <a
    href={href}
    className={`${className} me-4`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);

const FooterSection = ({ title, content, items, isList }) => (
  <div className="col-md-4 mb-4">
    <h5 className="text-info">{title}</h5>
    {content && content.map((text, i) => <p key={`content-${i}`}>{text}</p>)}
    {items &&
      (isList ? (
        <ul className="list-unstyled">
          {items.map((item, i) => (
            <li key={`item-${i}`} className="text-white">
              ✔️ {item.value}
            </li>
          ))}
        </ul>
      ) : (
        items.map((item, i) => (
          <p key={`item-${i}`}>
            <strong>{item.label}:</strong>{" "}
            <span className="text-white">{item.value}</span>
          </p>
        ))
      ))}
  </div>
);

export default Home;
