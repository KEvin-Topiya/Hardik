const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = '/api';

export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Failed to place order');
  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return response.json();
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to upload image');
  return response.json();
};

export const getHeroImages = async () => {
  const response = await fetch(`${API_BASE_URL}/hero-images`);
  if (!response.ok) throw new Error('Failed to fetch hero images');
  return response.json();
};

export const addHeroImage = async (imageUrl) => {
  const response = await fetch(`${API_BASE_URL}/hero-images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!response.ok) throw new Error('Failed to add hero image');
  return response.json();
};

export const deleteHeroImage = async (id) => {
  const response = await fetch(`${API_BASE_URL}/hero-images/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete hero image');
  return response.json();
};
