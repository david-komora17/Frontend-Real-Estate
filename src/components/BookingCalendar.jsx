import React, { useEffect, useState } from 'react';
import { db, auth } from "../firebase/config";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { useNavigate, useLocation } from 'react-router-dom';
import heroImage from '../assets/bathroom1.jpg';

function BookingCalendar() {
    const [date, setDate] = useState("");
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const propertyId = location.state?.propertyId || new URLSearchParams(location.search).get('propertyId');

    useEffect(() => {
        const fetchProperty = async () => {
            if (!propertyId) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, "rentals", propertyId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProperty({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching property:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [propertyId]);

    const handleBook = async (e) => {
        e.preventDefault();
        
        if (!propertyId) {
            alert("Please select a property first. Go to Properties and click 'View Details' on a listing.");
            return;
        }
        
        if (!date) {
            alert("Please select a date for the viewing.");
            return;
        }

        try {
            await addDoc(collection(db, "bookings"), {
                userId: auth.currentUser.uid,
                userEmail: auth.currentUser.email,
                propertyId: propertyId,
                propertyTitle: property?.title || "Unknown Property",
                propertyLocation: property?.location || "Unknown Location",
                propertyAddress: property?.address || property?.location,
                date: date,
                status: "pending",
                createdAt: new Date()
            });
            alert(`Viewing booked for ${property?.title || "property"} on ${date}!`);
            navigate('/dashboard');
        } catch (error) {
            console.error("Booking error:", error);
            alert("Failed to book viewing. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading property details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
             style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="fixed inset-0 bg-black/50 z-0 backdrop-brightness-75"></div>
            <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] text-white w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="inline mr-2">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                        </svg>
                        Schedule Viewing
                    </h2>
                </div>
                
                {property && (
                    <div className="mb-6 p-4 bg-white/10 rounded-2xl">
                        <p className="text-sm text-gray-300">Selected Property:</p>
                        <p className="font-bold text-lg">{property.title}</p>
                        <p className="text-blue-400 text-sm">{property.address || property.location}</p>
                        <p className="text-green-400 font-bold mt-1">${property.price}/month</p>
                    </div>
                )}
                
                {!property && (
                    <div className="mb-6 p-4 bg-red-500/20 rounded-2xl border border-red-500/50">
                        <p className="text-red-200 text-sm">No property selected. Please go to <strong>Properties</strong> and click <strong>View Details</strong> on a listing to book a viewing.</p>
                    </div>
                )}

                <form onSubmit={handleBook} className="space-y-6">
                    <div className="relative">
                        <input 
                            type="date" 
                            className="w-full p-4 bg-white/20 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition text-white" 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!property || !date}
                        className={`w-full p-4 rounded-2xl font-bold transition-all ${
                            !property || !date 
                                ? 'bg-gray-500 cursor-not-allowed' 
                                : 'bg-blue-600 hover:shadow-blue-200 hover:shadow-2xl'
                        } text-white`}
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookingCalendar;