import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import carLogo from '../assets/car-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [showNotificationDot, setShowNotificationDot] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }

    const checkNotification = () => {
      const isNotified = localStorage.getItem("newBookingNotification") === "true";
      setShowNotificationDot(isNotified);
    };

    checkNotification();

    const interval = setInterval(checkNotification, 1000);

    return () => clearInterval(interval);
  }, []); 
  
  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    setUser(null); 
    setShowModal(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-3 sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={carLogo} alt="logo" width="40" className="me-2" />
            <strong>Car Rental System</strong>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <div className="d-flex gap-2 mt-2 mt-lg-0">
              {user && user.role?.toLowerCase() === "customer" && (
                <>
                  <Link to="/explore" className="btn btn-outline-warning">Explore Vehicles</Link>
                  <Link to="/my-bookings" className="btn btn-outline-warning">My Bookings</Link>
                  <Link to="/profile" className="btn btn-outline-warning">My Profile</Link>
                  <Link to="/my-report" className="btn btn-outline-info">Report</Link>
                </>
              )}

              {user && user.role?.toLowerCase() === "admin" && (
                <>
                  <Link to="/company" className="btn btn-outline-warning">Add Company</Link>
                  <Link to="/variant" className="btn btn-outline-warning">Add Variant</Link>
                  <Link to="/variantList" className="btn btn-outline-warning">Variants</Link>

                  <div style={{ position: 'relative' }}>
                    <Link to="/admin/bookings" className="btn btn-outline-warning position-relative">
                      Bookings
                      {showNotificationDot && (
                        <span
                          className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                          style={{ width: '10px', height: '10px' }}
                        ></span>
                      )}
                    </Link>
                  </div>

                  <Link to="/admin/customers" className="btn btn-outline-warning">Customers</Link>

                  <Link to="/all-reports" className="btn btn-outline-info">Reports</Link>

                </>
              )}

              {user ? (
                <button className="btn btn-outline-danger" onClick={() => setShowModal(true)}>Logout</button>
              ) : (
                <>
                  <Link to="/register" className="btn btn-warning">Register</Link>
                  <Link to="/login" className="btn btn-outline-light">Login</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Logout</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>No</button>
                <button className="btn btn-danger" onClick={handleLogoutConfirm}>Yes, Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
