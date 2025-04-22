import React, { useState } from "react";
import api from "../API/api";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users/register", formData);
      setMessage("Registered successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000); 
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed!");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">
        <i className="bi bi-person-plus me-2"></i>Register
      </h2>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <form className="bg-white p-4 shadow rounded" onSubmit={handleSubmit}>
            
            {message && (
              <div
                className={`alert d-flex align-items-center ${
                  message.includes("successfully")
                    ? "alert-success"
                    : "alert-danger"
                }`}
                role="alert"
              >
                <i
                  className={`bi me-2 fs-5 ${
                    message.includes("successfully")
                      ? "bi-check-circle-fill"
                      : "bi-x-circle-fill"
                  }`}
                ></i>
                <div>{message}</div>
              </div>
            )}

            <div className="row g-3">
              {["firstName", "lastName", "email", "password", "contact", "state", "city", "pincode"].map((field, index) => (
                <div key={index} className="col-md-6">
                  <label className="form-label">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className={`bi bi-${field === "password" ? "shield-lock" : field === "email" ? "envelope" : field === "contact" ? "telephone" : "person"}-fill`}></i>
                    </span>
                    <input
                      type={field === "password" ? "password" : "text"}
                      name={field}
                      className="form-control"
                      value={formData[field]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              ))}
              <div className="col-12 text-center mt-3">
                <button type="submit" className="btn btn-success px-5">
                  <i className="bi bi-check-circle me-2"></i>Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
