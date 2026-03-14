import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchCoords, setSearchCoords] = useState(null); // { lat, lng, displayName }
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider 
      value={{ 
        searchCoords, 
        setSearchCoords,
        searchQuery,
        setSearchQuery
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
