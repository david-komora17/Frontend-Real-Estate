import React, { useEffect, useState} from 'react';
import {db} from "../firebase/config"
import { collection, onSnapshot, query, QuerySnapshot } from "firebase/firestore";

function BookingCalendar() {
    const [bookings, setBookings] = useState([]);
  
  useEffect( () => {
    const q = query(collection( db, "bookings"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const bookingsArray = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    setBookings(bookingsArray);    
    })

    return () => unsubscribe();
  }, []);
  
    return (
    <div>BookingCalendar</div>
  )
}

export default BookingCalendar