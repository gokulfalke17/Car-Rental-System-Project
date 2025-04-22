import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const Reports = () => {
    const [users, setUsers] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('customers');

    const customerReportRef = useRef();
    const feedbackReportRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await axios.get('http://localhost:4041/api/users');
                setUsers(usersRes.data);

                const userBookings = await Promise.all(
                    usersRes.data.map(user =>
                        axios.get(`http://localhost:4041/api/bookings/customer/${user.userId}`)
                            .then(res => ({
                                userId: user.userId,
                                bookings: res.data
                            }))
                    )
                );

                const bookingsData = userBookings.map(userBooking => ({
                    ...usersRes.data.find(user => user.userId === userBooking.userId),
                    bookings: userBooking.bookings
                }));
                setBookings(bookingsData);

                const feedbackRes = await axios.get('http://localhost:4041/api/feedback');
                setFeedbacks(feedbackRes.data);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching reports:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCustomerBookings = (userId) =>
        bookings.find(b => b.userId === userId)?.bookings || [];

    const calculateCompletedTotal = (customerBookings) =>
        customerBookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((total, b) => total + b.totalPrice, 0);

    const getCustomerFeedback = (userId) =>
        feedbacks.filter(fb => String(fb.userId) === String(userId));

    const getInitials = (firstName, lastName) =>
        `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

    const downloadReport = () => {
        const element = activeTab === 'customers' ? customerReportRef.current : feedbackReportRef.current;
        if (!element) return;

        const opt = {
            margin: 0.5,
            filename: `${activeTab === 'customers' ? 'Customer_Booking_Reports' : 'All_Feedbacks_Report'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };

    if (loading) {
        return <div className="container mt-5 text-center text-info">Loading reports...</div>;
    }

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-primary fw-bold">Reports Dashboard</h3>

            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('customers')}
                    >
                        Customer Booking Reports
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'all-feedbacks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all-feedbacks')}
                    >
                        All Feedbacks
                    </button>
                </li>
            </ul>

            <button onClick={downloadReport} className="btn btn-success mb-4">
                <i className="bi bi-download me-2"></i>Download {activeTab === 'customers' ? 'Customer Reports' : 'Feedback Reports'}
            </button>

            {activeTab === 'customers' && (
                <div ref={customerReportRef}>
                    <h4 className="mb-4 text-info fw-bold">Customer Booking Reports</h4>
                    {users.map((customer) => {
                        const customerBookings = getCustomerBookings(customer.userId);
                        const completedTotal = calculateCompletedTotal(customerBookings);
                        const completedCount = customerBookings.filter(b => b.status === 'COMPLETED').length;
                        const customerFeedbacks = getCustomerFeedback(customer.userId);
                        const initials = getInitials(customer.firstName, customer.lastName);

                        return (
                            <div key={customer.userId} className="card mb-5 shadow border border-primary">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between flex-wrap mb-3">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center me-3"
                                                style={{ width: '45px', height: '45px', fontSize: '1.1rem' }}>
                                                {initials}
                                            </div>
                                            <div>
                                                <h6 className="mb-0">{customer.firstName} {customer.lastName}</h6>
                                                <small className="text-muted">Generated: {new Date().toLocaleString()}</small>
                                            </div>
                                        </div>
                                        <div className="text-end mt-3 mt-md-0">
                                            <span className="badge bg-primary">
                                                <i className="bi bi-car-front-fill me-1"></i>
                                                Bookings: {customerBookings.length}
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Email:</strong> {customer.email}</p>
                                            <p><strong>Phone:</strong> {customer.contact || 'N/A'}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>City:</strong> {customer.city || 'N/A'}</p>
                                            <p><strong>PIN:</strong> {customer.pincode || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {customerBookings.length > 0 ? (
                                        <>
                                            <h6 className="text-success fw-bold mt-4">
                                                <i className="bi bi-calendar-check me-1"></i>Booking History
                                            </h6>
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover">
                                                    <thead className="table-primary">
                                                        <tr>
                                                            <th>Booking</th>
                                                            <th>Vehicle</th>
                                                            <th>Period</th>
                                                            <th>Total</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {customerBookings.map(b => (
                                                            <tr key={b.bookingId}>
                                                                <td>#{b.bookingId}</td>
                                                                <td>{b.vehicle?.vehicleRegistrationNumber || 'N/A'}</td>
                                                                <td>
                                                                    {new Date(b.fromDate).toLocaleDateString()} → {new Date(b.toDate).toLocaleDateString()}
                                                                </td>
                                                                <td>₹{b.totalPrice}</td>
                                                                <td>{b.status}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <p className="mt-2">
                                                <strong>Completed:</strong> {completedCount} &nbsp;
                                                <strong>Total ₹:</strong> {completedTotal}
                                            </p>
                                        </>
                                    ) : <p className="text-muted">No bookings found for this customer.</p>}

                                    {customerFeedbacks.length > 0 && (
                                        <>
                                            <h6 className="text-warning fw-bold mt-4">Feedbacks</h6>
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover">
                                                    <thead className="table-warning">
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Rating</th>
                                                            <th>Comment</th>
                                                            <th>Date</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {customerFeedbacks.map(fb => (
                                                            <tr key={fb.feedbackId}>
                                                                <td>#{fb.feedbackId}</td>
                                                                <td>
                                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                                        <span key={i} style={{
                                                                            color: i < fb.rating ? '#ffc107' : '#e4e5e9',
                                                                            fontSize: '1.2rem'
                                                                        }}>★</span>
                                                                    ))}
                                                                </td>
                                                                <td>{fb.comments || 'No comment'}</td>
                                                                <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ===== All Feedbacks Tab ===== */}
            {activeTab === 'all-feedbacks' && (
                <div ref={feedbackReportRef} className="card shadow border border-warning">
                    <div className="card-body">
                        <h4 className="text-warning fw-bold mb-4">
                            <i className="bi bi-chat-square-text-fill me-2"></i>All Customer Feedbacks
                        </h4>
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-warning">
                                    <tr>
                                        <th>Feedback ID</th>
                                        <th>Message</th>
                                        <th>Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbacks.length > 0 ? feedbacks.map((fb) => (
                                        <tr key={fb.id}>
                                            <td>#{fb.id}</td>
                                            <td>{fb.message || 'No message'}</td>
                                            <td>
                                                <span className="text-warning me-2">{fb.rating}/5</span>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span key={i} style={{
                                                        color: i < fb.rating ? '#ffc107' : '#e4e5e9',
                                                        fontSize: '1.2rem'
                                                    }}>★</span>
                                                ))}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="text-center text-muted">No feedbacks found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
