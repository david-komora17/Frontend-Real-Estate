import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {AuthProvider} from "./context/AuthContext";
import Home from "./pages/Home";
import ManageListings from "./pages/ManageListings";
import PropertyDetails from "./pages/PropertyDetails";
import RegisterForm from "./pages/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import BookingCalendar from "./components/BookingCalendar";
import PropertyList from "./components/PropertyList";
import Dashboard from "./pages/Dashboard";
 

function App() {
  return (
    <AuthProvider>
        <Routes>
          {/* Public Routes */}
            <Route path="/" element= {<Home/>}/>
            <Route path="/login" element= {<LoginForm/>}/>
            <Route path="/register" element= {<RegisterForm/>}/>
            <Route path="/property/:id" element= {<PropertyDetails/>}/>
            <Route path="/properties" element= {<PropertyList/>}/>


            <Route path="/listings" element= {<ManageListings/>}/>
          {/*user and admin routes*/}
          <Route element = {<ProtectedRoute allowedRoles={['user', 'admin']}/>}>
              <Route path="/booking" element= {<BookingCalendar/>}/>
              <Route path="/dashboard" element= {<Dashboard/>}/>
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