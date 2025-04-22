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
    <div className="container py-5">
      <h2 className="text-center text-primary fw-bold mb-4">Explore All Cars</h2>

      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control rounded-pill px-4 shadow-sm"
            placeholder="🔍 Search by company name..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="row g-4">
        {vehicles.length > 0 ? (
          vehicles
            .filter((car) =>
              car.company?.companyName.toLowerCase().includes(search.toLowerCase())
            )
            .map((car, index) => (
              <div className="col-sm-12 col-md-6 col-lg-4" key={index}>
                <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden">
                  <img
                    src={
                      car.imageUrl
                        ? `http://localhost:4041/imgs/${car.imageUrl}`
                        : "https://via.placeholder.com/300"
                    }
                    className="card-img-top"
                    alt={car.variantName}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark">{car.variantName}</h5>
                    <p className="text-muted mb-2">{car.company?.companyName}</p>
                    <p>
                      <strong>Model:</strong> {car.modelNumber} | <strong>Year:</strong> {car.year}
                    </p>
                    <p>
                      <strong>Fuel:</strong> {car.fuelType} | <strong>AC:</strong>{" "}
                      {car.isAc ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>Seats:</strong> {car.seatCapacity}
                    </p>
                    <p className="fw-bold text-success">₹{car.rentPerDay} / day</p>

                    {car.vehicles && car.vehicles.length > 0 && (
                      <>
                        <button
                          className="btn btn-outline-secondary btn-sm mt-2"
                          onClick={() => toggleVehicleList(index)}
                        >
                          {showVehicles[index]
                            ? "Hide Available Vehicles"
                            : "View Available Vehicles"}
                        </button>

                        {showVehicles[index] && (
                          <div className="d-flex flex-column gap-2 mt-3">
                            {car.vehicles.map((v) => (
                              <div
                                key={v.vehicleId}
                                className="d-flex justify-content-between align-items-center bg-light rounded px-3 py-2"
                              >
                                <div>
                                  <strong>Reg No:</strong> {v.vehicleRegistrationNumber}
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <span
                                    className={`badge rounded-pill bg-${
                                      v.status === "Available"
                                        ? "success"
                                        : v.status === "Booked"
                                        ? "warning"
                                        : "secondary"
                                    }`}
                                  >
                                    {v.status}
                                  </span>
                                  {v.status === "Available" && (
                                    <button
                                      className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                      onClick={() => handleBookClick(v.vehicleId, car.imageUrl)}
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
            ))
        ) : (
          <p className="text-center text-danger">No vehicles available.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
