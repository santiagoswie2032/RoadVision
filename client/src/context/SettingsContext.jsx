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

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved || 'medium';
  });

  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  useEffect(() => {
    localStorage.setItem('gpsEnabled', JSON.stringify(gpsEnabled));
  }, [gpsEnabled]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  return (
    <SettingsContext.Provider 
      value={{ 
        gpsEnabled, 
        setGpsEnabled, 
        notificationsEnabled, 
        setNotificationsEnabled,
        fontSize,
        setFontSize,
        dismissedAlerts,
        setDismissedAlerts
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
