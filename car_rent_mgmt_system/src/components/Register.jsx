import React, { useState, useEffect } from "react";
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
  const [touched, setTouched] = useState({});

  const navigate = useNavigate();

  const validateField = (name, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const contactRegex = /^[0-9]{10}$/;
    const pincodeRegex = /^[0-9]{6}$/;

    switch (name) {
      case "firstName":
      case "lastName":
      case "state":
      case "city":
        return !value.trim() ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required` : null;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Please enter a valid email";
        return null;
      case "password":
        if (!value) return "Password is required";
        if (!passwordRegex.test(value)) return "Password must be at least 8 characters with at least one letter and one number";
        return null;
      case "contact":
        if (!value) return "Contact number is required";
        if (!contactRegex.test(value)) return "Please enter a valid 10-digit phone number";
        return null;
      case "pincode":
        if (!value) return "Pincode is required";
        if (!pincodeRegex.test(value)) return "Please enter a valid 6-digit pincode";
        return null;
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate field in real-time if it's been touched (blurred at least once)
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    // Validate the field when it loses focus
    const error = validateField(name, formData[name]);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((name) => {
      const error = validateField(name, formData[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    // Check if all fields are valid whenever formData changes
    const allFieldsTouched = Object.keys(formData).every(key => touched[key]);
    if (allFieldsTouched) {
      validateForm();
    }
  }, [formData, touched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched when submitting
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);

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
    { name: "firstName", label: "First Name", icon: "person-fill", type: "text" },
    { name: "lastName", label: "Last Name", icon: "person-fill", type: "text" },
    { name: "email", label: "Email", icon: "envelope-fill", type: "email" },
    { name: "password", label: "Password", icon: "shield-lock-fill", type: "password" },
    { name: "contact", label: "Contact Number", icon: "telephone-fill", type: "tel" },
    { name: "state", label: "State", icon: "geo-alt-fill", type: "text" },
    { name: "city", label: "City", icon: "building", type: "text" },
    { name: "pincode", label: "Pincode", icon: "postcard", type: "text" }
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

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {fieldConfig.map((field, index) => (
                    <div key={index} className="col-md-6">
                      <label htmlFor={field.name} className="form-label fw-medium">
                        {field.label}
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
                          onBlur={handleBlur}
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