import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Globe, Map, Users, Info, Scale, Gavel, BookOpen, Search, Filter } from 'lucide-react';

const PortalDetails = () => {
    const [activeSection, setActiveSection] = useState('rti');

    const sections = [
        { id: 'rti', title: 'RTI', icon: <Scale size={20} />, content: 'Right to Information (RTI) is an Act of the Parliament of India which sets out the rules and procedures regarding citizens\' right to information. Under the provisions of the Act, any citizen of India may request information from a "public authority" (a body of Government or "instrumentality of State") which is required to reply expeditiously or within thirty days.' },
        { id: 'charter', title: 'Citizen\'s Charter', icon: <BookOpen size={20} />, content: 'Our Citizen\'s Charter represents our commitment towards standard, quality and time frame of service delivery, grievance redress mechanism, transparency and accountability. We aim to provide a safe and pothole-free road network across the nation using AI-driven monitoring.' },
        { id: 'policies', title: 'Policies', icon: <Shield size={20} />, content: 'Hyperlinking Policy: Linkages to other websites are provided for citizens\' convenience. RoadVision is not responsible for the content and reliability of the linked websites.\n\nCopyright Policy: Material featured on this site may be reproduced free of charge after taking proper permission by sending a mail to us.' },
        { id: 'who', title: 'Who\'s Who', icon: <Users size={20} />, content: 'Nodal Officer: Shri A.K. Sharma, Joint Secretary (IT)\nEmail: nodal-portal@morth.gov.in\nPhone: +91-11-2371XXXX\n\nMinistry Head: Hon\'ble Minister of Road Transport and Highways.' },
        { id: 'tenders', title: 'Tenders & Reports', icon: <FileText size={20} />, content: 'Latest Tenders: [2026/NHAI/P3] - Maintenance of NH-44 Stretches.\nCirculars: Advisory on use of High-Performance Cold Mix for pothole repairs.\nAnnual Reports: Road Safety Performance Report 2025.' },
        { id: 'sitemap', title: 'Sitemap', icon: <Map size={20} />, content: 'Home | Dashboard | Map | Report | Settings | RTI | Citizen\'s Charter | Policies | Directory | Tenders | Help' }
    ];

    return (
        <div className="w-full min-h-screen bg-[#f8faff] p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-black text-[#1a237e] uppercase tracking-tighter mb-4">Portal Accountability</h1>
                    <div className="w-20 h-2 bg-[#ea580c] rounded-full mb-6 mx-auto md:mx-0"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Nav */}
                    <div className="lg:col-span-1 space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                                    activeSection === section.id 
                                    ? 'bg-[#1a237e] text-white shadow-xl shadow-blue-900/20 scale-105' 
                                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                                }`}
                            >
                                {section.icon}
                                <span>{section.title}</span>
                            </button>
                        ))}
                        
                        <a 
                            href="https://pgrams.gov.in" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-all"
                        >
                            <Globe size={20} />
                            <span>CPGRAMS Portal</span>
                        </a>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 min-h-[400px]"
                        >
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#1a237e]">
                                    {sections.find(s => s.id === activeSection)?.icon}
                                </div>
                                <h2 className="text-2xl font-black text-[#1a237e] uppercase tracking-tight">
                                    {sections.find(s => s.id === activeSection)?.title}
                                </h2>
                            </div>
                            
                            <div className="prose prose-blue max-w-none">
                                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line font-medium italic">
                                    {sections.find(s => s.id === activeSection)?.content}
                                </p>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Last Updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalDetails;
