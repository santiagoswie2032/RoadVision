import React from 'react';
import { Shield, Lock, Eye, FileText, Bell, Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-[#1a237e] p-8 md:p-12 text-white relative">
          <div className="flex items-center space-x-4 mb-4">
             <Shield className="w-10 h-10 text-orange-400" />
             <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Privacy Policy</h1>
          </div>
          <p className="text-blue-100 font-medium opacity-80 uppercase tracking-widest text-xs md:text-sm">
            Official Portal of National Highway AI Monitoring (RoadVision)
          </p>
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Globe size={120} />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-10">
          <section>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-1.5 h-6 bg-[#ea580c] rounded-full"></div>
               <h2 className="text-xl font-black text-[#1a237e] uppercase">1. Introduction</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              The National Highway AI Monitoring Portal (RoadVision) is committed to protecting the privacy of its users and the integrity of national infrastructure data. This Privacy Policy outlines our practices regarding the collection, use, and safeguarding of information within our AI-powered surveillance network.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-1.5 h-6 bg-[#ea580c] rounded-full"></div>
               <h2 className="text-xl font-black text-[#1a237e] uppercase">2. Information Collection</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center space-x-3 mb-3">
                     <Lock className="text-blue-600" size={20} />
                     <h3 className="font-black text-[#1a237e] uppercase text-sm">Security Data</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-bold leading-loose">
                    We collect official ID, access PINs, and biometric verification data only for authorized government personnel to ensure portal security.
                  </p>
               </div>
               <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="flex items-center space-x-3 mb-3">
                     <Eye className="text-orange-600" size={20} />
                     <h3 className="font-black text-[#1a237e] uppercase text-sm">Surveillance Data</h3>
                  </div>
                  <p className="text-xs text-gray-500 font-bold leading-loose">
                    Real-time image captures and GPS coordinates are processed by our AI algorithms to identify road defects. This data is geofenced within Indian territories.
                  </p>
               </div>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-1.5 h-6 bg-[#ea580c] rounded-full"></div>
               <h2 className="text-xl font-black text-[#1a237e] uppercase">3. Data Usage & Sharing</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium mb-4">
              Data collected is used exclusively for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-500 font-bold text-sm">
              <li>Automating maintenance requests and repair workflows.</li>
              <li>Geospatial risk analysis and highway safety improvements.</li>
              <li>Official reporting to the Ministry of Road Transport and Highways.</li>
            </ul>
            <p className="text-gray-400 text-xs mt-4 italic">Note: No data is shared with private third-party entities for commercial purposes.</p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-1.5 h-6 bg-[#ea580c] rounded-full"></div>
               <h2 className="text-xl font-black text-[#1a237e] uppercase">4. Security Measures</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              We employ state-of-the-art encryption protocols (AES-256) for data at rest and TLS 1.3 for data in transit. All surveillance feeds are isolated within a dedicated government Virtual Private Cloud (VPC).
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">
              Last Updated: March 2026<br/>
              Ministry of Road Transport and Highways
           </p>
           <button 
             onClick={() => window.print()}
             className="flex items-center space-x-2 bg-white border border-gray-200 px-6 py-2.5 rounded-xl text-xs font-black text-[#1a237e] hover:bg-gray-100 transition-all uppercase tracking-widest shadow-sm"
           >
              <FileText size={16} />
              <span>Download Official PDF</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
