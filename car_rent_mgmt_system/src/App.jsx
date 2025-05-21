import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Company from "./components/Company";
import Variant from "./components/Variant";
import VariantList from './components/VariantList';
import UpdateVariant from "./components/UpdatedVariant";
import VariantDetails from "./components/VariantDetails";
import CustomerProfile from "./components/CustomerProfile";
import AddLicense from "./components/AddLicense";
import Explore from "./components/Explore";
import Booking from "./components/Booking";
import MyBookings from "./components/MyBookings";
import Bookings from "./components/Bookings";
import CustomerList from "./components/CustomerList";
import BookingDetails from "./components/MyBookings";
import ForgotPassword from "./components/ForgotPassword";
import PaymentMode from "./components/PaymentMode";
import CreditCardPayment from "./components/CreditCardPayment";
import DebitCardPayment from "./components/DebitCardPayment";
import UpiPayment from "./components/UpiPayment";
import CustomerReport from "./components/CustomerReport";
import Feedback from "./components/Feedback";
import ResetPassword from "./components/ResetPassword";
import FeedbackReport from "./components/FeedbackReport";
import Reports from "./components/Reports";
import Dashboard from "./components/Dashboard";
import CashOnDelivery from "./components/CashOnDelivery";
import CarHistory from "./components/CarHistory";
import UpdateUserProfile from "./components/UpdateUserProfile";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length === 0 || allowedRoles.includes(user.role.toLowerCase())) {
    return children;
  }

  return <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin only routes */}
        <Route path="/company" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Company />
          </ProtectedRoute>
        } />
        <Route path="/variant" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Variant />
          </ProtectedRoute>
        } />
        <Route path="/variantList" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <VariantList />
          </ProtectedRoute>
        } />
        <Route path="/variantList/update/:id" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UpdateVariant />
          </ProtectedRoute>
        } />
        <Route path="/admin/bookings" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Bookings />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CustomerList />
          </ProtectedRoute>
        } />
        <Route path="/all-reports" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/feedback-report" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <FeedbackReport />
          </ProtectedRoute>
        } />


        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerProfile />
          </ProtectedRoute>
        } />
        <Route path="/add-license" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <AddLicense />
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/booking-details" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <BookingDetails />
          </ProtectedRoute>
        } />
        <Route path="/my-report" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerReport />
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Feedback />
          </ProtectedRoute>
        } />

        <Route path="/explore" element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        } />
        <Route path="/variantList/view/:variantId" element={
          <ProtectedRoute>
            <VariantDetails />
          </ProtectedRoute>
        } />
        <Route path="/booking/:vehicleId" element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } />
        <Route path="/payment/:id" element={
          <ProtectedRoute>
            <PaymentMode />
          </ProtectedRoute>
        } />
        <Route path="/credit-payment" element={
          <ProtectedRoute>
            <CreditCardPayment />
          </ProtectedRoute>
        } />
        <Route path="/debit-payment" element={
          <ProtectedRoute>
            <DebitCardPayment />
          </ProtectedRoute>
        } />
        <Route path="/upi-payment" element={
          <ProtectedRoute>
            <UpiPayment />
          </ProtectedRoute>
        } />

        <Route path="/cash-payment" element={
          <ProtectedRoute>
            <CashOnDelivery />
          </ProtectedRoute>
        } />



        <Route path="/admin/car-history" element={
          <ProtectedRoute>
            <CarHistory />
          </ProtectedRoute>
        } />


        <Route path="/users/update/:userId" element={
          <ProtectedRoute>
            <UpdateUserProfile />
          </ProtectedRoute>
        } />

       
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;