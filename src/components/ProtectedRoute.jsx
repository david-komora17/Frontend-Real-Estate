import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, role, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    // 1. If we are still loading the Firebase Auth state, stay on the loading screen
    if (loading) {
        return <div className="flex h-screen items-center justify-center text-white bg-black">Loading Auth State...</div>;
    }
    
    // 2. If no user is logged in at all, go to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If user exists but the role hasn't arrived from Firestore yet, WAIT.
    // Do NOT redirect yet.
    if (user && !role) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-white">
                <div className="animate-pulse">Verifying Permissions...</div>
            </div>
        );
    }

    // 4. ONLY NOW, if we have the role and it's not allowed, redirect home
    if (!allowedRoles.includes(role)) {
        console.warn(`Access denied. Role "${role}" not in allowed:`, allowedRoles);
        return <Navigate to="/" replace />;
    }
    
    return <Outlet />;
    
};

export default ProtectedRoute;