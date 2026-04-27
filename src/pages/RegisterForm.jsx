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
    const [selectedRole, setSelectedRole] = useState('user'); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const ADMIN_SECRET_CODE = "REALTYADMIN2026"; 
    const [adminCode, setAdminCode] = useState('');
    const [showAdminCode, setShowAdminCode] = useState(false);

    const handleRoleToggle = (role) => {
        setSelectedRole(role);
        setShowAdminCode(role === 'admin');
        if (role !== 'admin') setAdminCode('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) return setError("Passwords don't match!");
        if (password.length < 6) return setError("Password too short!");
        if (selectedRole === 'admin' && adminCode !== ADMIN_SECRET_CODE) return setError("Invalid admin code!");

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // 1. Save to Firestore first
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: email,
                role: selectedRole,
                createdAt: new Date(),
            });

            // 2. IMPORTANT: If you use Redux, dispatch the login action here 
            // so the app knows the role IMMEDIATELY before the navigate() fires.
            // dispatch(login({ user: userCredential.user, role: selectedRole }));

            // 3. Navigate to the specific route you want
            if (selectedRole === 'admin') {
                navigate('/listings'); // This is your manageListings route
            } else {
                navigate('/properties');
            }
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-cover bg-center overflow-hidden" 
             style={{ backgroundImage: `url(${heroImage})` }}>
            
            <div className="fixed inset-0 bg-black/70 z-0 backdrop-brightness-75"></div>

            {/* Tightened the max-width and vertical padding */}
            <div className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl shadow-2xl antialiased">
                
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
                    <p className="text-gray-300 text-sm italic">Join the RealtyApp ecosystem</p>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    
                    {/* Row 1: Email (Full width to keep it clean) */}
                    <div className="space-y-1">
                        <label className="text-white/60 text-[10px] font-bold uppercase ml-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 text-sm focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* Row 2: Passwords in Flex (Side-by-Side) */}
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-1">
                            <label className="text-white/60 text-[10px] font-bold uppercase ml-1">Password</label>
                            <input 
                                type="password" 
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <label className="text-white/60 text-[10px] font-bold uppercase ml-1">Confirm</label>
                            <input 
                                type="password" 
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm outline-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    {/* Row 3: Role Toggle (Horizontal Flex) */}
                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                        <span className="text-white/60 text-[10px] font-bold uppercase ml-2 whitespace-nowrap">I am a:</span>
                        <div className="flex flex-1 gap-2">
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('user')}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${selectedRole === 'user' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}
                            >
                                Buyer / Tenant
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRoleToggle('admin')}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${selectedRole === 'admin' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}
                            >
                                Agent / Admin
                            </button>
                        </div>
                    </div>

                    {/* Conditional Row: Admin Code (Smaller footprint) */}
                    {showAdminCode && (
                        <div className="animate-fadeIn space-y-1">
                            <input 
                                type="password" 
                                placeholder="Admin Secret Code"
                                className="w-full p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/40 text-sm outline-none"
                                value={adminCode}
                                onChange={(e) => setAdminCode(e.target.value)} 
                                required={selectedRole === 'admin'}
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black p-3 rounded-xl transition-all shadow-lg text-sm uppercase tracking-widest active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Complete Registration'}
                    </button>
                </form>

                <div className="mt-4 flex justify-between items-center text-[11px]">
                    <p className="text-gray-400 ">Already a member? <Link to="/login" className="text-blue-400 font-bold">Sign In</Link></p>
                    <p className="text-gray-500 italic">Secure 256-bit Encryption</p>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;