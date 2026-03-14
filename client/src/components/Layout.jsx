import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-[#f8faff] text-gray-900 overflow-hidden font-sans">
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
        
        {/* Subfooter */}
        <div className="bg-white border-t border-gray-200 py-3 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500 font-medium gap-4">
            <p className="text-center md:text-left">© 2026 Ministry of Road Transport and Highways. All rights reserved.</p>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4 opacity-70 grayscale hover:grayscale-0 transition-all">
                  <img src="/DI.jpeg" className="h-6 w-auto" alt="Digital India" />
                  <img src="/MI.jpeg" className="h-6 w-auto" alt="Make in India" />
                  <img src="/NHAI.jpeg" className="h-6 w-auto" alt="NHAI" />
                </div>
                <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                <div className="flex space-x-4">
                    <Link to="/terms" className="hover:text-[#1a237e] transition-colors cursor-pointer">Terms</Link>
                    <Link to="/privacy" className="hover:text-[#1a237e] transition-colors cursor-pointer">Privacy</Link>
                    <span className="text-[#1a237e] font-bold tracking-tighter cursor-help">INDIA PORTAL</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
