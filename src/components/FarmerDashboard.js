// src/components/FarmerDashboard.js
import React, { useState } from 'react';
import AddProduct from './AddProduct';
import FarmerProductManager from './FarmerProductManager';
import './FarmerDashboard.css'; // Sigurohu që e importon stilin

function FarmerDashboard({ lang }) {
  const [refresh, setRefresh] = useState(false);
  const handleRefresh = () => setRefresh(prev => !prev);

  return (
    <div className="farmer-dashboard">
      <AddProduct lang={lang} onProductAdded={handleRefresh} />
      <FarmerProductManager lang={lang} refresh={refresh} />
    </div>
  );
}

export default FarmerDashboard;
