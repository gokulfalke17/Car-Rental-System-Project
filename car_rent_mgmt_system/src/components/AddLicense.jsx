import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddLicense = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    licenseNumber: '',
    expiryDate: '',
    licensePhoto: ''
  });
  const [touched, setTouched] = useState({
    licenseNumber: false,
    expiryDate: false,
    licensePhoto: false
  });
  const navigate = useNavigate();

  // Field validation functions
  const validateLicenseNumber = (value) => {
    if (!value.trim()) return 'License number is required';
    if (!/^[A-Za-z0-9]{8,20}$/.test(value)) return 'License number must be 8-20 alphanumeric characters';
    return '';
  };

  const validateExpiryDate = (value) => {
    if (!value) return 'Expiry date is required';
    const today = new Date();
    const selectedDate = new Date(value);
    if (selectedDate <= today) return 'Expiry date must be in the future';
    return '';
  };

  const validateLicensePhoto = (file) => {
    if (!file) return 'License photo is required';
    if (file.size > 2 * 1024 * 1024) return 'Image size must be less than 2MB';
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      return 'Only JPG, JPEG, or PNG images are allowed';
    }
    return '';
  };

  // Validate individual fields when they change (if they've been touched)
  useEffect(() => {
    if (touched.licenseNumber) {
      setValidationErrors(prev => ({
        ...prev,
        licenseNumber: validateLicenseNumber(licenseNumber)
      }));
    }
  }, [licenseNumber, touched.licenseNumber]);

  useEffect(() => {
    if (touched.expiryDate) {
      setValidationErrors(prev => ({
        ...prev,
        expiryDate: validateExpiryDate(expiryDate)
      }));
    }
  }, [expiryDate, touched.expiryDate]);

  useEffect(() => {
    if (touched.licensePhoto) {
      setValidationErrors(prev => ({
        ...prev,
        licensePhoto: validateLicensePhoto(licensePhoto)
      }));
    }
  }, [licensePhoto, touched.licensePhoto]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const licenseNumberError = validateLicenseNumber(licenseNumber);
    const expiryDateError = validateExpiryDate(expiryDate);
    const licensePhotoError = validateLicensePhoto(licensePhoto);

    setValidationErrors({
      licenseNumber: licenseNumberError,
      expiryDate: expiryDateError,
      licensePhoto: licensePhotoError
    });

    setTouched({
      licenseNumber: true,
      expiryDate: true,
      licensePhoto: true
    });

    return !licenseNumberError && !expiryDateError && !licensePhotoError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    const userId = localStorage.getItem("userId");

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
        setError('');
        
        setTimeout(() => {
          navigate("/explore"); 
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        setError("License already exists for this user.");
      } else {
        setError("Something went wrong while adding the license.");
      }
      setSuccess(false);
    }
  };

  return (
    <div className="container py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card shadow-lg border-0" style={{ 
            borderRadius: '15px',
            borderTop: '5px solid #4e73df',
            background: 'linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 100%)'
          }}>
            <div className="card-body p-4">
              <h2 className="text-center mb-4" style={{ 
                color: '#2e59d9',
                fontWeight: '600',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}>
                <i className="bi bi-card-checklist me-2" style={{ color: '#4e73df' }}></i>
                Add Driving License
              </h2>

              {error && (
                <div className="alert alert-danger d-flex align-items-center" style={{
                  backgroundColor: '#f8d7da',
                  borderColor: '#f5c6cb',
                  color: '#721c24'
                }}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success d-flex align-items-center" style={{
                  backgroundColor: '#d4edda',
                  borderColor: '#c3e6cb',
                  color: '#155724'
                }}>
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>License added successfully!</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group mb-4">
                  <label htmlFor="licenseNumber" className="form-label" style={{
                    color: '#5a5c69',
                    fontWeight: '600'
                  }}>
                    <i className="bi bi-123 me-2" style={{ color: '#4e73df' }}></i>
                    License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    className={`form-control py-2 ${validationErrors.licenseNumber && touched.licenseNumber ? 'is-invalid border-2' : ''}`}
                    style={{
                      borderRadius: '8px',
                      borderColor: validationErrors.licenseNumber && touched.licenseNumber ? '#e74a3b' : '#d1d3e2',
                      backgroundColor: validationErrors.licenseNumber && touched.licenseNumber ? '#fdf3f2' : '#fff'
                    }}
                    placeholder="Enter your license number (e.g., DL12345678)"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    onBlur={() => handleBlur('licenseNumber')}
                  />
                  {validationErrors.licenseNumber && touched.licenseNumber && (
                    <div className="invalid-feedback d-flex align-items-center mt-1" style={{ color: '#e74a3b' }}>
                      <i className="bi bi-exclamation-circle-fill me-2"></i>
                      {validationErrors.licenseNumber}
                    </div>
                  )}
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="expiryDate" className="form-label" style={{
                    color: '#5a5c69',
                    fontWeight: '600'
                  }}>
                    <i className="bi bi-calendar-date me-2" style={{ color: '#4e73df' }}></i>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    className={`form-control py-2 ${validationErrors.expiryDate && touched.expiryDate ? 'is-invalid border-2' : ''}`}
                    style={{
                      borderRadius: '8px',
                      borderColor: validationErrors.expiryDate && touched.expiryDate ? '#e74a3b' : '#d1d3e2',
                      backgroundColor: validationErrors.expiryDate && touched.expiryDate ? '#fdf3f2' : '#fff'
                    }}
                    value={expiryDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    onBlur={() => handleBlur('expiryDate')}
                  />
                  {validationErrors.expiryDate && touched.expiryDate && (
                    <div className="invalid-feedback d-flex align-items-center mt-1" style={{ color: '#e74a3b' }}>
                      <i className="bi bi-exclamation-circle-fill me-2"></i>
                      {validationErrors.expiryDate}
                    </div>
                  )}
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="licensePhoto" className="form-label" style={{
                    color: '#5a5c69',
                    fontWeight: '600'
                  }}>
                    <i className="bi bi-image me-2" style={{ color: '#4e73df' }}></i>
                    License Photo
                  </label>
                  <input
                    type="file"
                    id="licensePhoto"
                    className={`form-control py-2 ${validationErrors.licensePhoto && touched.licensePhoto ? 'is-invalid border-2' : ''}`}
                    style={{
                      borderRadius: '8px',
                      borderColor: validationErrors.licensePhoto && touched.licensePhoto ? '#e74a3b' : '#d1d3e2',
                      backgroundColor: validationErrors.licensePhoto && touched.licensePhoto ? '#fdf3f2' : '#fff'
                    }}
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={(e) => setLicensePhoto(e.target.files[0])}
                    onBlur={() => handleBlur('licensePhoto')}
                  />
                  {validationErrors.licensePhoto && touched.licensePhoto && (
                    <div className="invalid-feedback d-flex align-items-center mt-1" style={{ color: '#e74a3b' }}>
                      <i className="bi bi-exclamation-circle-fill me-2"></i>
                      {validationErrors.licensePhoto}
                    </div>
                  )}
                  <small className="form-text d-block mt-2" style={{ color: '#858796' }}>
                    <i className="bi bi-info-circle me-1"></i>
                    Upload a clear photo of your license (JPEG/PNG, max 2MB)
                  </small>
                </div>

                <button 
                  type="submit" 
                  className="btn w-100 py-2 mt-3" 
                  style={{
                    backgroundColor: '#4e73df',
                    color: 'white',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(78, 115, 223, 0.3)',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(to right, #4e73df 0%, #224abe 100%)'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.9'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  <i className="bi bi-save-fill me-2"></i>
                  Submit License
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLicense;
