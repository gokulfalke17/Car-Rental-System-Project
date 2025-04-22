import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [userId, setUserId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId && !isNaN(storedUserId)) {
      setUserId(storedUserId);
    } else {
      setError('User ID is not available or invalid. Please log in again.');
    }

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

    if (id) {
      setVehicleId(id);
      if (!details) {
        axios.get(`http://localhost:4041/api/vehicles/${id}`)
          .then(res => {
            setVehicleDetails(res.data);
          })
          .catch(() => {
            setError('Vehicle Not Found. Please return to Your Booking and Try Again.');
          });
      } else {
        setVehicleDetails(details);
      }
    } else {
      setError('Vehicle Information Not Found. Please return to your Booking and Try Again.!');
    }
  }, [location, navigate]);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message || rating === 0) {
      setError('Please Provide Both Message and Rating.!');
      return;
    }

    if (!userId || !vehicleId) {
      setError('User ID or Vehicle ID is Missing.!');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setResponseMessage('');

    try {
      const feedbackData = {
        message,
        rating,
        user: { userId: parseInt(userId) },
        vehicle: { vehicleId: vehicleId }
      };

      const response = await axios.post('http://localhost:4041/api/feedback', feedbackData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setResponseMessage(response.data.message || 'Thank you for your feedback!');
      setMessage('');
      setRating(0);
      localStorage.removeItem('feedbackVehicleId');
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (error) {
      console.error('Booking status check error:', error);
      setError('Error checking booking status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-5">

              <h3 className="text-center text-primary fw-bold mb-4">
                Share Your Feedback
              </h3>

              {vehicleDetails && (
                <div className="mb-4">
                  <div className="bg-light rounded-3 p-3 border">
                    <h5 className="mb-1 text-dark">
                      {vehicleDetails.make} {vehicleDetails.model}
                    </h5>
                    <p className="mb-0 text-muted">
                      Registration: <strong>{vehicleDetails.vehicleRegistrationNumber}</strong>
                    </p>
                  </div>
                </div>
              )}

              {error && <div className="alert alert-danger">{error}</div>}
              {responseMessage && <div className="alert alert-success">{responseMessage}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label fw-semibold">
                    Your Feedback
                  </label>
                  <textarea
                    id="message"
                    className="form-control"
                    rows="4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your feedback here..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Rating</label>
                  <div className="d-flex mb-2">
                    {[...Array(5)].map((_, index) => (
                      <i
                        key={index}
                        className={`bi ${rating > index ? 'bi-star-fill text-warning' : 'bi-star text-secondary'} fs-2 me-2`}
                        onClick={() => handleStarClick(index)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                  <small className="text-muted">Click on the stars to rate your experience</small>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : 'Submit Feedback'}
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
