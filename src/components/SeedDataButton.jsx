import { useState } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const SAMPLE_PROPERTIES = [
    {
        title: "1101 Puffin Drive",
        location: "Runda",
        address: "1101 Puffin Drive, Runda Estate, Nairobi",
        price: 250000,
        bedrooms: 4,
        bathrooms: 4,
        type: "Villa",
        description: "Stunning 4-bedroom villa in prestigious Runda Estate. Features include a private garden, swimming pool, and 24/7 security. Walking distance to Village Market.",
        imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        createdAt: new Date()
    },
    {
        title: "The Mirage - Tower A",
        location: "Westlands",
        address: "Mirage Towers, Waiyaki Way, Westlands, Nairobi",
        price: 120000,
        bedrooms: 2,
        bathrooms: 2,
        type: "Apartment",
        description: "Luxury 2-bedroom apartment in Westlands with panoramic city views. Includes gym, pool, and concierge service.",
        imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        createdAt: new Date()
    },
    {
        title: "Rosslyn Riviera",
        location: "Riverside",
        address: "Rosslyn Riviera, Riverside Drive, Nairobi",
        price: 180000,
        bedrooms: 3,
        bathrooms: 3,
        type: "Apartment",
        description: "Modern 3-bedroom apartment in Riverside. High-end finishes, smart home features, and breathtaking views of Karura Forest.",
        imageUrl: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
        createdAt: new Date()
    },
    {
        title: "Vipingo Ridge",
        location: "Kilifi",
        address: "Vipingo Ridge, Kilifi County",
        price: 350000,
        bedrooms: 5,
        bathrooms: 5,
        type: "Villa",
        description: "Beachfront villa with golf course access. 5 bedrooms, private pool, and direct beach access.",
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800",
        createdAt: new Date()
    },
    {
        title: "Le Mac Gardens",
        location: "Kilimani",
        address: "Le Mac Gardens, Elgeyo Marakwet Road, Kilimani, Nairobi",
        price: 95000,
        bedrooms: 2,
        bathrooms: 2,
        type: "Apartment",
        description: "Cozy 2-bedroom apartment in Kilimani. Close to shopping malls, restaurants, and major highways. Perfect for young professionals.",
        imageUrl: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
        createdAt: new Date()
    },
    {
        title: "Tatu City",
        location: "Ruiru",
        address: "Tatu City, Ruiru, Kiambu County",
        price: 80000,
        bedrooms: 3,
        bathrooms: 2,
        type: "Townhouse",
        description: "Modern townhouse in Tatu City's satellite town. Access to schools, parks, and business parks.",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        createdAt: new Date()
    }
];

function SeedDataButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const checkExistingProperties = async () => {
        const q = query(collection(db, "rentals"), where("title", "in", SAMPLE_PROPERTIES.map(p => p.title)));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data().title);
    };

    const seedProperties = async () => {
        setLoading(true);
        setMessage('Checking existing properties...');
        
        try {
            const existingTitles = await checkExistingProperties();
            const newProperties = SAMPLE_PROPERTIES.filter(p => !existingTitles.includes(p.title));
            
            if (newProperties.length === 0) {
                setMessage('✅ All sample properties already exist in the database!');
                setLoading(false);
                return;
            }
            
            setMessage(`Adding ${newProperties.length} new properties...`);
            
            for (const property of newProperties) {
                await addDoc(collection(db, "rentals"), property);
                console.log(`Added: ${property.title}`);
            }
            
            setMessage(`✅ Successfully added ${newProperties.length} properties with specific Nairobi addresses!`);
            
            // Refresh the page after 2 seconds
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            console.error("Error seeding data:", error);
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-4">
            <button
                onClick={seedProperties}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    loading 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
                {loading ? 'Adding Properties...' : '🏠 Add Sample Nairobi Properties'}
            </button>
            {message && (
                <p className={`mt-2 text-sm ${message.includes('✅') ? 'text-green-400' : 'text-yellow-400'}`}>
                    {message}
                </p>
            )}
        </div>
    );
}

export default SeedDataButton;