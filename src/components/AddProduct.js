import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const BASE_URL = 'https://merrbio-backend.onrender.com';

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
    const token = localStorage.getItem('token');

    if (!fermeri || !token) {
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
    if (isNaN(cmimi) || cmimi <= 0) {
      setError(t('Çmimi duhet të jetë numër > 0.', 'Price must be a number > 0.'));
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
        `${BASE_URL}/products`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
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

      if (dispatch) dispatch({ type: 'PRODUCT_ADDED', payload: response.data });
      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error('❌ Gabim:', err);
      let message = t('Gabim i papritur.', 'Unexpected error.');
      if (err.response) {
        if (err.response.status === 401) message = t('Nuk je autorizuar.', 'Unauthorized.');
        else message = err.response.data?.message || message;
      } else if (err.request) {
        message = t('Serveri nuk u përgjigj.', 'Server did not respond.');
      }
      setError('❌ ' + t('Gabim gjatë ngarkimit të produktit: ', 'Error uploading product: ') + message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={emri} onChange={(e) => setEmri(e.target.value)} placeholder={t('Emri', 'Name')} required />
      <textarea value={pershkrimi} onChange={(e) => setPershkrimi(e.target.value)} placeholder={t('Përshkrimi', 'Description')} required />
      <input value={cmimi} type="number" onChange={(e) => setCmimi(e.target.value)} placeholder={t('Çmimi', 'Price')} required />
      <input type="file" accept="image/*" onChange={handleImageChange} id="imageInput" />

      {error && <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{error}</p>}

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
