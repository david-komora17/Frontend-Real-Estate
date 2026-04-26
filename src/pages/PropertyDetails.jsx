import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import heroImage from '../assets/bathroom1.jpg';

function PropertyDetails() {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchProperty = async () => {
            const docRef = doc(db, "rentals", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProperty({ id: docSnap.id, ...docSnap.data() });
            }
            setLoading(false);
        };
        fetchProperty();
    }, [id]);

    const handleBookViewing = () => {
        if (!user) {
            alert("Please login to book a viewing.");
            navigate('/login');
            return;
        }
        navigate(`/booking?propertyId=${id}`, { state: { propertyId: id } });
    };

    if (loading) return <div className="p-10 text-center text-xl text-white">Loading Property...</div>;
    if (!property) return <div className="p-10 text-center text-white">Property not found.</div>;

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            <div className="relative z-10 max-w-4xl mx-auto p-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden">
                    <div className="h-96 bg-gradient-to-br from-gray-700 to-gray-900 relative">
                        {property.imageUrl ? (
                            <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white/30 text-xl">Premium Listing</div>
                        )}
                        <div className="absolute top-6 right-6 bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-xl shadow-lg">
                            ${property.price}/month
                        </div>
                    </div>
                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-white">{property.title}</h1>
                        <p className="text-blue-400 text-xl mt-2 flex items-center gap-2">
                             {property.address || property.location}
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-4 py-4 border-y border-white/20">
                            <div>
                                <p className="text-gray-400 text-sm">Property Type</p>
                                <p className="text-white font-semibold">{property.type || "Residential"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Bedrooms</p>
                                <p className="text-white font-semibold">{property.bedrooms || "Contact for details"}</p>
                            </div>
                        </div>
                        <p className="mt-6 text-gray-300 leading-relaxed text-lg">{property.description || "No description provided."}</p>
                        
                        <button 
                            onClick={handleBookViewing}
                            className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl text-lg"
                        >
                             Book a Viewing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyDetails;