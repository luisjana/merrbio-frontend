import React, { useState, useEffect, useContext } from 'react';
import api from '../api'; // përdor api.js që shton token-in
import { AppContext } from '../context/AppContext';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'konsumator' });
  const [loading, setLoading] = useState(false);

  const { lang } = useContext(AppContext);
  const currentUser = localStorage.getItem('username');
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.filter(user => user.username !== currentUser));
    } catch (err) {
      console.error('Gabim në marrjen e përdoruesve:', err);
    }
  };

  const handleAddUser = async () => {
    if (newUser.username.trim().length < 3 || newUser.password.trim().length < 6) {
      alert(t('Emri ≥3 shkronja dhe fjalëkalimi ≥6!', 'Username ≥3 characters and password ≥6!'));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/users', newUser);
      alert(res.data.message);
      setNewUser({ username: '', password: '', role: 'konsumator' });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(t('Gabim në shtimin e përdoruesit!', 'Error adding user!'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (username) => {
    if (!window.confirm(t(`A jeni të sigurt që dëshironi të fshini përdoruesin "${username}"?`,
                          `Are you sure you want to delete the user "${username}"?`))) return;

    try {
      const res = await api.delete(`/users/${username}`);
      alert(res.data.message);
      setUsers(users.filter(u => u.username !== username));
    } catch (err) {
      console.error(err);
      alert(t('Gabim në fshirjen e përdoruesit!', 'Error deleting user!'));
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
          <button type="submit" disabled={loading}>
            {loading ? t('Duke shtuar...', 'Adding...') : t('Shto Përdorues', 'Add User')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
