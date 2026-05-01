export const sendWhatsAppOrder = (cartItems, total, customerName = 'Guest', customerPhone = '', customerAddress = '') => {
  const WHATSAPP_NUMBER = '919586652965';

  let message = `*AARTI ABHUSHAN - ORDER REQUEST*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `Customer: ${customerName}\n`;
  if (customerPhone) message += `Phone: ${customerPhone}\n`;
  if (customerAddress) message += `Address: ${customerAddress}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  cartItems.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Ref ID: FR-00${item.id}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Subtotal: ₹${(item.price * item.quantity).toLocaleString()}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `*Total Order Value: ₹${total.toLocaleString()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `Please confirm my order request. Thank you.`;
  message += `\n (add your some details here like name,email,etc) `;

  const encodedMsg = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

  window.open(url, '_blank');
};
