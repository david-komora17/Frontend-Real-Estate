import { useState, useEffect } from "react";
import { db, auth } from "../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { enhanceDescription } from "../utils/aiService";
import heroImage from '../assets/bathroom1.jpg';

const ManageListings = () => {
    const [properties, setProperties] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [form, setForm] = useState({ title: "", price: "", location: "", description: "" });

    const fetchRentals = async () => {
        const querySnapshot = await getDocs(collection(db, "rentals"));
        setProperties(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => { fetchRentals(); }, []);

    // --- LOGIC: Delete Property ---
    const handleDeleteProperty = async (id) => {
        if (window.confirm("Are you sure you want to remove this listing?")) {
            try {
                await deleteDoc(doc(db, "rentals", id));
                setProperties(properties.filter(p => p.id !== id));
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    // --- LOGIC: Delete Account ---
    const handleDeleteAccount = async () => {
        if (window.confirm("WARNING: This will permanently delete your agent account. Proceed?")) {
            try {
                const user = auth.currentUser;
                await deleteUser(user);
                alert("Account deleted.");
                // Note: Your AuthContext/onAuthStateChanged will automatically redirect them
            } catch (error) {
                console.error("Account deletion failed", error);
                alert("Please re-login to verify your identity before deleting your account.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "rentals"), form);
            setForm({ title: "", price: "", location: "", description: "" });
            fetchRentals();
        } catch (error) { console.error("Save failed", error); }
    };

    const handleAIEnhance = async () => {
        if (!form.title || !form.location) {
            return alert("Please enter a Title and Location first!");
        }
        setAiLoading(true);
        try {
            const aiText = await enhanceDescription(form.title, form.location);
            setForm({ ...form, description: aiText });
        } catch (error) {
            alert("AI generation failed. Check API key.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-fixed bg-center p-6 relative" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="bg-black/60 fixed inset-0 z-0"></div> 
            
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tight">Management Console</h1>
                    <button 
                        onClick={handleDeleteAccount}
                        className="text-red-400 hover:text-red-200 text-xs font-bold uppercase tracking-widest border border-red-400/30 px-4 py-2 rounded-full transition"
                    >
                        Delete My Account
                    </button>
                </div>
                
                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Input Section */}
                    <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl h-fit border border-white/20">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Listing</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Property Name</label>
                                <input className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="e.g. Luxury Penthouse" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Location</label>
                                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="City" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required/>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Price ($)</label>
                                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" type="number" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required/>
                                </div>
                            </div>
                            
                            <button type="button" onClick={handleAIEnhance} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-purple-500/20">
                                {aiLoading ? "Gemini is writing..." : "✨ Auto-Generate Copy"}
                            </button>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Description</label>
                                <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl h-32 focus:ring-2 focus:ring-blue-500 transition" placeholder="AI will populate this..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required/>
                            </div>
                            
                            <button type="submit" className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/30 transition-all">Publish</button>
                        </form>
                    </div>

                    {/* Display Section */}
                    <div className="lg:col-span-8">
                        <h2 className="text-white font-bold mb-6 flex items-center gap-2">
                            Active Listings <span className="bg-blue-500 text-[10px] px-2 py-1 rounded-full">{properties.length}</span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {properties.map(p => (
                                <div key={p.id} className="group bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] text-white hover:bg-white/20 transition-all duration-500 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full uppercase font-bold tracking-widest">{p.location}</span>
                                            <button 
                                                onClick={() => handleDeleteProperty(p.id)}
                                                className="text-gray-400 hover:text-red-400 transition"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-1 tracking-tight">{p.title}</h3>
                                        <p className="text-blue-400 font-black text-xl mb-4">${Number(p.price).toLocaleString()}</p>
                                        <p className="text-sm text-gray-300 line-clamp-3 font-light leading-relaxed">{p.description}</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500">ID: {p.id.slice(0,8)}</span>
                                        <button className="text-xs font-bold text-blue-400 hover:text-blue-200 uppercase tracking-widest">Edit Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageListings;