import React, { useState, useContext } from 'react';
import api from '../api'; // përdor api.js që shton token automatikisht
import { AppContext } from '../context/AppContext';

function AddProduct({ onProductAdded }) {
  const [emri, setEmri] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [cmimi, setCmimi] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { lang } = useContext(AppContext);
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fermeri = localStorage.getItem('username');
    if (!fermeri) {
      alert(t('Ju lutem kyçuni për të shtuar produkt.', 'Please log in to add a product.'));
      return;
    }

    if (cmimi <= 0) {
      alert(t('Çmimi duhet të jetë më i madh se 0.', 'Price must be greater than 0.'));
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
      const response = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      alert(t('✅ Produkti u shtua me sukses!', '✅ Product added successfully!'));
      setEmri('');
      setPershkrimi('');
      setCmimi('');
      setImage(null);
      document.getElementById('imageInput').value = '';

      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error('❌ Gabim gjatë shtimit të produktit:', err.response?.data || err.message);
      alert('❌ ' + t('Gabim gjatë ngarkimit të produktit:', 'Error uploading product: ') + (err.response?.data?.message || 'Check console.'));
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={emri}
        onChange={(e) => setEmri(e.target.value)}
        placeholder={t('Emri', 'Name')}
        required
      />
      <textarea
        value={pershkrimi}
        onChange={(e) => setPershkrimi(e.target.value)}
        placeholder={t('Përshkrimi', 'Description')}
        required
      />
      <input
        value={cmimi}
        type="number"
        onChange={(e) => setCmimi(e.target.value)}
        placeholder={t('Çmimi', 'Price')}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        id="imageInput"
      />
      <button type="submit" disabled={loading}>
        {loading ? t('Duke u ngarkuar...', 'Uploading...') : t('Shto', 'Add')}
      </button>

      {loading && (
        <div style={{ marginTop: '10px' }}>
          {t('Ngarkimi', 'Uploading')}: {uploadProgress}%
        </div>
      )}
    </form>
  );
}

export default AddProduct;
