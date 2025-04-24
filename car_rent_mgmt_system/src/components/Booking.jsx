// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Booking = () => {
//   const { vehicleId } = useParams();
//   const navigate = useNavigate();

//   const [vehicle, setVehicle] = useState(null);
//   const [userId, setUserId] = useState(null);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [message, setMessage] = useState("");
//   const [image, setImage] = useState("");
//   const [hasLicense, setHasLicense] = useState(false);

//   const getTodayDate = () => {
//     const today = new Date();
//     return today.toISOString().split("T")[0];
//   };

//   const getTomorrowDate = () => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     return tomorrow.toISOString().split("T")[0];
//   };

//   useEffect(() => {
//     const userIdFromStorage = localStorage.getItem("userId"); 
//     const imageFromStorage = localStorage.getItem("imageKey");

//     setUserId(userIdFromStorage); 
//     setImage(imageFromStorage);

//     if (userIdFromStorage) {
//       axios
//         .get(`http://localhost:4041/api/variant/vehicle/${vehicleId}`)
//         .then((res) => {
//           setVehicle(res.data);
//         })
//         .catch((err) => {
//           console.error("Error fetching vehicle details ::", err);
//         });

//       axios
//         .get(`http://localhost:4041/api/license/user/${userIdFromStorage}`)
//         .then((res) => {
//           setHasLicense(res.data !== null); 
//         })
//         .catch((err) => {
//           console.error("Error fetching license info", err);
//           setHasLicense(false);
//         });
//     }
//   }, [vehicleId]);

//   const handleLogout = () => {
//     localStorage.removeItem("userId");
//     setUserId(null);
//     navigate("/login");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!userId) {
//       setMessage("You must be logged in to make a booking.");
//       return;
//     }

//     if (!hasLicense) {
//       setMessage("You must add your license before booking a vehicle.");
//       //navigate("/CustomerProfile")
//     }

//     if (new Date(fromDate) < new Date(getTodayDate())) {
//       setMessage("From date cannot be in the past.");
//       return;
//     }

//     if (new Date(toDate) < new Date(fromDate)) {
//       setMessage("To date cannot be earlier than From date.");
//       return;
//     }

//     const bookingData = {
//       user: { userId: parseInt(userId) }, 
//       vehicle: { vehicleId: parseInt(vehicleId) },
//       fromDate,
//       toDate,
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:4041/api/bookings/book",
//         bookingData
//       );
//       if (response.data.bookingId) {
//         setMessage("Vehicle Booked successfully...");
//         setTimeout(() => {
//           navigate("/my-bookings");
//         }, 1500);
//       } else {
//         setMessage("Error booking the vehicle.");
//       }
//     } catch (error) {
//       setMessage("Error: " + error.message);
//     }
//   };

//   if (!vehicle) {
//     return <p>Loading vehicle details...</p>;
//   }

//   return (
//     <div className="container py-5">
//       <h2 className="text-center text-primary fw-bold mb-4">Book Your Vehicle</h2>

//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card shadow-lg p-4 rounded">
//             <img
//               src={
//                 image
//                   ? `http://localhost:4041/imgs/${image}`
//                   : "https://via.placeholder.com/300"
//               }
//               alt={vehicle.variantName}
//               className="card-img-top"
//               style={{ height: "200px", objectFit: "cover" }}
//             />

//             {message && <div className="alert alert-info text-center mt-3">{message}</div>}

//             <div className="card-body">
//               <h5 className="card-title">{vehicle.variantName}</h5>
//               <p>{vehicle.company?.companyName}</p>

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="userId" className="form-label">User ID</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     id="userId"
//                     value={userId || ""}
//                     disabled
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="fromDate" className="form-label">From Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     id="fromDate"
//                     min={getTodayDate()}
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="toDate" className="form-label">To Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     id="toDate"
//                     min={fromDate || getTomorrowDate()}
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <button type="submit" className="btn btn-primary w-100">
//                   Confirm Booking
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Booking;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Booking = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [userId, setUserId] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [hasLicense, setHasLicense] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId"); 
    const imageFromStorage = localStorage.getItem("imageKey");

    setUserId(userIdFromStorage); 
    setImage(imageFromStorage);

    if (userIdFromStorage) {
      axios
        .get(`http://localhost:4041/api/variant/vehicle/${vehicleId}`)
        .then((res) => {
          setVehicle(res.data);
        })
        .catch((err) => {
          console.error("Error fetching vehicle details ::", err);
        });

      axios
        .get(`http://localhost:4041/api/license/user/${userIdFromStorage}`)
        .then((res) => {
          setHasLicense(res.data !== null); 
        })
        .catch((err) => {
          console.error("Error fetching license info", err);
          setHasLicense(false);
        });
    }
  }, [vehicleId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("You must be logged in to make a booking.");
      return;
    }

    if (!hasLicense) {
      setMessage("You must add your license before booking a vehicle. Redirecting...");
      setTimeout(() => {
        navigate("/add-license");
      }, 1500);
      return;
    }

    if (new Date(fromDate) < new Date(getTodayDate())) {
      setMessage("From date cannot be in the past.");
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      setMessage("To date cannot be earlier than From date.");
      return;
    }

    const bookingData = {
      user: { userId: parseInt(userId) }, 
      vehicle: { vehicleId: parseInt(vehicleId) },
      fromDate,
      toDate,
    };

    try {
      const response = await axios.post(
        "http://localhost:4041/api/bookings/book",
        bookingData
      );
      if (response.data.bookingId) {
        setMessage("Vehicle Booked successfully...");
        setTimeout(() => {
          navigate("/my-bookings");
        }, 1500);
      } else {
        setMessage("Error booking the vehicle.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  if (!vehicle) {
    return <p>Loading vehicle details...</p>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary fw-bold mb-4">Book Your Vehicle</h2>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 rounded">
            <img
              src={
                image
                  ? `http://localhost:4041/imgs/${image}`
                  : "https://via.placeholder.com/300"
              }
              alt={vehicle.variantName}
              className="card-img-top"
              style={{ height: "200px", objectFit: "cover" }}
            />

            {message && <div className="alert alert-info text-center mt-3">{message}</div>}

            <div className="card-body">
              <h5 className="card-title">{vehicle.variantName}</h5>
              <p>{vehicle.company?.companyName}</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="userId" className="form-label">User ID</label>
                  <input
                    type="number"
                    className="form-control"
                    id="userId"
                    value={userId || ""}
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="fromDate" className="form-label">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fromDate"
                    min={getTodayDate()}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="toDate" className="form-label">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="toDate"
                    min={fromDate || getTomorrowDate()}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
