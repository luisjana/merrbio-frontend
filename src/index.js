import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './context/AppContext'; // ✅ importo contextin

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider> {/* ✅ mbështjell aplikacionin me AppContext */}
      <App />
    </AppProvider>
  </React.StrictMode>
);

reportWebVitals();
