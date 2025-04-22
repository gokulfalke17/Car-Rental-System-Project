import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';

const PaymentMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  const [selectedMode, setSelectedMode] = useState('');

  const handleNext = () => {
    if (!selectedMode) return;

    if (selectedMode === 'credit') {
      navigate('/credit-payment', { state: { bookingDetails } });
    } else if (selectedMode === 'debit') {
      navigate('/debit-payment', { state: { bookingDetails } });
    } else if (selectedMode === 'upi') {
      navigate('/upi-payment', { state: { bookingDetails } });
    } else if (selectedMode === 'cash') {
      navigate('/cash-payment', { state: { bookingDetails } });
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg border-0" style={{ backgroundColor: '#f8f9fa' }}>
            <Card.Body>
              <h4 className="text-center mb-4 text-primary fw-bold">Select Payment Method</h4>
              <Form>
                <Form.Check 
                  type="radio" 
                  label="💳 Credit Card" 
                  name="paymentMethod" 
                  value="credit"
                  checked={selectedMode === 'credit'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="mb-3 fs-5"
                />
                <Form.Check 
                  type="radio" 
                  label="🏦 Debit Card" 
                  name="paymentMethod" 
                  value="debit"
                  checked={selectedMode === 'debit'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="mb-3 fs-5"
                />
                <Form.Check 
                  type="radio" 
                  label="📱 UPI" 
                  name="paymentMethod" 
                  value="upi"
                  checked={selectedMode === 'upi'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="mb-3 fs-5"
                />
                <Form.Check 
                  type="radio" 
                  label="💵 Cash on Delivery" 
                  name="paymentMethod" 
                  value="cash"
                  checked={selectedMode === 'cash'}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="mb-4 fs-5"
                />
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleNext} 
                    disabled={!selectedMode}
                  >
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
