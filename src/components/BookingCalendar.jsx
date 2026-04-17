import React, { useEffect, useState} from 'react';
import {db, auth} from "../firebase/config"
import { collection, addDoc } from "firebase/firestore";
import heroImage from '../assets/bathroom1.jpg';

function BookingCalendar() {
    const [date, setDate] = useState("");

    const handleBook = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "bookings"), {
            userId: auth.currentUser.uid,
            date: date,
            status: "pending",
            createdAt: new Date()
        });
        alert("Viewing booked!");
    };
  
  return (
        // Inside BookingCalendar.jsx return:
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
                 style={{ backgroundImage: `url(${heroImage})` }}>        
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] text-white w-100">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-white-800 uppercase tracking-tighter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    Schedule Viewing
                </h2>
                <p className="text-gray-500 text-sm">Select a date to visit the property</p>
            </div>
            <form onSubmit={handleBook} className="space-y-6">
                <div className="relative">
                    <input type="text" placeholder="Select the property title" className="w-full p-4 bg-white/20 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition" 
                          onChange={(e) => setDate(e.target.value)} required /> <br /><br />
                    <input type="date" className="w-full p-4 bg-white/20 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition" 
                          onChange={(e) => setDate(e.target.value)} required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:shadow-blue-200 hover:shadow-2xl transition-all">
                    Confirm Appointment
                </button>
            </form>
        </div>
    
    </div>
    );
}
export default BookingCalendar