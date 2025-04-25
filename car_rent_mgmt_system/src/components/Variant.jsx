import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Variant = () => {
  const navigate = useNavigate();
  const [variant, setVariant] = useState({
    variantName: "",
    variantDesc: "",
    modelNumber: "",
    year: "",
    fuelType: "",
    isAc: false,
    seatCapacity: "",
    rentPerDay: "",
    company: { id: "" }
  });

  const [image, setImage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const colors = {
    primary: "#4361ee",
    primaryLight: "#4895ef",
    primaryDark: "#3a0ca3",
    secondary: "#4cc9f0",
    success: "#38b000",
    danger: "#ef233c",
    light: "#f8f9fa",
    dark: "#212529",
    lightGray: "#e9ecef"
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("http://localhost:4041/api/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setMessage({ text: "Failed to load companies. Please try again later.", type: "danger" });
      }
    };
    fetchCompanies();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!variant.variantName.trim()) newErrors.variantName = "Variant name is required";
    if (!variant.modelNumber.trim()) newErrors.modelNumber = "Model number is required";
    if (!variant.year) newErrors.year = "Year is required";
    if (!variant.fuelType) newErrors.fuelType = "Fuel type is required";
    if (!variant.seatCapacity) newErrors.seatCapacity = "Seat capacity is required";
    if (!variant.rentPerDay) newErrors.rentPerDay = "Rent per day is required";
    if (!variant.company.id) newErrors.company = "Company is required";
    if (!image) newErrors.image = "Image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (name === "isAc") {
      setVariant({ ...variant, [name]: checked });
    } else if (name === "companyId") {
      setVariant({ ...variant, company: { id: value } });
      if (errors.company) setErrors(prev => ({ ...prev, company: "" }));
    } else {
      setVariant({ ...variant, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setErrors(prev => ({ ...prev, image: "Please upload an image file (JPEG, PNG)" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      setMessage({ text: "Please fill all required fields correctly", type: "danger" });
      return;
    }
  
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
  
    const formData = new FormData();
    formData.append("variant", JSON.stringify(variant));
    if (image) formData.append("image", image);
  
    try {
      const res = await axios.post("http://localhost:4041/api/variant/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setMessage({ 
        text: "Variant added successfully! Redirecting...", 
        type: "success" 
      });
      
      // Reset form
      setVariant({
        variantName: "",
        variantDesc: "",
        modelNumber: "",
        year: "",
        fuelType: "",
        isAc: false,
        seatCapacity: "",
        rentPerDay: "",
        company: { id: "" }
      });
      setImage(null);
      setPreviewImage(null);
      
      setTimeout(() => navigate("/variantList"), 1500);
    } catch (err) {
      console.error("Error adding variant:", err);
      setMessage({ 
        text: err.response?.data?.message || "Failed to add variant. Please try again.", 
        type: "danger" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: colors.light, minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-primary text-white py-3">
              <h3 className="h4 mb-0 text-center">
                <i className="bi bi-car-front me-2"></i>
                Add New Vehicle Variant
              </h3>
            </div>
            <div className="card-body p-4 p-md-5">
              {message.text && (
                <div className={`alert alert-${message.type} d-flex align-items-center`}>
                  <i className={`bi ${message.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
                  <div>{message.text}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-medium d-flex align-items-center">
                      <i className="bi bi-card-heading me-2 text-primary"></i>
                      Variant Name*
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.variantName ? "is-invalid" : ""}`}
                      name="variantName"
                      value={variant.variantName}
                      onChange={handleChange}
                      placeholder="e.g., ZX Luxury Edition"
                    />
                    {errors.variantName && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {errors.variantName}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium d-flex align-items-center">
                      <i className="bi bi-upc-scan me-2 text-primary"></i>
                      Model Number*
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.modelNumber ? "is-invalid" : ""}`}
                      name="modelNumber"
                      value={variant.modelNumber}
                      onChange={handleChange}
                      placeholder="e.g., ZX-2023-LUX"
                    />
                    {errors.modelNumber && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {errors.modelNumber}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium d-flex align-items-center">
                    <i className="bi bi-card-text me-2 text-primary"></i>
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    name="variantDesc"
                    value={variant.variantDesc}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter variant description..."
                  ></textarea>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-medium d-flex align-items-center">
                      <i className="bi bi-calendar me-2 text-primary"></i>
                      Year*
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.year ? "is-invalid" : ""}`}
                      name="year"
                      value={variant.year}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      placeholder="e.g., 2023"
                    />
                    {errors.year && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {errors.year}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium d-flex align-items-center">
                      <i className="bi bi-fuel-pump me-2 text-primary"></i>
                      Fuel Type*
                    </label>
                    <select
                      className={`form-select ${errors.fuelType ? "is-invalid" : ""}`}
                      name="fuelType"
                      value={variant.fuelType}
                      onChange={handleChange}
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="ev">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                    {errors.fuelType && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {errors.fuelType}
                      </div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-medium d-flex align-items-center">
                      <i className="bi bi-snow me-2 text-primary"></i>
                      Air Conditioning
                    </label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isAc"
                        checked={variant.isAc}
                        onChange={handleChange}
                        style={{
                          width: "3em",
                          height: "1.5em",
                          backgroundColor: variant.isAc ? colors.success : colors.lightGray
                        }}
                      />
                      <label className="form-check-label ms-2">
                        {variant.isAc ? "Yes" : "No"}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-medium d-flex align-items-center">
                      <i className="bi bi-people me-2 text-primary"></i>
                      Seat Capacity*
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.seatCapacity ? "is-invalid" : ""}`}
                      name="seatCapacity"
                      value={variant.seatCapacity}
                      onChange={handleChange}
                      min="1"
                      max="20"
                      placeholder="e.g., 5"
                    />
                    {errors.seatCapacity && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {errors.seatCapacity}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-medium d-flex align-items-center">
                      <i className="bi bi-currency-rupee me-2 text-primary"></i>
                      Rent Per Day*
                    </label>
                    <input
                      type="number"
                      className={`form-control ${errors.rentPerDay ? "is-invalid" : ""}`}
                      name="rentPerDay"
                      value={variant.rentPerDay}
                      onChange={handleChange}
                      min="0"
                      step="100"
                      placeholder="e.g., 2500"
                    />
                    {errors.rentPerDay && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {errors.rentPerDay}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium d-flex align-items-center">
                    <i className="bi bi-building me-2 text-primary"></i>
                    Company*
                  </label>
                  <select
                    className={`form-select ${errors.company ? "is-invalid" : ""}`}
                    name="companyId"
                    value={variant.company.id}
                    onChange={handleChange}
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.companyName}
                      </option>
                    ))}
                  </select>
                  {errors.company && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {errors.company}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium d-flex align-items-center">
                    <i className="bi bi-image me-2 text-primary"></i>
                    Vehicle Image*
                  </label>
                  <input
                    type="file"
                    className={`form-control ${errors.image ? "is-invalid" : ""}`}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {errors.image && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {errors.image}
                    </div>
                  )}
                  {previewImage && (
                    <div className="mt-3 text-center">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="img-thumbnail" 
                        style={{ maxHeight: "200px" }}
                      />
                      <small className="d-block text-muted mt-2">
                        {image.name} ({(image.size / 1024).toFixed(2)} KB)
                      </small>
                    </div>
                  )}
                </div>

                <div className="d-grid mt-5">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg rounded-pill py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Adding Variant...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle-fill me-2"></i>
                        Add Vehicle Variant
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Variant;