import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";


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
    company: {
      id: "",
    }
  });

  const [image, setImage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});


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
        setMessage("❌ Failed to load companies. Please try again later.");
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
        setErrors(prev => ({ ...prev, image: "Please upload an image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }
      setImage(file);
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      setMessage("❌ Please fill all required fields correctly.");
      return;
    }
  
    setIsSubmitting(true);
    setMessage("");
  
    const formData = new FormData();
  
    const variantPayload = JSON.stringify(variant);
  
    formData.append("variant", variantPayload); 
    if (image) {
      formData.append("image", image);
    }
  
    try {
      const res = await axios.post("http://localhost:4041/api/variant/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      setMessage("✅ Variant added successfully!");
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
      setTimeout(() => {
        navigate("/variantList"); 
      }, 1500);
    } catch (err) {
      console.error("Error adding variant:", err.response?.data || err.message);
      setMessage(`❌ Failed to add variant: ${err.response?.data?.message || "Server error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container py-5" style={{ backgroundColor: colors.light, minHeight: "100vh" }}>
      <div className="card shadow p-4 col-md-8 offset-md-2" style={{ borderRadius: "15px", backgroundColor: colors.light }}>
        <h3 className="text-center mb-4" style={{ color: colors.primaryDark, fontWeight: "600" }}>
          Add Car Variant
        </h3>

        {message && (
          <div
            className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"} text-center`}
            style={{
              backgroundColor: message.includes("✅") ? "#d4edda" : "#f8d7da",
              color: message.includes("✅") ? "#155724" : "#721c24",
              borderRadius: "8px"
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Variant Name*</label>
              <input
                type="text"
                className={`form-control ${errors.variantName ? "is-invalid" : ""}`}
                name="variantName"
                value={variant.variantName}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
              />
              {errors.variantName && <div className="invalid-feedback">{errors.variantName}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Model Number*</label>
              <input
                type="text"
                className={`form-control ${errors.modelNumber ? "is-invalid" : ""}`}
                name="modelNumber"
                value={variant.modelNumber}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
              />
              {errors.modelNumber && <div className="invalid-feedback">{errors.modelNumber}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Variant Description*</label>
            <textarea
              className={`form-control ${errors.variantDesc ? "is-invalid" : ""}`}
              name="variantDesc"
              value={variant.variantDesc}
              onChange={handleChange}
              rows="2"
              style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
            ></textarea>
            {errors.variantDesc && <div className="invalid-feedback">{errors.variantDesc}</div>}
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Year*</label>
              <input
                type="number"
                className={`form-control ${errors.year ? "is-invalid" : ""}`}
                name="year"
                value={variant.year}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
              />
              {errors.year && <div className="invalid-feedback">{errors.year}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Fuel Type*</label>
              <select
                className={`form-select ${errors.fuelType ? "is-invalid" : ""}`}
                name="fuelType"
                value={variant.fuelType}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
              >
                <option value="">Select Fuel Type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="ev">Electric</option>
              </select>
              {errors.fuelType && <div className="invalid-feedback">{errors.fuelType}</div>}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>AC</label>
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

            <div className="col-md-4">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Seat Capacity*</label>
              <input
                type="number"
                className={`form-control ${errors.seatCapacity ? "is-invalid" : ""}`}
                name="seatCapacity"
                value={variant.seatCapacity}
                onChange={handleChange}
                min="1"
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
              />
              {errors.seatCapacity && <div className="invalid-feedback">{errors.seatCapacity}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Rent Per Day*</label>
              <input
                type="number"
                className={`form-control ${errors.rentPerDay ? "is-invalid" : ""}`}
                name="rentPerDay"
                value={variant.rentPerDay}
                onChange={handleChange}
                min="0"
                step="0.01"
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
              />
              {errors.rentPerDay && <div className="invalid-feedback">{errors.rentPerDay}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Select Company*</label>
            <select
              className={`form-select ${errors.company ? "is-invalid" : ""}`}
              name="companyId"
              value={variant.company.id}
              onChange={handleChange}
              style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.companyName}
                </option>
              ))}
            </select>
            {errors.company && <div className="invalid-feedback">{errors.company}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Upload Image*</label>
            <input
              type="file"
              className={`form-control ${errors.image ? "is-invalid" : ""}`}
              accept="image/*"
              onChange={handleImageChange}
              style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
            />
            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
            {image && (
              <div className="mt-2">
                <small className="text-muted">Selected: {image.name}</small>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? colors.lightGray : colors.primary,
                color: "#fff",
                padding: "10px 30px",
                borderRadius: "8px",
                fontWeight: "500",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
              onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = colors.primary)}
            >
              {isSubmitting ? "Adding..." : "Add Variant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Variant;