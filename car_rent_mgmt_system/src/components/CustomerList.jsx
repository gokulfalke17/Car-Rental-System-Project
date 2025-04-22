import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    return <div className="text-center">Loading customers...</div>;
  }

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <h2 className="text-center text-primary mb-4">All Customers</h2>
      <div className="row">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div className="col-md-6 col-lg-4 mb-4" key={customer.userId}>
              <div className="card border-light shadow-lg rounded-3" style={{ backgroundColor: '#ffffff' }}>
                <div className="card-body">
                  <h5 className="card-title text-info">{customer.firstName} {customer.lastName}</h5>
                  <p><strong>Email:</strong> {customer.email}</p>
                  <p><strong>Contact:</strong> {customer.contact}</p>
                  <p><strong>Address:</strong> {customer.city}, {customer.state}, {customer.pincode}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-danger">No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
