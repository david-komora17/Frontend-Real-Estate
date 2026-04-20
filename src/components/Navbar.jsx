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

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 px-8 py-4 shadow-2xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* Brand / Logo */}
                <Link to="/" className="text-2xl font-black text-purple tracking-tighter hover:opacity-80 transition">
                    REALTY<span className="text-blue-500 font-light italic">App</span>
                </Link>

                {/* Navigation Menu */}
                <div className="flex items-center space-x-8">
                    {/* Public Link */}
                    <Link to="/properties" className="text-black-200 hover:text-white font-medium transition text-sm uppercase tracking-wider">
                        Browse Homes
                    </Link>

                    {/* Authenticated Links */}
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-gray-200 hover:text-white font-medium transition text-sm uppercase tracking-wider">
                                My Portal
                            </Link>

                            {/* Logic: Only David/Admin sees "Manage" */}
                            {role === 'admin' && (
                                <Link to="/listings" className="text-purple-300 hover:text-purple-100 font-bold transition text-sm uppercase tracking-wider">
                                    Manage Listings
                                </Link>
                            )}

                            {/* Logout Action */}
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500/20 border border-red-500/50 px-6 py-2 rounded-xl text-red-200 font-bold hover:bg-red-500/40 transition"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        /* Logged Out Link */
                        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-lg text-sm">
                            Agent Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;