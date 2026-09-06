import { Routes, Route } from "react-router-dom";

// Public
import Home from "./pages/public/Home";
import Register from "./pages/public/Register";
import Login from "./pages/public/Login";
import FarmerLogin from "./pages/public/FarmerLogin";

// Layouts
import FarmerLayout from "./layouts/FarmerLayout";
import CentreLayout from "./layouts/CentreLayout";
import AdminLayout from "./layouts/AdminLayout";

// Farmer
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

// Centre
import CentreLogin from "./pages/centre/Login";
import CentreRegister from "./pages/centre/Register";
import CentreDashboard from "./pages/centre/Dashboard";
import CentreBookings from "./pages/centre/Bookings";
import QueueManagement from "./pages/centre/QueueManagement";
import Procurement from "./pages/centre/Procurement";
import CentrePayments from "./pages/centre/Payments";
import CentreProfile from "./pages/centre/Profile";

// Admin
import AdminLogin from "./pages/admin/Login";
import AdminRegister from "./pages/admin/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import Farmers from "./pages/admin/Farmers";
import AdminCentres from "./pages/admin/Centres";
import AdminBookings from "./pages/admin/Bookings";
import AdminProcurement from "./pages/admin/Procurement";
import AdminPayments from "./pages/admin/Payments";
import AdminReports from "./pages/admin/Reports";
import AdminProfile from "./pages/admin/Profile";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/farmer-login" element={<FarmerLogin />} />

      {/* Farmer */}
      <Route path="/dashboard" element={<FarmerLayout><Dashboard /></FarmerLayout>} />
      <Route path="/centres" element={<FarmerLayout><Centres /></FarmerLayout>} />
      <Route path="/centres/:id" element={<FarmerLayout><CentreDetails /></FarmerLayout>} />
      <Route path="/recommendations" element={<FarmerLayout><Recommendations /></FarmerLayout>} />
      <Route path="/booking" element={<FarmerLayout><Booking /></FarmerLayout>} />
      <Route path="/booking-confirmation" element={<FarmerLayout><BookingConfirmation /></FarmerLayout>} />
      <Route path="/queue" element={<FarmerLayout><LiveQueue /></FarmerLayout>} />
      <Route path="/procurement" element={<FarmerLayout><ProcurementStatus /></FarmerLayout>} />
      <Route path="/payment" element={<FarmerLayout><PaymentStatus /></FarmerLayout>} />
      <Route path="/profile" element={<FarmerLayout><Profile /></FarmerLayout>} />
      <Route path="/bookings" element={<FarmerLayout><MyBookings /></FarmerLayout>} />

      {/* Centre */}
      <Route path="/centre/register" element={<CentreRegister />} />
      <Route path="/centre/login" element={<CentreLogin />} />
      <Route path="/centre/dashboard" element={<CentreLayout><CentreDashboard /></CentreLayout>} />
      <Route path="/centre/bookings" element={<CentreLayout><CentreBookings /></CentreLayout>} />
      <Route path="/centre/queue" element={<CentreLayout><QueueManagement /></CentreLayout>} />
      <Route path="/centre/procurement" element={<CentreLayout><Procurement /></CentreLayout>} />
      <Route path="/centre/payments" element={<CentreLayout><CentrePayments /></CentreLayout>} />
      <Route path="/centre/profile" element={<CentreLayout><CentreProfile /></CentreLayout>} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/farmers" element={<AdminLayout><Farmers /></AdminLayout>} />
      <Route path="/admin/centres" element={<AdminLayout><AdminCentres /></AdminLayout>} />
      <Route path="/admin/bookings" element={<AdminLayout><AdminBookings /></AdminLayout>} />
      <Route path="/admin/procurement" element={<AdminLayout><AdminProcurement /></AdminLayout>} />
      <Route path="/admin/payments" element={<AdminLayout><AdminPayments /></AdminLayout>} />
      <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
      <Route path="/admin/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />
    </Routes>
  );
}

export default App;