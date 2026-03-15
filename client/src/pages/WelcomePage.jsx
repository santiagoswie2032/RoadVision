import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../hooks/useLanguage';

import { 
  BrainCircuit, 
  MapPin, 
  ClipboardList, 
  Activity, 
  Flame, 
  LayoutDashboard 
} from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { t, language } = useLanguage();

  const features = [
    { title: t('welcome.feature_ai'), icon: <BrainCircuit className="text-blue-600" size={32} /> },
    { title: t('welcome.feature_geo'), icon: <MapPin className="text-orange-600" size={32} /> },
    { title: t('welcome.feature_complaint'), icon: <ClipboardList className="text-green-600" size={32} /> },
    { title: t('welcome.feature_tracking'), icon: <Activity className="text-purple-600" size={32} /> },
    { title: t('welcome.feature_heatmap'), icon: <Flame className="text-red-600" size={32} /> },
    { title: t('welcome.feature_monitoring'), icon: <LayoutDashboard className="text-indigo-600" size={32} /> },
  ];

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
      scale: 0.9,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  const diLogo = "/DI.jpeg";
  const miLogo = "/MI.jpeg";
  const nhaiLogo = "/NHAI.jpeg";
  const ministryBanner = "/ministry.png";

  return (
    <div className={`w-full bg-white overflow-y-auto overflow-x-hidden flex flex-col ${language === 'hi' ? 'font-hi' : 'font-sans'}`}>
      <div className="flex-1 w-full flex flex-col items-center bg-[#f8faff] mt-6">
        <div className="w-full max-w-7xl px-4 md:px-8 py-4 md:py-8">
          {/* Main Content Area */}
          <div className="w-full">
            {/* National Banner - Static */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-[250px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border-4 border-white bg-[#1a237e]/5"
            >
              <img 
                src={ministryBanner} 
                alt="Portal Banner" 
                className="w-full h-full object-cover object-center"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1000&auto=format&fit=crop" }}
              />
              {/* Caption Overlay */}
              <div className="absolute bottom-10 left-10 right-10">
                 <div className="inline-block bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-lg">
                    <p className="text-[10px] md:text-xs font-black text-[#1a237e] uppercase tracking-[0.2em]">
                       {t('welcome.ministry')}
                    </p>
                 </div>
              </div>
            </motion.div>

            {/* Welcome Message & Action */}
            <div className="max-w-4xl mx-auto text-center mb-16 px-4">
              <h2 className="text-3xl md:text-5xl font-black text-[#1a237e] mb-6 leading-tight">
                {t('welcome.hero_title')}
              </h2>
              <div className="w-24 h-2 bg-[#ea580c] mx-auto mb-8 rounded-full"></div>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium italic mb-10 text-center">
                {t('welcome.hero_desc')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate(user ? '/dashboard' : '/login')}
                  className="w-full sm:w-auto px-10 py-5 bg-[#1a237e] text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-[#283593] shadow-2xl shadow-blue-900/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  {t('welcome.cta_dashboard')}
                  <span className="ml-3 font-serif">➔</span>
                </button>
                {!user && (
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full sm:w-auto px-10 py-5 bg-white text-[#1a237e] border-2 border-[#1a237e] rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-[#f8faff] transition-all flex items-center justify-center"
                    >
                        {t('welcome.cta_login')}
                    </button>
                )}
              </div>
            </div>

            {/* Impact Statistics Carousel Section */}
            <div className="w-full mb-20 text-left">
              <div className="flex flex-col mb-8 text-center md:text-left px-4">
                 <h3 className="text-xs md:text-sm font-black text-[#1a237e] uppercase tracking-[0.3em] mb-2">{t('welcome.impact_subtitle')}</h3>
                 <h2 className="text-2xl md:text-4xl font-black text-[#1a237e] uppercase tracking-tight">{t('welcome.impact_title')}</h2>
              </div>
              
              <div className="relative w-full overflow-hidden h-[350px] md:h-[400px]">
                {/* Background with Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-fixed"
                  style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=1000&auto=format&fit=crop")' }}
                >
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
                </div>

                {/* Marquee Container */}
                <div className="relative h-full flex items-center">
                  <motion.div 
                    className="flex whitespace-nowrap"
                    animate={{ x: [0, "-50%"] }}
                    transition={{ 
                      duration: 40, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                  >
                    {/* Double the cards for seamless loop */}
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="flex">
                        {(t('welcome.impact_slides', { returnObjects: true }) || []).map((stat, index) => (
                          <div 
                            key={index} 
                            className="w-[300px] md:w-[450px] mx-4 md:mx-6 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] flex flex-col justify-center whitespace-normal group hover:bg-white/20 transition-all cursor-default scale-95 hover:scale-100 text-left"
                          >
                             <div className="w-12 h-1 bg-[#ea580c] mb-4 rounded-full text-left"></div>
                             <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-4 leading-tight group-hover:text-orange-400 transition-colors text-left">
                               {stat.title}
                             </h4>
                             <p className="text-sm md:text-base text-gray-200 font-medium leading-relaxed italic border-l-2 border-white/30 pl-4 text-left">
                               {stat.text}
                             </p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-4">
                <h3 className="text-xs md:text-sm font-black text-[#1a237e] uppercase tracking-[0.3em]">{t('welcome.capabilities')}</h3>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase">{t('welcome.digital_india')}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-default group"
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                  >
                    <div className="w-16 h-16 bg-[#f0f2ff] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1a237e] transition-all duration-500 group-hover:rotate-6">
                      {React.cloneElement(feature.icon, { className: 'text-[#1a237e] group-hover:text-white transition-colors' })}
                    </div>
                    <h4 className="text-lg font-black text-[#1a237e] uppercase tracking-tight group-hover:text-[#ea580c] transition-colors">{feature.title}</h4>
                    <p className="text-sm text-gray-500 mt-3 font-medium leading-relaxed">{t('welcome.feature_desc_placeholder')}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Footer removed to avoid duplication with Layout */}
    </div>
  );
};

export default WelcomePage;
