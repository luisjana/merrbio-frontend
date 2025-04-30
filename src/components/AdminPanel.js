import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext'; // Import AppContext

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'konsumator' });
  const [loading, setLoading] = useState(false);

  const { lang } = useContext(AppContext); // vetem lang — jo setLang sepse nuk na duhet këtu
  const currentUser = localStorage.getItem('username');

  useEffect(() => {
    axios.get('https://merrbio-backend.onrender.com/users')
      .then(res => setUsers(res.data.filter(user => user.username !== currentUser)))
      .catch(err => console.error('Gabim në marrjen e përdoruesve:', err));
  }, [currentUser]);

  const handleAddUser = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://merrbio-backend.onrender.com/users', newUser);
      alert(res.data.message);
      setNewUser({ username: '', password: '', role: 'konsumator' });
      const usersResponse = await axios.get('https://merrbio-backend.onrender.com/users');
      setUsers(usersResponse.data.filter(user => user.username !== currentUser));
    } catch (err) {
      console.error(err);
      alert(lang === 'sq' ? 'Gabim në shtimin e përdoruesit!' : 'Error adding user!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (username) => {
    if (window.confirm(lang === 'sq' ? `A jeni të sigurt që dëshironi të fshini përdoruesin "${username}"?` : `Are you sure you want to delete the user "${username}"?`)) {
      axios.delete(`https://merrbio-backend.onrender.com/users/${username}`)
        .then(res => {
          alert(res.data.message);
          setUsers(users.filter(u => u.username !== username));
        })
        .catch(err => console.error('Gabim në fshirjen e përdoruesit:', err));
    }
  };

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  return (
    <div className="admin-panel">
      <div className="user-list">
        <h2>{t('📋 Paneli i Adminit', '📋 Admin Panel')}</h2>
        <h3>{t('Përdoruesit:', 'Users:')}</h3>
        <ul>
          {users.map(user => (
            <li key={user.username}>
              <span>{user.username} — {user.role}</span>
              <button onClick={() => handleDeleteUser(user.username)}>{t('Fshi', 'Delete')}</button>
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
          />
          <input
            type="password"
            placeholder={t('Fjalëkalimi', 'Password')}
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="konsumator">{t('🛍️ Konsumator', '🛍️ Customer')}</option>
            <option value="fermer">{t('👨‍🌾 Fermer', '👨‍🌾 Farmer')}</option>
            <option value="admin">{t('👨‍💻 Admin', '👨‍💻 Admin')}</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? t('Duke shtuar...', 'Adding...') : t('Shto Përdorues', 'Add User')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
