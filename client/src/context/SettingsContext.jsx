import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [gpsEnabled, setGpsEnabled] = useState(() => {
    const saved = localStorage.getItem('gpsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  useEffect(() => {
    localStorage.setItem('gpsEnabled', JSON.stringify(gpsEnabled));
  }, [gpsEnabled]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  return (
    <SettingsContext.Provider 
      value={{ 
        gpsEnabled, 
        setGpsEnabled, 
        notificationsEnabled, 
        setNotificationsEnabled,
        dismissedAlerts,
        setDismissedAlerts
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
