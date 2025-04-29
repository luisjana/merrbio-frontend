import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AddProduct from './components/AddProduct';
import Auth from './components/Auth';
import AdminPanel from './components/AdminPanel';
import ConsumerPanel from './components/ConsumerPanel';

import { AppContext } from './context/AppContext'; // import contextin
import FarmerProductManager from './components/FarmerProductManager';

import './components/style.css';
import './App.css';

function App() {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);

  const { lang, setLang, dark, setDark } = useContext(AppContext); // Merr lang dhe dark nga Context

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const savedUsername = localStorage.getItem('username');
    if (savedRole && savedUsername) {
      setRole(savedRole);
      setUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setRole(null);
    setUsername(null);
  };

  return (
    <Router>
      <div className={`AppLayout ${dark ? 'dark' : ''}`}>
        <header className="AppHeader">
          <div className="logo">MerrBio 🥬</div>
          <div className="controls">
            <span>
              {username
                ? `👋 ${t('Mirësevini', 'Welcome')}, ${username}`
                : `👋 ${t('Përshëndetje!', 'Hello!')}`}
            </span>

            {username && <button onClick={handleLogout}>Dil</button>}

            <button className="rounded-btn" onClick={() => setLang(lang === 'sq' ? 'en' : 'sq')}>
              <span style={{ fontWeight: 'bold' }}>{lang === 'sq' ? '🇦🇱 Shqip' : 'En English'}</span>
            </button>

            <button className="rounded-btn" onClick={() => setDark(!dark)}>
              {dark ? (
                <>
                  ☀️ <span style={{ fontWeight: 'bold' }}>{t('Drita', 'Light Mode')}</span>
                </>
              ) : (
                <>
                  🌙 <span style={{ fontWeight: 'bold' }}>{t('Errësira', 'Dark Mode')}</span>
                </>
              )}
            </button>
          </div>
        </header>

        <main className={role ? 'MainContent' : 'MainBackground'}>
          <Routes>
            {!role ? (
              <Route
                path="*"
                element={<Auth onLogin={(r, u) => { setRole(r); setUsername(u); }} />}
              />
            ) : (
              <>
              {role === 'fermer' && (
                <Route path="/" element={
                <>
                <AddProduct lang={lang} />
                 <FarmerProductManager lang={lang} />
               </>
                } />
                )}
                {role === 'admin' && <Route path="/" element={<AdminPanel />} />}
                {role === 'konsumator' && <Route path="/" element={<ConsumerPanel role={role} />} />}
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
