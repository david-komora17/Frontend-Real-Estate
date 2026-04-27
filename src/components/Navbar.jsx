import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { logout } from '../store/authSlice.js';

function Navbar() {
    const { user, role } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Standard link style for consistency
    const linkStyle = "text-white/80 hover:text-white font-semibold transition-all duration-300 text-sm uppercase tracking-wider";

    return (
        <nav className="fixed top-0 w-full z-[100] bg-black/60 backdrop-blur-lg px-8 py-4 shadow-2xl h-20">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* Brand / Logo */}
                <Link to="/" className="text-2xl font-black text-white tracking-tighter hover:scale-105 transition-transform ">
                    REALTY<span className="text-blue-400 font-light italic">App</span>
                </Link>

                {/* Navigation Menu */}
                <div className="flex space-x-8 items-center pt-2">
                    {/* Public Link */}
                    <Link to="/properties" className={linkStyle}>
                         Homes
                    </Link>

                    {/* Authenticated Links */}
                    {user ? (
                        <>
                            <Link to="/dashboard" className={linkStyle}>
                                Portal
                            </Link>

                            {role !== 'admin' && (
                                <Link to="/my-bookings" className={linkStyle}>
                                    My Bookings
                                </Link>
                            )}

                            {/* Admin Telemetry Link */}
                            {role === 'admin' && (
                                <Link to="/all-bookings" className="text-purple-400 hover:text-purple-300 font-bold transition text-sm uppercase tracking-wider">
                                    Telemetry
                                </Link>
                            )}

                            {/* Logout Action */}
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500/10 border border-red-500/30 px-5 py-2 rounded-xl text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-500 transition shadow-[0_0_20px_rgba(37,99,235,0.3)] text-sm">
                            Agent Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
        
    );
}

export default Navbar;