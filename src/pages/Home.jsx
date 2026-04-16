import React from 'react'
import { Link } from 'react-router-dom'
import image from '../assets/bathroom1.jpg'

function Home() {
  return (
    <div className='p-10 text-center'style={{backgroundImage: `url(${image})`}}>
        <h1>
            Welcome to 
            <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Realty App </span>
        </h1>
        <div>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Login</Link> 
            <Link to="/register" className="bg-green text-white px-4 py-2">Register</Link> 
        </div>
    </div>
  );
};

export default Home;