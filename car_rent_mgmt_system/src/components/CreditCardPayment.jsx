// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

// const CreditCardPayment = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const bookingDetails = location.state?.bookingDetails;

//   const [paymentData, setPaymentData] = useState({
//     cardNumber: '',
//     expiryDate: '',
//     cvv: '',
//     cardHolderName: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const formatCardNumber = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//     const matches = v.match(/\d{4,16}/g);
//     const match = matches && matches[0] || '';
//     const parts = [];
    
//     for (let i = 0, len = match.length; i < len; i += 4) {
//       parts.push(match.substring(i, i + 4));
//     }
    
//     if (parts.length) {
//       return parts.join(' ');
//     } else {
//       return value;
//     }
//   };

//   const formatExpiryDate = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
//     if (v.length >= 3) {
//       return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
//     }
//     return value;
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');

//     if (!cleanedCardNumber || cleanedCardNumber.length !== 16) {
//       newErrors.cardNumber = 'Card number must be 16 digits';
//     }

//     if (!paymentData.expiryDate || !paymentData.expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
//       newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
//     }

//     if (!paymentData.cvv || !paymentData.cvv.match(/^[0-9]{3,4}$/)) {
//       newErrors.cvv = 'Invalid CVV';
//     }

//     if (!paymentData.cardHolderName) {
//       newErrors.cardHolderName = 'Cardholder name is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     setIsProcessing(true);

//     try {
//       const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');
      
//       // Update API call based on the controller method for credit card payment
//       const response = await axios.post('http://localhost:4041/api/payment/credit-card', null, {
//         params: {
//           bookingId: bookingDetails?.bookingId, 
//           cardNumber: cleanedCardNumber,
//           expiryDate: paymentData.expiryDate,
//           cvv: paymentData.cvv,
//           cardHolderName: paymentData.cardHolderName
//         }
//       });

