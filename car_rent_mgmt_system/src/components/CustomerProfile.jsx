import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
  const [user, setUser] = useState(null);
  const [license, setLicense] = useState(null);
  const [error, setError] = useState('');
  const [showLicense, setShowLicense] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndLicense = async () => {
      try {
        const Customeremail = localStorage.getItem("email");

        if (!Customeremail) {
          setError('No email found in localStorage!');
          return;
        }

        const userResponse = await axios.get(`http://localhost:4041/api/users/profile?email=${Customeremail}`);
        const currentUser = userResponse.data;

        console.log("Logged in User ID:", currentUser.userId);

        const storedUserId = localStorage.getItem("userId");
        if (storedUserId !== currentUser.userId) {
          localStorage.clear(); 
          localStorage.setItem("userId", currentUser.userId);
          localStorage.setItem("email", currentUser.email);
        }

        setUser(currentUser);

        const licenseRes = await axios.get(`http://localhost:4041/api/license/user/${currentUser.userId}`);
        setLicense(licenseRes.data);

      } catch (err) {
        setError('Error fetching user or license data!');
        console.error(err);
      }
    };

    fetchUserAndLicense();
  }, []);
  
  const navigateToAddLicense = () => {
    navigate('/add-license');
  };

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="card shadow-lg p-4 border-0" style={{ borderRadius: '20px', background: 'linear-gradient(to bottom, #ffffff, #f1f8ff)' }}>
        <h2 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '600', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>My Profile</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {user && (
          <>
            <div className="row align-items-center mb-2">
              <div className="col-md-3 text-center mb-3">
                <img
                  src={user.profileImage || "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"}
                  alt="User"
                  className="rounded-circle shadow"
                  style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #3498db' }}
                />
              </div>

              <div className="col-md-8">
                <div className="p-4 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                  <h5 className="mb-4" style={{ color: '#2980b9', borderBottom: '2px solid #3498db', paddingBottom: '8px' }}>User Details</h5>
                  <div className="row mb-3"><div className="col-4 fw-bold text-secondary">Full Name</div><div className="col-8">{user.firstName} {user.lastName}</div></div>
                  <div className="row mb-3"><div className="col-4 fw-bold text-secondary">Email</div><div className="col-8">{user.email}</div></div>
                  <div className="row mb-3"><div className="col-4 fw-bold text-secondary">Contact</div><div className="col-8">{user.contact}</div></div>
                  <div className="row mb-3"><div className="col-4 fw-bold text-secondary">State</div><div className="col-8">{user.state}</div></div>
                  <div className="row mb-3"><div className="col-4 fw-bold text-secondary">City</div><div className="col-8">{user.city}</div></div>
                  <div className="row"><div className="col-4 fw-bold text-secondary">Pincode</div><div className="col-8">{user.pincode}</div></div>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              {!license ? (
                <button className="btn btn-lg btn-primary" onClick={navigateToAddLicense}>
                  Add License
                </button>
              ) : (
                <>
                  <button
                    className={`btn btn-lg mb-3 ${showLicense ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => setShowLicense(!showLicense)}
                  >
                    {showLicense ? 'Hide License' : 'View License'}
                  </button>

                  {showLicense && (
                    <div className="row justify-content-center">
                      <div className="col-md-8">
                        <div className="p-4 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                          <h2 className="text-center mb-4 pb-4 text-primary border-bottom">License Details</h2>
                          <div className="row mb-3">
                            <div className="col-5 fw-bold text-secondary">License Number</div>
                            <div className="col-7">{license.licenseNumber}</div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-5 fw-bold text-secondary">Expiry Date</div>
                            <div className="col-7">{license.expiryDate}</div>
                          </div>
                          <div className="text-center mt-4">
                            <h6 className="fw-bold mb-3 text-primary">License Photo</h6>
                            <img
                              src={`http://localhost:4041/imgs/${license.licensePhoto}`}
                              alt="License"
                              className="img-fluid border rounded"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
