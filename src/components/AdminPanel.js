import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'konsumator' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // 🆕 për mesazhe gabimi

  const { lang } = useContext(AppContext);
  const currentUser = localStorage.getItem('username');
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  // Merr listën e përdoruesve në ngarkim
  useEffect(() => {
    axios.get('https://merrbio-backend.onrender.com/users')
      .then(res => setUsers(res.data.filter(user => user.username !== currentUser)))
      .catch(err => console.error('Gabim në marrjen e përdoruesve:', err));
  }, [currentUser]);

  // Funksion për shtimin e përdoruesve
  const handleAddUser = async () => {
    // Validime bazë
    if (newUser.username.trim().length < 3) {
      setError(t('Emri ≥3 shkronja.', 'Username ≥3 characters.'));
      return;
    }
    if (newUser.password.trim().length < 6) {
      setError(t('Fjalëkalimi ≥6 shkronja.', 'Password ≥6 characters.'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://merrbio-backend.onrender.com/users', newUser);
      alert(res.data.message);
      setNewUser({ username: '', password: '', role: 'konsumator' });
      const usersResponse = await axios.get('https://merrbio-backend.onrender.com/users');
      setUsers(usersResponse.data.filter(user => user.username !== currentUser));
    } catch (err) {
      console.error(err);
      setError(t('Gabim në shtimin e përdoruesit!', 'Error adding user!'));
    } finally {
      setLoading(false);
    }
  };

  // Funksion për fshirjen e përdoruesve me try-catch
  const handleDeleteUser = async (username) => {
    if (window.confirm(t(`A jeni të sigurt që dëshironi të fshini përdoruesin "${username}"?`,
      `Are you sure you want to delete the user "${username}"?`))) {
      try {
        const res = await axios.delete(`https://merrbio-backend.onrender.com/users/${username}`);
        alert(res.data.message);
        setUsers(users.filter(u => u.username !== username));
      } catch (err) {
        console.error('Gabim në fshirjen e përdoruesit:', err);
        alert(t('Gabim në fshirjen e përdoruesit!', 'Error deleting user!'));
      }
    }
  };

  return (
    <div className="admin-panel">
      <div className="user-list">
        <h2>{t('📋 Paneli i Adminit', '📋 Admin Panel')}</h2>
        <h3>{t('Përdoruesit:', 'Users:')}</h3>
        <ul>
          {users.map(user => (
            <li key={user.username}>
              <span>{user.username} — {user.role}</span>
              <button onClick={() => handleDeleteUser(user.username)}>
                {t('Fshi', 'Delete')}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="add-user">
        <h3>{t('📝 Shto Përdorues të Ri', '📝 Add New User')}</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
          <input
            type="text"
            placeholder={t('Emri', 'Username')}
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder={t('Fjalëkalimi', 'Password')}
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="konsumator">{t('🛍️ Konsumator', '🛍️ Customer')}</option>
            <option value="fermer">{t('👨‍🌾 Fermer', '👨‍🌾 Farmer')}</option>
            <option value="admin">{t('👨‍💻 Admin', '👨‍💻 Admin')}</option>
          </select>

          {/* Mesazhi i gabimit */}
          {error && (
            <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? t('Duke shtuar...', 'Adding...') : t('Shto Përdorues', 'Add User')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
