import axios from 'axios';
import { useEffect, useState } from 'react';

export const FarmerOrders = ({ fermeri }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!fermeri) return;
    axios.get(`https://merrbio-backend.onrender.com/orders/${fermeri}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error('Gabim gjatë marrjes së porosive:', err));
  }, [fermeri]);

  if (orders.length === 0) {
    return <p style={{ textAlign: 'center' }}>Nuk ka ende kërkesa për blerje.</p>;
  }

  return (
    <div style={{ marginTop: '30px', textAlign: 'center' }}>
      <h3>Kërkesat e mia për blerje</h3>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <p><strong>Produkt ID:</strong> {order.productId}</p>
          <p><strong>Blerësi:</strong> {order.buyerName} - {order.buyerContact}</p>
          <p><strong>Status:</strong> {order.status}</p>
        </div>
      ))}
    </div>
  );
};
