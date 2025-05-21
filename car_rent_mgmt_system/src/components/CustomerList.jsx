import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './CustomerList.css';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const customersResponse = await axios.get("http://localhost:4041/api/users");
            setCustomers(customersResponse.data);
            const bookingsResponse = await axios.get("http://localhost:4041/api/admin/bookings");
            setBookings(bookingsResponse.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data:", err);
            setLoading(false);
        }
    };

    const isCustomerInActiveBooking = (customerId) => {
        return bookings.some(booking =>
            booking.userId === customerId &&
            booking.status !== 'COMPLETED' &&
            booking.status !== 'CANCELED'
        );
    };

    const handleDelete = async (customerId, customerName) => {
        if (isCustomerInActiveBooking(customerId)) {
            setError(`You cannot delete ${customerName} because this user has an active/ongoing booking.`);
            setTimeout(() => setError(""), 5000);
            return;
        }

        const confirmDelete = window.confirm(`Are you sure you want to delete ${customerName}?`);
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:4041/api/users/${customerId}`);
                setCustomers(customers.filter(customer => customer.userId !== customerId));
                setSuccessMessage(`${customerName} has been deleted successfully.`);
                setTimeout(() => setSuccessMessage(""), 5000);
            } catch (err) {
                console.error("Error deleting customer:", err);
                setError("There was an error deleting the customer.");
                setTimeout(() => setError(""), 5000);
            }
        }
    };

    const filteredCustomers = customers.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.contact && customer.contact.includes(searchTerm))
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading customers...</p>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="bg-white shadow rounded-3 p-4">
                <h2 className="mb-4 text-center">Customer Management</h2>
                <p className="text-muted mb-3">{customers.length} Customers</p>

                <div className="card-body">
                    {successMessage && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            {successMessage}
                            <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError("")}></button>
                        </div>
                    )}

                    <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            
                        </div>
                        <div className="col-md-6 d-flex align-items-center justify-content-end">
                            <button
                                className="btn btn-outline-primary"
                                onClick={fetchData}
                                title="Refresh customers and bookings"
                            >
                                <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                            </button>
                        </div>
                    </div>

                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
                            <h4 className="mt-3 text-muted">No customers found</h4>
                            <p className="text-muted">Try adjusting your search or check back later</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {filteredCustomers.map((customer) => {
                                const initials = `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`.toUpperCase();
                                return (
                                    <div className="col-md-6 col-lg-4" key={customer.userId}>
                                        <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                                            <div className="card-header bg-light py-2">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="badge bg-primary">
                                                        ID: {customer.userId}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="card-body p-4">
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                                                        <span className="fs-4 text-primary">{initials}</span>
                                                    </div>
                                                    <div>
                                                        <h5 className="card-title mb-0 fw-bold text-dark">
                                                            {customer.firstName.charAt(0).toUpperCase() + customer.firstName.slice(1)}{' '}
                                                            {customer.lastName.charAt(0).toUpperCase() + customer.lastName.slice(1)}
                                                        </h5>
                                                    </div>
                                                </div>

                                                <div className="customer-details">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div className="icon-circle bg-info bg-opacity-10 me-3">
                                                            <i className="bi bi-envelope-fill text-info"></i>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">Email</small>
                                                            <p className="mb-0">{customer.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-center mb-2">
                                                        <div className="icon-circle bg-warning bg-opacity-10 me-3">
                                                            <i className="bi bi-telephone-fill text-warning"></i>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">Phone</small>
                                                            <p className="mb-0">{customer.contact || 'Not provided'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="d-flex align-items-start">
                                                        <div className="icon-circle bg-success bg-opacity-10 me-3">
                                                            <i className="bi bi-geo-alt-fill text-success"></i>
                                                        </div>
                                                        <div>
                                                            <small className="text-muted">Address</small>
                                                            <p className="mb-0">
                                                                {customer.address && `${customer.address}, `}
                                                                {customer.city && `${customer.city}, `}
                                                                {customer.state && `${customer.state}, `}
                                                                {customer.pincode || ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer bg-light py-3 d-flex justify-content-between">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(customer.userId, `${customer.firstName} ${customer.lastName}`)}
                                                >
                                                    <i className="bi bi-trash-fill me-1"></i> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerList;