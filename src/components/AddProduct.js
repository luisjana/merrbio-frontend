import React, { useState } from 'react';
import axios from 'axios';

function AddProduct({ onProductAdded }) {
  // State për të ruajtur fushat e formularit
  const [emri, setEmri] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [cmimi, setCmimi] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // për progress bar

  // Funksion për të ruajtur foton e zgjedhur
  const handleImageChange = (e) => setImage(e.target.files[0]);

  // Funksion për të trajtuar submit-in e formularit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marr fermerin nga localStorage
    const fermeri = localStorage.getItem('username');
    if (!fermeri) {
      alert('Ju lutem kyçuni për të shtuar produkt.');
      return;
    }

    // Validim që çmimi të jetë më i madh se zero
    if (cmimi <= 0) {
      alert('Çmimi duhet të jetë më i madh se 0.');
      return;
    }

    // Përgatis formData për ta dërguar me multipart/form-data
    const formData = new FormData();
    formData.append('emri', emri);
    formData.append('pershkrimi', pershkrimi);
    formData.append('cmimi', cmimi);
    formData.append('fermeri', fermeri);
    if (image) formData.append('image', image);

    try {
      setLoading(true);

      // Bëj request dhe llogarit përqindjen e ngarkimit
      const response = await axios.post(
        'https://merrbio-backend.onrender.com/products',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent); // Përditëson progress bar
          },
        }
      );

      alert('✅ Produkti u shtua me sukses!');
      
      // Pastro fushat e formularit
      setEmri('');
      setPershkrimi('');
      setCmimi('');
      setImage(null);
      document.getElementById('imageInput').value = '';

      // Rifresko listën e produkteve në parent component
      if (onProductAdded) onProductAdded();
    } catch (err) {
      console.error('❌ Gabim gjatë shtimit të produktit:', err.response?.data || err.message);
      alert('❌ Gabim gjatë ngarkimit të produktit: ' + (err.response?.data?.message || 'Shiko konsolen.'));
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset progress bar pas ngarkimit
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
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Duke u ngarkuar...' : 'Shto'}
      </button>

      {/* Progress bar gjatë ngarkimit */}
      {loading && (
        <div style={{ marginTop: '10px' }}>
          Ngarkimi: {uploadProgress}%
        </div>
      )}
    </form>
  );
}

export default AddProduct;
