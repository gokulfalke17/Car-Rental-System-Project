import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Alert, Spinner } from "react-bootstrap";

const Company = () => {
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  // Fetch existing companies to check for duplicates
  useEffect(() => {
    axios.get("http://localhost:4041/api/companies")
      .then(res => setCompanies(res.data))
      .catch(err => console.error("Error fetching companies:", err));
  }, []);

  const validateCompanyName = (name) => {
    if (!name.trim()) {
      return "Company name is required";
    }
    if (name.length < 3) {
      return "Company name must be at least 3 characters";
    }
    if (name.length > 50) {
      return "Company name cannot exceed 50 characters";
    }
    if (companies.some(company => company.companyName.toLowerCase() === name.toLowerCase())) {
      return "Company with this name already exists";
    }
    if (!/^[a-zA-Z0-9\s&.,-]+$/.test(name)) {
      return "Only letters, numbers, spaces, &.,- are allowed";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    
    const validationError = validateCompanyName(companyName);
    if (validationError) {
      setValidationError(validationError);
      return;
    }
    setValidationError("");

    setLoading(true);
    axios
      .post("http://localhost:4041/api/companies", { companyName })
      .then((res) => {
        setMessage({ 
          text: "Company added successfully!", 
          type: "success" 
        });
        setTimeout(() => {
          navigate("/variant");
        }, 1500);
        setCompanyName("");
      })
      .catch((err) => {
        console.error("Error adding company:", err);
        setMessage({ 
          text: err.response?.data?.message || "Failed to add company.", 
          type: "danger" 
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0 text-center">
                <i className="bi bi-building me-2"></i>Add New Company
              </h4>
            </div>

            <div className="card-body p-4">
              {message.text && (
                <Alert 
                  variant={message.type} 
                  onClose={() => setMessage({ text: "", type: "" })} 
                  dismissible
                  className="d-flex align-items-center"
                >
                  <i className={`bi me-2 ${message.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
                  {message.text}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="companyName" className="form-label fw-semibold text-dark">
                    <i className="bi bi-building text-primary me-2"></i>
                    Company Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-tag-fill text-primary"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${validationError ? "is-invalid" : ""}`}
                      id="companyName"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                        if (validationError) {
                          setValidationError(validateCompanyName(e.target.value));
                        }
                      }}
                      onBlur={() => setValidationError(validateCompanyName(companyName))}
                      placeholder="e.g. Toyota, Honda, BMW"
                      disabled={loading}
                    />
                  </div>
                  {validationError && (
                    <div className="invalid-feedback d-block">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {validationError}
                    </div>
                  )}
                  <div className="form-text">
                    Enter the full company name (3-50 characters)
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-success py-2 fw-semibold"
                    disabled={loading || !!validationError}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Company
                      </>
                    )}
                  </button>
                  
                </div>
              </form>
            </div>

            <div className="card-footer bg-light py-3 text-center">
              <small className="text-muted">
                <i className="bi bi-info-circle me-2"></i>
                All fields are required
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Company;