// scripts/addSampleProperties.js - Run this in browser console or as a node script
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const sampleProperties = [
    {
        title: "1101 Puffin Drive",
        location: "Runda",
        address: "1101 Puffin Drive, Runda Estate, Nairobi",
        price: 250000,
        bedrooms: 4,
        type: "Villa",
        description: "Stunning 4-bedroom villa in prestigious Runda Estate. Features include a private garden, swimming pool, and 24/7 security. Walking distance to Village Market.",
        imageUrl: ""
    },
    {
        title: "The Mirage - Tower A",
        location: "Westlands",
        address: "Mirage Towers, Waiyaki Way, Westlands, Nairobi",
        price: 120000,
        bedrooms: 2,
        type: "Apartment",
        description: "Luxury 2-bedroom apartment in Westlands with panoramic city views. Includes gym, pool, and concierge service.",
        imageUrl: ""
    },
    {
        title: "Rosslyn Riviera",
        location: "Riverside",
        address: "Rosslyn Riviera, Riverside Drive, Nairobi",
        price: 180000,
        bedrooms: 3,
        type: "Apartment",
        description: "Modern 3-bedroom apartment in Riverside. High-end finishes, smart home features, and breathtaking views of Karura Forest.",
        imageUrl: ""
    },
    {
        title: "Vipingo Ridge",
        location: "Kilifi",
        address: "Vipingo Ridge, Kilifi County",
        price: 350000,
        bedrooms: 5,
        type: "Villa",
        description: "Beachfront villa with golf course access. 5 bedrooms, private pool, and direct beach access.",
        imageUrl: ""
    }
];

const addProperties = async () => {
    for (const prop of sampleProperties) {
        await addDoc(collection(db, "rentals"), prop);
        console.log(`Added: ${prop.title}`);
    }
    console.log("All properties added!");
};