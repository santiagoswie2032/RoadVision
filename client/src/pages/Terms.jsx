import React from 'react';
import { Gavel, Scale, FileWarning, CheckCircle, HelpCircle, Globe } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-[#1a237e] p-8 md:p-12 text-white relative">
          <div className="flex items-center space-x-4 mb-4">
             <Gavel className="w-10 h-10 text-orange-400" />
             <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Terms of Use</h1>
          </div>
          <p className="text-blue-100 font-medium opacity-80 uppercase tracking-widest text-xs md:text-sm">
            Service Definitions and Legal Framework for Portal Access
          </p>
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Scale size={120} />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-10">
          <section>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-1.5 h-6 bg-[#ea580c] rounded-full"></div>
               <h2 className="text-xl font-black text-[#1a237e] uppercase">1. Legal Agreement</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              By accessing the National Highway AI Monitoring Portal, you agree to be bound by these Terms of Use and all applicable laws and regulations of the Government of India. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-1.5 h-6 bg-[#ea580c] rounded-full"></div>
               <h2 className="text-xl font-black text-[#1a237e] uppercase">2. Use License</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center space-x-3 mb-3">
                     <FileWarning className="text-red-600" size={20} />
                     <h3 className="font-black text-[#1a237e] uppercase text-sm">Prohibited Actions</h3>
                  </div>
                  <ul className="text-[10px] text-gray-500 font-bold leading-loose list-disc pl-4">
                    <li>Attempting to decompile or reverse engineer any software contained on the portal.</li>
                    <li>Removing any copyright or other proprietary notations from the intelligence data.</li>
                    <li>Transferring surveillance data to any unauthorized personnel.</li>
                  </ul>
               </div>
               <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                  <div className="flex items-center space-x-3 mb-3">
                     <CheckCircle className="text-green-600" size={20} />
                     <h3 className="font-black text-[#1a237e] uppercase text-sm">Authorized Use</h3>
                  </div>
                  <ul className="text-[10px] text-gray-500 font-bold leading-loose list-disc pl-4">
                    <li>Using detections for official road maintenance and restoration purposes.</li>
                    <li>Generating analytical reports for infrastructure safety assessment.</li>
                    <li>Coordinating between designated government departments.</li>
                  </ul>
               </div>
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-1.5 h-6 bg-[#ea580c] rounded-full"></div>
               <h2 className="text-xl font-black text-[#1a237e] uppercase">3. Disclaimer</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              The materials on the National Highway AI Monitoring Portal are provided on an 'as is' basis. While our AI systems achieve high accuracy, the Ministry of Road Transport and Highways (MoRTH) makes no absolute warranties regarding the 100% correctness of automated detections without human verification.
            </p>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-4">
               <div className="w-1.5 h-6 bg-[#ea580c] rounded-full"></div>
               <h2 className="text-xl font-black text-[#1a237e] uppercase">4. Governing Law</h2>
            </div>
            <p className="text-gray-600 leading-relaxed font-medium">
              These terms and conditions are governed by and construed in accordance with the Information Technology Act, 2000 and other relevant laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in New Delhi.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">
              © 2026 National Highways Authority of India (NHAI)<br/>
              Ministry of Road Transport and Highways
           </p>
           <div className="flex items-center space-x-2 text-xs font-black text-[#1a237e] uppercase tracking-widest">
              <HelpCircle size={16} className="text-orange-500" />
              <span>Technical Support: support.nhai@nic.in</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
