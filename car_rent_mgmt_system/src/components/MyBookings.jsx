import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
    
    const [bookings, setBookings] = useState([]);
    const [userId, setUserId] = useState(null);
    const [image, setImage] = useState("");
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [isLoading, setIsLoading] = useState({
        bookings: false,
        cancel: false,
        details: false
    });
    const [allVariants, setAllVariants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userIdFromStorage = localStorage.getItem("userId"); 
        localStorage
        const imageFromStorage = localStorage.getItem("imageKey");
        
        setUserId(userIdFromStorage);
        setImage(imageFromStorage);

        if (userIdFromStorage) {
            fetchBookings(userIdFromStorage);
        }


        axios.get("http://localhost:4041/api/variant/all-variants")
            .then((res) => {
                setAllVariants(res.data); 
            })
            .catch((err) => {
                console.error("Error fetching variants:", err);
            });
    }, []);

    const fetchBookings = (userId) => {
        setIsLoading(prev => ({ ...prev, bookings: true }));

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
                setIsLoading(prev => ({ ...prev, bookings: false }));
            })
            .catch((err) => {
                console.error("Error fetching bookings:", err);
                setBookings([]);
                localStorage.removeItem('bookings');
                setIsLoading(prev => ({ ...prev, bookings: false }));
                alert('Failed to load bookings. Please try again.');
            });
    };

    const handleCancel = (bookingId) => {
        setIsLoading(prev => ({ ...prev, cancel: true }));
        axios.put(`http://localhost:4041/api/bookings/cancel/${bookingId}`)
            .then(() => {
                const updatedBookings = bookings.map(booking =>
                    booking.bookingId === bookingId
                        ? { ...booking, status: 'CANCELED' }
                        : booking
                );

                setBookings(updatedBookings);

                if (updatedBookings.length > 0) {
                    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
                } else {
                    localStorage.removeItem('bookings');
                }

                setSelectedBookingId(null);
                setIsLoading(prev => ({ ...prev, cancel: false }));
                alert('Booking has been canceled successfully.');
            })
            .catch((error) => {
                console.error('Error canceling booking:', error);
                setIsLoading(prev => ({ ...prev, cancel: false }));
                alert('Failed to cancel the booking. Please try again.');
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
            console.error('Booking not found');
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
                setIsLoading(prev => ({ ...prev, details: false }));
            })
            .catch((err) => {
                console.error("Error fetching booking details:", err);
                setIsLoading(prev => ({ ...prev, details: false }));
                alert('Failed to load booking details. Please try again.');
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

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center fw-bold text-primary">My Bookings</h2>

            {isLoading.bookings ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading bookings...</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className="alert alert-info text-center">No bookings found.</div>
            ) : (
                <div className="row">
                    {bookings.map((booking) => {
                        const { days, totalPrice, dailyRate } = calculateBookingDetails(booking);

                        const variantImage = allVariants.find(
                            (variant) =>
                                variant.vehicles?.some(
                                    (v) => v.vehicleId === booking.vehicle?.vehicleId
                                )
                        )?.imageUrl;

                        const fullImageUrl = variantImage
                            ? `http://localhost:4041/imgs/${variantImage}`
                            : "/fallback.jpg";

                        return (
                            <div key={booking.bookingId} className="col-12 col-sm-6 col-md-4 mb-4">
                                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '15px' }}>
                                    <img
                                        src={fullImageUrl}  
                                        className="card-img-top"
                                        alt="Vehicle"
                                        style={{
                                            height: "200px",
                                            objectFit: "cover",
                                            borderTopLeftRadius: '15px',
                                            borderTopRightRadius: '15px'
                                        }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title text-success">Booking #{booking.bookingId}</h5>
                                        <h6 className="card-subtitle mb-2">
                                            {booking.vehicle.make} {booking.vehicle.model}
                                        </h6>
                                        <p className="mb-1 pt-2">
                                            <strong>Status:</strong>
                                            <span className={`badge ms-2 ${booking.status === 'ACCEPTED' ? 'bg-success' :
                                                booking.status === 'PENDING' ? 'bg-warning text-dark' :
                                                    booking.status === 'CANCELED' ? 'bg-danger' :
                                                        booking.status === 'COMPLETED' ? 'bg-primary' : 'bg-secondary'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </p>
                                        <p className="card-text">Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                        <p className="card-text">Total Price: ₹{totalPrice}</p>

                                        <div className="mt-auto d-flex flex-wrap gap-2 pt-4">
                                            {booking.status === 'COMPLETED' ? (
                                                <button
                                                    className="btn btn-info btn-sm flex-grow-1"
                                                    onClick={() => handleFeedback(booking.vehicle.vehicleId, booking.vehicle)}
                                                >
                                                    Give Feedback
                                                </button>
                                            ) : null}

                                            {booking.status === 'ACCEPTED' && (
                                                <button
                                                    className="btn btn-outline-info btn-sm flex-grow-1"
                                                    onClick={() => handleViewDetails(booking.bookingId)}
                                                    disabled={isLoading.details}
                                                >
                                                    {isLoading.details && selectedBookingDetails?.bookingId === booking.bookingId ? (
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    ) : 'Payment Details'}
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

            {selectedBookingId && (
                <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Cancel Booking</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedBookingId(null)}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to cancel this booking?
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setSelectedBookingId(null)}>Close</button>
                                <button className="btn btn-danger" onClick={() => handleCancel(selectedBookingId)}>Yes, Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {selectedBookingDetails && (
                <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Booking Details</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setSelectedBookingDetails(null)}
                                    disabled={isLoading.details}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Booking ID:</strong> {selectedBookingDetails.bookingId}</p>
                                <p><strong>Status:</strong> {selectedBookingDetails.status}</p>
                                <p><strong>Vehicle Registration:</strong> {selectedBookingDetails.vehicle?.vehicleRegistrationNumber}</p>
                                <p><strong>Booking Date:</strong> {new Date(selectedBookingDetails.bookingDate).toLocaleDateString()}</p>
                                <p><strong>From:</strong> {new Date(selectedBookingDetails.fromDate).toLocaleDateString()}</p>
                                <p><strong>To:</strong> {new Date(selectedBookingDetails.toDate).toLocaleDateString()}</p>

                                <div className="mt-4">
                                    <p className="text-primary h5 mb-3">
                                        <strong>Total Price:</strong> ₹{selectedBookingDetails.totalPrice}
                                    </p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setSelectedBookingDetails(null)}>Close</button>

                                {selectedBookingDetails.status === 'ACCEPTED' && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handlePay(selectedBookingDetails.bookingId)}
                                    >
                                        Pay Now
                                    </button>
                                )}

                                {selectedBookingDetails.status === 'COMPLETED' ? (
                                    <button
                                        className="btn btn-info"
                                        onClick={() => handleFeedback(selectedBookingDetails.vehicle.vehicleId, selectedBookingDetails.vehicle)}
                                    >
                                        Give Feedback
                                    </button>
                                ) : selectedBookingDetails.status !== 'CANCELED' && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => {
                                            setSelectedBookingDetails(null);
                                            setSelectedBookingId(selectedBookingDetails.bookingId);
                                        }}
                                    >
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
