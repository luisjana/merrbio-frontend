import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const FarmerOrders = ({ fermeri }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useContext(AppContext);
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  // Merr kërkesat kur ngarkohet komponenti
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`https://merrbio-backend.onrender.com/orders/${fermeri}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert(t('Gabim gjatë ngarkimit të kërkesave!', 'Error loading orders!'));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [fermeri, t]);

  // Përditëso statusin e një porosie
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://merrbio-backend.onrender.com/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      alert(
        status === 'confirmed'
          ? t('✅ Kërkesa u pranua!', '✅ Request confirmed!')
          : t('❌ Kërkesa u refuzua!', '❌ Request rejected!')
      );
    } catch (err) {
      console.error(err);
      alert(t('Gabim gjatë përditësimit.', 'Error updating status.'));
    }
  };

  return (
    <div>
      <h2>{t('Kërkesat e mia për blerje', 'My Purchase Requests')}</h2>

      {/* Mesazh nëse është duke u ngarkuar */}
      {loading && <p>{t('Duke ngarkuar kërkesat...', 'Loading orders...')}</p>}

      {/* Mesazh nëse lista është bosh */}
      {!loading && orders.length === 0 && (
        <p>{t('Nuk ka asnjë kërkesë për momentin.', 'No requests at the moment.')}</p>
      )}

      {/* Lista e kërkesave */}
      {orders.map(order => (
        <div
          key={order.id}
          style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}
        >
          <p>
            <b>ID:</b> {order.productId}
          </p>
          <p>
            <b>{t('Blerësi', 'Buyer')}:</b> {order.buyerName} - {order.buyerContact}
          </p>
          <p>
            <b>{t('Statusi', 'Status')}:</b> {order.status}
          </p>
          <button onClick={() => updateStatus(order.id, 'confirmed')}>
            {t('Prano', 'Accept')}
          </button>
          <button
            onClick={() => updateStatus(order.id, 'rejected')}
            style={{ marginLeft: '10px' }}
          >
            {t('Refuzo', 'Reject')}
          </button>
        </div>
      ))}
    </div>
  );
};
