import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import ManageListings from "./pages/ManageListings";
import PropertyDetails from "./pages/PropertyDetails";
import RegisterForm from "./pages/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import BookingCalendar from "./components/BookingCalendar";
import PropertyList from "./components/PropertyList";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MyBookings from "./pages/MyBookings";
import AllBookings from "./pages/AllBookings";

function App() {
    return (
        
        <AuthProvider>
            <Navbar />
            <main className="pt-20">
                <Routes>
                    {/* Public Routes - Accessible to everyone */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/properties" element={<PropertyList />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />

                    {/* Buyer/Tenant Routes (role: 'user') */}
                    <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                        <Route path="/booking" element={<BookingCalendar />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>

                    {/* user Routes (role: 'user') */}
                    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                        <Route path="/my-bookings" element={<MyBookings />} />
                    </Route>
                    {/* Agent/Admin Routes (role: 'admin') */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/listings" element={<ManageListings />} />
                        <Route path="/all-bookings" element={<AllBookings />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </AuthProvider>
        
    );
}

export default App;