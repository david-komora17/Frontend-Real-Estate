import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const {user, role, loading} = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) return
    <div className="flex h-screen items-center justify-center">
        Loading....
    </div>;
    
    if (!user) {
        return <Navigate to="/login" state = {{from : Location}} replace/>;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to = "/" replace/>
    }
    return <Outlet/>
};

export default ProtectedRoute;