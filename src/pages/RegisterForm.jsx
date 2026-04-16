import React, {useState} from 'react'
import {auth, db} from '../firebase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'; 

function RegisterForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                role: 'user',
                createdAt: new Date()
            });

            navigate('/dashboard');
        } catch(err) {
            setError(err.message);
        }
    }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <form onSubmit={handleRegister} className='p-8 bg-white shadow-md rounded-lg w-96'>
            <h2 className='text-2xl font-bold mb-4'>Create Account</h2>
             {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
            <input type="email" placeholder='komoradavid473@gmail.com' className='p-2 w-full mb-4 border rounded'
            onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" placeholder='password' className='p-2 w-full mb-4 border rounded'
            onChange={(e) => setEmail(e.target.value)} required/>
            <button type = 'submit' className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'>
                Register
            </button>
        </form>
    </div>
  )
}

export default RegisterForm