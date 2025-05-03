import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(AppContext);

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://merrbio-backend.onrender.com/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        alert(t('Gabim gjatë ngarkimit të produkteve.', 'Error loading products.'));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p =>
    p.emri.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>{t('📦 Lista e Produkteve', '📦 Product List')}</h2>

      <input
        type="text"
        placeholder={t('Kërko produkt...', 'Search product...')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '5px', marginBottom: '20px', width: '200px' }}
      />

      {loading ? (
        <p>{t('Duke u ngarkuar...', 'Loading...')}</p>
      ) : filteredProducts.length === 0 ? (
        <p>{t('Nuk u gjet asnjë produkt.', 'No products found.')}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {filteredProducts.map(p => (
            <div key={p.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
              <h3>{p.emri}</h3>
              <p>{p.pershkrimi}</p>
              <p><b>{p.cmimi} lek</b></p>
              {p.image && (
                <img
                  src={p.image}
                  alt={p.emri}
                  style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
