import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner
} from 'react-bootstrap';

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
  };

  const formatCardNumber = (value) => {
    return value.replace(/[^\d]/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim();
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');

    const creditCardBins = [
      /^4[0-9]{5}/,
      /^5[1-5][0-9]{4}/,
      /^3[47][0-9]{4}/,
      /^6(?:011|5[0-9]{2})/
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
    }

    if (!paymentData.cvv || !paymentData.cvv.match(/^[0-9]{3}$/)) {
      newErrors.cvv = 'Invalid CVV';
    }

    if (!paymentData.cardHolderName) {
      newErrors.cardHolderName = 'Cardholder name is required';
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
      setErrors({
        submit: error.response?.data?.message || 'Payment failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingDetails) {
    return <div className="text-center text-danger mt-5">Error: Booking details not found</div>;
  }

  if (paymentSuccess) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow border-0">
              <Card.Body className="text-center p-5">
                <div className="mb-4">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#4BB543" />
                    <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="mb-3" style={{ color: '#4BB543' }}>Payment Successful!</h2>
                <p className="text-muted mb-4">
                  Your payment of <strong>₹{bookingDetails?.totalPrice?.toFixed(2) || 0}</strong> has been processed successfully.
                </p>
                <p className="text-muted">Transaction ID: <strong>{bookingDetails?.bookingId || 'N/A'}</strong></p>
                <Button variant="success" onClick={() => navigate('/my-bookings')} className="mt-3 px-4">
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
          <Card className="shadow border-0">
            <Card.Header className="bg-info text-white py-3">
              <h4 className="mb-0">Debit Card Payment</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={formatCardNumber(paymentData.cardNumber)}
                    onChange={handleChange}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    isInvalid={!!errors.cardNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardNumber}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        isInvalid={!!errors.expiryDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.expiryDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="password"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength={3}
                        isInvalid={!!errors.cvv}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cvv}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Cardholder Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="cardHolderName"
                    value={paymentData.cardHolderName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    isInvalid={!!errors.cardHolderName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.cardHolderName}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="info"
                  type="submit"
                  disabled={isProcessing}
                  size="lg"
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
                      Processing...
                    </>
                  ) : (
                    `Pay $${bookingDetails?.totalPrice?.toFixed(2) || 0}`
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DebitCardPayment;
