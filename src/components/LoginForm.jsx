import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../assets/bathroom1.jpg';

function LoginForm() {
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = e.target.elements;
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value);
            navigate('/dashboard');
        } catch (err) {
            alert("Login failed: " + err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
             style={{ backgroundImage: `url(${heroImage})` }}>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>
                
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1">Email Address</label>
                        <input name="email" type="email" placeholder="email@example.com" 
                               className="p-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray-300 text-xs font-bold uppercase ml-1">Password</label>
                        <input name="password" type="password" placeholder="••••••••" 
                               className="p-4 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                    </div>

                    <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-2xl transition shadow-lg shadow-blue-500/30">
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-300">
                    Don't have an account? <Link to="/register" className="text-blue-400 font-bold hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;