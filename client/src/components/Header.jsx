import { 
  Bell, 
  Search, 
  HelpCircle, 
  Menu, 
  X, 
  Info, 
  AlertTriangle,
  LayoutDashboard, 
  Map, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  Home,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import { SettingsContext } from '../context/SettingsContext';
import { SearchContext } from '../context/SearchContext';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { notificationsEnabled } = useContext(SettingsContext);
  const { searchQuery, setSearchQuery, setSearchCoords } = useContext(SearchContext);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (notificationsEnabled) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [notificationsEnabled]);

  const handleSearch = async (e) => {
    if (e.key !== 'Enter' || !searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setSearchCoords({ lat: parseFloat(lat), lng: parseFloat(lon), displayName: display_name });
        if (location.pathname !== '/map') navigate('/map');
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/potholes');
      const recentHighSeverity = data
        .filter(p => p.severityLevel === 'high' && p.status === 'reported')
        .sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));
      setNotifications(recentHighSeverity);
    } catch (err) {
      console.warn("Notification sync failed");
    }
  };

  const navItems = [
    { title: t('nav.home'), icon: <Home size={18} />, path: '/' },
    { title: t('nav.dashboard'), icon: <LayoutDashboard size={18} />, path: '/dashboard' },
    { title: t('nav.map'), icon: <Map size={18} />, path: '/map' },
    { title: t('nav.report'), icon: <FileText size={18} />, path: '/report' },
    { title: t('nav.analytics'), icon: <BarChart3 size={18} />, path: '/analytics' },
    { title: t('nav.settings'), icon: <Settings size={18} />, path: '/settings' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[100] shadow-md">
      {/* Top Bar: Ministry and Title */}
      <div className="h-20 md:h-24 flex items-center justify-between px-4 md:px-8 border-b border-gray-50 bg-[#fff]">
        {/* Left: Global Government Branding */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center space-x-4">
             <img src="/emblem.jpeg" className="h-12 md:h-16 w-auto object-contain" alt="Emblem" />
             <div className="flex flex-col border-l-2 border-gray-100 pl-4 hidden md:flex">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">Government of India</p>
                <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">Ministry of Road Transport and Highways</p>
             </div>
          </div>
        </div>

        {/* Center: System Title */}
        <div className="flex-1 flex justify-center px-4">
           <h1 className="text-xl md:text-3xl lg:text-4xl font-black text-[#1a237e] tracking-tighter uppercase text-center drop-shadow-sm">
             {t('header.title')}
           </h1>
        </div>

        {/* Right: Global Actions & PM Portrait */}
        <div className="flex items-center space-x-3 md:space-x-6">
          <div className="relative hidden xl:block">
            {isSearching ? (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 animate-spin w-4 h-4 border-2 border-[#1a237e] border-t-transparent rounded-full"></div>
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            )}
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder={t('header.search')}
              className="pl-10 pr-4 py-2.5 border border-gray-100 rounded-2xl bg-gray-50 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#1a237e]/5 focus:border-[#1a237e]/30 w-48 xl:w-64 transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                  onClick={() => setShowNotifPanel(!showNotifPanel)}
                  className={`p-2.5 hover:bg-gray-50 rounded-xl transition-all relative ${showNotifPanel ? 'text-[#1a237e] bg-blue-50' : 'text-gray-400'}`}
              >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-red-600 text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white text-white animate-bounce">
                      {notifications.length}
                    </span>
                  )}
              </button>

              <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-gray-100 group cursor-pointer relative">
                <div className="w-9 h-9 rounded-xl bg-[#1a237e] border-2 border-orange-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <span className="text-xs font-black text-white uppercase tracking-tighter">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'O'}
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-[#1a237e] uppercase leading-none truncate w-24">
                    {user?.name || t('common.officer')}
                  </span>
                  <span className="text-[9px] font-bold text-orange-500 uppercase leading-none mt-1 opacity-70">
                    {user?.role === 'admin' ? 'Administrator' : 'Field Officer'}
                  </span>
                </div>
                <div 
                   onClick={logout}
                   className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ml-1"
                   title="Logout"
                >
                  <LogOut size={18} />
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Horizontal */}
      <nav className="hidden lg:flex items-center px-8 bg-gray-50/50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2.5 px-6 py-4.5 border-b-4 transition-all hover:bg-white/80 group ${
                isActive 
                  ? 'border-[#1a237e] text-[#1a237e] bg-white' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 group-hover:border-gray-200'
              }`}
            >
              <span className={`${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {item.icon}
              </span>
              <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-[#1a237e]' : 'text-gray-500'}`}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
           <div className="absolute top-0 left-0 bottom-0 w-80 bg-[#1a237e] shadow-2xl flex flex-col animate-in slide-in-from-left duration-500">
              <div className="p-8 border-b border-white/10 flex flex-col items-center">
                 <div className="w-24 h-24 bg-white rounded-full p-2 mb-4 shadow-xl">
                   <img src="/NHAI.jpeg" className="w-full h-full object-contain" alt="NHAI" />
                 </div>
                 <h2 className="text-sm font-black text-white uppercase tracking-widest">{t('common.officer')} {t('common.portal')}</h2>
                 <p className="text-[10px] text-white/50 uppercase mt-1">Government of India</p>
                 <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-6 right-6 p-2 text-white/50 hover:text-white"
                 >
                   <X size={24} />
                 </button>
              </div>
              
              <div className="flex-1 py-8 overflow-y-auto">
                 {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-4 px-8 py-4 transition-all ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                      >
                         <span className={isActive ? 'text-orange-500' : ''}>{item.icon}</span>
                         <span className="text-xs font-black uppercase tracking-widest">{item.title}</span>
                      </Link>
                    )
                 })}
              </div>

              <div className="p-8 border-t border-white/10">
                  <div className="flex items-center space-x-4 mb-6">
                    <img src="/placeholder-user.png" className="w-10 h-10 rounded-xl border-2 border-orange-500" alt="User" />
                    <div>
                      <p className="text-xs font-black text-white uppercase">{user?.name || 'Officer'}</p>
                      <p className="text-[10px] text-orange-400 font-bold opacity-70">Administrator</p>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl flex items-center justify-center space-x-2 transition-all"
                  >
                    <LogOut size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Logout Portal</span>
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* Notification Panel and Modal - Kept the same logic as original but visually updated */}
      {showNotifPanel && (
        <div className="absolute right-4 md:right-8 top-[calc(100%-8px)] w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-[120] overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="p-5 bg-[#1a237e] text-white flex justify-between items-center">
            <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center">
              <AlertTriangle size={14} className="mr-2 text-orange-400" />
              Surveillance Alerts
            </h4>
            <button onClick={() => setShowNotifPanel(false)} className="hover:rotate-90 transition-transform"><X size={16} /></button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif, i) => (
                <div key={i} className="p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start space-x-4 group cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shadow-[0_0_8px_rgba(239,68,68,0.5)] group-hover:scale-125 transition-transform shrink-0"></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-900 uppercase leading-none mb-1">Critical Road Defect</p>
                    <p className="text-[9px] text-gray-500 font-medium italic opacity-80">NH Coord: {notif.latitude.toFixed(4)}, {notif.longitude.toFixed(4)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center">
                <Bell size={32} className="mx-auto text-gray-200 mb-4 opacity-50" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Active Alerts</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
            <button 
              onClick={() => {navigate('/map'); setShowNotifPanel(false)}}
              className="text-[10px] font-black text-[#1a237e] uppercase tracking-wide hover:underline"
            >
              Enter Monitoring Map
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0a0e1a]/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/20 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#1a237e] p-8 text-white relative">
              <div className="absolute top-0 right-0 p-12 opacity-10"><HelpCircle size={150} /></div>
              <div className="relative z-10 flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20"><HelpCircle size={28} className="text-orange-400" /></div>
                <h3 className="text-xl font-black uppercase tracking-tight italic">NHAI Intelligence Support</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors z-20"><X size={20} /></button>
            </div>
            <div className="p-10 space-y-8 bg-white">
              {[
                { n: '01', t: 'Geospatial Dashboard', d: 'Analyze nationwide road health indices and deployment strategies.', c: 'bg-indigo-50 text-indigo-700' },
                { n: '02', t: 'Real-time Reporting', d: 'Securely transmit high-severity road defect evidence with ML metadata.', c: 'bg-orange-50 text-orange-700' },
                { n: '03', t: 'Authority Protocols', d: 'Automated email dispatch for cross-departmental coordination.', c: 'bg-emerald-50 text-emerald-700' }
              ].map((item, i) => (
                <div key={i} className="flex space-x-6">
                  <div className={`w-14 h-14 rounded-[1.25rem] ${item.c} flex items-center justify-center text-xl font-black shrink-0 shadow-sm underline underline-offset-4`}>{item.n}</div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-1.5">{item.t}</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">{item.d}</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setShowHelpModal(false)}
                className="w-full py-5 bg-[#1a237e] text-orange-400 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all mt-4 italic shadow-[#1a237e]/30"
              >
                Protocol Confirmed
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
