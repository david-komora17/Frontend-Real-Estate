import {useState, useEffect} from "react"
import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore"
import heroImage from '../assets/bathroom1.jpg'

const ManageListings = () => {
   const [properties, setProperties] = useState([]);
   const [form, setForm] = useState({title: "", price: "", location: ""});

   const fetchRentals = async () => {
    const querySnapshot = await getDocs(collection(db, "rentals"));
    const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    setProperties(data);
   };

   const generateAIDescription = async (title) => {
    const descriptions = [
        `Experience luxury living at this ${title}, featuring modern amenities and breathtaking views.`,
        `A charming and spacious ${title} located in a prime neighborhood, perfect for families.`,
        `Modern elegance meets comfort in this stunning ${title}. A must-see!`,
    ];

    const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
    setForm({...form, description: randomDesc});
    return descriptions[Math.floor(Math.random() * descriptions.length)];
   }

   useEffect(() => {fetchRentals();}, []);

   const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "rentals"), form)
            setForm({title: "", price: "", location: ""});
            fetchRentals();
        } catch(error) {
            console.error("Save failed", error);
        }
    };
    
    return (
        <div className="p-8 bg-gray-50 min-h-screen" style={{backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <h1 className="text-2xl mb-6 text-white text-center">
                Property Listings  
                <button type = "button" onClick={() => generateAIDescription(form.title)} className="text-xs bg-purple-500  text-white px-2 py-1 rounded">Uliza...</button>  
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8 grid grid-cols-3 gap-4">
                <label htmlFor="">Property Title</label><br />
                <input className="border p-2 rounded" placeholder="Title" value = {form.title} 
                onChange={e => setForm({...form, title: e.target.value})} required/> 

                <label htmlFor="">Property Price</label> <br />
                <input className="border p-2 rounded" placeholder="Price" value = {form.price} 
                onChange={e => setForm({...form, price: e.target.value})} required/>  

                <button type="submit" className="bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                    Add listing
                </button>
            </form>
            <div className="bg-white rounded shadow">
                {properties.map(p => (
                    <div key ={p.id} className="p-4 border-b flex justify-between items-center">
                        <span className="font-medium">{p.title}</span>
                        <span className="text-green-600 font-bold">${p.price}</span>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default ManageListings;