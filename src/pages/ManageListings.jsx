import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore"

const addRental = async (propertyData) => {
    try {
        const docRef = await addDoc(collection(db, "rentals"), propertyData);
        console.log("Document written with ID:", docRef.id);
    } catch(e) {
        console.error("Error adding document: ", e);
    }
};