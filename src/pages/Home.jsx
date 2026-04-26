import React from 'react';
import { Link } from 'react-router-dom';
import image from '../assets/bathroom1.jpg';

function Home() {
  return (
    <div 
      className='relative min-h-screen flex items-center justify-center bg-cover bg-no-repeat bg-center ' 
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Dark Overlay for Depth */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Main Glass Container */}
      <div className="relative z-10 max-w-2xl w-full mx-4 my-20 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl text-center md:p-12">
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
          Welcome to <br />
          <span className='bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent'>
            Realty App
          </span>
        </h1>
        
        <p className="text-gray-200 text-lg md:text-xl mb-10 font-light tracking-wide max-w-md mx-auto">
          The next generation of real estate management. Seamlessly browse, book, and manage premium listings.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link 
            to="/login" 
            className="w-full md:w-48 bg-white text-blue-900 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
          >
            Sign In
          </Link> 
          
          <Link 
            to="/register" 
            className="w-full md:w-48 bg-blue-600/30 backdrop-blur-md text-white border border-white/30 font-bold px-8 py-4 rounded-2xl hover:bg-blue-600/50 transition-all transform hover:scale-105 shadow-xl"
          >
            Get Started
          </Link> 
        </div>

        {/* Subtle Footer Detail */}
        <div className="mt-12 flex justify-center gap-6 text-white/40 text-sm uppercase tracking-widest font-bold">
            <span>Modern</span>
            <span>•</span>
            <span>Secure</span>
            <span>•</span>
            <span>AI-Powered</span>
        </div>
      </div>
    </div>
  );
};

export default Home;