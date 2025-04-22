import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");  // Extract email from the query params

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // To navigate to the login page

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Send POST request to backend to reset the password
      const res = await axios.post('http://localhost:4041/api/users/reset-password', {
        email,
        newPassword,
      });

      // Display success message
      setMessage(res.data);
      setError('');

      // Redirect to login page after successful password reset
      setTimeout(() => {
        navigate('/login');  // Navigate to login page
      }, 2000);  // Wait for 2 seconds before redirecting

    } catch (err) {
      // Handle any errors that occur
      if (err.response) {
        setError(err.response.data || 'Error updating password');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setMessage('');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="text-center bg-success text-white">
              <h4>Reset Password</h4>
            </Card.Header>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100 btn btn-success">
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
