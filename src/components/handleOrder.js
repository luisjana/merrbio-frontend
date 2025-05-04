import axios from 'axios';

export const handleOrder = async (productId, lang) => {
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  const name = prompt(t('Shkruaj emrin tënd:', 'Enter your name:'))?.trim();
  const contact = prompt(t('Shkruaj numrin e kontaktit:', 'Enter your contact number:'))?.trim();

  if (!name || name.length < 3) {
    alert(t('Emri duhet të ketë ≥3 shkronja.', 'Name must be ≥3 characters.'));
    return false;
  }
  if (!contact || contact.length < 6) {
    alert(t('Numri duhet të ketë ≥6 shifra.', 'Contact must be ≥6 digits.'));
    return false;
  }

  try {
    await axios.post('https://merrbio-backend.onrender.com/orders', {
      productId,
      buyerName: name,
      buyerContact: contact,
    });
    alert(t('✅ Kërkesa u dërgua me sukses!', '✅ Request sent successfully!'));
    return true;
  } catch (err) {
    console.error(err);
    alert(
      t('❌ Gabim gjatë dërgimit të kërkesës.', '❌ Error sending request.') +
        ' ' +
        (err.response?.data?.message || err.message)
    );
    return false;
  }
};
