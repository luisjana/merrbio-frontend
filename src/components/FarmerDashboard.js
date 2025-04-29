import React, { useState } from 'react';
import AddProduct from './AddProduct';
import FarmerProductManager from './FarmerProductManager';

function FarmerDashboard({ lang }) {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(prev => !prev);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
      <AddProduct lang={lang} onProductAdded={handleRefresh} />
      <FarmerProductManager lang={lang} refresh={refresh} />
    </div>
  );
}

export default FarmerDashboard;
