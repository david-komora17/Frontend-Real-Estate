import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { enhanceDescription } from "../utils/aiService"; // Ensure correct path
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "rentals"), form);
            setForm({ title: "", price: "", location: "", description: "" });
            fetchRentals();
        } catch (error) { console.error("Save failed", error); }
    };

    const handleAIEnhance = async () => {
    // Basic validation
        if (!form.title || !form.location) {
            return alert("Please enter a Title and Location first. Gemini needs context!");
        }

        setAiLoading(true); // Show a loading indicator
        try {
            // Send data to our AI service
            const aiText = await enhanceDescription(form.title, form.location);
            
            // Update the form state with the AI text
            setForm({ ...form, description: aiText });
        } catch (error) {
            console.error("Gemini AI Error:", error);
            alert("AI generation failed. Check your API key or network.");
        } finally {
            setAiLoading(false); 
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-fixed bg-center p-6" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="bg-black/40 min-h-screen absolute inset-0 z-0"></div> {/* Dark Overlay */}
            
            <div className="relative z-10 max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Real Estate Management</h1>
                
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Elegant White Form */}
                    <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">New Listing</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="w-full p-3 border rounded-xl" placeholder="Property Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required/>
                            <input className="w-full p-3 border rounded-xl" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required/>
                            <input className="w-full p-3 border rounded-xl" type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required/>
                            
                            <button type="button" onClick={handleAIEnhance} className="w-full bg-purple-600 text-white p-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
                                {aiLoading ? "Generating..." : "✨ Enhance with Gemini AI"}
                            </button>

                            <textarea className="w-full p-3 border rounded-xl h-24" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required/>
                            
                            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg">Publish Listing</button>
                        </form>
                    </div>

                    {/* Listings Grid */}
                    <div className="lg:col-span-2 grid md:grid-cols-2 gap-4">
                        {properties.map(p => (
                            <div key={p.id} className="bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-2xl text-white hover:bg-white/20 transition">
                                <h3 className="text-xl font-bold">{p.title}</h3>
                                <p className="text-blue-300 font-semibold">${p.price} / mo</p>
                                <p className="text-sm text-gray-300 mt-2 line-clamp-2">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageListings;