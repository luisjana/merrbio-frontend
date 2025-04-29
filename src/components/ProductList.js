import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ConsumerPanel.css';

function ConsumerPanel({ role, lang }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  // FUNKSION për përkthim automatik me LibreTranslate
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
      return text; // fallback nëse ndodh ndonjë gabim
    }
  };

  // Merr produktet dhe përkthe nëse gjuha është anglisht
  useEffect(() => {
    axios
      .get('https://merrbio-backend.onrender.com/products')
      .then(async res => {
        const produktet = res.data || [];

        if (lang === 'en') {
          const translated = await Promise.all(
            produktet.map(async p => {
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
      .catch(err => console.error('Gabim në ngarkimin e produkteve:', err));
  }, [lang]);

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

  const handleMessage = (product) => {
    alert(t('Hapet dritarja për mesazh te', 'Open chat window to') + ' ' + product.fermeri);
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
          .filter(p =>
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
              <p className="fermer">{t('nga', 'by')}: {p.fermeri}</p>

              <div className="button-group">
                {(role === 'konsumator' || !role) && (
                  <>
                    <button onClick={() => handleRequest(p)}>
                      {t('Bëj kërkesë për blerje', 'Request to Buy')}
                    </button>
                    <button className="secondary" onClick={() => handleMessage(p)}>
                      {t('Dërgo mesazh', 'Send Message')}
                    </button>
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
