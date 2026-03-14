import React, { useState, useEffect } from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import axios from 'axios';

// Orchestrator service URL
const ORCHESTRATOR_URL = import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:8000';

const RoutePlanner = ({ start, end }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (start && start.lat && end && end.lat) {
      fetchRoute();
    }
  }, [start, end]);

  const fetchRoute = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${ORCHESTRATOR_URL}/v1/safe-route`, {
        start: [start.lat, start.lng],
        end: [end.lat, end.lng]
      });
      if (data.routes && data.routes.length > 0) {
        setRoutes(data.routes);
      }
    } catch (err) {
      console.error("Failed to sync with Road Health Intelligence Service:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'danger': return '#EF4444'; // Tactical Red
      case 'warning': return '#F97316'; // Warning Orange
      default: return '#22C55E'; // Safety Green
    }
  };

  if (!routes.length) return null;

  return (
    <>
      {routes.map((route) => 
        route.segments.map((seg, i) => (
          <Polyline
            key={`${route.id}-seg-${i}`}
            positions={seg.coords}
            pathOptions={{
              color: getRiskColor(seg.risk),
              weight: route.id === 'optimal-path' ? 8 : 4, // Make optimal route thicker
              opacity: route.id === 'optimal-path' ? 0.6 : 1, // Slightly transparent for mock route
              lineJoin: 'round',
              dashArray: seg.risk === 'danger' ? '1, 10' : (route.id === 'optimal-path' ? '5, 5' : null)
            }}
          >
            <Tooltip sticky>
              <div className="p-2 font-sans">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-1">
                  {route.name || 'Sector Analysis'}
                </p>
                <div className="flex items-center space-x-2">
                   <div className={`w-2 h-2 rounded-full ${seg.risk === 'danger' ? 'animate-pulse' : ''}`} style={{ backgroundColor: getRiskColor(seg.risk) }}></div>
                   <span className="text-xs font-black uppercase" style={{ color: getRiskColor(seg.risk) }}>{seg.risk} ZONE</span>
                </div>
                {route.id !== 'optimal-path' && (
                  <p className="text-[9px] font-bold text-gray-500 mt-1">Detected Defects: {seg.count}</p>
                )}
                {seg.risk === 'danger' && <p className="text-[8px] font-black text-red-600 uppercase mt-2 animate-bounce">Extreme Caution Advised</p>}
                {route.id === 'optimal-path' && <p className="text-[8px] font-black text-green-700 uppercase mt-2 italic">Recommended Safe Corridor</p>}
              </div>
            </Tooltip>
          </Polyline>
        ))
      )}
    </>
  );
};

export default RoutePlanner;
