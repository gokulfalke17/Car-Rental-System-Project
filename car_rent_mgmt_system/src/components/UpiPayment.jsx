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
    setUpiData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!upiData.upiId) newErrors.upiId = 'UPI ID is required';
    if (!upiData.paymentOption)
      newErrors.paymentOption = 'Please choose a payment option';
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
      setErrors({
        submit:
          error.response?.data?.message || 'Payment failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingDetails) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error: Booking details not found</Alert>
      </Container>
    );
  }

  if (paymentSuccess) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="text-center border-0 shadow-lg p-4">
              <div className="mb-4">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#4BB543" />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-success mb-3">Payment Successful!</h3>
              <p className="text-muted">
                You paid <strong>${bookingDetails?.totalPrice?.toFixed(2)}</strong>
              </p>
              <p className="text-muted">
                Booking ID: <strong>{bookingDetails?.bookingId}</strong>
              </p>
              <Button variant="success" onClick={() => navigate('/my-bookings')}>
                Go to My Bookings
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <Card className="shadow border-0">
            <Card.Header className="bg-primary text-white text-center py-3">
              <h4 className="mb-0">UPI Payment</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Enter your UPI ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="upiId"
                    value={upiData.upiId}
                    onChange={handleChange}
                    placeholder="example@bank"
                    isInvalid={!!errors.upiId}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.upiId}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Select Payment Option</Form.Label>
                  <Row className="g-2">
                    <Col xs={12} sm={4}>
                      <Button
                        variant={
                          upiData.paymentOption === 'GPAY'
                            ? 'success'
                            : 'outline-success'
                        }
                        onClick={() =>
                          setUpiData({ ...upiData, paymentOption: 'GPAY' })
                        }
                        className="w-100"
                      >
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
                        onClick={() =>
                          setUpiData({ ...upiData, paymentOption: 'PHONEPE' })
                        }
                        className="w-100"
                      >
                        PhonePe
                      </Button>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Button
                        variant={
                          upiData.paymentOption === 'PAYTM'
                            ? 'danger'
                            : 'outline-danger'
                        }
                        onClick={() =>
                          setUpiData({ ...upiData, paymentOption: 'PAYTM' })
                        }
                        className="w-100"
                      >
                        Paytm
                      </Button>
                    </Col>
                  </Row>
                  {errors.paymentOption && (
                    <div className="text-danger mt-2">{errors.paymentOption}</div>
                  )}
                </Form.Group>

                <div className="d-grid mt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Processing...
                      </>
                    ) : (
                      `Pay $${bookingDetails?.totalPrice?.toFixed(2)}`
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
