import { useState, useEffect } from "react";
import { db, auth } from "../firebase/config";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"; // ADDED updateDoc
import { deleteUser } from "firebase/auth";
import { enhanceDescription } from "../utils/aiService";
import heroImage from '../assets/bathroom1.jpg';
import SeedDataButton from '../components/SeedDataButton';


const ManageListings = () => {
    const [properties, setProperties] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [editingId, setEditingId] = useState(null); 
    const [form, setForm] = useState({ title: "", price: "", location: "", address: "", description: "", imageUrl: "", bedrooms: "", type: "" });

    const fetchRentals = async () => {
        const querySnapshot = await getDocs(collection(db, "rentals"));
        setProperties(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => { fetchRentals(); }, []);

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

    const handleDeleteAccount = async () => {
        if (window.confirm("WARNING: This will permanently delete your agent account. Proceed?")) {
            try {
                const user = auth.currentUser;
                await deleteUser(user);
                alert("Account deleted.");
            } catch (error) {
                console.error("Account deletion failed", error);
                alert("Please re-login to verify your identity before deleting your account.");
            }
        }
    };

    const handleEditClick = (property) => {
        setEditingId(property.id);
        setForm({
            title: property.title,
            price: property.price,
            location: property.location,
            address: property.address || property.location,
            description: property.description,
            imageUrl: property.imageUrl || "",
            bedrooms: property.bedrooms || "",
            type: property.type || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ title: "", price: "", location: "", address: "", description: "", imageUrl: "", bedrooms: "", type: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSave = {
                ...form,
                price: Number(form.price),
                createdAt: editingId ? undefined : new Date()
            };
            
            if (editingId) {
                await updateDoc(doc(db, "rentals", editingId), dataToSave);
                alert("Listing updated successfully!");
                setEditingId(null);
            } else {
                await addDoc(collection(db, "rentals"), dataToSave);
                alert("Listing created successfully!");
            }
            
            setForm({ title: "", price: "", location: "", address: "", description: "", imageUrl: "", bedrooms: "", type: "" });
            fetchRentals();
        } catch (error) { 
            console.error("Save failed", error); 
            alert("Failed to save listing. Check console for details.");
        }
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
                <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
                    <h1 className="text-4xl font-black text-white tracking-tight">Management Console</h1>
                    <div className="flex gap-3">
                        <SeedDataButton />  {/* Add this line */}
                        <button onClick={handleDeleteAccount} className="text-red-400 hover:text-red-200 text-xs font-bold uppercase tracking-widest border border-red-400/30 px-4 py-2 rounded-full transition">
                            Delete My Account
                        </button>
                    </div>
                </div>
                
                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Input Section */}
                    <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl h-fit border border-white/20">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? "Edit Listing" : "Create New Listing"}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Property Title (e.g., "1101 Puffin Dr, Runda")</label>
                                <input className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition" placeholder="e.g., 1101 Puffin Dr, Runda" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required/>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Neighborhood</label>
                                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl" placeholder="e.g., Runda" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Full Address</label>
                                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl" placeholder="e.g., 1101 Puffin Drive" value={form.address} onChange={e => setForm({...form, address: e.target.value})}/>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Price ($)</label>
                                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl" type="number" placeholder="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Bedrooms</label>
                                    <input className="w-full p-4 bg-gray-50 border-none rounded-2xl" placeholder="3" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})}/>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Type</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                                        <option value="">Select</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Townhouse">Townhouse</option>
                                        <option value="Penthouse">Penthouse</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Image URL</label>
                                <input className="w-full p-4 bg-gray-50 border-none rounded-2xl" placeholder="https://example.com/photo.jpg" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
                            </div>
                            
                            <button type="button" onClick={handleAIEnhance} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-2xl text-sm font-bold hover:scale-[1.02] transition-all shadow-lg">
                                {aiLoading ? "Gemini is writing..." : "✨ Auto-Generate Description"}
                            </button>

                            <div>
                                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Description</label>
                                <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl h-32" placeholder="Property description..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} required/>
                            </div>
                            
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-blue-600 text-white p-5 rounded-2xl font-black hover:bg-blue-700 transition-all">
                                    {editingId ? "Update Listing" : "Publish Listing"}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white p-5 rounded-2xl font-bold hover:bg-gray-600 transition-all">
                                        Cancel
                                    </button>
                                )}
                            </div>
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
                                    <div className="relative w-full h-48 mb-4 overflow-hidden rounded-[1.8rem]">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                                <span className="text-gray-500 text-xs font-bold">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full">
                                            <p className="text-blue-400 font-black text-sm">${Number(p.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full uppercase font-bold tracking-widest">{p.location}</span>
                                            <button onClick={() => handleDeleteProperty(p.id)} className="text-gray-400 hover:text-red-400 transition">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-1 tracking-tight">{p.title}</h3>
                                        <p className="text-blue-400 font-black text-xl mb-2">${Number(p.price).toLocaleString()}</p>
                                        <p className="text-xs text-gray-400 mb-2">{p.address || p.location}</p>
                                        <p className="text-sm text-gray-300 line-clamp-2 font-light">{p.description}</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500">ID: {p.id.slice(0,8)}</span>
                                        <button onClick={() => handleEditClick(p)} className="text-xs font-bold text-blue-400 hover:text-blue-200 uppercase tracking-widest">
                                            Edit Details
                                        </button>
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