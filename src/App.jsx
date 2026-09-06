import { Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/public/Home";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";

// Farmer Layout
import FarmerLayout from "./layouts/FarmerLayout";

// Farmer Pages
import Dashboard from "./pages/farmer/Dashboard";
import Centres from "./pages/farmer/Centres";
import CentreDetails from "./pages/farmer/CentreDetails";
import Recommendations from "./pages/farmer/Recommendations";
import Booking from "./pages/farmer/Booking";
import BookingConfirmation from "./pages/farmer/BookingConfirmation";
import LiveQueue from "./pages/farmer/LiveQueue";
import ProcurementStatus from "./pages/farmer/ProcurementStatus";
import PaymentStatus from "./pages/farmer/PaymentStatus";
import Profile from "./pages/farmer/Profile";
import MyBookings from "./pages/farmer/MyBookings";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Farmer Dashboard */}
      <Route
        path="/dashboard"
        element={
          <FarmerLayout>
            <Dashboard />
          </FarmerLayout>
        }
      />

      {/* Find Procurement Centres */}
      <Route
        path="/centres"
        element={
          <FarmerLayout>
            <Centres />
          </FarmerLayout>
        }
      />

      {/* Centre Details */}
      <Route
        path="/centres/:id"
        element={
          <FarmerLayout>
            <CentreDetails />
          </FarmerLayout>
        }
      />

      {/* Recommended Centres */}
      <Route
        path="/recommendations"
        element={
          <FarmerLayout>
            <Recommendations />
          </FarmerLayout>
        }
      />

      {/* Slot Booking */}
      <Route
        path="/booking"
        element={
          <FarmerLayout>
            <Booking />
          </FarmerLayout>
        }
      />

      {/* Booking Confirmation */}
      <Route
        path="/booking-confirmation"
        element={
          <FarmerLayout>
            <BookingConfirmation />
          </FarmerLayout>
        }
      />

      {/* Live Queue */}
      <Route
        path="/queue"
        element={
          <FarmerLayout>
            <LiveQueue />
          </FarmerLayout>
        }
      />

      {/* Procurement Status */}
      <Route
        path="/procurement"
        element={
          <FarmerLayout>
            <ProcurementStatus />
          </FarmerLayout>
        }
      />

      {/* Payment Status */}
      <Route
        path="/payment"
        element={
          <FarmerLayout>
            <PaymentStatus />
          </FarmerLayout>
        }
      />

      {/* My Profile */}
      <Route
        path="/profile"
        element={
          <FarmerLayout>
            <Profile />
          </FarmerLayout>
        }
      />

      {/* My Bookings */}
      <Route
        path="/bookings"
        element={
          <FarmerLayout>
            <MyBookings />
          </FarmerLayout>
        }
      />
    </Routes>
  );
}

export default App;