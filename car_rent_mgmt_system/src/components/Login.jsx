import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../API/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = () => {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await api.post("/api/users/login", { email, password, role });
      const userData = response.data;
      const userWithRole = { ...userData, role };
      
      localStorage.setItem("user", JSON.stringify(userWithRole));
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userData.user.userId);

      setMessage({ 
        text: "Login successful! Redirecting...", 
        type: "success" 
      });

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage({ 
        text: error.response?.data?.message || "Login failed! Please check your credentials.", 
        type: "danger" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white py-3">
              <h2 className="h4 mb-0 text-center">
                <i className="bi bi-person-lock me-2"></i>
                Welcome Back
              </h2>
            </div>
            <div className="card-body p-4 p-md-5">
              {message.text && (
                <div className={`alert alert-${message.type} d-flex align-items-center`}>
                  <i className={`bi ${message.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
                  <div>{message.text}</div>
                </div>
              )}

              <form onSubmit={handleLogin} noValidate>
                <div className="mb-4">
                  <label className="form-label fw-medium d-flex align-items-center">
                    <i className="bi bi-person-rolodex me-2 text-primary"></i>
                    Select Role
                  </label>
                  <select
                    className={`form-select ${errors.role ? "is-invalid" : ""}`}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium d-flex align-items-center">
                    <i className="bi bi-envelope-fill me-2 text-primary"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium d-flex align-items-center">
                    <i className="bi bi-lock-fill me-2 text-primary"></i>
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({ ...errors, password: "" });
                      }}
                      required
                    />
                    <button
                      type="button"
                      className={`btn ${errors.password ? "btn-outline-danger" : "btn-outline-secondary"}`}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                    {errors.password && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {errors.password}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg rounded-pill py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </div>

                <div className="d-flex justify-content-between small">
                  <Link 
                    to="/forgot-password" 
                    className="text-decoration-none text-primary fw-medium"
                  >
                    <i className="bi bi-question-circle me-2"></i>
                    Forgot Password?
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-decoration-none text-primary fw-medium"
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;