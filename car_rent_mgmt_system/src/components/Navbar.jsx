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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top px-3">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src={carLogo} alt="logo" width="40" className="me-2" />
            <strong>Car Rental System</strong>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto d-flex flex-lg-row flex-column gap-2 mt-3 mt-lg-0 align-items-stretch align-items-lg-center w-100">
              {user && user.role?.toLowerCase() === "customer" && (
                <>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/explore" className="btn btn-outline-warning">Explore Vehicles</Link>
                    </div>
                  </li>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/my-bookings" className="btn btn-outline-warning">My Bookings</Link>
                    </div>
                  </li>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/profile" className="btn btn-outline-warning">My Profile</Link>
                    </div>
                  </li>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/my-report" className="btn btn-outline-info">Report</Link>
                    </div>
                  </li>
                </>
              )}

              {user && user.role?.toLowerCase() === "admin" && (
                <>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/dashbord" className="btn btn-outline-warning">Dashboard</Link>
                    </div>
                  </li>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/company" className="btn btn-outline-warning">Add Company</Link>
                    </div>
                  </li>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/variant" className="btn btn-outline-warning">Add Variant</Link>
                    </div>
                  </li>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/variantList" className="btn btn-outline-warning">Variants</Link>
                    </div>
                  </li>
                  <li className="nav-item w-100 w-lg-auto position-relative">
                    <div className="d-grid">
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
                  </li>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/admin/customers" className="btn btn-outline-warning">Customers</Link>
                    </div>
                  </li>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/all-reports" className="btn btn-outline-info">Reports</Link>
                    </div>
                  </li>
                </>
              )}

              {user ? (
                <li className="nav-item w-100 w-lg-auto">
                  <div className="d-grid">
                    <button className="btn btn-outline-danger" onClick={() => setShowModal(true)}>Logout</button>
                  </div>
                </li>
              ) : (
                <>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/register" className="btn btn-outline-warning">Register</Link>
                    </div>
                  </li>
                  <li className="nav-item w-100 w-lg-auto">
                    <div className="d-grid">
                      <Link to="/login" className="btn btn-outline-light">Login</Link>
                    </div>
                  </li>
                </>
              )}
            </ul>
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
