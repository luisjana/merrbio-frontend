import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://merrbio-backend.onrender.com/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>
          <h3>{p.emri}</h3>
          <p>{p.pershkrimi}</p>
          <p>{p.cmimi} lek</p>
          {p.image && <img src={p.image} alt={p.emri} style={{ width: '150px' }} />}
        </div>
      ))}
    </div>
  );
}

export default ProductList;
