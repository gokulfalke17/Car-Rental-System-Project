import React from "react";
import { Card } from "react-bootstrap";
import { 
  FaSearch, 
  FaCar, 
  FaCheck, 
  FaCreditCard, 
  FaCheckCircle,
  FaChevronRight
} from "react-icons/fa";
import "./BookingFlow.css";

const steps = [
  { name: "Search", icon: <FaSearch />, color: "#4e73df" },
  { name: "Select", icon: <FaCar />, color: "#1cc88a" },
  { name: "Confirm", icon: <FaCheck />, color: "#36b9cc" },
  { name: "Payment", icon: <FaCreditCard />, color: "#f6c23e" },
  { name: "Complete", icon: <FaCheckCircle />, color: "#e74a3b" }
];

const BookingFlow = () => (
  <Card className="booking-flow-card">
    <Card.Body>
      <h5 className="section-title">Booking Process</h5>
      
      <div className="timeline-desktop">
        {steps.map((step, index) => (
          <React.Fragment key={`desktop-${index}`}>
            <div className="timeline-step">
              <div 
                className="timeline-icon" 
                style={{ backgroundColor: step.color }}
              >
                {step.icon}
              </div>
              <div className="timeline-label">{step.name}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="timeline-connector" />
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="stepper-mobile">
        {steps.map((step, index) => (
          <React.Fragment key={`mobile-${index}`}>
            <div className="stepper-step">
              <div 
                className="stepper-icon" 
                style={{ borderColor: step.color }}
              >
                <span style={{ color: step.color }}>{index + 1}</span>
              </div>
              <div className="stepper-content">
                <div className="stepper-title">{step.name}</div>
                {index < steps.length - 1 && (
                  <div className="stepper-chevron">
                    <FaChevronRight />
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="stepper-divider" />
            )}
          </React.Fragment>
        ))}
      </div>
    </Card.Body>
  </Card>
);

export default BookingFlow;