import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Image, Form, Button, Table, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';

function VariantDetails({ variant }) {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleStatus, setVehicleStatus] = useState('Available');
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);

    if (!variant) return null;

    useEffect(() => {
        if (variant?.variantId) {
            axios.get(`http://localhost:4041/api/variant/${variant.variantId}/vehicles`)
                .then(res => setVehicles(res.data))
                .catch(err => console.error('Error fetching vehicles:', err));
        }
    }, [variant]);

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        if (!vehicleNumber.trim()) return;

        try {
            await axios.post(
                `http://localhost:4041/api/variant/${variant.variantId}/add-vehicle`,
                null,
                {
                    params: {
                        registrationNumber: vehicleNumber,
                        status: vehicleStatus
                    }
                }
            );

            const updated = await axios.get(`http://localhost:4041/api/variant/${variant.variantId}/vehicles`);
            setVehicles(updated.data);
            setVehicleNumber('');
            setVehicleStatus('Available');
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    const handleDeleteClick = (vehicleId) => {
        setVehicleToDelete(vehicleId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:4041/api/variant/vehicle/delete/${vehicleToDelete}`);
            const updated = await axios.get(`http://localhost:4041/api/variant/${variant.variantId}/vehicles`);
            setVehicles(updated.data);
        } catch (err) {
            console.error('Error deleting vehicle:', err);
        } finally {
            setShowDeleteModal(false);
            setVehicleToDelete(null);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Available': return 'success';
            case 'Booked': return 'warning';
            case 'Under Maintenance': return 'dark';
            default: return 'light';
        }
    };

    return (
        <div className="container py-4">
            <Card className="p-4 bg-white text-dark shadow-sm border-0">
                <Row className="align-items-center">
                    <Col md={4} className="text-center mb-3 mb-md-0">
                        <Image
                            src={`http://localhost:4041/imgs/${variant.imageUrl}`}
                            alt={variant.variantName}
                            fluid
                            rounded
                            style={{ maxHeight: '250px', objectFit: 'cover' }}
                        />
                    </Col>

                    <Col md={4}>
                        <h4 className="text-primary fw-bold mb-3">{variant.variantName}</h4>
                        <p><strong className="text-secondary">Fuel Type:</strong> {variant.fuelType}</p>
                        <p><strong className="text-secondary">Seats:</strong> {variant.seatCapacity}</p>
                        <p><strong className="text-secondary">AC:</strong> {variant.isAc ? 'Yes' : 'No'}</p>
                        <p><strong className="text-secondary">Rent/Day:</strong> ₹{variant.rentPerDay}</p>
                    </Col>

                    <Col md={4}>
                        <Button
                            className="mb-3 w-100"
                            variant={showForm ? 'outline-secondary' : 'outline-success'}
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Hide Add Vehicle Form' : 'Add Registration For Vehicle'}
                        </Button>

                        {showForm && (
                            <Card className="bg-light text-dark p-3 border border-success">
                                <h5 className="text-center text-success mb-3">Add Vehicle</h5>
                                <Form onSubmit={handleAddVehicle}>
                                    <Form.Group controlId="vehicleNumber" className="mb-3">
                                        <Form.Label className="fw-semibold">Registration Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter vehicle number"
                                            value={vehicleNumber}
                                            onChange={(e) => setVehicleNumber(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="vehicleStatus" className="mb-3">
                                        <Form.Label className="fw-semibold">Status</Form.Label>
                                        <Form.Select
                                            value={vehicleStatus}
                                            onChange={(e) => setVehicleStatus(e.target.value)}
                                        >
                                            <option value="Available">Available</option>
                                            <option value="Booked">Booked</option>
                                            <option value="Under Maintenance">Under Maintenance</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button type="submit" variant="success">Add Vehicle</Button>
                                    </div>
                                </Form>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Card>

            <Card className="mt-4 bg-white text-dark p-3 shadow-sm border-0">
                <h5 className="text-center text-primary mb-3">All Registered Vehicles</h5>
                <Table striped bordered hover responsive className="text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>Vehicle ID</th>
                            <th>Registration No.</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.vehicleId}>
                                <td>{vehicle.vehicleId}</td>
                                <td>{vehicle.vehicleRegistrationNumber}</td>
                                <td>
                                    <Badge bg={getStatusVariant(vehicle.status)} className="px-3 py-1 rounded-pill">
                                        {vehicle.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="w-100"
                                        onClick={() => handleDeleteClick(vehicle.vehicleId)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this vehicle?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default VariantDetails;
