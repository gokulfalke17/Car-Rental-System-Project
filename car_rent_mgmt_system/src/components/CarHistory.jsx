import React, { useEffect, useState } from 'react';

const CarHistory = () => {
  const [cars, setCars] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const dummyCars = [
      {
        id: 1,
        name: 'Creta',
        company: 'Hyundai',
        registrationId: 'MH12AB1234',
        variant: 'SX Diesel',
        isBooked: true,
        bookingDuration: 3,
        imageUrl: 'https://images.hindustantimes.com/auto/img/2024/07/04/1600x900/Creta_N_Line_6_1710398231224_1720075689179.jpg',
        bookedBy: {
          name: 'Karan Pavhane',
          email: 'karan@gamil.com',
          phone: '9876543210'
        },
        color: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
        year: 2023,
        fuelType: 'Diesel',
        isAC: true,
        mileage: '18 kmpl',
        transmission: 'Automatic'
      },
      {
        id: 2,
        name: 'Swift',
        company: 'Maruti',
        registrationId: 'DL5CAB5678',
        variant: 'VXi Petrol',
        isBooked: false,
        bookingDuration: 0,
        imageUrl: 'https://images.overdrive.in/wp-content/uploads/2020/02/2020-maruti-suzuki-vitara-brezza-facelift-01.jpg',
        bookedBy: null,
        color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        year: 2022,
        fuelType: 'Petrol',
        isAC: true,
        mileage: '22 kmpl',
        transmission: 'Manual'
      },
      {
        id: 3,
        name: 'XUV700',
        company: 'Mahindra',
        registrationId: 'KA01MJ6543',
        variant: 'AX7 Diesel',
        isBooked: true,
        bookingDuration: 5,
        imageUrl: 'https://grouplandmark.in/media/1722249763469-xuv700xuv700leftfrontthreequarter.jpg',
        bookedBy: {
          name: 'Ganesh Pawar',
          email: 'ganesh@gamil.com',
          phone: '9123456789'
        },
        color: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
        year: 2024,
        fuelType: 'Diesel',
        isAC: true,
        mileage: '15 kmpl',
        transmission: 'Automatic'
      },
      {
        id: 4,
        name: 'Fortuner',
        company: 'Toyota',
        registrationId: 'TN09XY9876',
        variant: 'Legender 4x4',
        isBooked: false,
        bookingDuration: 0,
        imageUrl: 'https://imgk.timesnownews.com/story/Toyota_Fortuner_1200x900.png',
        bookedBy: null,
        color: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
        year: 2023,
        fuelType: 'Diesel',
        isAC: true,
        mileage: '12 kmpl',
        transmission: 'Automatic'
      },
      {
        id: 5,
        name: 'Thar',
        company: 'Mahindra',
        registrationId: 'RJ14PQ4321',
        variant: 'LX Diesel 4WD',
        isBooked: true,
        bookingDuration: 7,
        imageUrl: 'https://images.hindustantimes.com/auto/img/2024/08/17/1600x900/Mahindra_Thar_Roxx_01_1723863061883_1723888572288.jpg',
        bookedBy: {
          name: 'Tushar More',
          email: 'tush@gamil.com',
          phone: '9988776655'
        },
        color: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
        year: 2024,
        fuelType: 'Diesel',
        isAC: true,
        mileage: '15 kmpl',
        transmission: 'Manual'
      },
      {
        id: 6,
        name: 'City',
        company: 'Honda',
        registrationId: 'GJ03RS7890',
        variant: 'VX CVT Petrol',
        isBooked: false,
        bookingDuration: 0,
        imageUrl: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Honda/City/9421/1739862184352/front-left-side-47.jpg',
        bookedBy: null,
        color: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
        year: 2023,
        fuelType: 'Petrol',
        isAC: true,
        mileage: '18 kmpl',
        transmission: 'Automatic'
      },
      {
        id: 7,
        name: 'Verna',
        company: 'Hyundai',
        registrationId: 'AP07CD4567',
        variant: 'SX Turbo',
        isBooked: true,
        bookingDuration: 2,
        imageUrl: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Hyundai/Verna/7729/1616055133475/front-left-side-47.jpg?imwidth=420&impolicy=resize',
        bookedBy: {
          name: 'Gaurav Lagad',
          email: 'gaurav@gamil.com',
          phone: '8877665544'
        },
        color: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
        year: 2024,
        fuelType: 'Petrol',
        isAC: true,
        mileage: '20 kmpl',
        transmission: 'Automatic'
      },
      {
        id: 8,
        name: 'Nexon',
        company: 'Tata',
        registrationId: 'WB02EF3456',
        variant: 'XZA+ Dark',
        isBooked: false,
        bookingDuration: 0,
        imageUrl: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Tata/Nexon/9675/1743060431849/front-left-side-47.jpg',
        bookedBy: null,
        color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        year: 2023,
        fuelType: 'Electric',
        isAC: true,
        mileage: '312 km/full charge',
        transmission: 'Automatic'
      }
    ];

    setCars(dummyCars);
  }, []);

  const filteredCars = cars.filter(car => {
    if (filter === 'booked') return car.isBooked;
    if (filter === 'available') return !car.isBooked;
    return true;
  });

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold" style={{
          background: 'linear-gradient(45deg, #3a7bd5, #00d2ff, #ff4b2b, #f5af19)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '300% 300%',
          animation: 'gradient 8s ease infinite'
        }}>
          Premium Car Fleet
        </h1>
        <p className="text-muted">Explore our vehicles collection</p>
        <div className="btn-group my-3">
          <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('all')}>All</button>
          <button className={`btn ${filter === 'available' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter('available')}>Available</button>
          <button className={`btn ${filter === 'booked' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setFilter('booked')}>Booked</button>
        </div>
      </div>

      <div className="row g-4">
        {filteredCars.map(car => (
          <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={car.id}>
            <div className="card h-100 shadow-sm">
              <div className="position-relative">
                <img src={car.imageUrl} className="card-img-top" alt={car.name} style={{ height: '200px', objectFit: 'cover' }} />
                <span className={`badge position-absolute top-0 end-0 m-2 ${car.isBooked ? 'bg-danger' : 'bg-success'}`}>
                  {car.isBooked ? 'Booked' : 'Available'}
                </span>
              </div>
              <div className="card-body">
                <h5 className="card-title">{car.name} - {car.company}</h5>
                <p className="card-text mb-1">
                  <small className="text-muted">{car.year} • {car.fuelType} • {car.transmission}</small>
                </p>
                <p className="mb-2">
                  <i className="bi bi-speedometer2 me-1"></i>{car.mileage} | <i className="bi bi-fan me-1"></i>{car.isAC ? 'AC' : 'Non-AC'}
                </p>
                <p className="mb-2"><i className="bi bi-credit-card me-1"></i>{car.registrationId}</p>
                <p className="mb-2"><i className="bi bi-gear me-1"></i>{car.variant}</p>
                {car.isBooked && (
                  <div className="alert alert-warning p-2">
                    <strong>{car.bookedBy.name}</strong><br />
                    <a href={`mailto:${car.bookedBy.email}`} className="d-block small">{car.bookedBy.email}</a>
                    <a href={`tel:${car.bookedBy.phone}`} className="d-block small">{car.bookedBy.phone}</a>
                    <div className="small mt-1">Duration: {car.bookingDuration} days</div>
                  </div>
                )}
              </div>
              <div className="card-footer bg-white border-top-0">
                <button className={`btn btn-${car.isBooked ? 'danger small' : 'primary'} w-100`}>
                  {car.isBooked ? 'Booked' : 'Available'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="text-center mt-5">
        <p className="mb-1 text-muted">Showing {filteredCars.length} of {cars.length} cars</p>
        <small className="text-muted">Premium Car Fleet © {new Date().getFullYear()}</small>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .card {
          transition: transform 0.2s ease;
        }
        .card:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default CarHistory;
