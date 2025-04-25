import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CashOnDelivery = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:4041/api/payment/cash-on-delivery',
        null,
        {
          params: {
            bookingId: bookingDetails?.bookingId
          }
        }
      );

      if (response.data) {
        setOrderSuccess(true);
        setTimeout(() => navigate('/my-bookings'), 3000);
      }
    } catch (err) {
      console.error('Order confirmation error:', err);
      setError(err.response?.data?.message || 'Failed to confirm order. Please try again.');
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

  if (orderSuccess) {
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
                <h2 className="mb-3 text-success fw-bold">Order Confirmed!</h2>
                <p className="text-muted mb-4">
                  Your order total is <strong className="text-dark">₹{bookingDetails?.totalPrice?.toFixed(2) || 0}</strong>
                </p>
                <p className="text-muted">
                  Pay <strong className="text-dark">₹{bookingDetails?.totalPrice?.toFixed(2) || 0}</strong> when you receive the vehicle
                </p>
                <p className="text-muted">Booking ID: <strong className="text-dark">{bookingDetails?.bookingId || 'N/A'}</strong></p>
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
            <Card.Header className="bg-warning text-dark py-3">
              <h4 className="mb-0 fw-bold">
                <i className="bi bi-cash-coin me-2"></i>
                Cash on Delivery
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                <i className="bi bi-info-circle-fill text-warning me-3 fs-4"></i>
                <div>
                  <h6 className="mb-1">Order Total</h6>
                  <h4 className="mb-0 text-warning fw-bold">₹{bookingDetails?.totalPrice?.toFixed(2) || 0}</h4>
                </div>
              </div>

              <div className="text-center mb-4">
                <i className="bi bi-truck text-warning" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3">Pay when you receive the vehicle</h5>
                <p className="text-muted">
                  Our delivery executive will collect the payment when they deliver the vehicle to you
                </p>
              </div>

              <div className="d-grid">
                <Button
                  variant="warning"
                  size="lg"
                  onClick={handleConfirmOrder}
                  disabled={isProcessing}
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
                      Confirming Order...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Confirm Order
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CashOnDelivery;