import React, { useState } from 'react';
import AddProduct from './AddProduct';
import FarmerProductManager from './FarmerProductManager';
import { FarmerOrders } from './getOrders';
import './FarmerDashboard.css';
import PropTypes from 'prop-types';

function FarmerDashboard({ lang }) {
  const [refresh, setRefresh] = useState(false);
  const username = localStorage.getItem('username');

  const handleRefresh = () => setRefresh(prev => !prev);

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  return (
    <div className="farmer-dashboard">
      <h2 style={{ textAlign: 'center' }}>{t('Paneli i Fermerit', 'Farmer Panel')}</h2>

      {/* Shto produkt */}
      <AddProduct lang={lang} onProductAdded={handleRefresh} />

      {/* Menaxho produktet e mia */}
      <FarmerProductManager lang={lang} refresh={refresh} />

      {/* Shfaq kërkesat e blerjes nga konsumatorët */}
      <div style={{ marginTop: '30px' }}>
        <FarmerOrders fermeri={username} />
      </div>
    </div>
  );
}

export default FarmerDashboard;

FarmerDashboard.propTypes = {
  lang: PropTypes.string.isRequired,
};
