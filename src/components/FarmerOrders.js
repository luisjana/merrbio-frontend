import { useEffect, useState, useContext } from 'react';
import api from '../api'; // përdor api.js me token
import { AppContext } from '../context/AppContext';

export const FarmerOrders = ({ fermeri }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(AppContext);
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    fetchOrders();
  }, [fermeri]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/${fermeri}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert(t('Gabim gjatë marrjes së kërkesave!', 'Error fetching orders!'));
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      alert(
        status === 'confirmed'
          ? t('✅ Kërkesa u pranua!', '✅ Order confirmed!')
          : t('❌ Kërkesa u refuzua!', '❌ Order rejected!')
      );
    } catch (err) {
      console.error(err);
      alert(t('Gabim gjatë përditësimit të statusit!', 'Error updating status!'));
    }
  };

  return (
    <div>
      <h2>{t('📦 Kërkesat e mia për blerje', '📦 My Purchase Orders')}</h2>

      {loading ? (
        <p>{t('Duke u ngarkuar...', 'Loading...')}</p>
      ) : orders.length === 0 ? (
        <p>{t('Nuk ka kërkesa për blerje.', 'No purchase requests.')}</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px',
            }}
          >
            <p>
              <b>{t('Produkt ID:', 'Product ID:')}</b> {order.productId}
            </p>
            <p>
              <b>{t('Blerësi:', 'Buyer:')}</b> {order.buyerName} - {order.buyerContact}
            </p>
            <p>
              <b>{t('Statusi:', 'Status:')}</b> {t(order.status, order.status)}
            </p>

            <button
              onClick={() => updateStatus(order.id, 'confirmed')}
              disabled={order.status === 'confirmed'}
            >
              {t('Prano', 'Confirm')}
            </button>

            <button
              onClick={() => updateStatus(order.id, 'rejected')}
              style={{ marginLeft: '10px' }}
              disabled={order.status === 'rejected'}
            >
              {t('Refuzo', 'Reject')}
            </button>
          </div>
        ))
      )}
    </div>
  );
};
