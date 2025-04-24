import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  const navigate = useNavigate();

  const checkAuthAndFetchData = () => {
    let user = null;
    
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      try {
        user = JSON.parse(sessionUser);
      } catch (e) {
        console.error('Error parsing user from sessionStorage:', e);
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
    
    axios.get('http://localhost:4041/api/bookings/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}`
      }
    })
      .then((response) => {
        const allBookings = response.data;
        setBookings(allBookings);
        setFilteredBookings(allBookings);

        const hasPending = allBookings.some(booking => booking.status === 'PENDING');
        if (hasPending) {
          sessionStorage.setItem('newBookingNotification', 'true');
        } else {
          sessionStorage.removeItem('newBookingNotification');
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setError('Error fetching bookings. Please try again.');
        setLoading(false);
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
      `${b.user?.firstName} ${b.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBookings(filtered);
    setCurrentPage(1);
  }, [searchTerm, bookings]);

  const handleStatusUpdate = (bookingId, newStatus) => {
    axios
      .put(`http://localhost:4041/api/bookings/update-status/${bookingId}`, 
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
  
        const stillPending = updatedList.some((b) => b.status === 'PENDING');
        if (!stillPending) {
          sessionStorage.removeItem('newBookingNotification');
          localStorage.removeItem('newBookingNotification');
        }
      })
      .catch((err) => {
        console.error("Error updating booking status:", err);
        alert('Failed to update booking status.');
      });
  };
  
  const handleView = (booking) => {
    alert(`Viewing booking ID: ${booking.bookingId}`);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge bg-warning text-dark">{status}</span>;
      case 'ACCEPTED':
        return <span className="badge bg-success">{status}</span>;
      case 'CANCELED':
        return <span className="badge bg-secondary">{status}</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredBookings.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredBookings.length / recordsPerPage);

  const changePage = (number) => {
    setCurrentPage(number);
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <div className="text-danger text-center mt-4">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">All Bookings</h2>

      <div className="row mb-3 justify-content-end">
        <div className="col-md-4 col-sm-12">
          <input
            type="text"
            placeholder="Search by Customer Name"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <p className="text-center">No bookings found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Vehicle Number</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.user?.firstName} {booking.user?.lastName}</td>
                  <td>{booking.user?.email}</td>
                  <td>{booking.vehicle?.vehicleRegistrationNumber}</td>
                  <td>{booking.fromDate}</td>
                  <td>{booking.toDate}</td>
                  <td>{renderStatusBadge(booking.status)}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      {booking.status !== 'ACCEPTED' && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleView(booking)}
                          disabled
                        >
                          Done
                        </button>
                      )}

                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleStatusUpdate(booking.bookingId, 'ACCEPTED')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleStatusUpdate(booking.bookingId, 'CANCELED')}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {booking.status === 'ACCEPTED' && (
                        <button className="btn btn-sm btn-outline-success" disabled>
                          Pay
                        </button>
                      )}

                      {booking.status === 'CANCELED' && (
                        <button className="btn btn-sm btn-outline-secondary" disabled>
                          Canceled
                        </button>
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
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button className="page-link" onClick={() => changePage(currentPage - 1)}>
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <li key={number} className={`page-item ${currentPage === number && 'active'}`}>
                <button className="page-link" onClick={() => changePage(number)}>
                  {number}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
              <button className="page-link" onClick={() => changePage(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Bookings;