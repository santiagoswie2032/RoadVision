import { useState, useContext } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { SettingsContext } from '../context/SettingsContext';
import { AuthContext } from '../context/AuthContext';
import { 
  Settings, 
  MapPin, 
  Bell, 
  User as UserIcon, 
  Lock, 
  Globe, 
  Shield, 
  AlertCircle,
  X,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  BadgeCheck,
  Building2,
  Mail
} from 'lucide-react';
import api from '../services/api';

const SettingsPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const { gpsEnabled, setGpsEnabled, notificationsEnabled, setNotificationsEnabled } = useContext(SettingsContext);
  const { user } = useContext(AuthContext);
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pinData, setPinData] = useState({ current: '', new: '', confirm: '' });
  const [pinStatus, setPinStatus] = useState({ loading: false, error: '', success: false });

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    if (pinData.new !== pinData.confirm) {
      return setPinStatus({ ...pinStatus, error: 'New PINs do not match' });
    }
    
    setPinStatus({ ...pinStatus, loading: true, error: '', success: false });
    try {
      await api.put('/auth/update-password', {
        currentPassword: pinData.current,
        newPassword: pinData.new
      });
      setPinStatus({ loading: false, error: '', success: true });
      setTimeout(() => {
        setShowPinModal(false);
        setPinStatus({ loading: false, error: '', success: false });
        setPinData({ current: '', new: '', confirm: '' });
      }, 2000);
    } catch (err) {
      setPinStatus({ 
        loading: false, 
        error: err.response?.data?.message || 'Failed to update PIN', 
        success: false 
      });
    }
  };

  const Toggle = ({ enabled, setEnabled, icon: Icon }) => (
    <button 
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-[#ea580c]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } flex items-center justify-center`}
      >
        {Icon && <Icon size={10} className={enabled ? 'text-[#ea580c]' : 'text-gray-400'} />}
      </span>
    </button>
  );

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Settings className="text-[#1a237e]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#1a237e] uppercase tracking-tight">{t('settings.title')}</h1>
          <p className="text-sm text-gray-500 font-medium">{t('settings.desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Appearance Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Globe size={20} />
            </div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">{t('settings.language')}</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-700">{t('settings.language')}</p>
                <p className="text-xs text-gray-500">{t('settings.language_desc')}</p>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1a237e] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="en">English (En)</option>
                <option value="hi">Hindi (हिन्दी)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy & GPS Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-50 rounded-xl text-orange-600">
              <MapPin size={20} />
            </div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">{t('settings.privacy')}</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-700">{t('settings.gps')}</p>
                <p className="text-xs text-gray-500">{t('settings.gps_desc')}</p>
              </div>
              <Toggle enabled={gpsEnabled} setEnabled={setGpsEnabled} icon={MapPin} />
            </div>

            <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-2xl border border-amber-100">
              <AlertCircle className="text-amber-600" size={16} />
              <p className="text-[10px] text-amber-700 font-bold leading-tight">
                {t('settings.gps_warning')}
              </p>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <Bell size={20} />
            </div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">{t('settings.intelligence')}</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-700">{t('settings.notifications')}</p>
                <p className="text-xs text-gray-500">{t('settings.notifications_desc')}</p>
              </div>
              <Toggle enabled={notificationsEnabled} setEnabled={setNotificationsEnabled} icon={Bell} />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-50 rounded-xl text-red-600">
              <Shield size={20} />
            </div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">{t('settings.security')}</h2>
          </div>
          
          <div className="space-y-4">
            <button 
                onClick={() => setShowPinModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3 text-left">
                <Lock size={16} className="text-gray-400 group-hover:text-blue-500" />
                <span className="text-sm font-bold text-gray-700">{t('settings.change_pin')}</span>
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase">{t('common.update')}</span>
            </button>
            <button 
                onClick={() => setShowProfileModal(true)}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3 text-left">
                <UserIcon size={16} className="text-gray-400 group-hover:text-blue-500" />
                <span className="text-sm font-bold text-gray-700">{t('settings.profile_verify')}</span>
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase">{t('common.verify')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PIN Update Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#1a237e] p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <KeyRound size={20} className="text-orange-400" />
                <h3 className="text-sm font-black uppercase tracking-widest">{t('settings.change_pin')}</h3>
              </div>
              <button 
                onClick={() => setShowPinModal(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                disabled={pinStatus.loading}
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleUpdatePin} className="p-8 space-y-5">
              {pinStatus.error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded flex items-center text-red-700 text-[10px] font-bold uppercase tracking-tight">
                  <ShieldAlert size={14} className="mr-2" />
                  {pinStatus.error}
                </div>
              )}
              {pinStatus.success && (
                <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded flex items-center text-green-700 text-[10px] font-bold uppercase tracking-tight">
                  <CheckCircle2 size={14} className="mr-2" />
                  PIN Updated Successfully
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Current Official PIN</label>
                <input 
                  type="password" 
                  value={pinData.current}
                  onChange={(e) => setPinData({...pinData, current: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1a237e]/10 focus:outline-none"
                  placeholder="••••••"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">New PIN</label>
                <input 
                  type="password" 
                  value={pinData.new}
                  onChange={(e) => setPinData({...pinData, new: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1a237e]/10 focus:outline-none"
                  placeholder="••••••"
                  required
                  minLength="6"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Confirm New PIN</label>
                <input 
                  type="password" 
                  value={pinData.confirm}
                  onChange={(e) => setPinData({...pinData, confirm: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#1a237e]/10 focus:outline-none"
                  placeholder="••••••"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={pinStatus.loading}
                className="w-full py-4 bg-[#1a237e] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {pinStatus.loading ? 'Processing...' : 'Securely Update PIN'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Authorization Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#1a237e] p-6 text-white text-center relative">
               <div className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer" onClick={() => setShowProfileModal(false)}>
                  <X size={20} />
               </div>
               <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 border-4 border-orange-500 p-1">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user?.name || 'Official'}&background=ea580c&color=fff`} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
               </div>
               <h3 className="text-lg font-black uppercase tracking-tight">{user?.name}</h3>
               <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em]">{user?.role} Authorized</p>
            </div>
            
            <div className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Status</p>
                    <div className="flex items-center space-x-1 text-green-600">
                       <BadgeCheck size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-tight">Active</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Verified</p>
                    <div className="flex items-center space-x-1 text-blue-600">
                       <CheckCircle2 size={14} />
                       <span className="text-[10px] font-bold uppercase tracking-tight">Identity</span>
                    </div>
                  </div>
               </div>

               <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#1a237e]">
                        <Mail size={18} />
                     </div>
                     <div className="text-left">
                        <p className="text-[8px] font-black text-gray-400 uppercase">Official Email</p>
                        <p className="text-xs font-bold text-gray-700">{user?.email}</p>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#ea580c]">
                        <Building2 size={18} />
                     </div>
                     <div className="text-left">
                        <p className="text-[8px] font-black text-gray-400 uppercase">Department</p>
                        <p className="text-xs font-bold text-gray-700">NHAI Surveillance Wing</p>
                     </div>
                  </div>
               </div>

               <button 
                onClick={() => setShowProfileModal(false)}
                className="w-full py-4 mt-4 bg-[#1a237e] text-white rounded-2xl font-black uppercase tracking-widest text-[10px]"
              >
                Close Official Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
