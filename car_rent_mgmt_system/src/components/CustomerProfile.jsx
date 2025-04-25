import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CustomerProfile = () => {
  const [user, setUser] = useState(null);
  const [license, setLicense] = useState(null);
  const [error, setError] = useState('');
  const [showLicense, setShowLicense] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImageError, setProfileImageError] = useState(false);
  const [licenseImageError, setLicenseImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndLicense = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const Customeremail = localStorage.getItem("email");

        if (!Customeremail) {
          setError('No email found in localStorage!');
          setIsLoading(false);
          navigate('/login');
          return;
        }

        const userResponse = await axios.get(`http://localhost:4041/api/users/profile?email=${Customeremail}`);
        const currentUser = userResponse.data;

        if (!currentUser || !currentUser.userId) {
          throw new Error('Invalid user data received');
        }

        console.log("Logged in User ID:", currentUser.userId);

        const storedUserId = localStorage.getItem("userId");
        if (storedUserId !== currentUser.userId) {
          localStorage.clear(); 
          localStorage.setItem("userId", currentUser.userId);
          localStorage.setItem("email", currentUser.email);
        }

        setUser(currentUser);

        try {
          const licenseRes = await axios.get(`http://localhost:4041/api/license/user/${currentUser.userId}`);
          if (licenseRes.data) {
            setLicense(licenseRes.data);
          }
        } catch (licenseErr) {
          if (licenseErr.response?.status !== 404) {
            console.error("License fetch error:", licenseErr);
          }
        }

      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Error fetching profile data. Please try again.');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndLicense();
  }, [navigate]);
  
  const navigateToAddLicense = () => {
    navigate('/add-license');
  };

  const handleImageError = (type) => {
    if (type === 'profile') {
      setProfileImageError(true);
    } else {
      setLicenseImageError(true);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-primary fs-5">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
          <div>
            <h5 className="alert-heading">Error Loading Profile</h5>
            <p className="mb-0">{error}</p>
            <button 
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={() => window.location.reload()}
            >
              <i className="bi bi-arrow-repeat me-1"></i> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0">
                  <i className="bi bi-person-circle me-2"></i>
                  My Profile
                </h2>
                {user && (
                  <span className="badge bg-light text-primary">
                    ID: {user.userId}
                  </span>
                )}
              </div>
            </div>

            <div className="card-body p-4">
              {user && (
                <>
                  <div className="row align-items-center">
                    <div className="col-md-4 text-center mb-4 mb-md-0">
                      <div className="position-relative d-inline-block">
                        <img
                          src={!profileImageError && user.profileImage 
                            ? `http://localhost:4041/imgs/${user.profileImage}`
                            : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
                          alt="Profile"
                          className="rounded-circle shadow"
                          style={{ 
                            width: '180px', 
                            height: '180px', 
                            objectFit: 'cover', 
                            border: '5px solid #3498db' 
                          }}
                          onError={() => handleImageError('profile')}
                        />
                        <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm">
                          <i className="bi bi-pencil-fill text-primary"></i>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="p-4 rounded" style={{ 
                        backgroundColor: '#ffffff', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        <h5 className="mb-4 pb-2 text-primary border-bottom d-flex align-items-center">
                          <i className="bi bi-person-lines-fill me-2"></i>
                          Personal Information
                        </h5>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-person-fill text-secondary me-2"></i>
                              <span className="fw-medium text-secondary">Full Name</span>
                            </div>
                            <p className="ps-4">{user.firstName} {user.lastName}</p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-envelope-fill text-secondary me-2"></i>
                              <span className="fw-medium text-secondary">Email</span>
                            </div>
                            <p className="ps-4">{user.email}</p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-telephone-fill text-secondary me-2"></i>
                              <span className="fw-medium text-secondary">Contact</span>
                            </div>
                            <p className="ps-4">{user.contact || 'Not provided'}</p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="d-flex align-items-center mb-2">
                              <i className="bi bi-geo-alt-fill text-secondary me-2"></i>
                              <span className="fw-medium text-secondary">Location</span>
                            </div>
                            <p className="ps-4">
                              {[user.city, user.state, user.pincode].filter(Boolean).join(', ') || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-5">
                    {!license ? (
                      <div className="d-flex flex-column align-items-center">
                        <div className="alert alert-warning mb-4 w-100">
                          <i className="bi bi-exclamation-triangle-fill me-2"></i>
                          You haven't added your driving license yet
                        </div>
                        <button 
                          className="btn btn-primary btn-lg px-4 py-2 rounded-pill"
                          onClick={navigateToAddLicense}
                        >
                          <i className="bi bi-plus-circle-fill me-2"></i>
                          Add License Now
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          className={`btn btn-lg px-4 py-2 mb-4 rounded-pill ${showLicense ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => setShowLicense(!showLicense)}
                        >
                          <i className={`bi ${showLicense ? 'bi-eye-slash-fill' : 'bi-eye-fill'} me-2`}></i>
                          {showLicense ? 'Hide License' : 'View License'}
                        </button>

                        {showLicense && (
                          <div className="row justify-content-center">
                            <div className="col-lg-8">
                              <div className="p-4 rounded" style={{ 
                                backgroundColor: '#ffffff', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid rgba(0,0,0,0.05)'
                              }}>
                                <h2 className="text-center mb-4 pb-3 text-primary border-bottom d-flex align-items-center justify-content-center">
                                  <i className="bi bi-card-checklist me-3"></i>
                                  Driving License Details
                                </h2>
                                <div className="row">
                                  <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center mb-2">
                                      <i className="bi bi-card-heading text-secondary me-2"></i>
                                      <span className="fw-medium text-secondary">License Number</span>
                                    </div>
                                    <p className="ps-4">{license.licenseNumber}</p>
                                  </div>
                                  <div className="col-md-6 mb-4">
                                    <div className="d-flex align-items-center mb-2">
                                      <i className="bi bi-calendar-x text-secondary me-2"></i>
                                      <span className="fw-medium text-secondary">Expiry Date</span>
                                    </div>
                                    <p className="ps-4">{formatDate(license.expiryDate)}</p>
                                  </div>
                                </div>
                                <div className="text-center mt-4">
                                  <h6 className="fw-bold mb-3 text-primary d-flex align-items-center justify-content-center">
                                    <i className="bi bi-image-fill me-2"></i>
                                    License Photo
                                  </h6>
                                  <div className="d-flex justify-content-center">
                                    <img
                                      src={!licenseImageError 
                                        ? `http://localhost:4041/imgs/${license.licensePhoto}`
                                        : "https://via.placeholder.com/300x200?text=License+Image+Not+Found"}
                                      alt="License"
                                      className="img-fluid border rounded shadow"
                                      style={{ 
                                        maxHeight: '300px',
                                        maxWidth: '100%'
                                      }}
                                      onError={() => handleImageError('license')}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;