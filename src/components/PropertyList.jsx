import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import heroImage from '../assets/bathroom1.jpg';

function PropertyList() {
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            
            // Try RentCast API first (silent background)
            try {
                const results = await searchRentals('Nairobi, Kenya', 500, 5000);
                
                if (results && results.length > 0) {
                    const transformedData = results.map(prop => ({
                        id: prop.id || `rentcast_${Math.random()}`,
                        title: prop.address?.street || `${prop.bedrooms || 2} Bedroom Property`,
                        location: `${prop.address?.city || 'Nairobi'}, Kenya`,
                        price: prop.rentalPrice || prop.price || 1500,
                        description: prop.description || `${prop.bedrooms || 2} bed, ${prop.bathrooms || 2} bath property in ${prop.address?.city || 'Nairobi'}. Modern amenities included.`,
                        imageUrl: `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800`,
                        bedrooms: prop.bedrooms,
                        bathrooms: prop.bathrooms,
                        source: 'RentCast'
                    }));
                    setProperties(transformedData);
                } else {
                    // Fallback to Firebase if RentCast returns nothing
                    await fetchFromFirebase();
                }
            } catch (error) {
                console.error("RentCast error, falling back to Firebase:", error);
                // Fallback to Firebase on error
                await fetchFromFirebase();
            } finally {
                setLoading(false);
            }
        };
        
        const fetchFromFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "rentals"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProperties(data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
        
        fetchProperties();
    }, []);

    // Simple search filter
    const filteredProperties = properties.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed p-6 md:p-12" 
             style={{ backgroundImage: `url(${heroImage})` }}>
            
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Available Rentals</h1>
                        <p className="text-gray-300">Discover your next home across the country...</p>
                    </div>
                    
                    <div className="w-full md:w-96">
                        <input 
                            type="text" 
                            placeholder="Search by title or location..." 
                            className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-white text-xl animate-pulse">Loading amazing properties...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProperties.map(p => (
                            <div key={p.id} className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-[32px] overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                                {/* Property Image */}
                                <div className="h-56 bg-gradient-to-br from-gray-700 to-gray-900 relative">
                                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1 rounded-full font-bold shadow-lg">
                                        ${typeof p.price === 'number' ? p.price.toLocaleString() : p.price}
                                    </div>
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white/20 italic">
                                            Premium Listing
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">{p.title}</h3>
                                    <p className="text-blue-400 font-medium flex items-center gap-1 mb-4">
                                         {p.location}
                                    </p>
                                    <p className="text-gray-300 text-sm line-clamp-2 mb-6 italic">
                                        "{p.description || "An exquisite property waiting for you to call it home."}"
                                    </p>
                                    
                                    <Link 
                                        to={`/property/${p.id}`} 
                                        className="block text-center bg-white text-blue-900 font-bold py-3 rounded-xl hover:bg-blue-50 transition shadow-lg"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredProperties.length === 0 && !loading && (
                    <div className="text-center py-20 text-white/50">
                        <p className="text-2xl">No properties match your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PropertyList;