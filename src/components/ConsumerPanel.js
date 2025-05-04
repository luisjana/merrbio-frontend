import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import './ConsumerPanel.css';

function ConsumerPanel({ role }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { lang, dispatch } = useContext(AppContext);
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://merrbio-backend.onrender.com/products');
        if (res.data) {
          setProducts(res.data);
          dispatch && dispatch({ type: 'SET_PRODUCTS', payload: res.data });
        }
      } catch (err) {
        console.error('Gabim në ngarkimin e produkteve:', err);
        alert(t('Gabim gjatë ngarkimit të produkteve!', 'Error loading products!'));
      }
    };
    fetchProducts();
  }, [dispatch, t]);

  const handleRequest = async (product) => {
    const emri = prompt(t('Shkruaj emrin tënd:', 'Enter your name:'));
    const telefoni = prompt(t('Shkruaj numrin e kontaktit:', 'Enter your contact number:'));

    if (!emri || emri.trim().length < 3) {
      alert(t('Emri duhet të ketë ≥3 shkronja!', 'Name must be ≥3 characters!'));
      return;
    }
    if (!telefoni || telefoni.trim().length < 6) {
      alert(t('Numri duhet të ketë ≥6 shifra!', 'Phone number must be ≥6 digits!'));
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert(t('❌ Ju duhet të jeni i loguar për të bërë kërkesë!', '❌ You must be logged in to make a request!'));
      return;
    }

    try {
      await axios.post(
        'https://merrbio-backend.onrender.com/orders',
        {
          productId: product.id,
          buyerName: emri.trim(),
          buyerContact: telefoni.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(t('✅ Kërkesa u dërgua me sukses!', '✅ Request sent successfully!'));
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        alert(t('❌ Session ka skaduar! Dilni dhe kyçuni përsëri.', '❌ Session expired! Please log in again.'));
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        window.location.reload();
      } else {
        alert(t('❌ Gabim gjatë dërgimit të kërkesës.', '❌ Error sending request.'));
      }
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
          .filter((p) => p?.emri?.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((p, i) => (
            <div className="product-card" key={i}>
              {p.image && <img src={p.image} alt={p.emri} className="product-img" />}
              <h3>{p.emri}</h3>
              <p className="price">{p.cmimi} lek</p>
              <p className="desc">{p.pershkrimi}</p>
              <p className="fermer">
                {t('nga', 'by')}: {p.fermeri}
              </p>

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
    </div>
  );
}

export default ConsumerPanel;