//       if (response.data) {
//         setPaymentSuccess(true);
//         setTimeout(() => {
//           navigate('/my-bookings');
//         }, 3000);
//       }
//     } catch (error) {
//       console.error('Payment error:', error);
//       setErrors({
//         submit: error.response?.data?.message || 'Payment failed. Please try again.'
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (paymentSuccess) {
//     return (
//       <Container className="my-5">
//         <Row className="justify-content-center">
//           <Col md={8} lg={6}>
//             <Card className="shadow border-0">
//               <Card.Body className="text-center p-5">
//                 <div className="mb-4">
//                   <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <circle cx="12" cy="12" r="10" fill="#4BB543"/>
//                     <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </div>
//                 <h2 className="mb-3" style={{ color: '#4BB543' }}>Payment Successful!</h2>
//                 <p className="text-muted mb-4">
//                   Your payment of <strong>${bookingDetails?.totalPrice?.toFixed(2) || 0}</strong> has been processed successfully.
//                 </p>
//                 <p className="text-muted">Transaction ID: <strong>{bookingDetails?.bookingId || 'N/A'}</strong></p>
//                 <Button 
//                   variant="success" 
//                   onClick={() => navigate('/my-bookings')}
//                   className="mt-3 px-4"
//                 >
//                   Back to My Bookings
//                 </Button>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     );
//   }

//   if (!bookingDetails) {
//     return <div>Error: Booking details not found</div>;
//   }

//   return (
//     <Container className="my-5">
//       <Row className="justify-content-center">
//         <Col md={8} lg={6}>
//           <Card className="shadow border-0">
//             <Card.Header className="bg-primary text-white py-3">
//               <h4 className="mb-0">Credit Card Payment Details</h4>
//             </Card.Header>
//             <Card.Body className="p-4">
//               {errors.submit && (
//                 <Alert variant="danger" className="mb-4">
//                   {errors.submit}
//                 </Alert>
//               )}

//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Card Number</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="cardNumber"
//                     value={formatCardNumber(paymentData.cardNumber)}
//                     onChange={(e) => {
//                       const formatted = formatCardNumber(e.target.value);
//                       setPaymentData(prev => ({
//                         ...prev,
//                         cardNumber: formatted
//                       }));
//                     }}
//                     maxLength={19}
//                     placeholder="0000 0000 0000 0000"
//                     isInvalid={!!errors.cardNumber}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.cardNumber}
//                   </Form.Control.Feedback>
//                 </Form.Group>

//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>Expiry Date</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="expiryDate"
//                         value={formatExpiryDate(paymentData.expiryDate)}
//                         onChange={(e) => {
//                           const formatted = formatExpiryDate(e.target.value);
//                           setPaymentData(prev => ({
//                             ...prev,
//                             expiryDate: formatted
//                           }));
//                         }}
//                         maxLength={5}
//                         placeholder="MM/YY"
//                         isInvalid={!!errors.expiryDate}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {errors.expiryDate}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group>
//                       <Form.Label>CVV</Form.Label>
//                       <Form.Control
//                         type="password"
//                         name="cvv"
//                         value={paymentData.cvv}
//                         onChange={handleChange}
//                         maxLength={4}
//                         placeholder="123"
//                         isInvalid={!!errors.cvv}
//                       />
//                       <Form.Control.Feedback type="invalid">
//                         {errors.cvv}
//                       </Form.Control.Feedback>
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Form.Group className="mb-4">
//                   <Form.Label>Cardholder Name</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="cardHolderName"
//                     value={paymentData.cardHolderName}
//                     onChange={handleChange}
//                     placeholder="Name as on card"
//                     isInvalid={!!errors.cardHolderName}
//                   />
//                   <Form.Control.Feedback type="invalid">
//                     {errors.cardHolderName}
//                   </Form.Control.Feedback>
//                 </Form.Group>

//                 <div className="d-grid">
//                   <Button
//                     variant="primary"
//                     type="submit"
//                     disabled={isProcessing}
//                     size="lg"
//                   >
//                     {isProcessing ? (
//                       <>
//                         <Spinner
//                           as="span"
//                           animation="border"
//                           size="sm"
//                           role="status"
//                           aria-hidden="true"
//                           className="me-2"
//                         />
//                         Processing...
//                       </>
//                     ) : (
//                       `Pay $${bookingDetails?.totalPrice?.toFixed(2) || 0}`
//                     )}
//                   </Button>
//                 </div>
//               </Form>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default CreditCardPayment;


import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CreditCardPayment = () => {
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
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  const validateForm = () => {
    const newErrors = {};
    const cleanedCardNumber = paymentData.cardNumber.replace(/\s/g, '');

    if (!cleanedCardNumber || cleanedCardNumber.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!paymentData.expiryDate || !paymentData.expiryDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
      newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
    }

    if (!paymentData.cvv || !paymentData.cvv.match(/^[0-9]{3,4}$/)) {
      newErrors.cvv = 'Invalid CVV (3-4 digits)';
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
      
      const response = await axios.post('http://localhost:4041/api/payment/credit-card', null, {
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
                  Your payment of <strong className="text-dark">${bookingDetails?.totalPrice?.toFixed(2) || 0}</strong> has been processed successfully.
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

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0 rounded-4 overflow-hidden">
            <Card.Header className="bg-primary text-white py-3">
              <h4 className="mb-0 fw-bold">
                <i className="bi bi-credit-card me-2"></i>
                Credit Card Payment
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {errors.submit && (
                <Alert variant="danger" onClose={() => setErrors({...errors, submit: ''})} dismissible className="mb-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errors.submit}
                </Alert>
              )}

              <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                <i className="bi bi-info-circle-fill text-primary me-3 fs-4"></i>
                <div>
                  <h6 className="mb-1">Booking Total</h6>
                  <h4 className="mb-0 text-primary fw-bold">${bookingDetails?.totalPrice?.toFixed(2) || 0}</h4>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <i className="bi bi-credit-card-2-front me-2"></i>
                    Card Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    value={formatCardNumber(paymentData.cardNumber)}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setPaymentData(prev => ({
                        ...prev,
                        cardNumber: formatted
                      }));
                    }}
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
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
                        value={formatExpiryDate(paymentData.expiryDate)}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value);
                          setPaymentData(prev => ({
                            ...prev,
                            expiryDate: formatted
                          }));
                        }}
                        maxLength={5}
                        placeholder="MM/YY"
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
                        maxLength={4}
                        placeholder="123"
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
                    placeholder="Name as on card"
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
                    variant="primary"
                    type="submit"
                    disabled={isProcessing}
                    size="lg"
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
                        Pay ${bookingDetails?.totalPrice?.toFixed(2) || 0}
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

export default CreditCardPayment;