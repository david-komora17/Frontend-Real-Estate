import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import heroImage from '../assets/bathroom1.jpg';

function AllBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, today: 0 });

    const fetchAllBookings = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "bookings"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            const allData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setBookings(allData);
            
            // Basic Telemetry Logic
            const todayStr = new Date().toISOString().split('T')[0];
            setStats({
                total: allData.length,
                today: allData.filter(b => b.date === todayStr).length
            });
        } catch (error) {
            console.error("Telemetry fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllBookings(); }, []);

    const cancelBooking = async (id) => {
        if(window.confirm("Cancel this booking globally?")) {
            await deleteDoc(doc(db, "bookings", id));
            fetchAllBookings();
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-fixed p-6" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="absolute inset-0 bg-slate-900/80 z-0"></div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">Admin Telemetry</h1>
                        <p className="text-blue-400 font-bold uppercase text-xs tracking-[0.2em]">Global Booking Intelligence</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[120px]">
                            <p className="text-gray-400 text-[10px] font-black uppercase">Total Bookings</p>
                            <p className="text-2xl text-white font-black">{stats.total}</p>
                        </div>
                        <div className="bg-blue-600/20 backdrop-blur-md p-4 rounded-2xl border border-blue-500/30 text-center min-w-[120px]">
                            <p className="text-blue-400 text-[10px] font-black uppercase">New Today</p>
                            <p className="text-2xl text-white font-black">{stats.today}</p>
                        </div>
                    </div>
                </header>

                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <th className="p-6">Client / Email</th>
                                <th className="p-6">Property</th>
                                <th className="p-6">Schedule</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-white divide-y divide-white/5">
                            {bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-6">
                                        <p className="font-bold text-blue-100">{b.userName || "Unknown User"}</p>
                                        <p className="text-xs text-gray-500">{b.userEmail}</p>
                                    </td>
                                    <td className="p-6">
                                        <p className="font-medium">{b.propertyTitle}</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">ID: {b.id.slice(0,8)}</p>
                                    </td>
                                    <td className="p-6">
                                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold mr-2">{b.date}</span>
                                        <span className="text-gray-400 text-xs">{b.time}</span>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button onClick={() => cancelBooking(b.id)} className="text-red-400 hover:text-red-200 text-xs font-bold uppercase">Terminate</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {loading && <div className="p-20 text-center text-white/50 font-bold">Syncing Telemetry...</div>}
                </div>
            </div>
        </div>
    );
}

export default AllBookings;