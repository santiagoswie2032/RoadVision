import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
  AlertTriangle,
  ShieldCheck,
  MapIcon as MapIconLucide,
  Layers,
  BarChart3,
  TrendingUp,
  PieChart,
  Clock3,
  Calendar,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import PotholeMap from '../components/PotholeMap';
import RoutePlanner from '../components/RoutePlanner';
import { useLanguage } from '../hooks/useLanguage';
import { SearchContext } from '../context/SearchContext';
import { SettingsContext } from '../context/SettingsContext';
import { X as CloseIcon, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // meters
};

const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Cancel current to avoid queueing
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
  }
};

const MapPage = () => {
  const { t } = useLanguage();
  const [potholes, setPotholes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLayers, setShowLayers] = useState(false);
  const [activeLayer, setActiveLayer] = useState('street'); // 'street', 'satellite', 'dark'
  const [isHealthView, setIsHealthView] = useState(false);

  // Real-time tracking state
  const [userPos, setUserPos] = useState(null);
  const [nearestPothole, setNearestPothole] = useState(null);
  const [lastAlertedId, setLastAlertedId] = useState(null);

  const { dismissedAlerts, setDismissedAlerts } = useContext(SettingsContext);

  const [searchParams] = useSearchParams();
  const { setSearchCoords } = useContext(SearchContext);

  useEffect(() => {
    fetchPotholes();

    // Check for Deep Link coordinates
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    if (lat && lng) {
      setSearchCoords({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        displayName: `Located: ${lat}, ${lng}`
      });
    }

    // Start real-time position stalking for proximity alerts
    let watchId = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserPos({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => console.warn("GPS tracking error:", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [searchParams, setSearchCoords]);

  // Proximity Logic Engine
  useEffect(() => {
    if (!userPos || potholes.length === 0) return;

    let closest = null;
    let minDistance = Infinity;

    potholes.forEach(p => {
      if (p.status === 'fixed' || dismissedAlerts.includes(p._id)) return; // Don't alert for fixed or dismissed holes
      const dist = calculateDistance(userPos.lat, userPos.lng, p.latitude, p.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closest = { ...p, distance: dist };
      }
    });

    // Alert if within 200m
    if (closest && closest.distance <= 200) {
      setNearestPothole(closest);

      // Voice warning if it's a "new" proximity alert
      if (closest._id !== lastAlertedId) {
        speak("Warning, road defect detected ahead. Extreme caution advised.");
        setLastAlertedId(closest._id);
      }
    } else {
      setNearestPothole(null);
    }
  }, [userPos, potholes, lastAlertedId, dismissedAlerts]);

  const fetchPotholes = async () => {
    try {
      const { data } = await api.get('/potholes');
      setPotholes(data);
    } catch (err) {
      setError('Communication sync failure with central database.');
    } finally {
      setLoading(false);
    }
  };

  const [navigationTarget, setNavigationTarget] = useState(null);

  const handleNavigate = (p) => {
    setNavigationTarget({ lat: p.latitude, lng: p.longitude });
    // Scroll to map if needed
    const mapElement = document.getElementById('main-map-container');
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Analytics Helpers
  const getSeverityData = () => {
    const counts = { high: 0, medium: 0, low: 0 };
    potholes.forEach(p => counts[p.severityLevel]++);
    return {
      labels: [t('map.critical'), t('map.moderate'), t('map.minor')],
      datasets: [{
        label: t('dashboard.stats_detected'),
        data: [counts.high, counts.medium, counts.low],
        backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(34, 197, 94, 0.8)'],
        borderColor: ['rgb(239, 68, 68)', 'rgb(249, 115, 22)', 'rgb(34, 197, 94)'],
        borderWidth: 1,
        borderRadius: 8,
      }]
    };
  };

  const getStatusData = () => {
    const counts = { reported: 0, under_repair: 0, fixed: 0 };
    potholes.forEach(p => counts[p.status]++);
    return {
      labels: [t('dashboard.status_reported'), t('dashboard.status_repairing'), t('dashboard.status_fixed')],
      datasets: [{
        data: [counts.reported, counts.under_repair, counts.fixed],
        backgroundColor: ['rgba(30, 58, 138, 0.7)', 'rgba(249, 115, 22, 0.7)', 'rgba(34, 197, 94, 0.7)'],
        borderColor: ['#ffffff'],
        borderWidth: 2,
      }]
    };
  };

  const getTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const counts = last7Days.map(date => potholes.filter(p => p.detectedAt?.startsWith(date)).length);

    return {
      labels: last7Days.map(d => new Date(d).toLocaleDateString(undefined, { weekday: 'short' })),
      datasets: [{
        label: t('dashboard.stats_detected'),
        data: counts,
        fill: true,
        borderColor: '#1a237e',
        backgroundColor: 'rgba(26, 35, 126, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#1a237e',
      }]
    };
  };

  return (
    <div className="p-4 md:p-8 flex flex-col overflow-y-auto text-left min-h-screen scroll-smooth relative">

      {/* Real-time Proximity Alert Overlay */}
      {nearestPothole && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[2000] w-[90%] max-w-lg animate-in slide-in-from-top-10 duration-500">
           <div className="bg-[#1a237e] text-white p-4 md:p-6 rounded-[2rem] shadow-2xl border-4 border-orange-500 flex items-center justify-between group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent pointer-events-none"></div>

              <div className="flex items-center space-x-4 relative z-10">
                 <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center animate-pulse shrink-0">
                    <AlertTriangle size={24} className="text-white" />
                 </div>
                 <div className="text-left pr-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400 mb-0.5">Tactical Alert</p>
                    <h3 className="text-sm md:text-base font-black italic uppercase leading-tight">Defect Detected Ahead</h3>
                    <p className="text-[11px] font-bold text-white/70">Approximately <span className="text-white text-sm">{nearestPothole.distance.toFixed(0)}</span> meters away</p>
                 </div>
              </div>

              <div className="flex flex-col space-y-2 relative z-10">
                <button
                  onClick={() => handleNavigate(nearestPothole)}
                  className="bg-white text-[#1a237e] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-lg active:scale-95 flex items-center"
                >
                  Navigate <MapPin size={12} className="ml-1.5" />
                </button>
              </div>

              {/* Dismiss Button */}
              <button 
                onClick={() => setDismissedAlerts(prev => [...prev, nearestPothole._id])}
                className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-20 group-hover:scale-110"
                title="Dismiss Alert"
              >
                <CloseIcon size={16} />
              </button>
           </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 md:mb-8 space-y-4 lg:space-y-0 text-left">
        <div>
          <div className="flex items-center space-x-2 text-[#1a237e] mb-1">
             <MapIconLucide size={20} className="md:w-6 md:h-6" />
             <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">{t('nav.map')}</h1>
          </div>
          <p className="text-[10px] md:text-sm text-gray-500 font-medium italic">{t('map.surveillance_desc')}</p>
        </div>

        <div className="flex items-center justify-between md:justify-end space-x-3 w-full lg:w-auto">
           <div className="flex flex-col items-start md:items-end md:border-r border-gray-200 md:pr-4 md:mr-1">
              <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{t('map.live_feed')}</span>
              <span className="text-[10px] md:text-xs font-black text-green-600 flex items-center">
                 <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-bounce"></span>
                 {t('map.active')}
              </span>
           </div>
           <div className="relative">
             <button
               onClick={() => setShowLayers(!showLayers)}
               className={`flex items-center space-x-2 border px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-sm font-bold transition-all shadow-sm ${showLayers ? 'bg-[#1a237e] text-white border-[#1a237e]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
             >
                <Layers size={14} />
                <span className="hidden sm:inline uppercase tracking-widest">{t('map.layers')}</span>
                <span className="sm:hidden">{t('map.layers')}</span>
             </button>

             {showLayers && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-[1100] overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-2 border-b border-gray-50 bg-gray-50/50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{t('map.layers')}</span>
                  </div>
                  <div className="p-1">
                    {[
                      { id: 'street', label: t('map.view_street'), icon: '🛣️' },
                      { id: 'satellite', label: t('map.view_satellite'), icon: '🛰️' },
                      { id: 'dark', label: t('map.view_dark'), icon: '🌙' },
                    ].map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => {
                          setActiveLayer(layer.id);
                          setShowLayers(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${activeLayer === layer.id ? 'bg-blue-50 text-[#1a237e]' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{layer.icon}</span>
                          {layer.label}
                        </div>
                        {activeLayer === layer.id && <div className="w-1.5 h-1.5 bg-[#1a237e] rounded-full"></div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
           </div>

           {/* Road Health Toggle */}
           <button
             onClick={() => setIsHealthView(!isHealthView)}
             className={`flex items-center space-x-2 border px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-sm font-bold transition-all shadow-sm ${isHealthView ? 'bg-red-600 text-white border-red-600 animate-pulse' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
           >
              <Activity size={14} />
              <span className="hidden sm:inline uppercase tracking-widest">{isHealthView ? 'Exit Health View' : 'Road Health'}</span>
              <span className="sm:hidden">Health</span>
           </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center text-red-700">
          <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="font-bold text-xs md:text-sm tracking-tight">{error}</p>
        </div>
      )}

      {/* Map Container */}
      <div id="main-map-container" className="h-[500px] mb-8 relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 shrink-0">
        {loading ? (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                   <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-[#1a237e] border-t-transparent mb-4"></div>
                   <p className="text-[10px] md:text-sm font-black text-[#1a237e] tracking-widest animate-pulse uppercase">{t('common.loading')}</p>
                </div>
             </div>
        ) : (
            <div className="relative h-full w-full">
               <PotholeMap 
                 potholes={potholes} 
                 activeLayer={activeLayer} 
                 nearestPotholeId={nearestPothole?._id} 
                 userLocation={userPos} 
                 showMarkers={!isHealthView}
                 navigationTarget={navigationTarget}
                 onNavigationCleared={() => setNavigationTarget(null)}
                 setNavigationTarget={setNavigationTarget}
               >
                 {isHealthView && userPos && (
                   <RoutePlanner 
                     start={userPos} 
                     end={searchCoords || { lat: userPos.lat + 0.05, lng: userPos.lng + 0.05 }} 
                   />
                 )}
               </PotholeMap>

               {/* Road Health Legend Overlay */}
               {isHealthView && (
                 <div className="absolute top-4 right-16 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border-2 border-red-500/20 max-w-[180px] animate-in slide-in-from-right duration-500">
                    <div className="flex items-center space-x-2 mb-3 border-b border-gray-100 pb-2">
                       <Activity size={12} className="text-red-500" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-[#1a237e]">Road Health Index</span>
                    </div>
                    <div className="space-y-2.5">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                             <div className="w-4 h-1 bg-green-500 rounded-full"></div>
                             <span className="text-[8px] font-black text-gray-500 uppercase">Optimal</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                             <div className="w-4 h-1 bg-orange-500 rounded-full"></div>
                             <span className="text-[8px] font-black text-gray-500 uppercase">Caution</span>
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                             <div className="w-4 h-1 bg-red-600 rounded-full animate-pulse"></div>
                             <span className="text-[8px] font-black text-gray-500 uppercase">Critical</span>
                          </div>
                       </div>
                    </div>
                    <p className="mt-3 text-[7px] font-bold text-gray-400 italic">
                       * Segmented analysis (20m Proximity).
                    </p>
                 </div>
               )}
            </div>
        )}
      </div>

      {/* Real Intelligence Analytics Section */}
      {loading ? (
         <div className="py-20 flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm rounded-[2rem] border border-dashed border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mb-4"></div>
            <p className="text-[10px] font-black text-[#1a237e] uppercase tracking-widest italic animate-pulse">Syncing Intelligence Metrics...</p>
         </div>
      ) : (
         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 pb-20">
            <div className="flex items-center space-x-3 mb-6">
               <BarChart3 className="text-orange-500" size={24} />
               <h2 className="text-xl font-black text-[#1a237e] uppercase tracking-tight">Geospatial Intelligence Analytics</h2>
               <div className="h-px flex-1 bg-gray-100 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Intensity Distribution */}
               <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center space-x-3 mb-6">
                     <div className="p-2 bg-red-50 rounded-xl text-red-600"><AlertTriangle size={18} /></div>
                     <h3 className="font-black text-[#1a237e] uppercase text-xs tracking-widest">Structural Risk Profile</h3>
                  </div>
                  <div className="h-[250px]">
                     <Bar
                        data={getSeverityData()}
                        options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
                        }}
                     />
                  </div>
               </div>

               {/* Resolution Metrics */}
               <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center space-x-3 mb-6">
                     <div className="p-2 bg-blue-50 rounded-xl text-[#1a237e]"><PieChart size={18} /></div>
                     <h3 className="font-black text-[#1a237e] uppercase text-xs tracking-widest">Resolution Cycle Efficiency</h3>
                  </div>
                  <div className="h-[250px]">
                     <Doughnut
                        data={getStatusData()}
                        options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'right', labels: { boxWidth: 10, font: { weight: 'bold' } } } }
                        }}
                     />
                  </div>
               </div>

               {/* Incident Trend */}
               <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center space-x-3 mb-6">
                     <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><TrendingUp size={18} /></div>
                     <h3 className="font-black text-[#1a237e] uppercase text-xs tracking-widest">Defect Occurrence Trend (Real-time)</h3>
                  </div>
                  <div className="h-[300px]">
                     <Line
                        data={getTrendData()}
                        options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
                        }}
                     />
                  </div>
               </div>
            </div>

            {/* Mini Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { label: 'Active Detections', value: potholes.filter(p => p.status !== 'fixed').length, icon: <MapPin size={16}/>, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'AI Accuracy Avg', value: potholes.length ? (potholes.reduce((a,b)=>a+b.detectionConfidence,0)/potholes.length*100).toFixed(1)+'%' : '0%', icon: <ShieldCheck size={16}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Live Units', value: '04', icon: <TrendingUp size={16}/>, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'System Health', value: '100%', icon: <CheckCircle2 size={16}/>, color: 'text-green-600', bg: 'bg-green-50' },
               ].map((s, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3 group hover:scale-105 transition-all">
                     <div className={`p-2 rounded-lg ${s.bg} ${s.color} group-hover:rotate-12 transition-transform`}>{s.icon}</div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                        <p className="text-sm font-black text-[#1a237e]">{s.value}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default MapPage;
