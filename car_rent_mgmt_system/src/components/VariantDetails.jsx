// import React, { useState, useEffect } from 'react';
// import { Card, Row, Col, Image, Form, Button, Table, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
// import axios from 'axios';

// function VariantDetails({ variant }) {
//     const [vehicleNumber, setVehicleNumber] = useState('');
//     const [vehicleStatus, setVehicleStatus] = useState('Available');
//     const [vehicles, setVehicles] = useState([]);
//     const [showForm, setShowForm] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [vehicleToDelete, setVehicleToDelete] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [validationErrors, setValidationErrors] = useState({});

//     if (!variant) return null;

//     useEffect(() => {
//         const fetchVehicles = async () => {
//             try {
//                 setLoading(true);
//                 const res = await axios.get(`http://localhost:4041/api/variant/${variant.variantId}/vehicles`);
//                 setVehicles(res.data);
//                 setError(null);
//             } catch (err) {
//                 console.error('Error fetching vehicles:', err);
//                 setError('Failed to fetch vehicles. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (variant?.variantId) {
//             fetchVehicles();
//         }
//     }, [variant]);

//     const validateForm = () => {
//         const errors = {};

//         if (!vehicleNumber.trim()) {
//             errors.vehicleNumber = 'Registration number is required';
//         } else if (!/^[A-Za-z0-9 -]+$/.test(vehicleNumber)) {
//             errors.vehicleNumber = 'Invalid registration number format';
//         }

//         setValidationErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleAddVehicle = async (e) => {
//         e.preventDefault();
//         setSuccess(null);

//         if (!validateForm()) return;

//         try {
//             setLoading(true);
//             await axios.post(
//                 `http://localhost:4041/api/variant/${variant.variantId}/add-vehicle`,
//                 null,
//                 {
//                     params: {
//                         registrationNumber: vehicleNumber,
//                         status: vehicleStatus
//                     }
//                 }
//             );

//             const updated = await axios.get(`http://localhost:4041/api/variant/${variant.variantId}/vehicles`);
//             setVehicles(updated.data);
//             setVehicleNumber('');
//             setVehicleStatus('Available');
//             setSuccess('Vehicle added successfully!');
//         } catch (error) {
//             console.error('Error adding vehicle:', error);
//             setError(error.response?.data?.message || 'Failed to add vehicle. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteClick = (vehicleId) => {
//         setVehicleToDelete(vehicleId);
//         setShowDeleteModal(true);
//     };

//     const confirmDelete = async () => {
//         try {
//             setLoading(true);
//             await axios.delete(`http://localhost:4041/api/variant/vehicle/delete/${vehicleToDelete}`);
//             const updated = await axios.get(`http://localhost:4041/api/variant/${variant.variantId}/vehicles`);
//             setVehicles(updated.data);
//             setSuccess('Vehicle deleted successfully!');
//         } catch (err) {
//             console.error('Error deleting vehicle:', err);
//             setError('Failed to delete vehicle. Please try again.');
//         } finally {
//             setLoading(false);
//             setShowDeleteModal(false);
//             setVehicleToDelete(null);
//         }
//     };

//     const getStatusVariant = (status) => {
//         switch (status) {
//             case 'Available': return 'success';
//             case 'Booked': return 'warning';
//             case 'Under Maintenance': return 'danger';
//             default: return 'secondary';
//         }
//     };

//     return (
//         <div className="container py-4">
//             {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
//             {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

//             <Card className="p-4 bg-white text-dark shadow-sm border-0 rounded-3">
//                 <Row className="align-items-center">
//                     <Col md={4} className="text-center mb-3 mb-md-0">
//                         <Image
//                             src={`http://localhost:4041/imgs/${variant.imageUrl}`}
//                             alt={variant.variantName}
//                             fluid
//                             rounded
//                             className="shadow"
//                             style={{
//                                 maxHeight: '250px',
//                                 objectFit: 'cover',
//                                 border: '3px solid #e9ecef'
//                             }}
//                         />
//                     </Col>

//                     <Col md={4}>
//                         <h4 className="text-primary fw-bold mb-3">
//                             {variant.variantName
//                                 .split(' ')
//                                 .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//                                 .join(' ')}
//                         </h4>
//                         <div className="variant-details">
//                             <p className="mb-2">
//                                 <span className="text-secondary fw-semibold">Fuel Type:</span>
//                                 <span className="ms-2">{variant.fuelType}</span>
//                             </p>
//                             <p className="mb-2">
//                                 <span className="text-secondary fw-semibold">Seats:</span>
//                                 <span className="ms-2">{variant.seatCapacity}</span>
//                             </p>
//                             <p className="mb-2">
//                                 <span className="text-secondary fw-semibold">AC:</span>
//                                 <span className="ms-2">{variant.isAc ? 'Yes' : 'No'}</span>
//                             </p>
//                             <p className="mb-2">
//                                 <span className="text-secondary fw-semibold">Rent/Day:</span>
//                                 <span className="ms-2 text-success fw-bold">₹{variant.rentPerDay}</span>
//                             </p>
//                         </div>
//                     </Col>

