import axios from 'axios';

export const handleOrder = async (productId) => {
  const name = prompt('Shkruaj emrin tënd:');
  const contact = prompt('Shkruaj numrin e kontaktit:');
  if (!name || !contact) {
    alert('Emri dhe kontakti janë të detyrueshëm.');
    return;
  }

  try {
    await axios.post('https://merrbio-backend.onrender.com/orders', {
      productId,
      buyerName: name,
      buyerContact: contact,
    });
    alert('Kërkesa u dërgua me sukses!');
  } catch (err) {
    console.error(err);
    alert('Gabim gjatë dërgimit të kërkesës.');
  }
};
