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
        timeout: 60000, // 60 sekonda për Render zgjuar
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
      setError('❌ Serveri është duke u zgjuar... provo pas disa sekondash.');
    } else if (err.response) {
      setError('❌ ' + (err.response.data?.message || 'Gabim i papritur.'));
    } else if (err.message.includes('Network Error')) {
      setError('❌ Serveri nuk u përgjigj. Kontrollo backend-in.');
    } else {
      setError('❌ Gabim: ' + err.message);
    }
  } finally {
    setLoading(false);
    setUploadProgress(0);
  }
};
