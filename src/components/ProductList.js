import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductList.css';

function ProductList({ lang, role, onRequest, onMessage }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  // Funksion për përkthim me LibreTranslate
  const translateText = async (text, targetLang = 'en') => {
    try {
      const res = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        body: JSON.stringify({
          q: text,
          source: 'auto',
          target: targetLang,
          format: 'text',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      return data.translatedText;
    } catch (err) {
      console.error('Gabim gjatë përkthimit:', err);
      return text;
    }
  };

  // Merr produktet nga backend dhe përkthe nëse është anglisht
  useEffect(() => {
    axios
      .get('https://merrbio-backend.onrender.com/products')
      .then(async (res) => {
        const produktet = res.data || [];

        if (lang === 'en') {
          const translated = await Promise.all(
            produktet.map(async (p) => {
              const emri_en = await translateText(p.emri);
              const pershkrimi_en = await translateText(p.pershkrimi);
              return { ...p, emri_en, pershkrimi_en };
            })
          );
          setProducts(translated);
        } else {
          setProducts(produktet);
        }
      })
      .catch((err) => console.error('Gabim në ngarkimin e produkteve:', err));
  }, [lang]);

  const handleRequest = (product) => {
    if (onRequest) onRequest(product);
  };

  const handleMessage = (product) => {
    if (onMessage) onMessage(product);
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
          .filter((p) =>
            (lang === 'en' ? p.emri_en : p.emri)?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((p, i) => (
            <div className="product-card" key={i}>
              {p.image && (
                <img
                  src={`https://merrbio-backend.onrender.com${p.image}`}
                  alt={lang === 'en' ? p.emri_en : p.emri}
                  className="product-img"
                />
              )}
              <h3>{lang === 'en' ? p.emri_en : p.emri}</h3>
              <p className="price">{p.cmimi} lek</p>
              <p className="desc">{lang === 'en' ? p.pershkrimi_en : p.pershkrimi}</p>
              <p className="fermer">
                {t('nga', 'by')}: {p.fermeri}
              </p>

              {(role === 'konsumator' || !role) && (
                <div className="button-group">
                  <button onClick={() => handleRequest(p)}>
                    {t('Bëj kërkesë për blerje', 'Request to Buy')}
                  </button>
                  <button className="secondary" onClick={() => handleMessage(p)}>
                    {t('Dërgo mesazh', 'Send Message')}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProductList;
