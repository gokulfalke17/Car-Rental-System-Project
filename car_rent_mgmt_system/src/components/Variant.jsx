import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Variant = () => {
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
    },
    password: ""
  });

  const [image, setImage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    axios
      .get("http://localhost:4041/api/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "isAc") {
      setVariant({ ...variant, [name]: checked });
    } else if (name === "companyId") {
      setVariant({ ...variant, company: { id: value } });
    } else {
      setVariant({ ...variant, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append(
      "variant",
      new Blob([JSON.stringify(variant)], { type: "application/json" })
    );
    formData.append("imageUrl", image);

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
        company: { id: "" },
        password: ""
      });
      setImage(null);
    } catch (err) {
      console.error("Error adding variant:", err);
      setMessage("❌ Failed to add variant.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container py-5" style={{ backgroundColor: colors.light, minHeight: "100vh" }}>
      <div className="card shadow p-4 col-md-8 offset-md-2" style={{ borderRadius: "15px", backgroundColor: colors.light }}>
        <h3 className="text-center mb-4" style={{ color: colors.primaryDark, fontWeight: "600" }}>
          Add Car Variant
        </h3>

        {message && (
          <div
            className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"} text-center`}
            style={{
              backgroundColor: message.includes("successfully") ? "#d4edda" : "#f8d7da",
              color: message.includes("successfully") ? "#155724" : "#721c24",
              borderRadius: "8px"
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Variant Name</label>
              <input
                type="text"
                className="form-control"
                name="variantName"
                value={variant.variantName}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Model Number</label>
              <input
                type="text"
                className="form-control"
                name="modelNumber"
                value={variant.modelNumber}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Variant Description</label>
            <textarea
              className="form-control"
              name="variantDesc"
              value={variant.variantDesc}
              onChange={handleChange}
              rows="2"
              style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
              required
            ></textarea>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Year</label>
              <input
                type="number"
                className="form-control"
                name="year"
                value={variant.year}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Fuel Type</label>
              <select
                className="form-select"
                name="fuelType"
                value={variant.fuelType}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
                required
              >
                <option value="">Select Fuel Type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="ev">Electric</option>
              </select>
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
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Seat Capacity</label>
              <input
                type="number"
                className="form-control"
                name="seatCapacity"
                value={variant.seatCapacity}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Rent Per Day</label>
              <input
                type="number"
                className="form-control"
                name="rentPerDay"
                value={variant.rentPerDay}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Select Company</label>
            <select
              className="form-select"
              name="companyId"
              value={variant.company.id}
              onChange={handleChange}
              style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
              required
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.companyName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Upload Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" style={{ color: colors.dark, fontWeight: "500" }}>Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                value={variant.password}
                onChange={handleChange}
                style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "10px" }}
                required
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={togglePasswordVisibility}
                style={{ border: `1px solid ${colors.lightGray}`, backgroundColor: colors.light }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn"
              style={{
                backgroundColor: colors.primary,
                color: "#fff",
                padding: "10px 30px",
                borderRadius: "8px",
                fontWeight: "500",
                border: "none"
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = colors.primaryDark)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = colors.primary)}
            >
              Add Variant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Variant;
