import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FarmerProductManager.css'; // Nëse ke stilizime

function FarmerProductManager({ lang, refresh }) {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ emri: '', pershkrimi: '', cmimi: '', image: null, preview: null });

  const username = localStorage.getItem('username');

  const t = (sq, en) => (lang === 'sq' ? sq : en);

  useEffect(() => {
    axios.get('https://merrbio-backend.onrender.com/products')
      .then(res => {
        const allProducts = res.data;
        const myProducts = allProducts.filter(p => p.fermeri === username);
        setProducts(myProducts);
      })
      .catch(err => console.error('Gabim gjatë marrjes së produkteve:', err));
  }, [username, refresh]);

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product, image: null, preview: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditedProduct(prev => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file)
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('emri', editedProduct.emri);
      formData.append('pershkrimi', editedProduct.pershkrimi);
      formData.append('cmimi', editedProduct.cmimi);
      if (editedProduct.image) formData.append('image', editedProduct.image);

      await axios.put(`https://merrbio-backend.onrender.com/products/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert(t('Produkti u përditësua!', 'Product updated!'));
      setEditingId(null);
    } catch (err) {
      console.error('Gabim gjatë përditësimit:', err);
      alert(t('Gabim gjatë përditësimit!', 'Error updating product!'));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('A jeni të sigurt që dëshironi ta fshini këtë produkt?', 'Are you sure you want to delete this product?'))) {
      try {
        await axios.delete(`https://merrbio-backend.onrender.com/products/${id}`);
        alert(t('Produkti u fshi me sukses!', 'Product deleted successfully!'));
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error('Gabim gjatë fshirjes:', err);
        alert(t('Gabim gjatë fshirjes së produktit!', 'Error deleting product!'));
      }
    }
  };

  return (
    <div>
      <h2>{t('Produktet e mia', 'My Products')}</h2>
      <div className="product-list">
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
                    style={{ width: '100px', marginTop: '10px', borderRadius: '8px' }}
                  />
                )}
                <div style={{ marginTop: '10px' }}>
                  <button onClick={handleSave}>{t('Ruaj Ndryshimet', 'Save Changes')}</button>
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
                    src={`https://merrbio-backend.onrender.com${p.image}`}
                    alt="foto"
                    style={{ width: '100px', marginTop: '10px', borderRadius: '8px' }}
                  />
                )}
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => handleEditClick(p)}>{t('Ndrysho', 'Edit')}</button>
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
