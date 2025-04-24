import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../API/api";

const Login = () => {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/users/login", { email, password, role });
      const userData = response.data;
      const userWithRole = { ...userData, role };
      localStorage.setItem("user", JSON.stringify(userWithRole));
      console.log("LOGIN RESPONSE", response.data); 
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userData.user.userId);

      // alert(userData.user.userId);
      
      setMessage("Login successful!");
  
      setTimeout(() => {
        if (role === "admin") navigate("/");  
        else navigate("/");  
        window.location.reload(); 
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage("Login failed! Please check your credentials.");
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="text-center text-success mb-4">
        <i className="bi bi-person-lock me-2"></i>Login
      </h2>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <form className="bg-white p-4 shadow rounded" onSubmit={handleLogin}>
            {message && (
              <div
                className={`alert d-flex align-items-center ${
                  message.includes("successful") ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                <i
                  className={`bi me-2 fs-5 ${
                    message.includes("successful") ? "bi-check-circle-fill" : "bi-x-circle-fill"
                  }`}
                ></i>
                <div>{message}</div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-person-circle me-2"></i>Choose Role
              </label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-envelope-fill me-2"></i>Email address
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <i className="bi bi-lock-fill me-2"></i>Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="d-grid mb-2">
              <button type="submit" className="btn btn-success">
                <i className="bi bi-box-arrow-in-right me-2"></i>Login
              </button>
            </div>

            <div className="d-flex justify-content-between small">
              <Link to="/forgot-password">
                <i className="bi bi-question-circle me-2"></i>Forgot Password?
              </Link>
              <Link to="/register">
                <i className="bi bi-person-plus-fill me-2"></i>Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
