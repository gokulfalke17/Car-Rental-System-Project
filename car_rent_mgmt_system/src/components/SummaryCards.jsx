import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  FaCarSide,
  FaCarCrash,
  FaCar,
  FaUsers,
  FaCommentDots
} from "react-icons/fa";

const SummaryCards = ({ data }) => {
  const totalCars = data.bookedCars + data.availableCars;
  const availableCars = totalCars - data.bookedCars;

  const cardColors = [
    { bg: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)", text: "white", icon: <FaCarSide /> }, 
    { bg: "linear-gradient(135deg, #F87171 0%, #EF4444 100%)", text: "white", icon: <FaCarCrash /> }, 
    { bg: "linear-gradient(135deg, #34D399 0%, #10B981 100%)", text: "white", icon: <FaCar /> },     
    { bg: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)", text: "white", icon: <FaUsers /> },   
    { bg: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)", text: "white", icon: <FaCommentDots /> } 
  ];

  const cards = [
    { label: "Total Cars", value: totalCars },
    { label: "Booked Cars", value: data.bookedCars },
    { label: "Available Cars", value: availableCars },
    { label: "Customers", value: data.customerCount },
    { label: "Feedbacks", value: data.feedbackCount }
  ];

  return (
    <Row className="g-4 mb-4">
      {cards.map((card, i) => (
        <Col key={i} xs={12} sm={6} md={4} lg={3} xl={2} className="d-flex">
          <Card
            className="text-center shadow-sm flex-grow-1"
            style={{
              background: cardColors[i % cardColors.length].bg,
              color: cardColors[i % cardColors.length].text,
              borderRadius: "15px",
              border: "none",
              minHeight: "120px"
            }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
                {cardColors[i % cardColors.length].icon}
              </div>
              <Card.Title className="fs-6 fw-semibold mb-1">
                {card.label}
              </Card.Title>
              <h3 className="m-0 fw-bold">{card.value}</h3>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SummaryCards;
