import React, { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../assets/bathroom1.jpg'; // Consistent background

function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: 'user', // Default role
                createdAt: new Date()
            });

            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4" 
             style={{ backgroundImage: `url(${heroImage})` }}>
            
            {/* Dark Overlay for contrast */}
            <div className="absolute inset-0 bg-black/50 z-0"></div>

            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Join Realty App</h2>
                    <p className="text-gray-300 mt-2">Start your property journey today.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full p-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold p-4 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-95"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-300">
                    Already have an account? <Link to="/login" className="text-blue-400 font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterForm;