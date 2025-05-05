import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import './ConsumerPanel.css';
import PropTypes from 'prop-types';
import GreenButton from './GreenButton';

function ConsumerPanel({ role }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { lang } = useContext(AppContext);

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    axios
      .get('https://merrbio-backend.onrender.com/products')
      .then(res => res.data && setProducts(res.data))
      .catch(err => console.error('Gabim në ngarkimin e produkteve:', err));
  }, []);

  const handleRequest = async (product) => {
    const emri = prompt('Shkruaj emrin tënd:');
    const telefoni = prompt('Shkruaj numrin e kontaktit:');
    if (!emri || !telefoni) {
      alert('Emri dhe numri janë të detyrueshëm!');
      return;
    }

    try {
      await axios.post('https://merrbio-backend.onrender.com/orders', {
        productId: product.id,
        buyerName: emri,
        buyerContact: telefoni,
      });
      alert('Kërkesa u dërgua me sukses!');
    } catch (err) {
      console.error(err);
      alert('Gabim gjatë dërgimit të kërkesës.');
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
                  <GreenButton onClick={() => handleRequest(p)}>
                    {t('Bëj kërkesë për blerje', 'Request to Buy')}
                  </GreenButton>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

ConsumerPanel.propTypes = {
  role: PropTypes.string,
};

export default ConsumerPanel;
