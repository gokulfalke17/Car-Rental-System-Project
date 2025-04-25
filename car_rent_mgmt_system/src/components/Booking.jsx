import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Booking = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [userId, setUserId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [image, setImage] = useState("");
  const [hasLicense, setHasLicense] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({
    fromDate: "",
    toDate: ""
  });

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    const imageFromStorage = localStorage.getItem("imageKey");

    setUserId(userIdFromStorage);
    setImage(imageFromStorage);

    if (userIdFromStorage) {
      const fetchData = async () => {
        try {
          const [vehicleRes, licenseRes] = await Promise.all([
            axios.get(`http://localhost:4041/api/variant/vehicle/${vehicleId}`),
            axios.get(`http://localhost:4041/api/license/user/${userIdFromStorage}`)
          ]);
          
          setVehicle(vehicleRes.data);
          setHasLicense(licenseRes.data !== null);
        } catch (err) {
          console.error("Error fetching data:", err);
          setMessage({
            text: "Failed to load vehicle details. Please try again.",
            type: "danger"
          });
          if (err.response?.status === 401) {
            handleLogout();
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [vehicleId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    navigate("/login");
  };

  const validateDates = () => {
    const newErrors = { fromDate: "", toDate: "" };
    let isValid = true;

    if (!fromDate) {
      newErrors.fromDate = "From date is required";
      isValid = false;
    } else if (new Date(fromDate) < new Date(getTodayDate())) {
      newErrors.fromDate = "From date cannot be in the past";
      isValid = false;
    }

    if (!toDate) {
      newErrors.toDate = "To date is required";
      isValid = false;
    } else if (new Date(toDate) < new Date(fromDate || getTomorrowDate())) {
      newErrors.toDate = "To date must be after From date";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage({
        text: "You must be logged in to make a booking. Redirecting to login...",
        type: "warning"
      });
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!hasLicense) {
      setMessage({
        text: "You must add your driving license before booking a vehicle. Redirecting...",
        type: "warning"
      });
      setTimeout(() => navigate("/add-license"), 1500);
      return;
    }

    if (!validateDates()) {
      return;
    }

    const bookingData = {
      user: { userId: parseInt(userId) },
      vehicle: { vehicleId: parseInt(vehicleId) },
      fromDate,
      toDate,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:4041/api/bookings/book",
        bookingData
      );
      
      if (response.data.bookingId) {
        setMessage({
          text: "Vehicle booked successfully! Redirecting to your bookings...",
          type: "success"
        });
        localStorage.setItem("vehicleBooked", "true");
        setTimeout(() => navigate("/my-bookings"), 1500);
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage({
        text: error.response?.data?.message || "Error booking the vehicle. Please try again.",
        type: "danger"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-primary">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Vehicle not found or failed to load details.
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i>Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ 
              color: "#2c3e50",
              background: "linear-gradient(90deg, #3498db, #2ecc71)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Complete Your Booking
            </h2>
            <p className="text-muted">Fill in the details to reserve your vehicle</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden">
                <div className="position-relative" style={{ height: "250px" }}>
                  <img
                    src={
                      image
                        ? `http://localhost:4041/imgs/${image}`
                        : "https://via.placeholder.com/300"
                    }
                    alt={vehicle.variantName}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ 
                    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                  }}>
                    <h3 className="text-white mb-0">{vehicle.variantName}</h3>
                    <p className="text-white-50 mb-0">{vehicle.company?.companyName}</p>
                  </div>
                </div>
                 
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-lg rounded-4 h-100">
                <div className="card-body p-4">
                  {message.text && (
                    <div className={`alert alert-${message.type} d-flex align-items-center`}>
                      <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : message.type === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-x-circle-fill'} me-2`}></i>
                      {message.text}
                    </div>
                  )}

                  <h4 className="fw-bold mb-4" style={{ color: "#2c3e50" }}>
                    <i className="bi bi-calendar2-check me-2 text-primary"></i>
                    Booking Details
                  </h4>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="userId" className="form-label fw-medium">
                        <i className="bi bi-person-badge me-2 text-primary"></i>
                        User ID
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-person-fill text-secondary"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          id="userId"
                          value={userId || "Not logged in"}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="fromDate" className="form-label fw-medium">
                        <i className="bi bi-calendar-date me-2 text-primary"></i>
                        From Date
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-calendar-check text-secondary"></i>
                        </span>
                        <input
                          type="date"
                          className={`form-control ${errors.fromDate ? 'is-invalid' : ''}`}
                          id="fromDate"
                          min={getTodayDate()}
                          value={fromDate}
                          onChange={(e) => {
                            setFromDate(e.target.value);
                            setErrors(prev => ({ ...prev, fromDate: "" }));
                          }}
                          required
                        />
                      </div>
                      {errors.fromDate && (
                        <div className="invalid-feedback d-flex align-items-center">
                          <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
                          {errors.fromDate}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="toDate" className="form-label fw-medium">
                        <i className="bi bi-calendar-date me-2 text-primary"></i>
                        To Date
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-calendar-check text-secondary"></i>
                        </span>
                        <input
                          type="date"
                          className={`form-control ${errors.toDate ? 'is-invalid' : ''}`}
                          id="toDate"
                          min={fromDate || getTomorrowDate()}
                          value={toDate}
                          onChange={(e) => {
                            setToDate(e.target.value);
                            setErrors(prev => ({ ...prev, toDate: "" }));
                          }}
                          required
                        />
                      </div>
                      {errors.toDate && (
                        <div className="invalid-feedback d-flex align-items-center">
                          <i className="bi bi-exclamation-circle-fill me-2 text-danger"></i>
                          {errors.toDate}
                        </div>
                      )}
                    </div>

                    <div className="d-grid mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg rounded-pill py-3 fw-bold"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Confirm Booking
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {!hasLicense && userId && (
                    <div className="alert alert-warning mt-4 d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <div>
                        <strong>License Required:</strong> You need to add your driving license before booking.
                        <button 
                          className="btn btn-sm btn-outline-warning ms-2"
                          onClick={() => navigate("/add-license")}
                        >
                          Add License Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;