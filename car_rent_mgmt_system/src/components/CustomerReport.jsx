import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Card, Table, Badge, Button, Row, Col, Container, Spinner } from "react-bootstrap";

const CustomerReport = () => {
  const [bookings, setBookings] = useState([]);
  const [variants, setVariants] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  
  const colors = {
    primary: "#2c3e50",
    secondary: "#34495e",
    accent: "#3498db",
    success: "#27ae60",
    warning: "#f39c12",
    danger: "#e74c3c",
    light: "#ecf0f1",
    dark: "#2c3e50",
    textLight: "#ffffff",
    textDark: "#2c3e50"
  };

  const activeBookings = bookings.filter(booking => booking.status === 'COMPLETED');
  const totalAmount = activeBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const currentDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });


  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <Badge bg="success" className="py-2 px-3">{status}</Badge>;
      case 'PENDING':
        return <Badge bg="warning" text="dark" className="py-2 px-3">{status}</Badge>;
      case 'CANCELLED':
        return <Badge bg="danger" className="py-2 px-3">{status}</Badge>;
      default:
        return <Badge bg="secondary" className="py-2 px-3">{status}</Badge>;
    }
  };


  const downloadPDF = () => {
    const reportElement = document.getElementById("report-content");
    const options = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: colors.light
    };

    html2canvas(reportElement, options).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 277;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const today = new Date();
      const dateString = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
      pdf.save(`customer-booking-report-${dateString}.pdf`);
    });
  };


  useEffect(() => {
    if (userId) {
      setIsLoading(true);
  
      const bookingsPromise = axios.get(`http://localhost:4041/api/bookings/customer/${userId}`);
  
      const feedbacksPromise = axios.get('http://localhost:4041/api/feedback');
  
      Promise.all([bookingsPromise, feedbacksPromise])
        .then(([bookingsRes, feedbacksRes]) => {
          setBookings(bookingsRes.data);
          setFeedbacks(feedbacksRes.data);
  
          if (bookingsRes.data.length > 0) {
            setCustomerInfo(bookingsRes.data[0].user);
  
            const variantIds = bookingsRes.data.map(booking => booking.vehicle?.variantId).filter(id => id);
            if (variantIds.length > 0) {
              Promise.all(variantIds.map(variantId =>
                axios.get(`http://localhost:4041/api/variants/${variantId}`)
              ))
                .then((variantResponses) => {
                  const fetchedVariants = variantResponses.map(response => response.data);
                  setVariants(fetchedVariants);
                  setIsLoading(false);
                })
                .catch((err) => {
                  console.error("Error fetching variants", err);
                  setIsLoading(false);
                });
            } else {
              setIsLoading(false);
            }
          } else {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching data", err);
          setIsLoading(false);
        });
    } else {
      console.warn("User ID not found in localStorage");
      setIsLoading(false);
    }
  }, [userId]);
  
  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi ${i <= rating ? 'bi-star-fill' : 'bi-star'}`}
          style={{ color: i <= rating ? colors.warning : colors.secondary }}
        ></i>
      );
    }
    return <div>{stars}</div>;
  };
  
  const userFeedbacks = feedbacks.filter(fb => {
    const feedbackUserId = fb.user?.userId?.toString();
    const currentUserId = userId ? String(userId) : '';
    return feedbackUserId === currentUserId;
  });
  
  // Debugging logs
  console.log('User ID:', userId);
  console.log('Feedbacks:', feedbacks);
  console.log('Filtered Feedbacks:', userFeedbacks);
  
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" style={{ color: colors.accent }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3" style={{ color: colors.dark }}>Generating your report...</p>
        </div>
      </Container>
    );
  }
  

  return (
    <Container fluid className="py-4 px-lg-5" style={{ backgroundColor: colors.light, minHeight: '100vh' }}>
      <div id="report-content">
        <Card className="shadow mb-4 border-0" style={{ backgroundColor: colors.primary, color: colors.textLight }}>
          <Card.Body>
            <Row className="align-items-center">
              <Col xs={12} md={8}>
                <h1 className="mb-3 mb-md-0" style={{ fontWeight: '600' }}>Customer Booking Report</h1>
              </Col>
              <Col xs={12} md={4} className="text-md-end">
                <Button
                  variant="light"
                  onClick={downloadPDF}
                  className="px-4 py-2"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.textLight,
                    border: 'none',
                    fontWeight: '500'
                  }}
                >
                  Download PDF
                </Button>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <small>Generated: {currentDate}</small>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {customerInfo && (
          <Card className="shadow-sm mb-4 border-0" style={{ backgroundColor: colors.textLight }}>
            <Card.Header style={{ backgroundColor: colors.secondary, color: colors.textLight }}>
              <h5 className="mb-0">Customer Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="d-flex align-items-center mb-3">
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: colors.accent,
                      color: colors.textLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '15px',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}>
                      {customerInfo.firstName.charAt(0)}{customerInfo.lastName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ color: colors.dark, marginBottom: '5px' }}>
                        {customerInfo.firstName} {customerInfo.lastName}
                      </h4>
                      <small style={{ color: colors.secondary }}>Customer ID: {userId}</small>
                    </div>
                  </div>
                  <div style={{ paddingLeft: '75px' }}>
                    <p className="mb-2">
                      <i className="bi bi-envelope me-2" style={{ color: colors.accent }}></i>
                      {customerInfo.email}
                    </p>
                    <p className="mb-0">
                      <i className="bi bi-telephone me-2" style={{ color: colors.accent }}></i>
                      {customerInfo.contact}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="h-100 d-flex flex-column justify-content-between">
                    <div>
                      <h6 style={{ color: colors.dark }}>Address</h6>
                      <p className="mb-1">{customerInfo.address}</p>
                      <p className="mb-1">{customerInfo.city}, {customerInfo.state}</p>
                      <p className="mb-3">PIN: {customerInfo.pincode}</p>
                    </div>
                    <div className="d-flex">
                      <Badge bg="light" text="dark" className="me-2 py-2">
                        <i className="bi bi-card-list me-1"></i> {bookings.length} Bookings
                      </Badge>
                      <Badge bg="light" text="dark" className="me-2 py-2">
                        <i className="bi bi-chat-square-text me-1"></i> {userFeedbacks.length} Feedbacks
                      </Badge>
                      <Badge bg="light" text="dark" className="py-2">
                        <i className="bi bi-currency-rupee me-1"></i>
                        {totalAmount} Total
                      </Badge>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {bookings.length > 0 ? (
          <>
            <Card className="shadow-sm border-0 mb-4" style={{ backgroundColor: colors.textLight }}>
              <Card.Header style={{ backgroundColor: colors.secondary, color: colors.textLight }}>
                <Row className="align-items-center">
                  <Col>
                    <h5 className="mb-0">Booking History</h5>
                  </Col>
                  <Col className="text-end">
                    <small>
                      Showing {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                    </small>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead style={{ backgroundColor: colors.light }}>
                      <tr>
                        <th style={{ color: colors.dark }}>Booking</th>
                        <th style={{ color: colors.dark }}>Vehicle</th>
                        <th style={{ color: colors.dark }}>Period</th>
                        <th style={{ color: colors.dark }} className="text-end">Total Days Amount</th>
                        <th style={{ color: colors.dark }}>Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => {
                        const vehicle = booking.vehicle || {};
                        const variant = vehicle.variant || variants.find(v => v.variantId === vehicle.variantId) || {};

                        const daysRented = Math.ceil((new Date(booking.toDate) - new Date(booking.fromDate)) / (1000 * 60 * 60 * 24)) || 1;
                        const calculatedDailyRate = booking.totalPrice / daysRented;
                        const dailyRate = variant.rentPerDay || calculatedDailyRate;

                        return (
                          <tr key={index} style={{ borderBottom: `1px solid ${colors.light}` }}>

                            <td>
                              <div className="d-flex flex-column">
                                <strong style={{ color: colors.primary }}>#{booking.bookingId}</strong>
                                <small style={{ color: colors.secondary }}>
                                  {formatDate(booking.bookingDate)}
                                </small>
                              </div>
                            </td>

                            <td>
                              <div className="d-flex">
                                <div className="flex-grow-1">
                                  <h6 className="mb-1" style={{ color: colors.dark }}>
                                    {variant.variantName || vehicle.vehicleRegistrationNumber || 'Vehicle details not available'}
                                  </h6>
                                  {variant.modelNumber && (
                                    <small className="d-block" style={{ color: colors.secondary }}>
                                      {variant.modelNumber}
                                    </small>
                                  )}
                                  {(variant.fuelType || variant.year) && (
                                    <small style={{ color: colors.secondary }}>
                                      {variant.fuelType} {variant.fuelType && variant.year ? '•' : ''} {variant.year}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="d-flex flex-column">
                                <small>
                                  <strong style={{ color: colors.dark }}>From:</strong> {formatDate(booking.fromDate)}
                                </small>
                                <small>
                                  <strong style={{ color: colors.dark }}>To:</strong> {formatDate(booking.toDate)}
                                </small>
                                <small>
                                  <strong style={{ color: colors.dark }}>Days:</strong> {daysRented}
                                </small>
                                <small style={{
                                  color: dailyRate ? colors.secondary : colors.warning,
                                  fontWeight: '500'
                                }}>
                                  {dailyRate ? (
                                    `₹${dailyRate.toFixed(2)}/day`
                                  ) : (
                                    <>
                                      <i className="bi bi-exclamation-circle me-1"></i>
                                      Rate calculation unavailable
                                    </>
                                  )}
                                </small>
                              </div>
                            </td>

                            <td className="text-end">
                              <div className="d-flex flex-column">
                                <strong style={{ color: colors.primary }}>₹{booking.totalPrice}</strong>
                                {booking.status === 'PAID' && (
                                  <small style={{ color: colors.success }}>
                                    <i className="bi bi-check-circle-fill me-1"></i> Paid
                                  </small>
                                )}
                              </div>
                            </td>
                            <td className="align-middle">
                              {getStatusBadge(booking.status)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
              <Card.Footer style={{ backgroundColor: colors.light }}>
                <Row>
                  <Col xs={12} md={6} className="mb-2 mb-md-0">
                  </Col>
                  <Col xs={12} md={5} className="text-md-end">
                    <div className="d-flex flex-column flex-md-row justify-content-md-end">
                      <div className="me-md-3 mb-2 mb-md-0">
                        <small className="text-muted">Active Bookings:</small>
                        <strong className="ms-2">{activeBookings.length}</strong>
                      </div>
                      <div>
                        <small className="text-muted">Total Amount:</small>
                        <strong className="ms-2">
                          ₹{totalAmount}
                        </strong>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>

            {userFeedbacks.length > 0 && (
              <Card className="shadow-sm border-0 mb-4" style={{ backgroundColor: colors.textLight }}>
                <Card.Header style={{
                  backgroundColor: colors.secondary,
                  color: colors.textLight,
                  borderBottom: `2px solid ${colors.accent}`
                }}>
                  <Row className="align-items-center">
                    <Col>
                      <h5 className="mb-0">
                        <i className="bi bi-chat-square-text me-2"></i>
                        Your Feedback History
                      </h5>
                    </Col>
                    <Col className="text-end">
                      <Badge pill bg="accent" style={{ backgroundColor: colors.accent }}>
                        {userFeedbacks.length} {userFeedbacks.length === 1 ? 'Feedback' : 'Feedbacks'}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0" style={{ borderColor: colors.light }}>
                      <thead style={{ backgroundColor: colors.light }}>
                        <tr>
                          <th style={{
                            color: colors.dark,
                            borderBottom: `2px solid ${colors.accent}`,
                            padding: '12px 16px'
                          }}>ID</th>
                          <th style={{
                            color: colors.dark,
                            borderBottom: `2px solid ${colors.accent}`,
                            padding: '12px 16px'
                          }}>Feedback</th>
                          <th style={{
                            color: colors.dark,
                            borderBottom: `2px solid ${colors.accent}`,
                            padding: '12px 16px'
                          }}>Rating</th>
                          <th style={{
                            color: colors.dark,
                            borderBottom: `2px solid ${colors.accent}`,
                            padding: '12px 16px'
                          }}>Vehicle Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userFeedbacks.map((feedback) => {

                          return (
                            <tr key={feedback.id} style={{
                              borderBottom: `1px solid ${colors.light}`,
                              transition: 'background-color 0.2s'
                            }}>
                              <td style={{
                                color: colors.primary,
                                fontWeight: '600',
                                padding: '12px 16px',
                                verticalAlign: 'middle'
                              }}>
                                #{feedback.id}
                              </td>
                              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                <div style={{
                                  maxWidth: '300px',
                                  backgroundColor: feedback.message ? colors.light : 'transparent',
                                  padding: feedback.message ? '10px' : '0',
                                  borderRadius: '4px'
                                }}>
                                  {feedback.message || (
                                    <span style={{
                                      color: colors.secondary,
                                      fontStyle: 'italic'
                                    }}>
                                      No message provided
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                <div className="d-flex align-items-center">
                                  <div style={{
                                    backgroundColor: colors.light,
                                    padding: '5px 10px',
                                    borderRadius: '20px',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}>
                                    {getRatingStars(feedback.rating)}
                                    <span style={{
                                      color: colors.dark,
                                      marginLeft: '8px',
                                      fontWeight: '600'
                                    }}>
                                      {feedback.rating}/5
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                                {feedback.vehicle ? (
                                  <div className="d-flex align-items-center">
                                    <div style={{
                                      width: '40px',
                                      height: '40px',
                                      backgroundColor: colors.accent + '20',
                                      borderRadius: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      marginRight: '12px',
                                      color: colors.accent
                                    }}>
                                      <i className="bi bi-car-front-fill"></i>
                                    </div>
                                    <div>
                                      <strong style={{ color: colors.dark }}>
                                        {feedback.vehicle.vehicleRegistrationNumber}
                                      </strong>
                                      
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{
                                    color: colors.secondary,
                                    fontStyle: 'italic'
                                  }}>
                                    Vehicle details not available
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
                <Card.Footer style={{
                  backgroundColor: colors.light,
                  borderTop: `1px solid ${colors.light}`
                }}>
                  <div className="text-end">
                    <small style={{ color: colors.secondary }}>
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Showing all your feedback submissions
                    </small>
                  </div>
                </Card.Footer>
              </Card>
            )}
          </>
        ) : (
          <Card className="shadow-sm text-center border-0" style={{ backgroundColor: colors.textLight }}>
            <Card.Body style={{ padding: '3rem' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: colors.light,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <i className="bi bi-file-earmark-excel fs-3" style={{ color: colors.accent }}></i>
              </div>
              <h4 style={{ color: colors.dark }}>No Bookings Found</h4>
              <p className="text-muted mb-4">You don't have any booking records yet.</p>
              
            </Card.Body>
          </Card>
        )}
      </div>
    </Container>
  );
};

export default CustomerReport;