import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

function AddProduct({ onProductAdded }) {
  const [emri, setEmri] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [cmimi, setCmimi] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const { lang, dispatch } = useContext(AppContext);
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fermeri = localStorage.getItem('username');

    if (!fermeri) {
      setError(t('Ju lutem kyçuni për të shtuar produkt.', 'Please log in to add a product.'));
      return;
    }

    if (emri.trim().length < 3) {
      setError(t('Emri ≥3 shkronja.', 'Name ≥3 characters.'));
      return;
    }
    if (pershkrimi.trim().length < 10) {
      setError(t('Përshkrimi ≥10 shkronja.', 'Description ≥10 characters.'));
      return;
    }
    if (cmimi <= 0) {
      setError(t('Çmimi duhet të jetë më i madh se 0.', 'Price must be greater than 0.'));
      return;
    }

    const formData = new FormData();
    formData.append('emri', emri.trim());
    formData.append('pershkrimi', pershkrimi.trim());
    formData.append('cmimi', cmimi);
    formData.append('fermeri', fermeri);
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        'https://merrbio-backend.onrender.com/products',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 60000,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          },
        }
      );

      alert(t('✅ Produkti u shtua me sukses!', '✅ Product added successfully!'));

      setEmri('');
      setPershkrimi('');
      setCmimi('');
      setImage(null);
      document.getElementById('imageInput').value = '';

      if (dispatch) {
        dispatch({ type: 'PRODUCT_ADDED', payload: response.data });
      }
      if (onProductAdded) onProductAdded();

    } catch (err) {
      console.error('❌ Gabim gjatë shtimit të produktit:', err);

      if (err.code === 'ECONNABORTED') {
        setError('❌ ' + t('Serveri është duke u zgjuar... provo pas disa sekondash.', 'Server is waking up... please try again in a few seconds.'));
      } else if (err.response) {
        setError('❌ ' + (err.response.data?.message || 'Gabim i papritur.'));
      } else if (err.message.includes('Network Error')) {
        setError('❌ ' + t('Serveri nuk u përgjigj. Kontrollo backend-in.', 'Server did not respond. Check the backend.'));
      } else {
        setError('❌ Gabim: ' + err.message);
      }

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

      {error && (
        <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>
          {error}
        </p>
      )}

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
