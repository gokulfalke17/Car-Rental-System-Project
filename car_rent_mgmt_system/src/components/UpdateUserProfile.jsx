import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateUserProfile = () => {
  const { userId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: state?.user?.firstName || '',
    lastName: state?.user?.lastName || '',
    email: state?.user?.email || '',
    contact: state?.user?.contact || '',
    city: state?.user?.city || '',
    state: state?.user?.state || '',
    pincode: state?.user?.pincode || '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await axios.put(`http://localhost:4041/api/users/${userId}`, formData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        navigate('/customer-profile');
      }, 1500);
    } catch (error) {
      console.error('Update error:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Update Your Profile</h2>
              <p className="mb-0">Manage your account information</p>
            </div>
            
            <div className="card-body p-4">
              {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  {successMessage}
                  <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
                </div>
              )}
              
              {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {errorMessage}
                  <button type="button" className="btn-close" onClick={() => setErrorMessage('')}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        className="form-control" 
                        id="userId" 
                        value={userId} 
                        disabled 
                      />
                      <label htmlFor="userId">User ID</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        name="email" 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                      <label htmlFor="email">Email address</label>
                    </div>
                  </div>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        name="firstName" 
                        type="text" 
                        className="form-control" 
                        id="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        required 
                      />
                      <label htmlFor="firstName">First Name</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        name="lastName" 
                        type="text" 
                        className="form-control" 
                        id="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        required 
                      />
                      <label htmlFor="lastName">Last Name</label>
                    </div>
                  </div>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        name="contact" 
                        type="tel" 
                        className="form-control" 
                        id="contact" 
                        value={formData.contact} 
                        onChange={handleChange} 
                        pattern="[0-9]{10}" 
                        title="Please enter a 10-digit phone number"
                      />
                      <label htmlFor="contact">Phone Number</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        name="city" 
                        type="text" 
                        className="form-control" 
                        id="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                      />
                      <label htmlFor="city">City</label>
                    </div>
                  </div>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        name="state" 
                        type="text" 
                        className="form-control" 
                        id="state" 
                        value={formData.state} 
                        onChange={handleChange} 
                      />
                      <label htmlFor="state">State</label>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input 
                        name="pincode" 
                        type="text" 
                        className="form-control" 
                        id="pincode" 
                        value={formData.pincode} 
                        onChange={handleChange} 
                        pattern="[0-9]{6}" 
                        title="Please enter a 6-digit pincode"
                      />
                      <label htmlFor="pincode">Pincode</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="form-floating">
                    <input 
                      name="password" 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      minLength="6"
                    />
                    <label htmlFor="password">New Password (leave blank to keep unchanged)</label>
                  </div>
                  <div className="form-text text-muted">
                    Password must be at least 6 characters long
                  </div>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary me-md-2"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="card-footer bg-light">
              <small className="text-muted">
                Last updated: {new Date().toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserProfile;