import React, { useState } from 'react';
import axios from 'axios';

const AddLicense = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    console.log("Sending User ID:", userId); 

    if (!licenseNumber || !expiryDate || !licensePhoto) {
      setError('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append("licenseNumber", licenseNumber);
    formData.append("expiryDate", expiryDate);
    formData.append("licensePhoto", licensePhoto);
    formData.append("userId", userId);

    try {
      const response = await axios.post('http://localhost:4041/api/license/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        setSuccess(true);
        navigate(`/explore`);
        setError('');
      }
    } catch (err) {
      // setError('Error uploading license!');
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h2 className="text-center mb-4">Add License</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">License added successfully!</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="licenseNumber">License Number</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    className="form-control"
                    placeholder="Enter your license number"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="date"
                    id="expiryDate"
                    className="form-control"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="licensePhoto">License Photo</label>
                  <input
                    type="file"
                    id="licensePhoto"
                    className="form-control"
                    onChange={(e) => setLicensePhoto(e.target.files[0])}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLicense;
