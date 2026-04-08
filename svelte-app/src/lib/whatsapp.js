export const sendWhatsAppOrder = (cartItems, total, customerName = 'Guest') => {
  const WHATSAPP_NUMBER = '911234567890'; // User should change this to their number

  let message = `*NEW ORDER - AARTI ABHUSHAN*\n\n`;
  message += `👤 *Customer*: ${customerName}\n\n`;
  message += `📦 *Order details*:\n`;

  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.name}* x ${item.quantity}\n`;
    message += `   _Price: $${(item.price * item.quantity).toLocaleString()}_\n`;
  });

  message += `\n💰 *Total Amount*: $${total.toLocaleString()}\n\n`;
  message += `Please confirm my order and let me know the payment options.`;

  const encodedMsg = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

  window.open(url, '_blank');
};
