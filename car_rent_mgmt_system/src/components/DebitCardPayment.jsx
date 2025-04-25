import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const DebitCardPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === 'cardNumber') {
      updatedValue = value.replace(/[^\d]/g, '').slice(0, 16);
    }

    if (name === 'cvv') {
      updatedValue = value.replace(/[^\d]/g, '').slice(0, 3);
    }

    if (name === 'expiryDate') {
      updatedValue = value.replace(/[^\d]/g, '').slice(0, 4);
      if (updatedValue.length >= 3) {
        updatedValue = `${updatedValue.slice(0, 2)}/${updatedValue.slice(2, 4)}`;
      }
    }

    setPaymentData(prev => ({
      ...prev,
      [name]: updatedValue
    }));

    // Clear validation error when user types
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/[^\d]/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');

    // Enhanced validation for debit cards
    const creditCardBins = [
      /^4[0-9]{5}/,    // Visa
      /^5[1-5][0-9]{4}/, // Mastercard
      /^3[47][0-9]{4}/,  // Amex
      /^6(?:011|5[0-9]{2})/ // Discover
    ];

    const isLikelyCredit = creditCardBins.some((regex) => regex.test(cleanedCardNumber));
    if (isLikelyCredit) {
      newErrors.cardNumber = 'Only debit card numbers are accepted';
    }

    if (!cleanedCardNumber || cleanedCardNumber.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!paymentData.expiryDate || !paymentData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    } else {
      const [month, year] = paymentData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(year) < currentYear || 
          (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!paymentData.cvv || !paymentData.cvv.match(/^[0-9]{3}$/)) {
      newErrors.cvv = 'Invalid CVV (3 digits required)';
    }

    if (!paymentData.cardHolderName || paymentData.cardHolderName.trim().length < 3) {
      newErrors.cardHolderName = 'Cardholder name must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');

      const response = await axios.post('http://localhost:4041/api/payment/debit-card', null, {
        params: {
          bookingId: bookingDetails?.bookingId,
          cardNumber: cleanedCardNumber,
          expiryDate: paymentData.expiryDate,
          cvv: paymentData.cvv,
          cardHolderName: paymentData.cardHolderName
        }
      });

      if (response.data) {
        setPaymentSuccess(true);
        setTimeout(() => {
          navigate('/my-bookings');
        }, 3000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({
        submit: error.response?.data?.message || 'Payment failed. Please check your details and try again.'
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
            <Card.Header className="bg-info text-white py-3">
              <h4 className="mb-0 fw-bold">
                <i className="bi bi-credit-card me-2"></i>
                Debit Card Payment
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
                <i className="bi bi-info-circle-fill text-info me-3 fs-4"></i>
                <div>
                  <h6 className="mb-1">Booking Total</h6>
                  <h4 className="mb-0 text-info fw-bold">₹{bookingDetails?.totalPrice?.toFixed(2) || 0}</h4>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-credit-card-2-front me-2"></i>
                    Debit Card Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={formatCardNumber(paymentData.cardNumber)}
                    onChange={handleChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    isInvalid={!!errors.cardNumber}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {errors.cardNumber}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-calendar-date me-2"></i>
                        Expiry Date
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        isInvalid={!!errors.expiryDate}
                        className="py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {errors.expiryDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        <i className="bi bi-shield-lock me-2"></i>
                        CVV
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength={3}
                        isInvalid={!!errors.cvv}
                        className="py-2"
                      />
                      <Form.Control.Feedback type="invalid">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        {errors.cvv}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-person-badge me-2"></i>
                    Cardholder Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="cardHolderName"
                    value={paymentData.cardHolderName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    isInvalid={!!errors.cardHolderName}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {errors.cardHolderName}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="info"
                    type="submit"
                    disabled={isProcessing}
                    size="lg"
                    className="py-2 rounded-3 fw-bold text-white"
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

export default DebitCardPayment;