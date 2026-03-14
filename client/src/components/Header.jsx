import { Bell, Search, HelpCircle, Menu, X, Info, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import emblem from '../assets/emblem.jpeg';

const Header = ({ onMenuClick }) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/potholes');
      // Filter for unread high severity detections (simulating 'unread')
      const unread = data.filter(p => p.severityLevel === 'high' && p.status === 'reported');
      setNotifications(unread);
    } catch (err) {
      console.warn("Notification sync failed");
    }
  };

  return (
    <header className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
      <div className="flex items-center space-x-3 md:space-x-4">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex flex-col">
          <h1 className="text-sm md:text-xl font-extrabold text-[#1a237e] tracking-tight leading-tight uppercase">
             {t('header.title')}
          </h1>
          <div className="flex items-center mt-0.5 md:mt-1">
             <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-orange-500 mr-1.5 md:mr-2 animate-pulse"></div>
             <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.05em] md:tracking-[0.1em]">{t('header.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t('header.search')}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a237e]/20 focus:border-[#1a237e] w-48 xl:w-64 transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 md:space-x-3 md:border-l md:border-gray-200 md:pl-6 relative">
            <button 
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className={`p-1.5 md:p-2 hover:bg-gray-50 rounded-lg transition-all relative ${showNotifPanel ? 'text-[#1a237e] bg-blue-50' : 'text-gray-400'}`}
            >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                    {notifications.length}
                  </span>
                )}
            </button>

            {/* Notification Dropdown */}
            {showNotifPanel && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-50 bg-[#1a237e] text-white flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-widest">{t('header.alerts')}</h4>
                  <button onClick={() => setShowNotifPanel(false)}><X size={14} /></button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif, i) => (
                      <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 flex items-start space-x-3 cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="text-xs font-black text-gray-900 leading-tight uppercase">{t('header.critical_damage')}</p>
                          <p className="text-[10px] text-gray-500 mt-1 font-medium italic">NH-Series Coord: {notif.latitude.toFixed(2)}, {notif.longitude.toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-gray-50/50">
                      <Bell size={24} className="mx-auto text-gray-300 mb-3 opacity-50" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{t('header.no_alerts')}</p>
                      <p className="text-[9px] text-gray-400 mt-1 font-mono italic">{t('header.scan_status')}</p>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                  <button className="text-[9px] font-black text-[#1a237e] uppercase hover:underline">{t('header.view_all')}</button>
                </div>
              </div>
            )}

            <button 
              onClick={() => setShowHelpModal(true)}
              className="hidden sm:block p-1.5 md:p-2 text-gray-400 hover:text-[#1a237e] hover:bg-gray-50 rounded-lg transition-all"
            >
                <HelpCircle size={20} />
            </button>
            <div className="flex items-center ml-1 md:ml-2 bg-gray-50 border border-gray-200 px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-sm">
                <img 
                  src={emblem} 
                  alt="Emblem of India" 
                  className="h-6 md:h-8 w-auto block"
                  onError={(e) => { e.target.src = "https://mod.gov.in/sites/all/themes/mod/images/emblem-inner.png" }}
                />
            </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#1a237e] p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <HelpCircle size={24} className="text-orange-400" />
                <h3 className="text-lg font-black uppercase tracking-tight">{t('common.help_support')}</h3>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex space-x-4 p-4 bg-blue-50 rounded-2xl">
                  <div className="text-[#1a237e] font-black text-xl">01</div>
                  <div>
                    <h4 className="text-xs font-black text-[#1a237e] uppercase tracking-widest mb-1">Surveillance Map</h4>
                    <p className="text-[11px] text-gray-600 font-medium">Use the interactive map to visualize real-time road anomalies detected by mobile units.</p>
                  </div>
                </div>
                <div className="flex space-x-4 p-4 bg-orange-50 rounded-2xl">
                  <div className="text-[#ea580c] font-black text-xl">02</div>
                  <div>
                    <h4 className="text-xs font-black text-[#ea580c] uppercase tracking-widest mb-1">Incident Reporting</h4>
                    <p className="text-[11px] text-gray-600 font-medium">Found a defect? Use "File New Report" to instantly upload evidence with GPS tagging.</p>
                  </div>
                </div>
                <div className="flex space-x-4 p-4 bg-green-50 rounded-2xl">
                  <div className="text-green-700 font-black text-xl">03</div>
                  <div>
                    <h4 className="text-xs font-black text-green-700 uppercase tracking-widest mb-1">Analytics API</h4>
                    <p className="text-[11px] text-gray-600 font-medium">Export CSV reports from the dashboard for advanced geospatial analysis and auditing.</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-full py-4 bg-[#1a237e] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
