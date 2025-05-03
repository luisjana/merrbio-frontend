import React, { useState } from 'react';
import AddProduct from './AddProduct';
import FarmerProductManager from './FarmerProductManager';
import { FarmerOrders } from './getOrders';
import './FarmerDashboard.css';

function FarmerDashboard({ lang }) {
  const [refresh, setRefresh] = useState(false);
  const username = localStorage.getItem('username');

  const handleRefresh = () => setRefresh(prev => !prev);

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  return (
    <div className="farmer-dashboard">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        {t('👨‍🌾 Paneli i Fermerit', '👨‍🌾 Farmer Panel')}
      </h2>

      {/* ✅ Shto produktin e ri */}
      <section>
        <h3>{t('Shto Produkt', 'Add Product')}</h3>
        <AddProduct lang={lang} onProductAdded={handleRefresh} />
      </section>

      {/* ✅ Menaxho produktet e mia */}
      <section style={{ marginTop: '30px' }}>
        <h3>{t('Produktet e Mia', 'My Products')}</h3>
        <FarmerProductManager lang={lang} refresh={refresh} />
      </section>

      {/* ✅ Shfaq kërkesat e blerjes nga konsumatorët */}
      <section style={{ marginTop: '30px' }}>
        <h3>{t('Kërkesat për Blerje', 'Purchase Requests')}</h3>
        <FarmerOrders fermeri={username} />
      </section>
    </div>
  );
}

export default FarmerDashboard;
