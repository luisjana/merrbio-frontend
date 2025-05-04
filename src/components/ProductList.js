import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://merrbio-backend.onrender.com/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Gabim gjatë marrjes së produkteve:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Lista e Produkteve</h2>
      {loading && <p>Duke ngarkuar...</p>}
      {!loading && products.length === 0 && <p>Asnjë produkt i disponueshëm.</p>}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {products.map(p => (
          <div
            key={p.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              width: '200px',
            }}
          >
            <h3>{p.emri.trim()}</h3>
            <p>{p.pershkrimi.trim()}</p>
            <p><b>{p.cmimi} lek</b></p>
            {p.image && (
              <img
                src={p.image}
                alt={p.emri}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
