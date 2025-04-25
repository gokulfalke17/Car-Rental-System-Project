import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = "Password must be at least 8 characters with at least one letter and one number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await axios.post('http://localhost:4041/api/users/reset-password', {
        email,
        newPassword,
      });

      setMessage({ text: res.data.message || 'Password updated successfully!', type: 'success' });
      setErrors({});

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error("Password reset error:", err);
      setMessage({ 
        text: err.response?.data?.message || 'Failed to reset password. Please try again.', 
        type: 'danger' 
      });
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
                  Reset Password
                </h4>
                {email && (
                  <small className="text-light">
                    <i className="bi bi-envelope me-1"></i>
                    {email}
                  </small>
                )}
              </div>
            </Card.Header>
            <Card.Body className="p-4 p-md-5">
              {message.text && (
                <Alert variant={message.type} className="d-flex align-items-center">
                  <i className={`bi ${message.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
                  <div>{message.text}</div>
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">
                    <i className="bi bi-key me-2 text-primary"></i>
                    New Password
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock text-secondary"></i>
                    </span>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                      }}
                      isInvalid={!!errors.newPassword}
                      required
                    />
                    <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {errors.newPassword}
                    </Form.Control.Feedback>
                  </div>
                  <small className="text-muted mt-1 d-block">
                    Must be at least 8 characters with letters and numbers
                  </small>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium">
                    <i className="bi bi-key-fill me-2 text-primary"></i>
                    Confirm Password
                  </Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-lock-fill text-secondary"></i>
                    </span>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      }}
                      isInvalid={!!errors.confirmPassword}
                      required
                    />
                    <Form.Control.Feedback type="invalid" className="d-flex align-items-center">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>

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
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Update Password
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

export default ResetPassword;