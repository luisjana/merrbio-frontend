import axios from 'axios';

export const handleOrder = async (productId, lang) => {
  const t = (sq, en) => (lang === 'sq' ? sq : en);

  const name = prompt(t('Shkruaj emrin tënd:', 'Enter your name:'))?.trim();
  const contact = prompt(t('Shkruaj numrin e kontaktit:', 'Enter your contact number:'))?.trim();

  if (!name || name.length < 3) {
    alert(t('Emri duhet të ketë të paktën 3 shkronja.', 'Name must be at least 3 characters.'));
    return;
  }
  if (!contact || contact.length < 6) {
    alert(t('Numri i kontaktit duhet të ketë të paktën 6 shifra.', 'Contact number must be at least 6 digits.'));
    return;
  }

  try {
    await axios.post('https://merrbio-backend.onrender.com/orders', {
      productId,
      buyerName: name,
      buyerContact: contact,
    });
    alert(t('✅ Kërkesa u dërgua me sukses!', '✅ Request sent successfully!'));
  } catch (err) {
    console.error('Gabim gjatë dërgimit të kërkesës:', err);
    alert(
      t(
        '❌ Gabim gjatë dërgimit të kërkesës. Ju lutem kontrolloni lidhjen ose provoni përsëri më vonë.',
        '❌ Error sending request. Please check your connection or try again later.'
      )
    );
  }
};
