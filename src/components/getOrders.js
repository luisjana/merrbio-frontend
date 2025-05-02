import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext'; // Importo context-in

export const FarmerOrders = ({ fermeri }) => {
  const [orders, setOrders] = useState([]);
  const { lang } = useContext(AppContext); // Merr gjuhën nga context-i

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    axios.get(`https://merrbio-backend.onrender.com/orders/${fermeri}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, [fermeri]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://merrbio-backend.onrender.com/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      alert(t('Statusi u përditësua!', 'Status updated!'));
    } catch (err) {
      console.error(err);
      alert(t('Gabim gjatë përditësimit.', 'Error updating status.'));
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
      <h2>{t('Kërkesat e mia për blerje', 'My Purchase Requests')}</h2>
      {orders.length === 0 && <p>{t('Nuk ka kërkesa për momentin.', 'No requests at the moment.')}</p>}
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
            <p><b>{t('Produkt ID', 'Product ID')}:</b> {order.productId}</p>
            <p><b>{t('Blerësi', 'Buyer')}:</b> {order.buyerName} - {order.buyerContact}</p>
            <p>
              <b>{t('Status', 'Status')}:</b>{' '}
              <span style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
                {order.status}
              </span>
            </p>
            {order.status === 'pending' && (
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => updateStatus(order.id, 'confirmed')}
                  style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}
                >
                  {t('Prano', 'Accept')}
                </button>
                <button
                  onClick={() => updateStatus(order.id, 'rejected')}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  {t('Refuzo', 'Reject')}
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};
