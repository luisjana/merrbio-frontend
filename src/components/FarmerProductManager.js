import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FarmerProductManager.css';

function FarmerProductManager({ lang, refresh, setRefresh = () => {} }) {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    emri: '',
    pershkrimi: '',
    cmimi: '',
    image: null,
    preview: null
  });
  const [loading, setLoading] = useState(false); // 🆕 për loading

  const username = localStorage.getItem('username');
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  // Ngarkon produktet e fermerit
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('https://merrbio-backend.onrender.com/products');
        const myProducts = res.data.filter(p => p.fermeri === username);
        setProducts(myProducts);
      } catch (err) {
        console.error('Gabim gjatë marrjes së produkteve:', err);
        alert(t('Gabim gjatë ngarkimit të produkteve!', 'Error loading products!'));
      }
    };
    fetchProducts();
  }, [username, refresh, t]);

  // Fillon redaktimin për një produkt
  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product, image: null, preview: product.image });
  };

  // Menaxhon ndryshimet në input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  // Ngarkon imazhin dhe bën preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditedProduct(prev => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file)
    }));
  };

  // Ruaj ndryshimet e produktit
  const handleSave = async () => {
    // Validime bazë
    if (editedProduct.emri.trim().length < 3) {
      alert(t('Emri ≥3 shkronja.', 'Name ≥3 characters.'));
      return;
    }
    if (editedProduct.pershkrimi.trim().length < 10) {
      alert(t('Përshkrimi ≥10 shkronja.', 'Description ≥10 characters.'));
      return;
    }
    if (editedProduct.cmimi <= 0) {
      alert(t('Çmimi duhet të jetë >0.', 'Price must be >0.'));
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('emri', editedProduct.emri.trim());
      formData.append('pershkrimi', editedProduct.pershkrimi.trim());
      formData.append('cmimi', editedProduct.cmimi);
      formData.append('fermeri', username);
      if (editedProduct.image) formData.append('image', editedProduct.image);

      await axios.put(`https://merrbio-backend.onrender.com/products/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert(t('✅ Produkti u përditësua!', '✅ Product updated!'));
      setEditingId(null);
      setRefresh(prev => !prev);
    } catch (err) {
      console.error('Gabim gjatë përditësimit:', err);
      alert(t('❌ Gabim gjatë përditësimit!', '❌ Error updating product!'));
    } finally {
      setLoading(false);
    }
  };

  // Fshin një produkt
  const handleDelete = async (id) => {
    if (window.confirm(t('A jeni të sigurt që dëshironi ta fshini këtë produkt?', 'Are you sure you want to delete this product?'))) {
      try {
        await axios.delete(`https://merrbio-backend.onrender.com/products/${id}`);
        alert(t('✅ Produkti u fshi me sukses!', '✅ Product deleted successfully!'));
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error('Gabim gjatë fshirjes:', err);
        alert(t('❌ Gabim gjatë fshirjes së produktit!', '❌ Error deleting product!'));
      }
    }
  };

  return (
    <div className="farmer-product-section">
      <h2>{t('Produktet e mia', 'My Products')}</h2>

      {/* Mesazh nëse lista është bosh */}
      {products.length === 0 && (
        <p>{t('Nuk keni asnjë produkt të regjistruar.', 'You have no registered products.')}</p>
      )}

      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            {editingId === p.id ? (
              <>
                <input
                  name="emri"
                  value={editedProduct.emri}
                  onChange={handleInputChange}
                  placeholder={t('Emri', 'Name')}
                />
                <textarea
                  name="pershkrimi"
                  value={editedProduct.pershkrimi}
                  onChange={handleInputChange}
                  placeholder={t('Përshkrimi', 'Description')}
                />
                <input
                  name="cmimi"
                  type="number"
                  value={editedProduct.cmimi}
                  onChange={handleInputChange}
                  placeholder={t('Çmimi', 'Price')}
                />
                <input
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                />
                {editedProduct.preview && (
                  <img
                    src={editedProduct.preview}
                    alt="Preview"
                    className="product-image"
                  />
                )}
                <div>
                  <button onClick={handleSave} disabled={loading}>
                    {loading ? t('Duke ruajtur...', 'Saving...') : t('Ruaj Ndryshimet', 'Save Changes')}
                  </button>
                  <button onClick={() => setEditingId(null)} style={{ marginLeft: '10px' }}>
                    {t('Anulo', 'Cancel')}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{p.emri}</h3>
                <p>{p.pershkrimi}</p>
                <p>{p.cmimi} lek</p>
                {p.image && (
                  <img
                    src={p.image}
                    alt="foto"
                    className="product-image"
                  />
                )}
                <div>
                  <button onClick={() => handleEditClick(p)}>
                    {t('Ndrysho', 'Edit')}
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ marginLeft: '10px' }}>
                    {t('Fshi', 'Delete')}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FarmerProductManager;
