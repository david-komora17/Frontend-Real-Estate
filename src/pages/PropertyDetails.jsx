import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'

function PropertyDetails() {
    const {id} = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async() => {
            const docRef = doc(db, "rentals", id);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                
            }
        }
    })
  return (
    <div></div>
  )
}

export default PropertyDetails