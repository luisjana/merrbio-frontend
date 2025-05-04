import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './components/Auth';
import AdminPanel from './components/AdminPanel';
import ConsumerPanel from './components/ConsumerPanel';
import FarmerDashboard from './components/FarmerDashboard';

import { AppContext } from './context/AppContext';

import './components/style.css';
import './App.css';

function App() {
  const { lang, dark, role, username, dispatch } = useContext(AppContext);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('role');
      const savedUsername = localStorage.getItem('username');
      if (savedRole && savedUsername) {
        dispatch({ type: 'SET_ROLE', payload: savedRole });
        dispatch({ type: 'SET_USERNAME', payload: savedUsername });
      }
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      alert('Error loading saved session. Please log in again.');
    }
  }, [dispatch]);

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('token'); // ✅ SHTUAR: hiq token-in
    dispatch({ type: 'LOGOUT' });
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
            {username && <button onClick={handleLogout}>{t('Dil', 'Logout')}</button>}
            <button
              className="rounded-btn"
              onClick={() =>
                dispatch({ type: 'SET_LANG', payload: lang === 'sq' ? 'en' : 'sq' })
              }
            >
              <span style={{ fontWeight: 'bold' }}>
                {lang === 'sq' ? '🇦🇱 Shqip' : 'En English'}
              </span>
            </button>
            <button
              className="rounded-btn"
              onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
            >
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
                element={
                  <Auth
                    onLogin={(r, u, token) => {
                      dispatch({ type: 'SET_ROLE', payload: r });
                      dispatch({ type: 'SET_USERNAME', payload: u });
                      localStorage.setItem('role', r);
                      localStorage.setItem('username', u);
                      localStorage.setItem('token', token); // ✅ SHTO token-in
                    }}
                  />
                }
              />
            ) : (
              <>
                {role === 'fermer' && <Route path="/" element={<FarmerDashboard lang={lang} />} />}
                {role === 'admin' && <Route path="/" element={<AdminPanel />} />}
                {role === 'konsumator' && (
                  <Route path="/" element={<ConsumerPanel role={role} />} />
                )}
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
