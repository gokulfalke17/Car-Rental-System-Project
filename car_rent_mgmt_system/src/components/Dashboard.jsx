import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import SummaryCards from "./SummaryCards";
import PieChart from "./PieChart";
import BookingFlow from "./BookingFlow";
import BarChart from "./BarChart";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4041/api/dashboard/summary");
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const colors = {
    primary: "#4361ee",
    primaryLight: "#4895ef",
    primaryDark: "#3a0ca3",

    secondary: "#4cc9f0",
    secondaryLight: "#56cfe1",
    secondaryDark: "#4895ef",

    accent: "#f72585",
    accentLight: "#ff70a6",
    accentDark: "#d0006e",

    success: "#38b000",
    successLight: "#70e000",
    successDark: "#008000",

    warning: "#ffaa00",
    warningLight: "#ffd000",
    warningDark: "#ff9500",

    danger: "#ef233c",
    dangerLight: "#f75a6e",
    dangerDark: "#d00000",

    info: "#4895ef",
    infoLight: "#56cfe1",
    infoDark: "#4361ee",

    dark: "#212529",
    darkLight: "#343a40",
    light: "#f8f9fa",
    lighter: "#e9ecef",
    lightest: "#ffffff",

    purple: "#7209b7",
    teal: "#06d6a0",
    orange: "#fb5607",
    pink: "#ff006e",

    gradientPrimary: "linear-gradient(135deg, #4361ee, #3a0ca3)",
    gradientSecondary: "linear-gradient(135deg, #4cc9f0, #4895ef)",
    gradientAccent: "linear-gradient(135deg, #f72585, #b5179e)",
    gradientSuccess: "linear-gradient(135deg, #38b000, #70e000)",
    gradientWarning: "linear-gradient(135deg, #ffaa00, #ffd000)"
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 992;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center"
        style={{
          height: "100vh",
          background: colors.gradientPrimary
        }}>
        <div className="text-center">
          <div className="spinner-border"
            style={{
              width: "4rem",
              height: "4rem",
              color: colors.lightest
            }}
            role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-white">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: "100vh" }}>
        <div className="alert alert-danger" role="alert" style={{
          background: colors.gradientAccent,
          color: colors.lightest,
          border: "none",
          borderRadius: "12px"
        }}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
        <button
          className="btn mt-3"
          style={{
            background: colors.gradientPrimary,
            color: colors.lightest,
            border: "none",
            padding: "10px 25px",
            borderRadius: "50px",
            fontWeight: "500"
          }}
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Retry
        </button>
      </Container>
    );
  }

  return (
    <div style={{
      background: colors.lighter,
      minHeight: "100vh",
      paddingBottom: "80px" 
    }}>
      <div style={{
        background: colors.gradientPrimary,
        padding: isMobile ? "1.5rem 0" : "2.5rem 0",
        marginBottom: "2rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <Container>
          <div className="text-center">
            <h1 className="fw-bold mb-3" style={{
              color: colors.lightest,
              fontSize: isMobile ? "1.8rem" : "2.3rem"
            }}>
              <i className="bi bi-speedometer2 me-2"></i>
              Car Rental Dashboard
            </h1>
            <p className="lead mb-0" style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: isMobile ? "0.95rem" : "1.15rem"
            }}>
              Real-time analytics and performance metrics
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <Row className="g-4 mb-4 pt-5">
          <SummaryCards data={data} colors={colors} isMobile={isMobile} />
        </Row>

        <Row className="g-4 mb-4 pt-5">
          <Col lg={6}>
            <div className="card h-100" style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
              background: colors.lightest,
              transition: "transform 0.3s ease",
              ":hover": {
                transform: "translateY(-5px)"
              }
            }}>
              <div className="card-body">
                <h5 className="card-title text-center mb-4" style={{
                  color: colors.dark,
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                  fontWeight: "600"
                }}>
                  <i className="bi bi-graph-up me-2" style={{ color: colors.primary }}></i>
                  Booking Flow
                </h5>
                <div style={{
                  height: isMobile ? "250px" : "300px",
                  position: "relative"
                }}>
                  <BookingFlow colors={colors} isMobile={isMobile} />
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="card h-100" style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
              background: colors.lightest
            }}>
              <div className="card-body">
                <h5 className="card-title text-center mb-4" style={{
                  color: colors.dark,
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                  fontWeight: "600"
                }}>
                  <i className="bi bi-pie-chart me-2" style={{ color: colors.secondary }}></i>
                  Car Usage Distribution
                </h5>
                <div style={{
                  height: isMobile ? "250px" : "300px",
                  position: "relative"
                }}>
                  <PieChart
                    booked={data.bookedCars}
                    available={data.availableCars}
                    colors={[colors.accent, colors.success]}
                    isMobile={isMobile}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mb-4 pt-5">
          <Col xs={12}>
            <div className="card" style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
              background: colors.lightest
            }}>
              <div className="card-body">
                <h5 className="card-title text-center mb-4" style={{
                  color: colors.dark,
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                  fontWeight: "600"
                }}>
                  <i className="bi bi-bar-chart me-2" style={{ color: colors.purple }}></i>
                  Car Usage Statistics
                </h5>
                <div style={{
                  height: isMobile ? "280px" : "350px",
                  position: "relative",
                  padding: isMobile ? "0 5px" : "0 15px",
                  margin: "0 auto",
                  width: "95%"
                }}>
                  <BarChart
                    data={data}
                    colors={colors}
                    isMobile={isMobile}
                    isTablet={isTablet}
                    barWidth={isMobile ? 0.3 : 0.4} 
                    groupSpacing={isMobile ? 0.1 : 0.2}
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="g-4 mb-5 pt-5">
          <Col md={6}>
            <div className="card h-100" style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
              background: colors.lightest
            }}>
              <div className="card-body">
                <h5 className="card-title text-center mb-4" style={{
                  color: colors.dark,
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                  fontWeight: "600"
                }}>
                  <i className="bi bi-calendar-check me-2" style={{ color: colors.teal }}></i>
                  Recent Reservations
                </h5>
                <div className="text-center py-4" style={{ color: colors.darkLight }}>
                  <i className="bi bi-clock-history" style={{ fontSize: "2.5rem", color: colors.teal }}></i>
                  <p className="mt-3" style={{ fontSize: "0.95rem" }}>Reservation timeline will appear here</p>
                </div>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="card h-100" style={{
              border: "none",
              borderRadius: "15px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
              background: colors.lightest
            }}>
              <div className="card-body">
                <h5 className="card-title text-center mb-4" style={{
                  color: colors.dark,
                  fontSize: isMobile ? "1.1rem" : "1.25rem",
                  fontWeight: "600"
                }}>
                  <i className="bi bi-people me-2" style={{ color: colors.orange }}></i>
                  Customer Activity
                </h5>
                <div className="text-center py-4" style={{ color: colors.darkLight }}>
                  <i className="bi bi-graph-up-arrow" style={{ fontSize: "2.5rem", color: colors.orange }}></i>
                  <p className="mt-3" style={{ fontSize: "0.95rem" }}>Customer metrics will appear here</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;