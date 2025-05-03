import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export const FarmerOrders = ({ fermeri }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(AppContext);

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://merrbio-backend.onrender.com/orders/${fermeri}`);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        alert(t('Gabim gjatë marrjes së kërkesave!', 'Error fetching requests!'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [fermeri]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://merrbio-backend.onrender.com/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      alert(
        status === 'confirmed'
          ? t('✅ Kërkesa u pranua!', '✅ Request accepted!')
          : t('❌ Kërkesa u refuzua!', '❌ Request rejected!')
      );
    } catch (err) {
      console.error(err);
      alert(t('Gabim gjatë përditësimit të statusit!', 'Error updating status!'));
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
      <h2>{t('📥 Kërkesat e mia për blerje', '📥 My Purchase Requests')}</h2>

      {loading ? (
        <p>{t('Duke u ngarkuar...', 'Loading...')}</p>
      ) : orders.length === 0 ? (
        <p>{t('Nuk ka kërkesa për momentin.', 'No requests at the moment.')}</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              margin: '10px auto',
              width: '300px',
              borderRadius: '8px'
            }}
          >
            <p><b>{t('Produkt ID', 'Product ID')}:</b> {order.productId}</p>
            <p><b>{t('Blerësi', 'Buyer')}:</b> {order.buyerName} - {order.buyerContact}</p>
            <p>
              <b>{t('Statusi', 'Status')}:</b>{' '}
              <span style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
                {t(order.status, order.status)}
              </span>
            </p>
            {order.status === 'pending' && (
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => updateStatus(order.id, 'confirmed')}
                  style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}
                >
                  {t('✅ Prano', '✅ Accept')}
                </button>
                <button
                  onClick={() => updateStatus(order.id, 'rejected')}
                  style={{ backgroundColor: 'red', color: 'white' }}
                >
                  {t('❌ Refuzo', '❌ Reject')}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
