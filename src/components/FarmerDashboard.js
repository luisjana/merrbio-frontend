import React, { useState } from 'react';
import AddProduct from './AddProduct';
import FarmerProductManager from './FarmerProductManager';
import { FarmerOrders } from './getOrders';
import './FarmerDashboard.css';

function FarmerDashboard({ lang }) {
  const [refresh, setRefresh] = useState(false);
  const username = localStorage.getItem('username'); // Merr username-in e fermerit

  const handleRefresh = () => setRefresh(prev => !prev);

  return (
    <div className="farmer-dashboard">
      <h2 style={{ textAlign: 'center' }}>Paneli i Fermerit</h2>

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
