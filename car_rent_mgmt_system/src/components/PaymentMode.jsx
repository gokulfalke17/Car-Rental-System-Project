import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PaymentMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;
  const [selectedMode, setSelectedMode] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!selectedMode) {
      setError('Please select a payment method');
      return;
    }
    setError('');

    const routes = {
      credit: '/credit-payment',
      debit: '/debit-payment',
      upi: '/upi-payment',
      cash: '/cash-payment'
    };

    navigate(routes[selectedMode], { state: { bookingDetails } });
  };

  const paymentOptions = [
    { value: 'credit', label: 'Credit Card', icon: 'bi-credit-card' },
    { value: 'debit', label: 'Debit Card', icon: 'bi-credit-card-2-back' },
    { value: 'upi', label: 'UPI', icon: 'bi-phone' },
    { value: 'cash', label: 'Cash on Delivery', icon: 'bi-cash' }
  ];

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Card.Header className="bg-primary text-white py-3">
              <h4 className="text-center mb-0 fw-bold">
                <i className="bi bi-credit-card me-2"></i>
                Select Payment Method
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="py-2" onClose={() => setError('')} dismissible>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              <Form>
                {paymentOptions.map((option) => (
                  <div 
                    key={option.value}
                    className={`payment-option mb-3 p-3 rounded-3 ${selectedMode === option.value ? 'bg-primary bg-opacity-10 border-primary' : 'border-light'}`}
                    style={{
                      border: '1px solid',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedMode(option.value)}
                  >
                    <Form.Check 
                      type="radio" 
                      id={option.value}
                      label={
                        <span className="fs-5 ms-2">
                          <i className={`bi ${option.icon} me-2`}></i>
                          {option.label}
                        </span>
                      }
                      name="paymentMethod" 
                      value={option.value}
                      checked={selectedMode === option.value}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      className="m-0"
                    />
                  </div>
                ))}

                <div className="d-grid mt-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={handleNext} 
                    disabled={!selectedMode}
                    className="fw-bold py-2 rounded-3"
                  >
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Proceed to Payment
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

export default PaymentMode;