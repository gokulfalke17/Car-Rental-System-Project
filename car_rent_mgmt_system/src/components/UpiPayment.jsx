import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const UpiPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  const [upiData, setUpiData] = useState({
    upiId: '',
    paymentOption: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpiData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user types
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Enhanced UPI ID validation
    if (!upiData.upiId) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiData.upiId)) {
      newErrors.upiId = 'Invalid UPI ID format (example@bank)';
    }
    
    if (!upiData.paymentOption) {
      newErrors.paymentOption = 'Please choose a payment option';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      const response = await axios.post(
        'http://localhost:4041/api/payment/upi',
        null,
        {
          params: {
            bookingId: bookingDetails?.bookingId,
            upiId: upiData.upiId,
            paymentOption: upiData.paymentOption
          }
        }
      );

      if (response.data) {
        setPaymentSuccess(true);
        setTimeout(() => navigate('/my-bookings'), 3000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({
        submit: error.response?.data?.message || 'Payment failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingDetails) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="text-center">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Error: Booking details not found
        </Alert>
      </Container>
    );
  }

  if (paymentSuccess) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow border-0 rounded-4 overflow-hidden">
              <Card.Body className="text-center p-5">
                <div className="mb-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-4">
                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                  </div>
                </div>
                <h2 className="mb-3 text-success fw-bold">Payment Successful!</h2>
                <p className="text-muted mb-4">
                  Your payment of <strong className="text-dark">₹{bookingDetails?.totalPrice?.toFixed(2) || 0}</strong> has been processed successfully.
                </p>
                <p className="text-muted">Transaction ID: <strong className="text-dark">{bookingDetails?.bookingId || 'N/A'}</strong></p>
                <Button 
                  variant="success" 
                  onClick={() => navigate('/my-bookings')}
                  className="mt-4 px-4 py-2 rounded-3 fw-bold"
                >
                  <i className="bi bi-arrow-left-circle me-2"></i>
                  Back to My Bookings
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0 rounded-4 overflow-hidden">
            <Card.Header className="bg-primary text-white py-3">
              <h4 className="mb-0 fw-bold">
                <i className="bi bi-phone me-2"></i>
                UPI Payment
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {errors.submit && (
                <Alert variant="danger" onClose={() => setErrors({...errors, submit: ''})} dismissible>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errors.submit}
                </Alert>
              )}

              <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                <i className="bi bi-info-circle-fill text-primary me-3 fs-4"></i>
                <div>
                  <h6 className="mb-1">Booking Total</h6>
                  <h4 className="mb-0 text-primary fw-bold">₹{bookingDetails?.totalPrice?.toFixed(2) || 0}</h4>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-at me-2"></i>
                    UPI ID
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="upiId"
                    value={upiData.upiId}
                    onChange={handleChange}
                    placeholder="example@upi"
                    isInvalid={!!errors.upiId}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {errors.upiId}
                  </Form.Control.Feedback>
                  <Form.Text muted>
                    Enter your UPI ID (e.g., mobilenumber@upi)
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold mb-3">
                    <i className="bi bi-wallet2 me-2"></i>
                    Select UPI App
                  </Form.Label>
                  <Row className="g-3">
                    <Col xs={12} sm={4}>
                      <Button
                        variant={
                          upiData.paymentOption === 'GPAY'
                            ? 'success'
                            : 'outline-success'
                        }
                        onClick={() => {
                          setUpiData({ ...upiData, paymentOption: 'GPAY' });
                          if (errors.paymentOption) {
                            setErrors({...errors, paymentOption: ''});
                          }
                        }}
                        className="w-100 py-2 fw-bold"
                      >
                        <i className="bi bi-google me-2"></i>
                        Google Pay
                      </Button>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Button
                        variant={
                          upiData.paymentOption === 'PHONEPE'
                            ? 'primary'
                            : 'outline-primary'
                        }
                        onClick={() => {
                          setUpiData({ ...upiData, paymentOption: 'PHONEPE' });
                          if (errors.paymentOption) {
                            setErrors({...errors, paymentOption: ''});
                          }
                        }}
                        className="w-100 py-2 fw-bold"
                      >
                        <i className="bi bi-phone me-2"></i>
                        PhonePe
                      </Button>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Button
                        variant={
                          upiData.paymentOption === 'PAYTM'
                            ? 'info'
                            : 'outline-info'
                        }
                        onClick={() => {
                          setUpiData({ ...upiData, paymentOption: 'PAYTM' });
                          if (errors.paymentOption) {
                            setErrors({...errors, paymentOption: ''});
                          }
                        }}
                        className="w-100 py-2 fw-bold text-dark"
                      >
                        <i className="bi bi-wallet me-2"></i>
                        Paytm
                      </Button>
                    </Col>
                  </Row>
                  {errors.paymentOption && (
                    <div className="text-danger mt-2">
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {errors.paymentOption}
                    </div>
                  )}
                </Form.Group>

                <div className="d-grid">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isProcessing}
                    className="py-2 rounded-3 fw-bold"
                  >
                    {isProcessing ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock-fill me-2"></i>
                        Pay ₹{bookingDetails?.totalPrice?.toFixed(2) || 0}
                      </>
                    )}
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

export default UpiPayment;