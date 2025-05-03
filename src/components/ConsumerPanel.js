import React, { useEffect, useState, useContext } from 'react';
import api from '../api'; // përdor api.js me interceptor
import { AppContext } from '../context/AppContext';
import './ConsumerPanel.css';

function ConsumerPanel({ role }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const { lang } = useContext(AppContext);
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      if (res.data) setProducts(res.data);
    } catch (err) {
      console.error('Gabim në ngarkimin e produkteve:', err);
      alert(t('Gabim në ngarkimin e produkteve!', 'Error loading products!'));
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (product) => {
    const emri = prompt(t('Shkruaj emrin tënd:', 'Enter your name:')).trim();
    const telefoni = prompt(t('Shkruaj numrin e kontaktit:', 'Enter your contact number:')).trim();

    if (!emri || !telefoni) {
      alert(t('Emri dhe numri janë të detyrueshëm!', 'Name and contact number are required!'));
      return;
    }
    if (!/^\d+$/.test(telefoni)) {
      alert(t('Numri i telefonit duhet të përmbajë vetëm shifra!', 'Phone number must contain only digits!'));
      return;
    }

    try {
      await api.post('/orders', {
        productId: product.id,
        buyerName: emri,
        buyerContact: telefoni,
      });
      alert(t('✅ Kërkesa u dërgua me sukses!', '✅ Request sent successfully!'));
    } catch (err) {
      console.error(err);
      alert(t('❌ Gabim gjatë dërgimit të kërkesës.', '❌ Error sending request.'));
    }
  };

  return (
    <div className="product-section">
      <h2 className="section-title">{t('Produktet e Publikuara', 'Published Products')}</h2>

      <input
        type="text"
        placeholder={t('Kërko produkt...', 'Search product...')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>{t('Duke u ngarkuar...', 'Loading...')}</p>
      ) : (
        <div className="grid-container">
          {products
            .filter(p => p?.emri?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((p, i) => (
              <div className="product-card" key={i}>
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.emri}
                    className="product-img"
                  />
                )}
                <h3>{p.emri}</h3>
                <p className="price">{p.cmimi} lek</p>
                <p className="desc">{p.pershkrimi}</p>
                <p className="fermer">{t('nga', 'by')}: {p.fermeri}</p>

                <div className="button-group">
                  {(role === 'konsumator' || !role) && (
                    <button onClick={() => handleRequest(p)}>
                      {t('Bëj kërkesë për blerje', 'Request to Buy')}
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ConsumerPanel;
