import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Card, Button, Form, Row, Col, Alert, Modal, Spinner
} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const paymentOptions = [
  { value: 'credit', label: 'Credit Card', icon: 'bi-credit-card' },
  { value: 'debit', label: 'Debit Card', icon: 'bi-credit-card-2-back' },
  { value: 'upi', label: 'UPI', icon: 'bi-phone' },
  { value: 'cash', label: 'Cash on Delivery', icon: 'bi-cash' },
];

const PaymentMode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;

  const [selectedMode, setSelectedMode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [variantDetails, setVariantDetails] = useState({
    companyName: 'Loading...',
    vehicleName: 'Loading...',
    rentPerDay: 0,
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchAllVariants = async () => {
      try {
        const { data: variants } = await axios.get('http://localhost:4041/api/variant/all-variants');

        if (!bookingDetails?.variant) {
          setVariantDetails({
            companyName: 'NA',
            vehicleName: 'NA',
            rentPerDay: bookingDetails?.rentPerDay || 0,
          });
          return;
        }

        const variantId = bookingDetails.variant.id;
        const matchedVariant = variants.find(v => v.id === variantId);

        if (matchedVariant) {
          setVariantDetails({
            companyName: matchedVariant.company?.companyName || 'NA',
            vehicleName: matchedVariant.name || 'NA',
            rentPerDay: matchedVariant.rentPerDay || bookingDetails.rentPerDay || 0,
          });
        } else {
          setVariantDetails({
            companyName: bookingDetails.variant.companyName || bookingDetails.variant.company?.companyName || 'NA',
            vehicleName: bookingDetails.variant.name || 'NA',
            rentPerDay: bookingDetails.variant.rentPerDay || bookingDetails.rentPerDay || 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch variants:', error);
        setVariantDetails({
          companyName: bookingDetails?.variant?.companyName || bookingDetails?.variant?.company?.companyName || 'NA',
          vehicleName: bookingDetails?.variant?.name || 'NA',
          rentPerDay: bookingDetails?.variant?.rentPerDay || bookingDetails?.rentPerDay || 0,
        });
      }
    };

    fetchAllVariants();
  }, [bookingDetails]);

  const handleNext = () => {
    if (!selectedMode) {
      setError('Please select a payment method.');
      return;
    }
    setError('');
    setShowModal(true);
  };

  const confirmPayment = async () => {
    if (!termsAccepted) return;

    setIsSending(true);

    const fromDate = new Date(bookingDetails?.fromDate);
    const toDate = new Date(bookingDetails?.toDate);
    const diffTime = Math.abs(toDate - fromDate);
    const noOfDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const emailPayload = {
      email: bookingDetails?.user?.email,
      userName: bookingDetails?.user?.firstName || bookingDetails?.user?.userName || 'Customer',
      carNumber: bookingDetails?.vehicle?.vehicleRegistrationNumber,
      paymentMode: selectedMode,
      amount: bookingDetails?.totalPrice,
      fromDate: bookingDetails?.fromDate,
      toDate: bookingDetails?.toDate,
      noOfDays,
      variant: bookingDetails.variant,
    };

    try {
      const response = await axios.post(
        'http://localhost:4041/api/email/send-bookingDetails',
        emailPayload
      );

      setIsSending(false);

      if (response.status === 200) {
        setSuccessMessage('Email sent successfully...! ');
        setShowModal(false); 

        setTimeout(() => {
          const routes = {
            credit: '/credit-payment',
            debit: '/debit-payment',
            upi: '/upi-payment',
            cash: '/cash-payment',
          };
          navigate(routes[selectedMode], { state: { bookingDetails } });
        }, 4000); 
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setIsSending(false);
      alert('Something went wrong. Please try again later.');
    }
  };

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
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              {successMessage && (
                <Alert variant="success" className="text-center my-3">
                  {successMessage}
                </Alert>
              )}

              <Form>
                {paymentOptions.map(({ value, label, icon }) => (
                  <div
                    key={value}
                    className={`payment-option mb-3 p-3 rounded-3 ${selectedMode === value
                        ? 'bg-primary bg-opacity-10 border border-primary'
                        : 'border border-light'
                      }`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => setSelectedMode(value)}
                  >
                    <Form.Check
                      type="radio"
                      id={value}
                      name="paymentMethod"
                      value={value}
                      checked={selectedMode === value}
                      onChange={() => setSelectedMode(value)}
                      label={
                        <span className="fs-5 ms-2">
                          <i className={`bi ${icon} me-2`}></i>
                          {label}
                        </span>
                      }
                      className="m-0"
                      disabled={!!successMessage} 
                    />
                  </div>
                ))}

                <Button
                  variant="primary"
                  size="lg"
                  className="fw-bold py-2 rounded-3 mt-4"
                  onClick={handleNext}
                  disabled={!selectedMode || !!successMessage}
                  block="true"
                >
                  <i className="bi bi-arrow-right-circle me-2"></i>
                  Proceed to Payment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You’ve chosen <strong>{paymentOptions.find((o) => o.value === selectedMode)?.label}</strong> as your payment method.
          </p>
          <p>
            Please confirm and accept our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms & Conditions
            </a>.
          </p>

          <Form.Check
            type="checkbox"
            label="I agree to the Terms & Conditions"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmPayment} disabled={!termsAccepted || isSending}>
            {isSending ? <Spinner animation="border" size="sm" /> : 'OK'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PaymentMode;
