import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    setError('');
    setEmailError('');

    try {
      const res = await axios.get(`http://localhost:4041/api/users/forgot-password?email=${encodeURIComponent(email)}`);
      setMessage({ 
        text: res.data.message || 'Password reset link sent successfully!', 
        type: 'success' 
      });
      
      // Redirect to reset password page after a short delay
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
      setMessage({ text: '', type: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Col xs={12} md={8} lg={6} xl={5}>
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <Card.Header className="bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-shield-lock me-2"></i>
                  Forgot Password
                </h4>
              </div>
            </Card.Header>
            <Card.Body className="p-4 p-md-5">
              {message.text && (
                <Alert variant={message.type} className="d-flex align-items-center">
                  <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                  <div>{message.text}</div>
                </Alert>
              )}
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                  <label className="form-label fw-medium d-flex align-items-center">
                    <i className="bi bi-envelope-fill me-2 text-primary"></i>
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-envelope text-secondary"></i>
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      isInvalid={!!emailError}
                      required
                    />
                  </div>
                  {emailError && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {emailError}
                    </div>
                  )}
                </div>

                <div className="d-grid mt-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    className="rounded-pill py-3 fw-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill me-2"></i>
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/login')}
                    className="text-decoration-none"
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;