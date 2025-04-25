import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:4041/api/users")
      .then((res) => {
        setCustomers(res.data);  
        setLoading(false);        
      })
      .catch((err) => {
        console.error("Error fetching customer data:", err);
        setLoading(false); 
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading customers...</p>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="text-center mb-5">
        <h2 className="text-primary mb-3 fw-bold">
          <i className="bi bi-people-fill me-2"></i>All Customers
        </h2>
        <p className="text-muted">View and manage all registered customers</p>
      </div>
      
      <div className="row g-4">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div className="col-md-6 col-lg-4" key={customer.userId}>
              <div className="card h-100 border-0 shadow-sm rounded-3" style={{ backgroundColor: '#ffffff' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-person-fill text-primary fs-4"></i>
                    </div>
                    <h5 className="card-title text-info mb-0 fw-bold">
                      {customer.firstName} {customer.lastName}
                    </h5>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-envelope-fill text-secondary me-2"></i>
                      <span><strong>Email:</strong> {customer.email}</span>
                    </div>
                    
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-telephone-fill text-secondary me-2"></i>
                      <span><strong>Contact:</strong> {customer.contact}</span>
                    </div>
                    
                    <div className="d-flex align-items-start">
                      <i className="bi bi-geo-alt-fill text-secondary me-2 mt-1"></i>
                      <span><strong>Address:</strong> {customer.city}, {customer.state}, {customer.pincode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info text-center">
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              No customers found.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;