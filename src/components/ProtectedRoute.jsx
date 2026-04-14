import { useSelector } from "react-redux";
import { Navigate, Outlet, UseLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
    const {user, role, loading} = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) return<div>Loading....</div>;

    if (!allowedRoles.includes(role)) {
        return <Navigate to = "/unauthorized" replace/>
    }
    return <Outlet/>
};

export default ProtectedRoute;