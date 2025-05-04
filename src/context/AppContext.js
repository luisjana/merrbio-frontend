import React, { createContext, useState } from 'react';

// Krijojmë një context bosh
export const AppContext = createContext();

// Krijojmë një provider që ruan dhe jep gjendjen
export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('sq');
  const [dark, setDark] = useState(false);

  return (
    <AppContext.Provider value={{ lang, setLang, dark, setDark }}>
      {children}
    </AppContext.Provider>
  );
};
