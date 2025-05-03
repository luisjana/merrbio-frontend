import React, { createContext, useState } from 'react';

// Krijojmë një context bosh
export const AppContext = createContext();

// Krijojmë një provider që ruan dhe shpërndan gjendjen globale
export const AppProvider = ({ children }) => {
  const [lang, setLang] = useState('sq');      // Gjuha default: shqip
  const [dark, setDark] = useState(false);     // Dark mode default: false

  // Funksion për të ndërruar gjuhën
  const toggleLang = () => {
    setLang((prev) => (prev === 'sq' ? 'en' : 'sq'));
  };

  // Funksion për të ndërruar dark/light mode
  const toggleDark = () => {
    setDark((prev) => !prev);
  };

  return (
    <AppContext.Provider value={{ lang, setLang, toggleLang, dark, setDark, toggleDark }}>
      {children}
    </AppContext.Provider>
  );
};
