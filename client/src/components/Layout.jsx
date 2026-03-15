import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { SettingsContext } from '../context/SettingsContext';
import { ExternalLink, Users, Shield, BookOpen, Scale, Map, FileText, Activity } from 'lucide-react';

let hasIncremented = false; // Prevents double-counting in StrictMode

const Layout = ({ children }) => {
  const { fontSize, setFontSize } = useContext(SettingsContext);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    // Persistent reload counter
    const storedCount = parseInt(localStorage.getItem('site_reload_count') || '0');
    
    if (!hasIncremented) {
      const newCount = storedCount + 1;
      localStorage.setItem('site_reload_count', newCount.toString());
      setReloadCount(newCount);
      hasIncremented = true;
    } else {
      setReloadCount(storedCount);
    }
  }, []);

  const handleFontChange = (size) => {
    setFontSize(size);
  };

  return (
    <div className={`flex flex-col h-screen w-full bg-[#f8faff] text-gray-900 overflow-hidden font-sans`}>
      {/* 1. ACCESSIBILITY TOP BAR */}
      <div className="bg-[#1a237e] text-white py-1.5 px-4 md:px-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.15em] border-b border-white/10">
        <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
                <span className="text-white/60">Font Size:</span>
                <button onClick={() => handleFontChange('small')} className={`hover:text-orange-400 ${fontSize === 'small' ? 'text-orange-400 underline underline-offset-4' : ''}`}>A-</button>
                <button onClick={() => handleFontChange('medium')} className={`hover:text-orange-400 ${fontSize === 'medium' ? 'text-orange-400 underline underline-offset-4' : ''}`}>A</button>
                <button onClick={() => handleFontChange('large')} className={`hover:text-orange-400 ${fontSize === 'large' ? 'text-orange-400 underline underline-offset-4' : ''}`}>A+</button>
            </div>
        </div>
        
        <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-4 border-r border-white/20 pr-6">
                <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="flex items-center hover:text-orange-400 transition-colors">India.gov.in <ExternalLink size={10} className="ml-1" /></a>
                <a href="https://mygov.in" target="_blank" rel="noreferrer" className="flex items-center hover:text-orange-400 transition-colors">MyGov.in <ExternalLink size={10} className="ml-1" /></a>
            </div>
            <p className="flex items-center bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <Activity size={10} className="mr-2 text-orange-400" />
                Visitors: {reloadCount}
            </p>
        </div>
      </div>

      <Header />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
          
          {/* 2. COMPREHENSIVE GOVERNMENT FOOTER */}
          <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-4 md:px-8 w-full mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="flex flex-col space-y-6">
                        <div className="flex items-center space-x-4">
                            <img src="/emblem.jpeg" className="h-12 w-auto" alt="Emblem" />
                            <div className="border-l-2 border-gray-100 pl-4">
                                <p className="text-[10px] font-black text-[#1a237e] uppercase tracking-widest">Ministry of Road</p>
                                <p className="text-[10px] font-black text-[#1a237e] uppercase tracking-widest">Transport & Highways</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic pr-4">
                            Driving the future of Indian roads with AI and real-time surveillance for a safer, smoother nation.
                        </p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h4 className="text-[11px] font-black text-[#1a237e] uppercase tracking-[0.2em] mb-2 flex items-center">
                            <Scale size={14} className="mr-2 text-orange-500" /> Administrative
                        </h4>
                        <div className="flex flex-col space-y-2.5">
                            <Link to="/portal" className="text-[10px] font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors flex items-center"><span className="w-1 h-1 bg-orange-200 rounded-full mr-3"></span> RTI (Right to Information)</Link>
                            <Link to="/portal" className="text-[10px] font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors flex items-center"><span className="w-1 h-1 bg-orange-200 rounded-full mr-3"></span> Citizen's Charter</Link>
                            <Link to="/portal" className="text-[10px] font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors flex items-center"><span className="w-1 h-1 bg-orange-200 rounded-full mr-3"></span> Who's Who (Directory)</Link>
                            <Link to="/portal" className="text-[10px] font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors flex items-center"><span className="w-1 h-1 bg-orange-200 rounded-full mr-3"></span> Tenders & Circulars</Link>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h4 className="text-[11px] font-black text-[#1a237e] uppercase tracking-[0.2em] mb-2 flex items-center">
                            <Shield size={14} className="mr-2 text-orange-500" /> Compliance
                        </h4>
                        <div className="flex flex-col space-y-2.5">
                            <Link to="/portal" className="text-[10px] font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors flex items-center"><span className="w-1 h-1 bg-blue-100 rounded-full mr-3"></span> Hyperlinking Policy</Link>
                            <Link to="/portal" className="text-[10px] font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors flex items-center"><span className="w-1 h-1 bg-blue-100 rounded-full mr-3"></span> Copyright Policy</Link>
                            <Link to="/privacy" className="text-[10px] font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors flex items-center"><span className="w-1 h-1 bg-blue-100 rounded-full mr-3"></span> Privacy Policy</Link>
                            <Link to="/portal" className="text-[10px] font-bold text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors flex items-center"><span className="w-1 h-1 bg-blue-100 rounded-full mr-3"></span> Sitemap</Link>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h4 className="text-[11px] font-black text-[#1a237e] uppercase tracking-[0.2em] mb-2 flex items-center">
                            <Users size={14} className="mr-2 text-orange-500" /> Support
                        </h4>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <p className="text-[10px] font-black text-[#1a237e] uppercase tracking-widest mb-1">Nodal Officer Contact</p>
                            <p className="text-[9px] text-gray-500 font-bold mb-3 italic">Shri A.K. Sharma, JS(IT)</p>
                            <a href="https://pgportal.gov.in" target="_blank" className="block w-full py-2 bg-[#1a237e] text-white text-[9px] font-black uppercase tracking-widest text-center rounded-lg hover:bg-black transition-all">Submit Grievance (CPGRAMS)</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                             © 2026 RoadVision Portal. Content Managed by Ministry of Road Transport & Highways, Govt. of India.
                        </p>
                        <p className="text-[8px] font-medium text-gray-400 italic">
                             Last Updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 items-center bg-gray-50 px-6 py-4 rounded-[1.5rem] border border-gray-100">
                         <div className="flex flex-col items-center">
                            <img src="/DI.jpeg" className="h-5 w-auto object-contain opacity-70 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="NIC" />
                            <span className="text-[7px] font-black text-gray-400 mt-1 uppercase">NIC Hosted</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <img src="/MI.jpeg" className="h-5 w-auto object-contain opacity-70 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="STQC" />
                            <span className="text-[7px] font-black text-gray-400 mt-1 uppercase">STQC Certified</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <img src="/NHAI.jpeg" className="h-5 w-auto object-contain opacity-70 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Digital India" />
                            <span className="text-[7px] font-black text-gray-400 mt-1 uppercase">NHAI Initiative</span>
                         </div>
                    </div>
                </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
