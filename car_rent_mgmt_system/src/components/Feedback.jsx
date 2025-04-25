import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
          throw new Error('User not authenticated');
        }
        setUserId(storedUserId);

        let id = null;
        let details = null;

        if (location.state?.vehicleId) {
          id = location.state.vehicleId;
          details = location.state.vehicleDetails;
        } else if (localStorage.getItem('feedbackVehicleId')) {
          id = parseInt(localStorage.getItem('feedbackVehicleId'));
        } else {
          const params = new URLSearchParams(window.location.search);
          if (params.get('vehicleId')) {
            id = parseInt(params.get('vehicleId'));
          }
        }

        if (!id) {
          throw new Error('Vehicle information not found');
        }

        setVehicleId(id);

        if (!details) {
          const response = await axios.get(`http://localhost:4041/api/vehicles/${id}`);
          setVehicleDetails(response.data);
        } else {
          setVehicleDetails(details);
        }

      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 
          err.message || 
          'Error loading vehicle information. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [location]);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleStarHover = (index) => {
    setHoverRating(index + 1);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const validateForm = () => {
    if (!message.trim()) {
      setError('Please provide your feedback message');
      return false;
    }
    if (rating === 0) {
      setError('Please select a rating');
      return false;
    }
    if (!userId || !vehicleId) {
      setError('Session error. Please refresh the page and try again.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');
    setResponseMessage('');

    try {
      const feedbackData = {
        message: message.trim(),
        rating,
        user: { userId: parseInt(userId) },
        vehicle: { vehicleId }
      };

      const response = await axios.post('http://localhost:4041/api/feedback', feedbackData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setResponseMessage(response.data.message || 'Thank you for your valuable feedback!');
      setMessage('');
      setRating(0);
      localStorage.removeItem('feedbackVehicleId');
      
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      setError(error.response?.data?.message || 
        'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-primary fs-5">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (error && !vehicleDetails) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
          <div>
            <h5 className="alert-heading">Error</h5>
            <p className="mb-0">{error}</p>
            <button 
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={() => navigate('/my-bookings')}
            >
              <i className="bi bi-arrow-left me-1"></i> Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0">
                  <i className="bi bi-chat-square-text me-2"></i>
                  Share Your Feedback
                </h2>
                {vehicleDetails && (
                  <span className="badge bg-light text-primary">
                    {vehicleDetails.make} {vehicleDetails.model}
                  </span>
                )}
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              {vehicleDetails && (
                <div className="mb-4 p-3 rounded" style={{ 
                  backgroundColor: '#f1f8ff', 
                  borderLeft: '4px solid #3498db'
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-car-front fs-4 text-primary me-3"></i>
                    <div>
                      <h5 className="mb-1 text-dark">
                        {vehicleDetails.make} {vehicleDetails.model}
                      </h5>
                      <p className="mb-0 text-muted">
                        <i className="bi bi-tag-fill me-1"></i>
                        {vehicleDetails.vehicleRegistrationNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              {responseMessage && (
                <div className="alert alert-success d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div>{responseMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="message" className="form-label fw-semibold d-flex align-items-center">
                    <i className="bi bi-chat-left-text me-2 text-primary"></i>
                    Your Feedback
                  </label>
                  <textarea
                    id="message"
                    className="form-control"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your experience with this vehicle..."
                    style={{ borderRadius: '10px' }}
                    required
                  />
                  <small className="text-muted">Minimum 10 characters</small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold d-flex align-items-center">
                    <i className="bi bi-star-fill me-2 text-primary"></i>
                    Your Rating
                  </label>
                  <div className="d-flex mb-2">
                    {[...Array(5)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <i
                          key={index}
                          className={`bi ${starValue <= (hoverRating || rating) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'} fs-2 me-2`}
                          onClick={() => handleStarClick(index)}
                          onMouseEnter={() => handleStarHover(index)}
                          onMouseLeave={handleStarLeave}
                          style={{ 
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            transform: starValue <= (hoverRating || rating) ? 'scale(1.2)' : 'scale(1)'
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Click stars to rate (1-5)</small>
                    <small className={`fw-bold ${rating ? 'text-success' : 'text-muted'}`}>
                      {rating ? `Selected: ${rating} star${rating > 1 ? 's' : ''}` : 'Not rated yet'}
                    </small>
                  </div>
                </div>

                <div className="d-grid gap-3 mt-5">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg py-3 rounded-pill"
                    disabled={isSubmitting || !message.trim() || rating === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i>
                        Submit Feedback
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill"
                    onClick={() => navigate('/my-bookings')}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to My Bookings
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

export default Feedback;