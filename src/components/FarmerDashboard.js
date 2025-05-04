import React, { useState } from 'react';
import AddProduct from './AddProduct';
import FarmerProductManager from './FarmerProductManager';
import { FarmerOrders } from './getOrders';
import './FarmerDashboard.css';

function FarmerDashboard({ lang }) {
  const [refresh, setRefresh] = useState(false);
  const username = localStorage.getItem('username');

  // Funksion për të rifreskuar listën e produkteve pas shtimit/fshirjes
  const handleRefresh = () => setRefresh(prev => !prev);

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  // Kontroll i thjeshtë nëse mungon username
  if (!username) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{t('Ju lutem kyçuni si fermer.', 'Please log in as farmer.')}</p>;
  }

  return (
    <div className="farmer-dashboard">
      <h2 style={{ textAlign: 'center' }}>{t('Paneli i Fermerit', 'Farmer Panel')}</h2>

      {/* 🥬 Shto produkt të ri */}
      <AddProduct lang={lang} onProductAdded={handleRefresh} />

      {/* 🛠️ Menaxho produktet e mia */}
      <FarmerProductManager lang={lang} refresh={refresh} />

      {/* 📦 Shfaq kërkesat e blerjes nga konsumatorët */}
      <div style={{ marginTop: '30px' }}>
        <FarmerOrders fermeri={username} />
      </div>
    </div>
  );
}

export default FarmerDashboard;
