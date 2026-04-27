import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full py-10 bg-black/50 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-[10px] uppercase tracking-[0.2em] text-white/90 font-semibold">
          <p className="whitespace-nowrap">© 2026 REALTYAPP </p>
          <div className="hidden md:block h-3 w-[1px] bg-white/10"></div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-blue-400 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;