import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext'; // Importo contextin
import './ConsumerPanel.css';

function ConsumerPanel({ role }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { lang } = useContext(AppContext); // Merr lang nga Context

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    axios
      .get('https://merrbio-backend.onrender.com/products')
      .then(res => res.data && setProducts(res.data))
      .catch(err => console.error('Gabim në ngarkimin e produkteve:', err));
  }, []);

  const handleRequest = (product) => {
    const konsumatori = prompt(t('Shkruaj emrin tënd dhe nr kontakti:', 'Enter your name and number:'));
    axios
      .post('https://merrbio-backend.onrender.com/requests', {
        produkti: product.emri,
        fermeri: product.fermeri,
        konsumatori: konsumatori || 'anonim',
      })
      .then(res => alert(res.data.message));
  };

  // ✅ Butoni për mesazh është hequr — nuk përdoret më:
  // const handleMessage = (product) => {
  //   alert(t('Hapet dritarja për mesazh te', 'Open chat window to') + ' ' + product.fermeri);
  // };

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
                  <>
                    <button onClick={() => handleRequest(p)}>
                      {t('Bëj kërkesë për blerje', 'Request to Buy')}
                    </button>
                    {/* ❌ Butoni "Dërgo mesazh" u hoq për kërkesën tënde */}
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ConsumerPanel;
