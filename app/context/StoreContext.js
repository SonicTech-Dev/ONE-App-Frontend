import React, { createContext, useState, useEffect } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {

  const [primary, setPrimary] = useState('#966afd'); // default primary color
  const [secondary, setSecondary] = useState('#00a2c8'); // default primary color
  const [tertiary, setTertiary] = useState('#fff'); // default primary color
  const [background, setBackground] = useState('#fff'); // default primary color

  return (
    <StoreContext.Provider value={{ primary, secondary, tertiary, background, }}>
      {children}
    </StoreContext.Provider>
  );
};
