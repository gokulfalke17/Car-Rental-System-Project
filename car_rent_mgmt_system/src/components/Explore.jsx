import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Explore = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [showVehicles, setShowVehicles] = useState({});

  const navigate = useNavigate();

  const fetchVehicles = () => {
    axios
      .get("http://localhost:4041/api/variant/all-variants")
      .then((res) => {
        const dataString = JSON.stringify(res.data, null, 2); 
      console.log("All Vehicle Data :: \n" + dataString);
        setVehicles(res.data);
      })
      .catch((err) => console.error("Error fetching vehicles:", err));
  };

  useEffect(() => {
    fetchVehicles();

    if (localStorage.getItem("vehicleBooked") === "true") {
      fetchVehicles();
      localStorage.removeItem("vehicleBooked");
    }

    const handleFocus = () => {
      fetchVehicles();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
  };

  const handleBookClick = (vehicleId, imageUrl) => {
    localStorage.setItem("imageKey", imageUrl);
    navigate(`/booking/${vehicleId}`);
  };

  const toggleVehicleList = (index) => {
    setShowVehicles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  

  return (
    <div className="container py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center mb-4">
        <div className="col-12 text-center">
          <h2 className="display-5 fw-bold mb-3" style={{
            color: '#2c3e50',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            background: 'linear-gradient(90deg, #3498db, #2ecc71)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Explore Our Vehicle Collection
          </h2>
          <p className="text-muted">Find your perfect ride for any occasion</p>
        </div>
      </div>

      <div className="row justify-content-center mb-5">
        <div className="col-md-8 col-lg-6">
          <div className="input-group shadow-sm rounded-pill">
            <input
              type="text"
              className="form-control rounded-pill px-4 py-2 border-0"
              placeholder="Search by brand, model or type..."
              value={search}
              onChange={handleSearch}
              style={{
                backgroundColor: '#ffffff',
                fontSize: '1rem'
              }}
            />
            <span
              className="input-group-text bg-white border-0 rounded-pill"
              style={{ marginLeft: '-40px', zIndex: 5 }}
            >
              <i className="bi bi-search text-secondary"></i>
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {vehicles.length > 0 ? (
          vehicles
            .filter((car) =>
              car.company?.companyName.toLowerCase().includes(search.toLowerCase())
            )
            .map((car, index) => (
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={index}>
                <div
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all"
                  style={{
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    backgroundColor: '#ffffff',
                    ':hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
                    <img
                      src={(() => {
                        if (!car.imageUrl) return "https://via.placeholder.com/300"; 
                        

                        let cleanedPath = car.imageUrl.replace(/\/uploads\/imgs\/.*\/uploads\/imgs\//, "/uploads/imgs/");

                        if (!cleanedPath.startsWith("http")) {
                          cleanedPath = `http://localhost:4041${cleanedPath.startsWith("/") ? "" : "/"}${cleanedPath}`;
                        }

                        console.log("Cleaned Image URL:", cleanedPath);

                        return cleanedPath;
                      })()}
                      alt={car.variantName.charAt(0).toUpperCase() + car.variantName.slice(1)}
                      className="card-img-top w-100 h-100"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        ':hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    <div
                      className="position-absolute top-0 end-0 m-2 bg-white rounded-pill px-2 py-1 shadow-sm"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <span className="badge bg-success">{car.fuelType}</span>
                    </div>
                  </div>

                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title fw-bold mb-0" style={{ color: '#2c3e50' }}>
                        {car.variantName.charAt(0).toUpperCase() + car.variantName.slice(1)}
                      </h5>

                      <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {car.year}
                      </span>
                    </div>

                    <h6 className="text-primary mb-2" style={{ fontWeight: 500 }}>
                      {car.company?.companyName.charAt(0).toUpperCase() + car.company?.companyName.slice(1)}
                    </h6>


                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="d-flex align-items-center bg-light px-2 py-1 rounded" style={{ fontSize: '0.8rem' }}>
                        <i className="bi bi-people me-1 text-secondary"></i>
                        {car.seatCapacity} Seats
                      </span>
                      <span className="d-flex align-items-center bg-light px-2 py-1 rounded" style={{ fontSize: '0.8rem' }}>
                        <i className="bi bi-snow me-1 text-secondary"></i>
                        {car.isAc ? 'AC' : 'Non-AC'}
                      </span>
                      <span className="d-flex align-items-center bg-light px-2 py-1 rounded" style={{ fontSize: '0.8rem' }}>
                        <i className="bi bi-gear me-1 text-secondary"></i>
                        {car.modelNumber}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>Starting from</p>
                          <h4 className="mb-0 fw-bold" style={{ color: '#27ae60' }}>
                            ₹{car.rentPerDay} <span style={{ fontSize: '1rem', color: '#7f8c8d' }}>/ day</span>
                          </h4>
                        </div>
                      </div>

                      {car.vehicles && car.vehicles.length > 0 && (
                        <>
                          <button
                            className="btn btn-sm w-100 mb-3"
                            onClick={() => toggleVehicleList(index)}
                            style={{
                              backgroundColor: showVehicles[index] ? '#e74c3c' : '#3498db',
                              color: 'white',
                              border: 'none',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {showVehicles[index]
                              ? "Hide Available Vehicles"
                              : "View Available Vehicles"}
                            <i className={`bi bi-chevron-${showVehicles[index] ? 'up' : 'down'} ms-2`}></i>
                          </button>

                          {showVehicles[index] && (
                            <div className="d-flex flex-column gap-2 mt-2">
                              {car.vehicles.map((v) => (
                                <div
                                  key={v.vehicleId}
                                  className="d-flex justify-content-between align-items-center p-2 rounded"
                                  style={{
                                    backgroundColor: '#f8f9fa',
                                    borderLeft: `3px solid ${v.status === "Available"
                                      ? '#2ecc71'
                                      : v.status === "Booked"
                                        ? '#f39c12'
                                        : '#95a5a6'
                                      }`
                                  }}
                                >
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-car-front me-2" style={{ color: '#7f8c8d' }}></i>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                      {v.vehicleRegistrationNumber}
                                    </span>
                                  </div>
                                  <div className="d-flex align-items-center gap-2">
                                    <span
                                      className="badge rounded-pill"
                                      style={{
                                        backgroundColor:
                                          v.status === "Available"
                                            ? '#d5f5e3'
                                            : v.status === "Booked"
                                              ? '#fdebd0'
                                              : '#ebedef',
                                        color:
                                          v.status === "Available"
                                            ? '#27ae60'
                                            : v.status === "Booked"
                                              ? '#e67e22'
                                              : '#7f8c8d',
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      {v.status}
                                    </span>
                                    {v.status === "Available" && (
                                      <button
                                        className="btn btn-sm rounded-pill px-3"
                                        onClick={() => handleBookClick(v.vehicleId, car.imageUrl)}
                                        style={{
                                          backgroundColor: '#3498db',
                                          color: 'white',
                                          border: 'none',
                                          fontSize: '0.8rem',
                                          transition: 'all 0.2s ease',
                                          ':hover': {
                                            backgroundColor: '#2980b9'
                                          }
                                        }}
                                      >
                                        Book Now
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-emoji-frown display-4 text-secondary mb-3"></i>
              <h5 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>No vehicles available</h5>
              <p className="text-muted">Please check back later or try a different search</p>
              <button
                className="btn btn-primary mt-2 px-4 rounded-pill"
                onClick={fetchVehicles}
              >
                <i className="bi bi-arrow-repeat me-2"></i> Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;