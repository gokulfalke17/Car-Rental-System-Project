import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const [bookings, setBookings] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [isLoading, setIsLoading] = useState({
        bookings: false,
        cancel: false,
        details: false
    });
    const [allVariants, setAllVariants] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem("userId");
        if (!userIdFromStorage) {
            navigate('/login');
            return;
        }

        setUserId(userIdFromStorage);
        fetchBookings(userIdFromStorage);

        axios.get("http://localhost:4041/api/variant/all-variants")
            .then((res) => {
                setAllVariants(res.data);
            })
            .catch((err) => {
                console.error("Error fetching variants:", err);
                setError("Failed to load vehicle information");
            });
    }, [navigate]);

    const fetchBookings = (userId) => {
        setIsLoading(prev => ({ ...prev, bookings: true }));
        setError(null);

        axios.get(`http://localhost:4041/api/bookings/user/${userId}`, {
            params: {
                includeVehicle: true,
                includeVariant: true,
                includeUser: true
            }
        })
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    const bookingsWithPrice = res.data.map(booking => ({
                        ...booking,
                        totalPrice: booking.totalPrice || 0
                    }));
                    setBookings(bookingsWithPrice);
                    localStorage.setItem('bookings', JSON.stringify(bookingsWithPrice));
                } else {
                    setBookings([]);
                    localStorage.removeItem('bookings');
                }
            })
            .catch((err) => {
                console.error("Error fetching bookings:", err);
                setError(err.response?.data?.message || 'Failed to load bookings');
                setBookings([]);
                localStorage.removeItem('bookings');
            })
            .finally(() => {
                setIsLoading(prev => ({ ...prev, bookings: false }));
            });
    };

    const handleCancel = (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        setIsLoading(prev => ({ ...prev, cancel: true }));

        axios.put(`http://localhost:4041/api/bookings/cancel/${bookingId}`)
            .then(() => {
                const updatedBookings = bookings.map(booking =>
                    booking.bookingId === bookingId
                        ? { ...booking, status: 'CANCELED' }
                        : booking
                );
                setBookings(updatedBookings);
                localStorage.setItem('bookings', JSON.stringify(updatedBookings));
                setSelectedBookingId(null);
                alert('Booking canceled successfully!');
            })
            .catch((error) => {
                console.error('Error canceling booking:', error);
                alert(error.response?.data?.message || 'Failed to cancel booking');
            })
            .finally(() => {
                setIsLoading(prev => ({ ...prev, cancel: false }));
            });
    };

    const handlePay = (bookingId) => {
        const booking = bookings.find(b => b.bookingId === bookingId);
        if (booking) {
            navigate(`/payment/${bookingId}`, {
                state: {
                    amount: booking.totalPrice || 0,
                    bookingDetails: booking
                }
            });
        } else {
            alert('Booking not found');
        }
    };

    const handleFeedback = (vehicleId, vehicleDetails) => {
        navigate('/feedback', {
            state: {
                vehicleId,
                vehicleDetails
            }
        });
    };

    const handleViewDetails = (bookingId) => {
        setIsLoading(prev => ({ ...prev, details: true }));

        axios.get(`http://localhost:4041/api/bookings/${bookingId}`, {
            params: {
                includeVehicle: true,
                includeVariant: true,
                includeUser: true
            }
        })
            .then((res) => {
                const bookingDetails = {
                    ...res.data,
                    totalPrice: res.data.totalPrice || 0
                };
                setSelectedBookingDetails(bookingDetails);
            })
            .catch((err) => {
                console.error("Error fetching booking details:", err);
                alert(err.response?.data?.message || 'Failed to load booking details');
            })
            .finally(() => {
                setIsLoading(prev => ({ ...prev, details: false }));
            });
    };

    const calculateBookingDetails = (booking) => {
        if (!booking.fromDate || !booking.toDate) return { days: 0, totalPrice: 0, dailyRate: 0 };

        const fromDate = new Date(booking.fromDate);
        const toDate = new Date(booking.toDate);
        const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

        const totalPrice = booking.totalPrice ||
            (booking.vehicle?.variant?.rentPerDay || 0) * days;

        const dailyRate = booking.vehicle?.variant?.rentPerDay || 0;

        return { days, totalPrice, dailyRate };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { bg: 'bg-warning', icon: 'bi-hourglass' },
            'ACCEPTED': { bg: 'bg-success', icon: 'bi-check-circle' },
            'CANCELED': { bg: 'bg-danger', icon: 'bi-x-circle' },
            'COMPLETED': { bg: 'bg-primary', icon: 'bi-check-all' },
            'REJECTED': { bg: 'bg-secondary', icon: 'bi-slash-circle' }
        };

        const config = statusConfig[status] || { bg: 'bg-light text-dark', icon: 'bi-question-circle' };

        return (
            <span className={`badge ${config.bg} d-flex align-items-center gap-1`}>
                <i className={`bi ${config.icon}`}></i>
                {status}
            </span>
        );
    };

    return (
        <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
                        <div className="card-header bg-primary text-white py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-0">
                                    <i className="bi bi-calendar-check me-2"></i>
                                    My Bookings
                                </h2>
                                {userId && (
                                    <span className="badge bg-light text-primary">
                                        User ID: {userId}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="card-body p-4">
                            {isLoading.bookings ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 text-primary fs-5">Loading your bookings...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger d-flex align-items-center">
                                    <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
                                    <div>
                                        <h5 className="alert-heading">Error</h5>
                                        <p className="mb-0">{error}</p>
                                        <button
                                            className="btn btn-sm btn-outline-danger mt-2"
                                            onClick={() => fetchBookings(userId)}
                                        >
                                            <i className="bi bi-arrow-repeat me-1"></i> Try Again
                                        </button>
                                    </div>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                                    <h4 className="mt-3 text-muted">No bookings found</h4>
                                    <p className="text-muted">You haven't made any bookings yet</p>
                                    <button
                                        className="btn btn-primary mt-3"
                                        onClick={() => navigate('/explore')}
                                    >
                                        <i className="bi bi-car-front me-2"></i> Explore Vehicles
                                    </button>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {bookings.map((booking) => {
                                        const { days, totalPrice, dailyRate } = calculateBookingDetails(booking);
                                        const variantImage = allVariants.find(
                                            (variant) =>
                                                variant.vehicles?.some(
                                                    (v) => v.vehicleId === booking.vehicle?.vehicleId
                                                )
                                        )?.imageUrl;

                                        const fullImageUrl = variantImage
                                            ? `http://localhost:4041${variantImage}`
                                            : "https://via.placeholder.com/300x200?text=Vehicle+Image";

                                        console.log("Image url is :: ", fullImageUrl);

                                        return (
                                            <div key={booking.bookingId} className="col-12 col-md-6 col-lg-4">
                                                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                                                    <div className="position-relative">
                                                        <img
                                                            src={(() => {
                                                                if (!fullImageUrl) return "https://via.placeholder.com/300x200?text=No+Image";

                                                                let cleanedPath = fullImageUrl.replace(/\/uploads\/imgs\/.*\/uploads\/imgs\//, "/uploads/imgs/");

                                                               
                                                                if (!cleanedPath.startsWith("http")) {
                                                                    cleanedPath = `http://localhost:4041${cleanedPath.startsWith("/") ? "" : "/"}${cleanedPath}`;
                                                                }

                                                                return cleanedPath;
                                                            })()}

                                                            className="card-img-top"
                                                            style={{
                                                                height: "200px",
                                                                objectFit: "cover",
                                                                borderTopLeftRadius: "15px",
                                                                borderTopRightRadius: "15px",
                                                                transition: "transform 0.5s ease",
                                                                transform: isHovered ? "scale(1.05)" : "scale(1)",
                                                            }}
                                                            onMouseEnter={handleMouseEnter}
                                                            onMouseLeave={handleMouseLeave}
                                                            onError={(e) => {
                                                                e.target.src = "https://via.placeholder.com/300x200?text=Vehicle+Image";
                                                            }}
                                                        />

                                                        <div className="position-absolute top-0 end-0 m-2">
                                                            {getStatusBadge(booking.status)}
                                                        </div>
                                                    </div>
                                                    <div className="card-body d-flex flex-column">
                                                        <h5 className="card-title text-primary">
                                                            #{booking.bookingId} - {booking.vehicle?.make} {booking.vehicle?.model}
                                                        </h5>
                                                        <div className="mb-2">
                                                            <small className="text-muted d-flex align-items-center">
                                                                <i className="bi bi-calendar-date me-2"></i>
                                                                {formatDate(booking.fromDate)} to {formatDate(booking.toDate)}
                                                            </small>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="badge bg-light text-dark">
                                                                <i className="bi bi-clock-history me-1"></i>
                                                                {days} {days === 1 ? 'day' : 'days'}
                                                            </span>
                                                            <h6 className="mb-0 text-success">
                                                                ₹{totalPrice}
                                                            </h6>
                                                        </div>

                                                        <div className="mt-auto d-flex flex-wrap gap-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary flex-grow-1"
                                                                onClick={() => handleViewDetails(booking.bookingId)}
                                                                disabled={isLoading.details}
                                                            >
                                                                {isLoading.details && selectedBookingDetails?.bookingId === booking.bookingId ? (
                                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                ) : (
                                                                    <i className="bi bi-info-circle me-2"></i>
                                                                )}
                                                                Details
                                                            </button>

                                                            {booking.status === 'COMPLETED' && (
                                                                <button
                                                                    className="btn btn-sm btn-info flex-grow-1"
                                                                    onClick={() => handleFeedback(booking.vehicle.vehicleId, booking.vehicle)}
                                                                >
                                                                    <i className="bi bi-chat-square-text me-2"></i>
                                                                    Feedback
                                                                </button>
                                                            )}

                                                            {booking.status === 'ACCEPTED' && (
                                                                <button
                                                                    className="btn btn-sm btn-success flex-grow-1"
                                                                    onClick={() => handlePay(booking.bookingId)}
                                                                >
                                                                    <i className="bi bi-credit-card me-2"></i>
                                                                    Pay Now
                                                                </button>
                                                            )}
                                                        </div>
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
            </div>

            {selectedBookingDetails && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title d-flex align-items-center">
                                    <i className="bi bi-file-text me-2"></i>
                                    Booking Details
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setSelectedBookingDetails(null)}
                                    disabled={isLoading.details}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <h6 className="text-primary border-bottom pb-2">Booking Information</h6>
                                        <div className="d-flex mb-2">
                                            <span className="fw-medium text-secondary me-2">ID:</span>
                                            <span>#{selectedBookingDetails.bookingId}</span>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <span className="fw-medium text-secondary me-2">Status:</span>
                                            <span>{getStatusBadge(selectedBookingDetails.status)}</span>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <span className="fw-medium text-secondary me-2">Booked On:</span>
                                            <span>{formatDate(selectedBookingDetails.bookingDate)}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="text-primary border-bottom pb-2">Rental Period</h6>
                                        <div className="d-flex mb-2">
                                            <span className="fw-medium text-secondary me-2">From:</span>
                                            <span>{formatDate(selectedBookingDetails.fromDate)}</span>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <span className="fw-medium text-secondary me-2">To:</span>
                                            <span>{formatDate(selectedBookingDetails.toDate)}</span>
                                        </div>
                                        <div className="d-flex mb-2">
                                            <span className="fw-medium text-secondary me-2">Duration:</span>
                                            <span>{calculateBookingDetails(selectedBookingDetails).days} days</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mt-3">
                                    <div className="col-md-6 mb-3">
                                        <h6 className="text-primary border-bottom pb-2">Vehicle Details</h6>

                                        <div className="d-flex mb-2">
                                            <span className="fw-medium text-secondary me-2">Reg No:</span>
                                            <span>{selectedBookingDetails.vehicle?.vehicleRegistrationNumber}</span>
                                        </div>

                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <h6 className="text-primary border-bottom pb-2">Payment Summary</h6>


                                        <div className="d-flex justify-content-between fw-bold mt-3  ">
                                            <span className="text-primary">Total:</span>
                                            <span className="text-success">₹{selectedBookingDetails.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setSelectedBookingDetails(null)}
                                >
                                    <i className="bi bi-x-lg me-1"></i> Close
                                </button>

                                {selectedBookingDetails.status === 'ACCEPTED' && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            setSelectedBookingDetails(null);
                                            handlePay(selectedBookingDetails.bookingId);
                                        }}
                                    >
                                        <i className="bi bi-credit-card me-1"></i> Proceed to Payment
                                    </button>
                                )}

                                {selectedBookingDetails.status === 'COMPLETED' ? (
                                    <button
                                        className="btn btn-info"
                                        onClick={() => {
                                            setSelectedBookingDetails(null);
                                            handleFeedback(selectedBookingDetails.vehicle.vehicleId, selectedBookingDetails.vehicle);
                                        }}
                                    >
                                        <i className="bi bi-chat-square-text me-1"></i> Give Feedback
                                    </button>
                                ) : selectedBookingDetails.status !== 'CANCELED' && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setSelectedBookingDetails(null);
                                            if (window.confirm("Are you sure you want to cancel this booking?")) {
                                                handleCancel(selectedBookingDetails.bookingId);
                                            }
                                        }}
                                        disabled={isLoading.cancel}
                                    >
                                        {isLoading.cancel ? (
                                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                        ) : (
                                            <i className="bi bi-x-circle me-1"></i>
                                        )}
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;