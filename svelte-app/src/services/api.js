const API_BASE_URL = 'http://localhost:8080/api';
export const IMAGE_BASE_URL = 'http://localhost:8080/uploads';
// const API_BASE_URL = '/api';

export const getProducts = async (signal) => {
  const response = await fetch(`${API_BASE_URL}/products`, { signal });
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProduct = async (id, signal) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, { signal });
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const createOrder = async (orderData, signal) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
    signal
  });
  if (!response.ok) throw new Error('Failed to place order');
  return response.json();
};

export const createProduct = async (productData, signal) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
    signal
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const updateProduct = async (id, productData, signal) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
    signal
  });
  if (!response.ok) throw new Error('Failed to update product');
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const deleteProduct = async (id, signal) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    signal
  });
  if (!response.ok) throw new Error('Failed to delete product');
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

export const uploadImage = async (file, signal) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
    signal
  });
  if (!response.ok) throw new Error('Failed to upload image');
  const result = await response.json();
  return result.filename;
};

export const getHeroImages = async (signal) => {
  const response = await fetch(`${API_BASE_URL}/hero-images`, { signal });
  if (!response.ok) throw new Error('Failed to fetch hero images');
  return response.json();
};

export const addHeroImage = async (imageUrl, signal) => {
  const response = await fetch(`${API_BASE_URL}/hero-images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
    signal
  });
  if (!response.ok) throw new Error('Failed to add hero image');
  return response.json();
};

export const deleteHeroImage = async (id, signal) => {
  const response = await fetch(`${API_BASE_URL}/hero-images/${id}`, {
    method: 'DELETE',
    signal
  });
  if (!response.ok) throw new Error('Failed to delete hero image');
  return response.json();
};

export const getTrendingProducts = async (signal) => {
  const response = await fetch(`${API_BASE_URL}/products/trending`, { signal });
  if (!response.ok) throw new Error('Failed to fetch trending products');
  return response.json();
};

export const getNewProducts = async (signal) => {
  const response = await fetch(`${API_BASE_URL}/products/new`, { signal });
  if (!response.ok) throw new Error('Failed to fetch new products');
  return response.json();
};

export const trackWhatsAppClick = async (productId, signal) => {
  const response = await fetch(`${API_BASE_URL}/track-whatsapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId }),
    signal
  });
  return response.ok;
};

export const getOrders = async (signal) => {
  const response = await fetch(`${API_BASE_URL}/orders`, { signal });
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export const trackOrders = async (phone) => {
  const response = await fetch(`${API_BASE_URL}/orders/track?phone=${encodeURIComponent(phone)}`);
  if (!response.ok) throw new Error('Failed to track orders');
  return response.json();
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return response.ok;
};

export function getImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${IMAGE_BASE_URL}/${imagePath}`;
}
