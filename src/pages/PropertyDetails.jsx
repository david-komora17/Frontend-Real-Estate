import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import heroImage from '../assets/bathroom1.jpg';

function PropertyDetails() {
    const { id } = useParams(); // Gets the ID from /property/:id
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperty = async () => {
            const docRef = doc(db, "rentals", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProperty(docSnap.data());
            } else {
                console.log("No such property!");
            }
            setLoading(false);
        };

        fetchProperty();
    }, [id]);

    if (loading) return <div className="p-10 text-center text-xl">Loading Property...</div>;
    if (!property) return <div className="p-10 text-center">Property not found.</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="max-w-4xl mx-auto p-6 ">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="h-64 bg-gray-300 animate-pulse">
                        {/* Placeholder for property image */}
                        <div className="flex items-center justify-center h-full text-gray-500 italic">Property Image</div>
                    </div>
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
                        <p className="text-blue-600 text-2xl font-semibold mt-2">${property.price} / month</p>
                        <p className="mt-4 text-gray-600 leading-relaxed">{property.description || "No description provided."}</p>
                        
                        <button className="mt-8 w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
                            Book a Viewing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyDetails;