import React, { useState } from 'react';
import axios from 'axios';

function AddProduct({ lang }) {
  const [emri, setEmri] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [cmimi, setCmimi] = useState('');
  const [image, setImage] = useState(null); // për foton

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // ruan imazhin që përdoruesi ngarkon
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('emri', emri);
    formData.append('pershkrimi', pershkrimi);
    formData.append('cmimi', cmimi);
    formData.append('fermeri', 'fermer1');  // mund ta merrni nga login
    if (image) {
      formData.append('image', image);  // shto fotoja për upload
    }

    axios.post('https://merrbio-backend.onrender.com/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // mundëson dërgimin e file-it
      }
    }).then(res => {
      alert(res.data.message);
      setEmri('');
      setPershkrimi('');
      setCmimi('');
      setImage(null);  // Pas suksesit, reseto fushën e imazhit
    }).catch(err => {
      console.error(err);
      alert("Gabim gjatë ngarkimit të produktit");
    });
  };

  return (
    <div className="card">
      <h2>{lang === 'sq' ? 'Shto Produkt' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={lang === 'sq' ? 'Emri i produktit' : 'Product Name'}
          value={emri}
          onChange={(e) => setEmri(e.target.value)}
          required
        />
        <textarea
          placeholder={lang === 'sq' ? 'Përshkrimi' : 'Description'}
          value={pershkrimi}
          onChange={(e) => setPershkrimi(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder={lang === 'sq' ? 'Çmimi (në lek)' : 'Price (in lek)'}
          value={cmimi}
          onChange={(e) => setCmimi(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit">{lang === 'sq' ? 'Shto' : 'Add'}</button>
      </form>
    </div>
  );
}

export default AddProduct;
