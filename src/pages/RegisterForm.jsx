import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../assets/bathroom1.jpg';

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('user'); // 'user' or 'admin'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Secret admin sign-up code (you can change this)
    const ADMIN_SECRET_CODE = "REALTYADMIN2026"; // Change this to your own secret code
    const [adminCode, setAdminCode] = useState('');
    const [showAdminCode, setShowAdminCode] = useState(false);

    const handleRoleToggle = (role) => {
        setSelectedRole(role);
        if (role === 'admin') {
            setShowAdminCode(true);
        } else {
            setShowAdminCode(false);
            setAdminCode('');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Password match validation
        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            setLoading(false);
            return;
        }

        // Password strength validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters!");
            setLoading(false);
            return;
        }

        // Admin code validation
        if (selectedRole === 'admin' && adminCode !== ADMIN_SECRET_CODE) {
            setError("Invalid admin registration code! Please contact the system administrator.");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user data in Firestore with selected role
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: selectedRole, // 'user' for buyers/tenants, 'admin' for agents
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true
            });

            // Navigate based on role
            if (selectedRole === 'admin') {
                navigate('/listings');
            } else {
                navigate('/properties');
            }
            
        } catch (err) {
            console.error("Registration error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError("Email already registered. Please login instead.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password is too weak. Use at least 6 characters.");
            } else {
                setError("Registration failed: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4" 
             style={{ backgroundImage: `url(${heroImage})` }}>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Join Realty App</h2>
                    <p className="text-gray-300 mt-2">Start your property journey today</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* Email Field */}
                    <div className="space-y-1">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            disabled={loading}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-400 ml-2">Minimum 6 characters</p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-1">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1">Confirm Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            disabled={loading}
                        />
                    </div>

                    {/* Role Selection Toggle */}
                    <div className="space-y-3">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1 block">
                            I am signing up as:
                        </label>
                        
                        <div className="bg-white/5 rounded-2xl p-1 border border-white/20">
                            <div className="flex gap-1">
                                {/* Buyer/Tenant Option */}
                                <button
                                    type="button"
                                    onClick={() => handleRoleToggle('user')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
                                        selectedRole === 'user'
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                    disabled={loading}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-bold"> Buyer / Tenant</span>
                                </button>

                                {/* Agent/Admin Option */}
                                <button
                                    type="button"
                                    onClick={() => handleRoleToggle('admin')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
                                        selectedRole === 'admin'
                                            ? 'bg-purple-600 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                    disabled={loading}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span className="font-bold"> Agent / Admin</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Role Description */}
                        <p className="text-xs text-gray-400 text-center">
                            {selectedRole === 'user' 
                                ? "✓ Browse properties, book viewings, save favorites" 
                                : "✓ List properties, manage bookings, access analytics"}
                        </p>
                    </div>

                    {/* Admin Secret Code (only shown when admin role is selected) */}
                    {showAdminCode && (
                        <div className="space-y-1 animate-fadeIn">
                            <label className="text-gray-300 text-xs font-bold uppercase ml-1">
                                Admin Registration Code <span className="text-red-400">*Required</span>
                            </label>
                            <input 
                                type="password" 
                                placeholder="Enter admin code" 
                                className="w-full p-4 bg-white/10 border border-purple-500/50 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                value={adminCode}
                                onChange={(e) => setAdminCode(e.target.value)} 
                                required={selectedRole === 'admin'}
                                disabled={loading}
                            />
                            <p className="text-xs text-purple-400 ml-2">
                                 Contact system administrator for the code
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold p-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-95 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </span>
                        ) : (
                            selectedRole === 'admin' ? 'Register as Agent' : 'Start Browsing Properties'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-300">
                    Already have an account? <Link to="/login" className="text-blue-400 font-bold hover:underline">Sign In</Link>
                </p>
                
                {/* Info Box */}
                <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-400 text-center">
                         By registering, you agree to our Terms of Service and Privacy Policy.
                        {selectedRole === 'admin' && " Admin accounts are verified for property management."}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;