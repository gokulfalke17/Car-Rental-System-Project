import React, { useEffect, useState } from "react";
import heroCar from "../assets/heroCar.mp4";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCogs, FaSearch, FaBolt, FaCarSide, FaWrench, FaHeadset, FaPhoneAlt, FaShieldAlt, FaMapMarkedAlt, FaCalendarCheck, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaQuestionCircle, FaHeadphonesAlt, FaRegComments } from "react-icons/fa";
import { Alert, Spinner, Button } from "react-bootstrap";

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
      <div className="position-relative text-white text-center" style={{ height: "100vh", maxHeight: "670px", overflow: "hidden" }}>
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
        <div className="position-absolute top-50 start-50 translate-middle w-100 px-3">
          <h1 className="fw-bold display-3 text-info mb-3">Welcome to Car Rental System</h1>
          <p className="lead text-light mb-4">Find the best cars at the most affordable prices.</p>
          <Button 
            variant="info" 
            size="sm" 
            className="rounded-pill px-4 fw-bold"
            onClick={() => navigate("/explore")}
          >
            <FaCarSide className="me-2" />
            Explore Cars
          </Button>
        </div>
      </div>

      <div className="container py-5">
        <h3 className="text-center text-primary fw-bold mb-4">About This Project</h3>
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
        
        <div className="row text-center mt-5">
          {[
            {
              icon: <FaCarSide className="fs-1 text-info mb-3" />,
              title: "Modern Car Rental Platform",
              content: "Built using React.js and Spring Boot, the platform offers seamless car booking and vehicle exploration features."
            },
            {
              icon: <FaCogs className="fs-1 text-info mb-3" />,
              title: "Tech Stack",
              content: "Technologies used include React.js, Bootstrap, Spring Boot, REST APIs, MySQL, and Axios."
            },
            {
              icon: <FaSearch className="fs-1 text-info mb-3" />,
              title: "Smart Search & Filter",
              content: "Easily browse vehicles by company name with real-time filtering and dynamic sorting."
            },
            {
              icon: <FaBolt className="fs-1 text-info mb-3" />,
              title: "Performance & Scalability",
              content: "Optimized for speed, the system supports fast loading and is designed to scale as data grows."
            }
          ].map((item, index) => (
            <div className="col-md-6 mb-4" key={`about-${index}`}>
              <div className="p-4 bg-white shadow-sm rounded-4 h-100 transition-all hover-shadow">
                {item.icon}
                <h5 className="fw-bold mb-2">{item.title}</h5>
                <p className="text-muted">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-center text-muted mt-4 fs-5">
          🚗 Whether it's for a business trip, vacation, or daily use — our platform helps you rent the perfect car in just a few clicks.
        </p>
      </div>

      <div className="container py-5">
        <h3 className="text-center text-primary fw-bold mb-4">Explore Our Cars</h3>
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading vehicles...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : (
          <div className="row g-4 mt-5">
            {vehicles.map((car, index) => (
              <div className="col-sm-12 col-md-6 col-lg-4" key={`explore-${index}`}>
                <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden transition-all hover-transform">
                  <img
                    src={
                      car.imageUrl
                        ? `http://localhost:4041/imgs/${car.imageUrl}`
                        : "https://via.placeholder.com/300"
                    }
                    className="card-img-top"
                    alt={car.variantName}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark">{car.variantName}</h5>
                    <p className="text-muted mb-2">{car.company?.companyName || "N/A"}</p>
                    <p>
                      <strong>Model:</strong> {car.modelNumber || "N/A"} | <strong>Year:</strong> {car.year || "N/A"}
                    </p>
                    <p>
                      <strong>Fuel:</strong> {car.fuelType || "N/A"} | <strong>AC:</strong>{" "}
                      {car.isAc ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Seats:</strong> {car.seatCapacity || "N/A"}
                    </p>
                    <p className="fw-bold text-success">₹{car.rentPerDay || "0"} / day</p>
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="container py-4">
        <h3 className="text-center text-primary fw-bold pb-5">Our Projects</h3>
        <div className="row text-center">
          {[
            {
              title: "Car Booking Portal",
              description: "A fully-featured car rental application designed to provide seamless user experience with role-based access and real-time booking capabilities.",
              features: "Role-based access, real-time car availability, multiple payment options, user-friendly interface",
              tech: "Spring Boot, React, MySQL, RESTful APIs",
              impact: "Streamlines the car rental process, enhancing user satisfaction with timely bookings and payments."
            },
            {
              title: "Payment Gateway Integration",
              description: "Secure and efficient payment gateway integration offering multiple payment options, including credit/debit cards and digital wallets.",
              features: "Multiple payment options, secure transactions, transaction history, PCI DSS compliance",
              tech: "Stripe API, Spring Security, OAuth2",
              impact: "Enhances customer trust by offering secure payment methods, increasing conversion rates."
            },
            {
              title: "Notifications & Alerts",
              description: "Real-time notifications system to keep users informed of booking statuses, payments, and upcoming rentals.",
              features: "Real-time alerts, booking confirmations, payment reminders, SMS/email notifications",
              tech: "Twilio API, Spring Boot, WebSockets",
              impact: "Improves customer engagement and retention with timely alerts about their rentals."
            }
          ].map((project, index) => (
            <div className="col-md-4 mb-4" key={`project-${index}`}>
              <div className="p-5 bg-light shadow-lg rounded-4 h-100">
                <h5 className="fw-bold mb-3 text-warning">{project.title}</h5>
                <p className="text-muted mb-3">{project.description}</p>
                <ul className="list-unstyled text-start">
                  <li><strong>Features:</strong> {project.features}</li>
                  <li><strong>Technologies:</strong> {project.tech}</li>
                  <li><strong>Professional Impact:</strong> {project.impact}</li>
                </ul>
                <Button variant="danger" size="sm">Learn More</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container py-5 bg-light">
        <h3 className="text-center text-primary fw-bold mb-3 pb-5">Our Premium Services</h3>
        <div className="row text-center mb-3">
          {[
            {
              icon: <FaWrench className="fs-1 text-warning mb-3" />,
              title: "Car Maintenance",
              description: "Our certified technicians use cutting-edge tools to ensure your vehicle is always in top condition.",
              features: "Regular inspections, certified technicians, high-quality parts",
              benefits: "Enhanced safety, reliability, and smooth performance"
            },
            {
              icon: <FaHeadset className="fs-1 text-warning mb-3" />,
              title: "24/7 Customer Support",
              description: "Our dedicated support team is available around the clock to assist with bookings and queries.",
              features: "Round-the-clock availability, multilingual support, fast response",
              benefits: "Immediate assistance, hassle-free experience, customer satisfaction"
            },
            {
              icon: <FaShieldAlt className="fs-1 text-warning mb-3" />,
              title: "Secure Transactions",
              description: "We prioritize your security by offering a safe and encrypted payment gateway.",
              features: "PCI DSS compliance, encrypted transactions, multiple payment options",
              benefits: "Peace of mind, secure payments, data privacy"
            }
          ].map((service, index) => (
            <div className="col-md-4 mb-4" key={`service-${index}`}>
              <div className="p-5 shadow-lg rounded-4 h-100 bg-white hover-effect">
                {service.icon}
                <h5 className="fw-bold mb-3 text-dark">{service.title}</h5>
                <p className="text-muted mb-4">{service.description}</p>
                <ul className="list-unstyled text-start">
                  <li><strong>Key Features:</strong> {service.features}</li>
                  <li><strong>Benefits:</strong> {service.benefits}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-lg-8 mb-5 mx-auto mt-3">
        <h3 className="text-center text-primary fw-bold mb-4 pb-3 fs-2">Contact Information</h3>
        <div className="p-5 bg-light shadow-lg rounded-4 h-100 border border-primary border-opacity-25">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="mb-5">
                <h6 className="fw-semibold text-info mb-3 fs-5">📍 Get in Touch</h6>
                <ContactItem icon={<FaPhoneAlt />} label="Phone" value="+91 7350925310" />
                <ContactItem icon={<FaEnvelope />} label="Email" value="support@carrental.com" />
                <ContactItem icon={<FaCarSide />} label="Address" value="1234 Car Avenue, Pune, Maharashtra" />
              </div>

              <div className="mt-5">
                <h6 className="fw-semibold text-info mb-3 fs-5">🛠️ Support Options</h6>
                <ContactItem 
                  icon={<FaQuestionCircle />} 
                  label="FAQs" 
                  value={<span>Visit our <a href="/" className="text-info">FAQ page</a></span>} 
                />
                <ContactItem 
                  icon={<FaHeadphonesAlt />} 
                  label="Support Center" 
                  value={<span>Reach us at: <a href="tel:+919876543210" className="text-info">+91 7350925310</a></span>} 
                />
                <ContactItem 
                  icon={<FaRegComments />} 
                  label="Live Chat" 
                  value={<span>Click <a href="https://wa.me/qr/E2FB6TTDNMXEJ1" className="text-info">here</a> to chat</span>} 
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-5">
                <h6 className="fw-semibold text-info mb-3 fs-5">🌐 Follow Us</h6>
                <div className="d-flex align-items-center fs-4">
                  <SocialIcon href="https://x.com/GokulFalke17" icon={<FaTwitter />} className="text-info" />
                  <SocialIcon href="https://www.linkedin.com/in/gokul-falke-046a7824a/" icon={<FaLinkedin />} className="text-primary" />
                  <SocialIcon href="https://www.instagram.com/xx_gokulfalke17/" icon={<FaInstagram />} className="text-danger" />
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
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white pt-5 pb-2 mt-5">
        <div className="container pb-5">
          <div className="row text-center text-md-start pb-5">
            <FooterSection 
              title="Car Rental" 
              content={[
                "Your trusted partner in car rentals. Fast, reliable, and affordable car booking services.",
                "Serving customers across Maharashtra with a fleet of well-maintained cars and exceptional service."
              ]} 
            />
            
            <FooterSection 
              title="Contact" 
              items={[
                { label: "Email", value: "support@carrental.com" },
                { label: "Phone", value: "+91-7350925310" },
                { label: "Address", value: "123 Car Avenue, Pune, Maharashtra" },
                { label: "Working Hours", value: "Mon - Fri: 9 AM to 6 PM" }
              ]}
            />
            
            <FooterSection 
              title="Why Choose Us" 
              items={[
                { value: "Easy Booking Process" },
                { value: "Wide Range of Vehicles" },
                { value: "24/7 Customer Support" },
                { value: "Well-Maintained & Sanitized Cars" },
                { value: "Affordable Pricing" }
              ]}
              isList
            />
          </div>

          <div className="col-md-12 d-flex justify-content-center align-items-center">
            <ul className="list-unstyled d-flex">
              <li>
                <a href="/privacy-policy" className="text-white link-light">Privacy Policy</a>
                <span className="mx-3">|</span>
                <a href="/terms-of-service" className="text-white link-light">Terms of Service</a>
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

const ContactItem = ({ icon, label, value }) => (
  <p className="mb-3 text-dark fs-6">
    <span className="me-2 text-primary fs-5">{icon}</span>
    <strong>{label}:</strong>{" "}
    <span className="text-secondary">{value}</span>
  </p>
);

const SocialIcon = ({ href, icon, className }) => (
  <a href={href} className={`${className} me-4`} target="_blank" rel="noopener noreferrer">
    {icon}
  </a>
);

const FooterSection = ({ title, content, items, isList }) => (
  <div className="col-md-4 mb-4">
    <h5 className="text-info">{title}</h5>
    {content && content.map((text, i) => <p key={`content-${i}`}>{text}</p>)}
    {items && (
      isList ? (
        <ul className="list-unstyled">
          {items.map((item, i) => (
            <li key={`item-${i}`} className="link-light">✔️ {item.value}</li>
          ))}
        </ul>
      ) : (
        items.map((item, i) => (
          <p key={`item-${i}`}>
            <strong>{item.label}:</strong>{" "}
            <span className="text-white">{item.value}</span>
          </p>
        ))
      )
    )}
  </div>
);

export default Home;