import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './auth.css';

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'konsumator',
  });
  const [error, setError] = useState(''); // për mesazhe gabimi

  const { lang, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  // Event handler për ndryshimin e inputeve
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // fshin gabimin kur përdoruesi fillon të shkruajë
  };

  // Event handler për submit (login ose register)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      username: formData.username.trim(),
      password: formData.password.trim(),
      role: formData.role,
    };

    // Validim i thjeshtë përpara dërgimit
    if (cleanedData.username.length < 3 || cleanedData.password.length < 6) {
      setError(t('Emri ≥3 shkronja dhe fjalëkalimi ≥6!', 'Username ≥3 characters and password ≥6!'));
      return;
    }

    const endpoint = isRegister ? 'register' : 'login';

    try {
      const res = await axios.post(`https://merrbio-backend.onrender.com/${endpoint}`, cleanedData);
      alert(res.data.message);

      // Ruaj në localStorage
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);

      // Përditëso context
      dispatch({ type: 'SET_ROLE', payload: res.data.role });
      dispatch({ type: 'SET_USERNAME', payload: res.data.username });

      // Njofto App.js (opsionale — mund ta heqësh nëse nuk e përdor më)
      if (onLogin) onLogin(res.data.role, res.data.username);

      navigate('/');
    } catch (err) {
      console.error('Gabim në kërkesën e API-së:', err.response?.data || err.message);
      if (err.response && err.response.status === 401) {
        setError(t('Roli nuk përputhet me kredencialet!', 'Role does not match credentials!'));
      } else {
        setError(t('Gabim gjatë hyrjes ose regjistrimit!', 'Login or registration error!'));
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2>{isRegister ? t('Regjistrohu', 'Register') : t('Hyr', 'Login')}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder={t('Emri', 'Username')}
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder={t('Fjalëkalimi', 'Password')}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <p>{t('Zgjidh rolin:', 'Select your role:')}</p>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="konsumator"
                  checked={formData.role === 'konsumator'}
                  onChange={handleChange}
                />
                {t('Konsumator', 'Customer')}
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="fermer"
                  checked={formData.role === 'fermer'}
                  onChange={handleChange}
                />
                {t('Fermer', 'Farmer')}
              </label>
              {!isRegister && (
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleChange}
                  />
                  Admin
                </label>
              )}
            </div>

            {/* Mesazhi i gabimit */}
            {error && (
              <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>
                {error}
              </p>
            )}

            <button type="submit">
              {isRegister ? t('Regjistrohu', 'Register') : t('Hyr', 'Login')}
            </button>
          </form>

          <hr />

          <div className="register-section">
            <span>
              {isRegister
                ? t('Ke llogari?', 'Already have an account?')
                : t('Nuk ke llogari?', "Don't have an account?")}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setFormData({ ...formData, role: 'konsumator' });
                setError('');
              }}
            >
              {isRegister ? t('Hyr', 'Login') : t('Regjistrohu', 'Register')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
