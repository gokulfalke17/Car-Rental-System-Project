import React, { useState } from "react";
import api from "../API/api";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const contactRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with at least one letter and one number";
    }

    if (!formData.contact) {
      newErrors.contact = "Contact number is required";
    } else if (!contactRegex.test(formData.contact)) {
      newErrors.contact = "Please enter a valid 10-digit phone number";
    }

    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    
    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage("");

    try {
      await api.post("/api/users/register", formData);
      setMessage("Registered successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldConfig = [
    { name: "firstName", icon: "person-fill", type: "text" },
    { name: "lastName", icon: "person-fill", type: "text" },
    { name: "email", icon: "envelope-fill", type: "email" },
    { name: "password", icon: "shield-lock-fill", type: "password" },
    { name: "contact", icon: "telephone-fill", type: "tel" },
    { name: "state", icon: "geo-alt-fill", type: "text" },
    { name: "city", icon: "building", type: "text" },
    { name: "pincode", icon: "postcard", type: "text" }
  ];

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="h4 mb-0 text-center">
                <i className="bi bi-person-plus me-2"></i>
                Create Your Account
              </h2>
            </div>
            <div className="card-body p-4 p-md-5">
              {message && (
                <div
                  className={`alert d-flex align-items-center ${
                    message.includes("successfully") ? "alert-success" : "alert-danger"
                  }`}
                  role="alert"
                >
                  <i
                    className={`bi me-2 fs-5 ${
                      message.includes("successfully") ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"
                    }`}
                  ></i>
                  <div>{message}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {fieldConfig.map((field, index) => (
                    <div key={index} className="col-md-6">
                      <label htmlFor={field.name} className="form-label fw-medium">
                        {field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className={`bi bi-${field.icon}`}></i>
                        </span>
                        <input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                        />
                        {errors[field.name] && (
                          <div className="invalid-feedback">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {errors[field.name]}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="col-12 mt-4">
                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg rounded-pill py-3"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Registering...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Create Account
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="col-12 text-center mt-3">
                    <p className="text-muted mb-0">
                      Already have an account?{' '}
                      <a href="/login" className="text-primary fw-medium">
                        Sign in here
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;