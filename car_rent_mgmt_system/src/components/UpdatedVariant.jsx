import React, { useEffect, useState } from "react";
import api from "../API/api";
import { useParams } from "react-router-dom";

const UpdateVariant = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    id: "",
    variantName: "",
    variantDesc: "",
    company: { id: "" },
    modelNumber: "",
    year: "",
    fuelType: "",
    isAc: false,
    seatCapacity: "",
    rentPerDay: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get(`/api/variant/${id}`)
      .then((res) => {
        setFormData({
          ...res.data,
          id: res.data.id || id,
        });
      })
      .catch((err) => {
        console.error("Error Fetching Variant Data", err);
        setMessage("❌ Failed to Vetch Variant Data.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "isAc") {
      setFormData({ ...formData, [name]: checked });
    } else if (name === "companyId") {
      setFormData({ ...formData, company: { id: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("variant", new Blob([JSON.stringify(formData)], { type: "application/json" }));

    if (imageFile) {
      form.append("imageUrl", imageFile);
    }

    try {
      await api.post(`/api/variant/update/${formData.id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("✅ Variant updated successfully!");
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      setMessage("❌ Failed to update variant.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-warning">Update Variant</h2>
      {message && <div className="alert alert-info text-center">{message}</div>}
      <form className="bg-white p-4 shadow rounded" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Variant Name</label>
            <input type="text" className="form-control" name="variantName" value={formData.variantName} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Variant Desc</label>
            <input type="text" className="form-control" name="variantDesc" value={formData.variantDesc} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Company ID</label>
            <input type="number" className="form-control" name="companyId" value={formData.company.id} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Model Number</label>
            <input type="text" className="form-control" name="modelNumber" value={formData.modelNumber} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Year</label>
            <input type="number" className="form-control" name="year" value={formData.year} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Fuel Type</label>
            <input type="text" className="form-control" name="fuelType" value={formData.fuelType} onChange={handleChange} required />
          </div>
          <div className="col-md-6 d-flex align-items-center">
            <label className="form-label me-3">Is AC?</label>
            <input type="checkbox" name="isAc" checked={formData.isAc} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Seat Capacity</label>
            <input type="number" className="form-control" name="seatCapacity" value={formData.seatCapacity} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Rent Per Day</label>
            <input type="number" className="form-control" name="rentPerDay" value={formData.rentPerDay} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Update Image (optional)</label>
            <input type="file" className="form-control" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>
          <div className="col-12 text-center mt-3">
            <button type="submit" className="btn btn-warning px-4">Update Variant</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateVariant;
