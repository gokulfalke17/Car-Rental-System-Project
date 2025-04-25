import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import carLogo from '../assets/car-logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newBookingCount, setNewBookingCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);

    const fetchNewBookings = () => {
      const currentUser = localStorage.getItem('user');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        if (parsedUser?.role?.toLowerCase() === 'admin') {
          axios.get('http://localhost:4041/api/bookings/new-bookings-count')
            .then((res) => {
              const count = res.data.count || 0;
              setNewBookingCount(count);
              if (count === 0) {
                localStorage.removeItem('newBookingNotification');
              } else {
                localStorage.setItem('newBookingNotification', true);
              }
            }).catch(console.error);
        }
      }
    };

    if (user?.role?.toLowerCase() === 'admin') {
      fetchNewBookings();
      const interval = setInterval(fetchNewBookings, 10000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', checkAuthStatus);
      };
    }

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [user?.role]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutConfirm = () => {
    console.log("data in local storage " + 
     JSON.stringify(localStorage))

    localStorage.clear();
    setUser(null);
    setShowModal(false);
     navigate('/login');
    // window.location.reload();
  };

  const toggleNavbar = () => setIsCollapsed(!isCollapsed);
  const closeNavbar = () => setIsCollapsed(true);

  const navLinkStyle = "btn btn-outline-warning d-flex align-items-center gap-2 px-3 py-2";

  return (
    <>
      <style>
        {`
          body {
            padding-top: 72px;
          }
          /* Hide icons at 1060px and below */
          @media (max-width: 1060px) {
            .nav-icon {
              display: none;
            }
            .navbar-brand span {
              display: none;
            }
            .btn {
              padding: 0.5rem 1rem !important;
            }
          }
          @media (max-width: 992px) {
            body {
              padding-top: 56px;
            }
            .navbar-collapse {
              background-color: rgba(33, 37, 41, 0.98) !important;
              padding: 1rem;
              margin-top: 8px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .navbar-nav {
              gap: 0.5rem !important;
            }
            .nav-link, .btn {
              width: 100%;
              text-align: left;
              padding: 0.75rem 1rem !important;
            }
            /* Show icons again in mobile menu */
            .nav-icon {
              display: inline-block;
            }
          }
          /* Adjust for very small screens */
          @media (max-width: 400px) {
            .navbar-brand img {
              width: 30px;
              height: 30px;
            }
          }
        `}
      </style>

      <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${isScrolled ? 'bg-dark shadow-lg' : 'bg-dark'}`} style={{ transition: 'all 0.3s ease' }}>
        <div className="container-fluid px-3">
          <div className="d-flex w-100 align-items-center">
            <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeNavbar}>
              <img src={carLogo} alt="Logo" width="40" height="40" className="d-inline-block align-top" />
              <span className="fw-bold fs-5 d-none d-sm-inline">Car Rental System</span>
            </Link>

            <button
              className="navbar-toggler ms-auto"
              type="button"
              onClick={toggleNavbar}
              aria-label="Toggle navigation"
              aria-expanded={!isCollapsed}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarCollapse">
            <ul className="navbar-nav ms-auto mt-3 mt-lg-0 d-flex flex-column flex-lg-row align-items-lg-center gap-2">

              {user?.role?.toLowerCase() === 'customer' && (
                <>
                  <li className="nav-item">
                    <Link className={navLinkStyle} to="/explore" onClick={closeNavbar}>
                      <i className="bi bi-car-front nav-icon"></i> Explore
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={navLinkStyle} to="/my-bookings" onClick={closeNavbar}>
                      <i className="bi bi-calendar-check nav-icon"></i> Bookings
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={navLinkStyle} to="/profile" onClick={closeNavbar}>
                      <i className="bi bi-person nav-icon"></i> Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-outline-info d-flex align-items-center gap-2 px-3 py-2" to="/my-report" onClick={closeNavbar}>
                      <i className="bi bi-flag nav-icon"></i> Report
                    </Link>
                  </li>
                </>
              )}

              {user?.role?.toLowerCase() === 'admin' && (
                <>
                  <li className="nav-item small">
                    <Link className={navLinkStyle} to="/dashboard" onClick={closeNavbar}>
                      <i className="bi bi-speedometer2 nav-icon"></i> Dashboard
                    </Link>
                  </li>
                  <li className="nav-item dropdown">
                    <Link
                      className={`${navLinkStyle} dropdown-toggle`}
                      to="#"
                      id="adminDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-building-gear nav-icon"></i> Management
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="adminDropdown">
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2" to="/company" onClick={closeNavbar}>
                          <i className="bi bi-building-add nav-icon"></i> Add Company
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2" to="/variant" onClick={closeNavbar}>
                          <i className="bi bi-car-front nav-icon"></i> Add Variant
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2" to="/variantList" onClick={closeNavbar}>
                          <i className="bi bi-list-ul nav-icon"></i> Variants List
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item position-relative">
                    <Link className={`${navLinkStyle} position-relative`} to="/admin/bookings" onClick={closeNavbar}>
                      <i className="bi bi-journal-bookmark nav-icon"></i> Bookings
                      {localStorage.getItem('newBookingNotification') && newBookingCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {newBookingCount}
                          <span className="visually-hidden">New bookings</span>
                        </span>
                      )}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={navLinkStyle} to="/admin/customers" onClick={closeNavbar}>
                      <i className="bi bi-people nav-icon"></i> Customers
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-outline-info d-flex align-items-center gap-2 px-3 py-2" to="/all-reports" onClick={closeNavbar}>
                      <i className="bi bi-flag nav-icon"></i> Reports
                    </Link>
                  </li>
                </>
              )}

              {user ? (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger d-flex align-items-center gap-2 px-3 py-2"
                    onClick={() => {
                      setShowModal(true);
                      closeNavbar();
                    }}
                  >
                    <i className="bi bi-box-arrow-right nav-icon"></i> Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="btn btn-outline-warning d-flex align-items-center gap-2 px-3 py-2" to="/register" onClick={closeNavbar}>
                      <i className="bi bi-person-plus nav-icon"></i> Register
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2" to="/login" onClick={closeNavbar}>
                      <i className="bi bi-box-arrow-in-right nav-icon"></i> Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Confirm Logout</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleLogoutConfirm}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
      />
    </>
  );
};

export default Navbar;