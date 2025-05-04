import React, { createContext, useReducer } from 'react';

// Krijojmë një context bosh
export const AppContext = createContext();

// Gjendja fillestare
const initialState = {
  lang: 'sq',       // Gjuha
  dark: false,      // Dark mode
  role: null,       // Roli (admin, fermer, konsumator)
  username: null,   // Emri i përdoruesit
  products: [],     // Lista e produkteve
};

// Reducer që menaxhon të gjitha action-et
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LANG':
      return { ...state, lang: action.payload };
    case 'TOGGLE_DARK':
      return { ...state, dark: !state.dark };
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'LOGOUT':
      return { ...state, role: null, username: null };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'PRODUCT_ADDED':
      return { ...state, products: [...state.products, action.payload] };
    default:
      return state;
  }
};

// Provider që e jep gjendjen dhe dispatch tek të gjithë komponentët
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
