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
 

function App() {
  return (
    <AuthProvider>
        <Routes>
          {/* Public Routes */}
            <Route path="/" element= {<Home/>}/>
            <Route path="/login" element= {<LoginForm/>}/>
            <Route path="/register" element= {<RegisterForm/>}/>
            <Route path="/property/:id" element= {<PropertyDetails/>}/>

            <Route path="/listings" element= {<ManageListings/>}/>
          {/*user and admin routes*/}
          <Route element = {<ProtectedRoute allowedRoles={['user', 'admin']}/>}>
              <Route path="/dashboard" element= {<UserBookings/>}/>
              <Route path="/booking" element= {<BookingCalendar/>}/>
          </Route>
          {/*Admin only routes*/}
          <Route element = {<ProtectedRoute allowedRoles = {['admin']}/>}>
            <Route path="/listings" element= {<ManageListings/>}/>
          </Route>
        </Routes>
    </AuthProvider>
  )
}

export default App