//                     <Col md={4}>
//                         <Button
//                             className="mb-3 w-100 py-2 fw-bold"
//                             variant={showForm ? 'outline-secondary' : 'outline-primary'}
//                             onClick={() => setShowForm(!showForm)}
//                             disabled={loading}
//                         >
//                             {showForm ? (
//                                 <span><i className="bi bi-x-circle me-2"></i>Hide Form</span>
//                             ) : (
//                                 <span><i className="bi bi-plus-circle me-2"></i>Vehicle Registraction</span>
//                             )}
//                         </Button>

//                         {showForm && (
//                             <Card className="bg-light text-dark p-3 border border-primary rounded-3 shadow-sm">
//                                 <Card.Header className="bg-primary text-white py-2">
//                                     <h5 className="text-center mb-0">
//                                         <i className="bi bi-car-front me-2"></i>Vehcile Registraction
//                                     </h5>
//                                 </Card.Header>
//                                 <Card.Body>
//                                     <Form onSubmit={handleAddVehicle}>
//                                         <Form.Group controlId="vehicleNumber" className="mb-3">
//                                             <Form.Label className="fw-semibold">
//                                                 <i className="bi bi-card-text me-2"></i>Registration Number
//                                             </Form.Label>
//                                             <Form.Control
//                                                 type="text"
//                                                 placeholder="e.g. MH12AB1234"
//                                                 value={vehicleNumber}
//                                                 onChange={(e) => setVehicleNumber(e.target.value)}
//                                                 isInvalid={!!validationErrors.vehicleNumber}
//                                                 className="py-2"
//                                             />
//                                             <Form.Control.Feedback type="invalid">
//                                                 {validationErrors.vehicleNumber}
//                                             </Form.Control.Feedback>
//                                         </Form.Group>

//                                         <Form.Group controlId="vehicleStatus" className="mb-3">
//                                             <Form.Label className="fw-semibold">
//                                                 <i className="bi bi-info-circle me-2"></i>Status
//                                             </Form.Label>
//                                             <Form.Select
//                                                 value={vehicleStatus}
//                                                 onChange={(e) => setVehicleStatus(e.target.value)}
//                                                 className="py-2"
//                                             >
//                                                 <option value="Available">Available</option>
//                                                 <option value="Booked">Booked</option>
//                                                 <option value="Under Maintenance">Under Maintenance</option>
//                                             </Form.Select>
//                                         </Form.Group>

//                                         <div className="d-grid">
//                                             <Button
//                                                 type="submit"
//                                                 variant="primary"
//                                                 className="py-2 fw-bold"
//                                                 disabled={loading}
//                                             >
//                                                 {loading ? (
//                                                     <Spinner as="span" animation="border" size="sm" role="status" />
//                                                 ) : (
//                                                     <span><i className="bi bi-save me-2"></i>Save Registraction</span>
//                                                 )}
//                                             </Button>
//                                         </div>
//                                     </Form>
//                                 </Card.Body>
//                             </Card>
//                         )}
//                     </Col>
//                 </Row>
//             </Card>

