import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AddLicense from "./components/AddLicense ";
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


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/company" element={<Company />} />
        <Route path="/variant" element={<Variant />} />
        <Route path="/variantList" element={<VariantList />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/variantList/update/:id" element={<UpdateVariant />} />
        <Route path="/variantList/view/:variantId" element={<VariantDetails />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/add-license" element={<AddLicense />} />
        <Route path="/booking/:vehicleId" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/admin/customers" element={<CustomerList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/payment/:id" element={<PaymentMode />} />

        <Route path="/credit-payment" element={<CreditCardPayment />} />
        <Route path="/debit-payment" element={<DebitCardPayment />} />
        <Route path="/upi-payment" element={<UpiPayment />} />
        <Route path="/my-report" element={<CustomerReport />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/feedback-report" element={<FeedbackReport />} />
        <Route path="/all-reports" element={<Reports />} />
        <Route path="/dashbord" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
