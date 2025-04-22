import React, { useState } from "react";
import axios from "axios";


const Company = () => {
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:4041/api/companies", { companyName })
      .then((res) => {
        setMessage("Company added successfully!");
        setCompanyName("");
      })
      .catch((err) => {
        console.error("Error adding company:", err);
        setMessage("Failed to add company.");
      });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow col-md-6 offset-md-3 border-0 rounded-4">
        <div className="card-header bg-primary text-white text-center rounded-top-4">
          <h4 className="mb-0">
            <i className="bi bi-building me-2"></i>Add Company
          </h4>
        </div>

        <div className="card-body p-4">
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
                  message.includes("successfully") ? "bi-check-circle-fill" : "bi-x-circle-fill"
                }`}
              ></i>
              <div>{message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="companyName" className="form-label fw-semibold">
                Company Name
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-buildings"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="companyName"
                  name="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success px-4">
                <i className="bi bi-plus-circle me-2"></i>Add Company
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Company;
