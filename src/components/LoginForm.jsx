import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../assets/bathroom1.jpg';
import { useState } from 'react';

function LoginForm() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const { email, password } = e.target.elements;
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
            const user = userCredential.user;
            
            // Fetch user role from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();
            const role = userData?.role || 'user';
            
            // Redirect based on role
            if (role === 'admin') {
                navigate('/listings');
            } else {
                navigate('/properties');
            }
        } catch (err) {
            console.error("Login error:", err);
            if (err.code === 'auth/user-not-found') {
                setError("No account found with this email. Please register first.");
            } else if (err.code === 'auth/wrong-password') {
                setError("Incorrect password. Please try again.");
            } else {
                setError("Login failed: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
             style={{ backgroundImage: `url(${heroImage})` }}>
            
            <div className="fixed inset-0 bg-black/50 z-0 backdrop-brightness-75"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl mt-4">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>
                
                {error && (
                    <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1">Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            placeholder="email@example.com" 
                            className="p-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                            required 
                            disabled={loading}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1">Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="••••••••" 
                            className="p-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" 
                            required 
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-2xl transition shadow-lg shadow-blue-500/30 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-300">
                    Don't have an account? <Link to="/register" className="text-blue-400 font-bold hover:underline">Register here</Link>
                </p>
                
                {/* Role Info Box */}
                
            </div>
            
        </div>
    );
}

export default LoginForm;