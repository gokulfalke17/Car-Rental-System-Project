import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import SummaryCards from "./SummaryCards";
import PieChart from "./PieChart";
import BookingFlow from "./BookingFlow";
import BarChart from "./BarChart";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [lastUpdated, setLastUpdated] = useState(null);

  const colors = {
    primary: "#4361ee",
    primaryLight: "#4895ef",
    primaryDark: "#3a0ca3",
    secondary: "#4cc9f0",
    accent: "#f72585",
    success: "#38b000",
    warning: "#ffaa00",
    danger: "#ef233c",
    info: "#4895ef",
    dark: "#212529",
    light: "#f8f9fa",
    purple: "#7209b7",
    teal: "#06d6a0",
    orange: "#fb5607",
    pink: "#ff006e",
    gradients: {
      primary: "linear-gradient(135deg, #4361ee, #3a0ca3)",
      secondary: "linear-gradient(135deg, #4cc9f0, #4895ef)",
      accent: "linear-gradient(135deg, #f72585, #b5179e)",
      success: "linear-gradient(135deg, #38b000, #70e000)",
      warning: "linear-gradient(135deg, #ffaa00, #ffd000)"
    }
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 992;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("http://localhost:4041/api/dashboard/summary");
        
        if (!response.data || 
            typeof response.data.totalCars !== 'number' || 
            typeof response.data.bookedCars !== 'number' ||
            typeof response.data.availableCars !== 'number') {
          throw new Error("Invalid data format received from server");
        }
        
        setData(response.data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.message || "Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" 
           style={{ 
             height: "100vh",
             background: colors.gradients.primary 
           }}>
        <div className="text-center">
          <Spinner animation="border" variant="light" style={{ width: "4rem", height: "4rem" }} />
          <h4 className="mt-3 text-white">
            <i className="bi bi-speedometer2 me-2"></i>
            Loading Dashboard...
          </h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: "100vh" }}>
        <Alert variant="danger" className="shadow" style={{ 
          background: colors.gradients.accent,
          color: "white",
          border: "none",
          borderRadius: "12px"
        }}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
        <button
          className="btn mt-3 shadow-sm"
          style={{
            background: colors.gradients.primary,
            color: "white",
            padding: "10px 25px",
            borderRadius: "50px",
            fontWeight: "500"
          }}
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh Dashboard
        </button>
      </Container>
    );
  }

  return (
    <div style={{ background: colors.light, minHeight: "100vh" }}>
      <div style={{ 
        background: colors.gradients.primary,
        padding: isMobile ? "1.5rem 0" : "2.5rem 0",
        marginBottom: "2rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <Container>
          <div className="text-center">
            <h1 className="fw-bold mb-3" style={{ 
              color: "white",
              fontSize: isMobile ? "1.8rem" : "2.3rem",
              textShadow: "1px 1px 3px rgba(0,0,0,0.2)"
            }}>
              <i className="bi bi-speedometer2 me-2"></i>
              Car Rental Dashboard
            </h1>
            <p className="lead mb-0" style={{ 
              color: "rgba(255,255,255,0.9)",
              fontSize: isMobile ? "0.95rem" : "1.15rem"
            }}>
              Real-time analytics and performance metrics
              {lastUpdated && (
                <span className="d-block mt-2" style={{ fontSize: "0.8rem" }}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <Row className="g-4 mb-4">
          <SummaryCards data={data} colors={colors} isMobile={isMobile} />
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={6}>
            <div className="card h-100 shadow-sm border-0" style={{ 
              borderRadius: "15px",
              background: "white",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              ":hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
              }
            }}>
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center mb-4" style={{ 
                  color: colors.dark,
                  fontWeight: "600"
                }}>
                  <i className="bi bi-graph-up me-2" style={{ color: colors.primary }}></i>
                  Booking Flow
                  <span className="badge bg-primary ms-auto" style={{ fontSize: "0.7rem" }}>
                    Live
                  </span>
                </h5>
                <div style={{ height: isMobile ? "250px" : "300px" }}>
                  <BookingFlow colors={colors} isMobile={isMobile} />
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="card h-100 shadow-sm border-0" style={{ 
              borderRadius: "15px",
              background: "white"
            }}>
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center mb-4" style={{ 
                  color: colors.dark,
                  fontWeight: "600"
                }}>
                  <i className="bi bi-pie-chart me-2" style={{ color: colors.secondary }}></i>
                  Fleet Utilization
                </h5>
                <div style={{ height: isMobile ? "250px" : "300px" }}>
                  <PieChart
                    booked={data.bookedCars}
                    available={data.availableCars}
                    colors={[colors.accent, colors.success]}
                    isMobile={isMobile}
                  />
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <div className="me-3">
                    <span className="badge me-2" style={{ 
                      background: colors.accent,
                      width: "12px",
                      height: "12px",
                      padding: "0"
                    }}></span>
                    <small>Booked ({Math.round((data.bookedCars / data.totalCars) * 100)}%)</small>
                  </div>
                  <div>
                    <span className="badge me-2" style={{ 
                      background: colors.success,
                      width: "12px",
                      height: "12px",
                      padding: "0"
                    }}></span>
                    <small>Available ({Math.round((data.availableCars / data.totalCars) * 100)}%)</small>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col xs={12}>
            <div className="card shadow-sm border-0" style={{ 
              borderRadius: "15px",
              background: "white"
            }}>
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center mb-4" style={{ 
                  color: colors.dark,
                  fontWeight: "600"
                }}>
                  <i className="bi bi-bar-chart me-2" style={{ color: colors.purple }}></i>
                  Monthly Rental Statistics
                </h5>
                <div style={{ 
                  height: isMobile ? "280px" : "350px",
                  padding: isMobile ? "0 5px" : "0 15px"
                }}>
                  <BarChart
                    data={data}
                    colors={colors}
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          <Col md={6}>
            <div className="card h-100 shadow-sm border-0" style={{ 
              borderRadius: "15px",
              background: "white"
            }}>
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center mb-4" style={{ 
                  color: colors.dark,
                  fontWeight: "600"
                }}>
                  <i className="bi bi-calendar-check me-2" style={{ color: colors.teal }}></i>
                  Recent Reservations
                </h5>
                <div className="text-center py-4" style={{ color: colors.dark }}>
                  <i className="bi bi-clock-history" style={{ 
                    fontSize: "2.5rem", 
                    color: colors.teal,
                    opacity: 0.7
                  }}></i>
                  <p className="mt-3 mb-0" style={{ fontSize: "0.95rem" }}>
                    Reservation timeline will appear here
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="card h-100 shadow-sm border-0" style={{ 
              borderRadius: "15px",
              background: "white"
            }}>
              <div className="card-body">
                <h5 className="card-title d-flex align-items-center mb-4" style={{ 
                  color: colors.dark,
                  fontWeight: "600"
                }}>
                  <i className="bi bi-people me-2" style={{ color: colors.orange }}></i>
                  Customer Activity
                </h5>
                <div className="text-center py-4" style={{ color: colors.dark }}>
                  <i className="bi bi-graph-up-arrow" style={{ 
                    fontSize: "2.5rem", 
                    color: colors.orange,
                    opacity: 0.7
                  }}></i>
                  <p className="mt-3 mb-0" style={{ fontSize: "0.95rem" }}>
                    Customer engagement metrics will appear here
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <footer className="py-3 text-center" style={{ 
        background: colors.dark,
        color: "white",
        marginTop: "auto"
      }}>
        <small>
          © {new Date().getFullYear()} Car Rental Dashboard | 
          Data refreshes every 5 minutes | 
          Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}
        </small>
      </footer>
    </div>
  );
};

export default Dashboard;