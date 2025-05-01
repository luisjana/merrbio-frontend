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
    const formData = new FormData();
    formData.append('emri', emri);
    formData.append('pershkrimi', pershkrimi);
    formData.append('cmimi', cmimi);
    formData.append('fermeri', localStorage.getItem('username'));
    if (image) formData.append('image', image);

    try {
      setLoading(true);
      await axios.post('https://merrbio-backend.onrender.com/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setEmri('');
      setPershkrimi('');
      setCmimi('');
      setImage(null);
      document.getElementById('imageInput').value = '';
      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error(err);
      alert('Error uploading product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={emri} onChange={(e) => setEmri(e.target.value)} placeholder="Emri" required />
      <textarea value={pershkrimi} onChange={(e) => setPershkrimi(e.target.value)} placeholder="Pershkrimi" required />
      <input value={cmimi} type="number" onChange={(e) => setCmimi(e.target.value)} placeholder="Cmimi" required />
      <input type="file" accept="image/*" onChange={handleImageChange} id="imageInput" />
      <button type="submit" disabled={loading}>{loading ? 'Duke u ngarkuar...' : 'Shto'}</button>
    </form>
  );
}

export default AddProduct;
