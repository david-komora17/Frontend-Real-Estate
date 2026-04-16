import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import Home from "./pages/Home";
import ManageListings from "./pages/ManageListings";
import PropertyDetails from "./pages/PropertyDetails";
import RegisterForm from "./pages/RegisterForm";
import UserBookings from "./pages/UserBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import BookingCalendar from "./components/BookingCalendar";
import AdminRoutes from "./components/AdminRoutes";
 

function App() {
  return (
    <AuthProvider>
        <Routes>
            <Route path="/" element= {<Home/>}/>
            <Route path="/login" element= {<LoginForm/>}/>
            <Route path="/register" element= {<RegisterForm/>}/>
            <Route path="/listings" element= {<ManageListings/>}/>

          <Route element = {<ProtectedRoute allowedRoles={['user', 'admin']}/>}>
              <Route path="/dashboard" element= {<userDashboard/>}/>
              <Route path="/booking" element= {<BookingCalendar/>}/>
          </Route>
          <Route element = {<ProtectedRoute allowedRoles = {['admin']}/>}>
              <Route path="/admin" element= {<AdminRoutes/>}/>
          </Route>
        </Routes>
    </AuthProvider>
  )
}

export default App