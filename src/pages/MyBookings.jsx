import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import heroImage from '../assets/bathroom1.jpg';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;
            try {
                // Fetching bookings specifically for this user
                const q = query(
                    collection(db, "bookings"),
                    where("userId", "==", user.uid)
                );

                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                // Sort by date manually if firestore index isn't ready
                setBookings(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed p-6" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="fixed inset-0 bg-black/50 z-0 backdrop-brightness-75"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tight">My Bookings</h1>
                    <Link to="/dashboard" className="text-sm font-bold text-blue-400 hover:text-white transition uppercase tracking-widest">
                        ← Back to Portal
                    </Link>
                </div>

                {loading ? (
                    <div className="text-white text-center p-10">Loading your schedule...</div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-12 rounded-[32px] text-center">
                        <p className="text-xl text-gray-300 mb-6">You haven't booked any viewings yet.</p>
                        <Link to="/booking" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                            Browse Properties
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[24px] flex flex-col md:flex-row justify-between items-center text-white">
                                <div>
                                    <h3 className="text-xl font-bold">{booking.propertyTitle || "Premium Property"}</h3>
                                    <p className="text-blue-400 text-sm font-medium">Ref: {booking.id.slice(0, 8)}</p>
                                </div>
                                
                                <div className="mt-4 md:mt-0 flex gap-6 text-center">
                                    <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                                        <p className="text-[10px] uppercase text-gray-400 font-bold">Date</p>
                                        <p className="font-bold">{booking.date}</p>
                                    </div>
                                    <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                                        <p className="text-[10px] uppercase text-gray-400 font-bold">Time</p>
                                        <p className="font-bold">{booking.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBookings;