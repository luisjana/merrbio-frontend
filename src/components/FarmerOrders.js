import axios from 'axios';
import { useEffect, useState } from 'react';

export const FarmerOrders = ({ fermeri }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`https://merrbio-backend.onrender.com/orders/${fermeri}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, [fermeri]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://merrbio-backend.onrender.com/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      alert('Statusi u përditësua!');
    } catch (err) {
      console.error(err);
      alert('Gabim gjatë përditësimit.');
    }
  };

  return (
    <div>
      <h2>Kërkesat e mia për blerje</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <p><b>Produkt ID:</b> {order.productId}</p>
          <p><b>Blerësi:</b> {order.buyerName} - {order.buyerContact}</p>
          <p><b>Status:</b> {order.status}</p>
          <button onClick={() => updateStatus(order.id, 'confirmed')}>Prano</button>
          <button onClick={() => updateStatus(order.id, 'rejected')} style={{ marginLeft: '10px' }}>Refuzo</button>
        </div>
      ))}
    </div>
  );
};
