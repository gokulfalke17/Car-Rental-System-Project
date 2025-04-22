import React, { useState, useEffect } from "react";
import axios from "axios";

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
  });

  const [image, setImage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [message, setMessage] = useState("");

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
      });
      setImage(null);
    } catch (err) {
      console.error("Error adding variant:", err);
      setMessage("❌ Failed to add variant.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 col-md-8 offset-md-2">
        <h3 className="text-center mb-4">Add Car Variant</h3>

        {message && (
          <div
            className={`alert ${
              message.includes("successfully") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Variant Name</label>
              <input
                type="text"
                className="form-control"
                name="variantName"
                value={variant.variantName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col">
              <label className="form-label">Model Number</label>
              <input
                type="text"
                className="form-control"
                name="modelNumber"
                value={variant.modelNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Variant Description</label>
            <textarea
              className="form-control"
              name="variantDesc"
              value={variant.variantDesc}
              onChange={handleChange}
              rows="2"
              required
            ></textarea>
          </div>

          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Year</label>
              <input
                type="number"
                className="form-control"
                name="year"
                value={variant.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col">
              <label className="form-label">Fuel Type</label>
              <select
                className="form-select"
                name="fuelType"
                value={variant.fuelType}
                onChange={handleChange}
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
            <div className="col">
              <label className="form-label">AC</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="isAc"
                  checked={variant.isAc}
                  onChange={handleChange}
                />
                <label className="form-check-label">Yes</label>
              </div>
            </div>

            <div className="col">
              <label className="form-label">Seat Capacity</label>
              <input
                type="number"
                className="form-control"
                name="seatCapacity"
                value={variant.seatCapacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col">
              <label className="form-label">Rent Per Day</label>
              <input
                type="number"
                className="form-control"
                name="rentPerDay"
                value={variant.rentPerDay}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Select Company</label>
            <select
              className="form-select"
              name="companyId"
              value={variant.company.id}
              onChange={handleChange}
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
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success">
              Add Variant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Variant;
