import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState({ id: null, show: false });
  const recordsPerPage = 5;

  const navigate = useNavigate();

  const checkAuthAndFetchData = () => {
    let user = null;

    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      try {
        user = JSON.parse(sessionUser);
      } catch (e) {
        console.error('Error parsing user from sessionStorage:', e);
        setError('Error loading user data');
      }
    }

    if (!user) {
      const localUser = localStorage.getItem('user');
      if (localUser) {
        try {
          user = JSON.parse(localUser);
          sessionStorage.setItem('user', localUser);
        } catch (e) {
          console.error('Error parsing user from localStorage:', e);
          setError('Error loading user data');
        }
      }
    }

    setCurrentUser(user);

    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchBookings(user);
  };

  const fetchBookings = (user) => {
    if (!user || user.role !== 'admin') {
      return;
    }

    setLoading(true);
    setError(null);

    axios.get('http://localhost:4041/api/bookings/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
      }
    })
      .then((response) => {
        // const allBookings = response.data;
        const sortedBookings = response.data.sort((a, b) => b.bookingId - a.bookingId);

        setBookings(sortedBookings);
        setFilteredBookings(sortedBookings);

        const hasPending = sortedBookings.some(booking => booking.status === 'PENDING');
        if (hasPending) {
          sessionStorage.setItem('newBookingNotification', 'true');
        } else {
          sessionStorage.removeItem('newBookingNotification');
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setError(err.response?.data?.message || 'Error fetching bookings. Please try again.');
        setLoading(false);

        if (err.response?.status === 401) {
          navigate('/login');
        }
      });
  };

  useEffect(() => {
    checkAuthAndFetchData();

    const handleStorageChange = () => {
      checkAuthAndFetchData();
    };

    const handleUserLogout = () => {
      setBookings([]);
      setFilteredBookings([]);
      navigate('/');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleStorageChange);
    window.addEventListener('user-logout', handleUserLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
      window.removeEventListener('user-logout', handleUserLogout);
    };
  }, [navigate]);

  useEffect(() => {
    const filtered = bookings.filter(b =>
      `${b.user?.firstName} ${b.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicle?.vehicleRegistrationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bookingId.toString().includes(searchTerm)
    );
    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchTerm, bookings]);

  const handleStatusUpdate = (bookingId, newStatus) => {
    setLoading(true);
    axios.put(`http://localhost:4041/api/bookings/update-status/${bookingId}`,
      { status: newStatus },
      {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
        }
      }
    )
      .then((response) => {
        const updatedBooking = response.data;
        const updatedList = bookings.map((booking) =>
          booking.bookingId === updatedBooking.bookingId ? { ...booking, status: newStatus } : booking
        );
        setBookings(updatedList);
        setFilteredBookings(updatedList);

        const stillPending = updatedList.some((b) => b.status === 'PENDING');
        if (!stillPending) {
          sessionStorage.removeItem('newBookingNotification');
          localStorage.removeItem('newBookingNotification');
        }

        setShowConfirmation({ id: null, show: false });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error updating booking status:", err);
        setError(err.response?.data?.message || 'Failed to update booking status.');
        setLoading(false);
      });
  };

  const handleView = (booking) => {
    navigate(`/booking-details/${booking.bookingId}`);
  };

  const renderStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { bg: 'bg-warning', icon: 'bi-hourglass-split' },
      'ACCEPTED': { bg: 'bg-success', icon: 'bi-check-circle' },
      'CANCELED': { bg: 'bg-secondary', icon: 'bi-x-circle' },
      'COMPLETED': { bg: 'bg-info', icon: 'bi-check-all' },
      'REJECTED': { bg: 'bg-danger', icon: 'bi-slash-circle' }
    };

    const statusConfig = statusMap[status] || { bg: 'bg-light text-dark', icon: 'bi-question-circle' };

    return (
      <span className={`badge ${statusConfig.bg} d-flex align-items-center gap-1`}>
        <i className={`bi ${statusConfig.icon}`}></i>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredBookings.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredBookings.length / recordsPerPage);

  const changePage = (number) => {
    setCurrentPage(number);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-primary fs-5">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
          <div>
            <h5 className="alert-heading">Error</h5>
            <p className="mb-0">{error}</p>
            <button className="btn btn-sm btn-outline-danger mt-2" onClick={checkAuthAndFetchData}>
              <i className="bi bi-arrow-repeat me-1"></i> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4">
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0">
                  <i className="bi bi-calendar-check me-2"></i>
                  Booking Management
                </h2>
                {currentUser && (
                  <span className="badge bg-light text-primary">
                    <i className="bi bi-person-fill me-1"></i>
                    {currentUser.role.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-6 col-lg-4 mb-2 mb-md-0">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-search text-secondary"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      className="form-control border-start-0"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-lg-4 ms-auto">
                  <div className="d-flex align-items-center justify-content-end h-100">
                    <span className="badge bg-info text-dark me-2">
                      Total: {filteredBookings.length}
                    </span>
                    <span className="badge bg-warning text-dark">
                      Pending: {bookings.filter(b => b.status === 'PENDING').length}
                    </span>
                  </div>
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                  <h4 className="mt-3 text-muted">No bookings found</h4>
                  <p className="text-muted">Try adjusting your search or check back later</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Vehicle</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.map((booking) => (
                        <tr key={booking.bookingId} className={booking.status === 'PENDING' ? 'table-warning' : ''}>
                          <td>
                            <span className="fw-bold">#{booking.bookingId}</span>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <span className="fw-medium">
                                {booking.user?.firstName?.toUpperCase()} {booking.user?.lastName?.toUpperCase()}
                              </span>
                              <small className="text-muted">{booking.user?.email}</small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {booking.vehicle?.vehicleRegistrationNumber || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <span>{formatDate(booking.fromDate)}</span>
                              <small className="text-muted">to</small>
                              <span>{formatDate(booking.toDate)}</span>
                            </div>
                          </td>
                          <td>
                            {renderStatusBadge(booking.status)}
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleView(booking)}
                                title="View Details"
                                disabled
                              >
                                <i className="bi bi-eye-fill"></i>
                              </button>

                              {booking.status === 'PENDING' && (
                                <>
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleStatusUpdate(booking.bookingId, 'ACCEPTED')}
                                    disabled={loading}
                                    title="Approve Booking"
                                  >
                                    <i className="bi bi-check-lg"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => setShowConfirmation({ id: booking.bookingId, show: true })}
                                    disabled={loading}
                                    title="Reject Booking"
                                  >
                                    <i className="bi bi-x-lg"></i>
                                  </button>
                                </>
                              )}

                              {showConfirmation.show && showConfirmation.id === booking.bookingId && (
                                <div className="position-absolute bg-white p-2 shadow rounded border">
                                  <p className="mb-2">Confirm cancellation?</p>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleStatusUpdate(booking.bookingId, 'CANCELLED')}
                                    >
                                      Yes
                                    </button>
                                    <button
                                      className="btn btn-sm btn-secondary"
                                      onClick={() => setShowConfirmation({ id: null, show: false })}
                                    >
                                      No
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {totalPages > 1 && (
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center mt-4">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => changePage(currentPage - 1)}
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </button>
                    </li>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (currentPage <= 3) {
                        pageNum = index + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + index;
                      } else {
                        pageNum = currentPage - 2 + index;
                      }

                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => changePage(pageNum)}>
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => changePage(currentPage + 1)}
                        aria-label="Next"
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;