//             <Card className="mt-4 bg-white text-dark p-3 shadow-sm border-0 rounded-3">
//                 <Card.Header className="bg-primary text-white py-3">
//                     <h5 className="text-center mb-0">
//                         <i className="bi bi-list-check me-2"></i>Registered Vehicles
//                     </h5>
//                 </Card.Header>
//                 <Card.Body>
//                     {loading && vehicles.length === 0 ? (
//                         <div className="text-center py-4">
//                             <Spinner animation="border" variant="primary" />
//                             <p className="mt-2 text-muted">Loading vehicles...</p>
//                         </div>
//                     ) : vehicles.length === 0 ? (
//                         <Alert variant="info" className="text-center">
//                             No vehicles registered for this variant yet.
//                         </Alert>
//                     ) : (
//                         <div className="table-responsive">
//                             <Table striped bordered hover className="mb-0">
//                                 <thead className="table-primary">
//                                     <tr>
//                                         <th className="text-center">#</th>
//                                         <th>Registration No.</th>
//                                         <th className="text-center">Status</th>
//                                         <th className="text-center">Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {vehicles
//                                         .slice() 
//                                         .sort((a, b) => b.vehicleId - a.vehicleId) 
//                                         .map((vehicle, index) => (
//                                             <tr key={vehicle.vehicleId}>
//                                                 <td className="text-center">{index + 1}</td>
//                                                 <td className="fw-semibold">{vehicle.vehicleRegistrationNumber}</td>
//                                                 <td className="text-center">
//                                                     <Badge
//                                                         bg={getStatusVariant(vehicle.status)}
//                                                         className="px-3 py-2 rounded-pill text-white"
//                                                         style={{ fontSize: '0.85rem' }}
//                                                     >
//                                                         {vehicle.status}
//                                                     </Badge>
//                                                 </td>
//                                                 <td className="text-center">
//                                                     <Button
//                                                         variant="outline-danger"
//                                                         size="sm"
//                                                         className="px-3 py-1"
//                                                         onClick={() => handleDeleteClick(vehicle.vehicleId)}
//                                                         disabled={loading}
//                                                     >
//                                                         <i className="bi bi-trash me-1"></i>Delete
//                                                     </Button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                 </tbody>

//                             </Table>
//                         </div>
//                     )}
//                 </Card.Body>
//             </Card>

//             <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//                 <Modal.Header closeButton className="bg-danger text-white">
//                     <Modal.Title>
//                         <i className="bi bi-exclamation-triangle me-2"></i>Confirm Deletion
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <p className="lead">Are you sure you want to delete this vehicle?</p>
//                     <p className="text-muted">This action cannot be undone.</p>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
//                         Cancel
//                     </Button>
//                     <Button variant="danger" onClick={confirmDelete} disabled={loading}>
//                         {loading ? (
//                             <Spinner as="span" animation="border" size="sm" role="status" />
//                         ) : (
//                             'Yes, Delete'
//                         )}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// }

// export default VariantDetails;

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Image, Form, Button, Table, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

