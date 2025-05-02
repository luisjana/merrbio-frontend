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

  const getStatusColor = (status) => {
    if (status === 'pending') return 'orange';
    if (status === 'confirmed') return 'green';
    if (status === 'rejected') return 'red';
    return 'black';
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Kërkesat e mia për blerje</h2>
      {orders.length === 0 && <p>Nuk ka kërkesa për momentin.</p>}
      {orders
        .filter(order => order.status === 'pending')
        .map(order => (
          <div key={order.id} style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            margin: '10px auto', 
            width: '300px', 
            borderRadius: '8px' 
          }}>
            <p><b>Produkt ID:</b> {order.productId}</p>
            <p><b>Blerësi:</b> {order.buyerName} - {order.buyerContact}</p>
            <p>
              <b>Status:</b>{' '}
              <span style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
                {order.status}
              </span>
            </p>
            {order.status === 'pending' && (
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => updateStatus(order.id, 'confirmed')} style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}>
                  Prano
                </button>
                <button onClick={() => updateStatus(order.id, 'rejected')} style={{ backgroundColor: 'red', color: 'white' }}>
                  Refuzo
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
