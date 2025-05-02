import axios from 'axios';

export const handleOrder = async (productId, lang) => {
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  const name = prompt(t('Shkruaj emrin tënd:', 'Enter your name:'));
  const contact = prompt(t('Shkruaj numrin e kontaktit:', 'Enter your contact number:'));
  
  if (!name || !contact) {
    alert(t('Emri dhe kontakti janë të detyrueshëm.', 'Name and contact are required.'));
    return;
  }

  try {
    await axios.post('https://merrbio-backend.onrender.com/orders', {
      productId,
      buyerName: name,
      buyerContact: contact,
    });
    alert(t('Kërkesa u dërgua me sukses!', 'Request sent successfully!'));
  } catch (err) {
    console.error(err);
    alert(t('Gabim gjatë dërgimit të kërkesës.', 'Error sending request.'));
  }
};
