import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const SummaryCards = ({ data }) => {
  const cardColors = [
    { bg: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)", text: "white" },
    { bg: "linear-gradient(135deg, #FF6B6B 0%, #FF0000 100%)", text: "white" },
    { bg: "linear-gradient(135deg, #4DEDED 0%, #00A5A5 100%)", text: "dark" },
    { bg: "linear-gradient(135deg, #FFD166 0%, #FF9F1C 100%)", text: "dark" },
    { bg: "linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)", text: "white" }
  ];

  const cards = [
    { label: "Booked Cars", value: data.bookedCars },
    { label: "Available Cars", value: data.availableCars },
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
              background: cardColors[i].bg,
              color: cardColors[i].text,
              borderRadius: "12px",
              border: "none"
            }}
          >
            <Card.Body className="d-flex flex-column justify-content-center">
              <Card.Title className="fs-6 fw-semibold mb-2">{card.label}</Card.Title>
              <h3 className="m-0 fw-bold">{card.value}</h3>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SummaryCards;