function VariantDetails({ variant }) {
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleStatus, setVehicleStatus] = useState('Available');
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    if (!variant) return null;

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:4041/api/variant/${variant.variantId}/vehicles`);
                setVehicles(res.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching vehicles:', err);
                setError('Failed to fetch vehicles. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (variant?.variantId) {
            fetchVehicles();
        }
    }, [variant]);

    const validateForm = () => {
        const errors = {};

        if (!vehicleNumber.trim()) {
            errors.vehicleNumber = 'Registration number is required';
        } else if (!/^[A-Za-z0-9 -]+$/.test(vehicleNumber)) {
            errors.vehicleNumber = 'Invalid registration number format';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        setSuccess(null);

        if (!validateForm()) return;

        try {
            setLoading(true);
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
            setSuccess('Vehicle added successfully!');
        } catch (error) {
            console.error('Error adding vehicle:', error);
            setError(error.response?.data?.message || 'Failed to add vehicle. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (vehicleId) => {
        setVehicleToDelete(vehicleId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`http://localhost:4041/api/variant/vehicle/delete/${vehicleToDelete}`);
            const updated = await axios.get(`http://localhost:4041/api/variant/${variant.variantId}/vehicles`);
            setVehicles(updated.data);
            setSuccess('Vehicle deleted successfully!');
        } catch (err) {
            console.error('Error deleting vehicle:', err);
            setError('Failed to delete vehicle. Please try again.');
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setVehicleToDelete(null);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Available': return 'success';
            case 'Booked': return 'warning';
            case 'Under Maintenance': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <div className="container-fluid py-2 px-0 px-md-3">
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

            <Card className="p-3 bg-white text-dark shadow-sm border-0 rounded-3 mb-3">
                <Row className="align-items-center">
                    <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                        <Image
                            src={`http://localhost:4041/imgs/${variant.imageUrl}`}
                            alt={variant.variantName}
                            fluid
                            rounded
                            className="shadow"
                            style={{
                                maxHeight: '200px',
                                objectFit: 'cover',
                                border: '3px solid #e9ecef'
                            }}
                        />
                    </Col>

                    <Col xs={12} md={4} className="mb-3 mb-md-0">
                        <h4 className="text-primary fw-bold mb-2 text-center text-md-start">
                            {variant.variantName
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ')}
                        </h4>
                        <div className="variant-details">
                            <p className="mb-1">
                                <span className="text-secondary fw-semibold">Fuel:</span>
                                <span className="ms-2">{variant.fuelType}</span>
                            </p>
                            <p className="mb-1">
                                <span className="text-secondary fw-semibold">Seats:</span>
                                <span className="ms-2">{variant.seatCapacity}</span>
                            </p>
                            <p className="mb-1">
                                <span className="text-secondary fw-semibold">AC:</span>
                                <span className="ms-2">{variant.isAc ? 'Yes' : 'No'}</span>
                            </p>
                            <p className="mb-1">
                                <span className="text-secondary fw-semibold">Rent/Day:</span>
                                <span className="ms-2 text-success fw-bold">₹{variant.rentPerDay}</span>
                            </p>
                        </div>
                    </Col>

                    <Col xs={12} md={4}>
                        <Button
                            className="mb-3 w-100 py-2 fw-bold"
                            variant={showForm ? 'outline-secondary' : 'outline-primary'}
                            onClick={() => setShowForm(!showForm)}
                            disabled={loading}
                        >
                            {showForm ? (
                                <span><i className="bi bi-x-circle me-2"></i>Hide Form</span>
                            ) : (
                                <span><i className="bi bi-plus-circle me-2"></i>Add Vehicle</span>
                            )}
                        </Button>

                        {showForm && (
                            <Card className="bg-light text-dark p-2 border border-primary rounded-3 shadow-sm">
                                <Card.Header className="bg-primary text-white py-2">
                                    <h5 className="text-center mb-0">
                                        <i className="bi bi-car-front me-2"></i>Vehicle Registration
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleAddVehicle}>
                                        <Form.Group controlId="vehicleNumber" className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <i className="bi bi-card-text me-2"></i>Registration No.
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="e.g. MH12AB1234"
                                                value={vehicleNumber}
                                                onChange={(e) => setVehicleNumber(e.target.value)}
                                                isInvalid={!!validationErrors.vehicleNumber}
                                                className="py-2"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {validationErrors.vehicleNumber}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group controlId="vehicleStatus" className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <i className="bi bi-info-circle me-2"></i>Status
                                            </Form.Label>
                                            <Form.Select
                                                value={vehicleStatus}
                                                onChange={(e) => setVehicleStatus(e.target.value)}
                                                className="py-2"
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Booked">Booked</option>
                                                <option value="Under Maintenance">Under Maintenance</option>
                                            </Form.Select>
                                        </Form.Group>

                                        <div className="d-grid">
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                className="py-2 fw-bold"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <Spinner as="span" animation="border" size="sm" role="status" />
                                                ) : (
                                                    <span><i className="bi bi-save me-2"></i>Save Vehicle</span>
                                                )}
                                            </Button>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Card>

            <Card className="bg-white text-dark p-2 shadow-sm border-0 rounded-3">
                <Card.Header className="bg-primary text-white py-2">
                    <h5 className="text-center mb-0">
                        <i className="bi bi-list-check me-2"></i>Registered Vehicles
                    </h5>
                </Card.Header>
                <Card.Body className="p-1 p-sm-3">
                    {loading && vehicles.length === 0 ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2 text-muted">Loading vehicles...</p>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <Alert variant="info" className="text-center m-2">
                            No vehicles registered for this variant yet.
                        </Alert>
                    ) : (
                        <div className="table-responsive">
                            <Table striped bordered hover className="mb-0">
                                <thead className="table-primary">
                                    <tr>
                                        <th className="text-center">#</th>
                                        <th>Registration No.</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles
                                        .slice() 
                                        .sort((a, b) => b.vehicleId - a.vehicleId) 
                                        .map((vehicle, index) => (
                                            <tr key={vehicle.vehicleId}>
                                                <td className="text-center">{index + 1}</td>
                                                <td className="fw-semibold">{vehicle.vehicleRegistrationNumber}</td>
                                                <td className="text-center">
                                                    <Badge
                                                        bg={getStatusVariant(vehicle.status)}
                                                        className="px-2 py-1 rounded-pill text-white"
                                                        style={{ fontSize: '0.85rem' }}
                                                    >
                                                        {vehicle.status}
                                                    </Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        className="px-2 py-1"
                                                        onClick={() => handleDeleteClick(vehicle.vehicleId)}
                                                        disabled={loading}
                                                    >
                                                        <i className="bi bi-trash me-1"></i>
                                                        <span className="d-none d-sm-inline">Delete</span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>
                        <i className="bi bi-exclamation-triangle me-2"></i>Confirm Deletion
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="lead">Are you sure you want to delete this vehicle?</p>
                    <p className="text-muted">This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete} disabled={loading}>
                        {loading ? (
                            <Spinner as="span" animation="border" size="sm" role="status" />
                        ) : (
                            'Yes, Delete'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default VariantDetails;