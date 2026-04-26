import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import heroImage from '../assets/bathroom1.jpg';

function Dashboard() {
    const { user, role } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed p-6" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-10 text-white">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">User Portal</h1>
                        <p className="text-blue-400 font-medium">Welcome back, {user?.email}</p>
                    </div>
                   
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Role Card */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] text-white">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Account Type</span>
                        <h2 className="text-4xl font-black mt-2 capitalize">{role}</h2>
                        <div className="mt-4 h-1 w-12 bg-blue-500 rounded-full"></div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="md:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] text-white">
                        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link to="/booking" className="p-4 bg-blue-600/40 border border-white/20 rounded-2xl hover:bg-blue-600/60 transition text-center font-bold">
                                 Book a Viewing
                            </Link>
                            
                            {/* Conditional Admin Link */}
                            {role === 'admin' && (
                                <Link to="/listings" className="p-4 bg-purple-600/40 border border-white/20 rounded-2xl hover:bg-purple-600/60 transition text-center font-bold">
                                    Manage Listings (Admin)
                                </Link>
                            )}

                            <Link to="/my-bookings" className="p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition text-center font-bold">
                                My Bookings
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Status Section */}
                <div className="mt-8 bg-white/95 backdrop-blur-md p-8 rounded-[32px] shadow-2xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Account Overview</h3>
                    <div className="flex gap-4">
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold">● System Active</div>
                        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold">● User logged in</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;