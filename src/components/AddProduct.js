import React, { useState } from 'react';
import axios from 'axios';

function AddProduct({ onProductAdded }) {
  const [emri, setEmri] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [cmimi, setCmimi] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fermeri = localStorage.getItem('username');
    if (!fermeri) {
      alert('Ju lutem kyçuni për të shtuar produkt.');
      return;
    }

    const formData = new FormData();
    formData.append('emri', emri);
    formData.append('pershkrimi', pershkrimi);
    formData.append('cmimi', cmimi);
    formData.append('fermeri', fermeri);
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      await axios.post('https://merrbio-backend.onrender.com/products', formData);


      alert('Produkti u shtua me sukses!');
      setEmri('');
      setPershkrimi('');
      setCmimi('');
      setImage(null);
      document.getElementById('imageInput').value = '';

      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error('Gabim gjatë shtimit të produktit:', err);
      alert('Gabim gjatë ngarkimit të produktit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={emri}
        onChange={(e) => setEmri(e.target.value)}
        placeholder="Emri"
        required
      />
      <textarea
        value={pershkrimi}
        onChange={(e) => setPershkrimi(e.target.value)}
        placeholder="Përshkrimi"
        required
      />
      <input
        value={cmimi}
        type="number"
        onChange={(e) => setCmimi(e.target.value)}
        placeholder="Çmimi"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        id="imageInput"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Duke u ngarkuar...' : 'Shto'}
      </button>
    </form>
  );
}

export default AddProduct;
